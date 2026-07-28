const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { Roles } = require('../../constants/roles');

const { platformsController, validators } = require('../../modules/platforms');

/**
 * @swagger
 * tags:
 *   name: Platforms
 */
function platformsRoutes() {
  const router = express.Router();

  // Public
  /**
   * @swagger
   * /api/v1/platforms:
   *   get:
   *     summary: List platforms
   *     tags: [Platforms]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1, maximum: 100 }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [asc, desc] }
   *       - in: query
   *         name: active
   *         schema: { type: boolean }
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', validators.listQueryValidator(), asyncWrapper(platformsController.getPlatforms));

  /**
   * @swagger
   * /api/v1/platforms/{id}:
   *   get:
   *     summary: Get platform by id
   *     tags: [Platforms]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/:id', validators.idParam(), asyncWrapper(platformsController.getPlatformById));

  /**
   * @swagger
   * /api/v1/platforms/slug/{slug}:
   *   get:
   *     summary: Get platform by slug
   *     tags: [Platforms]
   *     parameters:
   *       - in: path
   *         name: slug
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/slug/:slug', validators.slugParam(), asyncWrapper(platformsController.getPlatformBySlug));

  // Admin
  /**
   * @swagger
   * /api/v1/platforms:
   *   post:
   *     summary: Create platform
   *     tags: [Platforms]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Created
   */
  router.post(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.platformFields(),
    asyncWrapper(platformsController.createPlatform),
  );

  /**
   * @swagger
   * /api/v1/platforms/{id}:
   *   put:
   *     summary: Update platform (PUT)
   *     tags: [Platforms]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   */
  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.platformFields(),
    asyncWrapper(platformsController.updatePlatform),
  );

  /**
   * @swagger
   * /api/v1/platforms/{id}:
   *   patch:
   *     summary: Patch platform (PATCH)
   *     tags: [Platforms]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.platformPatchFields(),
    asyncWrapper(platformsController.patchPlatform),
  );

  /**
   * @swagger
   * /api/v1/platforms/{id}:
   *   delete:
   *     summary: Delete platform
   *     tags: [Platforms]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    asyncWrapper(platformsController.deletePlatform),
  );

  return router;
}

module.exports = { platformRoutes: platformsRoutes };


