const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { Roles } = require('../../constants/roles');
const kycController = require('./kycController');

function kycRoutes() {
  const router = express.Router();

  router.post('/start', jwtAuth, asyncWrapper(kycController.startVerification));
  router.get('/me', jwtAuth, asyncWrapper(kycController.myStatus));

  router.get(
    '/applications',
    jwtAuth,
    requireRoles(Roles.Admin),
    asyncWrapper(kycController.listAll),
  );

  router.patch(
    '/applications/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    asyncWrapper(kycController.patchStatus),
  );

  return router;
}

module.exports = { kycRoutes };
