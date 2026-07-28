const { verifyAccessToken } = require('../../modules/auth/tokenService');
const { UnauthorizedError } = require('../error/customErrors');

function extractBearer(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice('Bearer '.length);
}

const jwtAuth = async (req, res, next) => {
  try {
    const token = extractBearer(req);
    if (!token) throw new UnauthorizedError('Missing access token');

    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      tokenPayload: payload,
    };

    return next();
  } catch (err) {
    return next(new UnauthorizedError(err.message || 'Unauthorized'));
  }
};

module.exports = { jwtAuth };

