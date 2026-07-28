const { success } = require('../../utils/response');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../../middleware/error/customErrors');
const walletService = require('./walletService');
const tradeService = require('./tradeService');
const notificationService = require('./notificationService');
const twoFactorService = require('./twoFactorService');
const { withPg } = require('../../config/postgres');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');

function mapErr(err) {
  if (err.code === 'INSUFFICIENT') throw new BadRequestError(err.message);
  if (err.code === 'NO_WALLET' || err.code === 'NO_ASSET' || err.code === 'NOT_FOUND') {
    throw new NotFoundError(err.message);
  }
  if (err.code === 'BAD_DIRECTION' || err.code === 'BAD_AMOUNT' || err.code === 'BAD_EXPIRY') {
    throw new BadRequestError(err.message);
  }
  if (err.code === 'BAD_TOKEN' || err.code === 'NO_SECRET') throw new BadRequestError(err.message);
  throw err;
}

const getProfile = asyncWrapper(async (req, res) => {
  const authUser = req.authUser;
  await walletService.ensureTradingProfile({
    userId: req.auth.userId,
    email: authUser?.email || `${req.auth.userId}@users.local`,
    displayName: [authUser?.profile?.firstName, authUser?.profile?.lastName]
      .filter(Boolean)
      .join(' '),
    phone: authUser?.profile?.phone || '',
    role: req.auth.role,
  });

  const wallet = await walletService.getWalletSummary(req.auth.userId);
  const stats = await tradeService.getTradingStats(req.auth.userId);
  const twoFa = await twoFactorService.get2FAStatus(req.auth.userId);

  return success(res, {
    data: {
      userId: req.auth.userId,
      role: req.auth.role,
      wallet,
      stats,
      twoFa,
    },
  });
});

const getWallet = asyncWrapper(async (req, res) => {
  const wallet = await walletService.getWalletSummary(req.auth.userId);
  if (!wallet) throw new NotFoundError('Wallet not found — call /trading/me first');
  const ledger = await walletService.listLedger(req.auth.userId, {
    limit: Number(req.query.limit || 50),
  });
  return success(res, { data: { wallet, ledger } });
});

const createDeposit = asyncWrapper(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) throw new BadRequestError('amount must be > 0');
  const method = req.body.method || 'manual';
  const instant = req.body.instant !== false && (method === 'manual' || method === 'demo');

  try {
    if (!instant) {
      const deposit = await walletService.createPendingDeposit(req.auth.userId, amount, {
        method,
        providerRef: req.body.providerRef || null,
        meta: req.body.meta || {},
      });
      await notificationService.notify(req.auth.userId, {
        type: 'DEPOSIT',
        title: 'Deposit pending',
        message: `$${amount.toFixed(2)} via ${method} is awaiting confirmation`,
        meta: { depositId: deposit.id },
      });
      return success(res, {
        status: 201,
        message: 'Deposit pending payment confirmation',
        data: {
          deposit,
          payment: {
            provider: method,
            checkoutHint:
              method === 'card'
                ? 'Complete card checkout; webhook will credit wallet'
                : 'Send crypto to the platform address; webhook/admin confirms',
            clientSecret: `demo_secret_${deposit.id}`,
            depositId: deposit.id,
          },
        },
      });
    }

    const result = await walletService.creditDeposit(req.auth.userId, amount, {
      method,
      providerRef: req.body.providerRef || null,
      meta: req.body.meta || {},
    });
    await notificationService.notify(req.auth.userId, {
      type: 'DEPOSIT',
      title: 'Deposit credited',
      message: `$${amount.toFixed(2)} added to your wallet`,
      meta: { depositId: result.deposit.id },
    });
    return success(res, { status: 201, message: 'Deposit completed', data: result });
  } catch (err) {
    return mapErr(err);
  }
});

const listMyDeposits = asyncWrapper(async (req, res) => {
  const data = await walletService.listDeposits(req.auth.userId);
  return success(res, { data });
});

const listMyWithdrawals = asyncWrapper(async (req, res) => {
  const data = await walletService.listWithdrawals(req.auth.userId);
  return success(res, { data });
});

const paymentWebhook = asyncWrapper(async (req, res) => {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || 'vertex_demo_webhook_secret';
  const provided = req.headers['x-payment-secret'] || req.body?.secret;
  if (provided !== secret) throw new ForbiddenError('Invalid webhook secret');

  const depositId = req.body.depositId || req.body.data?.depositId;
  const externalId = req.body.externalId || req.body.id || null;
  if (!depositId) throw new BadRequestError('depositId required');

  await withPg(async (client) => {
    await client.query(
      `insert into payment_events (provider, event_type, external_id, payload, processed)
       values ($1,$2,$3,$4::jsonb,false)
       on conflict do nothing`,
      [
        req.body.provider || 'demo',
        req.body.type || 'payment.completed',
        externalId,
        JSON.stringify(req.body),
      ],
    );
  });

  const result = await walletService.confirmDepositById(depositId, {
    providerRef: externalId,
  });

  if (!result.alreadyCompleted) {
    await notificationService.notify(result.deposit.user_id, {
      type: 'DEPOSIT',
      title: 'Deposit confirmed',
      message: `$${Number(result.deposit.amount).toFixed(2)} credited after payment confirmation`,
      meta: { depositId },
    });
  }

  await withPg(async (client) => {
    if (externalId) {
      await client.query(
        `update payment_events set processed = true
         where provider = $1 and external_id = $2`,
        [req.body.provider || 'demo', externalId],
      );
    }
  });

  return success(res, { message: 'Webhook processed', data: result });
});

const listTournaments = asyncWrapper(async (req, res) => {
  const tournamentService = require('./tournamentService');
  const data = await tournamentService.listTournaments();
  return success(res, { data });
});

const joinTournament = asyncWrapper(async (req, res) => {
  const tournamentService = require('./tournamentService');
  try {
    const data = await tournamentService.joinTournament(req.auth.userId, req.params.id);
    return success(res, { status: 201, message: 'Joined tournament', data });
  } catch (err) {
    return mapErr(err);
  }
});

const tournamentLeaderboard = asyncWrapper(async (req, res) => {
  const tournamentService = require('./tournamentService');
  const data = await tournamentService.leaderboard(req.params.id);
  return success(res, { data });
});

const adminForceSettle = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  try {
    const data = await tradeService.forceSettleTrade(req.params.id, {
      forceResult: req.body.forceResult,
    });
    return success(res, { message: 'Trade force-settled', data });
  } catch (err) {
    return mapErr(err);
  }
});

const adminUpdatePayout = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const pct = Number(req.body.payoutPercent);
  if (!pct || pct < 1 || pct > 95) throw new BadRequestError('payoutPercent 1-95 required');
  const row = await tradeService.updateAssetPayout(req.body.symbol, pct);
  if (!row) throw new NotFoundError('Asset not found');
  return success(res, { data: row });
});

const adminOpenTrades = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const data = await tradeService.listOpenTradesAdmin();
  return success(res, { data });
});

const adminListIps = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const ipBlacklist = require('./ipBlacklist');
  return success(res, { data: await ipBlacklist.listBlockedIps() });
});

const adminBlockIp = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  if (!req.body.ip) throw new BadRequestError('ip required');
  const ipBlacklist = require('./ipBlacklist');
  const data = await ipBlacklist.blockIp(req.body.ip, {
    reason: req.body.reason || '',
    createdBy: req.auth.userId,
  });
  return success(res, { status: 201, data });
});

const adminUnblockIp = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const ipBlacklist = require('./ipBlacklist');
  await ipBlacklist.unblockIp(req.params.id);
  return success(res, { message: 'IP unblocked' });
});

const getTwoFaStatus = asyncWrapper(async (req, res) => {
  const data = await twoFactorService.get2FAStatus(req.auth.userId);
  return success(res, { data });
});

const createWithdrawal = asyncWrapper(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) throw new BadRequestError('amount must be > 0');
  try {
    const result = await walletService.requestWithdrawal(req.auth.userId, amount, {
      method: req.body.method || 'bank',
      accountDetails: req.body.accountDetails || {},
    });
    await notificationService.notify(req.auth.userId, {
      type: 'WITHDRAWAL',
      title: 'Withdrawal requested',
      message: `$${amount.toFixed(2)} pending admin approval`,
      meta: { withdrawalId: result.withdrawal.id },
    });
    return success(res, { status: 201, message: 'Withdrawal requested', data: result });
  } catch (err) {
    return mapErr(err);
  }
});

const listAssets = asyncWrapper(async (req, res) => {
  const assets = await tradeService.listAssets();
  return success(res, { data: assets });
});

const placeTrade = asyncWrapper(async (req, res) => {
  try {
    const trade = await tradeService.placeTrade({
      userId: req.auth.userId,
      symbol: req.body.symbol,
      direction: req.body.direction,
      amount: req.body.amount,
      expirySeconds: req.body.expirySeconds,
    });
    return success(res, { status: 201, message: 'Trade opened', data: trade });
  } catch (err) {
    return mapErr(err);
  }
});

const listTrades = asyncWrapper(async (req, res) => {
  const trades = await tradeService.listTrades(req.auth.userId, {
    status: req.query.status,
    limit: Number(req.query.limit || 50),
    offset: Number(req.query.offset || 0),
  });
  return success(res, { data: trades });
});

const getTrade = asyncWrapper(async (req, res) => {
  const trade = await tradeService.getTrade(req.auth.userId, req.params.id);
  if (!trade) throw new NotFoundError('Trade not found');
  return success(res, { data: trade });
});

const getStats = asyncWrapper(async (req, res) => {
  const stats = await tradeService.getTradingStats(req.auth.userId);
  return success(res, { data: stats });
});

const listNotifications = asyncWrapper(async (req, res) => {
  const items = await notificationService.listNotifications(req.auth.userId, {
    limit: Number(req.query.limit || 30),
    unreadOnly: req.query.unreadOnly === 'true',
  });
  return success(res, { data: items });
});

const markNotificationRead = asyncWrapper(async (req, res) => {
  const item = await notificationService.markRead(req.auth.userId, req.params.id);
  if (!item) throw new NotFoundError('Notification not found');
  return success(res, { data: item });
});

const markAllNotificationsRead = asyncWrapper(async (req, res) => {
  await notificationService.markAllRead(req.auth.userId);
  return success(res, { message: 'All notifications marked read' });
});

const setup2FA = asyncWrapper(async (req, res) => {
  const data = await twoFactorService.setup2FA(
    req.auth.userId,
    req.authUser?.email || req.auth.userId,
  );
  return success(res, { data });
});

const enable2FA = asyncWrapper(async (req, res) => {
  try {
    const data = await twoFactorService.enable2FA(req.auth.userId, req.body.token);
    return success(res, { message: '2FA enabled', data });
  } catch (err) {
    return mapErr(err);
  }
});

const disable2FA = asyncWrapper(async (req, res) => {
  try {
    const data = await twoFactorService.disable2FA(req.auth.userId, req.body.token);
    return success(res, { message: '2FA disabled', data });
  } catch (err) {
    return mapErr(err);
  }
});

const submitKyc = asyncWrapper(async (req, res) => {
  const { documentType, documentUrl, selfieUrl } = req.body;
  if (!documentType) throw new BadRequestError('documentType is required');

  const row = await withPg(async (client) => {
    const { rows } = await client.query(
      `insert into kyc_submissions (user_id, document_type, document_url, selfie_url, status)
       values ($1,$2,$3,$4,'PENDING') returning *`,
      [req.auth.userId, documentType, documentUrl || null, selfieUrl || null],
    );
    await client.query(
      `update trading_profiles set kyc_status = 'PENDING', updated_at = now()
       where user_id = $1`,
      [req.auth.userId],
    );
    return rows[0];
  });

  await notificationService.notify(req.auth.userId, {
    type: 'KYC',
    title: 'KYC submitted',
    message: 'Your documents are pending review',
    meta: { kycId: row.id },
  });

  return success(res, { status: 201, message: 'KYC submitted', data: row });
});

const getReferral = asyncWrapper(async (req, res) => {
  const data = await withPg(async (client) => {
    const profile = await client.query(
      'select referral_code from trading_profiles where user_id = $1',
      [req.auth.userId],
    );
    const refs = await client.query(
      `select * from referrals where referrer_id = $1 order by created_at desc`,
      [req.auth.userId],
    );
    return {
      code: profile.rows[0]?.referral_code || null,
      referrals: refs.rows,
    };
  });
  return success(res, { data });
});

// ── Admin ──────────────────────────────────────────────────────────────────

const adminListWithdrawals = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const rows = await withPg(async (client) => {
    const { rows: r } = await client.query(
      `select * from withdrawals order by created_at desc limit 100`,
    );
    return r;
  });
  return success(res, { data: rows });
});

const adminResolveWithdrawal = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const approve = Boolean(req.body.approve);
  try {
    await walletService.resolveWithdrawal(req.params.id, {
      approve,
      adminId: req.auth.userId,
    });
    return success(res, {
      message: approve ? 'Withdrawal approved' : 'Withdrawal rejected',
    });
  } catch (err) {
    return mapErr(err);
  }
});

const adminListKyc = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const rows = await withPg(async (client) => {
    const { rows: r } = await client.query(
      `select * from kyc_submissions order by created_at desc limit 100`,
    );
    return r;
  });
  return success(res, { data: rows });
});

const adminReviewKyc = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const status = req.body.approve ? 'APPROVED' : 'REJECTED';
  const row = await withPg(async (client) => {
    const { rows } = await client.query(
      `update kyc_submissions
       set status = $2, reviewed_by = $3, reviewed_at = now(), notes = $4, updated_at = now()
       where id = $1
       returning *`,
      [req.params.id, status, req.auth.userId, req.body.notes || null],
    );
    if (!rows[0]) throw new NotFoundError('KYC submission not found');
    await client.query(
      `update trading_profiles set kyc_status = $2, updated_at = now() where user_id = $1`,
      [rows[0].user_id, status],
    );
    return rows[0];
  });

  await notificationService.notify(row.user_id, {
    type: 'KYC',
    title: status === 'APPROVED' ? 'KYC approved' : 'KYC rejected',
    message:
      status === 'APPROVED'
        ? 'Your identity verification was approved'
        : 'Your identity verification was rejected',
    meta: { kycId: row.id },
  });

  return success(res, { data: row });
});

const adminReports = asyncWrapper(async (req, res) => {
  if (req.auth.role !== 'Admin') throw new ForbiddenError('Admin only');
  const data = await withPg(async (client) => {
    const users = await client.query('select count(*)::int as c from trading_profiles');
    const trades = await client.query(
      `select
         count(*)::int as total,
         count(*) filter (where status='OPEN')::int as open,
         count(*) filter (where status='WON')::int as won,
         count(*) filter (where status='LOST')::int as lost,
         coalesce(sum(amount),0) as volume,
         coalesce(sum(payout_amount) filter (where status='WON'),0) as payouts
       from trades`,
    );
    const money = await client.query(
      `select
         coalesce(sum(amount) filter (where status='COMPLETED'),0) as deposits
       from deposits`,
    );
    const wd = await client.query(
      `select
         count(*) filter (where status='PENDING')::int as pending,
         coalesce(sum(amount) filter (where status='COMPLETED'),0) as completed_amount
       from withdrawals`,
    );
    return {
      users: users.rows[0].c,
      trades: trades.rows[0],
      deposits: money.rows[0],
      withdrawals: wd.rows[0],
    };
  });
  return success(res, { data });
});

module.exports = {
  getProfile,
  getWallet,
  createDeposit,
  createWithdrawal,
  listMyDeposits,
  listMyWithdrawals,
  paymentWebhook,
  listAssets,
  placeTrade,
  listTrades,
  getTrade,
  getStats,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  setup2FA,
  enable2FA,
  disable2FA,
  getTwoFaStatus,
  submitKyc,
  getReferral,
  listTournaments,
  joinTournament,
  tournamentLeaderboard,
  adminListWithdrawals,
  adminResolveWithdrawal,
  adminListKyc,
  adminReviewKyc,
  adminReports,
  adminForceSettle,
  adminUpdatePayout,
  adminOpenTrades,
  adminListIps,
  adminBlockIp,
  adminUnblockIp,
};
