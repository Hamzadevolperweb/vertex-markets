import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Globe, 
  ChevronDown, 
  Shield, 
  Terminal, 
  BarChart3, 
  Activity, 
  Users, 
  Check, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../assets/images/cutouts/logo_official.png';
import shieldImg from '../assets/images/cutouts/shield.png';

interface AdminLoginProps {
  onBackToHome: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onBackToHome, onLoginSuccess }: AdminLoginProps) {
  // Input fields state
  const [email, setEmail] = useState('admin@vunexmarket.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // App state
  const [language, setLanguage] = useState<'English' | 'Spanish' | 'German'>('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Hologram active tab or values
  const [serverLoad, setServerLoad] = useState(38);
  const [cpuUsage, setCpuUsage] = useState(24);
  const [activeSessions, setActiveSessions] = useState(128);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Live data simulation for holographic monitors
  useEffect(() => {
    const timer = setInterval(() => {
      setServerLoad(prev => Math.max(30, Math.min(50, prev + Math.floor(Math.random() * 5) - 2)));
      setCpuUsage(prev => Math.max(15, Math.min(35, prev + Math.floor(Math.random() * 7) - 3)));
      if (Math.random() > 0.8) {
        setActiveSessions(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast('Please fill in all security fields.');
      return;
    }
    
    setIsLoading(true);
    triggerToast('Authenticating with Vunex secure vaults...');
    
    setTimeout(() => {
      setIsLoading(false);
      triggerToast('Access granted! Loading administrator dashboard.');
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f6] font-sans flex flex-col justify-between relative overflow-hidden select-none selection:bg-[#1e60ff]/30 selection:text-white" id="admin-login-root">
      
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1e60ff]/5 blur-[120px] pointer-events-none" />
      
      {/* Dynamic Toast alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.8)] z-[100] flex items-center gap-3 backdrop-blur-md bg-[#09090c]/95 min-w-[320px] text-xs font-semibold text-white"
          >
            <ShieldCheck className="w-4.5 h-4.5 text-[#1e60ff]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER BAR */}
      <header className="w-full px-6 lg:px-10 xl:px-14 pt-6 flex items-center justify-between z-20" id="admin-header">
        {/* Brand Logo - Styled strictly like VUNEX MARKET */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <img 
              src={logoImg} 
              alt="VUNEX MARKET" 
              className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(30,96,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(30,96,255,0.5)] transition-all"
            />
          </button>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-black/40 hover:bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-lg text-xs font-bold text-gray-300 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>{language}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 mt-1.5 w-36 bg-[#09090c] border border-white/10 rounded-lg shadow-2xl p-1 z-50 text-left"
              >
                {(['English', 'Spanish', 'German'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                      triggerToast(`Language switched to ${lang}`);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-md transition-colors ${
                      language === lang ? 'bg-[#1e60ff]/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* MAIN DUAL ROW GRID */}
      <main className="w-full px-6 lg:px-10 xl:px-14 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 flex-grow" id="admin-main-grid">
        
        {/* LEFT COLUMN: Holographic Dashboards & Features (occupies 7 columns) */}
        <section className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left order-2 lg:order-1" id="admin-left-col">
          
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.25em] font-extrabold text-[#1e60ff] uppercase block">
              Secure Admin Access
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              Manage Smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e60ff] via-[#3380ff] to-[#00c8ff]">
                Control Vunex.
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              Access the VUNEX MARKET administration console with secure authentication, real-time monitoring, and full platform control.
            </p>
          </div>

          {/* HOLOGRAM PREVIEW CONTAINER - Code-rendered 3D holographic workspace */}
          <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center select-none" id="hologram-stage">
            
            {/* Base Pedestal Platform */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[220px] sm:w-[280px] h-[30px] rounded-full bg-[#1e60ff]/10 border-b-2 border-[#1e60ff]/40 shadow-[0_15px_40px_rgba(30,96,255,0.3)] transform rotateX(60deg) scale-y-50 flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
              <div className="absolute inset-4 rounded-full border border-blue-400/30" />
            </div>

            {/* Central 3D Shield Hero Image */}
            <div className="absolute z-20 flex flex-col items-center justify-center transform -translate-y-4">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <div className="absolute inset-[-20%] rounded-full bg-[#1e60ff]/8 blur-[40px]" />
                <div className="absolute inset-[-10%] rounded-full border border-[#1e60ff]/15" />
                <div className="absolute inset-0 rounded-full border border-dashed border-[#00c8ff]/20" />
                <img 
                  src={shieldImg} 
                  alt="Security Shield" 
                  className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_0_40px_rgba(30,96,255,0.4)]"
                  draggable={false}
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-[#1e60ff]/20 blur-md" />
              </div>
            </div>

            {/* FLOATING HOLOGRAM CARD 1: SYSTEM OVERVIEW (Top Left) */}
            <div className="absolute top-2 left-2 sm:left-6 w-[170px] bg-[#07070a]/90 border border-white/[0.05] rounded-xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-[#1e60ff]/30 transition-colors z-10">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-1.5 mb-2">
                <span className="text-[8px] font-black tracking-wider text-[#1e60ff] uppercase">System Overview</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                {/* Mini Radial Gauge */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/[0.03]" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#1e60ff]" strokeDasharray="97, 100" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-[7px] font-black text-white">97%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] text-gray-500 font-bold uppercase leading-none">Global Health</span>
                  <span className="text-[10px] text-emerald-400 font-black tracking-tight leading-none mt-1">Excellent</span>
                </div>
              </div>
              <div className="space-y-1 text-[8px] text-gray-400 font-semibold">
                <div className="flex justify-between">
                  <span>CPU Usage</span>
                  <span className="text-white">{cpuUsage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage</span>
                  <span className="text-white">49%</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Load</span>
                  <span className="text-white">{serverLoad}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Latency</span>
                  <span className="text-cyan-400">12ms</span>
                </div>
              </div>
            </div>

            {/* FLOATING HOLOGRAM CARD 2: MARKET ACTIVITY (Top Right) */}
            <div className="absolute top-2 right-2 sm:right-6 w-[150px] bg-[#07070a]/90 border border-white/[0.05] rounded-xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-[#1e60ff]/30 transition-colors z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black tracking-wider text-gray-400 uppercase">Market Activity</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[6px] font-black uppercase flex items-center gap-1">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                  Live
                </span>
              </div>
              <div className="h-10 w-full flex items-end gap-1 mb-1 border-b border-white/[0.04]">
                {/* Interactive Neon Sparkline bars */}
                {[30, 45, 35, 60, 50, 75, 65, 80, 70, 95].map((val, idx) => (
                  <div 
                    key={idx} 
                    className="flex-grow bg-[#1e60ff]/40 rounded-sm hover:bg-[#00c8ff] transition-all"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[7.5px] font-bold text-gray-500 mt-1">
                <span>EURUSD</span>
                <span className="text-emerald-400 font-black">+0.47%</span>
              </div>
            </div>

            {/* FLOATING HOLOGRAM CARD 3: USER SESSIONS (Bottom Left) */}
            <div className="absolute bottom-2 left-2 sm:left-10 w-[140px] bg-[#07070a]/90 border border-white/[0.05] rounded-xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-[#1e60ff]/30 transition-colors z-10 text-left">
              <span className="text-[7.5px] font-black tracking-wider text-gray-500 uppercase block mb-1">User Sessions</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white tracking-tight">{activeSessions}</span>
                <span className="text-[7px] text-emerald-400 font-black uppercase tracking-widest">Active</span>
              </div>
              {/* Miniature column stack indicator */}
              <div className="flex gap-1 mt-2">
                {[6, 4, 8, 5, 9, 7].map((h, i) => (
                  <div key={i} className="w-full bg-white/[0.04] h-6 rounded-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-[#00c8ff]/70" style={{ height: `${h * 10}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* FLOATING HOLOGRAM CARD 4: LOGIN ATTEMPTS (Bottom Right) */}
            <div className="absolute bottom-2 right-2 sm:right-10 w-[140px] bg-[#07070a]/90 border border-white/[0.05] rounded-xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-[#1e60ff]/30 transition-colors z-10">
              <span className="text-[7.5px] font-black tracking-wider text-gray-500 uppercase block mb-1">Login Attempts</span>
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="#dc2626" strokeWidth="3" opacity="0.15" />
                    <circle cx="16" cy="16" r="14" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="80 100" />
                  </svg>
                  <span className="absolute text-[7px] font-black text-white">98%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-emerald-400 font-black leading-none">98.3% Success</span>
                  <span className="text-[8px] text-rose-400 font-black leading-none mt-1">1.7% Failed</span>
                </div>
              </div>
            </div>

          </div>

          {/* LOWER FEATURES GRID: 3 rows matching the bottom section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="admin-benefits-grid">
            
            {/* Box 1 */}
            <div className="p-4 bg-[#07070a]/60 border border-white/[0.04] hover:border-white/[0.08] rounded-xl text-left space-y-1.5 transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] mb-2.5">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Multi-Layer Security</h3>
              <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                Advanced encryption, 2FA, and threat protection.
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-4 bg-[#07070a]/60 border border-white/[0.04] hover:border-white/[0.08] rounded-xl text-left space-y-1.5 transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] mb-2.5">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Live System Monitoring</h3>
              <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                Real-time insights and alerts across all critical systems.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-4 bg-[#07070a]/60 border border-white/[0.04] hover:border-white/[0.08] rounded-xl text-left space-y-1.5 transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] mb-2.5">
                <Users className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Role-Based Access</h3>
              <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                Granular permissions and secure admin controls.
              </p>
            </div>

          </div>

          {/* Compliance & Audit bullet list */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-gray-500 font-bold pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              <span>Bank-grade security</span>
            </div>
            <span className="text-gray-700">•</span>
            <span>Full audit trail</span>
            <span className="text-gray-700">•</span>
            <span>24/7 monitoring</span>
          </div>

        </section>

        {/* RIGHT COLUMN: Glassmorphism Admin Login Form Card (occupies 5 columns) */}
        <section className="lg:col-span-5 flex justify-center order-1 lg:order-2" id="admin-right-col">
          
          <div className="w-full max-w-md bg-[#07070a]/75 border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden" id="login-glass-card">
            
            {/* Top right subtle glow line */}
            <div className="absolute top-0 right-0 w-[40%] h-[2px] bg-gradient-to-l from-[#1e60ff]/40 to-transparent pointer-events-none" />
            
            <div className="text-left mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight" id="login-card-title">Admin Login</h2>
              <p className="text-[11px] text-gray-500 font-semibold mt-1">
                Sign in to access the VUNEX MARKET control center.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#030303]/80 border border-white/[0.08] focus:border-[#1e60ff] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-white placeholder-gray-600 transition-all focus:shadow-[0_0_12px_rgba(30,96,255,0.15)]"
                    placeholder="admin@vunexmarket.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#030303]/80 border border-white/[0.08] focus:border-[#1e60ff] focus:outline-none rounded-xl py-3 pl-11 pr-11 text-xs font-medium text-white placeholder-gray-600 transition-all focus:shadow-[0_0_12px_rgba(30,96,255,0.15)]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">2FA Code</label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </span>
                  <input 
                    type="text" 
                    maxLength={6}
                    pattern="[0-9]*"
                    value={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#030303]/80 border border-white/[0.08] focus:border-[#1e60ff] focus:outline-none rounded-xl py-3 pl-11 pr-11 text-xs font-medium text-white placeholder-gray-600 tracking-widest font-mono transition-all focus:shadow-[0_0_12px_rgba(30,96,255,0.15)]"
                    placeholder="Enter 6-digit code"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 cursor-help" title="2-Step Authenticator App code">
                    <Info className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Checkbox and Forgot password */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-gray-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/10 bg-black text-[#1e60ff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => triggerToast('Reset request sent to corporate admin vaults.')}
                  className="text-[#1e60ff] hover:underline cursor-pointer focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              {/* Solid Blue Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#1e60ff] hover:bg-[#1e60ff]/90 active:scale-[0.99] text-white text-[12.5px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(30,96,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 fill-white text-transparent" />
                    <span>Sign In Securely</span>
                  </>
                )}
              </button>

              {/* Divider lines */}
              <div className="flex items-center justify-center gap-3 pt-1 text-gray-600">
                <div className="h-[1px] bg-white/[0.04] flex-grow" />
                <span className="text-[10px] uppercase font-black tracking-widest text-gray-600 select-none">or</span>
                <div className="h-[1px] bg-white/[0.04] flex-grow" />
              </div>

              {/* Go to Main Website Link */}
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-3 border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-gray-300 hover:text-white text-[12px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Go to Main Website</span>
              </button>

            </form>

            {/* Bottom Admin Monitoring notice */}
            <div className="mt-5 p-3 rounded-xl bg-[#1e60ff]/5 border border-[#1e60ff]/10 flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-[#1e60ff] shrink-0 mt-0.5" />
              <div className="flex flex-col text-[10px] text-gray-400 font-semibold leading-relaxed">
                <span className="text-white">Authorized administrators only.</span>
                <span>All connection metadata and query activities are monitored and logged.</span>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* FOOTER BAR */}
      <footer className="w-full px-6 lg:px-10 xl:px-14 py-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 z-20 text-[10.5px] text-gray-500 font-bold" id="admin-footer">
        <div>
          <span>© 2026 VUNEX MARKET. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => triggerToast('Privacy Policy accessed')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
          <span className="text-gray-800">|</span>
          <button onClick={() => triggerToast('Terms of Service accessed')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</button>
          <span className="text-gray-800">|</span>
          <button onClick={() => triggerToast('Contact corporate desk at +1 (800) VUNEX-MKT')} className="hover:text-white transition-colors cursor-pointer">Support</button>
        </div>
      </footer>

    </div>
  );
}
