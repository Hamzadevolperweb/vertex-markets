/**
 * validationController.js
 *
 * Controller for validation system health and testing.
 */

/**
 * GET /api/v1/validation/health
 * Check that the validation system is operational.
 */
function healthCheck(req, res) {
  res.json({
    success: true,
    message: 'Validation system is operational',
    data: {
      status: 'healthy',
      features: [
        'Required Fields',
        'Optional Fields',
        'Email Validation',
        'Password Validation',
        'Phone Validation',
        'URL Validation',
        'Slug Validation',
        'Boolean Validation',
        'Numeric Validation',
        'Date Validation',
        'Pagination Validation',
        'Sorting Validation',
        'Filtering Validation',
        'XSS Prevention',
        'HTML Sanitization',
        'Input Normalization',
        'Standardized Error Formatting',
      ],
    },
  });
}

/**
 * POST /api/v1/validation/test
 * Test the validation system by submitting sample data.
 * Returns validation results for analysis.
 */
function testValidation(req, res) {
  const errors = [];
  const { body } = req;

  // Test required field
  if (!body.testField) {
    errors.push({ field: 'testField', message: 'testField is required for validation testing' });
  }

  res.json({
    success: errors.length === 0,
    message: errors.length === 0 ? 'Validation test passed' : 'Validation test failed',
    errors: errors.length > 0 ? errors : undefined,
    data: {
      receivedPayload: body,
      validationStatus: errors.length === 0 ? 'passed' : 'failed',
    },
  });
}

module.exports = { healthCheck, testValidation };

