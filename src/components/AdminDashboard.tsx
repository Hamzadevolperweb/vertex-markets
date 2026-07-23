import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Activity, 
  Users, 
  CheckSquare, 
  UserPlus, 
  Settings, 
  HelpCircle, 
  Bell, 
  Search, 
  Globe, 
  ChevronDown, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Lock, 
  Fingerprint, 
  UserCheck, 
  Sliders, 
  Megaphone, 
  History, 
  Wallet, 
  ArrowUpDown, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  Monitor,
  Briefcase,
  Share2,
  Trash2,
  PieChart,
  Grid,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Trade {
  pair: string;
  type: 'Buy' | 'Sell';
  amount: string;
  time: string;
  timestamp: number;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('30D');
  const [activeLang, setActiveLang] = useState('English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Live ticking clock for Server Time (UTC)
  const [utcTime, setUtcTime] = useState('');
  
  // Interactive hovering state for the chart tooltip
  const [hoveredData, setHoveredData] = useState<{
    date: string;
    deposits: string;
    withdrawals: string;
    revenue: string;
    x: number;
    y: number;
  } | null>(null);

  // Live simulation for Trades
  const [trades, setTrades] = useState<Trade[]>([
    { pair: 'BTC/USDT', type: 'Buy', amount: '$8,923.40', time: '2 sec ago', timestamp: Date.now() - 2000 },
    { pair: 'ETH/USDT', type: 'Sell', amount: '$1,854.35', time: '4 sec ago', timestamp: Date.now() - 4000 },
    { pair: 'XRP/USDT', type: 'Buy', amount: '$0.505', time: '6 sec ago', timestamp: Date.now() - 6000 },
    { pair: 'SOL/USDT', type: 'Buy', amount: '$145.25', time: '8 sec ago', timestamp: Date.now() - 8000 },
    { pair: 'BNB/USDT', type: 'Sell', amount: '$310.00', time: '10 sec ago', timestamp: Date.now() - 10000 },
    { pair: 'ADA/USDT', type: 'Buy', amount: '$0.450', time: '12 sec ago', timestamp: Date.now() - 12000 },
    { pair: 'DOGE/USDT', type: 'Buy', amount: '$0.085', time: '14 sec ago', timestamp: Date.now() - 14000 }
  ]);

  // Live performance metrics pulsing
  const [cpu, setCpu] = useState(32);
  const [memory, setMemory] = useState(61);
  const [disk, setDisk] = useState(47);
  const [network, setNetwork] = useState(82);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Clock setup
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // Dynamic metrics fluctuation
    const metricsInterval = setInterval(() => {
      setCpu(prev => Math.max(28, Math.min(42, prev + Math.floor(Math.random() * 5) - 2)));
      setMemory(prev => Math.max(58, Math.min(65, prev + (Math.random() > 0.5 ? 1 : -1))));
      setNetwork(prev => Math.max(78, Math.min(88, prev + Math.floor(Math.random() * 3) - 1)));
    }, 4000);

    // Live trades feeder simulator
    const tradesInterval = setInterval(() => {
      const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'AVAX/USDT', 'LINK/USDT', 'ADA/USDT', 'DOT/USDT'];
      const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
      const randomType = Math.random() > 0.4 ? 'Buy' : 'Sell';
      
      let randomAmount = '';
      if (randomPair.startsWith('BTC')) {
        randomAmount = `$${(28000 + Math.random() * 45000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (randomPair.startsWith('ETH')) {
        randomAmount = `$${(1500 + Math.random() * 1200).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (randomPair.startsWith('SOL')) {
        randomAmount = `$${(80 + Math.random() * 95).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        randomAmount = `$${(0.1 + Math.random() * 15).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
      }

      const newTrade: Trade = {
        pair: randomPair,
        type: randomType as 'Buy' | 'Sell',
        amount: randomAmount,
        time: 'Just now',
        timestamp: Date.now()
      };

      setTrades(prev => {
        const updated = [newTrade, ...prev.map(t => {
          const diff = Math.round((Date.now() - t.timestamp) / 1000);
          return {
            ...t,
            time: diff < 60 ? `${diff} sec ago` : `${Math.floor(diff / 60)} min ago`
          };
        })];
        return updated.slice(0, 7);
      });
    }, 3200);

    return () => {
      clearInterval(clockInterval);
      clearInterval(metricsInterval);
      clearInterval(tradesInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f6] flex font-sans overflow-x-hidden selection:bg-[#1e60ff]/30 selection:text-white" id="admin-dashboard-frame">
      
      {/* Toast Alert popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.8)] z-[100] flex items-center gap-3 backdrop-blur-md bg-[#09090c]/95 min-w-[320px] text-xs font-semibold text-white"
          >
            <Sparkles className="w-4 h-4 text-[#1e60ff] animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Drawer container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="absolute inset-y-0 left-0 w-72 bg-[#030304] border-r border-white/10 p-5 flex flex-col justify-between"
            >
              <div className="flex flex-col h-full overflow-y-auto pr-1">
                {/* Drawer header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-5">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <span className="absolute inset-0 bg-[#1e60ff]/20 rounded-lg blur-xs"></span>
                      <svg className="w-6.5 h-6.5 text-[#1e60ff]" viewBox="0 0 24 24" fill="none">
                        <path d="M3 4L12 21L21 4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.5 4L12 13L16.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                      </svg>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-display font-black text-base text-white uppercase leading-none">Vunex</span>
                      <span className="font-sans text-[7.5px] tracking-[0.3em] text-[#1e60ff] uppercase leading-none mt-1 font-bold">Market</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Content List */}
                <div className="space-y-4 text-left">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Main Menu</span>
                  <div className="space-y-1">
                    <button
                      onClick={() => { triggerToast('Already in Dashboard Overview'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#1e60ff]/10 border border-[#1e60ff]/20 text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#1e60ff]" />
                      <span>Dashboard Overview</span>
                    </button>
                    <button
                      onClick={() => { triggerToast('Navigated to Analytics'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span>Analytics</span>
                    </button>
                  </div>

                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pt-2">Management</span>
                  <div className="space-y-1">
                    <button
                      onClick={() => { triggerToast('Opening User Management'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>User Management</span>
                    </button>
                    <button
                      onClick={() => { triggerToast('Opening KYC Verification'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-gray-500" />
                      <span>KYC Verification</span>
                    </button>
                    <button
                      onClick={() => { triggerToast('Opening Accounts'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <Wallet className="w-4 h-4 text-gray-500" />
                      <span>Financial Accounts</span>
                    </button>
                  </div>

                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pt-2">Trading & Systems</span>
                  <div className="space-y-1">
                    <button
                      onClick={() => { triggerToast('Opening Live Trades Feed'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <ArrowUpDown className="w-4 h-4 text-gray-500" />
                      <span>Live Trades</span>
                    </button>
                    <button
                      onClick={() => { triggerToast('Opening System Settings'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span>System Settings</span>
                    </button>
                    <button
                      onClick={() => { triggerToast('Opening Support Tickets'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                      <span>Support Desk</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer footer */}
              <div className="pt-4 border-t border-white/[0.05] mt-auto">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-black rounded-xl transition-all cursor-pointer"
                >
                  Logout Admin Console
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-white/[0.04] bg-[#030304] shrink-0 flex flex-col justify-between hidden lg:flex select-none" id="admin-sidebar">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-white/[0.03] flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <span className="absolute inset-0 bg-[#1e60ff]/15 rounded-lg blur-xs"></span>
              {/* Dual chevron logo */}
              <svg className="w-6.5 h-6.5 text-[#1e60ff] relative z-10" viewBox="0 0 24 24" fill="none">
                <path d="M3 4L12 21L21 4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 4L12 13L16.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-lg tracking-wider text-white uppercase leading-none">Vunex</span>
              <span className="font-sans text-[8px] tracking-[0.3em] text-[#1e60ff] uppercase leading-none mt-1 font-bold">Market</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin">
            
            {/* Main Section */}
            <div className="space-y-1">
              <button 
                onClick={() => triggerToast('Already in Dashboard Overview')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-white bg-gradient-to-r from-[#1e60ff]/20 to-transparent border border-white/10 border-l-[3px] border-l-[#1e60ff] text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-[#1e60ff]" />
                <span>Dashboard</span>
              </button>
              
              {[
                { label: 'Analytics', icon: BarChart3 },
                { label: 'Reports', icon: FileText },
                { label: 'Monitor', icon: Monitor }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => triggerToast(`Navigated to ${link.label}`)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all text-left"
                >
                  <link.icon className="w-4 h-4 text-gray-500" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Management Section */}
            <div className="space-y-1">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-3.5 block pb-1">Management</span>
              {[
                { label: 'User Management', icon: Users },
                { label: 'KYC Verification', icon: UserCheck },
                { label: 'Accounts', icon: Wallet },
                { label: 'Roles & Permissions', icon: Sliders },
                { label: 'Announcements', icon: Megaphone },
                { label: 'Activity Logs', icon: History }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => triggerToast(`Loading ${link.label} logs...`)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all text-left"
                >
                  <link.icon className="w-4 h-4 text-gray-500" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Trading Section */}
            <div className="space-y-1">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-3.5 block pb-1">Trading</span>
              {[
                { label: 'Trading Accounts', icon: Briefcase },
                { label: 'Live Trades', icon: ArrowUpDown },
                { label: 'Orders', icon: FileText },
                { label: 'Positions', icon: Grid },
                { label: 'Assets', icon: Activity }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => triggerToast(`Opening Admin view for ${link.label}`)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all text-left"
                >
                  <link.icon className="w-4 h-4 text-gray-500" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Financial Section */}
            <div className="space-y-1">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-3.5 block pb-1">Financial</span>
              {[
                { label: 'Wallets', icon: Wallet },
                { label: 'Transactions', icon: ArrowUpDown },
                { label: 'Deposits', icon: ArrowUpRight },
                { label: 'Withdrawals', icon: TrendingDown },
                { label: 'Revenue Share', icon: PieChart }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => triggerToast(`Viewing ${link.label} dashboard`)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all text-left"
                >
                  <link.icon className="w-4 h-4 text-gray-500" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* System Section */}
            <div className="space-y-1">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-3.5 block pb-1">System</span>
              {[
                { label: 'System Settings', icon: Settings },
                { label: 'Integrations', icon: Sliders },
                { label: 'Support Tickets', icon: HelpCircle }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => triggerToast(`Opening System Settings - ${link.label}`)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all text-left"
                >
                  <link.icon className="w-4 h-4 text-gray-500" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Upgrade to PRO card exactly matching Page 10 */}
        <div className="p-4 border-t border-white/[0.03]">
          <button 
            onClick={() => triggerToast('Premium corporate features unlocked!')}
            className="w-full p-4 rounded-2xl bg-gradient-to-br from-[#1e60ff]/15 to-transparent border border-[#1e60ff]/30 text-left relative overflow-hidden group hover:border-[#1e60ff]/60 transition-all cursor-pointer"
          >
            {/* Glowing blur */}
            <span className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/15 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[#1e60ff] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black text-white tracking-wide uppercase">Upgrade to PRO</span>
            </div>
            <p className="text-[9.5px] text-gray-500 font-semibold leading-normal mb-3.5">
              Unlock advanced tools, deeper analytics, and customized reports.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-[#1e60ff] font-extrabold group-hover:translate-x-1 transition-transform">
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col min-h-screen" id="admin-content-stage">
        
        {/* HEADER BAR */}
        <header className="h-16 border-b border-white/[0.04] bg-[#030304]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-40 select-none">
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Left search bar */}
            <div className="relative w-80 hidden md:block">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-black border border-white/5 rounded-xl pl-10 pr-4 text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#1e60ff] focus:shadow-[0_0_12px_rgba(30,96,255,0.15)] transition-all"
                placeholder="Search for users, markets, trades..."
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Language dropdown */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 h-9 px-3 bg-black border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{activeLang}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-1.5 w-32 bg-[#09090c] border border-white/10 rounded-xl p-1 z-50 shadow-2xl">
                  {['English', 'Spanish', 'German'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setActiveLang(lang);
                        setShowLangDropdown(false);
                        triggerToast(`Switched language to ${lang}`);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  triggerToast('Loaded recent security notifications.');
                }}
                className="w-9 h-9 flex items-center justify-center bg-black border border-white/5 rounded-xl text-gray-400 hover:text-white relative cursor-pointer hover:border-white/10"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1e60ff] rounded-full shadow-[0_0_8px_#1e60ff]" />
              </button>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 sm:gap-3 pl-2 pr-2 sm:pr-3 py-1.5 bg-black/40 hover:bg-white/[0.02] border border-white/5 rounded-xl text-left cursor-pointer transition-all focus:outline-none"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1e60ff] to-cyan-400 text-white flex items-center justify-center font-black text-xs shadow-md">
                  A
                </div>
                <div className="flex flex-col text-left leading-none hidden sm:flex">
                  <span className="text-[10.5px] font-black text-white leading-none">Admin</span>
                  <span className="text-[8px] text-gray-500 font-extrabold uppercase mt-1 leading-none tracking-wider">Super Admin</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-1.5 w-48 bg-[#09090c] border border-white/10 rounded-xl p-1 shadow-2xl z-50 text-left">
                  <div className="px-3.5 py-2.5 border-b border-white/[0.04] mb-1">
                    <p className="text-[11px] font-black text-white leading-none">Vunex Security Desk</p>
                    <p className="text-[8px] text-gray-500 mt-1 leading-none">ID: #ADM-9482</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      triggerToast('Redirecting to Profile settings...');
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      triggerToast('Opening Security settings...');
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    Security Settings
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full px-3 py-2 text-left text-xs font-black text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer mt-1 border-t border-white/[0.02] pt-2"
                  >
                    Logout Admin Console
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <button 
              onClick={() => triggerToast('Opening quick terminal action console...')}
              className="h-9 px-3 sm:px-4 bg-[#1e60ff] hover:bg-[#1e60ff]/90 active:scale-[0.98] text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(30,96,255,0.25)] hidden sm:flex"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-transparent animate-pulse" />
              <span className="hidden md:inline">Quick Actions</span>
            </button>

          </div>

        </header>

        {/* CONTAINER FOR DASHBOARD CONTENT */}
        <div className="p-6 space-y-6 flex-grow max-w-[1600px] w-full mx-auto text-left">
          
          {/* TITLE HEADER */}
          <div className="flex flex-col text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none" id="dashboard-title">Dashboard Overview</h1>
            <p className="text-[11.5px] text-gray-500 font-semibold mt-1.5">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>

          {/* 6 STATE CARDS WITH GRAPH IN BG */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4" id="stats-summary-grid">
            
            {[
              { label: 'Total Users', val: '24,589', trend: '+18.6% vs last month', color: 'text-emerald-400' },
              { label: 'Active Traders', val: '5,683', trend: '+21.4% vs last month', color: 'text-emerald-400' },
              { label: 'Total Deposits', val: '$8,932,456', trend: '+15.7% vs last month', color: 'text-emerald-400' },
              { label: 'Total Withdrawals', val: '$5,321,789', trend: '+13.2% vs last month', color: 'text-emerald-400' },
              { label: 'Total Revenue', val: '$892,450', trend: '+23.8% vs last month', color: 'text-emerald-400' },
              { label: 'Trading Volume', val: '$22,456,789', trend: '+28.9% vs last month', color: 'text-emerald-400' }
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className="bg-[#07070a]/90 border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.01] rounded-2xl p-4 flex flex-col justify-between h-[110px] relative overflow-hidden transition-all text-left"
              >
                {/* Micro Sparkline background */}
                <div className="absolute inset-x-0 bottom-0 h-[40px] opacity-15 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path 
                      d={`M0,100 C10,${80 - (i*5)} 20,${60 + (i*3)} 30,${70 - (i*4)} 40,${45 + (i*2)} 50,${50 - (i*6)} 60,${30 + (i*4)} 70,${40 - (i*5)} 80,${15 + (i*3)} 90,${25 - (i*2)} 100,5`} 
                      fill="none" 
                      stroke="#1e60ff" 
                      strokeWidth="2.5" 
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">{stat.label}</span>
                  <div className="text-lg font-black text-white tracking-tight">{stat.val}</div>
                </div>

                <div className="flex items-center gap-1 mt-1 text-[9px] font-bold z-10">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className={stat.color}>{stat.trend}</span>
                </div>
              </div>
            ))}

          </div>

          {/* MAIN COLUMN TIERS: MAP, ANALYTICS, LIVE FEED */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch" id="tier-content-grid">
            
            {/* 1. Market Overview Card (World map popups - occupies 4 cols) */}
            <div className="xl:col-span-4 bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">Market Overview</h3>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-[#1e60ff]/10 border border-[#1e60ff]/20 text-[#1e60ff] uppercase">Global Network</span>
                </div>

                {/* World map stylized viewport with absolute interactive indicators */}
                <div className="relative w-full h-[180px] bg-[#020203]/40 border border-white/[0.02] rounded-xl overflow-hidden mb-4 p-2 flex items-center justify-center">
                  
                  {/* Grid background mask */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

                  {/* Stylized vector map outlines */}
                  <div className="absolute inset-0 opacity-40 mix-blend-screen px-4 py-2 pointer-events-none">
                    <svg className="w-full h-full text-gray-700" viewBox="0 0 1000 500" fill="currentColor">
                      {/* Stylized generic geographic bounds representing world landmass */}
                      <path d="M150,150 L220,130 L250,170 L300,120 L270,80 L200,90 Z" />
                      <path d="M120,250 L180,200 L210,240 L160,320 L130,290 Z" />
                      <path d="M450,120 L520,70 L580,90 L610,130 L550,180 L480,160 Z" />
                      <path d="M420,220 L480,200 L510,260 L440,310 Z" />
                      <path d="M720,180 L790,140 L850,160 L830,220 L760,250 Z" />
                      <path d="M790,320 L840,300 L870,330 L830,370 Z" />
                    </svg>
                  </div>

                  {/* POPUPS MATCHING SCREENSHOT EXACTLY */}
                  
                  {/* North America */}
                  <div className="absolute top-[22%] left-[16%] flex flex-col items-center">
                    <div className="bg-[#09090c]/95 border border-[#1e60ff]/30 shadow-lg rounded px-2 py-1 text-[8px] font-bold text-white leading-none backdrop-blur-xs">
                      <p className="text-gray-500">North America</p>
                      <p className="text-white mt-1">16,056 <span className="text-emerald-400 font-extrabold">+23.5%</span></p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#1e60ff] animate-ping absolute -bottom-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff] absolute -bottom-[14px] shadow-[0_0_8px_#1e60ff]" />
                  </div>

                  {/* Europe */}
                  <div className="absolute top-[12%] left-[46%] flex flex-col items-center">
                    <div className="bg-[#09090c]/95 border border-[#1e60ff]/30 shadow-lg rounded px-2 py-1 text-[8px] font-bold text-white leading-none backdrop-blur-xs">
                      <p className="text-gray-500">Europe</p>
                      <p className="text-white mt-1">8,756 <span className="text-emerald-400 font-extrabold">+17.2%</span></p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#1e60ff] animate-ping absolute -bottom-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff] absolute -bottom-[14px] shadow-[0_0_8px_#1e60ff]" />
                  </div>

                  {/* Asia */}
                  <div className="absolute top-[24%] left-[72%] flex flex-col items-center">
                    <div className="bg-[#09090c]/95 border border-[#1e60ff]/30 shadow-lg rounded px-2 py-1 text-[8px] font-bold text-white leading-none backdrop-blur-xs">
                      <p className="text-gray-500">Asia</p>
                      <p className="text-white mt-1">15,785 <span className="text-emerald-400 font-extrabold">+28.1%</span></p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#1e60ff] animate-ping absolute -bottom-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff] absolute -bottom-[14px] shadow-[0_0_8px_#1e60ff]" />
                  </div>

                  {/* South America */}
                  <div className="absolute bottom-[24%] left-[24%] flex flex-col items-center">
                    <div className="bg-[#09090c]/95 border border-[#1e60ff]/30 shadow-lg rounded px-2 py-1 text-[8px] font-bold text-white leading-none backdrop-blur-xs">
                      <p className="text-gray-500">South America</p>
                      <p className="text-white mt-1">4,325 <span className="text-emerald-400 font-extrabold">+12.4%</span></p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#1e60ff] animate-ping absolute -bottom-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff] absolute -bottom-[14px] shadow-[0_0_8px_#1e60ff]" />
                  </div>

                  {/* Africa */}
                  <div className="absolute bottom-[28%] left-[48%] flex flex-col items-center">
                    <div className="bg-[#09090c]/95 border border-[#1e60ff]/30 shadow-lg rounded px-2 py-1 text-[8px] font-bold text-white leading-none backdrop-blur-xs">
                      <p className="text-gray-500">Africa</p>
                      <p className="text-white mt-1">2,155 <span className="text-emerald-400 font-extrabold">+8.7%</span></p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#1e60ff] animate-ping absolute -bottom-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff] absolute -bottom-[14px] shadow-[0_0_8px_#1e60ff]" />
                  </div>

                  {/* Australia */}
                  <div className="absolute bottom-[22%] left-[82%] flex flex-col items-center">
                    <div className="bg-[#09090c]/95 border border-[#1e60ff]/30 shadow-lg rounded px-2 py-1 text-[8px] font-bold text-white leading-none backdrop-blur-xs">
                      <p className="text-gray-500">Australia</p>
                      <p className="text-white mt-1">3,245 <span className="text-emerald-400 font-extrabold">+15.6%</span></p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#1e60ff] animate-ping absolute -bottom-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff] absolute -bottom-[14px] shadow-[0_0_8px_#1e60ff]" />
                  </div>

                </div>
              </div>

              {/* Metrics grid row footer under world map */}
              <div className="grid grid-cols-4 gap-2 border-t border-white/[0.04] pt-4.5 text-[11px] font-bold text-left select-none">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-extrabold">Total Countries</span>
                  <span className="text-white font-black text-[13px] mt-1 block">128</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-extrabold">Total Cities</span>
                  <span className="text-white font-black text-[13px] mt-1 block">842</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-extrabold">Global Reach</span>
                  <span className="text-white font-black text-[13px] mt-1 block">98.6%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-extrabold">System Uptime</span>
                  <span className="text-emerald-400 font-black text-[13px] mt-1 block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                    99.99%
                  </span>
                </div>
              </div>

            </div>

            {/* 2. Trading Analytics Chart (with tooltips - occupies 5 cols) */}
            <div className="xl:col-span-5 bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">Trading Analytics</h3>
                  
                  {/* Timeframe buttons */}
                  <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-xl p-0.5">
                    {(['1D', '7D', '30D', '90D', '1Y'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => {
                          setActiveTimeframe(tf);
                          triggerToast(`Chart updated to ${tf} timeframe`);
                        }}
                        className={`px-2.5 py-1 text-[9px] font-extrabold rounded-lg transition-all cursor-pointer ${
                          activeTimeframe === tf 
                            ? 'bg-[#1e60ff] text-white shadow-md' 
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Chart Canvas Area */}
                <div 
                  className="relative h-[180px] border border-white/[0.02] bg-black/20 rounded-xl overflow-hidden mb-4 select-none cursor-crosshair"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Simple heuristic to snap to hover data
                    setHoveredData({
                      date: 'May 28, 2024',
                      deposits: '$1,788,500',
                      withdrawals: '$1,065,400',
                      revenue: '$332,450',
                      x,
                      y
                    });
                  }}
                  onMouseLeave={() => setHoveredData(null)}
                >
                  {/* Left grid labels */}
                  <div className="absolute top-2 left-2 text-[7.5px] text-gray-600 font-bold space-y-4 text-right">
                    <p>$2.5M</p>
                    <p>$2.0M</p>
                    <p>$1.5M</p>
                    <p>$1.0M</p>
                    <p>$500K</p>
                    <p>$0</p>
                  </div>

                  {/* Horizontal grid guide lines */}
                  <div className="absolute inset-x-8 top-[10%] bottom-[10%] flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="h-[1px] bg-white/[0.02] w-full" />
                    <div className="h-[1px] bg-white/[0.02] w-full" />
                    <div className="h-[1px] bg-white/[0.02] w-full" />
                    <div className="h-[1px] bg-white/[0.02] w-full" />
                    <div className="h-[1px] bg-white/[0.02] w-full" />
                  </div>

                  {/* Vector SVG Multi Area charts */}
                  <svg className="absolute inset-0 w-full h-full p-2 pl-12 pb-5 opacity-90" viewBox="0 0 400 150" preserveAspectRatio="none">
                    
                    {/* Deposits line and fill gradient */}
                    <defs>
                      <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#1e60ff" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="witGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* DEPOSITS AREA CHART (Blue) */}
                    <path 
                      d="M0,80 Q40,65 80,95 T160,50 T240,75 T320,40 T400,30 L400,150 L0,150 Z" 
                      fill="url(#depGrad)"
                    />
                    <path 
                      d="M0,80 Q40,65 80,95 T160,50 T240,75 T320,40 T400,30" 
                      fill="none" 
                      stroke="#1e60ff" 
                      strokeWidth="2.2" 
                      strokeLinecap="round"
                    />

                    {/* WITHDRAWALS AREA CHART (Green) */}
                    <path 
                      d="M0,110 Q45,100 90,120 T180,85 T270,115 T360,80 T400,75 L400,150 L0,150 Z" 
                      fill="url(#witGrad)"
                    />
                    <path 
                      d="M0,110 Q45,100 90,120 T180,85 T270,115 T360,80 T400,75" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />

                    {/* REVENUE LINE CHART (Purple) */}
                    <path 
                      d="M0,130 Q50,120 100,135 T200,110 T300,125 T400,95" 
                      fill="none" 
                      stroke="#a855f7" 
                      strokeWidth="1.8" 
                      strokeLinecap="round"
                    />

                  </svg>

                  {/* Absolute date markers */}
                  <div className="absolute bottom-1 left-12 right-2 flex justify-between text-[7px] text-gray-500 font-bold">
                    <span>May 15</span>
                    <span>May 20</span>
                    <span>May 25</span>
                    <span>May 30</span>
                    <span>Jun 5</span>
                    <span>Jun 10</span>
                  </div>

                  {/* GLOWING HOVER TOOLTIP CARD MATCHING GRAPH POPUP EXACTLY */}
                  <AnimatePresence>
                    {hoveredData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-30 bg-[#09090c]/95 border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.8)] rounded-xl p-3 text-[10px] backdrop-blur-md min-w-[150px] font-semibold text-left pointer-events-none"
                        style={{ 
                          left: Math.max(12, Math.min(hoveredData.x - 75, 230)), 
                          top: Math.max(12, Math.min(hoveredData.y - 120, 60)) 
                        }}
                      >
                        <p className="text-gray-500 text-[8.5px] uppercase font-bold mb-1.5">{hoveredData.date}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#1e60ff] rounded-full inline-block" />
                              <span className="text-gray-400 text-[9px] font-bold">Deposits</span>
                            </div>
                            <span className="text-white font-black">{hoveredData.deposits}</span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full inline-block" />
                              <span className="text-gray-400 text-[9px] font-bold">Withdrawals</span>
                            </div>
                            <span className="text-white font-black">{hoveredData.withdrawals}</span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#a855f7] rounded-full inline-block" />
                              <span className="text-gray-400 text-[9px] font-bold">Revenue</span>
                            </div>
                            <span className="text-white font-black">{hoveredData.revenue}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* Chart Legend Footer */}
              <div className="flex items-center justify-start gap-5 text-[9.5px] font-extrabold text-gray-500 border-t border-white/[0.04] pt-4.5 select-none pl-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e60ff] shadow-[0_0_6px_#1e60ff]" />
                  <span>Deposits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                  <span>Withdrawals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_#a855f7]" />
                  <span>Revenue</span>
                </div>
              </div>

            </div>

            {/* 3. Live Trades Feed Card (fully animated feeding list - occupies 4 cols) */}
            <div className="xl:col-span-4 bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">Live Trades Feed</h3>
                  <button 
                    onClick={() => triggerToast('Opening full-screen real-time trades dashboard...')}
                    className="text-[9.5px] font-extrabold text-[#1e60ff] hover:underline uppercase tracking-wide cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* Table Layout Column block */}
                <div className="space-y-2 max-h-[220px] overflow-hidden">
                  
                  {/* Table Header */}
                  <div className="grid grid-cols-12 text-[8.5px] font-bold text-gray-600 uppercase pb-1 border-b border-white/[0.03] select-none pl-1.5">
                    <span className="col-span-4 text-left">Pair</span>
                    <span className="col-span-2 text-center">Type</span>
                    <span className="col-span-3 text-right">Amount</span>
                    <span className="col-span-3 text-right">Time</span>
                  </div>

                  <div className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {trades.map((trade, index) => (
                        <motion.div
                          key={`${trade.pair}-${trade.timestamp}-${index}`}
                          initial={index === 0 ? { opacity: 0, x: -10, height: 0 } : false}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-12 text-[11px] font-bold py-1.5 px-2 bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/[0.03] rounded-lg items-center transition-colors select-none"
                        >
                          {/* Pair Name and Icon */}
                          <div className="col-span-4 flex items-center gap-2 text-left">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1e60ff]" />
                            <span className="text-white font-black tracking-tight">{trade.pair}</span>
                          </div>

                          {/* Buy/Sell badge */}
                          <div className="col-span-2 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase ${
                              trade.type === 'Buy' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {trade.type}
                            </span>
                          </div>

                          {/* Amount */}
                          <span className="col-span-3 text-right font-mono text-gray-200 tracking-tight">{trade.amount}</span>

                          {/* Time */}
                          <span className="col-span-3 text-right text-gray-500 font-medium font-sans text-[10px]">{trade.time}</span>

                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                </div>
              </div>

              {/* Table Live count metrics */}
              <div className="flex items-center justify-between text-[9px] text-gray-600 font-extrabold border-t border-white/[0.04] pt-4 select-none mt-4 pl-1">
                <span className="uppercase">Feeding Stream Live</span>
                <span className="text-[#1e60ff] font-black uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#1e60ff] rounded-full inline-block animate-ping" />
                  Synced
                </span>
              </div>

            </div>

          </div>

          {/* LOWER GRID: REVENUE BREAKDOWN, ACTIVITIES, TOP TRADERS, PERFORMANCE & SECURITY */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch" id="lower-content-grid">
            
            {/* 1. Revenue Breakdown (Doughnut - occupies 3 cols) */}
            <div className="xl:col-span-3 bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden text-left">
              <div>
                <h3 className="text-xs font-black text-white tracking-wider uppercase mb-1">Revenue Breakdown</h3>
                <p className="text-[10px] text-gray-500 font-bold mb-4">This Month — $892,450</p>

                {/* SVG Doughnut Ring in center */}
                <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    
                    {/* Segment 1: Trading Fees 51.1% (Blue) */}
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" stroke="#1e60ff" strokeWidth="12" 
                      strokeDasharray="122 238" 
                      strokeDashoffset="0"
                    />

                    {/* Segment 2: Withdrawal Fees 20.8% (Green) */}
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" stroke="#10b981" strokeWidth="12" 
                      strokeDasharray="50 238" 
                      strokeDashoffset="-122"
                    />

                    {/* Segment 3: Deposit Fees 14% (Purple) */}
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" stroke="#a855f7" strokeWidth="12" 
                      strokeDasharray="33 238" 
                      strokeDashoffset="-172"
                    />

                    {/* Segment 4: Subscription 9.5% (Orange) */}
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" stroke="#f97316" strokeWidth="12" 
                      strokeDasharray="23 238" 
                      strokeDashoffset="-205"
                    />

                    {/* Segment 5: Others 4.6% (Yellow) */}
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" stroke="#eab308" strokeWidth="12" 
                      strokeDasharray="10 238" 
                      strokeDashoffset="-228"
                    />

                  </svg>
                  
                  {/* Central balance labels */}
                  <div className="absolute flex flex-col items-center leading-none">
                    <span className="text-sm font-black text-white">$892K</span>
                    <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-widest mt-1">Captured</span>
                  </div>
                </div>

                {/* Legend list matching Page 10 exactly */}
                <div className="space-y-2.5 text-[10.5px] font-bold">
                  
                  <div className="flex items-center justify-between py-1 border-b border-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#1e60ff]" />
                      <span className="text-gray-400">Trading Fees</span>
                    </div>
                    <span className="text-white font-black">$456,230 <span className="text-gray-500 text-[9px] font-semibold">51.1%</span></span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
                      <span className="text-gray-400">Withdrawal Fees</span>
                    </div>
                    <span className="text-white font-black">$185,420 <span className="text-gray-500 text-[9px] font-semibold">20.8%</span></span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#a855f7]" />
                      <span className="text-gray-400">Deposit Fees</span>
                    </div>
                    <span className="text-white font-black">$125,360 <span className="text-gray-500 text-[9px] font-semibold">14.0%</span></span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316]" />
                      <span className="text-gray-400">Subscription</span>
                    </div>
                    <span className="text-white font-black">$85,240 <span className="text-gray-500 text-[9px] font-semibold">9.5%</span></span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#eab308]" />
                      <span className="text-gray-400">Others</span>
                    </div>
                    <span className="text-white font-black">$40,200 <span className="text-gray-500 text-[9px] font-semibold">4.6%</span></span>
                  </div>

                </div>
              </div>
            </div>

            {/* 2. Recent Activities (occupies 3 cols) */}
            <div className="xl:col-span-3 bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">Recent Activities</h3>
                  <button 
                    onClick={() => triggerToast('Opening system security audit console...')}
                    className="text-[9.5px] font-extrabold text-[#1e60ff] hover:underline uppercase tracking-wide cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* Activity List Timeline */}
                <div className="space-y-4">
                  
                  {/* Item 1 */}
                  <div className="flex gap-3 text-left">
                    <div className="w-7 h-7 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-[11px] font-bold">
                      <span className="text-white leading-none">New user registered</span>
                      <span className="text-gray-500 mt-1 leading-none font-medium">john.doe@example.com</span>
                      <span className="text-[9.5px] text-gray-600 mt-1.5 leading-none font-sans font-medium">2 min ago</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-3 text-left">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-[11px] font-bold">
                      <span className="text-white leading-none">KYC verification approved</span>
                      <span className="text-gray-500 mt-1 leading-none font-medium">user_12345</span>
                      <span className="text-[9.5px] text-gray-600 mt-1.5 leading-none font-sans font-medium">15 min ago</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-3 text-left">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-[11px] font-bold">
                      <span className="text-white leading-none">Deposit received $5,000</span>
                      <span className="text-gray-500 mt-1 leading-none font-medium">by user_54321</span>
                      <span className="text-[9.5px] text-gray-600 mt-1.5 leading-none font-sans font-medium">25 min ago</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex gap-3 text-left">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-[11px] font-bold">
                      <span className="text-white leading-none">Withdrawal processed $2,500</span>
                      <span className="text-gray-500 mt-1 leading-none font-medium">to user_54321</span>
                      <span className="text-[9.5px] text-gray-600 mt-1.5 leading-none font-sans font-medium">45 min ago</span>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="flex gap-3 text-left">
                    <div className="w-7 h-7 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-[11px] font-bold">
                      <span className="text-white leading-none">New trading account created</span>
                      <span className="text-gray-500 mt-1 leading-none font-medium">trader_pro_001</span>
                      <span className="text-[9.5px] text-gray-600 mt-1.5 leading-none font-sans font-medium">1 hour ago</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 3. Top Traders Leaderboard (occupies 3 cols) */}
            <div className="xl:col-span-3 bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">Top Traders</h3>
                  <button 
                    onClick={() => triggerToast('Opening full-scale leaderboards...')}
                    className="text-[9.5px] font-extrabold text-[#1e60ff] hover:underline uppercase tracking-wide cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* Leaderboard rows exactly matching screenshot */}
                <div className="space-y-2.5">
                  
                  {/* Rank 1 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#eab308]/5 border border-[#eab308]/15 select-none hover:border-[#eab308]/30 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30 flex items-center justify-center text-[10px] font-black">
                        1
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-white leading-none">Trader_Pro_001</span>
                        <span className="text-[8px] text-gray-500 mt-1 leading-none font-bold uppercase">Pro Account</span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right leading-none">
                      <span className="text-[11.5px] font-black text-white">$245,678</span>
                      <span className="text-[8.5px] text-emerald-400 font-extrabold mt-1 leading-none">+24.5%</span>
                    </div>
                  </div>

                  {/* Rank 2 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-400/5 border border-slate-400/15 select-none hover:border-slate-400/30 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-400/10 text-slate-400 border border-slate-400/30 flex items-center justify-center text-[10px] font-black">
                        2
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-white leading-none">Crypto_King</span>
                        <span className="text-[8px] text-gray-500 mt-1 leading-none font-bold uppercase">Basic Account</span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right leading-none">
                      <span className="text-[11.5px] font-black text-white">$198,432</span>
                      <span className="text-[8.5px] text-emerald-400 font-extrabold mt-1 leading-none">+18.7%</span>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-700/5 border border-amber-700/15 select-none hover:border-amber-700/30 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-amber-700/10 text-amber-700 border border-amber-700/30 flex items-center justify-center text-[10px] font-black">
                        3
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-white leading-none">Whale_Master</span>
                        <span className="text-[8px] text-gray-500 mt-1 leading-none font-bold uppercase">Whale Class</span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right leading-none">
                      <span className="text-[11.5px] font-black text-white">$176,890</span>
                      <span className="text-[8.5px] text-emerald-400 font-extrabold mt-1 leading-none">+15.3%</span>
                    </div>
                  </div>

                  {/* Rank 4 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/[0.04] select-none hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-white/5 text-gray-400 border border-white/10 flex items-center justify-center text-[10px] font-black">
                        4
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-white leading-none">Alpha_Trader</span>
                        <span className="text-[8px] text-gray-500 mt-1 leading-none font-bold uppercase">Partner</span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right leading-none">
                      <span className="text-[11.5px] font-black text-white">$142,567</span>
                      <span className="text-[8.5px] text-emerald-400 font-extrabold mt-1 leading-none">+12.1%</span>
                    </div>
                  </div>

                  {/* Rank 5 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/[0.04] select-none hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-white/5 text-gray-400 border border-white/10 flex items-center justify-center text-[10px] font-black">
                        5
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-white leading-none">Black_Hunter</span>
                        <span className="text-[8px] text-gray-500 mt-1 leading-none font-bold uppercase">Standard</span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right leading-none">
                      <span className="text-[11.5px] font-black text-white">$128,945</span>
                      <span className="text-[8.5px] text-emerald-400 font-extrabold mt-1 leading-none">+9.8%</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 4. Performance & Security Dials (occupies 3 cols) */}
            <div className="xl:col-span-3 space-y-4 flex flex-col justify-between">
              
              {/* Box A: System Performance circular rings */}
              <div className="bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-4 text-left hover:border-white/[0.08] transition-all flex flex-col justify-between flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">System Performance</h3>
                  <button 
                    onClick={() => triggerToast('Opening full systems latency dashboard...')}
                    className="text-[9px] font-extrabold text-[#1e60ff] hover:underline uppercase cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                {/* 4 Rings Row Layout matching screenshot */}
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 items-center text-center">
                  
                  {/* Circle 1 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1.5">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2.5" opacity="0.03" />
                        <circle cx="16" cy="16" r="14" fill="none" stroke="#1e60ff" strokeWidth="3" strokeDasharray="32 100" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-[9.5px] font-black text-white">{cpu}%</span>
                    </div>
                    <span className="text-[7.5px] text-gray-500 font-black uppercase tracking-wider block">CPU Usage</span>
                  </div>

                  {/* Circle 2 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1.5">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2.5" opacity="0.03" />
                        <circle cx="16" cy="16" r="14" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="61 100" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-[9.5px] font-black text-white">{memory}%</span>
                    </div>
                    <span className="text-[7.5px] text-gray-500 font-black uppercase tracking-wider block">Memory</span>
                  </div>

                  {/* Circle 3 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1.5">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2.5" opacity="0.03" />
                        <circle cx="16" cy="16" r="14" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="47 100" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-[9.5px] font-black text-white">{disk}%</span>
                    </div>
                    <span className="text-[7.5px] text-gray-500 font-black uppercase tracking-wider block">Disk Usage</span>
                  </div>

                  {/* Circle 4 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1.5">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2.5" opacity="0.03" />
                        <circle cx="16" cy="16" r="14" fill="none" stroke="#00c8ff" strokeWidth="3" strokeDasharray="82 100" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-[9.5px] font-black text-white">{network}%</span>
                    </div>
                    <span className="text-[7.5px] text-gray-500 font-black uppercase tracking-wider block">Network</span>
                  </div>

                </div>
              </div>

              {/* Box B: Security Overview containing holographic lock & status list */}
              <div className="bg-[#07070a]/90 border border-white/[0.04] rounded-2xl p-4 text-left hover:border-white/[0.08] transition-all flex flex-col justify-between flex-grow">
                <h3 className="text-xs font-black text-white tracking-wider uppercase mb-3">Security Overview</h3>

                <div className="grid grid-cols-12 gap-3 items-center">
                  
                  {/* Holographic Lock widget on Left */}
                  <div className="col-span-5 relative w-full h-[85px] border border-[#1e60ff]/25 rounded-xl bg-[#1e60ff]/5 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent animate-pulse pointer-events-none" />
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#1e60ff]/30 animate-spin [animation-duration:10s]" />
                    <div className="relative z-10 w-9 h-9 bg-[#030304] border border-[#1e60ff]/30 rounded-lg flex items-center justify-center text-[#1e60ff]">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  {/* Security List Details on Right */}
                  <div className="col-span-7 space-y-1.5 text-[9.5px] font-semibold text-gray-500">
                    
                    <div className="flex items-center justify-between">
                      <span>Login Attempts</span>
                      <span className="text-white font-black">1,245 <span className="text-emerald-400 text-[8px] font-bold">▲ 12%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Suspicious Activities</span>
                      <span className="text-white font-black">23 <span className="text-rose-400 text-[8px] font-bold">▼ 8%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Blocked IPs</span>
                      <span className="text-white font-black">45 <span className="text-rose-400 text-[8px] font-bold">▲ 15%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>2FA Enabled Users</span>
                      <span className="text-white font-black">78.6% <span className="text-emerald-400 text-[8px] font-bold">▲ 5%</span></span>
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM REAL-TIME FOOTER STATUS BAR */}
        <footer className="py-3 md:py-0 md:h-10 border-t border-white/[0.04] bg-black/60 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-0 text-[10px] text-gray-500 font-bold select-none mt-auto" id="admin-footer">
          
          {/* Status and Ticking UTC Clock */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-center">
            <div className="flex items-center gap-1.5">
              <span>Server:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-black">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                Operational
              </span>
            </div>
            <span className="text-gray-800 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <span>Time:</span>
              <span className="text-white font-black flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                {utcTime || '10:24:35 UTC'}
              </span>
            </div>
          </div>

          {/* Center Copyright */}
          <div className="text-center hidden sm:block">
            <span>© 2026 VUNEX MARKET. All rights reserved.</span>
          </div>

          {/* Right Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button onClick={() => triggerToast('Privacy Policy accessed')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <span className="text-gray-800 hidden xs:inline">|</span>
            <button onClick={() => triggerToast('Terms of Service accessed')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</button>
          </div>

        </footer>

      </div>

    </div>
  );
}
