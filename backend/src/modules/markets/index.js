const marketsRepository = require('./marketsRepository');
const marketsService = require('./marketsService');
const marketsController = require('./marketsController');

const validators = require('./validators');

module.exports = {
  marketsRepository,
  marketsService,
  marketsController,
  validators,
};

