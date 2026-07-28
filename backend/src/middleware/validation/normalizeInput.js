/**
 * normalizeInput.js
 *
 * Input normalization middleware that automatically normalizes
 * common field types across all incoming request data.
 *
 * Normalization steps:
 * - Normalize emails (lowercase, trim)
 * - Normalize URLs (trim, lowercase protocol/host)
 * - Normalize phone numbers (strip non-digit, keep leading +)
 * - Convert string booleans to actual booleans
 * - Convert string numbers to numbers
 */

const { normalizeEmail, normalizeURL, normalizePhone } = require('../../utils/validationHelpers');

/**
 * Normalize email fields identified by field name patterns.
 */
function normalizeEmails(obj) {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(normalizeEmails);
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes('email') && typeof value === 'string') {
        result[key] = normalizeEmail(value);
      } else if (key.toLowerCase().includes('phone') && typeof value === 'string') {
        result[key] = normalizePhone(value);
      } else if (
        (key.toLowerCase().includes('url') || key.toLowerCase().includes('website') || key.toLowerCase().includes('linkin')) &&
        typeof value === 'string'
      ) {
        result[key] = normalizeURL(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = normalizeEmails(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return obj;
}

/**
 * Convert string representations of booleans to actual booleans.
 */
function convertStringBooleans(obj) {
  if (typeof obj === 'string') {
    const lower = obj.toLowerCase();
    if (lower === 'true' || lower === '1') return true;
    if (lower === 'false' || lower === '0') return false;
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(convertStringBooleans);
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertStringBooleans(value);
    }
    return result;
  }
  return obj;
}

/**
 * Convert string numbers to actual numbers.
 */
function convertStringNumbers(obj, fields = []) {
  if (typeof obj === 'string' && fields.length === 0) {
    // Only convert if it looks like a number
    if (/^-?\d+(\.\d+)?$/.test(obj.trim())) {
      const num = Number(obj);
      if (!isNaN(num)) return num;
    }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map((v) => convertStringNumbers(v, fields));
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (fields.length > 0 && fields.includes(key) && typeof value === 'string') {
        const num = Number(value);
        result[key] = isNaN(num) ? value : num;
      } else if (typeof value === 'object' && value !== null) {
        result[key] = convertStringNumbers(value, fields);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return obj;
}

/**
 * Express middleware that normalizes req.body, req.query, and req.params.
 */
function normalizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = normalizeEmails(req.body);
    req.body = convertStringBooleans(req.body);
    req.body = convertStringNumbers(req.body, ['page', 'limit', 'order', 'vacancies', 'order']);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = normalizeEmails(req.query);
    req.query = convertStringBooleans(req.query);
    req.query = convertStringNumbers(req.query, ['page', 'limit', 'offset']);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = normalizeEmails(req.params);
  }

  next();
}

module.exports = { normalizeInput };

