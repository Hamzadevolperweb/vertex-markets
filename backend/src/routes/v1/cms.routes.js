const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { Roles } = require('../../constants/roles');
const { cmsController, validators } = require('../../modules/cms');

function cmsRoutes() {
  const router = express.Router();

  // Public
  router.get('/status', (req, res) => res.json({ ok: true }));

  // Public: Hero
  router.get('/hero', asyncWrapper(cmsController.getHero));
  router.get('/hero/:id', asyncWrapper(cmsController.getHeroById));

  // Admin: Hero CRUD
  router.post(
    '/hero',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.contentBody(),
    asyncWrapper(cmsController.createHero),
  );

  router.put(
    '/hero/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.sectionIdParam(),
    validators.contentBody(),
    asyncWrapper(cmsController.upsertHero),
  );

  router.patch(
    '/hero/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.sectionIdParam(),
    validators.contentBody(),
    asyncWrapper(cmsController.patchHero),
  );

  router.delete(
    '/hero/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.sectionIdParam(),
    asyncWrapper(cmsController.deleteHero),
  );

  return router;
}

module.exports = { cmsRoutes };


