const { body, param } = require('express-validator');

const idParam = () => param('id').isString().notEmpty();

const sectionIdParam = () => idParam();

const contentBody = () => [
  body('content')
    .exists()
    .withMessage('content is required')
    .custom((v) => typeof v === 'object' && v !== null)
    .withMessage('content must be an object'),
];

module.exports = {
  sectionIdParam,
  idParam,
  contentBody,
};

