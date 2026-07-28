/**
 * validationHelpers.js
 *
 * Reusable validation helper functions and sanitization utilities
 * for Phase 14 – Validation & Request Sanitization.
 */

const validator = require('validator');

// ─── Validation Functions ─────────────────────────────────────────────────

/**
 * Check if a value is a valid email address.
 */
function isValidEmail(value) {
  return typeof value === 'string' && validator.isEmail(value);
}

/**
 * Check if a value is a valid phone number (E.164 or general).
 */
function isValidPhone(value) {
  return typeof value === 'string' && value.length >= 7 && value.length <= 25;
}

/**
 * Check if a password meets minimum requirements.
 * @param {string} value - Password to validate
 * @param {number} minLength - Minimum length (default 8)
 */
function isValidPassword(value, minLength = 8) {
  return typeof value === 'string' && value.length >= minLength;
}

/**
 * Check if a value is a valid URL.
 */
function isValidURL(value) {
  return typeof value === 'string' && validator.isURL(value, { require_protocol: false });
}

/**
 * Check if a value is a valid slug (alphanumeric + hyphens).
 */
function isValidSlug(value) {
  return typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
}

/**
 * Check if a value is a valid UUID (v4).
 */
function isValidUUID(value) {
  return typeof value === 'string' && validator.isUUID(value, 4);
}

/**
 * Check if a value is a valid Mongo-style ObjectId (24 hex chars).
 */
function isValidObjectId(value) {
  return typeof value === 'string' && /^[a-fA-F0-9]{24}$/.test(value);
}

/**
 * Check if a status value is within an allowed set.
 */
function isValidStatus(value, enums) {
  return enums.includes(value);
}

/**
 * Check if a value is a valid ISO 8601 date.
 */
function isValidDate(value) {
  return typeof value === 'string' && validator.isISO8601(value);
}

/**
 * Validate a date range (from must be before or equal to to).
 */
function isValidDateRange(from, to) {
  if (!from || !to) return true; // one or both missing = skip range check
  return new Date(from) <= new Date(to);
}

/**
 * Check if a value is a boolean or boolean string.
 */
function isValidBoolean(value) {
  if (typeof value === 'boolean') return true;
  if (typeof value === 'string') return ['true', 'false', '1', '0'].includes(value.toLowerCase());
  return false;
}

/**
 * Check if a value is a numeric value.
 */
function isValidNumeric(value) {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') return !isNaN(Number(value)) && value.trim() !== '';
  return false;
}

/**
 * Check if a value is a plain object.
 */
function isValidObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if a value is a non-empty array.
 */
function isValidArray(value) {
  return Array.isArray(value) && value.length > 0;
}

// ─── Sanitization Functions ───────────────────────────────────────────────

/**
 * Trim whitespace from all string values in an object (recursive).
 */
function trimFields(obj) {
  if (typeof obj === 'string') return obj.trim();
  if (Array.isArray(obj)) return obj.map(trimFields);
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = trimFields(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Escape HTML entities in a string to prevent XSS.
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;');
}

/**
 * Recursively escape HTML in all string values of an object.
 */
function escapeHtmlDeep(obj) {
  if (typeof obj === 'string') return escapeHtml(obj);
  if (Array.isArray(obj)) return obj.map(escapeHtmlDeep);
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = escapeHtmlDeep(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Remove <script> tags and their content from a string.
 */
function stripScriptTags(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

/**
 * Recursively strip script tags from all string values in an object.
 */
function stripScriptTagsDeep(obj) {
  if (typeof obj === 'string') return stripScriptTags(obj);
  if (Array.isArray(obj)) return obj.map(stripScriptTagsDeep);
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = stripScriptTagsDeep(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Normalize line breaks in a string (CRLF → LF, CR → LF).
 */
function normalizeLineBreaks(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Normalize an email address (lowercase, trim).
 */
function normalizeEmail(email) {
  if (typeof email !== 'string') return email;
  return email.trim().toLowerCase();
}

/**
 * Normalize a URL (trim, lowercase protocol/host).
 */
function normalizeURL(url) {
  if (typeof url !== 'string') return url;
  url = url.trim();
  try {
    const parsed = new URL(url);
    parsed.host = parsed.host.toLowerCase();
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Normalize a phone number (strip non-digit characters except leading +).
 */
function normalizePhone(phone) {
  if (typeof phone !== 'string') return phone;
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Remove duplicate spaces from a string.
 */
function removeDuplicateSpaces(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/  +/g, ' ');
}

/**
 * Convert empty strings to null where appropriate.
 * @param {object} obj - The object to process
 * @param {string[]} fields - Fields to convert (default: all string fields)
 */
function emptyStringsToNull(obj, fields = null) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (fields) {
    for (const field of fields) {
      if (result[field] === '') result[field] = null;
    }
  } else {
    for (const [key, value] of Object.entries(result)) {
      if (value === '') result[key] = null;
    }
  }
  return result;
}

/**
 * Strip unexpected properties from an object.
 * @param {object} obj - The input object
 * @param {string[]} allowedFields - Array of allowed field names
 * @returns {object} Object containing only allowed fields
 */
function stripUnexpectedProperties(obj, allowedFields) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      result[field] = obj[field];
    }
  }
  return result;
}

// ─── Error Formatting ─────────────────────────────────────────────────────

/**
 * Format a single express-validator error into { field, message }.
 */
function formatValidationError(error) {
  if (error && error.param && error.msg) {
    return {
      field: error.param,
      message: error.msg,
    };
  }
  if (error && error.field && error.message) {
    return {
      field: error.field,
      message: error.message,
    };
  }
  return {
    field: error.path || error.param || 'unknown',
    message: error.msg || error.message || 'Invalid value',
  };
}

/**
 * Format an array of express-validator errors into [{ field, message }].
 */
function formatValidationErrors(errors) {
  if (!errors || !Array.isArray(errors)) return [];
  return errors.map(formatValidationError);
}

/**
 * Create a standardized validation error response body.
 */
function createValidationErrorResponse(errors) {
  return {
    success: false,
    message: 'Validation Failed',
    errors: formatValidationErrors(errors),
  };
}

module.exports = {
  // Validators
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidURL,
  isValidSlug,
  isValidUUID,
  isValidObjectId,
  isValidStatus,
  isValidDate,
  isValidDateRange,
  isValidBoolean,
  isValidNumeric,
  isValidObject,
  isValidArray,

  // Sanitization
  trimFields,
  escapeHtml,
  escapeHtmlDeep,
  stripScriptTags,
  stripScriptTagsDeep,
  normalizeLineBreaks,
  normalizeEmail,
  normalizeURL,
  normalizePhone,
  removeDuplicateSpaces,
  emptyStringsToNull,
  stripUnexpectedProperties,

  // Error formatting
  formatValidationError,
  formatValidationErrors,
  createValidationErrorResponse,
};

