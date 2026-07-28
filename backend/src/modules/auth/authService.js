const bcrypt = require('bcryptjs');

const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  setEmailVerified,
  setPasswordHash,
  storeRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  createEmailVerificationToken,
  consumeEmailVerificationTokenByToken,
  createPasswordResetToken,
  consumePasswordResetTokenByToken,
} = require('./authRepository');


const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require('./tokenService');

const { UnauthorizedError, BadRequestError } = require('../../middleware/error/customErrors');

const tokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';

function nowPlusMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

async function register({ email, password, profile }) {
  const { Roles } = require('../../constants/roles');
  const { sendVerificationEmail } = require('../../infrastructure/email');
  // Public registration always creates Customer accounts (never elevate role from body).
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ email, passwordHash, profile, role: Roles.Customer });

  try {
    const { ensureTradingProfile } = require('../trading/walletService');
    const { isPostgresConfigured } = require('../../config/postgres');
    if (isPostgresConfigured()) {
      await ensureTradingProfile({
        userId: user.id,
        email: user.email,
        displayName: [profile?.firstName, profile?.lastName].filter(Boolean).join(' '),
        phone: profile?.phone || '',
        role: user.role,
        referredBy: profile?.referredBy || null,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[trading] profile bootstrap failed', err.message);
  }

  const verification = await createEmailVerificationTokenForUser(user.id);
  try {
    await sendVerificationEmail({ to: email, token: verification.token });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] verification send failed', err.message);
  }

  const payload = { user };
  if (process.env.NODE_ENV !== 'production') {
    payload.verificationToken = verification.token;
  }
  return payload;
}

async function createEmailVerificationTokenForUser(userId) {
  const { createEmailVerificationToken } = require('./authRepository');
  const token = `ev_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  const expiresAt = nowPlusMinutes(Number(process.env.EMAIL_VERIFICATION_EXPIRES_MINUTES || 60 * 24));
  return createEmailVerificationToken({ userId, token, expiresAt });
}

async function login({ email, password }) {
  const user = await getUserByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Invalid credentials');

  try {
    const { ensureTradingProfile } = require('../trading/walletService');
    const { isPostgresConfigured } = require('../../config/postgres');
    if (isPostgresConfigured()) {
      await ensureTradingProfile({
        userId: user.id,
        email: user.email,
        displayName: [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' '),
        phone: user.profile?.phone || '',
        role: user.role,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[trading] profile bootstrap failed', err.message);
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refresh = signRefreshToken({ userId: user.id, role: user.role, rotationVersion: user.refreshRotationVersion || 0 });

  await storeRefreshToken({
    tokenId: refresh.tokenId,
    userId: user.id,
    token: refresh.token,
    expiresAt: nowPlusMinutes(Number(process.env.JWT_REFRESH_EXPIRES_MINUTES || 30 * 24 * 60)),
    rotationVersion: user.refreshRotationVersion || 0,
  });

  return { user, accessToken, refreshToken: refresh.token };
}

async function logout({ refreshToken }) {
  if (!refreshToken) return { ok: true };
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return { ok: true };
  }

  const tid = payload.tid;
  await revokeRefreshToken(tid);
  return { ok: true };
}

async function refresh({ refreshToken }) {
  if (!refreshToken) throw new UnauthorizedError('Missing refresh token');

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const tid = payload.tid;
  const stored = await getRefreshToken(tid);
  if (!stored || stored.revoked) throw new UnauthorizedError('Refresh token revoked');
  if (new Date(stored.expiresAt).getTime() < Date.now()) throw new UnauthorizedError('Refresh token expired');

  // Rotate: revoke old, issue new
  await revokeRefreshToken(tid);

  const user = await getUserById(stored.userId);
  if (!user) throw new UnauthorizedError('User not found');

  const nextRotation = (stored.rotationVersion || 0) + 1;

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshNext = signRefreshToken({ userId: user.id, role: user.role, rotationVersion: nextRotation });

  await storeRefreshToken({
    tokenId: refreshNext.tokenId,
    userId: user.id,
    token: refreshNext.token,
    expiresAt: nowPlusMinutes(Number(process.env.JWT_REFRESH_EXPIRES_MINUTES || 30 * 24 * 60)),
    rotationVersion: nextRotation,
  });

  return { accessToken, refreshToken: refreshNext.token };
}

async function forgotPassword({ email }) {
  const { sendPasswordResetEmail } = require('../../infrastructure/email');
  const user = await getUserByEmail(email);
  if (!user) {
    // Do not leak
    return { ok: true };
  }

  const token = `rp_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  const expiresAt = nowPlusMinutes(Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES || 60));

  await createPasswordResetToken({
    userId: user.id,
    token,
    expiresAt,
  });

  try {
    await sendPasswordResetEmail({ to: email, token });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] password reset send failed', err.message);
  }

  const payload = { ok: true };
  if (process.env.NODE_ENV !== 'production') {
    payload.resetToken = token;
  }
  return payload;
}

async function resetPassword({ token, newPassword }) {
  const entry = await consumePasswordResetTokenByToken(token);
  if (!entry) throw new BadRequestError('Invalid or expired reset token');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await setPasswordHash(entry.userId, passwordHash);

  // revoke all refresh tokens for security
  await revokeAllUserRefreshTokens(entry.userId);
  return { ok: true };
}

async function verifyEmail({ token }) {
  const entry = await consumeEmailVerificationTokenByToken(token);
  if (!entry) throw new BadRequestError('Invalid or expired verification token');

  await setEmailVerified(entry.userId);
  return { ok: true };
}

async function changePassword({ accessToken, oldPassword, newPassword }) {
  const payload = verifyAccessToken(accessToken);
  const user = await getUserById(payload.sub);
  if (!user) throw new UnauthorizedError('User not found');

  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Old password incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await setPasswordHash(user.id, passwordHash);
  await revokeAllUserRefreshTokens(user.id);

  return { ok: true };
}

async function updateProfile({ accessToken, profile }) {
  const payload = verifyAccessToken(accessToken);
  const user = await getUserById(payload.sub);
  if (!user) throw new UnauthorizedError('User not found');

  const updated = await updateUser(user.id, { profile });
  return updated;
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  updateProfile,
};

