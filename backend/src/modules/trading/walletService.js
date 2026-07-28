const { withPg } = require('../../config/postgres');

function toNum(v) {
  return Number(v || 0);
}

async function ensureTradingProfile({
  userId,
  email,
  displayName = '',
  phone = '',
  role = 'Customer',
  referredBy = null,
}) {
  return withPg(async (client) => {
    const existing = await client.query(
      'select * from trading_profiles where user_id = $1',
      [userId],
    );
    if (existing.rows[0]) return existing.rows[0];

    const referralCode = `VX${userId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;
    await client.query('begin');
    try {
      const profile = await client.query(
        `insert into trading_profiles
          (user_id, email, display_name, phone, role, referral_code, referred_by)
         values ($1,$2,$3,$4,$5,$6,$7)
         returning *`,
        [userId, email, displayName, phone, role, referralCode, referredBy],
      );

      const settings = await client.query(
        `select value from platform_settings where key = 'wallet'`,
      );
      const starting = toNum(settings.rows[0]?.value?.demoStartingBalance ?? 10000);

      await client.query(
        `insert into wallets (user_id, balance) values ($1, $2)
         on conflict (user_id) do nothing`,
        [userId, starting],
      );

      if (starting > 0) {
        await client.query(
          `insert into ledger_transactions (user_id, type, amount, balance_after, reference_id, meta)
           values ($1, 'BONUS', $2, $2, $3, $4::jsonb)`,
          [userId, starting, 'welcome_bonus', JSON.stringify({ reason: 'demo_starting_balance' })],
        );
      }

      if (referredBy) {
        await client.query(
          `insert into referrals (referrer_id, referred_id, status)
           values ($1, $2, 'PENDING')
           on conflict (referred_id) do nothing`,
          [referredBy, userId],
        );
      }

      await client.query('commit');
      return profile.rows[0];
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function getWallet(userId) {
  return withPg(async (client) => {
    const { rows } = await client.query('select * from wallets where user_id = $1', [userId]);
    return rows[0] || null;
  });
}

async function getWalletSummary(userId) {
  const wallet = await getWallet(userId);
  if (!wallet) return null;
  const balance = toNum(wallet.balance);
  const bonus = toNum(wallet.bonus_balance);
  const locked = toNum(wallet.locked_balance);
  return {
    ...wallet,
    balance,
    bonusBalance: bonus,
    lockedBalance: locked,
    availableBalance: balance,
    totalEquity: balance + bonus + locked,
  };
}

async function listLedger(userId, { limit = 50, offset = 0 } = {}) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select * from ledger_transactions
       where user_id = $1
       order by created_at desc
       limit $2 offset $3`,
      [userId, limit, offset],
    );
    return rows;
  });
}

async function creditDeposit(userId, amount, { method = 'manual', providerRef = null, meta = {} } = {}) {
  return withPg(async (client) => {
    await client.query('begin');
    try {
      const dep = await client.query(
        `insert into deposits (user_id, amount, method, provider_ref, status, meta)
         values ($1,$2,$3,$4,'COMPLETED',$5::jsonb)
         returning *`,
        [userId, amount, method, providerRef, JSON.stringify(meta)],
      );

      const wallet = await client.query(
        `update wallets set balance = balance + $2, updated_at = now()
         where user_id = $1
         returning *`,
        [userId, amount],
      );
      if (!wallet.rows[0]) throw new Error('Wallet not found');

      await client.query(
        `insert into ledger_transactions (user_id, type, amount, balance_after, reference_id, status)
         values ($1,'DEPOSIT',$2,$3,$4,'COMPLETED')`,
        [userId, amount, wallet.rows[0].balance, dep.rows[0].id],
      );

      await client.query('commit');
      return { deposit: dep.rows[0], wallet: wallet.rows[0] };
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function requestWithdrawal(userId, amount, { method = 'bank', accountDetails = {} } = {}) {
  return withPg(async (client) => {
    await client.query('begin');
    try {
      const walletRes = await client.query(
        `select * from wallets where user_id = $1 for update`,
        [userId],
      );
      const wallet = walletRes.rows[0];
      if (!wallet) throw Object.assign(new Error('Wallet not found'), { code: 'NO_WALLET' });
      if (toNum(wallet.balance) < amount) {
        throw Object.assign(new Error('Insufficient balance'), { code: 'INSUFFICIENT' });
      }

      const updated = await client.query(
        `update wallets
         set balance = balance - $2, locked_balance = locked_balance + $2, updated_at = now()
         where user_id = $1
         returning *`,
        [userId, amount],
      );

      const wd = await client.query(
        `insert into withdrawals (user_id, amount, method, account_details, status)
         values ($1,$2,$3,$4::jsonb,'PENDING')
         returning *`,
        [userId, amount, method, JSON.stringify(accountDetails)],
      );

      await client.query(
        `insert into ledger_transactions (user_id, type, amount, balance_after, reference_id, status, meta)
         values ($1,'WITHDRAWAL',$2,$3,$4,'PENDING',$5::jsonb)`,
        [
          userId,
          -amount,
          updated.rows[0].balance,
          wd.rows[0].id,
          JSON.stringify({ locked: true }),
        ],
      );

      await client.query('commit');
      return { withdrawal: wd.rows[0], wallet: updated.rows[0] };
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function resolveWithdrawal(withdrawalId, { approve, adminId }) {
  return withPg(async (client) => {
    await client.query('begin');
    try {
      const { rows } = await client.query(
        `select * from withdrawals where id = $1 for update`,
        [withdrawalId],
      );
      const wd = rows[0];
      if (!wd) throw Object.assign(new Error('Withdrawal not found'), { code: 'NOT_FOUND' });
      if (wd.status !== 'PENDING') {
        throw Object.assign(new Error('Withdrawal already resolved'), { code: 'INVALID_STATE' });
      }

      const amount = toNum(wd.amount);
      if (approve) {
        await client.query(
          `update wallets set locked_balance = locked_balance - $2, updated_at = now()
           where user_id = $1`,
          [wd.user_id, amount],
        );
        await client.query(
          `update withdrawals set status = 'COMPLETED', approved_by = $2, updated_at = now()
           where id = $1`,
          [withdrawalId, adminId],
        );
      } else {
        const wallet = await client.query(
          `update wallets
           set locked_balance = locked_balance - $2, balance = balance + $2, updated_at = now()
           where user_id = $1
           returning *`,
          [wd.user_id, amount],
        );
        await client.query(
          `update withdrawals set status = 'REJECTED', approved_by = $2, updated_at = now()
           where id = $1`,
          [withdrawalId, adminId],
        );
        await client.query(
          `insert into ledger_transactions (user_id, type, amount, balance_after, reference_id, status, meta)
           values ($1,'ADJUSTMENT',$2,$3,$4,'COMPLETED',$5::jsonb)`,
          [
            wd.user_id,
            amount,
            wallet.rows[0].balance,
            withdrawalId,
            JSON.stringify({ reason: 'withdrawal_rejected_refund' }),
          ],
        );
      }

      await client.query('commit');
      return wd;
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function createPendingDeposit(
  userId,
  amount,
  { method = 'card', providerRef = null, meta = {} } = {},
) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `insert into deposits (user_id, amount, method, provider_ref, status, meta)
       values ($1,$2,$3,$4,'PENDING',$5::jsonb)
       returning *`,
      [userId, amount, method, providerRef, JSON.stringify(meta)],
    );
    return rows[0];
  });
}

async function confirmDepositById(depositId, { providerRef = null } = {}) {
  return withPg(async (client) => {
    await client.query('begin');
    try {
      const { rows } = await client.query(
        `select * from deposits where id = $1 for update`,
        [depositId],
      );
      const dep = rows[0];
      if (!dep) throw Object.assign(new Error('Deposit not found'), { code: 'NOT_FOUND' });
      if (dep.status === 'COMPLETED') {
        await client.query('commit');
        return { deposit: dep, alreadyCompleted: true };
      }
      if (dep.status !== 'PENDING') {
        throw Object.assign(new Error('Deposit not pending'), { code: 'INVALID_STATE' });
      }

      const updatedDep = await client.query(
        `update deposits
         set status = 'COMPLETED', provider_ref = coalesce($2, provider_ref), updated_at = now()
         where id = $1
         returning *`,
        [depositId, providerRef],
      );

      const wallet = await client.query(
        `update wallets set balance = balance + $2, updated_at = now()
         where user_id = $1 returning *`,
        [dep.user_id, dep.amount],
      );
      if (!wallet.rows[0]) throw new Error('Wallet not found');

      await client.query(
        `insert into ledger_transactions (user_id, type, amount, balance_after, reference_id, status)
         values ($1,'DEPOSIT',$2,$3,$4,'COMPLETED')`,
        [dep.user_id, dep.amount, wallet.rows[0].balance, depositId],
      );

      await client.query('commit');
      return {
        deposit: updatedDep.rows[0],
        wallet: wallet.rows[0],
        alreadyCompleted: false,
      };
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function listDeposits(userId, { limit = 50 } = {}) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select * from deposits where user_id = $1 order by created_at desc limit $2`,
      [userId, limit],
    );
    return rows;
  });
}

async function listWithdrawals(userId, { limit = 50 } = {}) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select * from withdrawals where user_id = $1 order by created_at desc limit $2`,
      [userId, limit],
    );
    return rows;
  });
}

module.exports = {
  ensureTradingProfile,
  getWallet,
  getWalletSummary,
  listLedger,
  creditDeposit,
  createPendingDeposit,
  confirmDepositById,
  requestWithdrawal,
  resolveWithdrawal,
  listDeposits,
  listWithdrawals,
  toNum,
};
