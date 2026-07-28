const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { checkValidation } = require('../../middleware/validation/validateRequest');
const { authController, validators } = require('../../modules/auth');

function authRoutes() {
  const router = express.Router();

  router.get('/status', (req, res) => res.json({ ok: true }));
  router.get('/auth/status', (req, res) => res.json({ ok: true }));

  router.post(
    '/register',
    ...validators.registerValidator(),
    checkValidation,
    asyncWrapper(authController.register),
  );

  router.post(
    '/login',
    ...validators.loginValidator(),
    checkValidation,
    asyncWrapper(authController.login),
  );

  router.post(
    '/logout',
    ...validators.logoutValidator(),
    checkValidation,
    asyncWrapper(authController.logout),
  );

  router.post(
    '/refresh',
    ...validators.refreshValidator(),
    checkValidation,
    asyncWrapper(authController.refreshToken),
  );

  router.post(
    '/forgot-password',
    ...validators.forgotPasswordValidator(),
    checkValidation,
    asyncWrapper(authController.forgotPassword),
  );

  router.post(
    '/reset-password',
    ...validators.resetPasswordValidator(),
    checkValidation,
    asyncWrapper(authController.resetPassword),
  );

  router.post(
    '/verify-email',
    ...validators.verifyEmailValidator(),
    checkValidation,
    asyncWrapper(authController.verifyEmail),
  );

  router.post(
    '/change-password',
    ...validators.changePasswordValidator(),
    checkValidation,
    asyncWrapper(authController.changePassword),
  );

  router.patch(
    '/profile',
    ...validators.updateProfileValidator(),
    checkValidation,
    asyncWrapper(authController.updateProfile),
  );

  return router;
}

module.exports = { authRoutes };
