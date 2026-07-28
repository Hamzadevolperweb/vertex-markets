import { useMemo, useState, type ReactNode } from 'react';
import {
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Activity,
  Download,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ADMIN_PAGE_META, type AdminPageId } from './adminTypes';
import AdminTradingOps from './AdminTradingOps';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type StatusTone =
  | 'Active'
  | 'Pending'
  | 'Completed'
  | 'Failed'
  | 'Approved'
  | 'Rejected'
  | 'Open'
  | 'Closed'
  | 'Filled'
  | 'Cancelled'
  | 'Connected'
  | 'Disconnected'
  | 'Healthy'
  | 'Degraded'
  | 'Down'
  | 'Published'
  | 'Draft'
  | 'Processing'
  | 'Suspended'
  | 'Verified'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'Live'
  | 'Demo';

interface StatCard {
  label: string;
  value: string;
  change?: string;
  up?: boolean;
}

interface TableColumn {
  key: string;
  label: string;
  render?: (row: Record<string, string>) => ReactNode;
}

/* ─── Shared helpers ────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const tone = status as StatusTone;
  const styles: Record<string, string> = {
    Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Filled: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Connected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Live: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Open: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    Processing: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Degraded: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Demo: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Failed: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Disconnected: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Down: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Suspended: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    High: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Closed: 'bg-white/10 text-white/60 border-white/10',
    Low: 'bg-white/10 text-white/60 border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[tone] ?? 'bg-white/10 text-white/60 border-white/10'
      }`}
    >
      {status}
    </span>
  );
}

function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/50">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function StatCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
          {card.change ? (
            <p
              className={`mt-1 text-xs font-medium ${
                card.up ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {card.change}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Toolbar({
  search,
  onSearch,
  placeholder = 'Search…',
  actions,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#1e60ff]/50 focus:ring-1 focus:ring-[#1e60ff]/40"
        />
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function DataTable({
  columns,
  rows,
  search,
  pageSize = 5,
}: {
  columns: TableColumn[];
  rows: Record<string, string>[];
  search: string;
  pageSize?: number;
}) {
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0d]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/40">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-10 text-center text-white/40"
                >
                  No results found
                </td>
              </tr>
            ) : (
              slice.map((row, idx) => (
                <tr
                  key={row.id ?? `${safePage}-${idx}`}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-white/80">
                      {col.render
                        ? col.render(row)
                        : col.key === 'status'
                          ? <StatusBadge status={row[col.key]} />
                          : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-[#60a5fa]"
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-[#60a5fa]"
                        aria-label="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                        aria-label="More"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3 text-xs text-white/45">
        <span>
          Showing {filtered.length === 0 ? 0 : safePage * pageSize + 1}–
          {Math.min((safePage + 1) * pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-2.5 py-1.5 disabled:opacity-40 hover:bg-white/[0.04]"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <span className="text-white/60">
            {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-2.5 py-1.5 disabled:opacity-40 hover:bg-white/[0.04]"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  variant = 'ghost',
}: {
  children: ReactNode;
  variant?: 'ghost' | 'primary';
}) {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors';
  if (variant === 'primary') {
    return (
      <button
        type="button"
        className={`${base} bg-[#1e60ff] text-white hover:bg-[#1e60ff]/90`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`${base} border border-white/[0.06] bg-white/[0.03] text-white/80 hover:bg-white/[0.06]`}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-[#0a0a0d] px-5 py-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-0.5 text-xs text-white/45">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-[#1e60ff]' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function TablePage({
  pageId,
  stats,
  columns,
  rows,
  searchPlaceholder,
  actions,
}: {
  pageId: Exclude<AdminPageId, 'dashboard'>;
  stats: StatCard[];
  columns: TableColumn[];
  rows: Record<string, string>[];
  searchPlaceholder?: string;
  actions?: ReactNode;
}) {
  const meta = ADMIN_PAGE_META[pageId];
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          actions ?? (
            <>
              <ActionBtn>
                <Download className="h-4 w-4" /> Export
              </ActionBtn>
              <ActionBtn variant="primary">
                <Plus className="h-4 w-4" /> Create
              </ActionBtn>
            </>
          )
        }
      />
      <StatCards cards={stats} />
      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder={searchPlaceholder}
        actions={
          <ActionBtn>
            <RefreshCw className="h-4 w-4" /> Refresh
          </ActionBtn>
        }
      />
      <DataTable columns={columns} rows={rows} search={search} />
    </div>
  );
}

/* ─── Mock data ─────────────────────────────────────────────────────────── */

const USERS = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@vertex.io', tier: 'Pro', status: 'Active', joined: '2026-01-12' },
  { id: 'u2', name: 'Priya Shah', email: 'priya@mail.com', tier: 'Standard', status: 'Pending', joined: '2026-03-04' },
  { id: 'u3', name: 'James Okoye', email: 'j.okoye@firm.co', tier: 'VIP', status: 'Active', joined: '2025-11-20' },
  { id: 'u4', name: 'Elena Ruiz', email: 'elena.ruiz@pm.me', tier: 'Standard', status: 'Suspended', joined: '2026-02-18' },
  { id: 'u5', name: 'Chen Wei', email: 'chen.wei@trade.cn', tier: 'Pro', status: 'Active', joined: '2025-09-01' },
  { id: 'u6', name: 'Sara Klein', email: 'sara.k@outlook.com', tier: 'Demo', status: 'Pending', joined: '2026-06-22' },
];

const KYC_ROWS = [
  { id: 'k1', user: 'Alex Morgan', document: 'Passport', country: 'US', status: 'Approved', submitted: '2026-06-01' },
  { id: 'k2', user: 'Priya Shah', document: 'National ID', country: 'IN', status: 'Pending', submitted: '2026-07-12' },
  { id: 'k3', user: 'James Okoye', document: 'Driver License', country: 'NG', status: 'Approved', submitted: '2026-05-18' },
  { id: 'k4', user: 'Elena Ruiz', document: 'Passport', country: 'ES', status: 'Rejected', submitted: '2026-07-02' },
  { id: 'k5', user: 'Chen Wei', document: 'Residence Card', country: 'CN', status: 'Pending', submitted: '2026-07-20' },
  { id: 'k6', user: 'Sara Klein', document: 'Passport', country: 'DE', status: 'Processing', submitted: '2026-07-24' },
];

const ACCOUNTS = [
  { id: 'a1', account: 'ACC-100284', owner: 'Alex Morgan', type: 'Individual', balance: '$42,180', status: 'Active' },
  { id: 'a2', account: 'ACC-100391', owner: 'Priya Shah', type: 'Individual', balance: '$1,240', status: 'Pending' },
  { id: 'a3', account: 'ACC-100455', owner: 'Vertex Partners', type: 'Corporate', balance: '$812,900', status: 'Active' },
  { id: 'a4', account: 'ACC-100512', owner: 'Elena Ruiz', type: 'Individual', balance: '$0', status: 'Suspended' },
  { id: 'a5', account: 'ACC-100601', owner: 'Chen Wei', type: 'Individual', balance: '$128,440', status: 'Active' },
  { id: 'a6', account: 'ACC-100714', owner: 'Nova Capital', type: 'Corporate', balance: '$2.1M', status: 'Verified' },
];

const ANNOUNCEMENTS = [
  { id: 'n1', title: 'Scheduled maintenance window', audience: 'All users', status: 'Published', scheduled: '2026-07-28 02:00', author: 'Ops' },
  { id: 'n2', title: 'New EURUSD spreads', audience: 'Pro traders', status: 'Published', scheduled: '2026-07-20 09:00', author: 'Markets' },
  { id: 'n3', title: 'KYC document refresh', audience: 'Pending KYC', status: 'Draft', scheduled: '—', author: 'Compliance' },
  { id: 'n4', title: 'Partner IB program update', audience: 'Partners', status: 'Published', scheduled: '2026-07-15 12:00', author: 'Growth' },
  { id: 'n5', title: 'Mobile app 2.4 release', audience: 'All users', status: 'Draft', scheduled: '2026-08-01 10:00', author: 'Product' },
  { id: 'n6', title: 'Holiday trading hours', audience: 'All users', status: 'Published', scheduled: '2026-07-10 08:00', author: 'Ops' },
];

const ACTIVITY_LOGS = [
  { id: 'l1', actor: 'admin@vertex', action: 'Approved KYC', target: 'Priya Shah', ip: '10.0.4.12', time: '2 min ago' },
  { id: 'l2', actor: 'system', action: 'Margin call triggered', target: 'ACC-100512', ip: '—', time: '14 min ago' },
  { id: 'l3', actor: 'risk@vertex', action: 'Flagged withdrawal', target: 'WD-90821', ip: '10.0.4.88', time: '32 min ago' },
  { id: 'l4', actor: 'admin@vertex', action: 'Updated role', target: 'Support Agent', ip: '10.0.4.12', time: '1 hr ago' },
  { id: 'l5', actor: 'ops@vertex', action: 'Enabled maintenance', target: 'Platform', ip: '10.0.2.5', time: '3 hr ago' },
  { id: 'l6', actor: 'system', action: 'Price feed failover', target: 'Feed-B', ip: '—', time: '5 hr ago' },
];

const TRADING_ACCOUNTS = [
  { id: 't1', login: '501284', owner: 'Alex Morgan', mode: 'Live', equity: '$38,920', leverage: '1:100', status: 'Active' },
  { id: 't2', login: '501301', owner: 'Priya Shah', mode: 'Demo', equity: '$10,000', leverage: '1:200', status: 'Active' },
  { id: 't3', login: '501455', owner: 'James Okoye', mode: 'Live', equity: '$215,400', leverage: '1:50', status: 'Active' },
  { id: 't4', login: '501512', owner: 'Elena Ruiz', mode: 'Live', equity: '$420', leverage: '1:100', status: 'Suspended' },
  { id: 't5', login: '501601', owner: 'Chen Wei', mode: 'Live', equity: '$91,200', leverage: '1:100', status: 'Active' },
  { id: 't6', login: '501714', owner: 'Sara Klein', mode: 'Demo', equity: '$50,000', leverage: '1:500', status: 'Pending' },
];

const LIVE_TRADES = [
  { id: 'lt1', time: '03:28:14', pair: 'BTC/USDT', side: 'Buy', size: '0.42', price: '67,842', pnl: '+$184', status: 'Filled' },
  { id: 'lt2', time: '03:27:51', pair: 'EUR/USD', side: 'Sell', size: '2.0 lot', price: '1.0842', pnl: '-$26', status: 'Filled' },
  { id: 'lt3', time: '03:26:08', pair: 'ETH/USDT', side: 'Buy', size: '3.1', price: '3,412', pnl: '+$92', status: 'Open' },
  { id: 'lt4', time: '03:24:33', pair: 'XAU/USD', side: 'Buy', size: '0.5 lot', price: '2,384', pnl: '+$41', status: 'Filled' },
  { id: 'lt5', time: '03:22:10', pair: 'SOL/USDT', side: 'Sell', size: '120', price: '148.2', pnl: '-$18', status: 'Cancelled' },
  { id: 'lt6', time: '03:19:47', pair: 'GBP/USD', side: 'Buy', size: '1.5 lot', price: '1.2761', pnl: '+$57', status: 'Filled' },
];

const ORDERS = [
  { id: 'o1', orderId: 'ORD-88210', account: '501284', pair: 'BTC/USDT', type: 'Limit', status: 'Open', created: '2026-07-27 02:10' },
  { id: 'o2', orderId: 'ORD-88211', account: '501455', pair: 'EUR/USD', type: 'Market', status: 'Filled', created: '2026-07-27 02:05' },
  { id: 'o3', orderId: 'ORD-88212', account: '501601', pair: 'ETH/USDT', type: 'Stop', status: 'Pending', created: '2026-07-27 01:58' },
  { id: 'o4', orderId: 'ORD-88213', account: '501301', pair: 'XAU/USD', type: 'Limit', status: 'Cancelled', created: '2026-07-27 01:40' },
  { id: 'o5', orderId: 'ORD-88214', account: '501714', pair: 'SOL/USDT', type: 'Market', status: 'Filled', created: '2026-07-27 01:22' },
  { id: 'o6', orderId: 'ORD-88215', account: '501512', pair: 'GBP/USD', type: 'Limit', status: 'Open', created: '2026-07-27 00:55' },
];

const POSITIONS = [
  { id: 'p1', account: '501284', pair: 'BTC/USDT', side: 'Long', size: '0.42', margin: '$4,120', pnl: '+$184', status: 'Open' },
  { id: 'p2', account: '501455', pair: 'EUR/USD', side: 'Short', size: '2.0', margin: '$2,168', pnl: '-$26', status: 'Open' },
  { id: 'p3', account: '501601', pair: 'ETH/USDT', side: 'Long', size: '3.1', margin: '$5,280', pnl: '+$92', status: 'Open' },
  { id: 'p4', account: '501301', pair: 'XAU/USD', side: 'Long', size: '0.5', margin: '$1,192', pnl: '+$41', status: 'Closed' },
  { id: 'p5', account: '501714', pair: 'SOL/USDT', side: 'Short', size: '120', margin: '$890', pnl: '-$18', status: 'Closed' },
  { id: 'p6', account: '501455', pair: 'GBP/USD', side: 'Long', size: '1.5', margin: '$1,914', pnl: '+$57', status: 'Open' },
];

const ASSETS = [
  { id: 'as1', symbol: 'BTC/USDT', class: 'Crypto', spread: '0.02%', volume24h: '$4.2B', status: 'Active' },
  { id: 'as2', symbol: 'EUR/USD', class: 'Forex', spread: '0.6 pip', volume24h: '$1.1B', status: 'Active' },
  { id: 'as3', symbol: 'XAU/USD', class: 'Metals', spread: '0.25', volume24h: '$620M', status: 'Active' },
  { id: 'as4', symbol: 'SOL/USDT', class: 'Crypto', spread: '0.04%', volume24h: '$890M', status: 'Active' },
  { id: 'as5', symbol: 'US30', class: 'Index', spread: '1.4 pts', volume24h: '$310M', status: 'Suspended' },
  { id: 'as6', symbol: 'AAPL', class: 'Stock', spread: '0.03%', volume24h: '$180M', status: 'Pending' },
];

const WALLETS = [
  { id: 'w1', user: 'Alex Morgan', currency: 'USDT', available: '28,400', locked: '4,120', status: 'Active' },
  { id: 'w2', user: 'Priya Shah', currency: 'USD', available: '1,240', locked: '0', status: 'Active' },
  { id: 'w3', user: 'James Okoye', currency: 'BTC', available: '1.842', locked: '0.12', status: 'Active' },
  { id: 'w4', user: 'Elena Ruiz', currency: 'USDT', available: '0', locked: '0', status: 'Suspended' },
  { id: 'w5', user: 'Chen Wei', currency: 'ETH', available: '42.6', locked: '3.1', status: 'Active' },
  { id: 'w6', user: 'Nova Capital', currency: 'USD', available: '812,900', locked: '45,000', status: 'Verified' },
];

const TRANSACTIONS = [
  { id: 'x1', ref: 'TX-44021', type: 'Deposit', user: 'Alex Morgan', amount: '+$5,000', status: 'Completed', time: '2026-07-27 01:12' },
  { id: 'x2', ref: 'TX-44022', type: 'Trade fee', user: 'James Okoye', amount: '-$12.40', status: 'Completed', time: '2026-07-27 01:05' },
  { id: 'x3', ref: 'TX-44023', type: 'Withdrawal', user: 'Chen Wei', amount: '-$2,500', status: 'Pending', time: '2026-07-27 00:48' },
  { id: 'x4', ref: 'TX-44024', type: 'Transfer', user: 'Priya Shah', amount: '+$800', status: 'Completed', time: '2026-07-26 23:10' },
  { id: 'x5', ref: 'TX-44025', type: 'Rebate', user: 'Nova Capital', amount: '+$1,240', status: 'Completed', time: '2026-07-26 21:00' },
  { id: 'x6', ref: 'TX-44026', type: 'Withdrawal', user: 'Elena Ruiz', amount: '-$420', status: 'Failed', time: '2026-07-26 18:33' },
];

const DEPOSITS = [
  { id: 'd1', ref: 'DP-2201', user: 'Alex Morgan', method: 'Wire', amount: '$5,000', status: 'Completed', time: '2026-07-27 01:12' },
  { id: 'd2', ref: 'DP-2202', user: 'Priya Shah', method: 'Card', amount: '$800', status: 'Completed', time: '2026-07-26 23:10' },
  { id: 'd3', ref: 'DP-2203', user: 'Chen Wei', method: 'Crypto', amount: '$12,400', status: 'Pending', time: '2026-07-26 20:44' },
  { id: 'd4', ref: 'DP-2204', user: 'James Okoye', method: 'Wire', amount: '$25,000', status: 'Processing', time: '2026-07-26 18:01' },
  { id: 'd5', ref: 'DP-2205', user: 'Sara Klein', method: 'Card', amount: '$250', status: 'Failed', time: '2026-07-26 15:22' },
  { id: 'd6', ref: 'DP-2206', user: 'Nova Capital', method: 'Wire', amount: '$100,000', status: 'Completed', time: '2026-07-25 11:00' },
];

const WITHDRAWALS = [
  { id: 'wd1', ref: 'WD-90818', user: 'Chen Wei', method: 'Crypto', amount: '$2,500', status: 'Pending', time: '2026-07-27 00:48' },
  { id: 'wd2', ref: 'WD-90819', user: 'Alex Morgan', method: 'Wire', amount: '$1,200', status: 'Completed', time: '2026-07-26 19:30' },
  { id: 'wd3', ref: 'WD-90820', user: 'James Okoye', method: 'Wire', amount: '$8,000', status: 'Processing', time: '2026-07-26 16:12' },
  { id: 'wd4', ref: 'WD-90821', user: 'Elena Ruiz', method: 'Card', amount: '$420', status: 'Failed', time: '2026-07-26 18:33' },
  { id: 'wd5', ref: 'WD-90822', user: 'Nova Capital', method: 'Wire', amount: '$45,000', status: 'Approved', time: '2026-07-25 14:00' },
  { id: 'wd6', ref: 'WD-90823', user: 'Priya Shah', method: 'Crypto', amount: '$300', status: 'Pending', time: '2026-07-27 02:05' },
];

const REVENUE_SHARE = [
  { id: 'r1', partner: 'Nova Capital', clients: '128', volume: '$4.2M', commission: '$18,420', status: 'Active' },
  { id: 'r2', partner: 'Atlas IB', clients: '64', volume: '$1.8M', commission: '$7,910', status: 'Active' },
  { id: 'r3', partner: 'Summit Brokers', clients: '41', volume: '$980K', commission: '$4,120', status: 'Pending' },
  { id: 'r4', partner: 'Orbit Partners', clients: '22', volume: '$410K', commission: '$1,640', status: 'Active' },
  { id: 'r5', partner: 'Delta Network', clients: '15', volume: '$220K', commission: '$880', status: 'Suspended' },
  { id: 'r6', partner: 'Prime Link', clients: '9', volume: '$95K', commission: '$380', status: 'Pending' },
];

const REPORTS = [
  { id: 'rp1', name: 'Daily trading volume', type: 'Scheduled', format: 'CSV', status: 'Completed', lastRun: '2026-07-27 00:05' },
  { id: 'rp2', name: 'KYC backlog', type: 'On-demand', format: 'PDF', status: 'Completed', lastRun: '2026-07-26 16:40' },
  { id: 'rp3', name: 'Withdrawal risk review', type: 'Scheduled', format: 'XLSX', status: 'Processing', lastRun: '2026-07-27 02:00' },
  { id: 'rp4', name: 'Partner commissions', type: 'Scheduled', format: 'CSV', status: 'Completed', lastRun: '2026-07-26 23:00' },
  { id: 'rp5', name: 'Inactive accounts', type: 'On-demand', format: 'PDF', status: 'Failed', lastRun: '2026-07-25 11:20' },
  { id: 'rp6', name: 'System audit trail', type: 'Scheduled', format: 'JSON', status: 'Pending', lastRun: '—' },
];

const SUPPORT = [
  { id: 's1', ticket: 'SUP-4410', user: 'Alex Morgan', subject: 'Deposit not credited', priority: 'High', status: 'Open', updated: '12 min ago' },
  { id: 's2', ticket: 'SUP-4411', user: 'Priya Shah', subject: 'KYC document upload', priority: 'Medium', status: 'Pending', updated: '40 min ago' },
  { id: 's3', ticket: 'SUP-4412', user: 'Chen Wei', subject: 'Leverage change request', priority: 'Low', status: 'Open', updated: '1 hr ago' },
  { id: 's4', ticket: 'SUP-4413', user: 'Elena Ruiz', subject: 'Account suspension appeal', priority: 'High', status: 'Processing', updated: '2 hr ago' },
  { id: 's5', ticket: 'SUP-4414', user: 'James Okoye', subject: 'API key rotation', priority: 'Medium', status: 'Closed', updated: '5 hr ago' },
  { id: 's6', ticket: 'SUP-4415', user: 'Sara Klein', subject: 'Demo balance reset', priority: 'Low', status: 'Completed', updated: '1 day ago' },
];

/* ─── Special pages ─────────────────────────────────────────────────────── */

function AnalyticsPage() {
  const meta = ADMIN_PAGE_META.analytics;
  const bars = [
    { label: 'Mon', value: 62 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 54 },
    { label: 'Thu', value: 88 },
    { label: 'Fri', value: 71 },
    { label: 'Sat', value: 45 },
    { label: 'Sun', value: 58 },
  ];
  const funnel = [
    { label: 'Visitors', value: 48200, pct: 100 },
    { label: 'Signups', value: 8640, pct: 18 },
    { label: 'KYC started', value: 5120, pct: 11 },
    { label: 'Funded', value: 2480, pct: 5 },
    { label: 'Active traders', value: 1620, pct: 3 },
  ];

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <>
            <ActionBtn>
              <Download className="h-4 w-4" /> Export
            </ActionBtn>
            <ActionBtn variant="primary">Last 7 days</ActionBtn>
          </>
        }
      />
      <StatCards
        cards={[
          { label: 'DAU', value: '5,683', change: '+12.4%', up: true },
          { label: 'Conversion', value: '3.4%', change: '+0.4%', up: true },
          { label: 'Avg. session', value: '8m 42s', change: '-1.2%', up: false },
          { label: 'Revenue / user', value: '$36.20', change: '+8.1%', up: true },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5">
          <h3 className="text-sm font-medium text-white">Weekly volume index</h3>
          <p className="mt-1 text-xs text-white/40">Relative trading activity by day</p>
          <div className="mt-6 flex h-48 items-end gap-3">
            {bars.map((b) => (
              <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#1e60ff] to-[#60a5fa]"
                  style={{ height: `${b.value}%` }}
                />
                <span className="text-[11px] text-white/40">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5">
          <h3 className="text-sm font-medium text-white">Acquisition funnel</h3>
          <p className="mt-1 text-xs text-white/40">Visitor to funded trader</p>
          <div className="mt-5 space-y-3">
            {funnel.map((step) => (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-white/70">{step.label}</span>
                  <span className="text-white/45">
                    {step.value.toLocaleString()} · {step.pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[#1e60ff]"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonitorPage() {
  const meta = ADMIN_PAGE_META.monitor;
  const services = [
    { name: 'Trade Engine', status: 'Healthy', latency: '12ms', uptime: '99.99%', icon: Activity },
    { name: 'Price Feed A', status: 'Healthy', latency: '8ms', uptime: '99.98%', icon: Server },
    { name: 'Price Feed B', status: 'Degraded', latency: '94ms', uptime: '99.40%', icon: Server },
    { name: 'KYC Provider', status: 'Healthy', latency: '210ms', uptime: '99.92%', icon: Shield },
    { name: 'Payment Gateway', status: 'Healthy', latency: '180ms', uptime: '99.95%', icon: CheckCircle2 },
    { name: 'Notification Bus', status: 'Down', latency: '—', uptime: '97.10%', icon: AlertTriangle },
  ];

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <ActionBtn>
            <RefreshCw className="h-4 w-4" /> Refresh status
          </ActionBtn>
        }
      />
      <StatCards
        cards={[
          { label: 'Services up', value: '5 / 6', change: '1 incident', up: false },
          { label: 'Avg latency', value: '84ms', change: '-6ms', up: true },
          { label: 'Error rate', value: '0.12%', change: '+0.03%', up: false },
          { label: 'Open incidents', value: '1', change: 'P2', up: false },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.name}
              className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e60ff]/15 text-[#60a5fa]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{svc.name}</p>
                    <p className="mt-0.5 text-xs text-white/40">Uptime {svc.uptime}</p>
                  </div>
                </div>
                <StatusBadge status={svc.status} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                <span>Latency</span>
                <span className="font-medium text-white/80">{svc.latency}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RolesPage() {
  const meta = ADMIN_PAGE_META.roles;
  const roles = [
    {
      name: 'Super Admin',
      users: 3,
      permissions: ['Full access', 'Billing', 'Roles', 'Force logout'],
      status: 'Active',
    },
    {
      name: 'Compliance Officer',
      users: 8,
      permissions: ['KYC review', 'Withdrawals', 'Audit logs', 'User freeze'],
      status: 'Active',
    },
    {
      name: 'Support Agent',
      users: 24,
      permissions: ['Tickets', 'User view', 'Reset 2FA'],
      status: 'Active',
    },
    {
      name: 'Risk Analyst',
      users: 6,
      permissions: ['Positions', 'Margin alerts', 'Trade review'],
      status: 'Active',
    },
    {
      name: 'Finance Ops',
      users: 5,
      permissions: ['Deposits', 'Payouts', 'Revenue share'],
      status: 'Active',
    },
    {
      name: 'Read-only Auditor',
      users: 2,
      permissions: ['View dashboards', 'Export reports'],
      status: 'Pending',
    },
  ];

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <ActionBtn variant="primary">
            <Plus className="h-4 w-4" /> New role
          </ActionBtn>
        }
      />
      <StatCards
        cards={[
          { label: 'Roles', value: '6', change: '+1 this month', up: true },
          { label: 'Admins', value: '48', change: '+4', up: true },
          { label: 'Custom policies', value: '12', change: 'Stable', up: true },
          { label: 'Pending invites', value: '3', change: '-2', up: true },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.name}
            className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e60ff]/15 text-[#60a5fa]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{role.name}</p>
                  <p className="mt-0.5 text-xs text-white/40">{role.users} users assigned</p>
                </div>
              </div>
              <StatusBadge status={role.status} />
            </div>
            <ul className="mt-4 space-y-1.5">
              {role.permissions.map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs text-white/55">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#60a5fa]" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.04]"
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.04]"
              >
                Permissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const meta = ADMIN_PAGE_META.settings;
  const [twoFA, setTwoFA] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [signup, setSignup] = useState(true);
  const [withdrawals, setWithdrawals] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [platformName, setPlatformName] = useState('Vertex Markets');
  const [supportEmail, setSupportEmail] = useState('support@vertexmarkets.com');
  const [defaultLeverage, setDefaultLeverage] = useState('1:100');
  const [minDeposit, setMinDeposit] = useState('100');

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={<ActionBtn variant="primary">Save changes</ActionBtn>}
      />
      <StatCards
        cards={[
          { label: 'Environment', value: 'Production' },
          { label: 'Last config deploy', value: '2h ago' },
          { label: 'Feature flags', value: '18' },
          { label: 'Pending restarts', value: '0' },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-3">
          <h3 className="mb-2 text-sm font-medium text-white">Security & availability</h3>
          <Toggle
            checked={twoFA}
            onChange={setTwoFA}
            label="Require 2FA for admins"
            description="Enforce TOTP before sensitive admin actions."
          />
          <Toggle
            checked={maintenance}
            onChange={setMaintenance}
            label="Maintenance mode"
            description="Show maintenance banner and block new logins."
          />
          <Toggle
            checked={signup}
            onChange={setSignup}
            label="Public signup"
            description="Allow new trader registrations from the website."
          />
          <Toggle
            checked={withdrawals}
            onChange={setWithdrawals}
            label="Withdrawals enabled"
            description="Process outgoing payout requests."
          />
          <Toggle
            checked={emailAlerts}
            onChange={setEmailAlerts}
            label="Email alerts"
            description="Notify ops on high-risk events and outages."
          />
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5">
          <h3 className="text-sm font-medium text-white">Platform defaults</h3>
          <p className="mt-1 text-xs text-white/40">Branding and account configuration</p>
          <div className="mt-5 space-y-4">
            {(
              [
                ['Platform name', platformName, setPlatformName],
                ['Support email', supportEmail, setSupportEmail],
                ['Default leverage', defaultLeverage, setDefaultLeverage],
                ['Minimum deposit (USD)', minDeposit, setMinDeposit],
              ] as const
            ).map(([label, value, setter]) => (
              <label key={label} className="block">
                <span className="mb-1.5 block text-xs text-white/45">{label}</span>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1e60ff]/50 focus:ring-1 focus:ring-[#1e60ff]/40"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsPage() {
  const meta = ADMIN_PAGE_META.integrations;
  const [search, setSearch] = useState('');
  const integrations = [
    { name: 'Sumsub KYC', category: 'Identity', status: 'Connected', lastSync: '4 min ago' },
    { name: 'Stripe', category: 'Payments', status: 'Connected', lastSync: '1 min ago' },
    { name: 'Fireblocks', category: 'Custody', status: 'Connected', lastSync: '12 min ago' },
    { name: 'Bloomberg B-PIPE', category: 'Market data', status: 'Disconnected', lastSync: '2 days ago' },
    { name: 'Twilio', category: 'Messaging', status: 'Connected', lastSync: '8 min ago' },
    { name: 'Chainalysis', category: 'Compliance', status: 'Disconnected', lastSync: 'Never' },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return integrations;
    return integrations.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <ActionBtn variant="primary">
            <Plus className="h-4 w-4" /> Add integration
          </ActionBtn>
        }
      />
      <StatCards
        cards={[
          { label: 'Connected', value: '4', change: 'Stable', up: true },
          { label: 'Disconnected', value: '2', change: 'Needs attention', up: false },
          { label: 'Webhooks / day', value: '18.4k', change: '+6%', up: true },
          { label: 'Failed syncs', value: '3', change: '-2', up: true },
        ]}
      />
      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search integrations…"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-white/[0.06] bg-[#0a0a0d] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="mt-0.5 text-xs text-white/40">{item.category}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-4 text-xs text-white/45">Last sync · {item.lastSync}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.04]"
              >
                {item.status === 'Connected' ? (
                  <>
                    <XCircle className="h-3.5 w-3.5" /> Disconnect
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connect
                  </>
                )}
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.04]"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────────────── */

export default function AdminPageContent({
  pageId,
}: {
  pageId: Exclude<AdminPageId, 'dashboard'>;
}) {
  const liveModes = new Set([
    'reports',
    'analytics',
    'kyc',
    'withdrawals',
    'transactions',
    'deposits',
    'live-trades',
    'orders',
    'positions',
    'assets',
    'settings',
    'wallets',
  ]);

  const livePanel = liveModes.has(pageId) ? (
    <div className="mb-6">
      <AdminTradingOps mode={pageId} />
    </div>
  ) : null;

  return (
    <div>
      {livePanel}
      <AdminPageContentInner pageId={pageId} />
    </div>
  );
}

function AdminPageContentInner({
  pageId,
}: {
  pageId: Exclude<AdminPageId, 'dashboard'>;
}) {
  switch (pageId) {
    case 'analytics':
      return <AnalyticsPage />;
    case 'monitor':
      return <MonitorPage />;
    case 'roles':
      return <RolesPage />;
    case 'settings':
      return <SettingsPage />;
    case 'integrations':
      return <IntegrationsPage />;
    case 'reports':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Scheduled', value: '4', change: '+1', up: true },
            { label: 'Ran today', value: '7', change: '+2', up: true },
            { label: 'Failed', value: '1', change: '-1', up: true },
            { label: 'Exports', value: '126', change: '+18%', up: true },
          ]}
          columns={[
            { key: 'name', label: 'Report' },
            { key: 'type', label: 'Type' },
            { key: 'format', label: 'Format' },
            { key: 'status', label: 'Status' },
            { key: 'lastRun', label: 'Last run' },
          ]}
          rows={REPORTS}
          searchPlaceholder="Search reports…"
        />
      );
    case 'users':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Total users', value: '24,589', change: '+18.6%', up: true },
            { label: 'Active', value: '18,420', change: '+4.2%', up: true },
            { label: 'Pending', value: '612', change: '-8%', up: true },
            { label: 'Suspended', value: '84', change: '+3', up: false },
          ]}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'tier', label: 'Tier' },
            { key: 'status', label: 'Status' },
            { key: 'joined', label: 'Joined' },
          ]}
          rows={USERS}
          searchPlaceholder="Search users…"
        />
      );
    case 'kyc':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Pending review', value: '142', change: '-12', up: true },
            { label: 'Approved today', value: '38', change: '+6', up: true },
            { label: 'Rejection rate', value: '4.8%', change: '-0.6%', up: true },
            { label: 'Avg. SLA', value: '3.2h', change: '-0.4h', up: true },
          ]}
          columns={[
            { key: 'user', label: 'User' },
            { key: 'document', label: 'Document' },
            { key: 'country', label: 'Country' },
            { key: 'status', label: 'Status' },
            { key: 'submitted', label: 'Submitted' },
          ]}
          rows={KYC_ROWS}
          searchPlaceholder="Search KYC…"
        />
      );
    case 'accounts':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Accounts', value: '9,842', change: '+2.1%', up: true },
            { label: 'Corporate', value: '214', change: '+8', up: true },
            { label: 'Total equity', value: '$86.4M', change: '+5.4%', up: true },
            { label: 'At risk', value: '19', change: '+2', up: false },
          ]}
          columns={[
            { key: 'account', label: 'Account' },
            { key: 'owner', label: 'Owner' },
            { key: 'type', label: 'Type' },
            { key: 'balance', label: 'Balance' },
            { key: 'status', label: 'Status' },
          ]}
          rows={ACCOUNTS}
          searchPlaceholder="Search accounts…"
        />
      );
    case 'announcements':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Published', value: '28', change: '+3', up: true },
            { label: 'Drafts', value: '5', change: 'Stable', up: true },
            { label: 'Scheduled', value: '2', change: '+1', up: true },
            { label: 'Reach (7d)', value: '61k', change: '+9%', up: true },
          ]}
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'audience', label: 'Audience' },
            { key: 'status', label: 'Status' },
            { key: 'scheduled', label: 'Scheduled' },
            { key: 'author', label: 'Author' },
          ]}
          rows={ANNOUNCEMENTS}
          searchPlaceholder="Search announcements…"
        />
      );
    case 'activity-logs':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Events (24h)', value: '14,280', change: '+11%', up: true },
            { label: 'Admin actions', value: '326', change: '+4%', up: true },
            { label: 'System alerts', value: '18', change: '-3', up: true },
            { label: 'Critical', value: '2', change: '+1', up: false },
          ]}
          columns={[
            { key: 'time', label: 'Time' },
            { key: 'actor', label: 'Actor' },
            { key: 'action', label: 'Action' },
            { key: 'target', label: 'Target' },
            { key: 'ip', label: 'IP' },
          ]}
          rows={ACTIVITY_LOGS}
          searchPlaceholder="Search activity logs…"
        />
      );
    case 'trading-accounts':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Live accounts', value: '5,210', change: '+3.2%', up: true },
            { label: 'Demo accounts', value: '12,840', change: '+6%', up: true },
            { label: 'Total equity', value: '$42.8M', change: '+2.8%', up: true },
            { label: 'Margin calls', value: '14', change: '-5', up: true },
          ]}
          columns={[
            { key: 'login', label: 'Login' },
            { key: 'owner', label: 'Owner' },
            { key: 'mode', label: 'Mode', render: (r) => <StatusBadge status={r.mode} /> },
            { key: 'equity', label: 'Equity' },
            { key: 'leverage', label: 'Leverage' },
            { key: 'status', label: 'Status' },
          ]}
          rows={TRADING_ACCOUNTS}
          searchPlaceholder="Search trading accounts…"
        />
      );
    case 'live-trades':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Trades / min', value: '184', change: '+22%', up: true },
            { label: 'Buy volume', value: '$6.2M', change: '+9%', up: true },
            { label: 'Sell volume', value: '$5.8M', change: '+7%', up: true },
            { label: 'Open PnL', value: '+$128k', change: '+4%', up: true },
          ]}
          columns={[
            { key: 'time', label: 'Time' },
            { key: 'pair', label: 'Pair' },
            { key: 'side', label: 'Side' },
            { key: 'size', label: 'Size' },
            { key: 'price', label: 'Price' },
            { key: 'pnl', label: 'PnL' },
            { key: 'status', label: 'Status' },
          ]}
          rows={LIVE_TRADES}
          searchPlaceholder="Search live trades…"
        />
      );
    case 'orders':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Open orders', value: '1,284', change: '+5%', up: true },
            { label: 'Filled (24h)', value: '9,420', change: '+12%', up: true },
            { label: 'Cancelled', value: '612', change: '-3%', up: true },
            { label: 'Reject rate', value: '0.8%', change: '-0.1%', up: true },
          ]}
          columns={[
            { key: 'orderId', label: 'Order ID' },
            { key: 'account', label: 'Account' },
            { key: 'pair', label: 'Pair' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Created' },
          ]}
          rows={ORDERS}
          searchPlaceholder="Search orders…"
        />
      );
    case 'positions':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Open positions', value: '3,842', change: '+2%', up: true },
            { label: 'Long exposure', value: '$28.4M', change: '+6%', up: true },
            { label: 'Short exposure', value: '$21.1M', change: '+3%', up: true },
            { label: 'Unrealized PnL', value: '+$412k', change: '+8%', up: true },
          ]}
          columns={[
            { key: 'account', label: 'Account' },
            { key: 'pair', label: 'Pair' },
            { key: 'side', label: 'Side' },
            { key: 'size', label: 'Size' },
            { key: 'margin', label: 'Margin' },
            { key: 'pnl', label: 'PnL' },
            { key: 'status', label: 'Status' },
          ]}
          rows={POSITIONS}
          searchPlaceholder="Search positions…"
        />
      );
    case 'assets':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Listed assets', value: '186', change: '+4', up: true },
            { label: 'Active markets', value: '172', change: '+2', up: true },
            { label: 'Suspended', value: '6', change: '+1', up: false },
            { label: '24h volume', value: '$8.9B', change: '+14%', up: true },
          ]}
          columns={[
            { key: 'symbol', label: 'Symbol' },
            { key: 'class', label: 'Class' },
            { key: 'spread', label: 'Spread' },
            { key: 'volume24h', label: '24h volume' },
            { key: 'status', label: 'Status' },
          ]}
          rows={ASSETS}
          searchPlaceholder="Search assets…"
        />
      );
    case 'wallets':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Wallets', value: '31,204', change: '+3%', up: true },
            { label: 'Available', value: '$64.2M', change: '+4.1%', up: true },
            { label: 'Locked', value: '$8.4M', change: '+1.2%', up: true },
            { label: 'Zero balance', value: '4,120', change: '-2%', up: true },
          ]}
          columns={[
            { key: 'user', label: 'User' },
            { key: 'currency', label: 'Currency' },
            { key: 'available', label: 'Available' },
            { key: 'locked', label: 'Locked' },
            { key: 'status', label: 'Status' },
          ]}
          rows={WALLETS}
          searchPlaceholder="Search wallets…"
        />
      );
    case 'transactions':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Today', value: '18,420', change: '+9%', up: true },
            { label: 'Volume', value: '$12.6M', change: '+7%', up: true },
            { label: 'Failed', value: '42', change: '-11%', up: true },
            { label: 'Fees collected', value: '$48.2k', change: '+5%', up: true },
          ]}
          columns={[
            { key: 'ref', label: 'Reference' },
            { key: 'type', label: 'Type' },
            { key: 'user', label: 'User' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'time', label: 'Time' },
          ]}
          rows={TRANSACTIONS}
          searchPlaceholder="Search transactions…"
        />
      );
    case 'deposits':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Pending', value: '38', change: '-4', up: true },
            { label: 'Completed (24h)', value: '214', change: '+12%', up: true },
            { label: 'Volume (24h)', value: '$1.84M', change: '+8%', up: true },
            { label: 'Failed', value: '7', change: '-2', up: true },
          ]}
          columns={[
            { key: 'ref', label: 'Reference' },
            { key: 'user', label: 'User' },
            { key: 'method', label: 'Method' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'time', label: 'Time' },
          ]}
          rows={DEPOSITS}
          searchPlaceholder="Search deposits…"
        />
      );
    case 'withdrawals':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'In queue', value: '26', change: '+3', up: false },
            { label: 'Approved (24h)', value: '96', change: '+5%', up: true },
            { label: 'Volume (24h)', value: '$920k', change: '+2%', up: true },
            { label: 'Flagged', value: '5', change: 'Stable', up: true },
          ]}
          columns={[
            { key: 'ref', label: 'Reference' },
            { key: 'user', label: 'User' },
            { key: 'method', label: 'Method' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'time', label: 'Time' },
          ]}
          rows={WITHDRAWALS}
          searchPlaceholder="Search withdrawals…"
        />
      );
    case 'revenue-share':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Partners', value: '64', change: '+3', up: true },
            { label: 'Commission due', value: '$48.2k', change: '+6%', up: true },
            { label: 'Paid MTD', value: '$162k', change: '+9%', up: true },
            { label: 'Active IBs', value: '51', change: '+2', up: true },
          ]}
          columns={[
            { key: 'partner', label: 'Partner' },
            { key: 'clients', label: 'Clients' },
            { key: 'volume', label: 'Volume' },
            { key: 'commission', label: 'Commission' },
            { key: 'status', label: 'Status' },
          ]}
          rows={REVENUE_SHARE}
          searchPlaceholder="Search partners…"
        />
      );
    case 'support':
      return (
        <TablePage
          pageId={pageId}
          stats={[
            { label: 'Open tickets', value: '86', change: '-8', up: true },
            { label: 'Avg. first reply', value: '18m', change: '-4m', up: true },
            { label: 'SLA breaches', value: '3', change: '-1', up: true },
            { label: 'CSAT', value: '4.7', change: '+0.1', up: true },
          ]}
          columns={[
            { key: 'ticket', label: 'Ticket' },
            { key: 'user', label: 'User' },
            { key: 'subject', label: 'Subject' },
            {
              key: 'priority',
              label: 'Priority',
              render: (r) => <StatusBadge status={r.priority} />,
            },
            { key: 'status', label: 'Status' },
            { key: 'updated', label: 'Updated' },
          ]}
          rows={SUPPORT}
          searchPlaceholder="Search tickets…"
        />
      );
    default: {
      const _exhaustive: never = pageId;
      return _exhaustive;
    }
  }
}
