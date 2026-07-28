const { body, param, query } = require('express-validator');

const idParam = () => param('id').isString().notEmpty();
const slugParam = () => param('slug').isString().notEmpty();

const seoValidator = () =>
  body('seo')
    .optional()
    .isObject()
    .custom((obj) => !!obj);

const featuresValidator = () =>
  body('features')
    .optional()
    .isArray();

const supportedMarketsValidator = () =>
  body('supportedMarkets')
    .optional()
    .isArray();

const downloadLinksValidator = () =>
  body('downloadLinks')
    .optional()
    .isObject();

const orderValidator = () => body('order').optional().isInt({ min: 0 });

const activeValidator = () => body('active').optional().isBoolean();

const platformFields = () => [
  body('title').isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('shortDescription').optional().isString(),
  body('description').optional().isString(),
  body('icon').optional().isString(),
  body('image').optional().isString(),
  featuresValidator(),
  supportedMarketsValidator(),
  downloadLinksValidator(),
  body('version').optional().isString(),
  orderValidator(),
  activeValidator(),
  seoValidator(),
];

const platformPatchFields = () => [
  body('title').optional().isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('shortDescription').optional().isString(),
  body('description').optional().isString(),
  body('icon').optional().isString(),
  body('image').optional().isString(),
  featuresValidator(),
  supportedMarketsValidator(),
  downloadLinksValidator(),
  body('version').optional().isString(),
  orderValidator(),
  activeValidator(),
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
];

module.exports = {
  idParam,
  slugParam,
  listQueryValidator,
  platformFields,
  platformPatchFields,
};

