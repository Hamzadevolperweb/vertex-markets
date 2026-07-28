const { success, failure } = require('../../utils/response');
const authService = require('./authService');

function getRefreshToken(req) {
  return req.cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken'] || req.body?.refreshToken || req.headers['x-refresh-token'];
}

async function register(req, res, next) {
  try {
    const { user, verificationToken } = await authService.register(req.body);
    return success(res, { status: 201, message: 'Registered successfully', data: { user: { id: user.id, email: user.email }, verificationToken } });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'lax',
      maxAge: Number(process.env.JWT_REFRESH_COOKIE_MAX_AGE_MS || 30 * 24 * 60 * 60 * 1000),
    });

    return success(res, {
      message: 'Login successful',
      data: {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role, verified: user.verified },
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = getRefreshToken(req);
    await authService.logout({ refreshToken });
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken');
    return success(res, { message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = getRefreshToken(req);
    const { accessToken, refreshToken: nextRefresh } = await authService.refresh({ refreshToken });

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken', nextRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'lax',
      maxAge: Number(process.env.JWT_REFRESH_COOKIE_MAX_AGE_MS || 30 * 24 * 60 * 60 * 1000),
    });

    return success(res, { data: { accessToken } });
  } catch (err) {
    return next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body);
    return success(res, { message: 'If the email exists, reset instructions will be sent', data: result });
  } catch (err) {
    return next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body);
    return success(res, { message: 'Password reset successful' });
  } catch (err) {
    return next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    await authService.verifyEmail(req.body);
    return success(res, { message: 'Email verified successfully' });
  } catch (err) {
    return next(err);
  }
}

function extractAccessToken(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice('Bearer '.length);
  return req.body.accessToken;
}

async function changePassword(req, res, next) {
  try {
    const accessToken = extractAccessToken(req);
    await authService.changePassword({ accessToken, oldPassword: req.body.oldPassword, newPassword: req.body.newPassword });
    return success(res, { message: 'Password changed successfully' });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const accessToken = extractAccessToken(req);
    const updated = await authService.updateProfile({ accessToken, profile: req.body });
    return success(res, { message: 'Profile updated successfully', data: updated });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  updateProfile,
};

