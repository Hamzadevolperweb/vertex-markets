/**
 * validators.js
 *
 * Module-specific validators composed from shared schemas.
 * Re-exports all module validators with centralized error formatting.
 */

const { body } = require('express-validator');

// ─── Validation System Test Validators ───────────────────────────────────

function testValidationRules() {
  return [
    body('testField').optional().isString(),
  ];
}

module.exports = {
  testValidationRules,
};

