/**
 * validationSchemas.js
 *
 * Shared validation rule presets for use across all modules.
 * Each function returns an array of express-validator chain builders.
 */

const { body, param, query } = require('express-validator');

// ─── Common Allowed Sort Fields ─────────────────────────────────────────

const DEFAULT_SORT_FIELDS = [
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

// ─── Body / Param / Query Helpers ────────────────────────────────────────

function emailRule(field = 'email', required = true) {
  const chain = body(field).isEmail().withMessage(`Valid ${field} is required`).normalizeEmail();
  if (!required) chain.optional();
  return chain;
}

function passwordRule(minLength = 8) {
  return body('password')
    .isLength({ min: minLength })
    .withMessage(`Password must be at least ${minLength} characters`);
}

function phoneRule(field = 'phone', required = false) {
  const chain = body(field)
    .isString()
    .trim()
    .isLength({ min: 7, max: 25 })
    .withMessage(`${field} must be a string between 7-25 characters`);
  if (!required) chain.optional();
  return chain;
}

function slugRule(field = 'slug', required = false) {
  const chain = body(field).isString().notEmpty().withMessage(`${field} must be a non-empty string`);
  if (!required) chain.optional();
  return chain;
}

function nameRule(field, required = true, minLen = 1, maxLen = 200) {
  const chain = body(field)
    .isString()
    .trim()
    .isLength({ min: minLen, max: maxLen })
    .withMessage(`${field} must be a string (${minLen}-${maxLen} chars)`);
  if (!required) chain.optional();
  return chain;
}

function urlRule(field = 'website', required = false) {
  const chain = body(field).isURL().withMessage(`${field} must be a valid URL`);
  if (!required) chain.optional();
  return chain;
}

function idParamRule() {
  return param('id').isString().notEmpty().withMessage('id is required');
}

function uuidParamRule() {
  return param('id').isUUID().withMessage('id must be a valid UUID');
}

function slugParamRule() {
  return param('slug').isString().notEmpty().withMessage('slug is required');
}

function applicationIdParamRule() {
  return param('applicationId').isString().notEmpty().withMessage('applicationId is required');
}

function emailParamRule() {
  return param('email').isEmail().withMessage('Valid email is required').normalizeEmail();
}

// ─── Pagination ──────────────────────────────────────────────────────────

function paginationRules() {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt()
      .withMessage('page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
      .withMessage('limit must be between 1 and 100'),
  ];
}

// ─── Sorting ─────────────────────────────────────────────────────────────

function sortingRules(allowedFields = DEFAULT_SORT_FIELDS) {
  return [
    query('sortBy')
      .optional()
      .isIn(allowedFields)
      .withMessage(`sortBy must be one of: ${allowedFields.join(', ')}`),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc', 'ASC', 'DESC', 'Asc', 'Desc'])
      .withMessage('sortOrder must be asc or desc'),
  ];
}

// ─── Filtering ───────────────────────────────────────────────────────────

function filteringRules() {
  return [
    query('q')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Search query max 200 characters'),
    query('status')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Status filter max 100 characters'),
    query('active')
      .optional()
      .isIn(['true', 'false', '1', '0'])
      .withMessage('active must be true or false'),
  ];
}

// ─── Date Range ──────────────────────────────────────────────────────────

function dateRangeRules() {
  return [
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

// ─── SEO ─────────────────────────────────────────────────────────────────

function seoRules(required = false) {
  const chain = body('seo')
    .optional()
    .isObject()
    .withMessage('seo must be an object');
  if (!required) chain.optional();
  return chain;
}

// ─── Type-specific Rules ─────────────────────────────────────────────────

function booleanRule(field, required = false) {
  const chain = body(field).isBoolean().withMessage(`${field} must be a boolean`);
  if (!required) chain.optional();
  return chain;
}

function numericRule(field, required = false) {
  const chain = body(field).isNumeric().withMessage(`${field} must be numeric`);
  if (!required) chain.optional();
  return chain;
}

function arrayRule(field, required = false) {
  const chain = body(field).isArray().withMessage(`${field} must be an array`);
  if (!required) chain.optional();
  return chain;
}

function objectRule(field, required = false) {
  const chain = body(field)
    .isObject()
    .withMessage(`${field} must be an object`);
  if (!required) chain.optional();
  return chain;
}

function enumRule(field, enums, required = true) {
  const chain = body(field)
    .isIn(enums)
    .withMessage(`${field} must be one of: ${enums.join(', ')}`);
  if (!required) chain.optional();
  return chain;
}

function statusRule(field = 'status', enums, required = true) {
  const chain = body(field)
    .isString()
    .notEmpty()
    .isIn(enums)
    .withMessage(`${field} must be one of: ${enums.join(', ')}`);
  if (!required) chain.optional();
  return chain;
}

function stringRule(field, required = true, minLen = 1, maxLen = 500) {
  const chain = body(field)
    .isString()
    .trim()
    .isLength({ min: minLen, max: maxLen })
    .withMessage(`${field} must be a string (${minLen}-${maxLen} chars)`);
  if (!required) chain.optional();
  return chain;
}

function intRule(field, required = false, minVal = 0) {
  const chain = body(field)
    .isInt({ min: minVal })
    .withMessage(`${field} must be an integer >= ${minVal}`);
  if (!required) chain.optional();
  return chain;
}

// ─── Upload-specific ─────────────────────────────────────────────────────

function fileMetadataRule(field = 'resume', required = false) {
  const chain = body(field).optional().isObject().withMessage(`${field} must be an object`);
  return chain;
}

// ─── Combined Presets ────────────────────────────────────────────────────

function listQueryPreset(allowedSortFields) {
  return [
    ...paginationRules(),
    ...sortingRules(allowedSortFields),
    ...filteringRules(),
  ];
}

function listQueryWithDatesPreset(allowedSortFields) {
  return [
    ...listQueryPreset(allowedSortFields),
    ...dateRangeRules(),
  ];
}

module.exports = {
  DEFAULT_SORT_FIELDS,

  // Core rules
  emailRule,
  passwordRule,
  phoneRule,
  slugRule,
  nameRule,
  urlRule,
  idParamRule,
  uuidParamRule,
  slugParamRule,
  applicationIdParamRule,
  emailParamRule,

  // Preset groups
  paginationRules,
  sortingRules,
  filteringRules,
  dateRangeRules,
  seoRules,
  listQueryPreset,
  listQueryWithDatesPreset,

  // Type rules
  booleanRule,
  numericRule,
  arrayRule,
  objectRule,
  enumRule,
  statusRule,
  stringRule,
  intRule,

  // Domain rules
  fileMetadataRule,
};

