import React, { useState, useEffect } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Info, 
  ChevronRight, 
  Bell, 
  Search, 
  HelpCircle, 
  Settings, 
  User, 
  Shield, 
  FileText, 
  Wallet, 
  LayoutDashboard, 
  Globe, 
  Lock, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  X,
  CreditCard,
  History,
  ShieldCheck,
  Building,
  Monitor,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import vunexLogo from '../assets/images/cutouts/logo_official.png';
import bullAsset from '../assets/images/cutouts/bull.png';

interface WalletDashboardProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

// Transaction data sets to support pagination
const TRANSACTION_PAGES: Record<number, Array<{
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Trade';
  description: string;
  amount: number;
  isPositive: boolean;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}>> = {
  1: [
    { id: 'tx-1', type: 'Deposit', description: 'Bank Transfer', amount: 5000.00, isPositive: true, status: 'Completed', date: 'May 28, 2025 10:45 AM' },
    { id: 'tx-2', type: 'Withdrawal', description: 'Bank Transfer', amount: 2150.00, isPositive: false, status: 'Completed', date: 'May 27, 2025 04:32 PM' },
    { id: 'tx-3', type: 'Transfer', description: 'Trading Account', amount: 1500.00, isPositive: false, status: 'Completed', date: 'May 27, 2025 11:18 AM' },
    { id: 'tx-4', type: 'Trade', description: 'XAU/USD', amount: 320.45, isPositive: true, status: 'Completed', date: 'May 27, 2025 09:27 AM' },
    { id: 'tx-5', type: 'Deposit', description: 'Crypto Deposit', amount: 3250.00, isPositive: true, status: 'Completed', date: 'May 26, 2025 08:15 PM' }
  ],
  2: [
    { id: 'tx-6', type: 'Trade', description: 'BTC/USD Sell Order', amount: 1240.00, isPositive: true, status: 'Completed', date: 'May 25, 2025 02:14 PM' },
    { id: 'tx-7', type: 'Transfer', description: 'Funding Account', amount: 500.00, isPositive: true, status: 'Completed', date: 'May 25, 2025 10:30 AM' },
    { id: 'tx-8', type: 'Withdrawal', description: 'Crypto Wallet', amount: 1200.00, isPositive: false, status: 'Completed', date: 'May 24, 2025 06:45 PM' },
    { id: 'tx-9', type: 'Trade', description: 'EUR/USD Buy Order', amount: 150.25, isPositive: false, status: 'Completed', date: 'May 23, 2025 11:20 AM' },
    { id: 'tx-10', type: 'Deposit', description: 'Debit Card Instant', amount: 1000.00, isPositive: true, status: 'Completed', date: 'May 22, 2025 08:10 AM' }
  ],
  3: [
    { id: 'tx-11', type: 'Trade', description: 'GBP/USD Buy Order', amount: 480.00, isPositive: true, status: 'Completed', date: 'May 21, 2025 03:22 PM' },
    { id: 'tx-12', type: 'Deposit', description: 'Apple Pay Instant', amount: 2500.00, isPositive: true, status: 'Completed', date: 'May 20, 2025 01:15 PM' },
    { id: 'tx-13', type: 'Transfer', description: 'Trading Account', amount: 3000.00, isPositive: false, status: 'Completed', date: 'May 19, 2025 09:12 AM' },
    { id: 'tx-14', type: 'Withdrawal', description: 'Bank Wire Transfer', amount: 5000.00, isPositive: false, status: 'Completed', date: 'May 18, 2025 04:50 PM' },
    { id: 'tx-15', type: 'Trade', description: 'NAS100 Sell Order', amount: 890.30, isPositive: true, status: 'Completed', date: 'May 17, 2025 10:30 AM' }
  ],
  4: [
    { id: 'tx-16', type: 'Deposit', description: 'Bank Wire Transfer', amount: 10000.00, isPositive: true, status: 'Completed', date: 'May 15, 2025 09:00 AM' },
    { id: 'tx-17', type: 'Trade', description: 'XAG/USD Buy Order', amount: 210.40, isPositive: false, status: 'Completed', date: 'May 14, 2025 02:40 PM' },
    { id: 'tx-18', type: 'Transfer', description: 'E-Wallet Instant', amount: 200.00, isPositive: true, status: 'Completed', date: 'May 12, 2025 05:15 PM' },
    { id: 'tx-19', type: 'Withdrawal', description: 'Debit Card Refund', amount: 350.00, isPositive: false, status: 'Completed', date: 'May 10, 2025 11:10 AM' },
    { id: 'tx-20', type: 'Deposit', description: 'Crypto Deposit BTC', amount: 4500.00, isPositive: true, status: 'Completed', date: 'May 08, 2025 08:30 AM' }
  ]
};

export default function WalletDashboard({ onLogout, onNavigate }: WalletDashboardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  
  // Interactive modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('5000');
  const [withdrawAmount, setWithdrawAmount] = useState('1000');
  const [transferAmount, setTransferAmount] = useState('500');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Dynamic balance states
  const [totalBalance, setTotalBalance] = useState(48750.26);
  const [availableBalance, setAvailableBalance] = useState(32541.76);
  const [unrealizedPnl, setUnrealizedPnl] = useState(1286.34);
  const [reservedMargin, setReservedMargin] = useState(12845.30);
  const [equity, setEquity] = useState(45387.06);

  useEffect(() => {
    import('../api/trading')
      .then(({ fetchTradingProfile }) => fetchTradingProfile())
      .then((p) => {
        const w = p.wallet;
        if (!w) return;
        setAvailableBalance(w.availableBalance);
        setTotalBalance(w.totalEquity);
        setReservedMargin(w.lockedBalance);
        setEquity(w.totalEquity);
        setUnrealizedPnl(0);
      })
      .catch(() => undefined);
  }, []);

  // Helper to trigger success toasts
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Copy Account ID
  const handleCopyAccountID = () => {
    navigator.clipboard.writeText('VMF-778899');
    setCopied(true);
    triggerToast('Account ID VMF-778899 copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Perform quick actions
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) return;
    try {
      const { createDeposit } = await import('../api/trading');
      await createDeposit(val, 'manual', { instant: true });
      setTotalBalance((prev) => prev + val);
      setAvailableBalance((prev) => prev + val);
      setEquity((prev) => prev + val);
      setShowDepositModal(false);
      triggerToast(`Successfully deposited $${val.toLocaleString()}!`);
    } catch (err: any) {
      triggerToast(err.message || 'Deposit failed');
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) return;
    if (val > availableBalance) {
      triggerToast('Withdrawal amount exceeds available balance.');
      return;
    }
    try {
      const { createWithdrawal } = await import('../api/trading');
      await createWithdrawal(val, { account: 'wallet-ui' }, 'bank');
      setTotalBalance((prev) => prev - val);
      setAvailableBalance((prev) => prev - val);
      setEquity((prev) => prev - val);
      setShowWithdrawModal(false);
      triggerToast(`Withdrawal of $${val.toLocaleString()} requested (pending approval).`);
    } catch (err: any) {
      triggerToast(err.message || 'Withdrawal failed');
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(transferAmount);
    if (isNaN(val) || val <= 0) return;
    if (val > availableBalance) {
      triggerToast('Transfer amount exceeds available balance.');
      return;
    }
    setAvailableBalance(prev => prev - val);
    setReservedMargin(prev => prev + val);
    setShowTransferModal(false);
    triggerToast(`Transferred $${val.toLocaleString()} from Funding Wallet to MT5 Trading Ledger.`);
  };

  // Pie chart calculation helper variables
  const allocationData = [
    { name: 'USD', value: 25925.40, percentage: 53.2, color: '#1e60ff', hoverColor: '#3b82f6' },
    { name: 'EUR', value: 9125.21, percentage: 18.7, color: '#4f46e5', hoverColor: '#6366f1' },
    { name: 'BTC', value: 6046.11, percentage: 12.4, color: '#f59e0b', hoverColor: '#fbbf24' },
    { name: 'XAU', value: 3954.38, percentage: 8.1, color: '#eab308', hoverColor: '#facc15' },
    { name: 'Others', value: 3699.18, percentage: 7.6, color: '#4b5563', hoverColor: '#6b7280' },
  ];

  // Render linear trend graph vectors depending on timeframe selected
  const getTrendDataPoints = () => {
    switch (activeTimeframe) {
      case '1D':
        return "M 10 90 L 40 85 L 70 88 L 100 80 L 130 84 L 160 75 L 190 79 L 220 70 L 250 72 L 280 65 L 310 68 L 340 55 L 370 58 L 400 48";
      case '1W':
        return "M 10 85 L 40 70 L 70 90 L 100 65 L 130 72 L 160 50 L 190 68 L 220 40 L 250 55 L 280 30 L 310 42 L 340 25 L 370 38 L 400 20";
      case '1M':
        return "M 10 95 L 40 80 L 70 85 L 100 70 L 130 75 L 160 60 L 190 65 L 220 50 L 250 55 L 280 40 L 310 45 L 340 30 L 370 35 L 400 15";
      case '3M':
        return "M 10 90 L 40 95 L 70 85 L 100 88 L 130 78 L 160 82 L 190 70 L 220 74 L 250 62 L 280 66 L 310 52 L 340 56 L 370 45 L 400 50";
      case '1Y':
        return "M 10 75 L 40 80 L 70 70 L 100 75 L 130 65 L 160 70 L 190 55 L 220 60 L 250 45 L 280 50 L 310 35 L 340 40 L 370 25 L 400 30";
      default:
        return "M 10 90 L 40 85 L 70 88 L 100 80";
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans flex flex-col overflow-x-hidden selection:bg-blue-600/30 selection:text-white" id="wallet-dashboard-container">
      
      {/* SUCCESS TOAST ALERTS */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-[#1e60ff]/20 shadow-2xl z-100 flex items-center gap-3 backdrop-blur-md bg-black/90 min-w-[320px] max-w-[500px]"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
            <p className="text-xs text-gray-200 font-medium leading-normal">{successToast}</p>
            <button onClick={() => setSuccessToast(null)} className="ml-auto text-gray-400 hover:text-white cursor-pointer p-0.5">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HIGH-FIDELITY TOP NAVBAR (Matches Image 2 exactly) */}
      <header className="h-20 bg-[#050507] border-b border-white/[0.05] flex items-center justify-between px-6 sm:px-8 z-30 shrink-0 sticky top-0">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('Overview')}>
            <div className="relative w-7 h-7 flex items-center justify-center rounded overflow-hidden">
              <img src={vunexLogo} alt="Vunex Market" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-[13px] tracking-wider text-white uppercase leading-none">Vunex</span>
              <span className="font-sans text-[7.5px] tracking-[0.25em] text-gray-400 uppercase leading-none mt-1">Market</span>
            </div>
          </div>

          {/* Links Row */}
          <div className="hidden lg:flex items-center gap-8">
            <button 
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              onClick={() => onNavigate('Trade')}
            >
              Trading
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
              Platforms
            </button>
            <button 
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              onClick={() => onNavigate('Markets')}
            >
              Markets
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
              Resources
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
              Company
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
              Partners
            </button>
          </div>
        </div>

        {/* Right Buttons and user action tools */}
        <div className="flex items-center gap-4">
          
          {/* Deposit quick action */}
          <button 
            onClick={() => setShowDepositModal(true)}
            className="hidden sm:inline-block px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer focus:outline-none"
          >
            Deposit
          </button>

          {/* Trade Now (glowing vibrant blue button) */}
          <button 
            onClick={() => onNavigate('Trade')}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-[#1e60ff] hover:bg-blue-600 text-white text-[11px] font-bold rounded-lg transition-all shadow-lg shadow-blue-500/25 focus:outline-none hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Trade Now</span>
            <span className="text-[12px]">→</span>
          </button>

          {/* Spacer border */}
          <span className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* Notification bell */}
          <button className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors focus:outline-none cursor-pointer relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1e60ff] rounded-full" />
          </button>

          {/* User initials "JD" with dropdown */}
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[11px] font-extrabold text-white cursor-pointer hover:border-white/30 transition-colors">
              JD
            </div>
            <ChevronDown className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT ROW: Sidebar navigation + Content Grid */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* SIDEBAR NAVIGATION (Matches second image exactly) */}
        <aside className="w-60 border-r border-white/[0.05] bg-[#050507]/40 flex flex-col justify-between p-5 shrink-0 hidden md:flex select-none">
          <div className="space-y-6">
            
            {/* Sidebar navigation items */}
            <nav className="space-y-1">
              {[
                { label: 'Dashboard', icon: LayoutDashboard, path: 'Overview' },
                { label: 'Wallet', icon: Wallet, path: 'Wallet', active: true },
                { label: 'Accounts', icon: Globe, path: 'Accounts' },
                { label: 'Funds', icon: CreditCard, path: 'Funds' },
                { label: 'Profile', icon: User, path: 'Profile' },
                { label: 'Security', icon: Shield, path: 'Security' },
                { label: 'Documents', icon: FileText, path: 'Documents' },
                { label: 'Settings', icon: Settings, path: 'Settings' },
                { label: 'Support', icon: HelpCircle, path: 'Support' }
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = item.active;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.path === 'Wallet') return;
                      onNavigate(item.path);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer focus:outline-none relative ${
                      isActive
                        ? 'text-white bg-blue-600 font-bold shadow-lg shadow-blue-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            
            {/* Metallic Chrome Bull Promo widget card */}
            <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4 relative overflow-hidden text-center shadow-2xl" id="chrome-bull-widget">
              
              {/* Radial gradient glow backing */}
              <div className="absolute inset-0 bg-radial-gradient from-blue-900/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                
                {/* 3D Chrome Bull Asset */}
                <div className="relative w-28 h-20 flex items-center justify-center rounded-lg overflow-hidden border border-white/10">
                  <img src={bullAsset} alt="Vunex Bull" className="w-full h-full object-contain p-1" />
                </div>

                <h4 className="text-[11px] font-bold text-white tracking-wide uppercase mt-1">Trade Smarter.</h4>
                <p className="text-[10px] font-bold text-[#1e60ff] tracking-wide uppercase">Trade Vunex.</p>
                
                <button 
                  onClick={() => triggerToast('VIP Upgrade workflow active!')}
                  className="mt-3.5 w-full py-2 bg-[#1e60ff] hover:bg-blue-600 text-white text-[10.5px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 focus:outline-none"
                >
                  Upgrade Now
                </button>
              </div>
            </div>

            {/* Support button at the bottom */}
            <button 
              onClick={() => triggerToast('Contact Support active!')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] text-gray-400 hover:text-white transition-all text-left focus:outline-none cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[10px] font-bold">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="leading-none text-white font-semibold">Need Help?</p>
                  <p className="text-[8.5px] text-gray-500 mt-1 leading-none">24/7 Live Support</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto z-10 flex flex-col justify-between w-full">
          
          <div className="space-y-6">
            
            {/* Page Header */}
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans" id="wallet-title-main">Wallet</h1>
              <p className="text-xs text-gray-400 mt-1.5" id="wallet-subtitle-main">
                Manage your funds, view balances, and track transactions.
              </p>
            </div>

            {/* CORE GRID: Bento Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* LEFT COLUMN: Total Wallet Balance + Quick Actions + Funding Account (8-span) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                
                {/* A. TOTAL WALLET BALANCE CARD */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden" id="total-wallet-balance-card">
                  
                  {/* Radial Background ambient light */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Balance numbers */}
                  <div className="text-left space-y-4 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                        <span>Total Wallet Balance</span>
                        <button 
                          onClick={() => setShowBalance(!showBalance)}
                          className="text-gray-500 hover:text-white cursor-pointer focus:outline-none"
                        >
                          {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
                          {showBalance ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                        </span>
                        <span className="text-sm font-bold text-gray-400 font-sans">USD</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+$2,548.21 (+5.51%)</span>
                        <span className="text-gray-600">• Today</span>
                      </div>
                    </div>

                    {/* Columns info */}
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/[0.04]">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          Available Balance
                          <RefreshCw className="w-2.5 h-2.5 text-gray-600" />
                        </span>
                        <p className="text-sm font-bold text-white font-mono">
                          {showBalance ? `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••••'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Unrealized P&L</span>
                        <p className="text-sm font-bold text-emerald-400 font-mono">
                          {showBalance ? `+$${unrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••••'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shiny 3D Pie Chart (Vector High-Fidelity) */}
                  <div className="flex flex-col items-center justify-center shrink-0 relative p-2" id="wallet-pie-container">
                    
                    {/* SVG 3D Pie Chart graphic */}
                    <div className="relative w-40 h-32 flex items-center justify-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 160 120">
                        {/* Shadow oval layer beneath to render 3D depth */}
                        <ellipse cx="80" cy="85" rx="50" ry="12" fill="black" opacity="0.45" />

                        {/* Top 3D projection group */}
                        <g transform="translate(0, -3)">
                          
                          {/* Gradients for slices */}
                          <defs>
                            <linearGradient id="pieBlue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1e60ff" />
                              <stop offset="100%" stopColor="#0a2a7a" />
                            </linearGradient>
                            <linearGradient id="pieSilver" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#d4d4d8" />
                              <stop offset="100%" stopColor="#52525b" />
                            </linearGradient>
                            <linearGradient id="pieDark" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#27272a" />
                              <stop offset="100%" stopColor="#09090b" />
                            </linearGradient>
                            <linearGradient id="pieYellow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#78350f" />
                            </linearGradient>
                          </defs>

                          {/* 3D Cylindrical Slices (extruded slices drawing) */}
                          {/* S1: Dark Gray slice (7.6% + 12.4% + 8.1% others) */}
                          <path 
                            d="M 80 50 L 130 50 A 50 25 0 0 1 70 74 Z" 
                            fill="url(#pieDark)" 
                            className="transition-transform duration-200 hover:translate-y-[-2px] cursor-pointer" 
                            title="Others"
                            onMouseEnter={() => setHoveredPieIndex(4)}
                            onMouseLeave={() => setHoveredPieIndex(null)}
                          />
                          <path d="M 70 74 L 80 50 L 130 50 L 130 55 L 80 55 L 70 79 Z" fill="#18181b" opacity="0.6" />

                          {/* S2: Silver Slice (18.7%) */}
                          <path 
                            d="M 80 50 L 70 74 A 50 25 0 0 1 35 40 Z" 
                            fill="url(#pieSilver)" 
                            className="transition-transform duration-200 hover:translate-x-[-2px] cursor-pointer"
                            title="EUR"
                            onMouseEnter={() => setHoveredPieIndex(1)}
                            onMouseLeave={() => setHoveredPieIndex(null)}
                          />
                          <path d="M 35 40 L 80 50 L 70 74 L 70 79 L 80 55 L 35 45 Z" fill="#3f3f46" opacity="0.6" />

                          {/* S3: Glowing Blue Primary Slice (53.2% - Extruded and pushed forward) */}
                          <g transform={hoveredPieIndex === 0 ? "translate(3, -3)" : "translate(1, -2)"}>
                            {/* extruded depth wall */}
                            <path d="M 35 40 L 80 50 L 130 50 L 130 57 L 80 57 L 35 47 Z" fill="#0c1e4d" />
                            <path d="M 130 50 A 50 25 0 0 0 35 40 L 35 47 A 50 25 0 0 1 130 57 Z" fill="#0d3cb3" />
                            
                            {/* main top slice */}
                            <path 
                              d="M 80 50 L 35 40 A 50 25 0 0 1 130 50 Z" 
                              fill="url(#pieBlue)" 
                              className="cursor-pointer"
                              title="USD Allocation"
                              onMouseEnter={() => setHoveredPieIndex(0)}
                              onMouseLeave={() => setHoveredPieIndex(null)}
                            />
                            {/* glossy highlight layer */}
                            <path d="M 80 50 L 40 41 A 47 23 0 0 1 125 49 Z" fill="white" opacity="0.12" pointerEvents="none" />
                          </g>

                        </g>
                      </svg>

                      {/* Display allocation tooltip inside */}
                      {hoveredPieIndex !== null && (
                        <div className="absolute bottom-1 bg-black/95 border border-white/10 px-2 py-1 rounded text-[9.5px] font-mono shadow-2xl z-20">
                          <span className="font-bold text-white">{allocationData[hoveredPieIndex].name}: </span>
                          <span className="text-blue-400 font-extrabold">{allocationData[hoveredPieIndex].percentage}%</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-500 font-bold font-mono">Portfolio Distribution</span>
                  </div>
                </div>

                {/* B. QUICK ACTIONS ROW (Four modern rounded card action selectors) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="wallet-quick-actions">
                  
                  {/* Button 1: Deposit */}
                  <button 
                    onClick={() => setShowDepositModal(true)}
                    className="p-3.5 bg-[#07070a]/90 hover:bg-[#0c0d13]/90 border border-white/[0.04] hover:border-[#1e60ff]/30 rounded-xl transition-all text-left focus:outline-none group cursor-pointer relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/15 group-hover:scale-105 transition-all">
                        <ArrowDownLeft className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-extrabold text-white">Deposit</span>
                        <span className="text-[9px] text-gray-500 mt-0.5 leading-none">Add funds instantly</span>
                      </div>
                    </div>
                  </button>

                  {/* Button 2: Withdraw */}
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="p-3.5 bg-[#07070a]/90 hover:bg-[#0c0d13]/90 border border-white/[0.04] hover:border-[#1e60ff]/30 rounded-xl transition-all text-left focus:outline-none group cursor-pointer relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/15 group-hover:scale-105 transition-all">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-extrabold text-white">Withdraw</span>
                        <span className="text-[9px] text-gray-500 mt-0.5 leading-none">Withdraw to bank</span>
                      </div>
                    </div>
                  </button>

                  {/* Button 3: Transfer */}
                  <button 
                    onClick={() => setShowTransferModal(true)}
                    className="p-3.5 bg-[#07070a]/90 hover:bg-[#0c0d13]/90 border border-white/[0.04] hover:border-[#1e60ff]/30 rounded-xl transition-all text-left focus:outline-none group cursor-pointer relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/15 group-hover:scale-105 transition-all">
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-extrabold text-white">Transfer</span>
                        <span className="text-[9px] text-gray-500 mt-0.5 leading-none">Move accounts</span>
                      </div>
                    </div>
                  </button>

                  {/* Button 4: Trade Now */}
                  <button 
                    onClick={() => onNavigate('Trade')}
                    className="p-3.5 bg-[#07070a]/90 hover:bg-[#0c0d13]/90 border border-white/[0.04] hover:border-[#1e60ff]/30 rounded-xl transition-all text-left focus:outline-none group cursor-pointer relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/15 group-hover:scale-105 transition-all">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-extrabold text-white">Trade Now</span>
                        <span className="text-[9px] text-gray-500 mt-0.5 leading-none">Go to platform</span>
                      </div>
                    </div>
                  </button>

                </div>

                {/* C. FUNDING ACCOUNT PROFILE CARD */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-6 flex flex-col md:flex-row md:items-stretch justify-between gap-6 relative overflow-hidden" id="funding-account-card">
                  
                  {/* Giant Chrome Logo Watermark background on the right */}
                  <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10 pointer-events-none select-none rounded-xl overflow-hidden">
                    <img src={vunexLogo} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Profile Details left column */}
                  <div className="text-left flex flex-col justify-between space-y-6 md:w-1/2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Funding Account</h3>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8.5px] font-extrabold rounded-md uppercase tracking-wider">Primary</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-500 font-medium w-24">Account ID:</span>
                          <div className="flex items-center gap-1.5 font-mono text-white font-bold">
                            <span>VMF-778899</span>
                            <button 
                              onClick={handleCopyAccountID}
                              className="text-gray-500 hover:text-white p-0.5 rounded transition-all cursor-pointer focus:outline-none"
                              title="Copy Account ID"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-500 font-medium w-24">Account Type:</span>
                          <span className="text-gray-300 font-semibold">Funding Wallet</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-500 font-medium w-24">Currency:</span>
                          <span className="text-gray-300 font-semibold font-mono">USD ($)</span>
                        </div>
                      </div>
                    </div>

                    {/* Left stats columns below */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-4.5">
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider">Available Balance</span>
                        <p className="text-sm font-bold text-white font-mono">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider">Reserved Margin</span>
                        <p className="text-sm font-bold text-white font-mono">${reservedMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Equity sparkline and timeframe filters right column */}
                  <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-white/[0.04] pt-6 md:pt-0 md:pl-6 text-left flex flex-col justify-between">
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Ledger Equity Value</span>
                        
                        {/* Timeframe selector tab */}
                        <div className="flex items-center gap-1 p-0.5 bg-black/60 border border-white/5 rounded-lg">
                          {(['1D', '1W', '1M', '3M', '1Y'] as const).map(tf => (
                            <button
                              key={tf}
                              onClick={() => {
                                setActiveTimeframe(tf);
                                triggerToast(`Updated equity trend view to ${tf}`);
                              }}
                              className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer focus:outline-none ${
                                activeTimeframe === tf 
                                  ? 'bg-[#1e60ff] text-white' 
                                  : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1.5">
                        <p className="text-xl font-extrabold text-white font-mono">${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <span className="text-[10px] text-emerald-400 font-bold font-mono">+$2,548.21 (+5.51%)</span>
                      </div>
                    </div>

                    {/* Vector line chart visual overlay inside */}
                    <div className="h-28 w-full relative mt-4 overflow-hidden rounded-lg bg-black/30 border border-white/[0.03]">
                      
                      {/* Plotting graph line */}
                      <svg className="w-full h-full absolute inset-0 text-[#1e60ff]" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#1e60ff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* fill */}
                        <path 
                          d={`${getTrendDataPoints()} L 400 100 L 10 100 Z`} 
                          fill="url(#areaGlow)" 
                          className="transition-all duration-300" 
                        />
                        {/* line */}
                        <path 
                          d={getTrendDataPoints()} 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="transition-all duration-300 drop-shadow-[0_2px_4px_rgba(30,96,255,0.3)]" 
                        />
                      </svg>

                      {/* Display marker at the end */}
                      <div className="absolute right-2 top-4 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <div className="absolute right-2.5 top-4.5 w-1 h-1 rounded-full bg-white border border-blue-500" />
                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: Asset Allocation + Recent Transactions (4-span) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-5">
                
                {/* D. ASSET ALLOCATION */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 space-y-5" id="asset-allocation-card">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">Asset Allocation</span>
                      <Info className="w-3.5 h-3.5 text-gray-500 cursor-help" title="Percentage of absolute holdings by coin category" />
                    </div>
                    <button 
                      onClick={() => triggerToast('Asset allocation details active!')}
                      className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none flex items-center gap-1"
                    >
                      <span>View Full Report</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Ring Chart + Legend container */}
                  <div className="flex items-center justify-between gap-6">
                    
                    {/* legend lists on left */}
                    <div className="space-y-3 flex-grow text-left">
                      {allocationData.map((asset) => (
                        <div key={asset.name} className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                            <span className="font-extrabold text-white">{asset.name}</span>
                          </div>
                          <div className="text-right pl-3">
                            <span className="text-gray-400 font-semibold">{asset.percentage}%</span>
                            <span className="text-gray-600 block text-[9.5px] mt-0.5">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* hollow circular progress arc on right */}
                    <div className="w-28 h-28 shrink-0 relative flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Underlay tracking circle */}
                        <circle cx="50" cy="50" r="40" stroke="#18181b" strokeWidth="8" fill="transparent" />
                        
                        {/* USD ring segment: 53.2% */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="#1e60ff" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="251.2" 
                          strokeDashoffset={251.2 * (1 - 0.532)} 
                          className="drop-shadow-[0_0_2px_rgba(30,96,255,0.4)]"
                        />
                        
                        {/* EUR segment stacked on top of USD */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="#4f46e5" 
                          strokeWidth="6.5" 
                          fill="transparent" 
                          strokeDasharray="251.2" 
                          strokeDashoffset={251.2 * (1 - 0.187)} 
                          transform="rotate(191.5 50 50)"
                        />

                        {/* BTC segment */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="#f59e0b" 
                          strokeWidth="5" 
                          fill="transparent" 
                          strokeDasharray="251.2" 
                          strokeDashoffset={251.2 * (1 - 0.124)} 
                          transform="rotate(258.8 50 50)"
                        />
                      </svg>

                      {/* Info label in center of circle ring */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[8.5px] text-gray-500 uppercase font-extrabold tracking-wider leading-none">Total Assets</span>
                        <span className="text-[10.5px] font-extrabold text-white mt-1 leading-none font-sans">$48,750</span>
                        <span className="text-[8.5px] text-emerald-400 font-bold font-mono leading-none mt-0.5">+.26</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* E. RECENT TRANSACTIONS */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 space-y-4" id="recent-transactions-card">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between text-left">
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">Recent Transactions</span>
                    <button 
                      onClick={() => triggerToast('Transaction database loaded!')}
                      className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none flex items-center gap-1"
                    >
                      <span>View All</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Transaction High Fidelity List Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.04] text-[9.5px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="pb-2.5">Type</th>
                          <th className="pb-2.5">Description</th>
                          <th className="pb-2.5">Date</th>
                          <th className="pb-2.5 text-right">Amount</th>
                          <th className="pb-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {TRANSACTION_PAGES[currentPage].map((tx) => (
                          <tr key={tx.id} className="text-xs hover:bg-white/[0.01] transition-colors group">
                            <td className="py-3 pr-2 flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${
                                tx.type === 'Deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                tx.type === 'Withdrawal' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                tx.type === 'Transfer' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              }`}>
                                {tx.type === 'Deposit' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                                {tx.type === 'Withdrawal' && <ArrowUpRight className="w-3.5 h-3.5" />}
                                {tx.type === 'Transfer' && <ArrowUpDown className="w-3.5 h-3.5" />}
                                {tx.type === 'Trade' && <TrendingUp className="w-3.5 h-3.5" />}
                              </div>
                              <span className="font-extrabold text-white text-[11px]">{tx.type}</span>
                            </td>
                            <td className="py-3 text-gray-400 font-medium max-w-28 truncate" title={tx.description}>
                              <p className="leading-none text-[10.5px] font-bold text-gray-300">{tx.description}</p>
                            </td>
                            <td className="py-3 text-[10px] text-gray-500 font-medium whitespace-nowrap">{tx.date}</td>
                            <td className={`py-3 text-right font-mono font-bold text-[11px] ${tx.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {tx.isPositive ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 pl-2 text-center">
                              <span className="px-2 py-0.5 border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-[8px] font-extrabold rounded-md uppercase">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer and Paginations */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold pt-4 border-t border-white/[0.04]">
                    <span>Showing {(currentPage - 1) * 5 + 1} to {currentPage * 5} of 20</span>

                    <div className="flex items-center gap-1.5 font-mono">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="w-5 h-5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-35 cursor-pointer focus:outline-none"
                      >
                        ‹
                      </button>
                      
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num)}
                          className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center cursor-pointer focus:outline-none transition-all ${
                            currentPage === num 
                              ? 'bg-blue-600 text-white font-extrabold' 
                              : 'bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      <button 
                        disabled={currentPage === 4}
                        onClick={() => setCurrentPage(prev => Math.min(4, prev + 1))}
                        className="w-5 h-5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-35 cursor-pointer focus:outline-none"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* 4. FOOTER row: High-Fidelity badges for regulatory and security metrics */}
          <footer className="mt-8 pt-6 border-t border-white/[0.04]" id="wallet-dashboard-footer">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
              
              <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#07070a]/30 p-4.5">
                <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[11.5px] font-extrabold text-white leading-none">Institutional-Grade Security</h5>
                  <p className="text-[10px] text-gray-500 leading-normal">Bank-level encryption & protection</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#07070a]/30 p-4.5">
                <Building className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[11.5px] font-extrabold text-white leading-none">Segregated Client Funds</h5>
                  <p className="text-[10px] text-gray-500 leading-normal">Funds held in top-tier banks</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#07070a]/30 p-4.5">
                <Monitor className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[11.5px] font-extrabold text-white leading-none">24/7 Account Monitoring</h5>
                  <p className="text-[10px] text-gray-500 leading-normal">Real-time risk & balance monitoring</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#07070a]/30 p-4.5">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[11.5px] font-extrabold text-white leading-none">Regulated & Compliant</h5>
                  <p className="text-[10px] text-gray-500 leading-normal">Licensed & regulated globally</p>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4 text-[9.5px] text-gray-500 font-mono">
              <span>© {new Date().getFullYear()} Vunex Market Ltd. Registered International Custodian and Liquidity Broker.</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Connection: Live SSL Protected Ledger</span>
              </div>
            </div>
          </footer>

        </main>
      </div>

      {/* ========================================================================= */}
      {/* 5. QUICK ACTION MODAL CORES */}
      {/* ========================================================================= */}
      
      {/* DEPOSIT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDepositModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left z-10"
            >
              <button 
                onClick={() => setShowDepositModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-blue-500" />
                <span>Deposit Ledger Funds</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Add instant liquid funds to your available balance ledger.</p>

              <form onSubmit={handleDepositSubmit} className="space-y-4 mt-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Method</label>
                  <select className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none">
                    <option>Bank Wire Transfer (Processing: Instant, $0 Fees)</option>
                    <option>Crypto Deposit USDT / BTC (Processing: Instant)</option>
                    <option>Credit Card Instant Visa/MC (Processing: Instant)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Amount ($ USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="50"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-blue-500 rounded-lg pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-500 font-bold">$</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1e60ff] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Confirm Deposit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAW MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left z-10"
            >
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                <span>Withdraw Ledger Funds</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Withdraw funds back to your designated custodian bank accounts.</p>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4 mt-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Withdraw to</label>
                  <select className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none">
                    <option>Chase Bank Wire Account (***8857)</option>
                    <option>External USDT TRC-20 Address</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Amount ($ USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="50"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-indigo-500 rounded-lg pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-500 font-bold">$</span>
                  </div>
                  <p className="text-[9.5px] text-gray-500 mt-1">Available for withdrawal: ${availableBalance.toLocaleString()}</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4f46e5] hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Request Dispatch
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSFER MODAL */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTransferModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left z-10"
            >
              <button 
                onClick={() => setShowTransferModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ArrowUpDown className="w-4.5 h-4.5 text-amber-500" />
                <span>Internal Account Transfer</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Move cash assets instantly between Funding Account and Active MT5 Trading Account.</p>

              <form onSubmit={handleTransferSubmit} className="space-y-4 mt-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-500">From</span>
                    <div className="p-2.5 bg-black border border-white/5 rounded-lg text-xs font-semibold text-white">
                      Funding Account
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-500">To</span>
                    <div className="p-2.5 bg-black border border-white/5 rounded-lg text-xs font-semibold text-white">
                      MetaTrader MT5 Ledger
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Amount to Transfer ($ USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="10"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-amber-500 rounded-lg pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-500 font-bold">$</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#d97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Initiate Instant Transfer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
