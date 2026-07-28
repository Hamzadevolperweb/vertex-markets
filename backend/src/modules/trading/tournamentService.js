const { withPg } = require('../../config/postgres');
const { toNum } = require('./walletService');

async function listTournaments() {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select t.*,
         (select count(*)::int from tournament_entries e where e.tournament_id = t.id) as entrants
       from tournaments t
       order by starts_at asc`,
    );
    return rows.map((r) => ({
      ...r,
      entryFee: toNum(r.entry_fee),
      prizePool: toNum(r.prize_pool),
      entrants: r.entrants,
    }));
  });
}

async function joinTournament(userId, tournamentId) {
  return withPg(async (client) => {
    await client.query('begin');
    try {
      const { rows: tRows } = await client.query(
        `select * from tournaments where id = $1 for update`,
        [tournamentId],
      );
      const t = tRows[0];
      if (!t) throw Object.assign(new Error('Tournament not found'), { code: 'NOT_FOUND' });
      if (!['UPCOMING', 'LIVE'].includes(t.status)) {
        throw Object.assign(new Error('Tournament closed'), { code: 'CLOSED' });
      }

      const fee = toNum(t.entry_fee);
      if (fee > 0) {
        const wallet = await client.query(
          `select * from wallets where user_id = $1 for update`,
          [userId],
        );
        if (!wallet.rows[0] || toNum(wallet.rows[0].balance) < fee) {
          throw Object.assign(new Error('Insufficient balance for entry fee'), {
            code: 'INSUFFICIENT',
          });
        }
        const updated = await client.query(
          `update wallets set balance = balance - $2, updated_at = now()
           where user_id = $1 returning *`,
          [userId, fee],
        );
        await client.query(
          `insert into ledger_transactions
            (user_id, type, amount, balance_after, reference_id, status, meta)
           values ($1,'ADJUSTMENT',$2,$3,$4,'COMPLETED',$5::jsonb)`,
          [
            userId,
            -fee,
            updated.rows[0].balance,
            tournamentId,
            JSON.stringify({ reason: 'tournament_entry' }),
          ],
        );
        await client.query(
          `update tournaments set prize_pool = prize_pool + $2 where id = $1`,
          [tournamentId, fee],
        );
      }

      const entry = await client.query(
        `insert into tournament_entries (tournament_id, user_id)
         values ($1,$2)
         on conflict (tournament_id, user_id) do nothing
         returning *`,
        [tournamentId, userId],
      );

      await client.query('commit');
      return entry.rows[0] || { tournament_id: tournamentId, user_id: userId, alreadyJoined: true };
    } catch (err) {
      await client.query('rollback');
      throw err;
    }
  });
}

async function leaderboard(tournamentId) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select e.*, p.email, p.display_name
       from tournament_entries e
       join trading_profiles p on p.user_id = e.user_id
       where e.tournament_id = $1
       order by e.score desc, e.joined_at asc
       limit 100`,
      [tournamentId],
    );
    return rows;
  });
}

module.exports = { listTournaments, joinTournament, leaderboard };
