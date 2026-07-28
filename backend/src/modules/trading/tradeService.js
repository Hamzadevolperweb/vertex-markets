const { withPg } = require('../../config/postgres');
const { toNum } = require('./walletService');
const marketDataService = require('../marketData/marketDataService');

function baseSymbol(symbol) {
  return String(symbol || '').toUpperCase().replace(/_OTC$/, '');
}

async function listAssets({ includeInactive = false } = {}) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      includeInactive
        ? 'select * from trading_assets order by category, symbol'
        : 'select * from trading_assets where active = true order by category, symbol',
    );
    return rows.map((r) => ({
      ...r,
      payoutPercent: toNum(r.payout_percent),
      minAmount: toNum(r.min_amount),
      maxAmount: toNum(r.max_amount),
      expiryOptionsSec: r.expiry_options_sec || [60, 180, 300],
    }));
  });
}

async function getAssetBySymbol(symbol) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      'select * from trading_assets where symbol = $1 and active = true',
      [String(symbol).toUpperCase()],
    );
    return rows[0] || null;
  });
}

async function getCurrentPrice(symbol) {
  try {
    const quote = await marketDataService.getQuote(baseSymbol(symbol));
    if (quote?.price) return toNum(quote.price);
  } catch {
    // fall through to synthetic
  }
  // Deterministic synthetic price for OTC / offline demos
  const seed = [...baseSymbol(symbol)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const wobble = Math.sin(Date.now() / 1000 + seed) * 0.0008;
  const base = 1 + (seed % 100) / 1000;
  return Number((base + wobble).toFixed(5));
}

async function placeTrade({
  userId,
  symbol,
  direction,
  amount,
  expirySeconds,
}) {
  const dir = String(direction || '').toUpperCase();
  if (!['UP', 'DOWN'].includes(dir)) {
    throw Object.assign(new Error('direction must be UP or DOWN'), { code: 'BAD_DIRECTION' });
  }

  const asset = await getAssetBySymbol(symbol);
  if (!asset) {
    throw Object.assign(new Error('Asset not available'), { code: 'NO_ASSET' });
  }

  const amt = toNum(amount);
  const minA = toNum(asset.min_amount);
  const maxA = toNum(asset.max_amount);
  if (amt < minA || amt > maxA) {
    throw Object.assign(new Error(`Amount must be between ${minA} and ${maxA}`), {
      code: 'BAD_AMOUNT',
    });
  }

  const options = asset.expiry_options_sec || [60, 180, 300];
  const expiry = Number(expirySeconds);
  if (!options.includes(expiry)) {
    throw Object.assign(new Error(`Invalid expiry. Allowed: ${options.join(',')}`), {
      code: 'BAD_EXPIRY',
    });
  }

  const entryPrice = await getCurrentPrice(asset.symbol);
  const payoutPercent = toNum(asset.payout_percent);

  return withPg(async (client) => {
    await client.query('begin');
    try {
      const walletRes = await client.query(
        `select * from wallets where user_id = $1 for update`,
        [userId],
      );
      const wallet = walletRes.rows[0];
      if (!wallet) throw Object.assign(new Error('Wallet not found'), { code: 'NO_WALLET' });
      if (toNum(wallet.balance) < amt) {
        throw Object.assign(new Error('Insufficient balance'), { code: 'INSUFFICIENT' });
      }

      const updatedWallet = await client.query(
        `update wallets
         set balance = balance - $2,
             locked_balance = locked_balance + $2,
             updated_at = now()
         where user_id = $1
         returning *`,
        [userId, amt],
      );

      const expiresAt = new Date(Date.now() + expiry * 1000);
      const trade = await client.query(
        `insert into trades
          (user_id, asset_id, symbol, direction, amount, payout_percent,
           entry_price, expiry_seconds, expires_at, status)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'OPEN')
         returning *`,
        [
          userId,
          asset.id,
          asset.symbol,
          dir,
          amt,
          payoutPercent,
          entryPrice,
          expiry,
          expiresAt.toISOString(),
        ],
      );

      await client.query(
        `insert into ledger_transactions
          (user_id, type, amount, balance_after, reference_id, status, meta)
         values ($1,'TRADE_LOCK',$2,$3,$4,'COMPLETED',$5::jsonb)`,
        [
          userId,
          -amt,
          updatedWallet.rows[0].balance,
          trade.rows[0].id,
          JSON.stringify({ symbol: asset.symbol, direction: dir }),
        ],
      );

      await client.query(
        `insert into notifications (user_id, type, title, message, meta)
         values ($1,'TRADE','Trade opened',$2,$3::jsonb)`,
        [
          userId,
          `${dir} ${asset.symbol} · $${amt} · ${expiry}s`,
          JSON.stringify({ tradeId: trade.rows[0].id }),
        ],
      );

      await client.query('commit');
      return mapTrade(trade.rows[0]);
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

function mapTrade(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    assetId: row.asset_id,
    symbol: row.symbol,
    direction: row.direction,
    amount: toNum(row.amount),
    payoutPercent: toNum(row.payout_percent),
    entryPrice: toNum(row.entry_price),
    exitPrice: row.exit_price == null ? null : toNum(row.exit_price),
    expirySeconds: row.expiry_seconds,
    openedAt: row.opened_at,
    expiresAt: row.expires_at,
    settledAt: row.settled_at,
    status: row.status,
    payoutAmount: toNum(row.payout_amount),
    result: row.result,
  };
}

async function listTrades(userId, { status, limit = 50, offset = 0 } = {}) {
  return withPg(async (client) => {
    const params = [userId];
    let sql = 'select * from trades where user_id = $1';
    if (status) {
      params.push(status);
      sql += ` and status = $${params.length}`;
    }
    params.push(limit, offset);
    sql += ` order by created_at desc limit $${params.length - 1} offset $${params.length}`;
    const { rows } = await client.query(sql, params);
    return rows.map(mapTrade);
  });
}

async function getTrade(userId, tradeId) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      'select * from trades where id = $1 and user_id = $2',
      [tradeId, userId],
    );
    return mapTrade(rows[0]);
  });
}

async function settleTradeRow(client, trade) {
  const exitPrice = await getCurrentPrice(trade.symbol);
  const entry = toNum(trade.entry_price);
  const movedUp = exitPrice >= entry;
  const won =
    (trade.direction === 'UP' && movedUp) || (trade.direction === 'DOWN' && !movedUp);

  const amount = toNum(trade.amount);
  const payoutPercent = toNum(trade.payout_percent);
  const profit = won ? Number(((amount * payoutPercent) / 100).toFixed(2)) : 0;
  const credit = won ? amount + profit : 0;

  // Release lock
  await client.query(
    `update wallets set locked_balance = locked_balance - $2, updated_at = now()
     where user_id = $1`,
    [trade.user_id, amount],
  );

  let wallet;
  if (won) {
    wallet = await client.query(
      `update wallets set balance = balance + $2, updated_at = now()
       where user_id = $1 returning *`,
      [trade.user_id, credit],
    );
    await client.query(
      `insert into ledger_transactions
        (user_id, type, amount, balance_after, reference_id, status, meta)
       values ($1,'TRADE_SETTLEMENT',$2,$3,$4,'COMPLETED',$5::jsonb)`,
      [
        trade.user_id,
        credit,
        wallet.rows[0].balance,
        trade.id,
        JSON.stringify({ result: 'WON', exitPrice, profit }),
      ],
    );
  } else {
    wallet = await client.query(`select * from wallets where user_id = $1`, [trade.user_id]);
    await client.query(
      `insert into ledger_transactions
        (user_id, type, amount, balance_after, reference_id, status, meta)
       values ($1,'TRADE_SETTLEMENT',$2,$3,$4,'COMPLETED',$5::jsonb)`,
      [
        trade.user_id,
        0,
        wallet.rows[0].balance,
        trade.id,
        JSON.stringify({ result: 'LOST', exitPrice }),
      ],
    );
  }

  const updated = await client.query(
    `update trades
     set status = $2, exit_price = $3, payout_amount = $4, result = $5,
         settled_at = now()
     where id = $1
     returning *`,
    [trade.id, won ? 'WON' : 'LOST', exitPrice, profit, won ? 'WON' : 'LOST'],
  );

  await client.query(
    `insert into notifications (user_id, type, title, message, meta)
     values ($1,'TRADE',$2,$3,$4::jsonb)`,
    [
      trade.user_id,
      won ? 'Trade won' : 'Trade lost',
      won
        ? `${trade.symbol} paid $${profit.toFixed(2)} profit`
        : `${trade.symbol} expired out of the money`,
      JSON.stringify({ tradeId: trade.id, result: won ? 'WON' : 'LOST' }),
    ],
  );

  return mapTrade(updated.rows[0]);
}

async function settleDueTrades() {
  const due = await withPg(async (client) => {
    const { rows } = await client.query(
      `select id from trades
       where status = 'OPEN' and expires_at <= now()
       order by expires_at asc
       limit 50`,
    );
    return rows.map((r) => r.id);
  });

  const settled = [];
  for (const id of due) {
    try {
      const result = await withPg(async (client) => {
        await client.query('begin');
        try {
          const { rows } = await client.query(
            `select * from trades where id = $1 and status = 'OPEN' for update`,
            [id],
          );
          if (!rows[0]) {
            await client.query('rollback');
            return null;
          }
          const mapped = await settleTradeRow(client, rows[0]);
          await client.query('commit');
          return mapped;
        } catch (err) {
          await client.query('rollback');
          throw err;
        }
      });
      if (result) settled.push(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[settle] failed', id, err.message);
    }
  }
  return settled;
}

async function getTradingStats(userId) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select
         count(*) filter (where status in ('WON','LOST')) as closed,
         count(*) filter (where status = 'WON') as wins,
         count(*) filter (where status = 'LOST') as losses,
         count(*) filter (where status = 'OPEN') as open,
         coalesce(sum(payout_amount) filter (where status = 'WON'),0) as total_profit,
         coalesce(sum(amount) filter (where status = 'LOST'),0) as total_lost
       from trades where user_id = $1`,
      [userId],
    );
    const s = rows[0] || {};
    const closed = toNum(s.closed);
    const wins = toNum(s.wins);
    return {
      closed,
      wins,
      losses: toNum(s.losses),
      open: toNum(s.open),
      winRate: closed ? Number(((wins / closed) * 100).toFixed(2)) : 0,
      totalProfit: toNum(s.total_profit),
      totalLost: toNum(s.total_lost),
    };
  });
}

async function forceSettleTrade(tradeId, { forceResult } = {}) {
  return withPg(async (client) => {
    await client.query('begin');
    try {
      const { rows } = await client.query(
        `select * from trades where id = $1 and status = 'OPEN' for update`,
        [tradeId],
      );
      if (!rows[0]) {
        await client.query('rollback');
        throw Object.assign(new Error('Open trade not found'), { code: 'NOT_FOUND' });
      }

      // Optionally bias exit price for admin manipulation tools
      if (forceResult === 'WON' || forceResult === 'LOST') {
        const entry = toNum(rows[0].entry_price);
        const exit =
          forceResult === 'WON'
            ? rows[0].direction === 'UP'
              ? entry * 1.001
              : entry * 0.999
            : rows[0].direction === 'UP'
              ? entry * 0.999
              : entry * 1.001;
        await client.query(`update trades set entry_price = entry_price where id = $1`, [tradeId]);
        // stash desired exit via temporary update of entry comparison by setting a marker in result
        rows[0]._forcedExit = exit;
        rows[0]._forceResult = forceResult;
      }

      const trade = rows[0];
      const exitPrice =
        trade._forcedExit != null ? trade._forcedExit : await getCurrentPrice(trade.symbol);
      const entry = toNum(trade.entry_price);
      let won =
        (trade.direction === 'UP' && exitPrice >= entry) ||
        (trade.direction === 'DOWN' && exitPrice < entry);
      if (trade._forceResult === 'WON') won = true;
      if (trade._forceResult === 'LOST') won = false;

      const amount = toNum(trade.amount);
      const payoutPercent = toNum(trade.payout_percent);
      const profit = won ? Number(((amount * payoutPercent) / 100).toFixed(2)) : 0;
      const credit = won ? amount + profit : 0;

      await client.query(
        `update wallets set locked_balance = locked_balance - $2, updated_at = now()
         where user_id = $1`,
        [trade.user_id, amount],
      );

      let wallet;
      if (won) {
        wallet = await client.query(
          `update wallets set balance = balance + $2, updated_at = now()
           where user_id = $1 returning *`,
          [trade.user_id, credit],
        );
        await client.query(
          `insert into ledger_transactions
            (user_id, type, amount, balance_after, reference_id, status, meta)
           values ($1,'TRADE_SETTLEMENT',$2,$3,$4,'COMPLETED',$5::jsonb)`,
          [
            trade.user_id,
            credit,
            wallet.rows[0].balance,
            trade.id,
            JSON.stringify({ result: 'WON', exitPrice, forced: Boolean(forceResult) }),
          ],
        );
      } else {
        wallet = await client.query(`select * from wallets where user_id = $1`, [trade.user_id]);
        await client.query(
          `insert into ledger_transactions
            (user_id, type, amount, balance_after, reference_id, status, meta)
           values ($1,'TRADE_SETTLEMENT',$2,$3,$4,'COMPLETED',$5::jsonb)`,
          [
            trade.user_id,
            0,
            wallet.rows[0].balance,
            trade.id,
            JSON.stringify({ result: 'LOST', exitPrice, forced: Boolean(forceResult) }),
          ],
        );
      }

      const updated = await client.query(
        `update trades
         set status = $2, exit_price = $3, payout_amount = $4, result = $5, settled_at = now()
         where id = $1 returning *`,
        [trade.id, won ? 'WON' : 'LOST', exitPrice, profit, won ? 'WON' : 'LOST'],
      );

      await client.query('commit');
      return mapTrade(updated.rows[0]);
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function updateAssetPayout(symbol, payoutPercent) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `update trading_assets
       set payout_percent = $2, updated_at = now()
       where symbol = $1
       returning *`,
      [String(symbol).toUpperCase(), payoutPercent],
    );
    return rows[0] || null;
  });
}

async function listOpenTradesAdmin({ limit = 100 } = {}) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select * from trades where status = 'OPEN' order by expires_at asc limit $1`,
      [limit],
    );
    return rows.map(mapTrade);
  });
}

module.exports = {
  listAssets,
  getAssetBySymbol,
  getCurrentPrice,
  placeTrade,
  listTrades,
  getTrade,
  settleDueTrades,
  getTradingStats,
  mapTrade,
  baseSymbol,
  forceSettleTrade,
  updateAssetPayout,
  listOpenTradesAdmin,
};
