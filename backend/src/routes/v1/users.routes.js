const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { usersController, validators } = require('../../modules/users');

const { Roles } = require('../../constants/roles');

function usersRoutes() {
  const router = express.Router();

  // Self profile
  router.get('/me', jwtAuth, asyncWrapper(usersController.selfProfile));
  router.patch('/me', validators.selfUpdateProfileValidator(), jwtAuth, asyncWrapper(usersController.selfUpdateProfile));

  // Admin listing
  router.get(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:read'),
    asyncWrapper(usersController.listUsers),
  );

  // Admin details
  router.get(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:read'),
    validators.idParam(),
    asyncWrapper(usersController.getUser),
  );

  // Admin update
  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:update'),
    validators.updateUserValidator(),
    asyncWrapper(usersController.updateUser),
  );

  // Admin soft delete
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:delete'),
    validators.idParam(),
    asyncWrapper(usersController.deleteUser),
  );

  // Admin block/unblock
  router.post(
    '/:id/block',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:block'),
    validators.blockUnblockValidator(),
    asyncWrapper(usersController.blockUser),
  );

  router.post(
    '/:id/unblock',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:block'),
    validators.blockUnblockValidator(),
    asyncWrapper(usersController.unblockUser),
  );

  // Admin role change
  router.patch(
    '/:id/role',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:role'),
    validators.changeRoleValidator(),
    asyncWrapper(usersController.changeRole),
  );

  // Admin restore (undo soft delete)
  router.post(
    '/:id/restore',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('user:update'),
    validators.restoreValidator(),
    asyncWrapper(usersController.restoreUser),
  );

  return router;
}

module.exports = { usersRoutes };

