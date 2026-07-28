/**
 * validateRequest.js
 *
 * Central validation middleware that:
 * 1. Runs express-validator rules
 * 2. Sanitizes request body/query/params
 * 3. Formats validation errors in the standardized format
 *
 * Replaces all duplicated `checkValidation` functions across route files.
 */

const { validationResult } = require('express-validator');
const { ValidationError } = require('../error/customErrors');

/**
 * Central validation middleware factory.
 *
 * @param {Array} validators - Array of express-validator validation chains
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/endpoint',
 *   validateRequest([
 *     body('email').isEmail(),
 *     body('password').isLength({ min: 8 }),
 *   ]),
 *   controller.handler
 * );
 */
function validateRequest(validators) {
  return async (req, res, next) => {
    // Run all validators
    for (const validator of validators) {
      await validator.run(req);
    }

    // Check for validation errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((err) => ({
        field: err.param,
        message: err.msg,
      }));
      return next(new ValidationError('Validation Failed', errors));
    }

    return next();
  };
}

/**
 * Direct validation check for inline use in route files.
 * Can be used as middleware after validators are applied manually.
 *
 * @example
 * router.post('/endpoint',
 *   validators.myValidator(),
 *   checkValidation,  // ← Direct middleware reference
 *   controller.handler
 * );
 */
function checkValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    return next(new ValidationError('Validation Failed', errors));
  }
  return next();
}

module.exports = { validateRequest, checkValidation };

