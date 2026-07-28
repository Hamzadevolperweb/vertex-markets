const { query, param } = require('express-validator');

// ─── Supported module names ──────────────────────────────────────────────

const SUPPORTED_MODULES = [
  'users',
  'cms',
  'markets',
  'platforms',
  'blog',
  'contact',
  'newsletter',
  'careers',
  'partners',
  'uploads',
];

// ─── Allowed sortBy values per module context ────────────────────────────

const ALLOWED_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'name',
  'email',
  'status',
  'order',
  'publishedAt',
  'fullName',
  'department',
  'location',
  'partnerType',
  'category',
  'type',
  'originalName',
  'fileSize',
];

// ─── Global search validator ─────────────────────────────────────────────

function globalSearchValidator() {
  return [
    query('q')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Search query max 200 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isIn(ALLOWED_SORT_FIELDS)
      .withMessage(`sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('sortOrder must be asc or desc'),
    query('active')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('active must be true or false'),
    query('status')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Status filter max 100 characters'),
    query('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category filter max 100 characters'),
    query('type')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Type filter max 100 characters'),
    query('country')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country filter max 100 characters'),
    query('department')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Department filter max 100 characters'),
    query('partnerType')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('partnerType filter max 100 characters'),
    query('market')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Market filter max 100 characters'),
    query('platform')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Platform filter max 100 characters'),
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('dateFrom must be a valid ISO 8601 date'),
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('dateTo must be a valid ISO 8601 date'),
  ];
}

// ─── Module-specific search validator ────────────────────────────────────

function moduleSearchValidator() {
  return [
    param('module')
      .trim()
      .toLowerCase()
      .isIn(SUPPORTED_MODULES)
      .withMessage(`Module must be one of: ${SUPPORTED_MODULES.join(', ')}`),
    query('q')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Search query max 200 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isIn(ALLOWED_SORT_FIELDS)
      .withMessage(`sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('sortOrder must be asc or desc'),
    query('active')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('active must be true or false'),
    query('status')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Status filter max 100 characters'),
    query('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category filter max 100 characters'),
    query('type')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Type filter max 100 characters'),
    query('country')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country filter max 100 characters'),
    query('department')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Department filter max 100 characters'),
    query('partnerType')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('partnerType filter max 100 characters'),
    query('market')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Market filter max 100 characters'),
    query('platform')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Platform filter max 100 characters'),
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('dateFrom must be a valid ISO 8601 date'),
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('dateTo must be a valid ISO 8601 date'),
  ];
}

module.exports = {
  globalSearchValidator,
  moduleSearchValidator,
  SUPPORTED_MODULES,
};

