const { body, param, query } = require('express-validator');

const uploadsRepository = require('./uploadsRepository');

const VALID_CATEGORIES = uploadsRepository.CATEGORIES;

// ─── Param validators ─────────────────────────────────────────────────────

const idParam = () => param('id').isString().notEmpty().withMessage('id is required');

const fileNameParam = () =>
  param('fileName').isString().notEmpty().withMessage('fileName is required');

// ─── Upload body validators ───────────────────────────────────────────────

const uploadBody = () => [
  body('category')
    .optional()
    .isString()
    .isIn(VALID_CATEGORIES)
    .withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
];

// ─── Patch body validators ────────────────────────────────────────────────

const patchBody = () => [
  body('active').optional().isBoolean().withMessage('active must be a boolean'),
];

// ─── List query validators ────────────────────────────────────────────────

const listQuery = () => [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sortBy').optional().isString().withMessage('sortBy must be a string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc', 'ASC', 'DESC', 'Asc', 'Desc'])
    .withMessage('sortOrder must be asc or desc'),
  query('category')
    .optional()
    .isString()
    .isIn(VALID_CATEGORIES)
    .withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  query('mimeType').optional().isString().withMessage('mimeType must be a string'),
  query('active').optional().isBoolean().withMessage('active must be a boolean'),
  query('q').optional().isString().withMessage('q must be a string'),
];

module.exports = {
  idParam,
  fileNameParam,
  uploadBody,
  patchBody,
  listQuery,
};

