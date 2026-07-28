/**
 * sanitizeInput.js
 *
 * Input sanitization middleware that automatically sanitizes
 * all incoming request data (body, query, params).
 *
 * Sanitization steps:
 * - Trim whitespace on all string fields
 * - Escape HTML entities to prevent XSS
 * - Remove <script> tags
 * - Normalize line breaks (CRLF → LF)
 * - Remove duplicate spaces
 * - Convert empty strings to null where appropriate
 */

const {
  trimFields,
  escapeHtmlDeep,
  stripScriptTagsDeep,
  normalizeLineBreaks,
  removeDuplicateSpaces,
  emptyStringsToNull,
} = require('../../utils/validationHelpers');

/**
 * Recursively sanitize all string values in an object.
 */
function deepSanitizeStrings(obj) {
  if (typeof obj === 'string') {
    let value = obj;
    value = normalizeLineBreaks(value);
    value = stripScriptTagsDeep(value);
    value = escapeHtmlDeep(value);
    value = removeDuplicateSpaces(value);
    value = value.trim();
    return value;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSanitizeStrings);
  }
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = deepSanitizeStrings(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 */
function sanitizeInput(req, res, next) {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitizeStrings(req.body);
    req.body = trimFields(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitizeStrings(req.query);
  }

  // Sanitize URL params
  if (req.params && typeof req.params === 'object') {
    req.params = deepSanitizeStrings(req.params);
  }

  next();
}

module.exports = { sanitizeInput, deepSanitizeStrings };

