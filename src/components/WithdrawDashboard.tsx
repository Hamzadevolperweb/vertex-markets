import React, { useState, useEffect } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowUpDown, 
  Bell, 
  HelpCircle, 
  Settings, 
  User, 
  ChevronDown, 
  Check, 
  Copy, 
  AlertTriangle, 
  Lock, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Info,
  Headphones,
  CheckCircle,
  Plus,
  Play,
  TrendingUp,
  Coins,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import vunexLogo from '../assets/images/cutouts/logo_official.png';
import heroBullImg from '../assets/images/cutouts/bull.png';

interface WithdrawDashboardProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export default function WithdrawDashboard({ onLogout, onNavigate }: WithdrawDashboardProps) {
  // Available Balance state (matches the header top-right value)
  const [balanceValue, setBalanceValue] = useState(0);
  const balanceCurrency = "USD";

  useEffect(() => {
    import('../api/trading')
      .then(({ fetchTradingProfile }) => fetchTradingProfile())
      .then((p) => setBalanceValue(p.wallet?.availableBalance || 0))
      .catch(() => undefined);
  }, []);

  // Navigation tabs state
  const [activeSidebarTab, setActiveSidebarTab] = useState<'Deposit' | 'Withdraw' | 'Transfer' | 'History' | 'Overview'>('Withdraw');

  // Withdrawal form states
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto' | 'card'>('bank');
  const [destinationAccount, setDestinationAccount] = useState<'john_smith' | 'new_account'>('john_smith');
  const [amountStr, setAmountStr] = useState('5,000.00');
  const [otpDigits, setOtpDigits] = useState(['7', '2', '9', '4', '1', '0']);
  
  // Timer countdown for OTP resend (45 seconds)
  const [timerSeconds, setTimerSeconds] = useState(45);

  // Notifications toggle & menu toggles
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // UI flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Address dictionary for cryptocurrency (as a fallback or reference)
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');

  // Count down the resend code timer
  useEffect(() => {
    if (timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerSeconds]);

  const triggerToast = (msg: string, type?: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    // Allow typing numbers & decimal points
    setAmountStr(val);
  };

  const handleAmountBlur = () => {
    const valNum = parseFloat(amountStr) || 0;
    setAmountStr(valNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleQuickPercentClick = (percent: number) => {
    const calculated = (balanceValue * percent) / 100;
    setAmountStr(calculated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    triggerToast(`Amount set to ${percent}% of balance: $${calculated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  };

  const numericAmount = parseFloat(amountStr.replace(/,/g, '')) || 0;

  // Withdrawal fee calculations matching image exactly (15.00 USD)
  const getFees = () => {
    if (withdrawMethod === 'bank') return 15.00;
    if (withdrawMethod === 'crypto') return 5.00;
    return 10.00;
  };

  const getReceiveAmount = () => {
    const fee = getFees();
    const finalAmount = Math.max(0, numericAmount - fee);
    return finalAmount;
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);

    // Auto focus next box
    if (cleanVal && index < 5) {
      const nextBox = document.getElementById(`otp-${index + 1}`);
      nextBox?.focus();
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (numericAmount <= 0) {
      triggerToast("Please enter a valid withdrawal amount.");
      return;
    }
    if (numericAmount > balanceValue) {
      triggerToast("Withdrawal amount exceeds your available balance.");
      return;
    }
    
    // Check if OTP is complete
    if (otpDigits.some(d => d === '')) {
      triggerToast("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsProcessing(true);
    try {
      const { createWithdrawal } = await import('../api/trading');
      await createWithdrawal(numericAmount, {
        otp: otpDigits.join(''),
        method: withdrawMethod || 'bank',
      }, withdrawMethod || 'bank');
      setShowSuccessModal(true);
      triggerToast('Withdrawal requested — pending admin approval.');
    } catch (err: any) {
      triggerToast(err.message || 'Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendCode = () => {
    if (timerSeconds === 0) {
      setTimerSeconds(45);
      triggerToast("Security verification code resent to your phone and email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-[#f4f4f6] font-sans flex flex-col overflow-x-hidden selection:bg-[#1e60ff]/40 selection:text-white animate-fade-in" id="withdraw-root">
      
      {/* Dynamic Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.8)] z-100 flex items-center gap-3 backdrop-blur-md bg-[#09090c]/95 min-w-[320px] text-xs font-semibold text-white"
          >
            <Info className="w-4 h-4 text-[#1e60ff]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Loader Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-150 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <span className="absolute inset-0 border-2 border-white/[0.05] rounded-full" />
              <span className="absolute inset-0 border-2 border-[#1e60ff] border-t-transparent rounded-full animate-spin" />
              <Lock className="w-5 h-5 text-[#1e60ff] animate-pulse" />
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase mt-4">Securing Clearing Channel</h3>
            <p className="text-[10px] text-gray-500 mt-1 max-w-xs leading-relaxed">
              Verifying security signature & processing withdrawal batch transaction. Please hold...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-150 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#07070a] border border-white/[0.08] p-7 rounded-2xl max-w-md w-full relative overflow-hidden text-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>

              <h3 className="text-base font-extrabold text-white tracking-wide">Withdrawal Request Submitted</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Your request to withdraw <span className="text-white font-bold">${formatCurrency(numericAmount)} USD</span> has been safely queued for execution.
              </p>

              {/* Receipt details */}
              <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4 my-5 text-left text-[11px] font-mono space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method:</span>
                  <span className="text-white font-bold">Bank Transfer (USD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination Account:</span>
                  <span className="text-white font-bold">United Bank of America (•••• 1234)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference ID:</span>
                  <span className="text-blue-400 font-bold">WTH-{Math.floor(Math.random() * 900000) + 100000}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Net Credit Sent:</span>
                  <span className="text-emerald-400 font-bold">${formatCurrency(getReceiveAmount())} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Processing Time:</span>
                  <span className="text-white">1-3 Business Days</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('Overview');
                }}
                className="w-full py-3 bg-[#1e60ff] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR (Matches image header exactly with live ticker values) */}
      <header className="h-20 bg-[#050508] border-b border-white/[0.05] flex items-center justify-between px-6 sm:px-8 z-30 shrink-0 sticky top-0">
        
        {/* Left section: branding & tickers */}
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

          {/* Header live tickers strip matching the screenshot */}
          <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-8 select-none">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400">EURUSD</span>
              <span className="text-[10px] font-bold text-white font-mono">1.08945</span>
              <span className="text-[9px] font-bold text-emerald-400 font-mono">+0.47%</span>
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400">XAUUSD</span>
              <span className="text-[10px] font-bold text-white font-mono">2,384.65</span>
              <span className="text-[9px] font-bold text-emerald-400 font-mono">+0.62%</span>
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400">GBPUSD</span>
              <span className="text-[10px] font-bold text-white font-mono">1.27482</span>
              <span className="text-[9px] font-bold text-emerald-400 font-mono">+0.35%</span>
            </div>
          </div>

          {/* Navigation Links (Visible on ultra wide) */}
          <nav className="hidden xl:flex items-center gap-8 pl-4">
            {[
              { name: 'Dashboard', active: false },
              { name: 'Trade', active: false },
              { name: 'Markets', active: false },
              { name: 'Funds', active: true },
              { name: 'Accounts', active: false },
              { name: 'Tools', active: false },
              { name: 'Support', active: false },
            ].map((tab) => (
              <div key={tab.name} className="relative py-2">
                <button
                  onClick={() => {
                    if (tab.name === 'Funds') return;
                    onNavigate(tab.name);
                  }}
                  className={`text-[11.5px] font-bold tracking-wide transition-colors focus:outline-none cursor-pointer ${
                    tab.active ? 'text-white' : 'text-[#7e7e8b] hover:text-white'
                  }`}
                >
                  {tab.name}
                </button>
                {tab.active && (
                  <motion.span 
                    layoutId="activeHeaderTabWithdraw"
                    className="absolute bottom-[-10px] left-0 right-0 h-[2.5px] bg-[#1e60ff] shadow-[0_0_12px_rgba(30,96,255,0.8)]" 
                  />
                )}
              </div>
            ))}
          </nav>

        </div>

        {/* Right Section: balance, notifications, user settings */}
        <div className="flex items-center gap-6">
          
          {/* Available Balance indicator */}
          <div className="hidden md:flex flex-col text-right select-none">
            <span className="text-[9px] font-black tracking-widest text-[#5e5e6b] uppercase">Available Balance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-black text-white">{balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-[10px] font-extrabold text-[#1e60ff]">{balanceCurrency}</span>
              <ChevronDown className="w-3 h-3 text-gray-600 ml-0.5" />
            </div>
          </div>

          <span className="h-6 w-[1px] bg-white/[0.08] hidden md:block" />

          {/* Help icon */}
          <button className="text-[#7e7e8b] hover:text-white transition-colors cursor-pointer hidden sm:block">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>

          {/* Bell Notifications with custom dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-[#7e7e8b] hover:text-white transition-colors relative cursor-pointer p-1"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#1e60ff] border-2 border-[#020204] rounded-full text-[7px] text-white font-black flex items-center justify-center">
                3
              </span>
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[#07070a] border border-white/[0.08] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 p-4 text-left"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/[0.05] mb-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider">Recent Notifications</span>
                      <span className="text-[10px] text-[#1e60ff] font-bold hover:underline cursor-pointer">Mark all as read</span>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      <div className="p-2 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer">
                        <span className="text-[10.5px] font-bold text-white block">Withdrawal Queue Active</span>
                        <p className="text-[9.5px] text-gray-400 mt-0.5">Your withdrawal pipeline is secure. Priority handling enabled for Pro account.</p>
                      </div>
                      <div className="p-2 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer">
                        <span className="text-[10.5px] font-bold text-white block">Identity Verification Complete</span>
                        <p className="text-[9.5px] text-gray-400 mt-0.5">Level 2 verification was approved. Unlimited withdrawals activated.</p>
                      </div>
                      <div className="p-2 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer">
                        <span className="text-[10.5px] font-bold text-white block">MT5 Account Linked</span>
                        <p className="text-[9.5px] text-gray-400 mt-0.5">Trading terminal MT5 - 1234567 is synchronized.</p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile dropdown panel matching header of screenshot */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 cursor-pointer pl-1 py-1 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[11px] font-black text-white tracking-wide group-hover:border-[#1e60ff] transition-all">
                TR
              </div>
              <div className="hidden xl:flex flex-col text-left select-none">
                <span className="text-[11px] font-black text-white tracking-wide uppercase">Trader Pro</span>
                <span className="text-[9px] text-[#1e60ff] font-black uppercase mt-0.5">Pro Account</span>
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
                      <span className="text-[10px] text-gray-500 block uppercase">Log In As</span>
                      <span className="text-white block truncate text-[11px] mt-0.5">mh1729574@gmail.com</span>
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

      {/* CORE FRAME: Left Navigation Sidebar + 3-Column Content Workspace */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* LEFT SIDEBAR NAVIGATION (Matches page 8 image perfectly!) */}
        <aside className="w-64 border-r border-white/[0.05] bg-[#030305]/60 flex flex-col justify-between p-5 shrink-0 hidden lg:flex select-none">
          <div className="space-y-6">
            
            <nav className="space-y-1">
              {/* Dashboard tab with right arrow/chevron */}
              <button
                onClick={() => onNavigate('Overview')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              </button>

              {/* Accounts tab */}
              <button
                onClick={() => onNavigate('Accounts')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Accounts</span>
                </div>
              </button>

              {/* Funds tab - expanded, highlighted active tab */}
              <div className="space-y-1">
                <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide text-white bg-white/[0.03] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-3.5">
                    <ArrowDownLeft className="w-4 h-4 text-[#1e60ff]" />
                    <span>Funds</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                </div>

                {/* Sub-navigation nested list */}
                <div className="pl-6 pt-1 pb-2 space-y-1 relative">
                  {/* Visual sidebar indicator connector line */}
                  <div className="absolute left-[21px] top-0 bottom-2 w-[1px] bg-white/[0.05]" />

                  {[
                    { label: 'Deposit', path: 'Deposit' },
                    { label: 'Withdraw', path: 'Withdraw', active: true },
                    { label: 'Transfer', path: 'Transfer' },
                    { label: 'Transactions', path: 'History' }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        if (sub.path === 'Withdraw') return;
                        onNavigate(sub.path);
                      }}
                      className={`w-full flex items-center pl-5 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all relative ${
                        sub.active 
                          ? 'text-[#1e60ff] font-extrabold bg-blue-500/5 border border-blue-500/10' 
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {sub.active && (
                        <div className="absolute left-[-2px] w-1.5 h-1.5 rounded-full bg-[#1e60ff] shadow-[0_0_8px_rgba(30,96,255,1)]" />
                      )}
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trading with right chevron */}
              <button
                onClick={() => onNavigate('Trade')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span>Trading</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              </button>

              {/* Insights */}
              <button
                onClick={() => triggerToast("Insights section is under regulatory updates.", "info")}
                className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <Coins className="w-4 h-4 text-gray-500" />
                  <span>Insights</span>
                </div>
              </button>

              {/* Copy Trading */}
              <button
                onClick={() => triggerToast("Copy Trading modules require Level 2 approval.", "info")}
                className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <Sparkles className="w-4 h-4 text-gray-500" />
                  <span>Copy Trading</span>
                </div>
              </button>

              {/* Promotions */}
              <button
                onClick={() => triggerToast("Active promotions: 1% Deposit Premium.", "info")}
                className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <GiftIcon className="w-4 h-4 text-gray-500" />
                  <span>Promotions</span>
                </div>
              </button>

              {/* Support */}
              <button
                onClick={() => triggerToast("Connecting to live desk terminal...", "info")}
                className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3.5">
                  <Headphones className="w-4 h-4 text-gray-500" />
                  <span>Support</span>
                </div>
              </button>

            </nav>
          </div>

          {/* Bottom Sidebar promo with premium Bull Box and Upgrade button */}
          <div className="space-y-4">
            
            <div className="rounded-xl border border-white/[0.08] bg-[#07070a] p-4 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg">
              <div className="text-left select-none">
                <h4 className="text-[11px] font-black text-white tracking-wide uppercase">Trade Smarter.</h4>
                <p className="text-[10px] font-bold text-[#1e60ff] uppercase mt-0.5">Trade Vunex.</p>
              </div>
              
              {/* High-fidelity Chrome Bull image at the bottom */}
              <div className="relative w-full h-24 mt-2 rounded-lg overflow-hidden border border-white/[0.05]">
                <img 
                  src={heroBullImg} 
                  alt="Vunex Bull" 
                  className="w-full h-full object-contain object-center scale-105 p-1" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>
            </div>

            <button 
              onClick={() => triggerToast("You are already upgraded to the premium Vunex Pro Tier.", "success")}
              className="w-full py-2.5 px-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-[10px] font-extrabold text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Upgrade to Pro</span>
              <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </button>

          </div>

        </aside>

        {/* WORKSPACE AREA: 3-Column Layout exactly corresponding to design of Page 8 */}
        <main className="flex-grow flex flex-col min-h-0 overflow-y-auto relative p-6 sm:p-8 lg:p-10">
          
          {/* Header Title section */}
          <div className="text-left mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Withdraw Funds</h1>
            <p className="text-xs sm:text-xs text-gray-500 mt-1.5 font-bold">
              Securely withdraw your funds to your preferred payment method.
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch">
            
            {/* COLUMN 1 & 2 combined: 5-Step Secure Withdrawal Form (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* FORM CONTAINER CARD */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-6 sm:p-8 text-left space-y-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                
                {/* STEP 1: WITHDRAWAL METHOD */}
                <div className="space-y-3.5 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] font-mono text-xs font-black flex items-center justify-center">
                      1
                    </div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Withdrawal Method
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#7e7e8b] pl-9">Choose your preferred withdrawal method.</p>
                  
                  {/* Method dropdown selection */}
                  <div className="pl-9">
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setWithdrawMethod(withdrawMethod === 'bank' ? 'crypto' : 'bank');
                          triggerToast("Selected method toggled! Fee adjusted.");
                        }}
                        className="w-full bg-black/50 border border-white/[0.08] hover:border-white/15 rounded-xl px-4 py-3.5 text-xs text-gray-200 font-bold flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-white">
                            {withdrawMethod === 'bank' ? (
                              <svg className="w-4.5 h-4.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="21" width="18" height="2" />
                                <path d="M5 21V10h3v11M11 10v11M16 10v11" />
                                <path d="M2 10l10-7 10 7H2z" />
                              </svg>
                            ) : (
                              <svg className="w-4.5 h-4.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v12M15 9H9M15 15H9" />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11.5px]">{withdrawMethod === 'bank' ? 'Bank Transfer' : 'USDT Cryptocurreny (TRC20)'}</span>
                            {withdrawMethod === 'bank' && (
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black rounded uppercase tracking-wider">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* STEP 2: DESTINATION ACCOUNT */}
                <div className="space-y-3.5 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] font-mono text-xs font-black flex items-center justify-center">
                      2
                    </div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Destination Account
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#7e7e8b] pl-9">Select or add the account where funds will be sent.</p>
                  
                  {/* Account selection dropdown matching image perfectly */}
                  <div className="pl-9 space-y-2">
                    <div className="relative">
                      <button 
                        onClick={() => triggerToast("Destination verified and locked securely.")}
                        className="w-full bg-black/50 border border-white/[0.08] hover:border-white/15 rounded-xl px-4 py-3 text-xs text-gray-200 font-bold flex items-center justify-between cursor-pointer transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-white">
                            <svg className="w-4.5 h-4.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="21" width="18" height="2" />
                              <path d="M5 21V10h3v11M11 10v11M16 10v11" />
                              <path d="M2 10l10-7 10 7H2z" />
                            </svg>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                            <span className="text-[11.5px] font-bold">John Smith</span>
                            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] text-[8px] font-black rounded uppercase tracking-wider inline-block text-center w-fit">
                              Primary
                            </span>
                            <span className="text-[10.5px] text-gray-500 font-medium">United Bank of America</span>
                            <span className="text-[10.5px] text-gray-400 font-mono">**** **** **** 1234</span>
                            <span className="text-[10.5px] text-[#1e60ff]">USD</span>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    <button 
                      onClick={() => triggerToast("Routing to beneficiary registration...", "info")}
                      className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#1e60ff] hover:text-blue-400 tracking-wide transition-colors cursor-pointer pl-0.5 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Account</span>
                    </button>
                  </div>
                </div>

                {/* STEP 3: WITHDRAWAL AMOUNT */}
                <div className="space-y-3.5 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] font-mono text-xs font-black flex items-center justify-center">
                      3
                    </div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Withdrawal Amount
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#7e7e8b] pl-9">Enter the amount you wish to withdraw.</p>

                  <div className="pl-9 space-y-3">
                    
                    {/* Amount Input wrapper exactly matching Page 8 design */}
                    <div className="relative max-w-md">
                      <input 
                        type="text" 
                        value={amountStr}
                        onChange={handleAmountChange}
                        onBlur={handleAmountBlur}
                        className="w-full bg-black/60 border border-white/[0.08] hover:border-white/15 focus:border-[#1e60ff] rounded-xl pl-4 pr-16 py-3.5 text-sm text-white font-mono font-bold focus:outline-none transition-all shadow-inner"
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none pointer-events-none">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">USD</span>
                      </div>
                    </div>

                    {/* Quick percentage chips */}
                    <div className="flex items-center gap-2">
                      {[
                        { label: '25%', val: 0.25 },
                        { label: '50%', val: 0.50 },
                        { label: '75%', val: 0.75 },
                        { label: 'Max', val: 1.00 }
                      ].map((item) => {
                        const amountForPercent = balanceValue * item.val;
                        const isCurrent = Math.abs(numericAmount - amountForPercent) < 0.05;
                        return (
                          <button
                            key={item.label}
                            onClick={() => handleQuickPercentClick(item.val * 100)}
                            className={`px-6 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#1e60ff] border-[#1e60ff] text-white shadow-[0_4px_12px_rgba(30,96,255,0.3)]'
                                : 'border-white/[0.04] bg-black/40 text-gray-400 hover:text-white hover:bg-white/[0.02]'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* STEP 4: REVIEW & CONFIRM */}
                <div className="space-y-3.5 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] font-mono text-xs font-black flex items-center justify-center">
                      4
                    </div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Review & Confirm
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#7e7e8b] pl-9">Review your withdrawal details before confirming.</p>

                  <div className="pl-9 max-w-md">
                    <div className="bg-black/40 border border-white/[0.04] rounded-xl p-4.5 space-y-3 text-[11px] font-medium text-gray-400">
                      
                      <div className="flex justify-between items-center">
                        <span>Available Balance</span>
                        <span className="text-white font-bold font-mono">${formatCurrency(balanceValue)} USD</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Withdrawal Amount</span>
                        <span className="text-white font-bold font-mono">${formatCurrency(numericAmount)} USD</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Withdrawal Fee</span>
                        <span className="text-red-400 font-bold font-mono">- ${formatCurrency(getFees())} USD</span>
                      </div>

                      <div className="border-t border-white/[0.06] pt-3 flex justify-between items-center">
                        <span className="text-gray-200 font-bold">You Will Receive</span>
                        <span className="text-[#1e60ff] font-black text-sm font-mono tracking-tight drop-shadow-[0_0_15px_rgba(30,96,255,0.25)]">
                          ${formatCurrency(getReceiveAmount())} USD
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* STEP 5: SECURITY VERIFICATION */}
                <div className="space-y-3.5 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1e60ff] font-mono text-xs font-black flex items-center justify-center">
                      5
                    </div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Security Verification
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#7e7e8b] pl-9">Enter the code sent to your registered device.</p>

                  <div className="pl-9 flex flex-wrap items-center gap-6">
                    
                    {/* 6 Digit Input Boxes */}
                    <div className="flex items-center gap-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-10 h-10 sm:w-11 sm:h-11 bg-black/50 border border-white/[0.08] focus:border-[#1e60ff] rounded-xl text-center text-sm font-black font-mono text-white focus:outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>

                    {/* Resend Code Link */}
                    <button
                      onClick={handleResendCode}
                      disabled={timerSeconds > 0}
                      className={`text-[10.5px] font-extrabold tracking-wide transition-colors ${
                        timerSeconds > 0 
                          ? 'text-gray-500 select-none' 
                          : 'text-[#1e60ff] hover:text-blue-400 cursor-pointer'
                      }`}
                    >
                      {timerSeconds > 0 
                        ? `Resend Code (00:${timerSeconds.toString().padStart(2, '0')})` 
                        : 'Resend Code Now'
                      }
                    </button>

                  </div>
                </div>

                {/* BIG PRIMARY CONFIRM BUTTON */}
                <div className="pl-9 pt-4">
                  <button 
                    onClick={handleConfirmWithdrawal}
                    className="w-full py-4.5 bg-[#1e60ff] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_8px_24px_rgba(30,96,255,0.25)] hover:shadow-[0_8px_32px_rgba(30,96,255,0.4)] relative overflow-hidden"
                  >
                    <Lock className="w-4 h-4 text-white/90" />
                    <span>Confirm Withdrawal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Secure bottom notice */}
              <div className="flex items-center gap-3 justify-center text-[11px] text-gray-500 pl-4 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">All withdrawals are encrypted and processed securely.</span>
              </div>

            </div>

            {/* COLUMN 3: Right Sidebar with Withdrawal Summary & Recent Withdrawals (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* CARD 1: WITHDRAWAL SUMMARY */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-5.5 text-left space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
                  
                  {/* Glowing header badge overlay */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                  <h3 className="text-xs font-black text-white uppercase tracking-wider pb-1">
                    Withdrawal Summary
                  </h3>

                  {/* High-fidelity Chrome Bull image */}
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/[0.05] select-none shadow-md">
                    <img 
                      src={heroBullImg} 
                      alt="Vunex Chrome Bull" 
                      className="w-full h-full object-contain object-center p-2" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Visual Credit Card Preview of Destination */}
                  <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-4 flex items-center justify-between shadow-inner relative overflow-hidden select-none">
                    <div className="absolute inset-0 bg-radial-gradient from-blue-900/10 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-blue-900/40 border border-blue-500/20 rounded flex items-center justify-center text-[#1e60ff] font-black text-[9px] tracking-wide">
                        VISA
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10.5px] font-mono text-white font-bold">•••• •••• •••• 1234</span>
                        <span className="text-[8.5px] text-gray-500 font-extrabold uppercase mt-0.5 tracking-wider">United Bank of America</span>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4 text-white/30" />
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-3 pt-2 text-[11px] font-medium text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>Withdrawal Method</span>
                      <span className="text-white font-bold">Bank Transfer</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Destination</span>
                      <span className="text-white font-mono">•••• •••• •••• 1234</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Withdrawal Amount</span>
                      <span className="text-white font-mono font-bold">${formatCurrency(numericAmount)} USD</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Withdrawal Fee</span>
                      <span className="text-white font-mono font-bold">${formatCurrency(getFees())} USD</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1">
                        <span>Processing Time</span>
                        <Info className="w-3 h-3 text-gray-500" />
                      </span>
                      <span className="text-white font-bold">1-3 Business Days</span>
                    </div>

                    <div className="border-t border-white/[0.06] pt-3.5 flex justify-between items-center">
                      <span className="text-white font-bold">You Will Receive</span>
                      <span className="text-[#1e60ff] font-black text-sm font-mono tracking-tight drop-shadow-[0_0_15px_rgba(30,96,255,0.3)]">
                        ${formatCurrency(getReceiveAmount())} USD
                      </span>
                    </div>
                  </div>

                </div>

                {/* CARD 2: RECENT WITHDRAWALS */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-5.5 text-left space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  
                  <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      Recent Withdrawals
                    </h3>
                    <button 
                      onClick={() => triggerToast("All transactions loaded successfully.", "info")}
                      className="text-[10px] font-extrabold text-[#1e60ff] hover:text-blue-400 tracking-wider transition-colors cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {/* TRANSACTION LISTING (Matches the design exactly) */}
                  <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                    
                    {/* Item 1: Bank Transfer (Completed) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.02] hover:border-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                          </svg>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-white leading-none">Bank Transfer</span>
                          <span className="text-[8.5px] text-gray-500 font-mono mt-1">•••• •••• •••• 1234</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-white font-mono">2,500.00 USD</span>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">Completed</span>
                          <span className="text-[8.5px] text-gray-500">May 20, 2025</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 2: USDT Cryptocurreny (Completed) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.02] hover:border-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                          </svg>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-white leading-none">USDT (TRC20)</span>
                          <span className="text-[8.5px] text-gray-500 font-mono mt-1">TXa7d...f3K9</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-white font-mono">1,200.00 USDT</span>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">Completed</span>
                          <span className="text-[8.5px] text-gray-500">May 18, 2025</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 3: Bank Transfer (Processing) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.02] hover:border-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-white leading-none">Bank Transfer</span>
                          <span className="text-[8.5px] text-gray-500 font-mono mt-1">•••• •••• •••• 5678</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-white font-mono">3,000.00 USD</span>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400">Processing</span>
                          <span className="text-[8.5px] text-gray-500">May 16, 2025</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 4: USDC Cryptocurreny (Completed) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.02] hover:border-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                          </svg>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-white leading-none">USDC (ERC20)</span>
                          <span className="text-[8.5px] text-gray-500 font-mono mt-1">0x8F3b...d2A7</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-white font-mono">750.00 USDC</span>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">Completed</span>
                          <span className="text-[8.5px] text-gray-500">May 14, 2025</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 5: Bank Transfer (Completed) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.02] hover:border-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                          </svg>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-white leading-none">Bank Transfer</span>
                          <span className="text-[8.5px] text-gray-500 font-mono mt-1">•••• •••• •••• 1234</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-white font-mono">1,800.00 USD</span>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">Completed</span>
                          <span className="text-[8.5px] text-gray-500">May 12, 2025</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Security regulatory disclaimer text under Recent Withdrawals */}
                  <div className="flex items-start gap-2.5 text-[10px] leading-relaxed text-gray-500 pl-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
                    <span>All withdrawals are processed securely and in compliance with our regulatory standards.</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

// Simple internal GiftIcon component since lucide-react may not expose it depending on build env
function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
