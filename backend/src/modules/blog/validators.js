const { body, param, query } = require('express-validator');

const idParam = () => param('id').isString().notEmpty();
const slugParam = () => param('slug').isString().notEmpty();

const statusEnum = ['draft', 'published'];

const blogBodyBase = () => [
  body('title').optional().isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('excerpt').optional().isString(),
  body('content').optional().isString(),
  body('featuredImage').optional().isString(),
  body('categoryId').optional().isString().notEmpty(),
  body('tagIds').optional().isArray(),
  body('tagIds.*').optional().isString().notEmpty(),
  body('author').optional().isString(),
  body('seo').optional().isObject(),
  body('status').optional().isIn(statusEnum),
  body('featured').optional().isBoolean(),
  body('active').optional().isBoolean(),
  body('publishedAt').optional().isISO8601(),
];

const blogCreateBody = () => [
  body('title').isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('excerpt').optional().isString(),
  body('content').optional().isString(),
  body('featuredImage').optional().isString(),
  body('categoryId').optional().isString().notEmpty(),
  body('tagIds').optional().isArray(),
  body('tagIds.*').optional().isString().notEmpty(),
  body('author').optional().isString(),
  body('seo').optional().isObject(),
  body('status').optional().isIn(statusEnum),
  body('featured').optional().isBoolean(),
  body('active').optional().isBoolean(),
  body('publishedAt').optional().isISO8601(),
];

const blogPutBody = () => [
  ...blogCreateBody(),
  body('excerpt').exists().withMessage('excerpt is required').isString(),
  body('content').exists().withMessage('content is required').isString(),
  body('categoryId').exists().withMessage('categoryId is required').isString().notEmpty(),
  body('tagIds').exists().withMessage('tagIds is required').isArray(),
  body('tagIds.*').exists().optional().isString().notEmpty(),
];

const blogPatchBody = () => blogBodyBase();

const categoryBodyBase = () => [
  body('name').optional().isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('active').optional().isBoolean(),
];

const categoryCreateBody = () => [
  body('name').isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('active').optional().isBoolean(),
];

const categoryPutBody = () => [
  ...categoryCreateBody(),
  body('description').exists().withMessage('description is required').isString(),
  body('active').exists().withMessage('active is required').isBoolean(),
];

const categoryPatchBody = () => categoryBodyBase();

const tagBodyBase = () => [
  body('name').optional().isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('active').optional().isBoolean(),
];

const tagCreateBody = () => [
  body('name').isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('active').optional().isBoolean(),
];

const tagPutBody = () => [
  ...tagCreateBody(),
  body('active').exists().withMessage('active is required').isBoolean(),
];

const tagPatchBody = () => tagBodyBase();

const listPaging = () => [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc', 'ASC', 'DESC', 'Asc', 'Desc']),
  query('q').optional().isString(),
];

const listBlogsPublicQuery = () => [
  ...listPaging(),
  query('featured').optional().isBoolean(),
  query('categoryId').optional().isString(),
  query('tagId').optional().isString(),
];

const listCategoriesPublicQuery = () => [
  ...listPaging(),
];

const listTagsPublicQuery = () => [
  ...listPaging(),
];

// Admin list blogs (subset)
const listBlogsAdminQuery = () => [
  ...listPaging(),
  query('status').optional().isIn(statusEnum),
  query('active').optional().isBoolean(),
];

module.exports = {
  idParam,
  slugParam,

  blogCreateBody,
  blogPutBody,
  blogPatchBody,
  categoryCreateBody,
  categoryPutBody,
  categoryPatchBody,
  tagCreateBody,
  tagPutBody,
  tagPatchBody,

  listBlogsPublicQuery,
  listCategoriesPublicQuery,
  listTagsPublicQuery,
  listBlogsAdminQuery,
};

