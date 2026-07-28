const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');
const { Roles } = require('../../constants/roles');
const { checkValidation } = require('../../middleware/validation/validateRequest');

const {
  subscribe,
  unsubscribe,
  getStatus,
  adminList,
  adminGetById,
  adminUpdateById,
  adminPatchById,
  adminDeleteById,
  adminPatchStatus,
} = require('../../modules/newsletter/newsletterController');

const validators = require('../../modules/newsletter/validators');

function newsletterRoutes() {
  const router = express.Router();

  // ======================== PUBLIC APIs ========================

  /**
   * @openapi
   * /api/v1/newsletter/subscribe:
   *   post:
   *     summary: Subscribe to newsletter
   *     tags: [Newsletter]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Subscriber email address
   *               fullName:
   *                 type: string
   *                 description: Subscriber full name (optional)
   *               source:
   *                 type: string
   *                 description: Subscription source (e.g., website, landing-page)
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Subscription tags
   *               active:
   *                 type: boolean
   *                 description: Active status
   *     responses:
   *       201:
   *         description: Subscribed successfully
   *       400:
   *         description: Validation failed
   *       409:
   *         description: Already subscribed
   */
  router.post(
    '/subscribe',
    validators.subscribeValidator(),
    checkValidation,
    subscribe,
  );

  /**
   * @openapi
   * /api/v1/newsletter/unsubscribe:
   *   post:
   *     summary: Unsubscribe from newsletter
   *     tags: [Newsletter]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Subscriber email address
   *     responses:
   *       200:
   *         description: Unsubscribed successfully
   *       400:
   *         description: Validation failed
   *       404:
   *         description: Subscriber not found
   */
  router.post(
    '/unsubscribe',
    validators.unsubscribeValidator(),
    checkValidation,
    unsubscribe,
  );

  /**
   * @openapi
   * /api/v1/newsletter/status/{email}:
   *   get:
   *     summary: Get subscription status by email
   *     tags: [Newsletter]
   *     parameters:
   *       - in: path
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *           format: email
   *         description: Subscriber email address
   *     responses:
   *       200:
   *         description: Subscription status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *                 status:
   *                   type: string
   *                   enum: [subscribed, unsubscribed]
   *                 active:
   *                   type: boolean
   *                 subscribedAt:
   *                   type: string
   *                   format: date-time
   *                 unsubscribedAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Validation failed
   *       404:
   *         description: Subscriber not found
   */
  router.get(
    '/status/:email',
    validators.statusValidator(),
    checkValidation,
    getStatus,
  );

  // ======================== ADMIN APIs ========================

  /**
   * @openapi
   * /api/v1/newsletter:
   *   get:
   *     summary: List newsletter subscribers (admin)
   *     tags: [Newsletter]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Items per page
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [email, createdAt, subscribedAt, updatedAt]
   *         description: Sort field
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         description: Search query (searches email and fullName)
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [subscribed, unsubscribed]
   *         description: Filter by status
   *       - in: query
   *         name: active
   *         schema:
   *           type: boolean
   *         description: Filter by active status
   *       - in: query
   *         name: source
   *         schema:
   *           type: string
   *         description: Filter by source
   *       - in: query
   *         name: subscribedFrom
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter subscriptions from date
   *       - in: query
   *         name: subscribedTo
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter subscriptions to date
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 total:
   *                   type: integer
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   *                 pages:
   *                   type: integer
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Newsletter'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('newsletter:write'),
    validators.listAdminValidator(),
    checkValidation,
    adminList,
  );

  /**
   * @openapi
   * /api/v1/newsletter/{id}:
   *   get:
   *     summary: Get newsletter subscriber by id (admin)
   *     tags: [Newsletter]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Subscriber ID
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Subscriber not found
   */
  router.get(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('newsletter:write'),
    validators.adminGetValidator(),
    checkValidation,
    adminGetById,
  );

  /**
   * @openapi
   * /api/v1/newsletter/{id}:
   *   put:
   *     summary: Replace a newsletter subscriber (admin)
   *     tags: [Newsletter]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Subscriber ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               fullName:
   *                 type: string
   *               source:
   *                 type: string
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *               active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Subscriber not found
   */
  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('newsletter:write'),
    validators.adminUpdateValidator(),
    checkValidation,
    adminUpdateById,
  );

  /**
   * @openapi
   * /api/v1/newsletter/{id}:
   *   patch:
   *     summary: Partially update a newsletter subscriber (admin)
   *     tags: [Newsletter]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Subscriber ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               fullName:
   *                 type: string
   *               source:
   *                 type: string
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *               active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Subscriber not found
   */
  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('newsletter:write'),
    validators.adminPatchValidator(),
    checkValidation,
    adminPatchById,
  );

  /**
   * @openapi
   * /api/v1/newsletter/{id}:
   *   delete:
   *     summary: Soft-delete a newsletter subscriber (admin)
   *     tags: [Newsletter]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Subscriber ID
   *     responses:
   *       200:
   *         description: Deleted
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Subscriber not found
   */
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('newsletter:write'),
    validators.adminGetValidator(),
    checkValidation,
    adminDeleteById,
  );

  /**
   * @openapi
   * /api/v1/newsletter/{id}/status:
   *   patch:
   *     summary: Update newsletter subscriber status (admin)
   *     tags: [Newsletter]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Subscriber ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [status]
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [subscribed, unsubscribed]
   *                 description: New subscription status
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Subscriber not found
   */
  router.patch(
    '/:id/status',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('newsletter:write'),
    validators.statusPatchValidator(),
    checkValidation,
    adminPatchStatus,
  );

  return router;
}

module.exports = { newsletterRoutes };

