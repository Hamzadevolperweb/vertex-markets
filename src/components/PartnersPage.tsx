import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import partnerHeroImg from '../assets/images/partner_handshake_clean_1784520453831.jpg';
import { 
  Users, 
  Layers, 
  Building, 
  Cpu, 
  HelpCircle, 
  TrendingUp, 
  Calculator, 
  Trophy, 
  Percent, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Sparkles,
  Shield,
  Zap,
  Clock,
  Briefcase
} from 'lucide-react';

interface PartnersPageProps {
  onGetStartedClick: () => void;
}

export default function PartnersPage({ onGetStartedClick }: PartnersPageProps) {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  
  // Calculator States
  const [clients, setClients] = useState(25);
  const [volume, setVolume] = useState(15); // in Million USD
  const [commissionTier, setCommissionTier] = useState<'standard' | 'premium' | 'vip'>('premium');

  // Multipliers based on tier
  const tierRates = {
    standard: 12, // $12 per Million
    premium: 18,  // $18 per Million
    vip: 25       // $25 per Million
  };

  const estimatedMonthlyCommission = clients * volume * tierRates[commissionTier];

  const programs = [
    {
      id: 'ib',
      title: 'Introducing Broker',
      subtitle: 'Earn for every client you refer',
      description: 'Our tier-one IB program provides industry-leading rebates, advanced tracking links, and real-time dashboard analytics to scale your operations.',
      features: [
        'Up to $25 per million traded volume by referred clients',
        'Multi-tier sub-IB commission hierarchy support',
        'Daily automated payouts directly to your trading wallet',
        'Dedicated bilingual Account Manager & marketing portal'
      ],
      iconBg: 'from-cyan-500/10 to-blue-500/5',
      accentColor: '#00f0ff',
      // High-fidelity custom 3D SVG icon
      svgIcon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ib-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#ib-glow)" />
          {/* Cubic digital network nodes */}
          <rect x="22" y="22" width="20" height="20" rx="3" stroke="#00f0ff" strokeWidth="2" fill="#030712" fillOpacity="0.9" />
          <path d="M 12 32 L 22 32 M 42 32 L 52 32 M 32 12 L 32 22 M 32 42 L 32 52" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="32" r="3" fill="#ffffff" stroke="#00f0ff" strokeWidth="1" />
          <circle cx="52" cy="32" r="3" fill="#ffffff" stroke="#00f0ff" strokeWidth="1" />
          <circle cx="32" cy="12" r="3" fill="#ffffff" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="32" cy="52" r="3" fill="#ffffff" stroke="#3b82f6" strokeWidth="1" />
          {/* Inner details */}
          <path d="M 28 29 L 32 25 L 36 29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 32 25 L 32 37" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="37" r="1.5" fill="#00f0ff" />
        </svg>
      )
    },
    {
      id: 'affiliate',
      title: 'Affiliate Program',
      subtitle: 'Promote and earn high commissions',
      description: 'Ideal for financial publishers, social media influencers, and system educators. Gain access to premium visual assets, landing pages, and optimized funnels.',
      features: [
        'Generous CPA structures (up to $1,000 per qualified account)',
        '30-day tracking cookie lifetime with professional attribution',
        'High conversion rates on customized digital landing pages',
        'Comprehensive marketing library: HTML banners, widgets, and videos'
      ],
      iconBg: 'from-indigo-500/10 to-purple-500/5',
      accentColor: '#3b82f6',
      svgIcon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="aff-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#aff-glow)" />
          {/* Floating Orbiting Rings */}
          <ellipse cx="32" cy="32" rx="18" ry="6" stroke="#3b82f6" strokeWidth="1.5" transform="rotate(-30 32 32)" strokeDasharray="4,2" />
          <ellipse cx="32" cy="32" rx="18" ry="6" stroke="#00f0ff" strokeWidth="1" transform="rotate(30 32 32)" />
          {/* Central metallic sphere */}
          <circle cx="32" cy="32" r="8" fill="#090d16" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="2" fill="#00f0ff" />
          {/* Small orbital nodes */}
          <circle cx="18" cy="24" r="3" fill="#ffffff" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="46" cy="40" r="3.5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: 'institutional',
      title: 'Institutional Partners',
      subtitle: 'Tailored solutions for institutions',
      description: 'Our enterprise gateway for hedge funds, asset managers, and family offices looking to establish prime brokerage relations, custom liquidity pools, and white label solutions.',
      features: [
        'Direct Market Access (DMA) to Tier-1 institutional liquidity pools',
        'Deep order books with tight execution spreads under 0.1 pips',
        'Support for custom API integrations (FIX 4.4 protocol)',
        'Robust multi-currency clearing and security collateral storage'
      ],
      iconBg: 'from-amber-500/10 to-orange-500/5',
      accentColor: '#f59e0b',
      svgIcon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="inst-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#inst-glow)" />
          {/* Greek / Roman temple of institutional finance */}
          <path d="M 16 46 L 48 46 M 18 42 L 46 42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="22" y="24" width="4" height="18" rx="1" fill="#030712" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="30" y="24" width="4" height="18" rx="1" fill="#030712" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="38" y="24" width="4" height="18" rx="1" fill="#030712" stroke="#ffffff" strokeWidth="1.5" />
          <polygon points="16,24 32,14 48,24" fill="#030712" stroke="#f59e0b" strokeWidth="2" />
          <line x1="20" y1="46" x2="44" y2="46" stroke="#ffffff" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: 'liquidity',
      title: 'Liquidity Providers',
      subtitle: 'Deep liquidity, better execution',
      description: 'Plug directly into the Vunex aggregated liquidity hub. Minimize slippage, access premium visual depth, and offer unmatched trading speeds to your core audience.',
      features: [
        'Aggregated price feeds from 15+ top tier global banks',
        'Sub-millisecond trade execution speed via Equinix LD4 fiber',
        'Symmetric order fill pipelines for high-frequency algorithmic setups',
        'Custom depth-of-market options tailored to active brokers'
      ],
      iconBg: 'from-blue-500/10 to-cyan-500/5',
      accentColor: '#3b82f6',
      svgIcon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="liq-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#liq-glow)" />
          {/* Two merging drops / flowing dynamic gears */}
          <path d="M 32 16 C 32 16 44 26 44 34 C 44 40.6 38.6 46 32 46 C 25.4 46 20 40.6 20 34 C 20 26 32 16 32 16 Z" fill="#030712" stroke="#3b82f6" strokeWidth="2.5" fillOpacity="0.8" />
          <path d="M 32 24 C 32 24 39 31 39 36 C 39 39.8 35.8 42 32 42 C 28.2 42 25 39.8 25 36 C 25 31 32 24 32 24 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
          {/* Liquid sparkles */}
          <circle cx="48" cy="24" r="1.5" fill="#ffffff" />
          <circle cx="16" cy="40" r="2" fill="#00f0ff" />
        </svg>
      )
    },
    {
      id: 'technology',
      title: 'Technology Partners',
      subtitle: 'Innovate. Integrate. Succeed.',
      description: 'Collaborate with Vunex to offer advanced automated trading scripts, algorithmic custom alerts, trading bridge solutions, and analytical plug-ins.',
      features: [
        'Seamless API and SDK protocols with standard developer sandboxes',
        'Co-marketing and joint branding opportunities to global retail lists',
        'Listing in our Vunex Marketplace for trading systems and indicators',
        'Direct integration with MetaTrader, cTrader, and TradingView'
      ],
      iconBg: 'from-emerald-500/10 to-teal-500/5',
      accentColor: '#10b981',
      svgIcon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="tech-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#tech-glow)" />
          {/* Cybernetic microchip & gears */}
          <rect x="20" y="20" width="24" height="24" rx="4" fill="#030712" stroke="#10b981" strokeWidth="2" />
          <line x1="26" y1="14" x2="26" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="14" x2="32" y2="20" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="14" x2="38" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="44" x2="26" y2="50" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="44" x2="32" y2="50" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="44" x2="38" y2="50" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="26" x2="20" y2="26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="32" x2="20" y2="32" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="38" x2="20" y2="38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="26" x2="50" y2="26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="32" x2="50" y2="32" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="38" x2="50" y2="38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="4" fill="#10b981" />
        </svg>
      )
    },
    {
      id: 'white-label',
      title: 'White Label Solution',
      subtitle: 'Launch your own brand',
      description: 'Get a full turnkey, production-ready trading setup brand branded with your identity. Focus entirely on client sales and marketing while we power the back-end.',
      features: [
        'Fully customizable trading interfaces & mobile web platform skins',
        'Included multi-asset CRM system and risk monitoring dashboard',
        'Pre-integrated multi-channel deposit and withdrawal processors',
        '24/7 technical operations, client helpdesk and server hosting'
      ],
      iconBg: 'from-violet-500/10 to-fuchsia-500/5',
      accentColor: '#8b5cf6',
      svgIcon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="wl-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#wl-glow)" />
          {/* Glassy dimensional isometric block stacks */}
          <path d="M 32 14 L 46 22 L 32 30 L 18 22 Z" fill="#030712" stroke="#8b5cf6" strokeWidth="1.5" fillOpacity="0.9" />
          <path d="M 18 22 L 18 36 L 32 44 L 32 30 Z" fill="#030712" stroke="#ffffff" strokeWidth="1" fillOpacity="0.8" />
          <path d="M 32 30 L 32 44 L 46 36 L 46 22 Z" fill="#030712" stroke="#8b5cf6" strokeWidth="1.5" fillOpacity="0.8" />
          <circle cx="32" cy="22" r="3" fill="#00f0ff" />
        </svg>
      )
    }
  ];

  const secondaryCards = [
    {
      title: 'Commission Plans',
      subtitle: 'Competitive & flexible',
      id: 'plans',
      icon: <Percent className="w-5 h-5 text-brand-blue" />,
      detailTitle: 'Flexible Rebate & CPA Structures',
      detailDesc: 'Select either classic Volume-Based rebates (earn up to $25 per million traded) or fixed CPA (earn up to $1,000 for each first-time depositor). We can also construct hybrid plans customized specifically to your client model.',
      badge: 'Flexible'
    },
    {
      title: 'Revenue Calculator',
      subtitle: 'Calculate your earnings',
      id: 'calculator',
      icon: <Calculator className="w-5 h-5 text-cyan-400" />,
      detailTitle: 'Dynamic Partner Revenue Estimator',
      detailDesc: 'Use our real-time interactive widget below to project potential monthly commissions based on your referred client count, estimated average trade volumes, and rebate tier levels.',
      badge: 'Interactive'
    },
    {
      title: 'Partner Levels',
      subtitle: 'Grow with higher tiers',
      id: 'levels',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      detailTitle: 'VIP Loyalty Growth Tiers',
      detailDesc: 'Advance through our four tier partner levels (Silver, Gold, Platinum, VIP) to unlock higher revenue splits, longer cookie windows, bespoke landing design setups, and direct executive sponsorship.',
      badge: '4 Tiers'
    },
    {
      title: 'Success Stories',
      subtitle: 'Real partners. Real results',
      id: 'stories',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      detailTitle: 'Partner Case Studies & Testimonials',
      detailDesc: 'Read success stories of system integrators, regional marketing educators, and digital affiliates who scaled their operations from localized startup groups to multi-million global brokerages under the Vunex umbrella.',
      badge: 'Verified'
    },
    {
      title: 'Partner FAQ',
      subtitle: 'Everything to know',
      id: 'faq',
      icon: <HelpCircle className="w-5 h-5 text-teal-400" />,
      detailTitle: 'Frequently Asked Questions',
      detailDesc: 'How are payouts processed? (Daily via Bank Transfer, crypto, or local wallet). Are there registration fees? (Never, signup is completely free). Can I refer friends? (Yes, you can register as an individual agent immediately).',
      badge: 'Help Desk'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030303] text-white overflow-hidden pb-16">
      
      {/* Absolute Decorative Grid Background matching the global theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

      {/* 1. HERO HEADER SECTION */}
      <div className="relative w-full px-6 lg:px-10 xl:px-14 pt-10 pb-12 lg:pt-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left z-10 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              <span className="text-xs font-mono tracking-wider uppercase text-brand-blue font-semibold">GLOBAL PARTNERSHIP</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            >
              Stronger Together.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-blue">Greater Opportunities.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 text-base sm:text-lg font-sans leading-relaxed max-w-md"
            >
              Partner with Vunex Market and grow your business with global reach.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={onGetStartedClick}
                className="font-sans font-semibold text-sm bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-blue hover:to-blue-500 text-white px-6 py-3.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 hover:-translate-y-0.5"
              >
                Become a Partner
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const calculatorEl = document.getElementById('calculator-section');
                  if (calculatorEl) {
                    calculatorEl.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCalculatorOpen(true);
                  }
                }}
                className="font-sans font-semibold text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] px-6 py-3.5 rounded-lg transition-all"
              >
                Explore Programs
              </button>
            </motion.div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-7 flex justify-center items-center relative w-full order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-[620px] aspect-[16/10] relative rounded-2xl p-[1.5px] bg-gradient-to-r from-brand-blue via-white/40 to-[#00f0ff] overflow-hidden shadow-2xl group"
            >
              <div className="w-full h-full rounded-2xl bg-[#030303] overflow-hidden relative flex items-center justify-center">
                {/* Ambient backlight glow effects */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/15 via-transparent to-[#00f0ff]/10 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-brand-blue/5 blur-[90px] pointer-events-none" />

                <img
                  src={partnerHeroImg}
                  alt="Vunex Partnership Program"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.015]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Glass Overlay blending perfectly with the dark theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/80 via-transparent to-[#030303]/10 opacity-90 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/35 via-transparent to-[#030303]/35 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 2. THE SIX MAIN PARTNER CARDS GRID */}
      <div className="w-full px-6 lg:px-10 xl:px-14 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Tailored Partner Programs
          </h2>
          <p className="text-gray-400 mt-3 font-sans text-base">
            Whether you are an individual introducing broker or a large institution, we have the infrastructure, licensing, and commercial terms to power your business model.
          </p>
        </div>

        {/* 6 Grid columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog, index) => {
            const isSelected = selectedProgram === prog.id;
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setSelectedProgram(isSelected ? null : prog.id)}
                className={`group relative rounded-2xl border transition-all duration-300 p-8 text-left cursor-pointer overflow-hidden ${
                  isSelected 
                    ? 'bg-slate-900/90 border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.15)] scale-[1.02]' 
                    : 'bg-[#060608]/80 border-white/[0.05] hover:border-white/10 hover:bg-[#0a0a0d] hover:shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 30px ${prog.accentColor}20` : undefined
                }}
              >
                {/* Visual Accent glow line in top left of card */}
                <div 
                  className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-transparent via-brand-blue to-transparent transition-transform duration-500 group-hover:scale-x-125"
                  style={{ backgroundImage: `linear-gradient(to right, transparent, ${prog.accentColor}, transparent)` }}
                />

                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Render detailed custom 3D SVG icon */}
                    <div className="mb-6 flex justify-start items-center">
                      {prog.svgIcon}
                    </div>

                    <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-blue transition-colors mb-2">
                      {prog.title}
                    </h3>
                    
                    <p className="font-sans text-xs tracking-wider text-brand-blue font-semibold uppercase mb-4 opacity-90">
                      {prog.subtitle}
                    </p>

                    <p className="text-gray-400 text-sm font-sans leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Features checklist revealed when expanded or on hover */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-6 mt-6 border-t border-white/5 space-y-3"
                        >
                          <h4 className="text-xs font-mono font-semibold tracking-wider text-white uppercase mb-1">
                            PROGRAM HIGHLIGHTS:
                          </h4>
                          {prog.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs text-gray-300">
                              <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                              <span className="font-sans">{feat}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 pt-4 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono text-[10px] tracking-widest uppercase">
                      {isSelected ? 'TAP TO COLLAPSE' : 'LEARN MORE'}
                    </span>
                    <span 
                      className="text-brand-blue group-hover:translate-x-1 transition-transform duration-300 font-bold"
                      style={{ color: prog.accentColor }}
                    >
                      {isSelected ? '↑' : '→'}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. THE FIVE SMALLER CARD GRID (Interactive detail widgets) */}
      <div className="w-full px-6 lg:px-10 xl:px-14 py-10 border-t border-white/[0.03]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {secondaryCards.map((card) => {
            const isCalcCard = card.id === 'calculator';
            return (
              <button
                key={card.id}
                id={`partner-card-${card.id}`}
                onClick={() => {
                  if (isCalcCard) {
                    setCalculatorOpen(true);
                    // Scroll down to calculator
                    setTimeout(() => {
                      const calcEl = document.getElementById('calculator-section');
                      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    setSelectedProgram(selectedProgram === card.id ? null : card.id);
                    // Open a details modal or show inline detail
                  }
                }}
                className={`p-5 rounded-xl border bg-[#050507]/90 text-left transition-all duration-300 relative overflow-hidden group focus:outline-none cursor-pointer ${
                  selectedProgram === card.id
                    ? 'border-brand-blue bg-[#0b0c10] shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    : 'border-white/[0.04] hover:border-white/10 hover:bg-[#08080b]'
                }`}
              >
                {/* Glow ring underlay */}
                <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-brand-blue/5 blur-md group-hover:bg-brand-blue/10 transition-all" />

                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] group-hover:border-white/10 transition-colors">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-brand-blue uppercase bg-brand-blue/5 border border-brand-blue/10 rounded-md px-2 py-0.5 ml-auto">
                    {card.badge}
                  </span>
                </div>

                <h4 className="font-display font-bold text-sm text-white mb-1 group-hover:text-brand-blue transition-colors">
                  {card.title}
                </h4>
                
                <p className="font-sans text-xs text-gray-400">
                  {card.subtitle}
                </p>

                {/* Expanded Inline Drawer info */}
                <AnimatePresence>
                  {selectedProgram === card.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 mt-4 border-t border-white/5 relative z-10"
                    >
                      <h5 className="text-[11px] font-mono font-bold text-white uppercase mb-2">
                        {card.detailTitle}
                      </h5>
                      <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                        {card.detailDesc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. INTERACTIVE REVENUE CALCULATOR WIDGET (Premium Functional Layer) */}
      <div id="calculator-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <AnimatePresence>
          {(calculatorOpen || selectedProgram === 'calculator') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative rounded-2xl border border-brand-blue/20 bg-[#06070a]/95 backdrop-blur-md p-8 sm:p-10 text-left overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.06)]"
            >
              {/* Corner close button */}
              <button 
                onClick={() => {
                  setCalculatorOpen(false);
                  if (selectedProgram === 'calculator') setSelectedProgram(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Calculator className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Revenue Projection Calculator</h3>
                  <p className="text-xs text-gray-400 font-sans">Simulate potential monthly earnings as a registered Vunex Partner.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Inputs */}
                <div className="space-y-6">
                  {/* Slider 1: Referred Clients */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-sans font-medium text-gray-300">Active Referred Clients</label>
                      <span className="font-mono text-base font-bold text-cyan-400">{clients} Traders</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="150" 
                      value={clients} 
                      onChange={(e) => setClients(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>1 Client</span>
                      <span>50</span>
                      <span>100</span>
                      <span>150+ Clients</span>
                    </div>
                  </div>

                  {/* Slider 2: Average Volume */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-sans font-medium text-gray-300">Avg. Monthly Volume Per Client</label>
                      <span className="font-mono text-base font-bold text-brand-blue">${volume} Million USD</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={volume} 
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>$1M</span>
                      <span>$15M</span>
                      <span>$30M</span>
                      <span>$50M+ Volume</span>
                    </div>
                  </div>

                  {/* Radio 3: Reward tier */}
                  <div className="space-y-2">
                    <label className="text-sm font-sans font-medium text-gray-300 block">Commission Rebate Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['standard', 'premium', 'vip'] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setCommissionTier(tier)}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider font-mono transition-all ${
                            commissionTier === tier
                              ? 'bg-brand-blue/15 border-brand-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                              : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          {tier} (${tierRates[tier]}/M)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Result Block */}
                <div className="rounded-xl bg-slate-950/90 border border-white/5 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden h-full min-h-[220px]">
                  {/* Decorative glowing back ring */}
                  <div className="absolute w-32 h-32 rounded-full bg-cyan-400/5 blur-xl pointer-events-none" />

                  <span className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-2">
                    ESTIMATED MONTHLY COMMISSION
                  </span>
                  
                  <motion.div 
                    key={estimatedMonthlyCommission}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2"
                  >
                    ${estimatedMonthlyCommission.toLocaleString()}
                  </motion.div>

                  <span className="text-xs text-brand-blue font-mono uppercase tracking-wider font-semibold mb-4 bg-brand-blue/5 border border-brand-blue/10 rounded-full px-3 py-1">
                    {commissionTier === 'vip' ? '🚀 Max Rebate Tier Active' : 'Level Up for higher splits'}
                  </span>

                  <p className="text-[10px] text-gray-500 font-sans leading-relaxed max-w-[280px]">
                    Estimates based on typical client trade patterns. Actual payouts vary according to products (FX, indices, commodities) and real traded lot ratios.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. BOTTOM CTA BANNER WITH HOLOGRAM CHANNELS PEDESTAL */}
      <div className="w-full px-6 lg:px-10 xl:px-14 py-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-white/[0.05] bg-[#050508]/90 overflow-hidden px-8 py-10 md:py-12 text-left"
        >
          {/* Subtle global gradient maps decoration inside card */}
          <div className="absolute inset-0 bg-radial-at-t from-brand-blue/5 via-transparent to-transparent opacity-60 pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Join Our Global Partner Network
              </h3>
              <p className="text-gray-400 font-sans text-sm sm:text-base max-w-lg leading-relaxed">
                Let's build success together. Partner with an institutional liquidity pool broker licensed across multiple jurisdictions.
              </p>

              <div className="pt-2">
                <button 
                  onClick={onGetStartedClick}
                  className="font-sans font-semibold text-sm bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
                >
                  Partner Registration
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Side Illustration: Detailed 3D Holographic Pedestal with Sleek Standing Avatar Silhouettes in Columns of Light */}
            <div className="lg:col-span-6 flex justify-center items-center relative w-full h-[180px] md:h-[220px]">
              <div className="w-full max-w-[420px] h-full relative flex items-center justify-center">
                
                {/* Embedded High-Fidelity Pedestal SVG */}
                <svg className="w-full h-full filter drop-shadow-[0_0_12px_rgba(0,240,255,0.1)]" viewBox="0 0 350 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="column-glow-left" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="column-glow-center" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="column-glow-right" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* 1. Bottom Metallic Platform layers (perspective ellipse) */}
                  <ellipse cx="175" cy="145" rx="110" ry="25" fill="#030712" fillOpacity="0.9" stroke="#3b82f6" strokeWidth="1.2" />
                  <ellipse cx="175" cy="142" rx="104" ry="22" fill="#090d16" stroke="#00f0ff" strokeWidth="1.5" />
                  <ellipse cx="175" cy="139" rx="90" ry="18" fill="#111827" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.5" />

                  {/* 2. Concentric internal glowing coordinate ring */}
                  <ellipse cx="175" cy="142" rx="60" ry="12" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 3. Glowing Pillars of Light (Beaming upwards) */}
                  
                  {/* Left Column (x=115, base-y=139) */}
                  <path d="M 105,30 L 125,30 L 125,138 L 105,138 Z" fill="url(#column-glow-left)" opacity="0.45" />
                  
                  {/* Center Column (x=175, base-y=140) */}
                  <path d="M 160,10 L 190,10 L 190,140 L 160,140 Z" fill="url(#column-glow-center)" opacity="0.6" />
                  
                  {/* Right Column (x=235, base-y=139) */}
                  <path d="M 225,30 L 245,30 L 245,138 L 225,138 Z" fill="url(#column-glow-right)" opacity="0.45" />

                  {/* Far Left and Far Right Smaller Columns */}
                  <path d="M 70,50 L 82,50 L 82,132 L 70,132 Z" fill="url(#column-glow-right)" opacity="0.25" />
                  <path d="M 268,50 L 280,50 L 280,132 L 268,132 Z" fill="url(#column-glow-left)" opacity="0.25" />

                  {/* 4. standing Silhouette Partners (sleek futuristic 3D representations) */}
                  
                  {/* Left Partner (x=115, y=95) */}
                  <g opacity="0.8">
                    {/* Head */}
                    <circle cx="115" cy="98" r="4.5" fill="#ffffff" />
                    {/* Torso */}
                    <path d="M 105,138 C 105,115 125,115 125,138 Z" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                  </g>

                  {/* Center Key Executive Partner (x=175, y=85) */}
                  <g filter="url(#glow-light)">
                    {/* Head */}
                    <circle cx="175" cy="90" r="6" fill="#ffffff" stroke="#00f0ff" strokeWidth="1" />
                    {/* Collar / suit details */}
                    <path d="M 160,140 C 160,110 190,110 190,140 Z" fill="#090d16" stroke="#ffffff" strokeWidth="1" />
                    <path d="M 170,110 L 175,118 L 180,110" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  </g>

                  {/* Right Partner (x=235, y=95) */}
                  <g opacity="0.8">
                    <circle cx="235" cy="98" r="4.5" fill="#ffffff" />
                    <path d="M 225,138 C 225,115 245,115 245,138 Z" fill="#00f0ff" stroke="#ffffff" strokeWidth="0.5" />
                  </g>

                  {/* Far Left Partner */}
                  <g opacity="0.5">
                    <circle cx="76" cy="106" r="3.5" fill="#ffffff" />
                    <path d="M 68,132 C 68,118 84,118 84,132 Z" fill="#3b82f6" />
                  </g>

                  {/* Far Right Partner */}
                  <g opacity="0.5">
                    <circle cx="274" cy="106" r="3.5" fill="#ffffff" />
                    <path d="M 266,132 C 266,118 282,118 282,132 Z" fill="#00f0ff" />
                  </g>

                  {/* Glowing platform coordinate dots */}
                  <circle cx="175" cy="139" r="2" fill="#ffffff" className="animate-ping" style={{ transformOrigin: '175px 139px', animationDuration: '2s' }} />
                  <circle cx="115" cy="138" r="1.5" fill="#00f0ff" />
                  <circle cx="235" cy="138" r="1.5" fill="#3b82f6" />
                </svg>

              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* 6. TRUSTED REGULATORY BAR AT THE BOTTOM (EXACTLY MATCHING IMAGE THEME) */}
      <div className="w-full px-6 lg:px-10 xl:px-14 py-10 border-t border-white/[0.04] mt-8 text-center">
        
        {/* Regulatory logos array */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-24 opacity-75 grayscale hover:grayscale-0 transition-all duration-500 py-6">
          
          {/* FCA */}
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-2xl tracking-tighter text-white">FCA</span>
            <span className="text-[7px] font-mono tracking-widest text-gray-500 uppercase mt-0.5">FINANCIAL CONDUCT AUTHORITY</span>
          </div>

          {/* ASIC */}
          <div className="flex items-center gap-1">
            <div className="relative w-7 h-7 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-md">
              <span className="font-display text-[9px] font-bold text-white">ASIC</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-sans font-bold text-xs tracking-wider text-white">ASIC</span>
              <span className="text-[6px] font-sans text-gray-500 leading-none">Australian Securities & Investments Commission</span>
            </div>
          </div>

          {/* FSCA */}
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div className="flex flex-col items-start text-left">
              <span className="font-display font-bold text-xs tracking-wider text-white">FSCA</span>
              <span className="text-[6px] font-sans text-gray-500 leading-none">Financial Sector Conduct Authority</span>
            </div>
          </div>

          {/* CySEC */}
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <div className="flex flex-col items-start text-left">
              <span className="font-sans font-black text-xs text-white">CySEC</span>
              <span className="text-[6px] font-sans text-gray-500 leading-none">Cyprus Securities & Exchange Commission</span>
            </div>
          </div>

          {/* DFSA */}
          <div className="flex items-center gap-1">
            <span className="font-serif text-sm font-semibold tracking-wider text-gray-400">DFSA</span>
            <div className="flex flex-col items-start text-left border-l border-white/10 pl-1.5">
              <span className="font-sans font-bold text-[10px] text-white">DFSA</span>
              <span className="text-[6px] font-sans text-gray-500 leading-none">Dubai Financial Services Authority</span>
            </div>
          </div>

        </div>

        <p className="text-gray-500 font-sans text-xs font-semibold tracking-wider uppercase mt-4">
          Trusted. Regulated. Secure.
        </p>
      </div>

    </div>
  );
}
