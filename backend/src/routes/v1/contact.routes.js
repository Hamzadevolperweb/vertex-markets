const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');
const { Roles } = require('../../constants/roles');
const { checkValidation } = require('../../middleware/validation/validateRequest');

const {
  postContact,
  getContactStatus,
  adminList,
  adminGetById,
  adminUpdateById,
  adminPatchById,
  adminDeleteById,
  adminPatchStatus,
  adminAssign,
  adminReply,
} = require('../../modules/contact/contactController');

const contactValidators = require('../../modules/contact/validators');

function contactRoutes() {
  const router = express.Router();

  // ---------------- Public APIs ----------------

  /**
   * @openapi
   * /api/v1/contact:
   *   post:
   *     summary: Submit a new contact message
   *     tags: [Contact]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [fullName, email, phone, country, subject, message]
   *             properties:
   *               fullName: { type: string, minLength: 2, maxLength: 200 }
   *               email: { type: string, format: email }
   *               phone: { type: string, minLength: 7, maxLength: 25 }
   *               country: { type: string, minLength: 2, maxLength: 100 }
   *               subject: { type: string, minLength: 3, maxLength: 150 }
   *               message: { type: string, minLength: 10, maxLength: 4000 }
   *               department: { type: string, maxLength: 100 }
   *               status: { type: string, enum: [new, in_progress, replied, closed] }
   *               active: { type: boolean }
   *     responses:
   *       201:
   *         description: Contact created
   *       400:
   *         description: Validation failed
   */
  router.post(
    '/',
    contactValidators.contactCreateValidator(),
    checkValidation,
    postContact,
  );

  /**
   * @openapi
   * /api/v1/contact/status/{id}:
   *   get:
   *     summary: Public status lookup for a submitted contact
   *     tags: [Contact]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Contact status
   *       404:
   *         description: Contact not found
   */
  router.get(
    '/status/:id',
    contactValidators.adminGetValidator(),
    checkValidation,
    getContactStatus,
  );

  // ---------------- Admin APIs (protected) ----------------

  /**
   * @openapi
   * /api/v1/contact:
   *   get:
   *     summary: List contacts (admin)
   *     tags: [Contact]
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
   *         schema: { type: string, enum: [createdAt, updatedAt, status, repliedAt] }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [asc, desc] }
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [new, in_progress, replied, closed] }
   *       - in: query
   *         name: assignedTo
   *         schema: { type: string }
   *       - in: query
   *         name: active
   *         schema: { type: boolean }
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
    requirePermission('contact:write'),
    contactValidators.listAdminValidator(),
    checkValidation,
    adminList,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}:
   *   get:
   *     summary: Get a contact by id (admin)
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: Contact not found
   */
  router.get(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.adminGetValidator(),
    checkValidation,
    adminGetById,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}:
   *   put:
   *     summary: Replace a contact (admin)
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.adminUpdateValidator(),
    checkValidation,
    adminUpdateById,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}:
   *   patch:
   *     summary: Partially update a contact (admin)
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.adminPatchValidator(),
    checkValidation,
    adminPatchById,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}:
   *   delete:
   *     summary: Soft-delete a contact (admin)
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Deleted
   */
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.adminGetValidator(),
    checkValidation,
    adminDeleteById,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}/status:
   *   patch:
   *     summary: Update contact status (admin)
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [status]
   *             properties:
   *               status: { type: string, enum: [new, in_progress, replied, closed] }
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch(
    '/:id/status',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.statusPatchValidator(),
    checkValidation,
    adminPatchStatus,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}/assign:
   *   patch:
   *     summary: Assign a contact to a team member (admin)
   *     tags: [Contact]
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
   *               assignedTo: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch(
    '/:id/assign',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.assignPatchValidator(),
    checkValidation,
    adminAssign,
  );

  /**
   * @openapi
   * /api/v1/contact/{id}/reply:
   *   post:
   *     summary: Reply to a contact (admin)
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [replyMessage]
   *             properties:
   *               replyMessage: { type: string, minLength: 1, maxLength: 4000 }
   *               fromEmail: { type: string, format: email }
   *               assignedTo: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.post(
    '/:id/reply',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('contact:write'),
    contactValidators.replyValidator(),
    checkValidation,
    adminReply,
  );

  return router;
}

module.exports = { contactRoutes };
