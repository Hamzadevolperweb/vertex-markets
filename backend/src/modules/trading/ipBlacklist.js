const { withPg } = require('../../config/postgres');

async function isIpBlocked(ip) {
  if (!ip) return false;
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select 1 from ip_blacklist where host(ip)::text = $1 or ip = $1::inet limit 1`,
      [String(ip).replace('::ffff:', '')],
    );
    return rows.length > 0;
  });
}

async function listBlockedIps() {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `select id, host(ip) as ip, reason, created_by, created_at from ip_blacklist order by created_at desc`,
    );
    return rows;
  });
}

async function blockIp(ip, { reason = '', createdBy = null } = {}) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      `insert into ip_blacklist (ip, reason, created_by)
       values ($1::inet, $2, $3)
       on conflict (ip) do update set reason = excluded.reason
       returning id, host(ip) as ip, reason, created_by, created_at`,
      [ip, reason, createdBy],
    );
    return rows[0];
  });
}

async function unblockIp(id) {
  return withPg(async (client) => {
    await client.query(`delete from ip_blacklist where id = $1`, [id]);
  });
}

function ipBlacklistMiddleware() {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress;
      if (await isIpBlocked(ip)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied from this network',
        });
      }
      return next();
    } catch {
      return next();
    }
  };
}

module.exports = {
  isIpBlocked,
  listBlockedIps,
  blockIp,
  unblockIp,
  ipBlacklistMiddleware,
};
