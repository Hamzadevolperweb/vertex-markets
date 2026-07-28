const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');
const { Roles } = require('../../constants/roles');
const { checkValidation } = require('../../middleware/validation/validateRequest');

const { uploadsController, validators, storage } = require('../../modules/uploads');

function uploadsRoutes() {
  const router = express.Router();

  // ==================== Public API ====================

  /**
   * @openapi
   * /api/v1/uploads/file/{fileName}:
   *   get:
   *     summary: Serve file by fileName (public)
   *     tags: [Uploads]
   *     parameters:
   *       - in: path
   *         name: fileName
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: File stream
   *       404:
   *         description: File not found
   */
  router.get(
    '/file/:fileName',
    validators.fileNameParam(),
    checkValidation,
    asyncWrapper(uploadsController.serveFileByFileName),
  );

  /**
   * @openapi
   * /api/v1/uploads/{id}:
   *   get:
   *     summary: Get file metadata by ID (public)
   *     tags: [Uploads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: File metadata
   *       404:
   *         description: File not found
   */
  router.get(
    '/:id',
    validators.idParam(),
    checkValidation,
    asyncWrapper(uploadsController.getFileById),
  );

  // ==================== Admin: Upload Endpoints ====================

  /**
   * @openapi
   * /api/v1/uploads/avatar:
   *   post:
   *     summary: Upload a user avatar image
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Avatar uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/avatar',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadAvatar.single('file'),
    asyncWrapper(uploadsController.adminUploadAvatar),
  );

  /**
   * @openapi
   * /api/v1/uploads/blog-image:
   *   post:
   *     summary: Upload a blog image
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Blog image uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/blog-image',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadBlogImage.single('file'),
    asyncWrapper(uploadsController.adminUploadBlogImage),
  );

  /**
   * @openapi
   * /api/v1/uploads/cms-image:
   *   post:
   *     summary: Upload a CMS image
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: CMS image uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/cms-image',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadCmsImage.single('file'),
    asyncWrapper(uploadsController.adminUploadCmsImage),
  );

  /**
   * @openapi
   * /api/v1/uploads/platform-image:
   *   post:
   *     summary: Upload a platform image
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Platform image uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/platform-image',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadPlatformImage.single('file'),
    asyncWrapper(uploadsController.adminUploadPlatformImage),
  );

  /**
   * @openapi
   * /api/v1/uploads/market-icon:
   *   post:
   *     summary: Upload a market icon
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Market icon uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/market-icon',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadMarketIcon.single('file'),
    asyncWrapper(uploadsController.adminUploadMarketIcon),
  );

  /**
   * @openapi
   * /api/v1/uploads/resume:
   *   post:
   *     summary: Upload a resume file
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Resume uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/resume',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadResume.single('file'),
    asyncWrapper(uploadsController.adminUploadResume),
  );

  /**
   * @openapi
   * /api/v1/uploads/document:
   *   post:
   *     summary: Upload a general document
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Document uploaded
   *       400:
   *         description: Validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/document',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    storage.uploadDocument.single('file'),
    asyncWrapper(uploadsController.adminUploadDocument),
  );

  // ==================== Admin: List / Manage ====================

  /**
   * @openapi
   * /api/v1/uploads:
   *   get:
   *     summary: List uploaded files (admin)
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
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
   *         name: category
   *         schema: { type: string, enum: [avatar, blog, cms, platform, market, partner, resume, document] }
   *       - in: query
   *         name: mimeType
   *         schema: { type: string }
   *       - in: query
   *         name: active
   *         schema: { type: boolean }
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    validators.listQuery(),
    checkValidation,
    asyncWrapper(uploadsController.adminListFiles),
  );

  /**
   * @openapi
   * /api/v1/uploads/{id}/details:
   *   get:
   *     summary: Get file details by ID (admin)
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: File details
   *       404:
   *         description: File not found
   */
  router.get(
    '/:id/details',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    validators.idParam(),
    checkValidation,
    asyncWrapper(uploadsController.adminGetFileDetails),
  );

  /**
   * @openapi
   * /api/v1/uploads/{id}:
   *   patch:
   *     summary: Update file metadata (admin)
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: File updated
   *       404:
   *         description: File not found
   */
  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    validators.idParam(),
    validators.patchBody(),
    checkValidation,
    asyncWrapper(uploadsController.adminPatchFile),
  );

  /**
   * @openapi
   * /api/v1/uploads/{id}:
   *   delete:
   *     summary: Soft-delete a file (admin)
   *     tags: [Uploads Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: File deleted
   *       404:
   *         description: File not found
   */
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('uploads:write'),
    validators.idParam(),
    checkValidation,
    asyncWrapper(uploadsController.adminDeleteFile),
  );

  return router;
}

module.exports = { uploadsRoutes };

