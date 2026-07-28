const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { Roles } = require('../../constants/roles');
const { careersController, validators } = require('../../modules/careers');

function careersRoutes() {
  const router = express.Router();

  // ==================== Public APIs ====================

  /**
   * @openapi
   * /api/v1/careers:
   *   get:
   *     summary: List open job positions
   *     tags: [Careers]
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
   *         schema: { type: string, enum: [asc, desc, ASC, DESC, Asc, Desc] }
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *       - in: query
   *         name: featured
   *         schema: { type: boolean }
   *       - in: query
   *         name: department
   *         schema: { type: string }
   *       - in: query
   *         name: location
   *         schema: { type: string }
   *       - in: query
   *         name: employmentType
   *         schema: { type: string, enum: [Full-time, Part-time, Contract, Freelance, Internship, Temporary] }
   *       - in: query
   *         name: experienceLevel
   *         schema: { type: string, enum: [Entry, Junior, Mid-Level, Senior, Lead, Manager, Director, Executive] }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', validators.listJobsPublicQuery(), asyncWrapper(careersController.getJobs));

  /**
   * @openapi
   * /api/v1/careers/{id}:
   *   get:
   *     summary: Get open job by id
   *     tags: [Careers]
   */
  router.get('/:id', validators.idParam(), asyncWrapper(careersController.getJobById));

  /**
   * @openapi
   * /api/v1/careers/slug/{slug}:
   *   get:
   *     summary: Get open job by slug
   *     tags: [Careers]
   */
  router.get('/slug/:slug', validators.slugParam(), asyncWrapper(careersController.getJobBySlug));

  /**
   * @openapi
   * /api/v1/careers/{id}/apply:
   *   post:
   *     summary: Submit job application
   *     tags: [Careers]
   */
  router.post('/:id/apply', validators.idParam(), validators.applyBody(), asyncWrapper(careersController.applyForJob));

  /**
   * @openapi
   * /api/v1/careers/application/{applicationId}/status:
   *   get:
   *     summary: Check application status
   *     tags: [Careers]
   */
  router.get('/application/:applicationId/status', validators.applicationIdParam(), asyncWrapper(careersController.getApplicationStatus));

  // ==================== Admin: Jobs ====================

  /**
   * @openapi
   * /api/v1/careers/admin/jobs:
   *   get:
   *     summary: List all jobs (admin)
   *     tags: [Careers Admin]
   */
  router.get(
    '/admin/jobs',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.listJobsAdminQuery(),
    asyncWrapper(careersController.adminListJobs),
  );

  /**
   * @openapi
   * /api/v1/careers:
   *   post:
   *     summary: Create a new job
   *     tags: [Careers Admin]
   */
  router.post(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.jobCreateBody(),
    asyncWrapper(careersController.createJob),
  );

  /**
   * @openapi
   * /api/v1/careers/{id}:
   *   put:
   *     summary: Update job (full)
   *     tags: [Careers Admin]
   */
  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    validators.jobPutBody(),
    asyncWrapper(careersController.putJob),
  );

  /**
   * @openapi
   * /api/v1/careers/{id}:
   *   patch:
   *     summary: Update job (partial)
   *     tags: [Careers Admin]
   */
  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    validators.jobPatchBody(),
    asyncWrapper(careersController.patchJob),
  );

  /**
   * @openapi
   * /api/v1/careers/{id}:
   *   delete:
   *     summary: Delete a job
   *     tags: [Careers Admin]
   */
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    asyncWrapper(careersController.deleteJob),
  );

  // ==================== Admin: Applications ====================

  /**
   * @openapi
   * /api/v1/careers/admin/applications:
   *   get:
   *     summary: List all applications (admin)
   *     tags: [Careers Admin]
   */
  router.get(
    '/admin/applications',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.listApplicationsAdminQuery(),
    asyncWrapper(careersController.adminListApplications),
  );

  /**
   * @openapi
   * /api/v1/careers/admin/applications/{id}:
   *   get:
   *     summary: Get application by id (admin)
   *     tags: [Careers Admin]
   */
  router.get(
    '/admin/applications/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    asyncWrapper(careersController.adminGetApplicationById),
  );

  /**
   * @openapi
   * /api/v1/careers/admin/applications/{id}/status:
   *   patch:
   *     summary: Update application status
   *     tags: [Careers Admin]
   */
  router.patch(
    '/admin/applications/:id/status',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    validators.applicationStatusBody(),
    asyncWrapper(careersController.adminUpdateApplicationStatus),
  );

  /**
   * @openapi
   * /api/v1/careers/admin/applications/{id}/assign:
   *   patch:
   *     summary: Assign application to admin
   *     tags: [Careers Admin]
   */
  router.patch(
    '/admin/applications/:id/assign',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    validators.applicationAssignBody(),
    asyncWrapper(careersController.adminAssignApplication),
  );

  /**
   * @openapi
   * /api/v1/careers/admin/applications/{id}/notes:
   *   patch:
   *     summary: Update application notes
   *     tags: [Careers Admin]
   */
  router.patch(
    '/admin/applications/:id/notes',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    validators.applicationNotesBody(),
    asyncWrapper(careersController.adminUpdateApplicationNotes),
  );

  /**
   * @openapi
   * /api/v1/careers/admin/applications/{id}:
   *   delete:
   *     summary: Delete an application
   *     tags: [Careers Admin]
   */
  router.delete(
    '/admin/applications/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('careers:write'),
    validators.idParam(),
    asyncWrapper(careersController.adminDeleteApplication),
  );

  return router;
}

module.exports = { careersRoutes };

