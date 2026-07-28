const { body, param, query } = require('express-validator');

const PARTNER_TYPES = [
  'Introducing Broker (IB)',
  'Affiliate Partner',
  'Regional Partner',
  'Business Partner',
  'Institutional Partner',
];

const PARTNER_STATUSES = ['pending', 'under_review', 'approved', 'rejected'];
const REFERRAL_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'];

const idParam = () => param('id').isString().notEmpty().withMessage('id is required');

// ─── Partner Registration Body ────────────────────────────────────────────

const partnerRegisterBody = () => [
  body('fullName').isString().notEmpty().withMessage('fullName is required'),
  body('companyName').optional().isString(),
  body('email').isEmail().withMessage('valid email is required'),
  body('phone').isString().notEmpty().withMessage('phone is required'),
  body('country').isString().notEmpty().withMessage('country is required'),
  body('city').optional().isString(),
  body('website').optional().isURL().withMessage('website must be a valid URL'),
  body('partnerType')
    .isString()
    .notEmpty()
    .isIn(PARTNER_TYPES)
    .withMessage(`partnerType must be one of: ${PARTNER_TYPES.join(', ')}`),
  body('experience').optional().isString(),
  body('monthlyClients').optional().isString(),
  body('businessDescription').optional().isString(),
  body('referralSource').optional().isString(),
];

// ─── Referral Submission Body ─────────────────────────────────────────────

const referralSubmitBody = () => [
  body('clientName').isString().notEmpty().withMessage('clientName is required'),
  body('clientEmail').isEmail().withMessage('valid clientEmail is required'),
  body('clientPhone').isString().notEmpty().withMessage('clientPhone is required'),
  body('country').isString().notEmpty().withMessage('country is required'),
  body('tradingExperience').optional().isString(),
  body('estimatedDeposit').optional().isString(),
  body('message').optional().isString(),
  body('referredBy').isString().notEmpty().withMessage('referredBy is required'),
];

// ─── Partner Update Body (PUT) ────────────────────────────────────────────

const partnerPutBody = () => [
  ...partnerRegisterBody(),
  body('status').optional().isIn(PARTNER_STATUSES).withMessage(`status must be one of: ${PARTNER_STATUSES.join(', ')}`),
  body('active').optional().isBoolean(),
];

// ─── Partner Patch Body (PATCH) ───────────────────────────────────────────

const partnerPatchBody = () => [
  body('fullName').optional().isString().notEmpty(),
  body('companyName').optional().isString(),
  body('email').optional().isEmail(),
  body('phone').optional().isString().notEmpty(),
  body('country').optional().isString().notEmpty(),
  body('city').optional().isString(),
  body('website').optional().isURL(),
  body('partnerType').optional().isIn(PARTNER_TYPES),
  body('experience').optional().isString(),
  body('monthlyClients').optional().isString(),
  body('businessDescription').optional().isString(),
  body('referralSource').optional().isString(),
  body('status').optional().isIn(PARTNER_STATUSES),
  body('active').optional().isBoolean(),
];

// ─── Status Body ──────────────────────────────────────────────────────────

const statusBody = () => [
  body('status').isString().notEmpty().isIn(PARTNER_STATUSES).withMessage(`status must be one of: ${PARTNER_STATUSES.join(', ')}`),
];

// ─── Referral Status Body ─────────────────────────────────────────────────

const referralStatusBody = () => [
  body('status').isString().notEmpty().isIn(REFERRAL_STATUSES).withMessage(`status must be one of: ${REFERRAL_STATUSES.join(', ')}`),
];

// ─── Assign Body ──────────────────────────────────────────────────────────

const assignBody = () => [
  body('assignedTo').isString().notEmpty().withMessage('assignedTo is required'),
];

// ─── Notes Body ───────────────────────────────────────────────────────────

const notesBody = () => [
  body('notes').isString().withMessage('notes is required'),
];

// ─── List Query Validators ────────────────────────────────────────────────

const listPaging = () => [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc', 'ASC', 'DESC', 'Asc', 'Desc']),
  query('q').optional().isString(),
];

const listPartnersQuery = () => [
  ...listPaging(),
  query('status').optional().isIn(PARTNER_STATUSES),
  query('partnerType').optional().isIn(PARTNER_TYPES),
  query('assignedTo').optional().isString(),
  query('active').optional().isBoolean(),
];

const listReferralsQuery = () => [
  ...listPaging(),
  query('status').optional().isIn(REFERRAL_STATUSES),
  query('referredBy').optional().isString(),
];

module.exports = {
  idParam,
  partnerRegisterBody,
  referralSubmitBody,
  partnerPutBody,
  partnerPatchBody,
  statusBody,
  referralStatusBody,
  assignBody,
  notesBody,
  listPartnersQuery,
  listReferralsQuery,
};

