/**
 * validation/index.js
 *
 * Validation Module – Centralized validation architecture.
 * Provides the validation service, controller, and validators.
 */

const validationService = require('./validationService');
const validationController = require('./validationController');
const validators = require('./validators');

module.exports = {
  validationService,
  validationController,
  validators,
};

