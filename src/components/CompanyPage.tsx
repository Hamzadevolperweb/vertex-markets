import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import companyHqImg from '../assets/images/company_vunex_hq_1784520943215.jpg';
import { 
  Compass, 
  Target, 
  Gem, 
  Users, 
  Globe, 
  Cpu, 
  Shield, 
  Scale, 
  Award, 
  Briefcase, 
  ArrowRight, 
  X, 
  CheckCircle, 
  Activity, 
  Clock, 
  Lock, 
  AlertCircle,
  FileText,
  Mail,
  User,
  MapPin,
  TrendingUp,
  Server,
  Zap,
  Check
} from 'lucide-react';

interface CompanyPageProps {
  onGetStartedClick: () => void;
}

// Interactive item details for the modal
type ActiveTab = 
  | 'story' 
  | 'mission' 
  | 'values' 
  | 'leadership' 
  | 'presence' 
  | 'technology' 
  | 'security' 
  | 'compliance' 
  | 'awards' 
  | 'careers' 
  | null;

export default function CompanyPage({ onGetStartedClick }: CompanyPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  
  // Custom job application form states
  const [appliedJob, setAppliedJob] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantResume, setApplicantResume] = useState('Senior_Trader_CV.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Security Simulator states
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditResults, setAuditResults] = useState<string[]>([]);

  // Selected city state for Global Presence Map
  const [selectedCity, setSelectedCity] = useState<'NY' | 'LDN' | 'TOK' | 'SGP' | 'DXB'>('LDN');

  const startSecurityAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditResults([]);
    
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setAuditResults([
            'SSL Encryption: SECURE (TLS 1.3 Active)',
            'Session Integrity: VERIFIED (Device fingerprints matched)',
            'API Gateway: SECURE (JWT Authorization enabled)',
            'Client Fund Isolation: ENFORCED (Tier-1 Custodian Bank holding)',
            'DDoS Defenses: SHIELD ACTIVE (Cloudflare enterprise node routed)'
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAppliedJob(null);
        setApplicantName('');
        setApplicantEmail('');
      }, 3000);
    }, 1500);
  };

  // Jobs list
  const jobs = [
    { id: 'dev', title: 'Senior Full-Stack Trading Systems Engineer', dept: 'Engineering', loc: 'London / Hybrid', pay: '£140k - £180k + equity' },
    { id: 'quant', title: 'Quantitative Risk Modeling Analyst', dept: 'Risk & Strategy', loc: 'New York / On-site', pay: '$160k - $210k + bonus' },
    { id: 'infra', title: 'Ultra-Low Latency Infrastructure Architect', dept: 'Operations', loc: 'Tokyo / Remote', pay: '¥14M - ¥18M' },
    { id: 'compliance', title: 'Global Regulatory Compliance Specialist', dept: 'Legal & Compliance', loc: 'Dubai / Hybrid', pay: 'AED 35,000 - 45,000/mo' },
  ];

  // Leadership Team
  const leaders = [
    { name: 'Dr. Evelyn Vance', role: 'Chief Executive Officer', bio: 'Former Head of High-Frequency Trading at Citadel, with 18+ years of experience engineering institutional market microstructures.', background: 'PhD in Mathematics, MIT.' },
    { name: 'Marcus K. Chen', role: 'Chief Technology Officer', bio: 'Pioneered low-latency matching engines at Tokyo Stock Exchange and holds multiple patents in real-time execution optimization.', background: 'MS in Computer Science, Stanford.' },
    { name: 'Amira Al-Mansoori', role: 'Head of Global Compliance', bio: 'Ex-Regulatory Regulator at Dubai Financial Services Authority (DFSA). Ensures Vunex maintains gold-standard licenses worldwide.', background: 'JD in International Law, Oxford.' },
    { name: 'Alexander Volkov', role: 'Chief Trading Strategist', bio: 'Designed proprietary quantitative trading desks for global hedge funds with over $4B AUM. Expert in risk parity mechanics.', background: 'BS in Quantitative Finance, Wharton.' },
  ];

  // Cities for the interactive map
  const cities = {
    NY: { name: 'New York Hub', latency: '6.4 ms', status: 'Operational', security: 'MIL-SPEC', speed: '99.999% uptime', desc: 'Direct fiber link to Equinix NY4 data center. Handles Western Hemisphere liquidity pipelines.' },
    LDN: { name: 'London Head Office', latency: '0.8 ms', status: 'Optimal', security: 'Tier-4 Guarded', speed: 'Execution under 1ms', desc: 'Global coordinating hub and corporate headquarters. Connected to LD4 colocation networks.' },
    TOK: { name: 'Tokyo Server Array', latency: '9.2 ms', status: 'Operational', security: 'Biometric Encrypted', speed: '99.98% uptime', desc: 'Asia-Pacific regional exchange connector. Colocated next to JPX matching clusters.' },
    SGP: { name: 'Singapore Gateway', latency: '12.1 ms', status: 'Operational', security: 'Multi-Sig Access', speed: 'High Speed Router', desc: 'Southeastern trade corridor router. Connects emerging liquid exchanges.' },
    DXB: { name: 'Dubai Liquidity Desk', latency: '15.4 ms', status: 'Operational', security: 'Sovereign Grade', speed: 'Liquidity Bridge', desc: 'Middle Eastern hub coordinating sovereign state-level institutional liquidity nodes.' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative" id="company-view">
      
      {/* 1. HERO HEADER SECTION */}
      <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
        
        {/* Left Hand side description */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
            <span className="text-xs font-mono tracking-wider uppercase text-brand-blue font-semibold">Vunex Headquarters</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Building The Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-indigo-400 to-cyan-400">
              Of Global Trading.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 font-sans font-light leading-relaxed max-w-xl">
            Innovation, integrity and technology powering your trading journey. We engineering high-performance ecosystems where speed, design, and reliable licensing converge.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={onGetStartedClick}
              className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group cursor-pointer"
            >
              About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setActiveTab('story')}
              className="px-6 py-3 border border-white/10 hover:border-brand-blue/40 bg-white/5 hover:bg-brand-blue/5 text-gray-300 hover:text-white rounded-lg font-medium text-sm transition-all cursor-pointer"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Right Hand side: Premium Office HQ Image */}
        <div className="lg:col-span-6 flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[540px] aspect-[1.4] relative rounded-2xl p-[1.5px] bg-gradient-to-r from-brand-blue via-white/40 to-[#00f0ff] overflow-hidden shadow-2xl group"
          >
            <div className="w-full h-full rounded-2xl bg-[#030303] overflow-hidden relative flex items-center justify-center">
              {/* Ambient backlight glow effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/15 via-transparent to-[#00f0ff]/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-brand-blue/5 blur-[90px] pointer-events-none" />

              <img
                src={companyHqImg}
                alt="Vunex Corporate Headquarters"
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

      {/* 2. FIRST GRID OF INTERACTIVE CARDS (5 CARDS) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        
        {/* CARD 1: Our Story */}
        <motion.div 
          onClick={() => setActiveTab('story')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-story"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/10 group-hover:bg-brand-blue/20 group-hover:border-brand-blue/30 transition-all">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Our Story</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Discover our journey from founding to pioneering trade tech.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-blue mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Explore Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 2: Mission & Vision */}
        <motion.div 
          onClick={() => setActiveTab('mission')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-mission"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Mission & Vision</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Learn about our core purposes and strategic future map.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Our Blueprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 3: Core Values */}
        <motion.div 
          onClick={() => setActiveTab('values')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-values"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Core Values</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Our pillars of integrity, transparency, and innovation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Read Pledges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 4: Leadership */}
        <motion.div 
          onClick={() => setActiveTab('leadership')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-leaders"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Leadership</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Meet our world-class executive team and visionaries.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Meet Directors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 5: Global Presence */}
        <motion.div 
          onClick={() => setActiveTab('presence')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-presence"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-all">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Global Presence</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Connecting global nodes for institutional speed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

      </div>

      {/* 3. MIDDLE STATS STRIP (MATCHES THE IMAGE PERFECTLY) */}
      <div className="bg-[#07070a]/90 border-y border-white/[0.05] py-8 px-4 grid grid-cols-2 md:grid-cols-5 gap-y-6 md:gap-y-0 text-center mb-12 rounded-xl">
        <div className="border-r border-white/[0.05] last:border-0">
          <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider">2019</div>
          <div className="font-sans text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Founded</div>
        </div>
        <div className="border-r border-white/[0.05] md:last:border-0 last:border-0">
          <div className="font-display text-2xl sm:text-3xl font-bold text-brand-blue tracking-wider">150+</div>
          <div className="font-sans text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Countries</div>
        </div>
        <div className="border-r border-white/[0.05] last:border-0">
          <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider">1M+</div>
          <div className="font-sans text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Traders</div>
        </div>
        <div className="border-r border-white/[0.05] md:last:border-0 last:border-0">
          <div className="font-display text-2xl sm:text-3xl font-bold text-indigo-400 tracking-wider">24/5</div>
          <div className="font-sans text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Support</div>
        </div>
        <div>
          <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider">1000+</div>
          <div className="font-sans text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Instruments</div>
        </div>
      </div>

      {/* 4. SECOND GRID OF INTERACTIVE CARDS (5 CARDS) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
        
        {/* CARD 6: Technology */}
        <motion.div 
          onClick={() => setActiveTab('technology')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-tech"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Technology</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Matching engines running under 1ms with smart routing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-orange-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Learn Hardware</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 7: Security */}
        <motion.div 
          onClick={() => setActiveTab('security')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-security"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/10 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Security</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Bank-level encryption, multi-sig vaults & cold storage.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-red-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Audit System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 8: Compliance */}
        <motion.div 
          onClick={() => setActiveTab('compliance')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-compliance"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Compliance</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Strict regulatory standards across major global boards.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>License Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 9: Awards */}
        <motion.div 
          onClick={() => setActiveTab('awards')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-awards"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/10 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Awards</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Global recognition for best-in-class broker service.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-yellow-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Trophy Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* CARD 10: Careers */}
        <motion.div 
          onClick={() => setActiveTab('careers')}
          whileHover={{ y: -6, borderColor: 'rgba(30, 96, 255, 0.35)' }}
          className="bg-brand-card hover:bg-brand-card/95 border border-brand-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between"
          id="card-careers"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/10 group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-all">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-lg text-white">Careers</h3>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-relaxed">
                Join Vertex Markets and scale next-generation trading code.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-400 mt-4 font-mono font-medium group-hover:translate-x-1 transition-transform">
            <span>Job Openings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

      </div>

      {/* 5. FOOTER BANNER (SHAPE THE FUTURE OF TRADING + STUNNING HOLOGRAPHIC PEDESTAL) */}
      <div className="relative bg-gradient-to-r from-[#0a0a0f] via-[#050811] to-[#040406] border border-white/[0.05] rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        {/* Abstract light grid overlays inside the banner */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_120%,rgba(30,96,255,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-blue/5 to-transparent pointer-events-none" />

        <div className="space-y-4 max-w-xl text-left z-10 relative">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Shape the Future of Trading
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed font-light">
            Join Vertex Markets and build your career with a global leader. We are looking for innovators, coders, risk models, and disruptors.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setActiveTab('careers')}
              className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 flex items-center gap-2 group cursor-pointer"
            >
              Explore Careers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3D Holographic Pedestal with Silhouettes standing in columns of light */}
        <div className="relative w-[300px] h-[180px] flex items-center justify-center z-10">
          <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Ambient glows */}
            <ellipse cx="150" cy="140" rx="90" ry="25" fill="#1e3a8a" fillOpacity="0.3" filter="url(#hq-glow)" />
            <ellipse cx="150" cy="140" rx="60" ry="16" fill="#00f0ff" fillOpacity="0.15" filter="url(#hq-glow)" />

            {/* Glowing Base Platform */}
            <ellipse cx="150" cy="140" rx="80" ry="22" fill="#050814" stroke="#00f0ff" strokeWidth="1.8" filter="url(#hq-glow)" />
            <ellipse cx="150" cy="140" rx="72" ry="19" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" />
            <ellipse cx="150" cy="140" rx="55" ry="14" fill="none" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3,6" />

            {/* Vertical Laser Beams */}
            {/* Center beam */}
            <line x1="150" y1="140" x2="150" y2="20" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.4" />
            <polygon points="144,140 156,140 151,20 149,20" fill="url(#neon-cyan)" fillOpacity="0.08" />
            {/* Left beam */}
            <line x1="110" y1="135" x2="110" y2="35" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
            <polygon points="106,135 114,135 111,35 109,35" fill="#3b82f6" fillOpacity="0.06" />
            {/* Right beam */}
            <line x1="190" y1="135" x2="190" y2="35" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
            <polygon points="186,135 194,135 191,35 189,35" fill="#3b82f6" fillOpacity="0.06" />

            {/* Silhouettes standing in light */}
            {/* Center Figure (Detailed SVG silhouette of a professional) */}
            <g opacity="0.85" transform="translate(136, 40)">
              {/* Head */}
              <circle cx="14" cy="12" r="3.5" fill="#00f0ff" filter="url(#hq-glow)" />
              {/* Suit shoulders */}
              <path d="M 6 22 C 6 17, 22 17, 22 22 L 22 68 L 6 68 Z" fill="#0c1d3a" stroke="#00f0ff" strokeWidth="1" filter="url(#hq-glow)" />
              <path d="M 14 15.5 L 14 28" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              {/* Tie */}
              <polygon points="13.5,23 14.5,23 15,35 14,37 13,35" fill="#00f0ff" />
              {/* Inner glowing details */}
              <line x1="8" y1="35" x2="8" y2="60" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="20" y1="35" x2="20" y2="60" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.3" />
            </g>

            {/* Left Figure */}
            <g opacity="0.55" transform="translate(98, 48)">
              <circle cx="12" cy="11" r="3" fill="#3b82f6" />
              <path d="M 5 20 C 5 16, 19 16, 19 20 L 19 58 L 5 58 Z" fill="#08142c" stroke="#3b82f6" strokeWidth="0.8" />
              <line x1="12" y1="14" x2="12" y2="24" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
            </g>

            {/* Right Figure */}
            <g opacity="0.55" transform="translate(178, 48)">
              <circle cx="12" cy="11" r="3" fill="#3b82f6" />
              <path d="M 5 20 C 5 16, 19 16, 19 20 L 19 58 L 5 58 Z" fill="#08142c" stroke="#3b82f6" strokeWidth="0.8" />
              <line x1="12" y1="14" x2="12" y2="24" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
            </g>

            {/* Glowing Floor Nodes */}
            <circle cx="150" cy="140" r="2.5" fill="#ffffff" filter="url(#hq-glow)" />
            <circle cx="110" cy="135" r="1.5" fill="#00f0ff" />
            <circle cx="190" cy="135" r="1.5" fill="#00f0ff" />
          </svg>
        </div>
      </div>

      {/* 6. TRUSTED REGULATORY BAR AT THE BOTTOM */}
      <div className="border-t border-white/[0.05] pt-8 pb-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 hover:opacity-85 transition-opacity">
          
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg text-white tracking-tighter">FCA</span>
            <div className="text-[9px] font-sans text-left leading-none text-gray-400 border-l border-white/20 pl-2">
              Financial<br />Conduct Authority<br /><span className="font-mono opacity-60">Ref: 982131</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col text-right leading-none">
              <span className="font-display font-bold text-xs text-white">ASIC</span>
              <span className="text-[7px] text-gray-500 font-mono">ACN 629 181 292</span>
            </div>
            <div className="text-[9px] font-sans text-left leading-none text-gray-400 border-l border-white/20 pl-2">
              Australian Securities &<br />Investments Commission
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-white tracking-wide">FSCA</span>
            <div className="text-[9px] font-sans text-left leading-none text-gray-400 border-l border-white/20 pl-2">
              Financial Sector<br />Conduct Authority<br /><span className="font-mono opacity-60">FSP: 51928</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xs text-white uppercase">CySEC</span>
            <div className="text-[9px] font-sans text-left leading-none text-gray-400 border-l border-white/20 pl-2">
              Cyprus Securities &<br />Exchange Commission
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-white tracking-widest">DFSA</span>
            <div className="text-[9px] font-sans text-left leading-none text-gray-400 border-l border-white/20 pl-2">
              Dubai Financial<br />Services Authority
            </div>
          </div>

        </div>
        <div className="font-mono text-[10px] tracking-widest text-gray-500 uppercase mt-8">
          Trusted. Regulated. Secure.
        </div>
      </div>

      {/* ============================================================== */}
      {/* ==================== INTERACTIVE DETAIL MODAL ================ */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activeTab && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/80 backdrop-blur-md"
            id="modal-backdrop"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#09090f] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl relative"
              id="company-detail-modal"
            >
              
              {/* Modal Top Header Bar */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                  {activeTab === 'story' && <Compass className="w-5 h-5 text-brand-blue" />}
                  {activeTab === 'mission' && <Target className="w-5 h-5 text-indigo-400" />}
                  {activeTab === 'values' && <Gem className="w-5 h-5 text-emerald-400" />}
                  {activeTab === 'leadership' && <Users className="w-5 h-5 text-purple-400" />}
                  {activeTab === 'presence' && <Globe className="w-5 h-5 text-cyan-400" />}
                  {activeTab === 'technology' && <Cpu className="w-5 h-5 text-orange-400" />}
                  {activeTab === 'security' && <Shield className="w-5 h-5 text-red-400" />}
                  {activeTab === 'compliance' && <Scale className="w-5 h-5 text-blue-400" />}
                  {activeTab === 'awards' && <Award className="w-5 h-5 text-yellow-400" />}
                  {activeTab === 'careers' && <Briefcase className="w-5 h-5 text-teal-400" />}

                  <h2 className="font-display font-bold text-xl text-white">
                    {activeTab === 'story' && 'Our Corporate Story'}
                    {activeTab === 'mission' && 'Mission, Vision & Strategy'}
                    {activeTab === 'values' && 'Vertex Pillars & Values'}
                    {activeTab === 'leadership' && 'Executive Board of Directors'}
                    {activeTab === 'presence' && 'Interactive Hub Map'}
                    {activeTab === 'technology' && 'Low-Latency Liquidity Hardware'}
                    {activeTab === 'security' && 'Cybersecurity Center & Sandbox'}
                    {activeTab === 'compliance' && 'Global Regulatory Credentials'}
                    {activeTab === 'awards' && 'Industry Recognitions'}
                    {activeTab === 'careers' && 'Current Career Positions'}
                  </h2>
                </div>

                <button 
                  onClick={() => {
                    setActiveTab(null);
                    setAppliedJob(null);
                  }}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  id="btn-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Core Contents - Scrollable */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* 1. OUR STORY TIMELINE */}
                {activeTab === 'story' && (
                  <div className="space-y-6">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Founded in 2019 by quantitative coders and high-frequency traders, Vertex Markets was designed with a single objective: to dismantle the barrier between retail traders and institutional-grade pricing. Here is our growth timeline:
                    </p>
                    
                    <div className="border-l border-brand-blue/30 ml-3 pl-6 space-y-6 relative">
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#030303] border-2 border-brand-blue flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                        </span>
                        <div className="font-display font-bold text-sm text-brand-blue">2019 — Inception & Foundation</div>
                        <p className="text-xs text-gray-400 mt-1">
                          Vertex Markets is bootstrapped in London. Built the first custom liquidity aggregator designed to pull spreads from 15+ top tier banks concurrently.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#030303] border-2 border-indigo-400 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        </span>
                        <div className="font-display font-bold text-sm text-indigo-300">2021 — Regulatory & Platform Milestones</div>
                        <p className="text-xs text-gray-400 mt-1">
                          Secured the FCA and ASIC licenses. Released our flagship low-latency HTML5 Web Trader Terminal. Active user count exceeded 100,000 global accounts.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#030303] border-2 border-emerald-400 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        </span>
                        <div className="font-display font-bold text-sm text-emerald-300">2023 — AI Trading Integrations</div>
                        <p className="text-xs text-gray-400 mt-1">
                          Pioneered real-time server-side pattern recognition triggers. Partnered with institutional liquidity nodes in New York (Equinix NY4) to slash execution times under 5ms.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#030303] border-2 border-cyan-400 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        </span>
                        <div className="font-display font-bold text-sm text-cyan-300">2025 — Sovereign Desk & Global HQ</div>
                        <p className="text-xs text-gray-400 mt-1">
                          Launched specialized Dubai desk catering to Middle Eastern liquidity desks. Achieved 1M+ active traders. Erected Vunex high-rise corporate center in central London.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MISSION & VISION STATEMENT */}
                {activeTab === 'mission' && (
                  <div className="space-y-6">
                    <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-5">
                      <h4 className="font-display font-semibold text-white text-base flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span>
                        Our Global Mission
                      </h4>
                      <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                        To construct the most responsive, secure, and visually advanced digital trading hub. We exist to align the tools used by individual retail traders with the low-latency infrastructure utilized by multi-billion dollar quantitative firms.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl space-y-2">
                        <div className="font-display font-bold text-xs uppercase tracking-wider text-indigo-400">The 2026 Vision</div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Expanding direct execution colocation arrays into 12 additional financial exchange hubs, while launching autonomous risk shielding protocols to safeguard user balances dynamically.
                        </p>
                      </div>
                      <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl space-y-2">
                        <div className="font-display font-bold text-xs uppercase tracking-wider text-emerald-400">The Core Directive</div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Zero compromise on speed, absolute transparency in order routing metrics, and continuous compliance with Tier-1 regulatory organizations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CORE VALUES */}
                {activeTab === 'values' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      Our actions are guided by four unshakeable corporate tenets, verified by regular third-party compliance boards:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#0c0c14] border border-white/[0.03] rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-brand-blue">
                          <CheckCircle className="w-4 h-4" />
                          <h4 className="font-display font-medium text-white text-sm">Absolute Transparency</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          We publish real-time execution speeds and average slippage percentages. No hidden fees, no synthetic markup spreads.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c0c14] border border-white/[0.03] rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Zap className="w-4 h-4" />
                          <h4 className="font-display font-medium text-white text-sm">Technological Craftsmanship</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          We believe terminal interfaces should be beautiful. Every chart, indicator line, and modal is custom-tailored for maximum sensory response.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c0c14] border border-white/[0.03] rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Lock className="w-4 h-4" />
                          <h4 className="font-display font-medium text-white text-sm">Uncompromising Trust</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          We isolate client assets in Tier-1 custody vaults. Vertex cannot touch, leverage, or borrow against user deposits under any market conditions.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c0c14] border border-white/[0.03] rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Globe className="w-4 h-4" />
                          <h4 className="font-display font-medium text-white text-sm">Global Equal Access</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Every user, whether trading $10 or $10,000,000, receives the exact same low-latency routing pipe and access to depth metrics.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. LEADERSHIP CARDS */}
                {activeTab === 'leadership' && (
                  <div className="space-y-6">
                    <p className="text-gray-300 text-sm">
                      Our board unites experts in quantitative physics, cryptographic security, and international finance to oversee the integrity of Vertex Markets operations:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {leaders.map((leader, idx) => (
                        <div key={idx} className="p-5 bg-[#090912] border border-white/5 rounded-xl flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-display font-bold text-white text-sm">{leader.name}</h4>
                                <div className="text-xs font-mono text-brand-blue">{leader.role}</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center font-mono text-xs font-bold text-brand-blue">
                                {idx + 1}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed pt-1">
                              {leader.bio}
                            </p>
                          </div>
                          <div className="font-mono text-[10px] text-gray-500 mt-4 border-t border-white/[0.05] pt-2">
                            Credentials: {leader.background}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. INTERACTIVE MAP HUB DETAILS */}
                {activeTab === 'presence' && (
                  <div className="space-y-6">
                    <p className="text-gray-300 text-sm">
                      Select a regional financial hub to test communication latency and view connection metrics directly:
                    </p>

                    {/* Regional Map selection buttons */}
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(cities) as Array<keyof typeof cities>).map((key) => (
                        <button
                          key={key}
                          onClick={() => setSelectedCity(key)}
                          className={`px-4 py-2 rounded-lg font-mono text-xs transition-all flex items-center gap-2 cursor-pointer ${
                            selectedCity === key 
                              ? 'bg-brand-blue text-white shadow-lg' 
                              : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {key} Hub
                        </button>
                      ))}
                    </div>

                    {/* Selected Hub Details Panel */}
                    <div className="bg-[#0b0c16] border border-brand-blue/15 rounded-xl p-6 grid md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 text-center md:text-left space-y-2">
                        <div className="text-xs font-mono tracking-widest text-brand-blue uppercase">Selected Hub</div>
                        <h4 className="font-display font-bold text-white text-lg">{cities[selectedCity].name}</h4>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          {cities[selectedCity].status}
                        </div>
                      </div>

                      <div className="md:col-span-8 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-left">
                          <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase">Average Latency</div>
                            <div className="font-mono text-base font-bold text-white">{cities[selectedCity].latency}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase">Uptime Performance</div>
                            <div className="font-mono text-base font-bold text-indigo-300">{cities[selectedCity].speed}</div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed pt-2 border-t border-white/[0.05]">
                          {cities[selectedCity].desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TECHNOLOGY & HARDWARE SPECS */}
                {activeTab === 'technology' && (
                  <div className="space-y-6">
                    <p className="text-gray-300 text-sm">
                      Our proprietary execution router operates across physical fiber-optic cables colocated in Tier-1 data suites. Here is our architectural specification:
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#0e0e16] border border-white/5 rounded-xl text-center space-y-2">
                        <Server className="w-6 h-6 text-orange-400 mx-auto" />
                        <h4 className="font-display font-bold text-sm text-white">Equinix Colocation</h4>
                        <p className="text-xs text-gray-400">
                          Match servers placed inside NY4, LD4, and TY3 centers adjacent to global liquidity engines.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0e0e16] border border-white/5 rounded-xl text-center space-y-2">
                        <Zap className="w-6 h-6 text-yellow-400 mx-auto" />
                        <h4 className="font-display font-bold text-sm text-white">Sub-1ms Execution</h4>
                        <p className="text-xs text-gray-400">
                          Average trade execution speeds of 0.8ms, preventing order lag and slip during volatile releases.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0e0e16] border border-white/5 rounded-xl text-center space-y-2">
                        <Activity className="w-6 h-6 text-cyan-400 mx-auto" />
                        <h4 className="font-display font-bold text-sm text-white">Smart Order Routing</h4>
                        <p className="text-xs text-gray-400">
                          Algorithmic routing divides order pieces dynamically to locate optimal entry points from 22 banks.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. CYBERSECURITY CENTER & SANDBOX AUDIT */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <p className="text-gray-300 text-sm">
                      We protect your capital and private identity with military-grade protocols. You can run an instant diagnostic verification to audit our secure tunnel connection below:
                    </p>

                    <div className="bg-[#0b0c12] border border-red-500/15 rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Lock className="w-6 h-6 text-red-400" />
                          <div>
                            <h4 className="font-display font-bold text-sm text-white">System Cryptographic Audit</h4>
                            <p className="text-xs text-gray-400">Test session signatures, API keys and fund segregation.</p>
                          </div>
                        </div>

                        <button
                          onClick={startSecurityAudit}
                          disabled={isAuditing}
                          className="px-4 py-2 bg-red-500 hover:bg-red-500/90 disabled:bg-white/10 disabled:text-gray-500 text-white font-mono text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          {isAuditing ? 'Auditing...' : 'Run Audit Diagnostics'}
                        </button>
                      </div>

                      {/* Audit Progress Bar */}
                      {isAuditing && (
                        <div className="space-y-2 animate-pulse">
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-red-500 h-1.5 transition-all duration-300" style={{ width: `${auditProgress}%` }}></div>
                          </div>
                          <div className="flex justify-between font-mono text-[10px] text-gray-500">
                            <span>Verifying security logs...</span>
                            <span>{auditProgress}%</span>
                          </div>
                        </div>
                      )}

                      {/* Audit Results */}
                      {auditResults.length > 0 && (
                        <div className="mt-4 p-4 bg-[#030303] border border-white/5 rounded-lg space-y-2">
                          <div className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            DIAGNOSTICS PASSED: ALL SHIELDS OPTIMAL
                          </div>
                          <ul className="space-y-1 ml-4 border-l border-white/10 pl-4 font-mono text-[11px] text-gray-400">
                            {auditResults.map((res, i) => (
                              <li key={i}>{res}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 8. COMPLIANCE JURISDICTIONS */}
                {activeTab === 'compliance' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      Vertex Markets is authorized and strictly monitored by major global financial jurisdictions. Our corporate entities, license registry strings, and segregated accounts details are listed below:
                    </p>

                    <div className="space-y-3">
                      <div className="p-4 bg-[#0a0c14] border border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">United Kingdom — Financial Conduct Authority (FCA)</h4>
                          <p className="text-xs text-gray-500">Vertex Global Markets UK Limited — Authorized for Retail and Professional brokerage operations.</p>
                        </div>
                        <div className="font-mono text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
                          Ref: 982131
                        </div>
                      </div>

                      <div className="p-4 bg-[#0a0c14] border border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">Australia — Australian Securities & Investments Commission (ASIC)</h4>
                          <p className="text-xs text-gray-500">Vertex APAC Pty Ltd — Licensed to trade OTC derivative contracts and currencies.</p>
                        </div>
                        <div className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                          ACN: 629181292
                        </div>
                      </div>

                      <div className="p-4 bg-[#0a0c14] border border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">South Africa — Financial Sector Conduct Authority (FSCA)</h4>
                          <p className="text-xs text-gray-500">Vertex Africa Markets (Pty) Ltd — Registered Financial Services Provider.</p>
                        </div>
                        <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          FSP: 51928
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. TROPHY SHELF (AWARDS) */}
                {activeTab === 'awards' && (
                  <div className="space-y-6">
                    <p className="text-gray-300 text-sm">
                      Our commitment to engineering excellence has earned multiple prestigious accolades at global fintech and financial congress awards:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#100e16] border border-yellow-500/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">Best Web Trading Platform</h4>
                          <p className="text-xs text-gray-500">Global FinTech Awards 2025</p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#100e16] border border-yellow-500/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">Best execution Engine Speed</h4>
                          <p className="text-xs text-gray-500">London Forex Congress 2024</p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#100e16] border border-yellow-500/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">Most Secure Retail Broker</h4>
                          <p className="text-xs text-gray-500">CyberFinance Shield Summit 2024</p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#100e16] border border-yellow-500/10 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">Best Global Support Team</h4>
                          <p className="text-xs text-gray-500">Middle East Investors Guild 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. CAREERS LIST & SUBMISSION FORM */}
                {activeTab === 'careers' && (
                  <div className="space-y-6">
                    {appliedJob ? (
                      // Interactive job application form inside modal
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <button
                          onClick={() => setAppliedJob(null)}
                          className="text-xs font-mono text-gray-500 hover:text-white flex items-center gap-1.5 cursor-pointer"
                        >
                          ← Back to Positions
                        </button>
                        
                        <div className="bg-[#0b0c16] border border-brand-blue/15 p-5 rounded-xl space-y-2">
                          <div className="text-[10px] font-mono text-brand-blue uppercase">Applying for Position</div>
                          <h4 className="font-display font-bold text-white text-base">
                            {jobs.find(j => j.id === appliedJob)?.title}
                          </h4>
                          <div className="text-xs text-gray-400">
                            {jobs.find(j => j.id === appliedJob)?.dept} • {jobs.find(j => j.id === appliedJob)?.loc}
                          </div>
                        </div>

                        {isSuccess ? (
                          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-center rounded-xl space-y-2">
                            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                            <h4 className="font-display font-bold text-white text-sm">Application Transmitted Securely!</h4>
                            <p className="text-xs text-gray-400">Our HR quantitative team will evaluate your profile and contact you within 48 hours.</p>
                          </div>
                        ) : (
                          <form onSubmit={handleJobSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-mono text-gray-400 flex items-center gap-1">
                                  <User className="w-3 h-3 text-brand-blue" />
                                  Your Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={applicantName}
                                  onChange={e => setApplicantName(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                                  placeholder="Jane Doe"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-mono text-gray-400 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-brand-blue" />
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={applicantEmail}
                                  onChange={e => setApplicantEmail(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                                  placeholder="jane.doe@example.com"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-mono text-gray-400 flex items-center gap-1">
                                <FileText className="w-3 h-3 text-brand-blue" />
                                Resume / CV Upload
                              </label>
                              <div className="border border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:bg-white/[0.02] transition-colors relative">
                                <input
                                  type="file"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                      setApplicantResume(e.target.files[0].name);
                                    }
                                  }}
                                />
                                <div className="text-xs font-mono text-gray-400">
                                  Drag & drop files or click to select resume
                                </div>
                                <div className="text-xs text-brand-blue font-bold mt-2 font-mono">
                                  File: {applicantResume}
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-white/10 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-brand-blue/20 cursor-pointer"
                            >
                              {isSubmitting ? 'Transmitting credentials...' : 'Submit Secure Application'}
                            </button>
                          </form>
                        )}
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          Vertex Markets is expanding. We are currently recruiting talented software specialists, quant analysts, and compliance directors across our regional offices:
                        </p>

                        <div className="space-y-3">
                          {jobs.map((job) => (
                            <div key={job.id} className="p-4 bg-[#0a0a14] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1 text-left">
                                <h4 className="font-display font-bold text-white text-sm">{job.title}</h4>
                                <div className="text-xs text-gray-400">
                                  Dept: <span className="text-gray-300 font-mono">{job.dept}</span> | Loc: <span className="text-gray-300 font-mono">{job.loc}</span>
                                </div>
                                <div className="text-[11px] text-brand-blue font-mono">{job.pay}</div>
                              </div>

                              <button
                                onClick={() => setAppliedJob(job.id)}
                                className="px-4 py-2 bg-white/5 hover:bg-brand-blue hover:text-white border border-white/10 hover:border-brand-blue text-xs font-mono font-bold text-gray-300 rounded-lg transition-all cursor-pointer"
                              >
                                Apply Now
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#030308] border-t border-white/[0.05] text-center">
                <span className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">
                  VERTEX MARKETS GLOBAL SECURITY GATEWAY
                </span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
