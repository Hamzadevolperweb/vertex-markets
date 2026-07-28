const { withPg } = require('../../config/postgres');

async function listNotifications(userId, { limit = 30, unreadOnly = false } = {}) {
  return withPg(async (client) => {
    const params = [userId, limit];
    let sql = 'select * from notifications where user_id = $1';
    if (unreadOnly) sql += ' and is_read = false';
    sql += ' order by created_at desc limit $2';
    const { rows } = await client.query(sql, params);
    return rows;
  });
}

async function markRead(userId, id) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `update notifications set is_read = true
       where id = $1 and user_id = $2
       returning *`,
      [id, userId],
    );
    return rows[0] || null;
  });
}

async function markAllRead(userId) {
  return withPg(async (client) => {
    await client.query(
      `update notifications set is_read = true where user_id = $1 and is_read = false`,
      [userId],
    );
  });
}

async function notify(userId, { type, title, message, meta = {} }) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `insert into notifications (user_id, type, title, message, meta)
       values ($1,$2,$3,$4,$5::jsonb) returning *`,
      [userId, type, title, message, JSON.stringify(meta)],
    );
    return rows[0];
  });
}

module.exports = { listNotifications, markRead, markAllRead, notify };
