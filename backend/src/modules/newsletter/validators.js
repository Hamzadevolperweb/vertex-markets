const { body, param, query } = require('express-validator');

function idParam() {
  return param('id').isString().notEmpty().withMessage('id is required');
}

function emailParam() {
  return param('email').isEmail().withMessage('Valid email is required').normalizeEmail();
}

const subscribeValidator = () => [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('fullName').optional().isString().trim().isLength({ min: 1, max: 200 }).withMessage('fullName must be a string (max 200 chars)'),
  body('source').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('source must be a string (max 100 chars)'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('tags.*').optional().isString().trim().notEmpty().withMessage('each tag must be a non-empty string'),
  body('active').optional().isBoolean().toBoolean().withMessage('active must be boolean'),
];

const unsubscribeValidator = () => [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const statusValidator = () => [
  emailParam(),
];

const paginationQueryValidator = () => [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('limit must be between 1 and 100'),
];

const sortingQueryValidator = () => [
  query('sortBy').optional().isIn(['email', 'createdAt', 'subscribedAt', 'updatedAt']).withMessage('sortBy must be one of: email, createdAt, subscribedAt, updatedAt'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
];

const filteringQueryValidator = () => [
  query('q').optional().isString().trim().notEmpty().isLength({ min: 1, max: 200 }).withMessage('q is invalid'),
  query('status').optional().isIn(['subscribed', 'unsubscribed']).withMessage('status must be subscribed or unsubscribed'),
  query('active').optional().isBoolean().toBoolean().withMessage('active must be boolean'),
  query('source').optional().isString().trim().notEmpty().withMessage('source is invalid'),
  query('subscribedFrom').optional().isISO8601().withMessage('subscribedFrom must be ISO8601 date'),
  query('subscribedTo').optional().isISO8601().withMessage('subscribedTo must be ISO8601 date'),
];

const listAdminValidator = () => [
  ...paginationQueryValidator(),
  ...sortingQueryValidator(),
  ...filteringQueryValidator(),
];

const adminGetValidator = () => [idParam()];

const adminUpdateValidator = () => [
  idParam(),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('fullName').optional().isString().trim().isLength({ min: 1, max: 200 }).withMessage('fullName must be a string (max 200 chars)'),
  body('source').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('source must be a string (max 100 chars)'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('tags.*').optional().isString().trim().notEmpty().withMessage('each tag must be a non-empty string'),
  body('active').optional().isBoolean().toBoolean().withMessage('active must be boolean'),
];

const adminPatchValidator = () => adminUpdateValidator();

const statusPatchValidator = () => [
  idParam(),
  body('status').isIn(['subscribed', 'unsubscribed']).withMessage('status must be subscribed or unsubscribed'),
];

module.exports = {
  idParam,
  emailParam,
  subscribeValidator,
  unsubscribeValidator,
  statusValidator,
  listAdminValidator,
  adminGetValidator,
  adminUpdateValidator,
  adminPatchValidator,
  statusPatchValidator,
};

