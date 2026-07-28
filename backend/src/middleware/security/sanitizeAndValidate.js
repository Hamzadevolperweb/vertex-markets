const mongoSanitize = require('express-mongo-sanitize');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../../middleware/error/customErrors');
const { sanitizeInput } = require('../../middleware/validation/sanitizeInput');
const { normalizeInput } = require('../../middleware/validation/normalizeInput');

/**
 * Global sanitization + validation middleware.
 * Delegates to the centralized sanitizeInput and normalizeInput middleware.
 * Uses express-mongo-sanitize to prevent NoSQL injection.
 * Formats validation errors using the standardized error format.
 */
const sanitizeAndValidate = [
  // Input sanitization (trim, escape HTML, strip scripts)
  sanitizeInput,

  // Input normalization (emails, URLs, phones, types)
  normalizeInput,

  // MongoDB injection prevention
  mongoSanitize(),

  // Validation error check
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((err) => ({
        field: err.param,
        message: err.msg,
      }));
      return next(new ValidationError('Validation Failed', errors));
    }
    next();
  },
];

module.exports = { sanitizeAndValidate };


