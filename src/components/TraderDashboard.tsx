import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TradingTerminal from './TradingTerminal';
import WalletDashboard from './WalletDashboard';
import DepositDashboard from './DepositDashboard';
import WithdrawDashboard from './WithdrawDashboard';
import HistoryDashboard from './HistoryDashboard';
import KYCVerification from './KYCVerification';
import vunexLogo from '../assets/images/cutouts/logo_official.png';
import vLogoAsset from '../assets/images/cutouts/logo3d_v.png';
import shieldAsset from '../assets/images/cutouts/shield.png';
import {
  LayoutDashboard,
  TrendingUp,
  ArrowUpDown,
  Briefcase,
  FileText,
  History,
  BarChart3,
  PieChart,
  DollarSign,
  User,
  Settings,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Copy,
  Check,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

// Interfaces
interface MetricCardProps {
  title: string;
  value: string;
  changeText: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  subtext?: string;
  showValue: boolean;
  onToggleValue?: () => void;
}

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isUp: boolean;
  sparkline: number[];
}

interface PositionItem {
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  size: string;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface TransactionItem {
  type: 'Deposit' | 'Withdrawal' | 'Profit Realized' | 'Swap Fee';
  method: string;
  time: string;
  amount: number;
  isPositive: boolean;
}

interface TraderDashboardProps {
  onLogout: () => void;
}

// Generate timeframe-specific chart data based on symbol
const getChartData = (symbol: string, timeframe: string) => {
  const seedPrices: Record<string, number> = {
    EURUSD: 1.08945,
    GBPUSD: 1.27482,
    XAUUSD: 2384.65,
    USDJPY: 156.743,
    BTCUSD: 67842.10,
    USOIL: 78.245
  };

  const currentPrice = seedPrices[symbol] || 1.0;
  const length = timeframe === '1D' ? 24 : timeframe === '1W' ? 14 : timeframe === '1M' ? 30 : 60;
  const data: { time: string; price: number }[] = [];

  let lastPrice = currentPrice * (1 - (timeframe === '1D' ? 0.015 : 0.05));
  for (let i = 0; i < length; i++) {
    const progress = i / (length - 1);
    // Create organic ups and downs culminating at today's active price
    const wave = Math.sin(progress * Math.PI * 2.5) * (currentPrice * 0.008);
    const noise = (Math.sin(i * 12.3) + Math.cos(i * 7.4)) * (currentPrice * 0.003);
    const trend = progress * (currentPrice * 0.012);
    const price = lastPrice + trend + wave + noise;
    
    let timeLabel = '';
    if (timeframe === '1D') {
      const hour = (i % 12 || 12);
      const ampm = i >= 12 ? 'PM' : 'AM';
      timeLabel = `${hour} ${ampm}`;
    } else {
      timeLabel = `Day ${i + 1}`;
    }

    data.push({ time: timeLabel, price: parseFloat(price.toFixed(symbol.includes('JPY') ? 3 : symbol.includes('USD') && !symbol.includes('BTC') ? 5 : 2)) });
  }

  // Ensure last point matches current price exactly
  data[data.length - 1].price = currentPrice;
  return data;
};

export default function TraderDashboard({ onLogout }: TraderDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [showBalances, setShowBalances] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [chartTimeframe, setChartTimeframe] = useState('1D');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Modals
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Form states
  const [depositAmount, setDepositAmount] = useState('5000');
  const [depositMethod, setDepositMethod] = useState('Bank Wire Transfer');
  const [withdrawAmount, setWithdrawAmount] = useState('1000');
  const [withdrawMethod, setWithdrawMethod] = useState('Bank Wire Transfer');
  const [verifyCountry, setVerifyCountry] = useState('United States');
  const [verifyIdNum, setVerifyIdNum] = useState('');
  const [verifyStep, setVerifyStep] = useState(1);
  const [isVerifyingSubmit, setIsVerifyingSubmit] = useState(false);
  const [isActionSubmit, setIsActionSubmit] = useState(false);

  // Verification status
  const [isVerified, setIsVerified] = useState(false);

  // Interactive Live Ledger State
  const [totalBalance, setTotalBalance] = useState(128547.68);
  const [equity, setEquity] = useState(132894.32);
  const [marginUsed, setMarginUsed] = useState(18742.19);
  const [unrealizedPnl, setUnrealizedPnl] = useState(4347.21);

  // Live price fluctuation simulation
  const [markets, setMarkets] = useState<MarketItem[]>([
    { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.08945, change: 0.47, isUp: true, sparkline: [40, 42, 38, 45, 52, 48, 55, 62, 60] },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.27482, change: 0.35, isUp: true, sparkline: [30, 35, 34, 38, 42, 40, 48, 51, 53] },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 2384.65, change: 0.62, isUp: true, sparkline: [60, 58, 65, 72, 68, 75, 80, 85, 88] },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 156.743, change: -0.21, isUp: false, sparkline: [50, 48, 45, 42, 38, 40, 35, 32, 30] },
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: 67842.10, change: 1.08, isUp: true, sparkline: [40, 45, 43, 50, 58, 52, 65, 70, 75] },
    { symbol: 'USOIL', name: 'Crude Oil', price: 78.245, change: -0.15, isUp: false, sparkline: [55, 52, 50, 53, 48, 46, 42, 40, 38] }
  ]);

  const [positions, setPositions] = useState<PositionItem[]>([
    { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'BUY', size: '1.00 Lots', entryPrice: 1.08567, markPrice: 1.08945, pnl: 378.00, pnlPercent: 0.35 },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar', type: 'BUY', size: '0.50 Lots', entryPrice: 2365.20, markPrice: 2384.65, pnl: 972.50, pnlPercent: 0.82 },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'SELL', size: '1.00 Lots', entryPrice: 1.27950, markPrice: 1.27482, pnl: 468.00, pnlPercent: 0.37 },
    { symbol: 'USOIL', name: 'Crude Oil', type: 'BUY', size: '1.50 Lots', entryPrice: 77.120, markPrice: 78.245, pnl: 1687.50, pnlPercent: 1.46 }
  ]);

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    { type: 'Deposit', method: 'Bank Transfer •••• 1234', time: 'Today, 09:42 AM', amount: 10000.00, isPositive: true },
    { type: 'Withdrawal', method: 'Bank Transfer •••• 1234', time: 'Yesterday, 04:15 PM', amount: 2500.00, isPositive: false },
    { type: 'Profit Realized', method: 'XAUUSD Trade', time: 'Yesterday, 03:22 PM', amount: 1247.35, isPositive: true },
    { type: 'Deposit', method: 'Crypto (USDT)', time: 'May 12, 2025', amount: 5000.00, isPositive: true },
    { type: 'Swap Fee', method: 'EURUSD Swap', time: 'May 12, 2025', amount: 12.45, isPositive: false }
  ]);

  // Handle active symbol selection from Market Watch
  const activeSymbolDetails = markets.find(m => m.symbol === selectedSymbol) || markets[0];
  const chartPoints = getChartData(selectedSymbol, chartTimeframe);
  
  // Custom interactive chart crosshair hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Toast notifier helper
  const triggerToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live simulation ticks
  useEffect(() => {
    const timer = setInterval(() => {
      // Fluctuate prices slightly
      setMarkets(prev => prev.map(market => {
        const isUpTick = Math.random() > 0.45;
        const tickSize = market.price * (Math.random() * 0.0008);
        const newPrice = isUpTick ? market.price + tickSize : market.price - tickSize;
        const decimals = market.symbol.includes('JPY') ? 3 : market.symbol.includes('USD') && !market.symbol.includes('BTC') ? 5 : 2;
        return {
          ...market,
          price: parseFloat(newPrice.toFixed(decimals))
        };
      }));

      // Update positions unrealized PnL based on market ticks
      setPositions(prev => prev.map(pos => {
        const currentMkt = markets.find(m => m.symbol === pos.symbol);
        if (!currentMkt) return pos;

        let pnl = pos.pnl;
        const tickFactor = Math.random() > 0.5 ? 1 : -1;
        pnl += tickFactor * (Math.random() * 8.5);

        return {
          ...pos,
          markPrice: currentMkt.price,
          pnl: parseFloat(pnl.toFixed(2)),
          pnlPercent: parseFloat((pos.pnlPercent + (tickFactor * 0.005)).toFixed(2))
        };
      }));

      // Synchronize ledger totals from positions
      setPositions(currentPositions => {
        const totalPnl = currentPositions.reduce((sum, p) => sum + p.pnl, 0);
        setUnrealizedPnl(parseFloat(totalPnl.toFixed(2)));
        setEquity(parseFloat((totalBalance + totalPnl).toFixed(2)));
        return currentPositions;
      });

    }, 3000);

    return () => clearInterval(timer);
  }, [markets, totalBalance]);

  // Handle Close Position
  const handleClosePosition = (symbol: string, pnl: number) => {
    setPositions(prev => prev.filter(p => p.symbol !== symbol));
    
    // Add real-time profit/loss to balance
    setTotalBalance(prev => parseFloat((prev + pnl).toFixed(2)));
    setEquity(prev => parseFloat((prev + pnl).toFixed(2)));
    
    // Append to transaction log
    const newTx: TransactionItem = {
      type: 'Profit Realized',
      method: `${symbol} Trade Close`,
      time: 'Just Now',
      amount: Math.abs(pnl),
      isPositive: pnl >= 0
    };
    setTransactions(prev => [newTx, ...prev]);
    
    triggerToast(`Closed position ${symbol} successfully! PnL added to total balance.`, pnl >= 0 ? 'success' : 'info');
  };

  // Handle Deposit Submit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsActionSubmit(true);
    setTimeout(() => {
      setTotalBalance(prev => parseFloat((prev + amount).toFixed(2)));
      setEquity(prev => parseFloat((prev + amount).toFixed(2)));
      
      const newTx: TransactionItem = {
        type: 'Deposit',
        method: depositMethod,
        time: 'Just Now',
        amount: amount,
        isPositive: true
      };
      setTransactions(prev => [newTx, ...prev]);
      
      setIsActionSubmit(false);
      setShowDepositModal(false);
      triggerToast(`Successfully deposited $${amount.toLocaleString()} into your account!`, 'success');
    }, 1500);
  };

  // Handle Withdrawal Submit
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > totalBalance) {
      alert('Insufficient funds for withdrawal.');
      return;
    }

    setIsActionSubmit(true);
    setTimeout(() => {
      setTotalBalance(prev => parseFloat((prev - amount).toFixed(2)));
      setEquity(prev => parseFloat((prev - amount).toFixed(2)));
      
      const newTx: TransactionItem = {
        type: 'Withdrawal',
        method: withdrawMethod,
        time: 'Just Now',
        amount: amount,
        isPositive: false
      };
      setTransactions(prev => [newTx, ...prev]);
      
      setIsActionSubmit(false);
      setShowWithdrawModal(false);
      triggerToast(`Withdrawal of $${amount.toLocaleString()} requested successfully!`, 'info');
    }, 1500);
  };

  // Handle Account Verification
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdNum) return;

    setIsVerifyingSubmit(true);
    setTimeout(() => {
      setIsVerifyingSubmit(false);
      setIsVerified(true);
      setShowVerifyModal(false);
      triggerToast('Identity verification completed successfully! Premium access active.', 'success');
    }, 2000);
  };

  if (activeTab === 'Funds' || activeTab === 'Deposit') {
    return (
      <DepositDashboard 
        onLogout={onLogout}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === 'Withdraw') {
    return (
      <WithdrawDashboard 
        onLogout={onLogout}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === 'Wallet') {
    return (
      <WalletDashboard 
        onLogout={onLogout}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === 'History') {
    return (
      <HistoryDashboard 
        onLogout={onLogout}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === 'KYCVerification' || activeTab === 'KYC') {
    return (
      <KYCVerification 
        onLogout={onLogout}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === 'Trade' || activeTab === 'Markets') {
    return (
      <TradingTerminal 
        onLogout={onLogout}
        onNavigateToOverview={() => setActiveTab('Overview')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] font-sans flex overflow-hidden relative selection:bg-blue-600/30 selection:text-white" id="dashboard-root">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-[#1e60ff]/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 1. TOAST ALERTS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-white/10 shadow-2xl z-100 flex items-center gap-3 backdrop-blur-md bg-black/90 min-w-[320px] max-w-[500px]"
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 animate-pulse" />
            )}
            <p className="text-xs text-gray-200 font-medium leading-normal">{toastMessage.text}</p>
            <button onClick={() => setToastMessage(null)} className="ml-auto text-gray-400 hover:text-white cursor-pointer p-0.5">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/[0.06] bg-[#050507]/90 backdrop-blur-xl flex flex-col justify-between p-5 z-20 flex-shrink-0 hidden md:flex select-none relative">
        <div className="space-y-7">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2.5 px-1.5 py-1">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img src={vunexLogo} alt="Vunex Market" className="w-full h-full object-contain brightness-[1.35] drop-shadow-[0_0_10px_rgba(30,96,255,0.4)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[18px] tracking-wider text-white uppercase leading-none">Vunex</span>
              <span className="font-sans text-[9px] tracking-[0.28em] text-brand-blue uppercase leading-none mt-1 font-semibold">Market</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            {[
              { label: 'Overview', icon: LayoutDashboard },
              { label: 'Markets', icon: TrendingUp },
              { label: 'Trade', icon: ArrowUpDown },
              { label: 'Positions', icon: Briefcase, badge: positions.length },
              { label: 'Orders', icon: FileText },
              { label: 'History', icon: History },
              { label: 'Analytics', icon: BarChart3 },
              { label: 'Reports', icon: PieChart },
              { label: 'Funds', icon: DollarSign },
              { 
                label: 'Profile', 
                icon: User,
                subItems: [
                  { label: 'Personal Details', tab: 'Overview' },
                  { label: 'Security', tab: 'Overview' },
                  { label: 'KYC Verification', tab: 'KYCVerification' }
                ]
              },
              { label: 'Settings', icon: Settings },
              { label: 'Support', icon: HelpCircle }
            ].map((item) => {
              const IconComp = item.icon;
              const isProfileSubActive = item.subItems && (activeTab === 'KYCVerification' || activeTab === 'Profile');
              const isActive = activeTab === item.label || isProfileSubActive;

              if (item.subItems) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => {
                        // Toggle or go to KYC by default
                        setActiveTab('KYCVerification');
                        triggerToast('Navigated to Profile Verification Section', 'info');
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group focus:outline-none relative ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-[#1e60ff]/20 to-transparent border border-white/10 border-l-[3px] border-l-[#1e60ff]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-[#1e60ff]' : 'text-gray-400 group-hover:text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Subitems block (expanded on active) */}
                    <div className="pl-9 space-y-1 text-left">
                      {item.subItems.map((sub) => {
                        const isSubSelected = sub.label === 'KYC Verification' ? activeTab === 'KYCVerification' : false;
                        return (
                          <button
                            key={sub.label}
                            onClick={() => {
                              setActiveTab(sub.tab);
                              triggerToast(`Navigated to ${sub.label}`);
                            }}
                            className={`w-full text-left py-1.5 px-3 rounded-lg text-[11px] font-bold tracking-wide transition-all block ${
                              isSubSelected
                                ? 'text-[#1e60ff] bg-[#1e60ff]/10 border border-[#1e60ff]/25 font-black'
                                : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    if (item.label !== 'Overview') {
                      triggerToast(`Navigated to ${item.label} section (Simulated).`, 'info');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group focus:outline-none relative ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#1e60ff]/20 to-transparent border border-white/10 border-l-[3px] border-l-[#1e60ff]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-[#1e60ff]' : 'text-gray-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#1e60ff]/20 border border-[#1e60ff]/30 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Invite Friend Promo Card Widget */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-4 relative overflow-hidden text-center shadow-lg" id="sidebar-promo-widget">
          <div className="relative z-10 flex flex-col items-center">
            
            {/* 3D V Logo Asset */}
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 mb-3 group hover:scale-105 transition-transform">
              <img src={vLogoAsset} alt="Vunex" className="w-full h-full object-contain p-1" />
            </div>

            <h4 className="text-[12px] font-bold text-white tracking-wide">Invite a friend</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">Earn up to $500 in trading credits.</p>
            
            <button 
              onClick={() => setShowInviteModal(true)}
              className="mt-3.5 w-full py-2 bg-[#1e60ff] hover:bg-[#1e60ff]/90 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#1e60ff]/10 focus:outline-none hover:scale-[1.02]"
            >
              <span>Invite Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto relative z-10 bg-[#020203]">
        
        {/* HEADER BAR (Matches image high-fidelity header layout) */}
        <header className="h-20 border-b border-white/[0.06] bg-[#050507]/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 sticky top-0">
          
          {/* Welcome Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <span className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white">V</span>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">Welcome back,</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="font-sans font-bold text-base sm:text-[17px] text-white tracking-tight">Trader</span>
                <span className="w-4 h-4 bg-[#1e60ff]/25 border border-[#1e60ff]/40 rounded-full flex items-center justify-center" title="Verified Trader Account">
                  <Check className="w-2.5 h-2.5 text-[#1e60ff]" />
                </span>
              </div>
            </div>
          </div>

          {/* Header Widgets / Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Account Switcher Selector */}
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-left focus:outline-none cursor-pointer transition-colors"
                id="account-selector-btn"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <div className="flex flex-col text-[10px]">
                  <span className="font-semibold text-gray-300 leading-none">
                    {isLiveMode ? 'Live Account' : 'Demo Account'}
                  </span>
                  <span className="text-gray-500 font-mono text-[9px] mt-0.5">•••• 8857</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
              </button>

              <AnimatePresence>
                {showAccountDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAccountDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl p-1 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setIsLiveMode(true);
                          setShowAccountDropdown(false);
                          triggerToast('Switched to Live Account.', 'success');
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                          isLiveMode ? 'bg-[#1e60ff]/15 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <p className="font-bold">Live Account</p>
                          <p className="text-[9px] text-gray-500 font-mono">•••• 8857</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsLiveMode(false);
                          setShowAccountDropdown(false);
                          triggerToast('Switched to Demo Sandbox.', 'info');
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                          !isLiveMode ? 'bg-[#1e60ff]/15 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div>
                          <p className="font-bold">Demo Sandbox</p>
                          <p className="text-[9px] text-gray-500 font-mono">•••• 1290</p>
                        </div>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications panel toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white relative cursor-pointer focus:outline-none transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#1e60ff] rounded-full" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl p-1 z-50 divide-y divide-white/[0.05]"
                    >
                      <div className="px-3 py-2 text-xs font-bold text-white flex justify-between items-center">
                        <span>Notifications</span>
                        <span className="text-[10px] text-[#1e60ff] font-medium hover:underline cursor-pointer">Mark all as read</span>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto py-1">
                        <div className="px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer text-left">
                          <p className="text-xs text-white font-semibold">Deposit Credited</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Your bank wire transfer of $10,000 has been successfully added to your account balance.</p>
                          <p className="text-[8px] text-[#1e60ff] font-mono mt-1">Today, 09:42 AM</p>
                        </div>

                        <div className="px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer text-left">
                          <p className="text-xs text-white font-semibold">Margin Call Safety Check</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Your margins are in safe thresholds. Leverage ratios verified.</p>
                          <p className="text-[8px] text-gray-500 font-mono mt-1">Yesterday, 10:15 PM</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Indicator & Quick Theme Button */}
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.02] border border-white/5 hidden sm:flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer relative focus:outline-none">
              <Moon className="w-4 h-4 text-[#1e60ff]" />
              <span className="absolute inset-0 bg-[#1e60ff]/5 rounded-xl blur-xs" />
            </button>

            {/* Profile Menu avatar with text labels */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-white/[0.02] cursor-pointer transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e60ff] to-[#1e60ff]/40 text-white flex items-center justify-center text-xs font-bold font-mono">
                  T
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white leading-none">Trader</span>
                  <span className="text-[9px] text-[#1e60ff] font-bold uppercase mt-0.5 tracking-wider leading-none">
                    {isVerified ? 'VIP Verified' : 'Premium'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-left"
                    >
                      <div className="px-3 py-2 border-b border-white/[0.05]">
                        <p className="text-xs font-semibold text-white">Signed in as</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">trader@vunexmarket.com</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowVerifyModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#1e60ff]" />
                        <span>Verification Status</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          triggerToast('Copied Referral Code!', 'success');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy Referral Code</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left border-t border-white/[0.05] mt-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Logout Securely</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* 4. MAIN LAYOUT CONTAINER */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 w-full space-y-6">
          
          {/* TOP METRIC CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Total Balance */}
            <MetricCard
              title="Total Balance"
              value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              changeText="+3.48% +$4,321.67 (24h)"
              changeType="up"
              icon={<DollarSign className="w-4 h-4 text-[#1e60ff]" />}
              showValue={showBalances}
              onToggleValue={() => setShowBalances(!showBalances)}
            />

            {/* Equity */}
            <MetricCard
              title="Equity"
              value={`$${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              changeText="+3.21% +$4,143.09 (24h)"
              changeType="up"
              icon={
                <svg className="w-4 h-4 text-[#1e60ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              }
              showValue={showBalances}
            />

            {/* Margin Used */}
            <MetricCard
              title="Margin Used"
              value={`$${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              changeText="23.44% of Equity"
              changeType="neutral"
              icon={
                <svg className="w-4 h-4 text-[#1e60ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
              }
              showValue={showBalances}
            />

            {/* Unrealized P&L */}
            <MetricCard
              title="Unrealized P&L"
              value={`$${unrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              changeText="+12.18%"
              changeType="up"
              icon={<TrendingUp className="w-4 h-4 text-[#1e60ff]" />}
              showValue={showBalances}
              subtext="pnl-accent"
            />
          </div>

          {/* MIDDLE ROW: PERFORMANCE CHART & MARKET WATCH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* PERFORMANCE OVERVIEW CHART WIDGET */}
            <div className="lg:col-span-8 rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 flex flex-col justify-between relative overflow-hidden" id="performance-chart-card">
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 z-10">
                <div className="text-left">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Performance Overview</span>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="font-sans font-bold text-2xl text-white tracking-tight">
                      {showBalances ? `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••••'}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+3.21% +$4,143.09</span>
                    </span>
                  </div>
                </div>

                {/* Timeframe switchers */}
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                  {['1D', '1W', '1M', '3M', '1Y', 'All'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setChartTimeframe(tf);
                        triggerToast(`Loading history data for ${tf}...`, 'info');
                      }}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer focus:outline-none ${
                        chartTimeframe === tf
                          ? 'bg-[#1e60ff] text-white shadow-lg shadow-[#1e60ff]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glowing Ambient Line Chart Component */}
              <div className="relative h-64 sm:h-72 w-full mt-4 flex items-end overflow-visible select-none" id="dashboard-svg-chart">
                
                {/* Background grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-t border-dashed border-gray-600 w-full" />
                  <div className="border-t border-dashed border-gray-600 w-full" />
                  <div className="border-t border-dashed border-gray-600 w-full" />
                  <div className="border-t border-dashed border-gray-600 w-full" />
                </div>

                {/* Interactive Hover crosshair line */}
                {hoverIndex !== null && (
                  <div 
                    className="absolute top-0 bottom-0 border-l border-white/10 pointer-events-none z-10"
                    style={{ left: `${(hoverIndex / (chartPoints.length - 1)) * 100}%` }}
                  >
                    {/* Tooltip on top */}
                    <div className="absolute top-2 -translate-x-1/2 bg-[#09090c] border border-white/15 px-3 py-1.5 rounded-lg shadow-2xl z-20 pointer-events-none text-center">
                      <p className="text-[10px] text-[#1e60ff] font-bold font-mono leading-none">
                        {chartPoints[hoverIndex].time}
                      </p>
                      <p className="text-xs text-white font-bold font-mono mt-1">
                        ${chartPoints[hoverIndex].price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Custom Responsive SVG Render Engine */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    {/* Neon blue gradient line */}
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1e60ff" stopOpacity="0.0" />
                    </linearGradient>
                    {/* Glow filter under line */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Draw neon line */}
                  <path
                    d={`M ${chartPoints.map((pt, index) => {
                      const x = (index / (chartPoints.length - 1)) * 100;
                      // Normalize y coordinate: range prices between min and max
                      const prices = chartPoints.map(p => p.price);
                      const min = Math.min(...prices) * 0.999;
                      const max = Math.max(...prices) * 1.001;
                      const y = 90 - ((pt.price - min) / (max - min)) * 80;
                      return `${x} ${y}`;
                    }).join(' L ')}`}
                    fill="none"
                    stroke="#1e60ff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  {/* Draw filled gradient under the line */}
                  <path
                    d={`M 0 100 L ${chartPoints.map((pt, index) => {
                      const x = (index / (chartPoints.length - 1)) * 100;
                      const prices = chartPoints.map(p => p.price);
                      const min = Math.min(...prices) * 0.999;
                      const max = Math.max(...prices) * 1.001;
                      const y = 90 - ((pt.price - min) / (max - min)) * 80;
                      return `${x} ${y}`;
                    }).join(' L ')} L 100 100 Z`}
                    fill="url(#chartGradient)"
                  />

                  {/* Draw intersecting dot at the end */}
                  <circle
                    cx="100"
                    cy={90 - ((chartPoints[chartPoints.length - 1].price - Math.min(...chartPoints.map(p => p.price)) * 0.999) / (Math.max(...chartPoints.map(p => p.price)) * 1.001 - Math.min(...chartPoints.map(p => p.price)) * 0.999)) * 80}
                    r="1.2"
                    fill="#1e60ff"
                    stroke="white"
                    strokeWidth="0.3"
                  />
                </svg>

                {/* Mouse interaction layer */}
                <div 
                  className="absolute inset-0 cursor-crosshair z-10" 
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const pct = x / rect.width;
                    const index = Math.min(
                      Math.max(Math.round(pct * (chartPoints.length - 1)), 0),
                      chartPoints.length - 1
                    );
                    setHoverIndex(index);
                  }}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </div>

              {/* Bottom timestamps x-axis labels */}
              <div className="flex items-center justify-between mt-3 text-[9px] text-gray-500 font-bold font-mono px-1">
                <span>{chartTimeframe === '1D' ? '12:00 AM' : 'Start'}</span>
                <span>{chartTimeframe === '1D' ? '06:00 AM' : 'Mid'}</span>
                <span>{chartTimeframe === '1D' ? '12:00 PM' : 'Later'}</span>
                <span>{chartTimeframe === '1D' ? '06:00 PM' : 'End'}</span>
              </div>
            </div>

            {/* MARKET WATCH PANEL (Matches screenshot 100% exactly) */}
            <div className="lg:col-span-4 rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 flex flex-col justify-between" id="market-watch-panel">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <h3 className="font-sans font-bold text-xs text-white">Market Watch</h3>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Vunex Market major trading assets</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 text-gray-400 hover:text-white cursor-pointer focus:outline-none">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 text-gray-400 hover:text-white cursor-pointer focus:outline-none">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Major Assets Table List */}
                <div className="space-y-1 max-h-[310px] overflow-y-auto">
                  
                  {/* Table headers */}
                  <div className="grid grid-cols-12 text-[9px] text-gray-500 font-bold tracking-widest pb-1 text-left uppercase">
                    <span className="col-span-4">Symbol</span>
                    <span className="col-span-3 text-right">Price</span>
                    <span className="col-span-3 text-right">Change</span>
                    <span className="col-span-2 text-right">24h</span>
                  </div>

                  {markets.map((market) => {
                    const isSelected = selectedSymbol === market.symbol;
                    
                    return (
                      <button
                        key={market.symbol}
                        onClick={() => {
                          setSelectedSymbol(market.symbol);
                          triggerToast(`Switched active chart to ${market.symbol}.`, 'success');
                        }}
                        className={`w-full grid grid-cols-12 items-center py-2.5 px-2 rounded-xl text-xs text-left transition-colors cursor-pointer border focus:outline-none ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#1e60ff]/10 to-transparent border-[#1e60ff]/20 text-white'
                            : 'bg-transparent hover:bg-white/[0.02] border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="col-span-4 flex items-center gap-1.5 text-left">
                          <span className={`w-1.5 h-1.5 rounded-full ${market.isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <div className="flex flex-col">
                            <span className="font-bold text-white font-mono">{market.symbol}</span>
                            <span className="text-[8.5px] text-gray-500 leading-none truncate max-w-[55px]">{market.name}</span>
                          </div>
                        </div>

                        <div className="col-span-3 text-right font-mono font-semibold text-white">
                          {market.price.toLocaleString(undefined, { minimumFractionDigits: market.symbol.includes('JPY') ? 3 : market.symbol.includes('USD') && !market.symbol.includes('BTC') ? 5 : 2 })}
                        </div>

                        <div className={`col-span-3 text-right font-bold font-mono ${market.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {market.isUp ? '+' : ''}{market.change}%
                        </div>

                        {/* Sparkline visualization precisely as mockup */}
                        <div className="col-span-2 flex justify-end">
                          <svg className="w-10 h-5" viewBox="0 0 10 10" preserveAspectRatio="none">
                            <polyline
                              fill="none"
                              stroke={market.isUp ? '#10b981' : '#f43f5e'}
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={market.sparkline.map((val, idx) => `${idx * 1.1}, ${10 - val / 10}`).join(' ')}
                            />
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom horizontal view redirect link */}
              <button 
                onClick={() => triggerToast('Redirecting to Advanced Markets Board (Simulated).', 'info')}
                className="w-full py-2.5 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] hover:text-[#1e60ff] text-white font-semibold text-[10px] rounded-xl transition-all text-center block cursor-pointer mt-4"
              >
                View All Markets →
              </button>
            </div>
          </div>

          {/* BOTTOM ROW: OPEN POSITIONS & RECENT TRANSACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* OPEN POSITIONS GRID MODULE (Bottom Left) */}
            <div className="lg:col-span-7 rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 flex flex-col justify-between" id="open-positions-card">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <h3 className="font-sans font-bold text-xs text-white">Open Positions ({positions.length})</h3>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Manage your active trading positions</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.05] text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                        <th className="pb-2.5">Symbol</th>
                        <th className="pb-2.5 text-center">Type</th>
                        <th className="pb-2.5 text-right">Size</th>
                        <th className="pb-2.5 text-right">Entry Price</th>
                        <th className="pb-2.5 text-right">Mark Price</th>
                        <th className="pb-2.5 text-right">P&L</th>
                        <th className="pb-2.5 text-right">P&L %</th>
                        <th className="pb-2.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      <AnimatePresence mode="popLayout">
                        {positions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-xs text-gray-500 font-semibold">
                              No active open positions. Select assets from Market Watch to trade!
                            </td>
                          </tr>
                        ) : (
                          positions.map((pos) => (
                            <motion.tr
                              key={pos.symbol}
                              layoutId={`pos-row-${pos.symbol}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, x: -50 }}
                              className="text-xs group hover:bg-white/[0.01] transition-colors"
                            >
                              <td className="py-3 text-left">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white font-mono">{pos.symbol}</span>
                                  <span className="text-[9px] text-gray-500 leading-none">{pos.name}</span>
                                </div>
                              </td>

                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  pos.type === 'BUY' 
                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                    : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {pos.type}
                                </span>
                              </td>

                              <td className="py-3 text-right font-mono font-medium text-gray-300">{pos.size}</td>

                              <td className="py-3 text-right font-mono font-semibold text-gray-300">
                                {pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: pos.symbol.includes('USD') && !pos.symbol.includes('BTC') ? 5 : 2 })}
                              </td>

                              <td className="py-3 text-right font-mono font-semibold text-white">
                                {pos.markPrice.toLocaleString(undefined, { minimumFractionDigits: pos.symbol.includes('USD') && !pos.symbol.includes('BTC') ? 5 : 2 })}
                              </td>

                              <td className="py-3 text-right font-bold font-mono text-emerald-400">
                                {pos.pnl >= 0 ? '+$' : '-$'}{Math.abs(pos.pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>

                              <td className="py-3 text-right font-bold font-mono text-emerald-400">
                                +{pos.pnlPercent}%
                              </td>

                              <td className="py-3 text-center">
                                <button
                                  onClick={() => handleClosePosition(pos.symbol, pos.pnl)}
                                  className="px-2 py-1 border border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500 text-[10px] font-bold rounded-lg text-rose-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                                >
                                  Close
                                </button>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              <button 
                onClick={() => triggerToast('Viewing complete portfolio dashboard (Simulated).', 'info')}
                className="w-full py-2.5 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] hover:text-[#1e60ff] text-white font-semibold text-[10px] rounded-xl transition-all text-center block cursor-pointer mt-4"
              >
                View All Positions →
              </button>
            </div>

            {/* RECENT TRANSACTIONS LEDGER (Bottom Center) */}
            <div className="lg:col-span-5 rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 flex flex-col justify-between" id="recent-transactions-card">
              <div>
                <div className="text-left mb-4">
                  <h3 className="font-sans font-bold text-xs text-white">Recent Transactions</h3>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Logs of funds transfers and closed earnings</span>
                </div>

                <div className="space-y-3 max-h-[290px] overflow-y-auto">
                  {transactions.map((tx, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          tx.isPositive 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {tx.isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{tx.type}</span>
                          <span className="text-[9.5px] text-gray-500 mt-0.5 leading-none">{tx.method}</span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col">
                        <span className={`text-xs font-extrabold font-mono ${tx.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.isPositive ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[8.5px] text-gray-500 font-mono mt-0.5 leading-none">{tx.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => triggerToast('Redirecting to full account ledger (Simulated).', 'info')}
                className="w-full py-2.5 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] hover:text-[#1e60ff] text-white font-semibold text-[10px] rounded-xl transition-all text-center block cursor-pointer mt-4"
              >
                View All →
              </button>
            </div>
          </div>

          {/* BOTTOM QUICK ACTIONS PANEL & VERIFICATION ADVERTISEMENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* QUICK ACTIONS PANEL BUTTONS */}
            <div className="lg:col-span-7 rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 flex flex-col justify-between" id="quick-actions-panel">
              <div className="text-left">
                <h3 className="font-sans font-bold text-xs text-white">Quick Actions</h3>
                <span className="text-[9px] text-gray-500 block mt-0.5">Frequently used platform functions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                
                {/* Deposit */}
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-left cursor-pointer group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <ArrowDownLeft className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">Deposit Funds</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Add money to your account.</p>
                  </div>
                </button>

                {/* Withdraw */}
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-left cursor-pointer group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <ArrowUpRight className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">Withdraw Funds</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Withdraw your earnings.</p>
                  </div>
                </button>

                {/* Start Trading */}
                <button
                  onClick={() => triggerToast('Redirecting to primary terminal terminal... (Simulated)', 'success')}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-left cursor-pointer group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">Start Trading</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Go to trading terminal.</p>
                  </div>
                </button>

                {/* Verify Account */}
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-left cursor-pointer group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">Verify Account</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">Complete verification.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* SECURE HIGH-CONTRAST VERIFY NOW BOX (Bottom Right, Matches Screenshot 4) */}
            <div className="lg:col-span-5 rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-5 flex items-center justify-between overflow-hidden relative" id="secure-verification-promo">
              {/* Card top border glowing bar */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1e60ff]/40 to-transparent" />
              
              <div className="space-y-4 max-w-[65%] text-left relative z-10">
                <h3 className="font-sans font-bold text-base text-white tracking-tight">Verify Your Account</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Get verified to unlock higher limits and additional platform features.
                </p>
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="px-4 py-2 bg-[#1e60ff] hover:bg-[#1e60ff]/95 text-white font-bold text-[10.5px] rounded-lg transition-all shadow-md shadow-[#1e60ff]/10 hover:shadow-[#1e60ff]/25 cursor-pointer flex items-center gap-1.5 active:scale-[0.99] focus:outline-none"
                >
                  <span>Verify Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Shield 3D asset */}
              <div className="relative w-[110px] h-[110px] flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden">
                <img src={shieldAsset} alt="Security Shield" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>

          </div>

          {/* 5. MULTI-AUTHORITY REGULATORY LOGO INFO FOOTER SECTION */}
          <footer className="pt-6 border-t border-white/[0.04]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left text-[11px] text-gray-500">
              
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1e60ff] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">Regulated & Secure</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">Licensed and audited by top-tier authorities.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#1e60ff] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">Bank-Level Security</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">256-bit SSL financial standard encryption.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#1e60ff] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">24/7 Support</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">Real institutional brokers, real help anytime.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e60ff] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white">Negative Balance Protection</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">We protect your capital margins automatically.</p>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-mono">
              <span>© {new Date().getFullYear()} Vunex Market Ltd. All rights reserved. Registered broker.</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Server Status: Operational</span>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MODALS INTERACTIVE OVERLAYS */}
      {/* ========================================================================= */}
      
      {/* DEPOSIT FUNDS MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop clickout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDepositModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left"
            >
              <button 
                onClick={() => setShowDepositModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-[#1e60ff]" />
                <span>Deposit Funds</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Add instant liquid funds to your live balance.</p>

              <form onSubmit={handleDepositSubmit} className="space-y-4 mt-5">
                {/* Deposit Method Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Method</label>
                  <select 
                    value={depositMethod}
                    onChange={(e) => setDepositMethod(e.target.value)}
                    className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Bank Wire Transfer">Bank Wire Transfer (Processing: instant)</option>
                    <option value="Credit / Debit Card">Credit / Debit Card (Processing: instant)</option>
                    <option value="Crypto Transfer (USDT/BTC)">Crypto Transfer USDT / BTC (Processing: instant)</option>
                    <option value="Apple Pay / Google Pay">Apple Pay / Google Pay (Processing: instant)</option>
                  </select>
                </div>

                {/* Amount input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Amount ($ USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="100"
                      step="1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount to deposit"
                      className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 font-mono">$</span>
                  </div>
                </div>

                {/* Quick select buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {['1000', '5000', '10000', '25000'].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setDepositAmount(val)}
                      className="py-1.5 border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.04] text-[10px] font-bold text-gray-300 hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      +${parseFloat(val).toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-[#1e60ff]/5 border border-[#1e60ff]/10 rounded-lg text-[10px] text-gray-400 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#1e60ff] flex-shrink-0 mt-0.5" />
                  <p className="leading-normal">
                    This transaction is protected by standard PCI DSS Level 1 bank-level encryption. Your capital is safely held in tier-1 segregated custodian banks.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isActionSubmit}
                  className="w-full py-3 bg-[#1e60ff] hover:bg-[#1e60ff]/95 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50"
                >
                  {isActionSubmit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Processing wire checkout...</span>
                    </>
                  ) : (
                    <span>Confirm Deposit Securely</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAW FUNDS MODAL */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left"
            >
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-[#1e60ff]" />
                <span>Withdraw Funds</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Instantly request cash payouts to your verified banking accounts.</p>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4 mt-5">
                
                {/* Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Payout Method</label>
                  <select 
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Bank Wire Transfer">Bank Wire Transfer (1-2 business days)</option>
                    <option value="Crypto Wallet (USDT/BTC)">Crypto Wallet USDT / BTC (Instant under 30m)</option>
                    <option value="Visa / Mastercard Direct">Visa / Mastercard Direct (Instant)</option>
                  </select>
                </div>

                {/* Balance display */}
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between text-xs font-mono">
                  <span className="text-gray-500">Available Balance:</span>
                  <span className="text-white font-bold">${totalBalance.toLocaleString()}</span>
                </div>

                {/* Amount input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Amount ($ USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="50"
                      max={totalBalance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Amount to withdraw"
                      className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 font-mono">$</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[10px] text-gray-400 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-normal">
                    Please ensure that the details of the designated bank account match the legal full name on your verified Vunex Market profile exactly to prevent payout delays.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isActionSubmit}
                  className="w-full py-3 bg-[#1e60ff] hover:bg-[#1e60ff]/95 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50"
                >
                  {isActionSubmit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying safe security protocols...</span>
                    </>
                  ) : (
                    <span>Request Payout Direct</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACCOUNT VERIFICATION INTERACTIVE STEP-BY-STEP MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVerifyModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left"
            >
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1e60ff]" />
                <span>Account Verification</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Secure your profile & bypass standard withdrawal limitations.</p>

              {/* Progress steps bar */}
              <div className="flex items-center justify-between gap-2.5 mt-5 pb-4 border-b border-white/[0.05]">
                {[
                  { step: 1, label: 'Choose Region' },
                  { step: 2, label: 'Document Submission' },
                  { step: 3, label: 'Verify' }
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                      verifyStep >= item.step 
                        ? 'bg-[#1e60ff] text-white' 
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      {item.step}
                    </span>
                    <span className={`text-[10px] font-semibold hidden sm:inline ${
                      verifyStep >= item.step ? 'text-white' : 'text-gray-500'
                    }`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {verifyStep === 1 && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Country of Residence</label>
                    <select
                      value={verifyCountry}
                      onChange={(e) => setVerifyCountry(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                  </div>

                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    By submitting your location, you certify that you reside in the chosen country and have access to official state documentation.
                  </p>

                  <button
                    type="button"
                    onClick={() => setVerifyStep(2)}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                  >
                    <span>Proceed to Documents</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {verifyStep === 2 && (
                <form onSubmit={handleVerifySubmit} className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Document Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className="py-2 px-3 bg-[#1e60ff]/10 border border-[#1e60ff]/30 text-white font-bold text-[10.5px] rounded-lg text-center cursor-pointer">
                        Passport / State ID
                      </button>
                      <button type="button" className="py-2 px-3 bg-[#030303]/40 border border-white/10 text-gray-400 hover:text-white text-[10.5px] font-bold rounded-lg text-center cursor-pointer">
                        Drivers License
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Document / ID Number</label>
                    <input
                      type="text"
                      required
                      value={verifyIdNum}
                      onChange={(e) => setVerifyIdNum(e.target.value)}
                      placeholder="e.g. A9283723"
                      className="w-full bg-black border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  {/* Drag and drop emulation */}
                  <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:border-white/20 transition-all cursor-pointer bg-[#030303]/40">
                    <ShieldCheck className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">Drag & drop your document scan file</p>
                    <p className="text-[10px] text-gray-500 mt-1">Supports PDF, PNG, JPG format up to 10MB.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVerifyStep(1)}
                      className="w-1/3 py-2.5 bg-transparent border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer focus:outline-none"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingSubmit}
                      className="flex-grow py-2.5 bg-[#1e60ff] hover:bg-[#1e60ff]/95 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                    >
                      {isVerifyingSubmit ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Encrypting & uploading...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Documents</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REFERRAL INVITE MODAL */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left animate-glow"
            >
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-[#1e60ff]/10 border border-[#1e60ff]/20 flex items-center justify-center mx-auto text-[#1e60ff]">
                  <Copy className="w-5 h-5" />
                </div>
                
                <h3 className="text-base font-bold text-white tracking-tight">Invite your Friends</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Share your link with colleagues. When they fund their accounts, you both receive $250 credit.
                </p>

                {/* Copiable share link */}
                <div className="flex gap-2 items-center p-2 rounded-xl bg-black border border-white/10 mt-4">
                  <span className="text-[10px] text-gray-500 font-mono truncate select-all flex-grow pl-1 text-left">
                    https://vunexmarket.com/invite/VIP-8857
                  </span>
                  <button
                    onClick={() => {
                      triggerToast('Invite link copied successfully!', 'success');
                      setShowInviteModal(false);
                    }}
                    className="p-1.5 bg-[#1e60ff] hover:bg-[#1e60ff]/90 text-white rounded-lg text-xs cursor-pointer focus:outline-none flex-shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Reusable account metric card with beautiful neon border glows
function MetricCard({ 
  title, 
  value, 
  changeText, 
  changeType, 
  icon, 
  subtext,
  showValue, 
  onToggleValue 
}: MetricCardProps) {
  const isUp = changeType === 'up';
  const isDown = changeType === 'down';
  const isPnlAccent = subtext === 'pnl-accent';

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#07070a]/90 p-4.5 flex items-start justify-between relative overflow-hidden group hover:border-[#1e60ff]/20 transition-all duration-300">
      
      {/* Dynamic glow effect inside cards on hover */}
      <div className="absolute inset-0 bg-[#1e60ff]/0 group-hover:bg-[#1e60ff]/2 transition-colors pointer-events-none" />

      <div className="space-y-1.5 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{title}</span>
          {onToggleValue && (
            <button 
              onClick={onToggleValue} 
              className="text-gray-500 hover:text-white cursor-pointer focus:outline-none transition-colors"
              title={showValue ? 'Hide balance' : 'Show balance'}
            >
              {showValue ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          )}
        </div>
        
        <h2 className={`font-sans font-extrabold text-xl tracking-tight ${
          isPnlAccent ? 'text-emerald-400 drop-shadow-[0_4px_10px_rgba(16,185,129,0.15)]' : 'text-white'
        }`}>
          {showValue ? value : '••••••••'}
        </h2>
        
        <p className={`text-[10.5px] font-bold font-mono ${
          isUp 
            ? 'text-emerald-400' 
            : isDown 
              ? 'text-rose-400' 
              : 'text-gray-500'
        }`}>
          {changeText}
        </p>
      </div>

      {/* Styled icon pedestal container */}
      <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center relative flex-shrink-0 group-hover:scale-105 transition-transform">
        {icon}
        <span className="absolute inset-0 bg-[#1e60ff]/4 rounded-xl blur-xs" />
      </div>

    </div>
  );
}
