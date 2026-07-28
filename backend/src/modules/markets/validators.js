const { body, param, query } = require('express-validator');

const idParam = () => param('id').isString().notEmpty();
const slugParam = () => param('slug').isString().notEmpty();

const typeEnum = ['Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'];

const orderValidator = () => body('order').optional().isInt({ min: 0 });

function slugifyInput(input) {
  if (input === undefined || input === null) return '';
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

const seoValidator = () =>
  body('seo')
    .optional()
    .isObject()
    .custom((obj) => {
      if (!obj) return false;
      return true;
    });

const marketBody = () => [
  body('type').isIn(typeEnum).withMessage('Invalid market type'),
  body('title').isString().notEmpty(),
  body('slug').optional().isString().notEmpty().customSanitizer((v) => slugifyInput(v)),
  body('icon').optional().isString(),
  body('description').optional().isString(),
  orderValidator(),
  body('active').optional().isBoolean(),
  seoValidator(),
];

const marketPatchBody = () => [
  body('title').optional().isString().notEmpty(),
  body('slug').optional().isString().notEmpty().customSanitizer((v) => slugifyInput(v)),
  body('icon').optional().isString(),
  body('description').optional().isString(),
  body('order').optional().isInt({ min: 0 }),
  body('active').optional().isBoolean(),
  seoValidator(),
];

// Public filters/search
const listQueryValidator = () => [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc', 'ASC', 'DESC', 'Asc', 'Desc']),
  query('active').optional().isBoolean(),
  query('q').optional().isString(),
  query('type').optional().isIn(typeEnum),
];

module.exports = {
  idParam,
  slugParam,
  marketBody,
  marketPatchBody,
  listQueryValidator,
};

