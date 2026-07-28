const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');
const { Roles } = require('../../constants/roles');
const { checkValidation } = require('../../middleware/validation/validateRequest');

const { partnersController, validators } = require('../../modules/partners');

function partnersRoutes() {
  const router = express.Router();

  // ==================== Public APIs ====================

  /**
   * @openapi
   * /api/v1/partners/register:
   *   post:
   *     summary: Register a new partner
   *     tags: [Partners]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fullName
   *               - email
   *               - phone
   *               - country
   *               - partnerType
   *             properties:
   *               fullName: { type: string, minLength: 2, maxLength: 200 }
   *               companyName: { type: string, maxLength: 200 }
   *               email: { type: string, format: email }
   *               phone: { type: string, minLength: 7, maxLength: 25 }
   *               country: { type: string, minLength: 2, maxLength: 100 }
   *               city: { type: string, maxLength: 100 }
   *               website: { type: string, format: url }
   *               partnerType: { type: string, enum: [Introducing Broker (IB), Affiliate Partner, Regional Partner, Business Partner, Institutional Partner] }
   *               experience: { type: string, maxLength: 500 }
   *               monthlyClients: { type: string, maxLength: 100 }
   *               businessDescription: { type: string, maxLength: 2000 }
   *               referralSource: { type: string, maxLength: 200 }
   *     responses:
   *       201:
   *         description: Partner registration submitted
   *       400:
   *         description: Validation failed
   *       409:
   *         description: Email already registered
   */
  router.post(
    '/register',
    validators.partnerRegisterBody(),
    checkValidation,
    asyncWrapper(partnersController.registerPartner),
  );

  /**
   * @openapi
   * /api/v1/partners/referral:
   *   post:
   *     summary: Submit a client referral
   *     tags: [Partners]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - clientName
   *               - clientEmail
   *               - clientPhone
   *               - country
   *               - referredBy
   *             properties:
   *               clientName: { type: string, minLength: 2, maxLength: 200 }
   *               clientEmail: { type: string, format: email }
   *               clientPhone: { type: string, minLength: 7, maxLength: 25 }
   *               country: { type: string, minLength: 2, maxLength: 100 }
   *               tradingExperience: { type: string, maxLength: 500 }
   *               estimatedDeposit: { type: string, maxLength: 100 }
   *               message: { type: string, maxLength: 2000 }
   *               referredBy: { type: string, maxLength: 200 }
   *     responses:
   *       201:
   *         description: Referral submitted
   *       400:
   *         description: Validation failed
   */
  router.post(
    '/referral',
    validators.referralSubmitBody(),
    checkValidation,
    asyncWrapper(partnersController.submitReferral),
  );

  /**
   * @openapi
   * /api/v1/partners/status/{id}:
   *   get:
   *     summary: Check partner registration status
   *     tags: [Partners]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Partner status
   *       404:
   *         description: Partner not found
   */
  router.get(
    '/status/:id',
    validators.idParam(),
    checkValidation,
    asyncWrapper(partnersController.checkStatus),
  );

  // ==================== Admin: Partners ====================

  /**
   * @openapi
   * /api/v1/partners:
   *   get:
   *     summary: List all partners (admin)
   *     tags: [Partners Admin]
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
   *         name: q
   *         schema: { type: string }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [pending, under_review, approved, rejected] }
   *       - in: query
   *         name: partnerType
   *         schema: { type: string, enum: [Introducing Broker (IB), Affiliate Partner, Regional Partner, Business Partner, Institutional Partner] }
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
    requirePermission('partners:write'),
    validators.listPartnersQuery(),
    checkValidation,
    asyncWrapper(partnersController.adminListPartners),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}:
   *   get:
   *     summary: Get partner by ID (admin)
   *     tags: [Partners Admin]
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
   *         description: Partner not found
   */
  router.get(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    checkValidation,
    asyncWrapper(partnersController.adminGetPartnerById),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}:
   *   put:
   *     summary: Replace partner (admin)
   *     tags: [Partners Admin]
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
   *             required:
   *               - fullName
   *               - email
   *               - phone
   *               - country
   *               - partnerType
   *             properties:
   *               fullName: { type: string }
   *               companyName: { type: string }
   *               email: { type: string, format: email }
   *               phone: { type: string }
   *               country: { type: string }
   *               city: { type: string }
   *               website: { type: string, format: url }
   *               partnerType: { type: string, enum: [Introducing Broker (IB), Affiliate Partner, Regional Partner, Business Partner, Institutional Partner] }
   *               experience: { type: string }
   *               monthlyClients: { type: string }
   *               businessDescription: { type: string }
   *               referralSource: { type: string }
   *               status: { type: string, enum: [pending, under_review, approved, rejected] }
   *               active: { type: boolean }
   *     responses:
   *       200:
   *         description: Partner updated
   */
  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    validators.partnerPutBody(),
    checkValidation,
    asyncWrapper(partnersController.adminPutPartner),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}:
   *   patch:
   *     summary: Partially update partner (admin)
   *     tags: [Partners Admin]
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
   *               fullName: { type: string }
   *               companyName: { type: string }
   *               email: { type: string, format: email }
   *               phone: { type: string }
   *               country: { type: string }
   *               city: { type: string }
   *               website: { type: string, format: url }
   *               partnerType: { type: string, enum: [Introducing Broker (IB), Affiliate Partner, Regional Partner, Business Partner, Institutional Partner] }
   *               experience: { type: string }
   *               monthlyClients: { type: string }
   *               businessDescription: { type: string }
   *               referralSource: { type: string }
   *               status: { type: string, enum: [pending, under_review, approved, rejected] }
   *               active: { type: boolean }
   *     responses:
   *       200:
   *         description: Partner patched
   */
  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    validators.partnerPatchBody(),
    checkValidation,
    asyncWrapper(partnersController.adminPatchPartner),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}:
   *   delete:
   *     summary: Soft-delete partner (admin)
   *     tags: [Partners Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Partner deleted
   */
  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    checkValidation,
    asyncWrapper(partnersController.adminDeletePartner),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}/status:
   *   patch:
   *     summary: Update partner approval status (admin)
   *     tags: [Partners Admin]
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
   *             required:
   *               - status
   *             properties:
   *               status: { type: string, enum: [pending, under_review, approved, rejected] }
   *     responses:
   *       200:
   *         description: Partner status updated
   */
  router.patch(
    '/:id/status',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    validators.statusBody(),
    checkValidation,
    asyncWrapper(partnersController.adminUpdatePartnerStatus),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}/assign:
   *   patch:
   *     summary: Assign partner to admin (admin)
   *     tags: [Partners Admin]
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
   *             required:
   *               - assignedTo
   *             properties:
   *               assignedTo: { type: string }
   *     responses:
   *       200:
   *         description: Partner assigned
   */
  router.patch(
    '/:id/assign',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    validators.assignBody(),
    checkValidation,
    asyncWrapper(partnersController.adminAssignPartner),
  );

  /**
   * @openapi
   * /api/v1/partners/{id}/notes:
   *   patch:
   *     summary: Update internal partner notes (admin)
   *     tags: [Partners Admin]
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
   *             required:
   *               - notes
   *             properties:
   *               notes: { type: string }
   *     responses:
   *       200:
   *         description: Partner notes updated
   */
  router.patch(
    '/:id/notes',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    validators.notesBody(),
    checkValidation,
    asyncWrapper(partnersController.adminUpdatePartnerNotes),
  );

  // ==================== Admin: Referrals ====================

  /**
   * @openapi
   * /api/v1/partners/referrals:
   *   get:
   *     summary: List all referrals (admin)
   *     tags: [Partners Admin]
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
   *         name: q
   *         schema: { type: string }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [new, contacted, qualified, converted, closed] }
   *       - in: query
   *         name: referredBy
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
    '/referrals',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.listReferralsQuery(),
    checkValidation,
    asyncWrapper(partnersController.adminListReferrals),
  );

  /**
   * @openapi
   * /api/v1/partners/referrals/{id}:
   *   get:
   *     summary: Get referral by ID (admin)
   *     tags: [Partners Admin]
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
   *         description: Referral not found
   */
  router.get(
    '/referrals/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    checkValidation,
    asyncWrapper(partnersController.adminGetReferralById),
  );

  /**
   * @openapi
   * /api/v1/partners/referrals/{id}/status:
   *   patch:
   *     summary: Update referral status (admin)
   *     tags: [Partners Admin]
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
   *             required:
   *               - status
   *             properties:
   *               status: { type: string, enum: [new, contacted, qualified, converted, closed] }
   *     responses:
   *       200:
   *         description: Referral status updated
   */
  router.patch(
    '/referrals/:id/status',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    validators.referralStatusBody(),
    checkValidation,
    asyncWrapper(partnersController.adminUpdateReferralStatus),
  );

  /**
   * @openapi
   * /api/v1/partners/referrals/{id}:
   *   delete:
   *     summary: Soft-delete referral (admin)
   *     tags: [Partners Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Referral deleted
   */
  router.delete(
    '/referrals/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('partners:write'),
    validators.idParam(),
    checkValidation,
    asyncWrapper(partnersController.adminDeleteReferral),
  );

  return router;
}

module.exports = { partnersRoutes };

