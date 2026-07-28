const uploadsRepository = require('./uploadsRepository');
const uploadsService = require('./uploadsService');
const uploadsController = require('./uploadsController');
const validators = require('./validators');
const storage = require('./storage');

module.exports = {
  uploadsRepository,
  uploadsService,
  uploadsController,
  validators,
  storage,
};

