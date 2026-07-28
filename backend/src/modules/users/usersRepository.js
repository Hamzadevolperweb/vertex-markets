const { store } = require('../../infrastructure/store');

const USERS = 'users';

function usersCollection() {
  return store.collection(USERS);
}

async function list({ includeDeleted = false } = {}) {
  const col = usersCollection();
  return [...col.values()].filter((u) => (includeDeleted ? true : !u.deletedAt));
}

async function getById(id, { includeDeleted = false } = {}) {
  const u = usersCollection().get(id) || null;
  if (!u) return null;
  if (!includeDeleted && u.deletedAt) return null;
  return u;
}

async function getByEmail(email) {
  const col = usersCollection();
  return [...col.values()].find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function create({ email, passwordHash, role, profile }) {
  // Delegate to auth repository semantics if needed. Here: direct in-memory.
  const existing = await getByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.code = 'EMAIL_IN_USE';
    throw err;
  }

  const id = store.newId('user');
  const now = new Date().toISOString();
  const user = {
    id,
    email,
    passwordHash,
    role,
    verified: true,
    blocked: false,
    deletedAt: null,
    profile: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      avatar: profile?.avatar || null,
    },
    createdAt: now,
    updatedAt: now,
    blockedAt: null,
    roleChangedAt: null,
  };

  usersCollection().set(id, user);
  return user;
}

async function update(id, patch) {
  const col = usersCollection();
  const user = col.get(id);
  if (!user) return null;
  const updated = {
    ...user,
    ...patch,
    profile: patch.profile ? { ...user.profile, ...patch.profile } : user.profile,
    updatedAt: new Date().toISOString(),
  };
  col.set(id, updated);
  return updated;
}

async function softDelete(id) {
  return update(id, { deletedAt: new Date().toISOString() });
}

async function restore(id) {
  return update(id, { deletedAt: null });
}

async function block(id) {
  return update(id, { blocked: true, blockedAt: new Date().toISOString() });
}

async function unblock(id) {
  return update(id, { blocked: false, blockedAt: null });
}

async function changeRole(id, role) {
  return update(id, { role, roleChangedAt: new Date().toISOString() });
}

async function removePassword(id) {
  return update(id, { passwordHash: userCollection().get(id)?.passwordHash });
}

function userCollection() {
  return usersCollection();
}

module.exports = {
  list,
  getById,
  getByEmail,
  create,
  update,
  softDelete,
  restore,
  block,
  unblock,
  changeRole,
};

