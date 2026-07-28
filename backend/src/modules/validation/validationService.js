/**
 * validationService.js
 *
 * Business logic for validation processing.
 * Provides reusable validation orchestration utilities.
 */

const { validationResult } = require('express-validator');
const { formatValidationErrors, stripUnexpectedProperties } = require('../../utils/validationHelpers');

/**
 * Run a set of express-validator rules against a request object.
 * @param {Array} rules - Array of validation chain builders
 * @param {object} req - Express request object
 * @returns {object} { isValid: boolean, errors: Array }
 */
async function validateRequest(rules, req) {
  for (const rule of rules) {
    await rule.run(req);
  }

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return {
      isValid: false,
      errors: formatValidationErrors(result.array()),
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}

/**
 * Validate a plain data object against a set of rules (no Express req).
 * @param {Array} rules - Array of express-validator validation chains
 * @param {object} data - Plain data object to validate
 * @returns {Promise<{isValid: boolean, errors: Array}>}
 */
async function validateData(rules, data) {
  // Build a minimal mock request
  const mockReq = {
    body: data,
    query: {},
    params: {},
    headers: {},
  };

  return validateRequest(rules, mockReq);
}

/**
 * Check that an object only contains allowed properties.
 * @param {object} obj - The object to check
 * @param {string[]} allowedFields - List of allowed property names
 * @returns {string[]} Array of unexpected field names (empty if all valid)
 */
function checkAllowedProperties(obj, allowedFields) {
  if (!obj || typeof obj !== 'object') return [];
  const unexpected = [];
  for (const key of Object.keys(obj)) {
    if (!allowedFields.includes(key)) {
      unexpected.push(key);
    }
  }
  return unexpected;
}

/**
 * Validate payload size.
 * @param {object} payload - The request payload
 * @param {number} maxBytes - Maximum allowed size in bytes
 * @returns {boolean} true if payload is within size limit
 */
function validatePayloadSize(payload, maxBytes = 1024 * 1024) {
  try {
    const json = JSON.stringify(payload);
    return Buffer.byteLength(json, 'utf8') <= maxBytes;
  } catch {
    return false;
  }
}

/**
 * Get a clean object containing only allowed fields.
 */
function getAllowedFieldsOnly(obj, allowedFields) {
  return stripUnexpectedProperties(obj, allowedFields);
}

module.exports = {
  validateRequest,
  validateData,
  checkAllowedProperties,
  validatePayloadSize,
  getAllowedFieldsOnly,
};

