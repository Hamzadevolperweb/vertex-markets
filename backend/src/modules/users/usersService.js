const bcrypt = require('bcryptjs');
const {
  list,
  getById,
  create,
  update,
  softDelete,
  restore,
  block,
  unblock,
  changeRole,
} = require('./usersRepository');

const { BadRequestError, NotFoundError, ForbiddenError } = require('../../middleware/error/customErrors');
const { Roles } = require('../../constants/roles');

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

function canAdminManage(targetUser, reqAuth) {
  return reqAuth?.role === Roles.Admin;
}

async function adminListUsers() {
  const users = await list();
  return users.map(sanitizeUser);
}

async function adminGetUser(id) {
  const u = await getById(id);
  if (!u) throw new NotFoundError('User not found');
  return sanitizeUser(u);
}

async function adminUpdateUser(id, patch) {
  const updated = await update(id, patch);
  if (!updated) throw new NotFoundError('User not found');
  return sanitizeUser(updated);
}

async function adminDeleteUser(id) {
  const updated = await softDelete(id);
  if (!updated) throw new NotFoundError('User not found');
  return sanitizeUser(updated);
}

async function adminBlockUser(id) {
  const updated = await block(id);
  if (!updated) throw new NotFoundError('User not found');
  return sanitizeUser(updated);
}

async function adminUnblockUser(id) {
  const updated = await unblock(id);
  if (!updated) throw new NotFoundError('User not found');
  return sanitizeUser(updated);
}

async function adminChangeRole(id, role) {
  if (![Roles.Admin, Roles.Customer].includes(role)) throw new BadRequestError('Invalid role');
  const updated = await changeRole(id, role);
  if (!updated) throw new NotFoundError('User not found');
  return sanitizeUser(updated);
}

async function adminRestoreUser(id) {
  const updated = await restore(id);
  if (!updated) throw new NotFoundError('User not found');
  return sanitizeUser(updated);
}

async function selfGetProfile(reqAuth) {
  const u = await getById(reqAuth.userId);
  if (!u) throw new NotFoundError('User not found');
  return sanitizeUser(u);
}

async function selfUpdateProfile(reqAuth, profilePatch) {
  const u = await getById(reqAuth.userId);
  if (!u) throw new NotFoundError('User not found');
  const updated = await update(u.id, { profile: profilePatch });
  return sanitizeUser(updated);
}

module.exports = {
  adminListUsers,
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
  adminBlockUser,
  adminUnblockUser,
  adminChangeRole,
  adminRestoreUser,
  selfGetProfile,
  selfUpdateProfile,
};

