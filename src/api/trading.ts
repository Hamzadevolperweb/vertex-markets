import { apiRequest } from './client';

export type WalletSummary = {
  balance: number;
  bonusBalance: number;
  lockedBalance: number;
  availableBalance: number;
  totalEquity: number;
  currency: string;
};

export type TradingAsset = {
  id: string;
  symbol: string;
  name: string;
  category: string;
  payoutPercent: number;
  minAmount: number;
  maxAmount: number;
  expiryOptionsSec: number[];
  is_otc?: boolean;
};

export type Trade = {
  id: string;
  symbol: string;
  direction: 'UP' | 'DOWN';
  amount: number;
  payoutPercent: number;
  entryPrice: number;
  exitPrice: number | null;
  expirySeconds: number;
  openedAt: string;
  expiresAt: string;
  settledAt?: string | null;
  status: 'OPEN' | 'WON' | 'LOST' | 'CANCELLED' | 'REFUNDED';
  payoutAmount: number;
  result?: string | null;
};

export async function fetchTradingProfile() {
  return apiRequest<{
    userId: string;
    role: string;
    wallet: WalletSummary;
    stats: Record<string, number>;
    twoFa: { enabled: boolean };
  }>('/trading/me', { auth: true });
}

export async function fetchWallet() {
  return apiRequest<{ wallet: WalletSummary; ledger: any[] }>('/trading/wallet', {
    auth: true,
  });
}

export async function createDeposit(
  amount: number,
  method: string = 'manual',
  opts: { instant?: boolean } = {},
) {
  return apiRequest<any>('/trading/wallet/deposit', {
    method: 'POST',
    auth: true,
    body: { amount, method, instant: opts.instant },
  });
}

export async function createWithdrawal(
  amount: number,
  accountDetails: Record<string, string> = {},
  method = 'bank',
) {
  return apiRequest('/trading/wallet/withdraw', {
    method: 'POST',
    auth: true,
    body: { amount, method, accountDetails },
  });
}

export async function fetchMyDeposits() {
  return apiRequest<any[]>('/trading/wallet/deposits', { auth: true });
}

export async function fetchMyWithdrawals() {
  return apiRequest<any[]>('/trading/wallet/withdrawals', { auth: true });
}

export async function confirmDemoPayment(depositId: string) {
  return apiRequest('/trading/payments/webhook', {
    method: 'POST',
    body: {
      secret: 'vertex_demo_webhook_secret',
      provider: 'demo',
      type: 'payment.completed',
      depositId,
      externalId: `demo_${depositId}_${Date.now()}`,
    },
  });
}

export async function fetchTradingAssets() {
  return apiRequest<TradingAsset[]>('/trading/assets', { auth: true });
}

export async function placeBinaryTrade(input: {
  symbol: string;
  direction: 'UP' | 'DOWN';
  amount: number;
  expirySeconds: number;
}) {
  return apiRequest<Trade>('/trading/trades', {
    method: 'POST',
    auth: true,
    body: input,
  });
}

export async function fetchTrades(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest<Trade[]>(`/trading/trades${q}`, { auth: true });
}

export async function fetchTradingStats() {
  return apiRequest<Record<string, number>>('/trading/stats', { auth: true });
}

export async function fetchNotifications() {
  return apiRequest<
    Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      is_read: boolean;
      created_at: string;
    }>
  >('/trading/notifications', { auth: true });
}

export async function markAllNotificationsRead() {
  return apiRequest('/trading/notifications/read-all', { method: 'POST', auth: true });
}

export async function setup2FA() {
  return apiRequest<{ secret: string; qrCodeDataUrl: string; otpauthUrl: string }>(
    '/trading/2fa/setup',
    { method: 'POST', auth: true },
  );
}

export async function enable2FA(token: string) {
  return apiRequest('/trading/2fa/enable', {
    method: 'POST',
    auth: true,
    body: { token },
  });
}

export async function disable2FA(token: string) {
  return apiRequest('/trading/2fa/disable', {
    method: 'POST',
    auth: true,
    body: { token },
  });
}

export async function fetchReferral() {
  return apiRequest<{ code: string; referrals: any[] }>('/trading/referral', { auth: true });
}

export async function submitTradingKyc(input: {
  documentType: string;
  documentUrl?: string;
  selfieUrl?: string;
}) {
  return apiRequest('/trading/kyc', { method: 'POST', auth: true, body: input });
}

export async function fetchTournaments() {
  return apiRequest<any[]>('/trading/tournaments', { auth: true });
}

export async function joinTournament(id: string) {
  return apiRequest(`/trading/tournaments/${id}/join`, { method: 'POST', auth: true });
}

export async function adminTradingReports() {
  return apiRequest<any>('/trading/admin/reports', { auth: true });
}

export async function adminListWithdrawals() {
  return apiRequest<any[]>('/trading/admin/withdrawals', { auth: true });
}

export async function adminResolveWithdrawal(id: string, approve: boolean) {
  return apiRequest(`/trading/admin/withdrawals/${id}/resolve`, {
    method: 'POST',
    auth: true,
    body: { approve },
  });
}

export async function adminListKyc() {
  return apiRequest<any[]>('/trading/admin/kyc', { auth: true });
}

export async function adminReviewKyc(id: string, approve: boolean, notes?: string) {
  return apiRequest(`/trading/admin/kyc/${id}/review`, {
    method: 'POST',
    auth: true,
    body: { approve, notes },
  });
}

export async function adminOpenTrades() {
  return apiRequest<Trade[]>('/trading/admin/open-trades', { auth: true });
}

export async function adminForceSettle(id: string, forceResult?: 'WON' | 'LOST') {
  return apiRequest(`/trading/admin/trades/${id}/force-settle`, {
    method: 'POST',
    auth: true,
    body: { forceResult },
  });
}

export async function adminUpdatePayout(symbol: string, payoutPercent: number) {
  return apiRequest('/trading/admin/assets/payout', {
    method: 'POST',
    auth: true,
    body: { symbol, payoutPercent },
  });
}

export function connectTradingSocket(onMessage: (data: unknown) => void) {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = import.meta.env.VITE_WS_HOST || window.location.host;
  const ws = new WebSocket(`${proto}://${host}/ws/trading`);
  ws.onmessage = (ev) => {
    try {
      onMessage(JSON.parse(ev.data));
    } catch {
      // ignore
    }
  };
  return ws;
}
