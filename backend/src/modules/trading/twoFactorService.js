const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { withPg } = require('../../config/postgres');

async function setup2FA(userId, email) {
  const secret = speakeasy.generateSecret({
    name: `Vertex Markets (${email})`,
    length: 20,
  });

  await withPg(async (client) => {
    await client.query(
      `update trading_profiles
       set two_fa_secret = $2, two_fa_enabled = false, updated_at = now()
       where user_id = $1`,
      [userId, secret.base32],
    );
  });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
  return { secret: secret.base32, otpauthUrl: secret.otpauth_url, qrCodeDataUrl };
}

async function enable2FA(userId, token) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      'select two_fa_secret from trading_profiles where user_id = $1',
      [userId],
    );
    const secret = rows[0]?.two_fa_secret;
    if (!secret) throw Object.assign(new Error('2FA not initialized'), { code: 'NO_SECRET' });

    const ok = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: String(token),
      window: 1,
    });
    if (!ok) throw Object.assign(new Error('Invalid 2FA code'), { code: 'BAD_TOKEN' });

    await client.query(
      `update trading_profiles set two_fa_enabled = true, updated_at = now()
       where user_id = $1`,
      [userId],
    );
    return { enabled: true };
  });
}

async function disable2FA(userId, token) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      'select two_fa_secret, two_fa_enabled from trading_profiles where user_id = $1',
      [userId],
    );
    if (!rows[0]?.two_fa_enabled) return { enabled: false };

    const ok = speakeasy.totp.verify({
      secret: rows[0].two_fa_secret,
      encoding: 'base32',
      token: String(token),
      window: 1,
    });
    if (!ok) throw Object.assign(new Error('Invalid 2FA code'), { code: 'BAD_TOKEN' });

    await client.query(
      `update trading_profiles
       set two_fa_enabled = false, two_fa_secret = null, updated_at = now()
       where user_id = $1`,
      [userId],
    );
    return { enabled: false };
  });
}

async function verify2FA(userId, token) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      'select two_fa_enabled, two_fa_secret from trading_profiles where user_id = $1',
      [userId],
    );
    if (!rows[0]?.two_fa_enabled) return true;
    return speakeasy.totp.verify({
      secret: rows[0].two_fa_secret,
      encoding: 'base32',
      token: String(token),
      window: 1,
    });
  });
}

async function get2FAStatus(userId) {
  return withPg(async (client) => {
    const { rows } = await client.query(
      'select two_fa_enabled from trading_profiles where user_id = $1',
      [userId],
    );
    return { enabled: Boolean(rows[0]?.two_fa_enabled) };
  });
}

module.exports = {
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FA,
  get2FAStatus,
};
