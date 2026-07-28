const usersService = require('./usersService');
const { success } = require('../../utils/response');

async function listUsers(req, res, next) {
  try {
    const data = await usersService.adminListUsers();
    return success(res, { message: 'Users fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const data = await usersService.adminGetUser(req.params.id);
    return success(res, { message: 'User fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { role, firstName, lastName, phone, avatar } = req.body;
    const patch = {};
    if (role) patch.role = role;
    patch.profile = { firstName, lastName, phone, avatar };

    const data = await usersService.adminUpdateUser(req.params.id, patch);
    return success(res, { message: 'User updated', data });
  } catch (err) {
    return next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const data = await usersService.adminDeleteUser(req.params.id);
    return success(res, { message: 'User soft-deleted', data });
  } catch (err) {
    return next(err);
  }
}

async function blockUser(req, res, next) {
  try {
    const data = await usersService.adminBlockUser(req.params.id);
    return success(res, { message: 'User blocked', data });
  } catch (err) {
    return next(err);
  }
}

async function unblockUser(req, res, next) {
  try {
    const data = await usersService.adminUnblockUser(req.params.id);
    return success(res, { message: 'User unblocked', data });
  } catch (err) {
    return next(err);
  }
}

async function changeRole(req, res, next) {
  try {
    const data = await usersService.adminChangeRole(req.params.id, req.body.role);
    return success(res, { message: 'Role updated', data });
  } catch (err) {
    return next(err);
  }
}

async function restoreUser(req, res, next) {
  try {
    const data = await usersService.adminRestoreUser(req.params.id);
    return success(res, { message: 'User restored', data });
  } catch (err) {
    return next(err);
  }
}

async function selfProfile(req, res, next) {
  try {
    const data = await usersService.selfGetProfile(req.auth);
    return success(res, { message: 'Profile fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function selfUpdateProfile(req, res, next) {
  try {
    const data = await usersService.selfUpdateProfile(req.auth, req.body);
    return success(res, { message: 'Profile updated', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  changeRole,
  restoreUser,
  selfProfile,
  selfUpdateProfile,
};

