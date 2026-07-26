import { useState, useEffect, memo, type ComponentType } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Activity,
  Users,
  UserCheck,
  UserPlus,
  CheckSquare,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Globe,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Lock,
  Sliders,
  Megaphone,
  History,
  Wallet,
  ArrowUpDown,
  Sparkles,
  Monitor,
  Briefcase,
  PieChart,
  Grid,
  Menu,
  X,
  Zap,
  Coins,
  MoreVertical,
  MapPin,
  Building2,
  Globe2,
  Server,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../assets/images/cutouts/logo_official.png';
import shieldImg from '../assets/images/cutouts/shield.png';
import worldMapDots from '../assets/images/world_map_dots.svg';
import AdminPageContent from './admin/AdminPageContent';
import { ADMIN_NAV, type AdminPageId } from './admin/adminTypes';

interface AdminDashboardProps {
  onLogout: () => void;
}

const NAV_ICONS: Record<AdminPageId, ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  analytics: BarChart3,
  reports: FileText,
  monitor: Monitor,
  users: Users,
  kyc: UserCheck,
  accounts: Wallet,
  roles: Sliders,
  announcements: Megaphone,
  'activity-logs': History,
  'trading-accounts': Briefcase,
  'live-trades': ArrowUpDown,
  orders: FileText,
  positions: Grid,
  assets: Activity,
  wallets: Wallet,
  transactions: ArrowUpDown,
  deposits: ArrowDownRight,
  withdrawals: TrendingDown,
  'revenue-share': PieChart,
  settings: Settings,
  integrations: Sliders,
  support: HelpCircle,
};

function AdminSidebarNav({
  activePage,
  onNavigate,
  mobile = false,
}: {
  activePage: AdminPageId;
  onNavigate: (page: AdminPageId) => void;
  mobile?: boolean;
}) {
  return (
    <div className={`space-y-5 ${mobile ? 'p-1' : ''}`}>
      {ADMIN_NAV.map((section) => (
        <div key={section.label} className="space-y-1">
          <span className="text-[9px] font-bold text-[#5b7cfa]/80 uppercase tracking-[0.18em] pl-3.5 block pb-1.5">
            {section.label}
          </span>
          {section.items.map((item) => {
            const Icon = NAV_ICONS[item.id];
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                // Prevent focus scroll jump that resets sidebar position
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all text-left cursor-pointer ${
                  active
                    ? 'text-white bg-gradient-to-r from-[#1e60ff]/25 to-transparent border border-white/[0.06] border-l-[3px] border-l-[#1e60ff]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#1e60ff]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface Trade {
  pair: string;
  type: 'Buy' | 'Sell';
  amount: string;
  time: string;
  timestamp: number;
  symbol: string;
  color: string;
}

const PAIR_META: Record<string, { symbol: string; color: string }> = {
  'BTC/USDT': { symbol: '₿', color: '#f7931a' },
  'ETH/USDT': { symbol: 'Ξ', color: '#627eea' },
  'XRP/USDT': { symbol: 'X', color: '#23292f' },
  'SOL/USDT': { symbol: 'S', color: '#9945ff' },
  'BNB/USDT': { symbol: 'B', color: '#f3ba2f' },
  'ADA/USDT': { symbol: 'A', color: '#0033ad' },
  'DOGE/USDT': { symbol: 'Ð', color: '#c2a633' },
  'AVAX/USDT': { symbol: 'A', color: '#e84142' },
  'LINK/USDT': { symbol: 'L', color: '#2a5ada' },
  'DOT/USDT': { symbol: '●', color: '#e6007a' },
};

const KPI_STATS = [
  { label: 'Total Users', val: '24,589', pct: '18.6%', icon: Users },
  { label: 'Active Traders', val: '5,683', pct: '21.4%', icon: Activity },
  { label: 'Total Deposits', val: '$8,932,456', pct: '15.7%', icon: Wallet },
  { label: 'Total Withdrawals', val: '$5,321,789', pct: '13.2%', icon: ArrowUpRight },
  { label: 'Total Revenue', val: '$892,450', pct: '23.8%', icon: Coins },
  { label: 'Trading Volume', val: '$22,456,789', pct: '28.9%', icon: BarChart3 },
];

const REGIONS = [
  { name: 'North America', users: '16,056', pct: '23.5%', top: '18%', left: '24%' },
  { name: 'Europe', users: '8,756', pct: '17.2%', top: '12%', left: '54%' },
  { name: 'Asia', users: '15,785', pct: '28.1%', top: '18%', left: '76%' },
  { name: 'South America', users: '4,325', pct: '12.4%', top: '52%', left: '34%' },
  { name: 'Africa', users: '2,155', pct: '8.7%', top: '44%', left: '55%' },
  { name: 'Australia', users: '3,245', pct: '15.6%', top: '60%', left: '85%' },
];

const ACTIVITIES = [
  { title: 'New user registered', detail: 'john.doe@example.com', time: '2 min ago', icon: UserPlus, tone: 'blue' },
  { title: 'KYC verification approved', detail: 'user_12345', time: '15 min ago', icon: CheckSquare, tone: 'green' },
  { title: 'Deposit received $5,000', detail: 'by user_54321', time: '25 min ago', icon: ArrowDownRight, tone: 'cyan' },
  { title: 'Withdrawal processed $2,500', detail: 'to user_54321', time: '45 min ago', icon: ArrowUpRight, tone: 'rose' },
  { title: 'New trading account created', detail: 'trader_pro_001', time: '1 hour ago', icon: Briefcase, tone: 'purple' },
];

const TOP_TRADERS = [
  { rank: 1, name: 'Trader_Pro_001', tier: 'Pro Account', profit: '$245,678', pct: '+24.5%', tone: 'gold' },
  { rank: 2, name: 'Crypto_King', tier: 'Basic Account', profit: '$198,432', pct: '+18.7%', tone: 'silver' },
  { rank: 3, name: 'Whale_Master', tier: 'Whale Class', profit: '$176,890', pct: '+15.3%', tone: 'bronze' },
  { rank: 4, name: 'Alpha_Trader', tier: 'Partner', profit: '$142,567', pct: '+12.1%', tone: 'plain' },
  { rank: 5, name: 'Black_Hunter', tier: 'Standard', profit: '$128,945', pct: '+9.8%', tone: 'plain' },
];

const REVENUE = [
  { label: 'Trading Fees', amount: '$456,230', pct: '51.1%', color: '#1e60ff' },
  { label: 'Withdrawal Fees', amount: '$185,420', pct: '20.8%', color: '#10b981' },
  { label: 'Deposit Fees', amount: '$125,360', pct: '14.0%', color: '#a855f7' },
  { label: 'Subscription', amount: '$85,240', pct: '9.5%', color: '#f97316' },
  { label: 'Others', amount: '$40,200', pct: '4.6%', color: '#eab308' },
];

function sparkPath(seed: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const x = (i / 12) * 100;
    const y = 62 - Math.sin(i * 0.7 + seed) * 18 - ((i * seed) % 7) - i * 1.2;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}
function RingGauge({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
          {value}%
        </span>
      </div>
      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

/** Isolated so the 1s clock tick does not re-render the whole dashboard (and images). */
function ServerClock() {
  const [utcTime, setUtcTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setUtcTime(
        `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-white font-semibold font-mono flex items-center gap-1">
      <Clock className="w-3.5 h-3.5 text-gray-500" />
      {utcTime || '10:24:35 UTC'}
    </span>
  );
}

function SystemPerformancePanel({ onDetails }: { onDetails: () => void }) {
  const [cpu, setCpu] = useState(32);
  const [memory, setMemory] = useState(61);
  const [disk, setDisk] = useState(47);
  const [network, setNetwork] = useState(82);

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((p) => Math.max(28, Math.min(42, p + Math.floor(Math.random() * 5) - 2)));
      setMemory((p) => Math.max(58, Math.min(65, p + (Math.random() > 0.5 ? 1 : -1))));
      setDisk((p) => Math.max(44, Math.min(52, p + (Math.random() > 0.5 ? 1 : -1))));
      setNetwork((p) => Math.max(78, Math.min(88, p + Math.floor(Math.random() * 3) - 1)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-4 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-white">System Performance</h3>
        <button type="button" onClick={onDetails} className="text-[10px] font-semibold text-[#60a5fa] cursor-pointer">
          View Details
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <RingGauge value={cpu} color="#1e60ff" label="CPU" />
        <RingGauge value={memory} color="#10b981" label="Memory" />
        <RingGauge value={disk} color="#a855f7" label="Disk" />
        <RingGauge value={network} color="#00c8ff" label="Network" />
      </div>
    </div>
  );
}

const SecurityOverviewPanel = memo(function SecurityOverviewPanel() {
  return (
    <div className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-4 flex-1">
      <h3 className="text-[13px] font-semibold text-white mb-3">Security Overview</h3>
      <div className="flex items-center gap-3">
        <div className="w-[88px] h-[88px] rounded-xl bg-[#1e60ff]/[0.07] border border-[#1e60ff]/25 flex items-center justify-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,96,255,0.25),transparent_70%)]" />
          <img
            src={shieldImg}
            alt=""
            className="relative z-10 w-12 h-12 object-contain"
            draggable={false}
          />
          <Lock className="absolute bottom-2 right-2 w-3 h-3 text-[#60a5fa] z-10" />
        </div>
        <div className="flex-1 space-y-1.5 text-[11px]">
          {[
            { label: 'Login Attempts', val: '1,245', delta: '▲ 12%', good: true },
            { label: 'Suspicious Activities', val: '23', delta: '▼ 8%', good: true },
            { label: 'Blocked IPs', val: '45', delta: '▲ 15%', good: false },
            { label: '2FA Enabled Users', val: '78.6%', delta: '▲ 5%', good: true },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <span className="text-gray-500 truncate">{row.label}</span>
              <span className="text-white font-semibold whitespace-nowrap">
                {row.val}{' '}
                <span className={row.good ? 'text-emerald-400 text-[9px]' : 'text-rose-400 text-[9px]'}>{row.delta}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

function LiveTradesFeed({ onViewAll }: { onViewAll: () => void }) {
  const [trades, setTrades] = useState<Trade[]>([
    { pair: 'BTC/USDT', type: 'Buy', amount: '$8,923.40', time: '2 sec ago', timestamp: Date.now() - 2000, ...PAIR_META['BTC/USDT'] },
    { pair: 'ETH/USDT', type: 'Sell', amount: '$1,854.35', time: '4 sec ago', timestamp: Date.now() - 4000, ...PAIR_META['ETH/USDT'] },
    { pair: 'XRP/USDT', type: 'Buy', amount: '$0.505', time: '6 sec ago', timestamp: Date.now() - 6000, ...PAIR_META['XRP/USDT'] },
    { pair: 'SOL/USDT', type: 'Buy', amount: '$145.25', time: '8 sec ago', timestamp: Date.now() - 8000, ...PAIR_META['SOL/USDT'] },
    { pair: 'BNB/USDT', type: 'Sell', amount: '$310.00', time: '10 sec ago', timestamp: Date.now() - 10000, ...PAIR_META['BNB/USDT'] },
    { pair: 'ADA/USDT', type: 'Buy', amount: '$0.450', time: '12 sec ago', timestamp: Date.now() - 12000, ...PAIR_META['ADA/USDT'] },
    { pair: 'DOGE/USDT', type: 'Buy', amount: '$0.085', time: '14 sec ago', timestamp: Date.now() - 14000, ...PAIR_META['DOGE/USDT'] },
  ]);

  useEffect(() => {
    const feed = setInterval(() => {
      const pairs = Object.keys(PAIR_META);
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const type = Math.random() > 0.4 ? 'Buy' : 'Sell';
      const amount =
        pair.startsWith('BTC')
          ? `$${(28000 + Math.random() * 45000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : pair.startsWith('ETH')
            ? `$${(1500 + Math.random() * 1200).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : `$${(0.1 + Math.random() * 400).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      setTrades((prev) => {
        const next: Trade = {
          pair,
          type: type as 'Buy' | 'Sell',
          amount,
          time: 'Just now',
          timestamp: Date.now(),
          ...PAIR_META[pair],
        };
        return [
          next,
          ...prev.map((t) => {
            const diff = Math.round((Date.now() - t.timestamp) / 1000);
            return { ...t, time: diff < 60 ? `${diff} sec ago` : `${Math.floor(diff / 60)} min ago` };
          }),
        ].slice(0, 7);
      });
    }, 3200);
    return () => clearInterval(feed);
  }, []);

  return (
    <div className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full min-h-[320px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-white">Live Trades Feed</h3>
        <button type="button" onClick={onViewAll} className="text-[11px] font-semibold text-[#60a5fa] hover:underline cursor-pointer">
          View All
        </button>
      </div>

      <div className="grid grid-cols-12 text-[10px] font-semibold text-gray-500 uppercase tracking-wide pb-2 border-b border-white/[0.05]">
        <span className="col-span-4">Pair</span>
        <span className="col-span-2 text-center">Type</span>
        <span className="col-span-3 text-right">Amount</span>
        <span className="col-span-3 text-right">Time</span>
      </div>

      <div className="flex-1 overflow-hidden mt-1 space-y-0.5">
        {trades.map((trade) => (
          <div
            key={trade.timestamp}
            className="grid grid-cols-12 items-center py-2 border-b border-white/[0.03] text-[11px] xl:text-[12px]"
          >
            <div className="col-span-4 flex items-center gap-1.5 min-w-0">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: trade.color }}
              >
                {trade.symbol}
              </span>
              <span className="text-white font-semibold truncate">{trade.pair}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className={`font-semibold ${trade.type === 'Buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trade.type}
              </span>
            </div>
            <span className="col-span-3 text-right text-gray-200 font-medium tabular-nums truncate">{trade.amount}</span>
            <span className="col-span-3 text-right text-gray-500 text-[10px] truncate">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState<AdminPageId>('dashboard');
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('30D');
  const [activeLang, setActiveLang] = useState('English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredChart, setHoveredChart] = useState(false);

  const navigateTo = (page: AdminPageId) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    setShowQuickActions(false);
    setShowProfileDropdown(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const toneClass = (tone: string) => {
    switch (tone) {
      case 'green':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'cyan':
        return 'bg-cyan-500/10 text-cyan-400';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400';
      default:
        return 'bg-[#1e60ff]/10 text-[#1e60ff]';
    }
  };

  const rankTone = (tone: string) => {
    switch (tone) {
      case 'gold':
        return 'bg-[#eab308]/10 text-[#eab308] border-[#eab308]/25';
      case 'silver':
        return 'bg-slate-400/10 text-slate-300 border-slate-400/20';
      case 'bronze':
        return 'bg-amber-700/10 text-amber-600 border-amber-700/25';
      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  return (
    <div className="h-screen bg-[#030303] text-[#f4f4f6] flex font-sans overflow-hidden" id="admin-dashboard-frame">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl border border-white/10 bg-[#09090c]/95 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-2 shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1e60ff]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="absolute inset-y-0 left-0 w-72 bg-[#030303] border-r border-white/10 p-4 flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/[0.06]">
                <img src={logoImg} alt="VUNEX MARKET" className="h-7 w-auto object-contain" />
                <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg border border-white/10 text-gray-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AdminSidebarNav mobile activePage={activePage} onNavigate={navigateTo} />
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="mt-3 w-full py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold cursor-pointer"
              >
                Logout Admin Console
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-[260px] border-r border-white/[0.05] bg-[#030303] shrink-0 hidden lg:flex flex-col select-none h-full">
        <div className="flex flex-col min-h-0 flex-1">
          <div className="px-5 py-5 border-b border-white/[0.04] flex items-center shrink-0">
            <button type="button" onClick={() => navigateTo('dashboard')} className="cursor-pointer">
              <img src={logoImg} alt="VUNEX MARKET" className="h-8 w-auto object-contain" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
            <AdminSidebarNav activePage={activePage} onNavigate={navigateTo} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-white/[0.05] bg-[#030303]/90 backdrop-blur-md px-4 sm:px-6 xl:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users, markets, trades..."
                className="w-full h-10 bg-[#0a0a0c] border border-white/[0.06] rounded-xl pl-10 pr-4 text-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1e60ff]/60"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowLangDropdown((v) => !v)}
                className="flex items-center gap-2 h-9 px-3 bg-[#0a0a0c] border border-white/[0.06] rounded-xl text-[12px] font-medium text-gray-400 hover:text-white cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                {activeLang}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 mt-1.5 w-32 bg-[#09090c] border border-white/10 rounded-xl p-1 z-50 shadow-2xl">
                  {['English', 'Spanish', 'German'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setActiveLang(lang);
                        setShowLangDropdown(false);
                        triggerToast(`Switched language to ${lang}`);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigateTo('activity-logs')}
              className="relative w-9 h-9 flex items-center justify-center bg-[#0a0a0c] border border-white/[0.06] rounded-xl text-gray-400 hover:text-white cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1e60ff] rounded-full shadow-[0_0_8px_#1e60ff]" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileDropdown((v) => !v)}
                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 bg-[#0a0a0c] border border-white/[0.06] rounded-xl cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e60ff] to-cyan-400 text-white flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[12px] font-semibold text-white">Admin</span>
                  <span className="text-[9px] text-gray-500 mt-1">Super Administrator</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-1.5 w-48 bg-[#09090c] border border-white/10 rounded-xl p-1 shadow-2xl z-50">
                  <button
                    type="button"
                    onClick={() => navigateTo('settings')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    Logout Admin Console
                  </button>
                </div>
              )}
            </div>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowQuickActions((v) => !v)}
                className="hidden sm:flex h-9 px-3.5 items-center gap-2 bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 rounded-xl text-[12px] font-semibold text-white cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                Quick Actions
              </button>
              {showQuickActions && (
                <div className="absolute right-0 mt-1.5 w-52 bg-[#09090c] border border-white/10 rounded-xl p-1 shadow-2xl z-50">
                  {[
                    { id: 'users' as const, label: 'Invite User' },
                    { id: 'kyc' as const, label: 'Review KYC Queue' },
                    { id: 'withdrawals' as const, label: 'Approve Withdrawals' },
                    { id: 'announcements' as const, label: 'New Announcement' },
                    { id: 'support' as const, label: 'Open Support' },
                    { id: 'settings' as const, label: 'System Settings' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => navigateTo(a.id)}
                      className="w-full px-3 py-2 text-left text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content — full width */}
        <div className="p-4 sm:p-6 xl:p-8 space-y-5 flex-1 w-full text-left">
          {activePage !== 'dashboard' ? (
            <AdminPageContent pageId={activePage} />
          ) : (
          <>
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-none">Dashboard Overview</h1>
            <p className="text-[13px] text-gray-500 mt-2">Welcome back, Admin! Here&apos;s what&apos;s happening today.</p>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 xl:gap-4">
            {KPI_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-4 relative overflow-hidden min-h-[128px] flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-[#1e60ff]/10 border border-[#1e60ff]/30 flex items-center justify-center shadow-[0_0_18px_rgba(30,96,255,0.35)] shrink-0">
                      <Icon className="w-4 h-4 text-[#60a5fa]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium truncate">{stat.label}</p>
                      <p className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-tight mt-0.5 truncate">
                        {stat.val}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] mt-auto mb-5 relative z-10">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{stat.pct}</span>
                    <span className="text-gray-600">vs last month</span>
                  </div>
                  <svg className="absolute inset-x-0 bottom-0 h-10 w-full opacity-80" viewBox="0 0 100 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`sparkFill${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#1e60ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${sparkPath(i + 1)} L100,70 L0,70 Z`} fill={`url(#sparkFill${i})`} />
                    <path d={sparkPath(i + 1)} fill="none" stroke="#3b82f6" strokeWidth="1.8" style={{ filter: 'drop-shadow(0 0 4px #1e60ff)' }} />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* Middle row: wide Market + Analytics, narrower Live Trades */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
            {/* Market Overview — wider map panel */}
            <div className="lg:col-span-5 bg-[#0a0a0d] border border-white/[0.06] rounded-2xl pt-5 pb-5 flex flex-col min-h-[320px] overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-5">
                <h3 className="text-[13px] font-semibold text-white">Market Overview</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#1e60ff]/10 border border-[#1e60ff]/25 text-[#60a5fa] uppercase tracking-wide">
                  Global Network
                </span>
              </div>

              <div className="relative w-full h-[240px] xl:h-[270px] bg-[#050507] border-y border-white/[0.03] overflow-hidden mb-4">
                {/* faint grid */}
                <div
                  className="absolute inset-0 opacity-[0.12] pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(96,165,250,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.35) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <img
                  src={worldMapDots}
                  alt="Global map"
                  className="absolute inset-0 w-full h-full object-contain object-center select-none pointer-events-none"
                  draggable={false}
                />
                {REGIONS.map((r) => (
                  <div
                    key={r.name}
                    className="absolute z-10 -translate-x-1/2"
                    style={{ top: r.top, left: r.left }}
                  >
                    <div className="bg-[#0b0e14]/92 border border-white/10 rounded-md px-1.5 py-1 shadow-lg backdrop-blur-sm min-w-[72px]">
                      <p className="text-[7.5px] text-gray-400 font-medium leading-none">{r.name}</p>
                      <p className="text-[9.5px] text-white font-semibold mt-0.5 leading-none">
                        {r.users} <span className="text-gray-500 font-normal text-[8px]">Users</span>
                      </p>
                      <p className="text-[8.5px] text-emerald-400 font-semibold mt-0.5 leading-none flex items-center gap-0.5">
                        <TrendingUp className="w-2 h-2" /> {r.pct}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1 px-5 mt-auto">
                {[
                  { label: 'Total Countries', val: '128', icon: Globe2 },
                  { label: 'Total Cities', val: '842', icon: Building2 },
                  { label: 'Global Reach', val: '98.6%', icon: MapPin },
                  { label: 'System Uptime', val: '99.99%', icon: Server, green: true },
                ].map((m) => (
                  <div key={m.label} className="text-left">
                    <div className="flex items-center gap-1 mb-1">
                      <m.icon className="w-3 h-3 text-gray-600" />
                      <span className="text-[8px] text-gray-500 uppercase font-semibold tracking-wide truncate">{m.label}</span>
                    </div>
                    <span className={`text-[13px] font-bold ${m.green ? 'text-emerald-400' : 'text-white'}`}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Analytics — horizontal long */}
            <div className="lg:col-span-4 bg-[#0a0a0d] border border-white/[0.06] rounded-2xl pt-5 pb-5 flex flex-col min-h-[320px] overflow-hidden">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap px-5">
                <h3 className="text-[13px] font-semibold text-white">Trading Analytics</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-black/50 border border-white/[0.06] rounded-lg p-0.5">
                    {(['1D', '7D', '30D', '90D', '1Y'] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => {
                          setActiveTimeframe(tf);
                          triggerToast(`Chart updated to ${tf}`);
                        }}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-md cursor-pointer transition-colors ${
                          activeTimeframe === tf ? 'bg-[#1e60ff] text-white' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="p-1.5 text-gray-500 hover:text-white cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className="relative w-full flex-1 min-h-[200px] max-h-[260px] bg-[#050507] border-y border-white/[0.03] overflow-hidden cursor-crosshair"
                onMouseEnter={() => setHoveredChart(true)}
                onMouseLeave={() => setHoveredChart(false)}
              >
                <div className="absolute left-0 top-0 bottom-6 z-10 w-8 flex flex-col justify-between py-3 pl-1 pr-0.5 bg-[#07070a] border-r border-white/[0.06] pointer-events-none">
                  {['$2.5M', '$2.0M', '$1.5M', '$1.0M', '$500K', '$0'].map((l) => (
                    <span key={l} className="text-[8px] text-gray-500 font-medium leading-none text-left whitespace-nowrap">
                      {l}
                    </span>
                  ))}
                </div>
                <div className="absolute left-8 right-0 top-3 bottom-7 flex flex-col justify-between pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-px w-full bg-white/[0.05]" />
                  ))}
                </div>
                <svg
                  className="absolute left-8 right-0 top-0 bottom-6 w-[calc(100%-2rem)] h-[calc(100%-1.5rem)]"
                  viewBox="0 0 600 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="depArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#1e60ff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="witArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,95 C40,70 80,110 120,88 C160,66 200,50 240,62 C280,74 320,40 360,48 C400,56 440,30 480,38 C520,46 560,28 600,32 L600,180 L0,180 Z" fill="url(#depArea)" />
                  <path d="M0,95 C40,70 80,110 120,88 C160,66 200,50 240,62 C280,74 320,40 360,48 C400,56 440,30 480,38 C520,46 560,28 600,32" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d="M0,125 C45,108 90,138 140,118 C190,98 240,90 290,102 C340,114 390,88 440,98 C490,108 545,82 600,90 L600,180 L0,180 Z" fill="url(#witArea)" />
                  <path d="M0,125 C45,108 90,138 140,118 C190,98 240,90 290,102 C340,114 390,88 440,98 C490,108 545,82 600,90" fill="none" stroke="#10b981" strokeWidth="2.3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d="M0,150 C50,138 100,158 160,142 C220,126 280,120 340,132 C400,144 460,118 520,128 C560,134 580,118 600,122" fill="none" stroke="#a855f7" strokeWidth="2.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  {hoveredChart && (
                    <>
                      <line x1="300" y1="0" x2="300" y2="180" stroke="#ffffff22" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                      <circle cx="300" cy="55" r="4" fill="#1e60ff" />
                      <circle cx="300" cy="100" r="4" fill="#10b981" />
                      <circle cx="300" cy="132" r="4" fill="#a855f7" />
                    </>
                  )}
                </svg>
                <div className="absolute bottom-1.5 left-9 right-2 flex justify-between text-[9px] text-gray-600 font-medium">
                  {['May 15', 'May 20', 'May 25', 'May 30', 'Jun 5', 'Jun 10'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                <AnimatePresence>
                  {hoveredChart && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-[#0b0e14]/95 border border-white/10 rounded-xl p-3 text-[11px] shadow-2xl min-w-[150px]"
                    >
                      <p className="text-[9px] text-gray-500 uppercase font-semibold mb-2">May 28, 2024</p>
                      {[
                        { label: 'Deposits', val: '$1,788,500', color: '#1e60ff' },
                        { label: 'Withdrawals', val: '$1,065,400', color: '#10b981' },
                        { label: 'Revenue', val: '$332,450', color: '#a855f7' },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-4 py-0.5">
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.color }} />
                            {row.label}
                          </span>
                          <span className="text-white font-semibold">{row.val}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-5 mt-auto pt-3 px-5 border-t border-white/[0.05] text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1e60ff]" /> Deposits</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Withdrawals</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Revenue</span>
              </div>
            </div>

            {/* Live Trades — narrower column */}
            <div className="lg:col-span-3 min-w-0 h-full">
              <LiveTradesFeed onViewAll={() => navigateTo('live-trades')} />
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5">
            {/* Revenue */}
            <div className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-[13px] font-semibold text-white mb-1">Revenue Breakdown</h3>
              <p className="text-[11px] text-gray-500 mb-4">This Month — $892,450</p>
              <div className="flex items-center gap-4">
                <div className="relative w-[120px] h-[120px] shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#1e60ff" strokeWidth="12" strokeDasharray="122 238" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="50 238" strokeDashoffset="-122" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" strokeWidth="12" strokeDasharray="33 238" strokeDashoffset="-172" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray="23 238" strokeDashoffset="-205" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#eab308" strokeWidth="12" strokeDasharray="10 238" strokeDashoffset="-228" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">$892,450</span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-wider">Total</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  {REVENUE.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1.5 text-gray-400 truncate">
                        <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: r.color }} />
                        {r.label}
                      </span>
                      <span className="text-white font-semibold whitespace-nowrap">
                        {r.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-white">Recent Activities</h3>
                <button type="button" onClick={() => navigateTo('activity-logs')} className="text-[11px] font-semibold text-[#60a5fa] cursor-pointer">
                  View All
                </button>
              </div>
              <div className="space-y-3.5">
                {ACTIVITIES.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.title} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toneClass(a.tone)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-white leading-tight">{a.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{a.detail}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Traders */}
            <div className="bg-[#0a0a0d] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-white">Top Traders</h3>
                <button type="button" onClick={() => navigateTo('accounts')} className="text-[11px] font-semibold text-[#60a5fa] cursor-pointer">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {TOP_TRADERS.map((t) => (
                  <div
                    key={t.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      t.tone === 'gold'
                        ? 'bg-[#eab308]/[0.06] border-[#eab308]/20'
                        : t.tone === 'silver'
                          ? 'bg-slate-400/5 border-slate-400/15'
                          : t.tone === 'bronze'
                            ? 'bg-amber-800/10 border-amber-700/20'
                            : 'bg-white/[0.015] border-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${rankTone(t.tone)}`}>
                        {t.rank}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-white truncate">{t.name}</p>
                        <p className="text-[9px] text-gray-500 uppercase mt-0.5">{t.tier}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] font-bold text-white">{t.profit}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{t.pct}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance + Security */}
            <div className="space-y-4 flex flex-col">
              <SystemPerformancePanel onDetails={() => navigateTo('monitor')} />
              <SecurityOverviewPanel />
            </div>
          </div>
          </>
          )}
        </div>

        <footer className="border-t border-white/[0.05] bg-black/50 px-4 sm:px-6 xl:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-500 font-medium">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              Server Status
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Operational
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              Server Time:
              <ServerClock />
            </span>
          </div>
          <span className="hidden sm:inline">© 2024 VUNEX MARKET. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigateTo('settings')} className="hover:text-white cursor-pointer">Privacy Policy</button>
            <button type="button" onClick={() => navigateTo('settings')} className="hover:text-white cursor-pointer">Terms of Service</button>
            <button type="button" onClick={() => navigateTo('support')} className="hover:text-white cursor-pointer">Support</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
