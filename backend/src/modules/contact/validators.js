const { body, param, query } = require('express-validator');

function idParam() {
  return param('id').isString().notEmpty();
}

function requiredString(field, minLen = 1, maxLen = 255) {
  return body(field)
    .isString()
    .withMessage(`${field} must be a string`)
    .trim()
    .isLength({ min: minLen, max: maxLen })
    .withMessage(`${field} length is invalid`);
}

const contactCreateValidator = () => [
  requiredString('fullName', 2, 200),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').isString().withMessage('phone must be a string').trim().notEmpty().isLength({ min: 7, max: 25 }).withMessage('phone length is invalid'),
  body('country').isString().withMessage('country must be a string').trim().notEmpty().isLength({ min: 2, max: 100 }).withMessage('country length is invalid'),
  requiredString('subject', 3, 150),
  requiredString('message', 10, 4000),
  body('department').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('department length is invalid'),
  body('active').optional().isBoolean().withMessage('active must be boolean'),
  body('status').optional().isIn(['new', 'in_progress', 'replied', 'closed']).withMessage('status is invalid'),
];

const paginationQueryValidator = () => [
  query('page').optional().isInt({ min: 1, max: 1000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const sortingQueryValidator = () => [
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'status', 'repliedAt']).withMessage('sortBy is invalid'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder is invalid'),
];

const filteringQueryValidator = () => [
  query('q').optional().isString().trim().notEmpty().isLength({ min: 1, max: 200 }),
  query('status').optional().isIn(['new', 'in_progress', 'replied', 'closed']).withMessage('status is invalid'),
  query('assignedTo').optional().isString().trim().notEmpty(),
  query('active').optional().isBoolean().toBoolean(),
];

const listAdminValidator = () => [
  ...paginationQueryValidator(),
  ...sortingQueryValidator(),
  ...filteringQueryValidator(),
];

const adminGetValidator = () => [idParam()];

const adminUpdateValidator = () => [
  idParam(),
  body('fullName').optional().isString().trim().isLength({ min: 2, max: 200 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isString().trim().isLength({ min: 7, max: 25 }),
  body('country').optional().isString().trim().isLength({ min: 2, max: 100 }),
  body('subject').optional().isString().trim().isLength({ min: 3, max: 150 }),
  body('message').optional().isString().trim().isLength({ min: 10, max: 4000 }),
  body('department').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('department').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('status').optional().isIn(['new', 'in_progress', 'replied', 'closed']),
  body('assignedTo').optional().isString().trim().notEmpty(),
  body('replyMessage').optional().isString().trim().isLength({ min: 1, max: 4000 }),
  body('active').optional().isBoolean().toBoolean(),
];

const adminPatchValidator = () => adminUpdateValidator();

const statusPatchValidator = () => [
  idParam(),
  body('status').isIn(['new', 'in_progress', 'replied', 'closed']).withMessage('status is invalid'),
];

const assignPatchValidator = () => [
  idParam(),
  body('assignedTo').optional().isString().trim().notEmpty().withMessage('assignedTo must be non-empty'),
];

const replyValidator = () => [
  idParam(),
  requiredString('replyMessage', 1, 4000),
  body('fromEmail').optional().isEmail().normalizeEmail(),
  body('assignedTo').optional().isString().trim().notEmpty(),
];

module.exports = {
  contactCreateValidator,
  listAdminValidator,
  adminGetValidator,
  adminUpdateValidator,
  adminPatchValidator,
  statusPatchValidator,
  assignPatchValidator,
  replyValidator,
};

