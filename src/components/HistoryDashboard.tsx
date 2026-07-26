import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  Briefcase, 
  FileText, 
  History, 
  PieChart, 
  DollarSign, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  Calendar, 
  MoreVertical, 
  Info, 
  Bell, 
  CheckCircle,
  HelpCircle as HelpIcon,
  Search,
  Filter,
  X,
  TrendingUp,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import vunexLogo from '../assets/images/cutouts/logo_official.png';

interface HistoryDashboardProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

interface TradeItem {
  id: string;
  dateTime: string;
  symbol: string;
  type: 'Market' | 'Limit' | 'Stop';
  side: 'Buy' | 'Sell';
  volume: number;
  price: number;
  pnlUsd: number;
  pnlPips: number;
  status: 'Filled' | 'Partially Filled' | 'Canceled';
}

export default function HistoryDashboard({ onLogout, onNavigate }: HistoryDashboardProps) {
  // Main state variables
  const [selectedSymbol, setSelectedSymbol] = useState<string>('All Symbols');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [dateRange, setDateRange] = useState<string>('May 17, 2025 - May 24, 2025');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Dropdown states for filters
  const [activeDropdown, setActiveDropdown] = useState<'symbol' | 'type' | 'status' | 'date' | 'pageSize' | null>(null);

  // Initial full trade history list corresponding exactly to the image
  const fullTrades: TradeItem[] = useMemo(() => [
    { id: '1', dateTime: 'May 24, 2025 14:32:15', symbol: 'EURUSD', type: 'Market', side: 'Buy', volume: 1.00, price: 1.08945, pnlUsd: 320.50, pnlPips: 32.0, status: 'Filled' },
    { id: '2', dateTime: 'May 24, 2025 13:15:42', symbol: 'XAUUSD', type: 'Limit', side: 'Buy', volume: 0.50, price: 2384.65, pnlUsd: 215.75, pnlPips: 21.6, status: 'Filled' },
    { id: '3', dateTime: 'May 24, 2025 11:08:33', symbol: 'GBPUSD', type: 'Market', side: 'Sell', volume: 1.20, price: 1.27482, pnlUsd: -180.40, pnlPips: -18.0, status: 'Filled' },
    { id: '4', dateTime: 'May 24, 2025 09:45:21', symbol: 'USDJPY', type: 'Limit', side: 'Buy', volume: 1.00, price: 156.743, pnlUsd: 95.30, pnlPips: 9.5, status: 'Partially Filled' },
    { id: '5', dateTime: 'May 23, 2025 16:22:10', symbol: 'BTCUSD', type: 'Market', side: 'Sell', volume: 0.10, price: 67842.10, pnlUsd: 450.20, pnlPips: 45.0, status: 'Filled' },
    { id: '6', dateTime: 'May 23, 2025 15:10:05', symbol: 'USOIL', type: 'Limit', side: 'Buy', volume: 2.00, price: 78.245, pnlUsd: -60.00, pnlPips: -6.0, status: 'Filled' },
    { id: '7', dateTime: 'May 23, 2025 14:05:18', symbol: 'EURUSD', type: 'Stop', side: 'Sell', volume: 0.75, price: 1.08810, pnlUsd: 180.30, pnlPips: 18.0, status: 'Filled' },
    { id: '8', dateTime: 'May 23, 2025 12:30:47', symbol: 'XAUUSD', type: 'Market', side: 'Buy', volume: 0.30, price: 2375.20, pnlUsd: 90.00, pnlPips: 9.0, status: 'Filled' },
    { id: '9', dateTime: 'May 23, 2025 10:55:33', symbol: 'GBPUSD', type: 'Limit', side: 'Sell', volume: 1.00, price: 1.27010, pnlUsd: -120.10, pnlPips: -12.0, status: 'Canceled' },
    { id: '10', dateTime: 'May 23, 2025 09:20:11', symbol: 'USDJPY', type: 'Market', side: 'Buy', volume: 1.00, price: 156.210, pnlUsd: 75.60, pnlPips: 7.6, status: 'Filled' },
    
    // Additional items to simulate the pagination up to page 13 (total 128 trades)
    { id: '11', dateTime: 'May 22, 2025 15:45:10', symbol: 'EURUSD', type: 'Market', side: 'Buy', volume: 1.00, price: 1.08720, pnlUsd: 140.00, pnlPips: 14.0, status: 'Filled' },
    { id: '12', dateTime: 'May 22, 2025 11:20:05', symbol: 'GBPUSD', type: 'Limit', side: 'Buy', volume: 1.50, price: 1.26950, pnlUsd: 250.00, pnlPips: 25.0, status: 'Filled' },
    { id: '13', dateTime: 'May 22, 2025 08:15:30', symbol: 'XAUUSD', type: 'Market', side: 'Sell', volume: 0.40, price: 2368.10, pnlUsd: -190.00, pnlPips: -19.0, status: 'Filled' },
    { id: '14', dateTime: 'May 21, 2025 16:30:11', symbol: 'BTCUSD', type: 'Stop', side: 'Buy', volume: 0.05, price: 66920.00, pnlUsd: 380.00, pnlPips: 38.0, status: 'Filled' },
    { id: '15', dateTime: 'May 21, 2025 13:42:19', symbol: 'USDJPY', type: 'Market', side: 'Sell', volume: 0.80, price: 155.800, pnlUsd: -95.00, pnlPips: -9.5, status: 'Filled' },
    { id: '16', dateTime: 'May 21, 2025 10:05:00', symbol: 'USOIL', type: 'Market', side: 'Buy', volume: 1.00, price: 77.950, pnlUsd: 110.00, pnlPips: 11.0, status: 'Filled' },
    { id: '17', dateTime: 'May 20, 2025 14:18:22', symbol: 'EURUSD', type: 'Limit', side: 'Sell', volume: 1.20, price: 1.08550, pnlUsd: -210.00, pnlPips: -21.0, status: 'Filled' },
    { id: '18', dateTime: 'May 20, 2025 11:02:45', symbol: 'GBPUSD', type: 'Market', side: 'Buy', volume: 0.50, price: 1.26500, pnlUsd: 85.00, pnlPips: 8.5, status: 'Filled' },
    { id: '19', dateTime: 'May 20, 2025 09:12:13', symbol: 'XAUUSD', type: 'Market', side: 'Buy', volume: 0.20, price: 2355.80, pnlUsd: 145.00, pnlPips: 14.5, status: 'Filled' },
    { id: '20', dateTime: 'May 19, 2025 15:55:01', symbol: 'USDJPY', type: 'Limit', side: 'Sell', volume: 1.00, price: 155.120, pnlUsd: -130.00, pnlPips: -13.0, status: 'Filled' }
  ], []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleResetFilters = () => {
    setSelectedSymbol('All Symbols');
    setSelectedType('All Types');
    setSelectedStatus('All Statuses');
    setDateRange('May 17, 2025 - May 24, 2025');
    setCurrentPage(1);
    triggerToast('Filters reset to default view');
  };

  // Filtered trades list
  const filteredTrades = useMemo(() => {
    return fullTrades.filter(trade => {
      const matchSymbol = selectedSymbol === 'All Symbols' || trade.symbol === selectedSymbol;
      const matchType = selectedType === 'All Types' || trade.type === selectedType;
      const matchStatus = selectedStatus === 'All Statuses' || trade.status === selectedStatus;
      return matchSymbol && matchType && matchStatus;
    });
  }, [fullTrades, selectedSymbol, selectedType, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / pageSize));
  
  const displayedTrades = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredTrades.slice(startIdx, startIdx + pageSize);
  }, [filteredTrades, currentPage, pageSize]);

  // Derived metrics dynamically updated based on selection (matches default screen metrics perfectly)
  const stats = useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        totalTrades: 0,
        netPnl: 0,
        winRate: 0,
        profitFactor: 0,
        totalVolume: 0,
        grossProfit: 0,
        grossLoss: 0,
        avgWin: 0,
        avgLoss: 0,
        largestWin: 0,
        largestLoss: 0
      };
    }

    let grossProfit = 0;
    let grossLoss = 0;
    let winCount = 0;
    let lossCount = 0;
    let totalVolValue = 0;
    let maxWinValue = 0;
    let maxLossValue = 0;

    filteredTrades.forEach(t => {
      totalVolValue += t.volume * t.price * 1000; // Simulated volume value
      if (t.pnlUsd >= 0) {
        grossProfit += t.pnlUsd;
        winCount++;
        if (t.pnlUsd > maxWinValue) maxWinValue = t.pnlUsd;
      } else {
        grossLoss += Math.abs(t.pnlUsd);
        lossCount++;
        if (t.pnlUsd < maxLossValue) maxLossValue = t.pnlUsd;
      }
    });

    const netPnl = grossProfit - grossLoss;
    const winRate = (winCount / filteredTrades.length) * 100;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : grossProfit > 0 ? 3.5 : 0;
    
    return {
      totalTrades: filteredTrades.length,
      netPnl,
      winRate,
      profitFactor,
      totalVolume: totalVolValue,
      grossProfit,
      grossLoss,
      avgWin: winCount > 0 ? grossProfit / winCount : 0,
      avgLoss: lossCount > 0 ? grossLoss / lossCount : 0,
      largestWin: maxWinValue,
      largestLoss: maxLossValue
    };
  }, [filteredTrades]);

  // Toggle filter list dropdowns helper
  const handleDropdownToggle = (type: 'symbol' | 'type' | 'status' | 'date' | 'pageSize') => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(type);
    }
  };

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    setCurrentPage(1);
    setActiveDropdown(null);
    triggerToast(`Filtered symbol to: ${sym}`);
  };

  const handleSelectType = (t: string) => {
    setSelectedType(t);
    setCurrentPage(1);
    setActiveDropdown(null);
    triggerToast(`Filtered order type to: ${t}`);
  };

  const handleSelectStatus = (st: string) => {
    setSelectedStatus(st);
    setCurrentPage(1);
    setActiveDropdown(null);
    triggerToast(`Filtered status to: ${st}`);
  };

  const handleSelectPageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setActiveDropdown(null);
    triggerToast(`Page size updated to ${size} rows`);
  };

  const handleExportSubmit = (format: string) => {
    setShowExportModal(false);
    triggerToast(`Successfully exported 128 trades as ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f6] font-sans flex flex-col overflow-x-hidden selection:bg-[#1e60ff]/30 selection:text-white animate-fade-in" id="history-root">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.8)] z-100 flex items-center gap-3 backdrop-blur-md bg-[#09090c]/95 min-w-[320px] text-xs font-semibold text-white"
          >
            <CheckCircle className="w-4 h-4 text-[#1e60ff]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR (Matches image header exactly) */}
      <header className="h-20 bg-[#050508] border-b border-white/[0.05] flex items-center justify-between px-6 sm:px-8 z-30 shrink-0 sticky top-0">
        
        <div className="flex items-center gap-12">
          {/* Logo with clean Sharp Chevron V */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('Overview')}>
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative">
              <img src={vunexLogo} alt="Vunex Market" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-sans font-black text-sm tracking-[0.15em] text-white uppercase leading-none">Vunex</span>
              <span className="font-sans text-[7px] tracking-[0.3em] text-gray-500 uppercase leading-none mt-1">Market</span>
            </div>
          </div>

          {/* Navigation Links in Header (Matches image top menu: Dashboard, Trade, Markets, Accounts, Reports) */}
          <nav className="hidden lg:flex items-center gap-8 pl-4">
            {[
              { name: 'Dashboard', path: 'Overview', active: false },
              { name: 'Trade', path: 'Trade', active: false },
              { name: 'Markets', path: 'Markets', active: false },
              { name: 'Accounts', path: 'Accounts', active: false },
              { name: 'Reports', path: 'Reports', active: true, hasArrow: true },
            ].map((tab) => (
              <div key={tab.name} className="relative py-2 flex items-center gap-1">
                <button
                  onClick={() => onNavigate(tab.path)}
                  className={`text-[12px] font-bold tracking-wide transition-colors focus:outline-none cursor-pointer flex items-center gap-1 ${
                    tab.active ? 'text-white' : 'text-[#7e7e8b] hover:text-white'
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.hasArrow && <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
                </button>
                {tab.active && (
                  <motion.span 
                    layoutId="activeHeaderTabHistory"
                    className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-[#1e60ff] shadow-[0_0_12px_rgba(30,96,255,0.8)]" 
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-6">
          <button className="text-[#7e7e8b] hover:text-white transition-colors cursor-pointer hidden sm:block">
            <HelpIcon className="w-4.5 h-4.5" />
          </button>

          {/* Notification bell dropdown toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-[#7e7e8b] hover:text-white transition-colors relative cursor-pointer p-1"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1e60ff] rounded-full" />
            </button>
          </div>

          {/* Profile user info dropdown */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 cursor-pointer pl-1 py-1 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-xs font-black text-white tracking-wide group-hover:border-[#1e60ff] transition-all">
                DT
              </div>
              <div className="hidden xl:flex flex-col text-left select-none">
                <span className="text-[11px] font-black text-white tracking-wide uppercase">Demo Trader</span>
                <span className="text-[9px] text-[#1e60ff] font-black uppercase mt-0.5">Professional</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
            </div>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#07070a] border border-white/[0.08] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 py-2.5 text-left text-xs font-bold"
                  >
                    <div className="px-4 py-2 border-b border-white/[0.05] mb-2 select-none">
                      <span className="text-[10px] text-gray-500 block uppercase">Demo Trading Sandbox</span>
                      <span className="text-white block truncate text-[11px] mt-0.5">trader@vunexmarket.com</span>
                    </div>
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('Overview');
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
                    >
                      Console Settings
                    </button>
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Logout Account
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

      </header>

      {/* BODY FRAME: Left Navigation Sidebar + main dashboard viewport */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* LEFT SIDEBAR (Matches page 9 image sidebar exactly) */}
        <aside className="w-64 border-r border-white/[0.05] bg-[#030305]/60 flex flex-col justify-between p-5 shrink-0 hidden lg:flex select-none">
          <div className="space-y-6">
            <nav className="space-y-1">
              
              {/* Dashboard */}
              <button
                onClick={() => onNavigate('Overview')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <LayoutDashboard className="w-4 h-4 text-gray-500" />
                  <span>Dashboard</span>
                </div>
              </button>

              {/* Trade */}
              <button
                onClick={() => onNavigate('Trade')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <span>Trade</span>
                </div>
              </button>

              {/* Positions */}
              <button
                onClick={() => onNavigate('Positions')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>Positions</span>
                </div>
              </button>

              {/* Orders */}
              <button
                onClick={() => onNavigate('Orders')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Orders</span>
                </div>
              </button>

              {/* History (Highlighted active in Page 9) */}
              <button
                onClick={() => {}}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide text-white bg-white/[0.03] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.4)] relative"
              >
                <div className="flex items-center gap-3.5">
                  <History className="w-4 h-4 text-[#1e60ff]" />
                  <span>History</span>
                </div>
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#1e60ff] shadow-[0_0_8px_rgba(30,96,255,1)]" />
              </button>

              {/* Reports */}
              <button
                onClick={() => onNavigate('Reports')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <PieChart className="w-4 h-4 text-gray-500" />
                  <span>Reports</span>
                </div>
              </button>

              {/* Funds */}
              <button
                onClick={() => onNavigate('Funds')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>Funds</span>
                </div>
              </button>

              {/* Profile */}
              <button
                onClick={() => onNavigate('Profile')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Profile</span>
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={() => onNavigate('Settings')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </div>
              </button>

            </nav>
          </div>

          {/* Bottom Sidebar actions */}
          <div className="space-y-1">
            <button
              onClick={() => triggerToast("Connecting to live support desk...")}
              className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
            >
              <div className="flex items-center gap-3.5">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span>Support</span>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5"
            >
              <div className="flex items-center gap-3.5">
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </div>
            </button>
          </div>

        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-grow flex flex-col min-h-0 overflow-y-auto p-6 sm:p-8">
          
          {/* HEADER ROW with Page Title, Export, and Generate Report */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight">Trade History</h1>
              <p className="text-[11px] text-gray-500 font-semibold mt-1">
                Review and analyze your trading performance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export button */}
              <button 
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-[#0a0a0f] border border-white/[0.08] hover:border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5 text-gray-400" />
                <span>Export</span>
              </button>

              {/* Generate Report button */}
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#1e60ff] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(30,96,255,0.25)]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* FILTERS PANEL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6 relative z-20">
            
            {/* Symbol Filter */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownToggle('symbol')}
                className="w-full bg-[#07070a] border border-white/[0.06] hover:border-white/15 px-3.5 py-2.5 rounded-xl text-[11px] font-bold text-left text-gray-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase leading-none mb-1">Symbol</span>
                  <span>{selectedSymbol}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'symbol' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto p-1.5"
                    >
                      {['All Symbols', 'EURUSD', 'XAUUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'USOIL'].map(sym => (
                        <button
                          key={sym}
                          onClick={() => handleSelectSymbol(sym)}
                          className="w-full text-left px-3 py-2 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer block"
                        >
                          {sym}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Order Type Filter */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownToggle('type')}
                className="w-full bg-[#07070a] border border-white/[0.06] hover:border-white/15 px-3.5 py-2.5 rounded-xl text-[11px] font-bold text-left text-gray-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase leading-none mb-1">Order Type</span>
                  <span>{selectedType}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'type' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl z-40 p-1.5"
                    >
                      {['All Types', 'Market', 'Limit', 'Stop'].map(t => (
                        <button
                          key={t}
                          onClick={() => handleSelectType(t)}
                          className="w-full text-left px-3 py-2 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer block"
                        >
                          {t}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownToggle('status')}
                className="w-full bg-[#07070a] border border-white/[0.06] hover:border-white/15 px-3.5 py-2.5 rounded-xl text-[11px] font-bold text-left text-gray-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase leading-none mb-1">Status</span>
                  <span>{selectedStatus}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'status' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl z-40 p-1.5"
                    >
                      {['All Statuses', 'Filled', 'Partially Filled', 'Canceled'].map(st => (
                        <button
                          key={st}
                          onClick={() => handleSelectStatus(st)}
                          className="w-full text-left px-3 py-2 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer block"
                        >
                          {st}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownToggle('date')}
                className="w-full bg-[#07070a] border border-white/[0.06] hover:border-white/15 px-3.5 py-2.5 rounded-xl text-[11px] font-bold text-left text-gray-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase leading-none mb-1">Date Range</span>
                  <span className="truncate">{dateRange}</span>
                </div>
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'date' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl z-40 p-3 text-left space-y-2 min-w-[200px]"
                    >
                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Select Presets</span>
                      {['Today', 'Yesterday', 'Last 7 Days', 'May 17, 2025 - May 24, 2025'].map(dr => (
                        <button
                          key={dr}
                          onClick={() => {
                            setDateRange(dr);
                            setActiveDropdown(null);
                            triggerToast(`Date range set to ${dr}`);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer block"
                        >
                          {dr}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Reset Filters button */}
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/15 bg-black/40 hover:bg-[#07070a] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Reset Filters</span>
            </button>

          </div>

          {/* MAIN 2-COLUMN DISPLAY (Left metrics & table, Right performance summary card) */}
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
            
            {/* LEFT AREA: METRICS ROW + TABLE (8 columns) */}
            <div className="xl:col-span-7 space-y-6">
              
              {/* METRIC CARDS ROW (5 cards matching Page 9 exactly) */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                
                {/* 1. Total Trades */}
                <div className="bg-[#07070a] border border-white/[0.05] rounded-xl p-4 text-left flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#1e60ff]/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/2 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Total Trades</span>
                  
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-black text-white">{stats.totalTrades}</span>
                    {/* Tiny visual sparkline SVG */}
                    <svg className="w-16 h-8 text-[#1e60ff]" viewBox="0 0 100 40" fill="none">
                      <path d="M0 30 Q15 10 30 25 T60 15 T80 20 T100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <span className="text-[9.5px] font-bold text-emerald-400 mt-1 block">
                    +12.5% <span className="text-gray-500 font-medium">vs Apr 19 - May 16</span>
                  </span>
                </div>

                {/* 2. Net P&L */}
                <div className="bg-[#07070a] border border-white/[0.05] rounded-xl p-4 text-left flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#1e60ff]/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/2 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Net P&L</span>
                  
                  <div className="flex items-end justify-between mt-1">
                    <span className={`text-[19px] font-black tracking-tight ${stats.netPnl >= 0 ? 'text-emerald-400 drop-shadow-[0_4px_12px_rgba(16,185,129,0.15)]' : 'text-rose-400'}`}>
                      {stats.netPnl >= 0 ? '+' : '-'}${Math.abs(stats.netPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <svg className="w-16 h-8 text-[#1e60ff]" viewBox="0 0 100 40" fill="none">
                      <path d="M0 35 Q20 15 40 28 T70 12 T100 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <span className="text-[9.5px] font-bold text-emerald-400 mt-1 block">
                    +18.7% <span className="text-gray-500 font-medium">vs Apr 19 - May 16</span>
                  </span>
                </div>

                {/* 3. Win Rate */}
                <div className="bg-[#07070a] border border-white/[0.05] rounded-xl p-4 text-left flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#1e60ff]/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/2 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Win Rate</span>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-black text-white">{stats.winRate.toFixed(2)}%</span>
                    {/* Circular win rate tracker */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="2.5" opacity="0.05" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#1e60ff" strokeWidth="2.5" strokeDasharray="100" strokeDashoffset={100 - stats.winRate} strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <span className="text-[9.5px] font-bold text-emerald-400 mt-1 block">
                    +8.3% <span className="text-gray-500 font-medium">vs Apr 19 - May 16</span>
                  </span>
                </div>

                {/* 4. Profit Factor */}
                <div className="bg-[#07070a] border border-white/[0.05] rounded-xl p-4 text-left flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#1e60ff]/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/2 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Profit Factor</span>
                  
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-black text-white">{stats.profitFactor.toFixed(2)}</span>
                    <svg className="w-16 h-8 text-[#1e60ff]" viewBox="0 0 100 40" fill="none">
                      <path d="M0 25 Q15 35 40 15 T80 20 T100 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <span className="text-[9.5px] font-bold text-emerald-400 mt-1 block">
                    +0.35% <span className="text-gray-500 font-medium">vs Apr 19 - May 16</span>
                  </span>
                </div>

                {/* 5. Total Volume */}
                <div className="bg-[#07070a] border border-white/[0.05] rounded-xl p-4 text-left flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#1e60ff]/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/2 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Total Volume</span>
                  
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-[17px] font-black tracking-tight text-white font-sans">
                      ${stats.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <svg className="w-16 h-8 text-[#1e60ff]" viewBox="0 0 100 40" fill="none">
                      <path d="M0 20 Q15 5 30 15 T60 30 T80 5 T100 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <span className="text-[9.5px] font-bold text-emerald-400 mt-1 block">
                    +22.1% <span className="text-gray-500 font-medium">vs Apr 19 - May 16</span>
                  </span>
                </div>

              </div>

              {/* TABLE CONTAINER CARD */}
              <div className="bg-[#07070a] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Table Header / Action Row */}
                <div className="px-5 py-4 border-b border-white/[0.04] bg-black/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wider uppercase">Trades Journal</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-colors cursor-pointer">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* TABLE FRAME */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse select-none">
                    <thead>
                      <tr className="border-b border-white/[0.04] text-gray-500 font-black text-[9.5px] uppercase tracking-wider bg-black/45">
                        <th className="px-5 py-4.5 font-bold">Date / Time</th>
                        <th className="px-5 py-4.5 font-bold">Symbol</th>
                        <th className="px-5 py-4.5 font-bold">Type</th>
                        <th className="px-5 py-4.5 font-bold">Side</th>
                        <th className="px-5 py-4.5 font-bold text-right">Volume</th>
                        <th className="px-5 py-4.5 text-right font-bold">Price</th>
                        <th className="px-5 py-4.5 text-right font-bold">P&L (USD)</th>
                        <th className="px-5 py-4.5 text-right font-bold">P&L (Pips)</th>
                        <th className="px-5 py-4.5 text-center font-bold">Status</th>
                        <th className="px-3 py-4.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-[11.5px] font-medium text-gray-200">
                      {displayedTrades.map((trade) => {
                        const isBuy = trade.side === 'Buy';
                        const isPositive = trade.pnlUsd >= 0;

                        return (
                          <tr 
                            key={trade.id} 
                            className="hover:bg-white/[0.01] transition-all group"
                          >
                            <td className="px-5 py-4 text-gray-400 font-mono whitespace-nowrap">
                              {trade.dateTime}
                            </td>
                            <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                              {trade.symbol}
                            </td>
                            <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                              {trade.type}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${isBuy ? 'text-emerald-400 bg-emerald-500/5' : 'text-rose-400 bg-rose-500/5'}`}>
                                {trade.side}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right font-mono text-gray-300 font-bold whitespace-nowrap">
                              {trade.volume.toFixed(2)}
                            </td>
                            <td className="px-5 py-4 text-right font-mono text-gray-300 whitespace-nowrap">
                              {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                            </td>
                            <td className={`px-5 py-4 text-right font-mono font-bold whitespace-nowrap ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isPositive ? '+' : '-'}${Math.abs(trade.pnlUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className={`px-5 py-4 text-right font-mono font-bold whitespace-nowrap ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isPositive ? '+' : ''}{trade.pnlPips.toFixed(1)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                trade.status === 'Filled' 
                                  ? 'bg-[#1e60ff]/10 border border-[#1e60ff]/20 text-[#1e60ff]' 
                                  : trade.status === 'Partially Filled'
                                    ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                                    : 'bg-white/5 border border-white/10 text-gray-400'
                              }`}>
                                {trade.status}
                              </span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <button className="text-gray-600 hover:text-white cursor-pointer p-0.5">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {displayedTrades.length === 0 && (
                        <tr>
                          <td colSpan={10} className="text-center py-12 text-gray-500 font-bold">
                            No trades matching active filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION PANEL (Matches page 9 pagination layout perfectly) */}
                <div className="px-5 py-4 border-t border-white/[0.04] bg-black/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  
                  {/* Left size count info */}
                  <span className="text-[10.5px] font-bold text-gray-500 text-left">
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTrades.length)} of {filteredTrades.length} trades
                  </span>

                  {/* Centered page controls */}
                  <div className="flex items-center justify-center gap-1.5 self-center">
                    
                    {/* Prev page button */}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 rounded-lg border border-white/[0.04] bg-black/30 hover:bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                    >
                      &lt;
                    </button>

                    {/* Numerical pages (Dynamic but showing 1, 2, 3... 13 style) */}
                    {[1, 2, 3].map(p => {
                      if (p > totalPages) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-black font-mono transition-all cursor-pointer ${
                            currentPage === p 
                              ? 'bg-[#1e60ff] text-white shadow-[0_2px_8px_rgba(30,96,255,0.4)]' 
                              : 'border border-white/[0.04] bg-black/30 text-gray-400 hover:text-white hover:bg-white/[0.02]'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    {totalPages > 4 && <span className="text-gray-600 text-xs px-1">...</span>}

                    {totalPages > 3 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-7 h-7 rounded-lg text-xs font-black font-mono transition-all cursor-pointer ${
                          currentPage === totalPages 
                            ? 'bg-[#1e60ff] text-white shadow-[0_2px_8px_rgba(30,96,255,0.4)]' 
                            : 'border border-white/[0.04] bg-black/30 text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}

                    {/* Next page button */}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="w-7 h-7 rounded-lg border border-white/[0.04] bg-black/30 hover:bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                    >
                      &gt;
                    </button>

                  </div>

                  {/* Page Size dropdown */}
                  <div className="relative self-center sm:self-auto">
                    <button 
                      onClick={() => handleDropdownToggle('pageSize')}
                      className="bg-black/40 hover:bg-[#07070a] border border-white/[0.06] hover:border-white/12 px-3 py-1.5 rounded-lg text-[10.5px] font-black text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span>{pageSize} / page</span>
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === 'pageSize' && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute bottom-10 right-0 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl z-40 p-1 min-w-[90px]"
                          >
                            {[5, 10, 20].map(size => (
                              <button
                                key={size}
                                onClick={() => handleSelectPageSize(size)}
                                className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer block"
                              >
                                {size} / page
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR: TOTAL VOLUME CARD + PERFORMANCE SUMMARY (3 columns) */}
            <div className="xl:col-span-3 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">

                {/* PERFORMANCE SUMMARY */}
                <div className="rounded-2xl border border-white/[0.05] bg-[#07070a] p-5 text-left space-y-4 shadow-2xl relative overflow-hidden">
                  
                  <div className="flex flex-col">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      Performance Summary
                    </h3>
                    <span className="text-[9.5px] text-gray-500 font-bold block mt-1">
                      {dateRange}
                    </span>
                  </div>

                  {/* List of high-fidelity performance metrics corresponding to page 9 list */}
                  <div className="space-y-3.5 text-[11px] font-medium pt-1.5">
                    
                    {/* Net P&L */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Net P&L</span>
                      <span className={`font-black font-mono ${stats.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${stats.netPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Gross Profit</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ${stats.grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Gross Loss */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Gross Loss</span>
                      <span className="text-rose-400 font-bold font-mono">
                        -${stats.grossLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-white/[0.04]" />

                    {/* Win Rate */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-white font-extrabold font-mono">
                        {stats.winRate.toFixed(2)}%
                      </span>
                    </div>

                    {/* Profit Factor */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Profit Factor</span>
                      <span className="text-white font-extrabold font-mono">
                        {stats.profitFactor.toFixed(2)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-white/[0.04]" />

                    {/* Average Win */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Win</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ${stats.avgWin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Average Loss */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Loss</span>
                      <span className="text-rose-400 font-bold font-mono">
                        -${stats.avgLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Largest Win */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Largest Win</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ${stats.largestWin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Largest Loss */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Largest Loss</span>
                      <span className="text-rose-400 font-bold font-mono">
                        -${stats.largestLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-white/[0.04]" />

                    {/* Total Trades */}
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-gray-400">Total Trades</span>
                      <span className="text-white font-bold font-mono">
                        {stats.totalTrades}
                      </span>
                    </div>

                    {/* Total Volume */}
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-gray-400">Total Volume</span>
                      <span className="text-white font-bold font-mono">
                        ${stats.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                  </div>

                  {/* View Full Report Outline Button */}
                  <div className="pt-3.5">
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="w-full py-2.5 rounded-xl border border-white/[0.08] hover:border-white/18 bg-black/20 hover:bg-[#07070a] text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Full Report</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Secure Regulatory message at the bottom right */}
              <div className="text-[10px] text-gray-500 bg-black/20 border border-white/[0.03] p-3.5 rounded-xl text-center leading-relaxed">
                All metrics are historical summaries calculated securely from authorized blockchain clearing accounts under CFTC guidelines.
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* EXPORT DATA INTERACTIVE MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm p-6 bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl text-left"
            >
              <button 
                onClick={() => setShowExportModal(false)}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Download className="w-5 h-5" />
                </div>
                
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight">Export Trades Journal</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">
                    Download the complete trading journal including raw transaction pips, prices, and status hashes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleExportSubmit('csv')}
                    className="py-3 px-4 bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-white text-center cursor-pointer hover:bg-white/[0.04] transition-all"
                  >
                    CSV format (.csv)
                  </button>
                  <button
                    onClick={() => handleExportSubmit('pdf')}
                    className="py-3 px-4 bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-white text-center cursor-pointer hover:bg-white/[0.04] transition-all"
                  >
                    PDF document (.pdf)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg p-6 bg-[#07070a] border border-white/10 rounded-2xl shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e60ff]/5 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute right-4.5 top-4.5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-[#1e60ff]">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight">Performance Analytics</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider font-mono">Vunex Advanced Reports v2.8</p>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/[0.04] rounded-xl space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Accuracy Win Streak</span>
                    <span className="text-emerald-400 font-extrabold">8 Trades Consecutively</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Profitability Ratio</span>
                    <span className="text-white font-extrabold">62.5% Profitable</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Asset Concentration</span>
                    <span className="text-blue-400 font-extrabold">EURUSD (35%), XAUUSD (25%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Risk Reward Quotient</span>
                    <span className="text-white font-extrabold">1.94 (Optimal)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      triggerToast("Downloading full-scale ledger package. Please verify inside system logs.");
                    }}
                    className="w-full py-3 bg-[#1e60ff] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Download Ledger Package</span>
                    <ExternalLink className="w-4 h-4" />
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
