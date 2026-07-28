const jwt = require('jsonwebtoken');
const { store } = require('../../infrastructure/store');

function getEnv(name, fallback) {
  return process.env[name] || fallback;
}

function signAccessToken({ userId, role }) {
  const secret = getEnv('JWT_ACCESS_SECRET', 'dev_access_secret');
  const expiresIn = getEnv('JWT_ACCESS_EXPIRES_IN', '15m');

  return jwt.sign(
    { sub: userId, role },
    secret,
    { expiresIn }
  );
}

function signRefreshToken({ userId, role, rotationVersion }) {
  const secret = getEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret');
  const expiresIn = getEnv('JWT_REFRESH_EXPIRES_IN', '30d');

  const tokenId = store.newId('rTok');
  const token = jwt.sign(
    { sub: userId, role, tid: tokenId, rv: rotationVersion || 0 },
    secret,
    { expiresIn }
  );

  return { tokenId, token };
}

function verifyAccessToken(token) {
  const secret = getEnv('JWT_ACCESS_SECRET', 'dev_access_secret');
  return jwt.verify(token, secret);
}

function verifyRefreshToken(token) {
  const secret = getEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret');
  return jwt.verify(token, secret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

