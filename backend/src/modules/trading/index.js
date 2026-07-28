const express = require('express');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { getUserById } = require('../auth/authRepository');
const ctrl = require('./tradingController');

async function attachAuthUser(req, res, next) {
  try {
    req.authUser = await getUserById(req.auth.userId);
    return next();
  } catch (err) {
    return next(err);
  }
}

function tradingRoutes() {
  const router = express.Router();

  // Public payment webhook (secured by shared secret header)
  router.post('/payments/webhook', ctrl.paymentWebhook);

  router.use(jwtAuth, attachAuthUser);

  router.get('/me', ctrl.getProfile);
  router.get('/wallet', ctrl.getWallet);
  router.post('/wallet/deposit', ctrl.createDeposit);
  router.post('/wallet/withdraw', ctrl.createWithdrawal);
  router.get('/wallet/deposits', ctrl.listMyDeposits);
  router.get('/wallet/withdrawals', ctrl.listMyWithdrawals);

  router.get('/assets', ctrl.listAssets);
  router.post('/trades', ctrl.placeTrade);
  router.get('/trades', ctrl.listTrades);
  router.get('/trades/:id', ctrl.getTrade);
  router.get('/stats', ctrl.getStats);

  router.get('/notifications', ctrl.listNotifications);
  router.post('/notifications/read-all', ctrl.markAllNotificationsRead);
  router.post('/notifications/:id/read', ctrl.markNotificationRead);

  router.get('/2fa', ctrl.getTwoFaStatus);
  router.post('/2fa/setup', ctrl.setup2FA);
  router.post('/2fa/enable', ctrl.enable2FA);
  router.post('/2fa/disable', ctrl.disable2FA);

  router.post('/kyc', ctrl.submitKyc);
  router.get('/referral', ctrl.getReferral);

  router.get('/tournaments', ctrl.listTournaments);
  router.post('/tournaments/:id/join', ctrl.joinTournament);
  router.get('/tournaments/:id/leaderboard', ctrl.tournamentLeaderboard);

  router.get('/admin/withdrawals', ctrl.adminListWithdrawals);
  router.post('/admin/withdrawals/:id/resolve', ctrl.adminResolveWithdrawal);
  router.get('/admin/kyc', ctrl.adminListKyc);
  router.post('/admin/kyc/:id/review', ctrl.adminReviewKyc);
  router.get('/admin/reports', ctrl.adminReports);
  router.get('/admin/open-trades', ctrl.adminOpenTrades);
  router.post('/admin/trades/:id/force-settle', ctrl.adminForceSettle);
  router.post('/admin/assets/payout', ctrl.adminUpdatePayout);
  router.get('/admin/ip-blacklist', ctrl.adminListIps);
  router.post('/admin/ip-blacklist', ctrl.adminBlockIp);
  router.delete('/admin/ip-blacklist/:id', ctrl.adminUnblockIp);

  return router;
}

module.exports = { tradingRoutes };
