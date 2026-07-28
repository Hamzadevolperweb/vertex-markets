const { body, param } = require('express-validator');

const idParam = () => param('id').isString().notEmpty();

const updateUserValidator = () => [
  body('role').optional().isIn(['Admin', 'Customer']),
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('phone').optional().isString(),
  body('avatar').optional(),
];

const blockUnblockValidator = () => [idParam()];
const changeRoleValidator = () => [
  idParam(),
  body('role').isIn(['Admin', 'Customer']),
];

const restoreValidator = () => [idParam()];

const listValidator = () => [];

const selfUpdateProfileValidator = () => [
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('phone').optional().isString(),
  body('avatar').optional(),
];

module.exports = {
  idParam,
  listValidator,
  updateUserValidator,
  blockUnblockValidator,
  changeRoleValidator,
  restoreValidator,
  selfUpdateProfileValidator,
};

