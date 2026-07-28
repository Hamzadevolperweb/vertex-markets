const { query } = require('express-validator');

const VALID_TYPES = ['users', 'blog', 'contacts', 'applications', 'partners', 'uploads'];

const dashboardQueryValidator = () => [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('sortBy')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('sortBy must be a non-empty string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

const recentQueryValidator = () => [
  query('type')
    .optional()
    .isIn(VALID_TYPES)
    .withMessage(`type must be one of: ${VALID_TYPES.join(', ')}`),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
];

const activityQueryValidator = () => [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
];

module.exports = {
  dashboardQueryValidator,
  recentQueryValidator,
  activityQueryValidator,
};

