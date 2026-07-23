import React, { useState } from 'react';
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
  Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroBullImg from '../assets/images/vertex_hero_bull_1784320384594.jpg';

interface DepositDashboardProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export default function DepositDashboard({ onLogout, onNavigate }: DepositDashboardProps) {
  // Available Balance state (matches the header top-right value)
  const balanceValue = "12,458.75";
  const balanceCurrency = "USD";

  // Deposit method state: 'bank' | 'card' | 'crypto'
  const [depositMethod, setDepositMethod] = useState<'bank' | 'card' | 'crypto'>('bank');
  
  // Interactive amount input
  const [amountStr, setAmountStr] = useState('1,000.00');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  
  // Crypto choice state (USDT as default)
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');
  const [isCryptoDropdownOpen, setIsCryptoDropdownOpen] = useState(false);

  // Success state after submitting
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Address dictionary based on selected coin
  const cryptoAddresses = {
    USDT: "TXafG6uY89PqZ3dWLK7M88NstBbc9g7Gd9",
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfJH",
    ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  };

  // Quick select amounts
  const quickAmounts = ['250', '500', '1000', '2500', '5000'];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const handleCopyAddress = () => {
    const address = cryptoAddresses[selectedCrypto];
    navigator.clipboard.writeText(address);
    setCopiedText(true);
    triggerToast(`${selectedCrypto} deposit address copied to clipboard!`);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // allow numbers, decimal points, and commas
    const val = e.target.value.replace(/[^0-9.,]/g, '');
    setAmountStr(val);
  };

  const handleQuickAmountClick = (valStr: string) => {
    const valNum = parseFloat(valStr.replace(/,/g, ''));
    setAmountStr(valNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    triggerToast(`Amount set to $${valNum.toLocaleString()}`);
  };

  const numericAmount = parseFloat(amountStr.replace(/,/g, '')) || 0;

  // Calculate values
  const getFees = () => {
    if (depositMethod === 'card') {
      return (numericAmount * 0.025).toFixed(2); // 2.5% card payment fee
    }
    return "0.00";
  };

  const getReceiveAmount = () => {
    const fee = parseFloat(getFees());
    const base = numericAmount - fee;
    const finalAmount = Math.max(0, base);
    return finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleConfirmDeposit = () => {
    if (numericAmount <= 0) {
      triggerToast("Please enter a valid deposit amount.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1800);
  };

  // Get estimated arrival based on selected method
  const getEstimatedArrival = () => {
    if (depositMethod === 'bank') return "1-3 Business Days";
    if (depositMethod === 'card') return "Instant";
    return "1-3 Network Confirmations";
  };

  // Get deposit method string for Review
  const getMethodLabel = () => {
    if (depositMethod === 'bank') return "Bank Transfer";
    if (depositMethod === 'card') return "Card Payment";
    return "Cryptocurrency";
  };

  return (
    <div className="min-h-screen bg-[#020204] text-[#f4f4f6] font-sans flex flex-col overflow-x-hidden selection:bg-[#1e60ff]/40 selection:text-white" id="deposit-root">
      
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

      {/* Processing Loader Screen overlay */}
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
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase mt-4">Connecting Secure Channel</h3>
            <p className="text-[10px] text-gray-500 mt-1 max-w-xs leading-relaxed">
              Dispatching cryptographic payload to our liquidity provider. Please hold...
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

              <h3 className="text-base font-extrabold text-white tracking-wide">Deposit Request Pending</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Your funding request of <span className="text-white font-bold">${numericAmount.toFixed(2)} USD</span> has been submitted successfully to the clearing house.
              </p>

              {/* Receipt details */}
              <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4 my-5 text-left text-[11px] font-mono space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method:</span>
                  <span className="text-white font-bold">{getMethodLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference ID:</span>
                  <span className="text-blue-400 font-bold">VTX-{Math.floor(Math.random() * 90000) + 10000}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Net Credit Expected:</span>
                  <span className="text-emerald-400 font-bold">{getReceiveAmount()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Processing Time:</span>
                  <span className="text-white">{getEstimatedArrival()}</span>
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

      {/* HEADER BAR (Matches image header exactly) */}
      <header className="h-20 bg-[#050508] border-b border-white/[0.05] flex items-center justify-between px-6 sm:px-8 z-30 shrink-0 sticky top-0">
        
        {/* Left section: branding & tabs */}
        <div className="flex items-center gap-12">
          
          {/* Logo with clean Sharp Chevron V */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('Overview')}>
            <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded blur-sm" />
              <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 4L12 12L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-sans font-black text-sm tracking-[0.15em] text-white uppercase leading-none">Vertex</span>
              <span className="font-sans text-[7px] tracking-[0.3em] text-gray-500 uppercase leading-none mt-1">Markets</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
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
                    layoutId="activeHeaderTab"
                    className="absolute bottom-[-10px] left-0 right-0 h-[2.5px] bg-[#1e60ff] shadow-[0_0_12px_rgba(30,96,255,0.8)]" 
                  />
                )}
              </div>
            ))}
          </nav>

        </div>

        {/* Right Section: balance, user initials, alerts */}
        <div className="flex items-center gap-6">
          
          {/* Available balance indicator matching screenshot */}
          <div className="hidden md:flex flex-col text-right select-none">
            <span className="text-[9px] font-black tracking-widest text-[#5e5e6b] uppercase">Available Balance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-black text-white">{balanceValue}</span>
              <span className="text-[10px] font-extrabold text-[#1e60ff]">{balanceCurrency}</span>
              <ChevronDown className="w-3 h-3 text-gray-600 ml-0.5" />
            </div>
          </div>

          <span className="h-6 w-[1px] bg-white/[0.08] hidden md:block" />

          {/* Bell Icon */}
          <button className="text-[#7e7e8b] hover:text-white transition-colors relative cursor-pointer p-1">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1e60ff] rounded-full" />
          </button>

          {/* Avatar 'TR' */}
          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[11px] font-black text-white tracking-wide cursor-pointer hover:border-[#1e60ff] transition-all">
            TR
          </div>

        </div>

      </header>

      {/* CORE FRAME: Sidebar + 3-Column Content Workspace */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* LEFT SIDEBAR (Exactly as requested) */}
        <aside className="w-60 border-r border-white/[0.05] bg-[#030305]/60 flex flex-col justify-between p-5 shrink-0 hidden lg:flex select-none">
          <div className="space-y-6">
            <div className="px-3.5">
              <span className="text-[9px] font-black text-[#1e60ff] tracking-widest uppercase">Console Portal</span>
            </div>

            <nav className="space-y-1">
              {[
                { label: 'Overview', icon: ArrowUpDown, path: 'Overview' },
                { label: 'Deposit', icon: ArrowDownLeft, path: 'Deposit', active: true },
                { label: 'Withdraw', icon: ArrowUpRight, path: 'Withdraw' },
                { label: 'Transfer', icon: ArrowUpDown, path: 'Transfer' },
                { label: 'History', icon: ArrowUpDown, path: 'History' },
                { label: 'Beneficiaries', icon: ArrowUpDown, path: 'Beneficiaries' },
                { label: 'Settings', icon: Settings, path: 'Settings' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = item.active;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.path === 'Deposit') return;
                      onNavigate(item.path);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-left relative ${
                      isActive 
                        ? 'text-white bg-white/[0.03] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.4)]' 
                        : 'text-[#7e7e8b] hover:text-white hover:bg-white/[0.01]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/3 bottom-1/3 w-[3px] bg-[#1e60ff] rounded-r-md" />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1e60ff]' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar promo with premium Bull Box */}
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-[#07070a] p-4 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg">
              <div className="text-left select-none">
                <h4 className="text-[11px] font-black text-white tracking-wide uppercase">Trade Smarter.</h4>
                <p className="text-[10px] font-bold text-[#1e60ff] uppercase mt-0.5">Trade Vertex.</p>
              </div>
              
              {/* High-fidelity Chrome Bull image at the bottom */}
              <div className="relative w-full h-24 mt-2 rounded-lg overflow-hidden border border-white/[0.05]">
                <img 
                  src={heroBullImg} 
                  alt="Vertex Bull" 
                  className="w-full h-full object-cover object-center scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>
            </div>

            <button 
              onClick={() => triggerToast("Need assistance? Support live ticket channel opened.")}
              className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl text-center text-[10.5px] text-[#7e7e8b] hover:text-white transition-all font-bold cursor-pointer"
            >
              Need help? Contact support
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY WORKSPACE */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto flex flex-col justify-between max-w-[1440px] mx-auto w-full space-y-8">
          
          <div className="space-y-6">
            
            {/* HERO CARD (Large Title on Left, Futuristic Curved Glass Vitrine with Polished 3D Metallic Charging Bull on Right) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-black via-[#040407] to-black rounded-2xl border border-white/[0.04] p-6 lg:p-8 overflow-hidden relative">
              <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-left space-y-2 relative z-10 md:max-w-xl">
                <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
                  Deposit Funds
                </h1>
                <p className="text-xs text-[#7e7e8b] leading-relaxed">
                  Fund your trading account securely and start trading global markets.
                </p>
              </div>

              {/* Spectacular futuristic display box representing high-fidelity chrome bull on trading grid */}
              <div className="relative shrink-0 w-full md:w-[380px] h-44 rounded-xl overflow-hidden border border-white/[0.08] select-none shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <img 
                  src={heroBullImg} 
                  alt="Vertex Chrome Bull" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                {/* Subtle vignette/glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none" />
              </div>

            </div>

            {/* THREE-COLUMN LAYOUT AS SHOWN IN THE SCREENSHOT (Select Method & Details, Review & Confirm, Cryptocurrency) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5.5 items-stretch">
              
              {/* COLUMN 1: STEP 1 (SELECT DEPOSIT METHOD) & STEP 2 (ENTER DETAILS) */}
              <div className="lg:col-span-5 flex flex-col gap-5.5">
                
                {/* STEP 1 Box */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-5.5 text-left space-y-4">
                  
                  <div className="flex items-center gap-2.5">
                    <span className="w-5.5 h-5.5 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-black">
                      1
                    </span>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Select Deposit Method
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    
                    {/* Bank Transfer Button */}
                    <button
                      onClick={() => {
                        setDepositMethod('bank');
                        triggerToast("Switched payment destination to Bank Wire Clearance");
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 transition-all relative focus:outline-none cursor-pointer ${
                        depositMethod === 'bank'
                          ? 'border-[#1e60ff] bg-[#1e60ff]/5 shadow-[0_4px_20px_rgba(30,96,255,0.08)]'
                          : 'border-white/[0.04] bg-black/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {depositMethod === 'bank' && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#1e60ff] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}

                      {/* Bank wire graphics icon */}
                      <svg className={`w-5 h-5 ${depositMethod === 'bank' ? 'text-[#1e60ff]' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="10" width="20" height="11" rx="1" />
                        <path d="M12 2L2 9h20L12 2z" />
                        <path d="M6 10v11M10 10v11M14 10v11M18 10v11" />
                      </svg>

                      <div className="space-y-0.5 select-none">
                        <span className="text-[10.5px] font-black text-white block">Bank Transfer</span>
                        <span className="text-[8.5px] text-[#5e5e6c] block">1-3 business days</span>
                        <span className="text-[8px] font-bold text-blue-400 block mt-1 uppercase">Low Fees</span>
                      </div>
                    </button>

                    {/* Card Payment Button */}
                    <button
                      onClick={() => {
                        setDepositMethod('card');
                        triggerToast("Switched payment destination to Visa/Mastercard Gateway");
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 transition-all relative focus:outline-none cursor-pointer ${
                        depositMethod === 'card'
                          ? 'border-[#1e60ff] bg-[#1e60ff]/5 shadow-[0_4px_20px_rgba(30,96,255,0.08)]'
                          : 'border-white/[0.04] bg-black/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {depositMethod === 'card' && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#1e60ff] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}

                      {/* Credit card icon */}
                      <svg className={`w-5 h-5 ${depositMethod === 'card' ? 'text-[#1e60ff]' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M2 10h20" />
                      </svg>

                      <div className="space-y-0.5 select-none">
                        <span className="text-[10.5px] font-black text-white block">Card Payment</span>
                        <span className="text-[8.5px] text-[#5e5e6c] block">Instant</span>
                        <span className="text-[8px] font-bold text-red-400 block mt-1 uppercase">Higher Fees</span>
                      </div>
                    </button>

                    {/* Cryptocurrency Button */}
                    <button
                      onClick={() => {
                        setDepositMethod('crypto');
                        triggerToast("Switched payment destination to Crypto Networks");
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 transition-all relative focus:outline-none cursor-pointer ${
                        depositMethod === 'crypto'
                          ? 'border-[#1e60ff] bg-[#1e60ff]/5 shadow-[0_4px_20px_rgba(30,96,255,0.08)]'
                          : 'border-white/[0.04] bg-black/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {depositMethod === 'crypto' && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#1e60ff] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}

                      {/* Crypto coins layout */}
                      <div className="flex items-center gap-0.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-[8.5px] font-black">₿</span>
                        <span className="w-4.5 h-4.5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-[8.5px] font-black">Ξ</span>
                        <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[7.5px] font-black">₮</span>
                      </div>

                      <div className="space-y-0.5 select-none">
                        <span className="text-[10.5px] font-black text-white block">Cryptocurrency</span>
                        <span className="text-[8.5px] text-[#5e5e6c] block">Instant</span>
                        <span className="text-[8px] font-bold text-emerald-400 block mt-1 uppercase">Low Fees</span>
                      </div>
                    </button>

                  </div>

                </div>

                {/* STEP 2 Box */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-5.5 text-left space-y-4">
                  
                  <div className="flex items-center gap-2.5">
                    <span className="w-5.5 h-5.5 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-black">
                      2
                    </span>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Enter Deposit Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Amount Input Labeled */}
                    <div className="space-y-1.5 relative">
                      <label className="text-[9px] font-black text-[#5e5e6b] uppercase tracking-wider">Amount</label>
                      
                      <div className="relative">
                        <input
                          type="text"
                          value={amountStr}
                          onChange={handleAmountChange}
                          className="w-full bg-black/60 border border-white/[0.08] hover:border-white/15 focus:border-[#1e60ff] focus:ring-1 focus:ring-[#1e60ff] text-white font-extrabold text-lg rounded-xl pl-4 pr-24 py-3 outline-none transition-all font-mono"
                        />
                        
                        {/* Selected Currency dropdown badge */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <button
                            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            className="bg-black/85 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-lg text-[10px] font-black text-white flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{selectedCurrency === 'USD' ? '🇺🇸' : selectedCurrency === 'EUR' ? '🇪🇺' : '🇬🇧'}</span>
                            <span className="font-mono">{selectedCurrency}</span>
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                          </button>

                          {/* Currency dropdown items */}
                          {isCurrencyDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-24 bg-[#07070a] border border-white/10 rounded-lg shadow-2xl z-20 overflow-hidden">
                              {[
                                { val: 'USD', flag: '🇺🇸' },
                                { val: 'EUR', flag: '🇪🇺' },
                                { val: 'GBP', flag: '🇬🇧' }
                              ].map((c) => (
                                <button
                                  key={c.val}
                                  onClick={() => {
                                    setSelectedCurrency(c.val as any);
                                    setIsCurrencyDropdownOpen(false);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-white/5 text-[10px] text-white font-bold font-mono flex items-center gap-2 cursor-pointer"
                                >
                                  <span>{c.flag}</span>
                                  <span>{c.val}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* receive value info statement */}
                      <p className="text-[10px] text-[#5e5e6b] leading-none mt-1">
                        You will receive (estimated) <span className="text-white font-bold font-mono">{getReceiveAmount()} {selectedCurrency}</span>
                      </p>
                    </div>

                    {/* Fast chips */}
                    <div className="flex items-center gap-2">
                      {quickAmounts.map((val) => {
                        const valNum = parseFloat(val);
                        const isCurrent = numericAmount === valNum;
                        return (
                          <button
                            key={val}
                            onClick={() => handleQuickAmountClick(val)}
                            className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#1e60ff] border-[#1e60ff] text-white shadow-[0_4px_12px_rgba(30,96,255,0.3)]'
                                : 'border-white/[0.04] bg-black/40 text-gray-400 hover:text-white hover:bg-white/[0.02]'
                            }`}
                          >
                            ${valNum.toLocaleString()}
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive 1% Promotion banner */}
                    <div className="bg-[#0b0c10] border border-[#1e60ff]/20 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                        {/* Beautiful Faceted Diamond */}
                        <svg className="w-4.5 h-4.5 text-[#1e60ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 3h12l4 6-10 12L2 9z" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 3L8 9l4 12 4-12-3-6" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 9h20" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-[10px] leading-relaxed text-[#7e7e8b]">
                        <span>Deposit </span>
                        <strong className="text-white font-semibold">$1,000</strong>
                        <span> or more and get a </span>
                        <strong className="text-emerald-400 font-semibold">1% bonus</strong>
                        <span> added to your account. </span>
                        <button 
                          onClick={() => triggerToast("Bonus is credited automatically after network settlement.")}
                          className="text-[#1e60ff] hover:text-blue-400 font-bold hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
                        >
                          Learn more <span className="text-[10px]">→</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* COLUMN 2: STEP 3 (REVIEW & CONFIRM) */}
              <div className="lg:col-span-3">
                
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-5.5 text-left h-full flex flex-col justify-between">
                  
                  <div className="space-y-5">
                    
                    <div className="flex items-center gap-2.5">
                      <span className="w-5.5 h-5.5 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-black">
                        3
                      </span>
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                        Review & Confirm
                      </h3>
                    </div>

                    {/* Summary row-by-row matching layout */}
                    <div className="space-y-4 text-xs font-semibold">
                      
                      <div className="flex justify-between items-center py-2.5 border-b border-white/[0.03]">
                        <span className="text-[#5e5e6c]">Deposit Method</span>
                        <span className="text-white font-bold">{getMethodLabel()}</span>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-white/[0.03]">
                        <span className="text-[#5e5e6c]">Depositing To</span>
                        <div className="text-right">
                          <span className="text-white block font-bold">Trading Account</span>
                          <span className="text-[9.5px] text-gray-500 font-mono block mt-0.5">MT5 - 1234567</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-white/[0.03]">
                        <span className="text-[#5e5e6c]">Amount</span>
                        <span className="text-white font-black font-mono">
                          {numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedCurrency}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-white/[0.03]">
                        <span className="text-[#5e5e6c]">Estimated Arrival</span>
                        <span className="text-white font-bold">{getEstimatedArrival()}</span>
                      </div>

                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-[#5e5e6c]">Fees</span>
                        <span className="text-white font-bold font-mono">{getFees()} {selectedCurrency}</span>
                      </div>

                    </div>

                  </div>

                  {/* Submission and legal footer */}
                  <div className="space-y-4 mt-6">
                    
                    <button
                      onClick={handleConfirmDeposit}
                      disabled={numericAmount <= 0}
                      className="w-full py-3.5 bg-[#1e60ff] hover:bg-blue-600 disabled:bg-white/[0.02] disabled:text-gray-600 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl transition-all shadow-[0_4px_24px_rgba(30,96,255,0.25)] flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <Lock className="w-3.5 h-3.5 text-blue-200" />
                      <span>Confirm Deposit</span>
                    </button>

                    <p className="text-[9.5px] text-[#5e5e6c] leading-relaxed text-center select-none">
                      By proceeding, you agree to our <span className="text-gray-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-gray-400 hover:underline cursor-pointer">Privacy Policy</span>.
                    </p>

                  </div>

                </div>

              </div>

              {/* COLUMN 3: DEPOSIT WITH CRYPTOCURRENCY WIDGET */}
              <div className="lg:col-span-4">
                
                <div className="rounded-2xl border border-white/[0.06] bg-[#07070a] p-5.5 text-left h-full flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                        Deposit with Cryptocurrency
                      </h3>
                      <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Instant funding
                      </span>
                    </div>

                    {/* Cryptocurrency dropdown selector */}
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-black text-[#5e5e6b] uppercase tracking-wider block">
                        Select Cryptocurrency
                      </label>

                      <button
                        onClick={() => setIsCryptoDropdownOpen(!isCryptoDropdownOpen)}
                        className="w-full bg-black/40 border border-white/[0.08] hover:border-white/15 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {selectedCrypto === 'USDT' ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-black">T</span>
                          ) : selectedCrypto === 'BTC' ? (
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[9px] font-black">₿</span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[9px] font-black">Ξ</span>
                          )}
                          <span className="font-sans font-bold">{selectedCrypto === 'USDT' ? 'USDT' : selectedCrypto === 'BTC' ? 'BTC' : 'ETH'}</span>
                          <span className="text-[10px] text-gray-500 font-semibold">
                            {selectedCrypto === 'USDT' ? 'Tether (TRC20)' : selectedCrypto === 'BTC' ? 'Bitcoin' : 'Ethereum (ERC20)'}
                          </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </button>

                      {isCryptoDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-[#09090c] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                          {[
                            { code: 'USDT', desc: 'Tether (TRC20)', symbol: 'T', color: 'text-emerald-400 bg-emerald-500/10' },
                            { code: 'BTC', desc: 'Bitcoin', symbol: '₿', color: 'text-amber-500 bg-amber-500/10' },
                            { code: 'ETH', desc: 'Ethereum (ERC20)', symbol: 'Ξ', color: 'text-blue-400 bg-blue-500/10' }
                          ].map((coin) => (
                            <button
                              key={coin.code}
                              onClick={() => {
                                setSelectedCrypto(coin.code as any);
                                setIsCryptoDropdownOpen(false);
                                triggerToast(`Switched deposit asset to ${coin.code}`);
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-white/5 text-xs text-white font-bold flex items-center gap-2.5 cursor-pointer"
                            >
                              <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-black ${coin.color}`}>
                                {coin.symbol}
                              </span>
                              <span>{coin.code}</span>
                              <span className="text-gray-500 text-[10px] font-normal">{coin.desc}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* High-Fidelity Vector QR Code with Vertex V Branding Overlay */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#5e5e6b] uppercase tracking-wider block">
                        Deposit Address ({selectedCrypto === 'USDT' ? 'TRC20' : selectedCrypto === 'BTC' ? 'Bitcoin' : 'ERC20'})
                      </label>

                      <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="p-3 bg-white rounded-lg relative overflow-hidden select-none shadow-[0_4px_24px_rgba(255,255,255,0.05)]">
                          
                          {/* Beautiful QR Code Matrix */}
                          <svg className="w-28 h-28 text-black" viewBox="0 0 100 100" fill="currentColor">
                            {/* Standard QR squares and corner markers */}
                            <rect x="0" y="0" width="22" height="22" />
                            <rect x="2" y="2" width="18" height="18" fill="white" />
                            <rect x="6" y="6" width="10" height="10" />

                            <rect x="78" y="0" width="22" height="22" />
                            <rect x="80" y="2" width="18" height="18" fill="white" />
                            <rect x="84" y="6" width="10" height="10" />

                            <rect x="0" y="78" width="22" height="22" />
                            <rect x="2" y="80" width="18" height="18" fill="white" />
                            <rect x="6" y="84" width="10" height="10" />

                            {/* Center Logo Overlay V shape */}
                            <rect x="36" y="36" width="28" height="28" fill="white" rx="4" />
                            {/* SVG Chevron 'V' Vertex Logo */}
                            <path d="M42 42 L50 58 L58 42" stroke="#000" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M46 42 L50 50 L54 42" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />

                            {/* Simulated matrix data dots */}
                            <rect x="28" y="4" width="4" height="4" />
                            <rect x="36" y="10" width="8" height="4" />
                            <rect x="50" y="4" width="4" height="8" />
                            <rect x="62" y="12" width="8" height="4" />

                            <rect x="4" y="28" width="4" height="4" />
                            <rect x="12" y="36" width="8" height="4" />
                            <rect x="28" y="28" width="12" height="4" />
                            
                            <rect x="70" y="28" width="4" height="12" />
                            <rect x="88" y="36" width="8" height="4" />
                            <rect x="78" y="48" width="12" height="4" />

                            <rect x="28" y="70" width="4" height="4" />
                            <rect x="36" y="78" width="12" height="4" />
                            <rect x="54" y="86" width="4" height="10" />

                            <rect x="70" y="70" width="6" height="6" />
                            <rect x="82" y="78" width="10" height="4" />
                            <rect x="88" y="86" width="6" height="6" />
                          </svg>

                        </div>
                      </div>

                    </div>

                    {/* Hash Copy Box */}
                    <div className="relative">
                      <div className="w-full bg-black/60 border border-white/[0.08] hover:border-white/15 rounded-xl pl-4 pr-12 py-3 text-xs text-gray-300 font-mono flex items-center justify-between select-none">
                        <span className="truncate pr-4 font-bold tracking-wide">
                          {cryptoAddresses[selectedCrypto].slice(0, 4)}...{cryptoAddresses[selectedCrypto].slice(-5)}
                        </span>
                        <button
                          onClick={handleCopyAddress}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none shrink-0"
                          title="Copy Address"
                        >
                          {copiedText ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Orange warning caution box */}
                    <div className="bg-amber-500/[0.03] border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                      <p className="text-[9.5px] text-amber-200/80 leading-normal">
                        Send only <strong className="text-white">{selectedCrypto}</strong> to this address via <strong className="text-white">{selectedCrypto === 'USDT' ? 'TRC20' : selectedCrypto === 'BTC' ? 'Bitcoin' : 'ERC20'}</strong> network. Sending other assets may result in permanent loss.
                      </p>
                    </div>

                  </div>

                  {/* bottom metadata */}
                  <div className="space-y-2 pt-2.5 border-t border-white/[0.03] text-[10px] font-mono">
                    <div className="flex justify-between items-center text-[#5e5e6c]">
                      <span>Minimum Deposit</span>
                      <span className="text-white font-bold">10.00 {selectedCrypto}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#5e5e6c]">
                      <span>Confirmations</span>
                      <span className="text-white font-bold">12 Network Confirmations</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* LICENSING FOOTER LOGOS (Matches screenshot footer) */}
          <footer className="pt-6 border-t border-white/[0.05] space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* security label */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h5 className="text-[11px] font-black text-white uppercase tracking-wider">Your funds are secure with Vertex</h5>
                  <p className="text-[9px] text-[#5e5e6b] mt-0.5">We use industry-leading security protocols to protect your assets.</p>
                </div>
              </div>

              {/* regulatory badges list */}
              <div className="md:col-span-5 flex flex-wrap items-center gap-x-6 gap-y-3 justify-start md:justify-center">
                
                {/* Badge 1 FCA */}
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold">
                  <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/10 text-white font-mono font-black rounded uppercase">FCA</span>
                  <span className="text-[#5e5e6b]">Regulated</span>
                </div>

                {/* Badge 2 ASIC */}
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold">
                  <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/10 text-white font-mono font-black rounded uppercase">ASIC</span>
                  <span className="text-[#5e5e6b]">Regulated</span>
                </div>

                {/* Badge 3 CySEC */}
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold">
                  <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/10 text-white font-mono font-black rounded uppercase">CySEC</span>
                  <span className="text-[#5e5e6b]">Regulated</span>
                </div>

                {/* Badge 4 FSCA */}
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold">
                  <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/10 text-white font-mono font-black rounded uppercase">FSCA</span>
                  <span className="text-[#5e5e6b]">Regulated</span>
                </div>

                {/* Badge 5 DFSA */}
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold">
                  <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/10 text-white font-mono font-black rounded uppercase">DFSA</span>
                  <span className="text-[#5e5e6b]">Regulated</span>
                </div>

              </div>

              {/* help block */}
              <div className="md:col-span-3 flex items-center gap-2.5 justify-start md:justify-end text-xs text-left">
                <Headphones className="w-4 h-4 text-gray-500 shrink-0" />
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">Need help?</span>
                  <span className="text-white hover:underline cursor-pointer block mt-0.5 text-[10.5px] font-bold">Visit our Help Center or contact support.</span>
                </div>
              </div>

            </div>

            {/* micro disclaimer */}
            <p className="text-[8.5px] text-gray-600 font-mono text-center pt-2">
              © 2026 Vertex Markets Global Ltd. Registered Office: 100 Bishopsgate, London EC2N 4AG. Financial instruments carry high risk.
            </p>

          </footer>

        </main>

      </div>

    </div>
  );
}
