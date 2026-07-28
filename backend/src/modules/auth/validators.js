const { body, param } = require('express-validator');

function validateEmail() {
  return body('email').isEmail().withMessage('Valid email is required').normalizeEmail();
}

const registerValidator = () => [
  validateEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('profile').optional().isObject(),
  body('profile.firstName').optional().isString(),
  body('profile.lastName').optional().isString(),
  body('profile.phone').optional().isString(),
];

const loginValidator = () => [
  validateEmail(),
  body('password').isString().notEmpty(),
];

const logoutValidator = () => [
  body('refreshToken').optional().isString(),
];

const refreshValidator = () => [
  body('refreshToken').optional().isString(),
];

const forgotPasswordValidator = () => [
  validateEmail(),
];

const resetPasswordValidator = () => [
  body('token').isString().notEmpty(),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

const verifyEmailValidator = () => [
  body('token').isString().notEmpty(),
];

const changePasswordValidator = () => [
  body('oldPassword').isString().notEmpty(),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

const updateProfileValidator = () => [
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('phone').optional().isString(),
  body('avatar').optional(),
];

module.exports = {
  registerValidator,
  loginValidator,
  logoutValidator,
  refreshValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  changePasswordValidator,
  updateProfileValidator,
};

