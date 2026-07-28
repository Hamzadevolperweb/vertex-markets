const { store } = require('../../infrastructure/store');
const { Roles } = require('../../constants/roles');


// Collections
const USERS = 'users';
const REFRESH_TOKENS = 'refreshTokens';
const EMAIL_TOKENS = 'emailTokens';
const PASSWORD_RESET_TOKENS = 'passwordResetTokens';

function userCollection() {
  return store.collection(USERS);
}
function refreshTokenCollection() {
  return store.collection(REFRESH_TOKENS);
}
function emailTokenCollection() {
  return store.collection(EMAIL_TOKENS);
}
function passwordResetTokenCollection() {
  return store.collection(PASSWORD_RESET_TOKENS);
}

async function createUser({ email, passwordHash, role = Roles.Customer, profile = {} }) {
  const users = userCollection();
  const existing = [...users.values()].find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const err = new Error('Email already in use');
    err.code = 'EMAIL_IN_USE';
    throw err;
  }

  const id = store.newId('user');
  const user = {
    id,
    email,
    passwordHash,
    role,
    verified: false,
    profile: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      avatar: profile.avatar || null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.set(id, user);
  return user;
}

async function getUserByEmail(email) {
  const users = userCollection();
  return [...users.values()].find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function getUserById(id) {
  return userCollection().get(id) || null;
}

async function updateUser(id, patch) {
  const users = userCollection();
  const user = users.get(id);
  if (!user) return null;
  const updated = {
    ...user,
    ...patch,
    profile: patch.profile ? { ...user.profile, ...patch.profile } : user.profile,
    updatedAt: new Date().toISOString(),
  };
  users.set(id, updated);
  return updated;
}

async function setEmailVerified(userId) {
  return updateUser(userId, { verified: true });
}

async function setPasswordHash(userId, passwordHash) {
  return updateUser(userId, { passwordHash });
}

async function storeRefreshToken({ tokenId, userId, token, expiresAt, rotationVersion }) {
  refreshTokenCollection().set(tokenId, {
    tokenId,
    userId,
    token,
    expiresAt,
    revoked: false,
    rotationVersion,
  });
}

async function getRefreshToken(tokenId) {
  return refreshTokenCollection().get(tokenId) || null;
}

async function revokeRefreshToken(tokenId) {
  const tokens = refreshTokenCollection();
  const token = tokens.get(tokenId);
  if (!token) return null;
  const updated = { ...token, revoked: true, revokedAt: new Date().toISOString() };
  tokens.set(tokenId, updated);
  return updated;
}

async function revokeAllUserRefreshTokens(userId) {
  const tokens = refreshTokenCollection();
  for (const [k, v] of tokens.entries()) {
    if (v.userId === userId && !v.revoked) {
      tokens.set(k, { ...v, revoked: true, revokedAt: new Date().toISOString() });
    }
  }
}

async function createEmailVerificationToken({ userId, token, expiresAt }) {
  const emailTokens = emailTokenCollection();
  const tokenId = store.newId('emailTok');
  const record = { tokenId, userId, token, expiresAt, used: false };
  emailTokens.set(tokenId, record);
  return record;
}

async function consumeEmailVerificationTokenByToken(token) {
  const emailTokens = emailTokenCollection();
  const entry = [...emailTokens.values()].find((t) => t.token === token);
  if (!entry) return null;
  if (entry.used) return null;
  if (new Date(entry.expiresAt).getTime() < Date.now()) return null;
  emailTokens.set(entry.tokenId, { ...entry, used: true, usedAt: new Date().toISOString() });
  return entry;
}

async function createPasswordResetToken({ userId, token, expiresAt }) {
  const prt = passwordResetTokenCollection();
  const tokenId = store.newId('resetTok');
  const record = { tokenId, userId, token, expiresAt, used: false };
  prt.set(tokenId, record);
  return record;
}

async function consumePasswordResetTokenByToken(token) {
  const prt = passwordResetTokenCollection();
  const entry = [...prt.values()].find((t) => t.token === token);
  if (!entry) return null;
  if (entry.used) return null;
  if (new Date(entry.expiresAt).getTime() < Date.now()) return null;
  prt.set(entry.tokenId, { ...entry, used: true, usedAt: new Date().toISOString() });
  return entry;
}

module.exports = {
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
};

