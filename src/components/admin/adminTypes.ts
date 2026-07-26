export type AdminPageId =
  | 'dashboard'
  | 'analytics'
  | 'reports'
  | 'monitor'
  | 'users'
  | 'kyc'
  | 'accounts'
  | 'roles'
  | 'announcements'
  | 'activity-logs'
  | 'trading-accounts'
  | 'live-trades'
  | 'orders'
  | 'positions'
  | 'assets'
  | 'wallets'
  | 'transactions'
  | 'deposits'
  | 'withdrawals'
  | 'revenue-share'
  | 'settings'
  | 'integrations'
  | 'support';

export const ADMIN_PAGE_META: Record<AdminPageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: "Welcome back, Admin! Here's what's happening today.",
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Platform performance, conversion funnels, and growth metrics.',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Generate, schedule, and export operational reports.',
  },
  monitor: {
    title: 'System Monitor',
    subtitle: 'Live infrastructure health, latency, and incident status.',
  },
  users: {
    title: 'User Management',
    subtitle: 'Search, filter, and manage registered traders.',
  },
  kyc: {
    title: 'KYC Verification',
    subtitle: 'Review identity documents and approve verification requests.',
  },
  accounts: {
    title: 'Accounts',
    subtitle: 'Manage client account profiles, tiers, and status.',
  },
  roles: {
    title: 'Roles & Permissions',
    subtitle: 'Configure admin roles and access control policies.',
  },
  announcements: {
    title: 'Announcements',
    subtitle: 'Publish platform notices to traders and partners.',
  },
  'activity-logs': {
    title: 'Activity Logs',
    subtitle: 'Audit trail of admin and system actions.',
  },
  'trading-accounts': {
    title: 'Trading Accounts',
    subtitle: 'Live, demo, and partner trading account inventory.',
  },
  'live-trades': {
    title: 'Live Trades',
    subtitle: 'Real-time trade stream across all markets.',
  },
  orders: {
    title: 'Orders',
    subtitle: 'Open, filled, and cancelled order book history.',
  },
  positions: {
    title: 'Positions',
    subtitle: 'Open positions with exposure and margin usage.',
  },
  assets: {
    title: 'Assets',
    subtitle: 'Tradable instruments, spreads, and market status.',
  },
  wallets: {
    title: 'Wallets',
    subtitle: 'Client wallet balances and ledger overview.',
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'All ledger movements across deposits, trades, and fees.',
  },
  deposits: {
    title: 'Deposits',
    subtitle: 'Incoming funding requests and settlement status.',
  },
  withdrawals: {
    title: 'Withdrawals',
    subtitle: 'Outgoing payout queue and risk review.',
  },
  'revenue-share': {
    title: 'Revenue Share',
    subtitle: 'Partner IB commissions and payout splits.',
  },
  settings: {
    title: 'System Settings',
    subtitle: 'Platform configuration, branding, and security defaults.',
  },
  integrations: {
    title: 'Integrations',
    subtitle: 'Payment rails, KYC providers, and market data feeds.',
  },
  support: {
    title: 'Support Tickets',
    subtitle: 'Customer support queue and SLA tracking.',
  },
};

export const ADMIN_NAV: Array<{
  label: string;
  items: Array<{ id: AdminPageId; label: string }>;
}> = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'reports', label: 'Reports' },
      { id: 'monitor', label: 'Monitor' },
    ],
  },
  {
    label: 'Management',
    items: [
      { id: 'users', label: 'User Management' },
      { id: 'kyc', label: 'KYC Verification' },
      { id: 'accounts', label: 'Accounts' },
      { id: 'roles', label: 'Roles & Permissions' },
      { id: 'announcements', label: 'Announcements' },
      { id: 'activity-logs', label: 'Activity Logs' },
    ],
  },
  {
    label: 'Trading',
    items: [
      { id: 'trading-accounts', label: 'Trading Accounts' },
      { id: 'live-trades', label: 'Live Trades' },
      { id: 'orders', label: 'Orders' },
      { id: 'positions', label: 'Positions' },
      { id: 'assets', label: 'Assets' },
    ],
  },
  {
    label: 'Financial',
    items: [
      { id: 'wallets', label: 'Wallets' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'deposits', label: 'Deposits' },
      { id: 'withdrawals', label: 'Withdrawals' },
      { id: 'revenue-share', label: 'Revenue Share' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', label: 'System Settings' },
      { id: 'integrations', label: 'Integrations' },
      { id: 'support', label: 'Support Tickets' },
    ],
  },
];
