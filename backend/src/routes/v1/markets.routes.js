const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { Roles } = require('../../constants/roles');

const { marketsController, validators } = require('../../modules/markets');

function marketsRoutes() {
  const router = express.Router();

  // Public
  router.get('/', validators.listQueryValidator(), asyncWrapper(marketsController.getMarkets));
  router.get('/:id', validators.idParam(), asyncWrapper(marketsController.getMarketById));
  router.get('/slug/:slug', validators.slugParam(), asyncWrapper(marketsController.getMarketBySlug));

  // Admin
  router.post(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.marketBody(),
    asyncWrapper(marketsController.createMarket),
  );

  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.marketBody(),
    asyncWrapper(marketsController.updateMarket),
  );

  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.marketPatchBody(),
    asyncWrapper(marketsController.patchMarket),
  );

  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    asyncWrapper(marketsController.deleteMarket),
  );

  return router;
}

module.exports = { marketsRoutes };


