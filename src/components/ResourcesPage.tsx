import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Play, 
  Book, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Compass, 
  Shield, 
  ArrowRight, 
  Mail, 
  Download, 
  HelpCircle, 
  Layers, 
  Monitor,
  Sparkles,
  Search
} from 'lucide-react';

interface ResourcesPageProps {
  onGetStartedClick?: () => void;
}

export default function ResourcesPage({ onGetStartedClick }: ResourcesPageProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const resourceItems = [
    // Row 1
    {
      title: "Trading Academy",
      desc: "Learn the fundamentals",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="7.5" r="1.5" />
        </svg>
      )
    },
    {
      title: "Video Tutorials",
      desc: "Step-by-step guides",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <polygon points="10 8 16 11 10 14 10 8" fill="currentColor" className="text-brand-blue" />
        </svg>
      )
    },
    {
      title: "Trading Courses",
      desc: "From beginner to pro",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    },
    {
      title: "Market News",
      desc: "Stay updated daily",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      title: "Economic Calendar",
      desc: "Track key events",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <rect x="7" y="14" width="2" height="2" fill="currentColor" />
          <rect x="11" y="14" width="2" height="2" fill="currentColor" />
          <rect x="15" y="14" width="2" height="2" fill="currentColor" />
        </svg>
      )
    },
    // Row 2
    {
      title: "Beginner Guides",
      desc: "Start your trading journey",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <polyline points="10 8 13 11 16 8" />
        </svg>
      )
    },
    {
      title: "Advanced Guides",
      desc: "Level up your trading",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7s0 6 8 10z" />
          <circle cx="12" cy="11" r="3" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      title: "Blog",
      desc: "Insights and strategies",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      )
    },
    {
      title: "Glossary",
      desc: "Trading terms explained",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="7" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
          <circle cx="17" cy="6" r="1.5" />
        </svg>
      )
    },
    {
      title: "FAQ",
      desc: "Find your answers",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    // Row 3
    {
      title: "Download Center",
      desc: "Ebooks, guides & more",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    },
    {
      title: "Learning Center",
      desc: "All resources in one place",
      icon: (
        <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      )
    }
  ];

  const filteredItems = resourceItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      
      {/* Decorative High-Tech Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Grid Layout containing Hero Title and Right-side Cyber Graphic */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 relative z-10 pt-4">
        
        {/* --- LEFT HAND SIDE: HEADER CONTENT --- */}
        <div className="lg:col-span-6 text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Vertex Knowledge Base
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
            Knowledge Is Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-brand-blue">
              Greatest Edge.
            </span>
          </h1>

          <p className="text-gray-400 font-sans text-base sm:text-lg max-w-xl leading-relaxed">
            Learn, grow and master the markets with Vunex Markets resources. Master advanced indicators, market trends, and risk management strategies.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={onGetStartedClick}
              className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-sm font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              className="px-6 py-3.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/75 text-gray-300 hover:text-white font-sans text-sm font-semibold rounded-lg transition-all cursor-pointer"
              onClick={() => {
                const el = document.getElementById('resources-catalog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Resources
            </button>
          </div>
        </div>

        {/* --- RIGHT HAND SIDE: PREMIUM 3D CYBERPUNK GRAPHIC --- */}
        <div className="lg:col-span-6 flex justify-center relative">
          <div className="relative w-full max-w-[580px] aspect-[1.6] flex items-center justify-center">
            
            {/* Ambient Background Aura */}
            <div className="absolute w-[440px] h-[280px] bg-brand-blue/15 rounded-full blur-[90px] pointer-events-none opacity-80" />
            <div className="absolute w-[300px] h-[180px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none opacity-50 bottom-4" />

            {/* Custom 3D SVG Composition depicting Laptop, Books, Graduation Cap & Floating Charts */}
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 640 400" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Neon Glow filters */}
                <filter id="cyber-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ================= 1. HOLOGRAPHIC TECH PEDESTAL STAGE ================= */}
              <g>
                <ellipse cx="320" cy="310" rx="290" ry="75" fill="none" stroke="#1d4ed8" strokeWidth="1" strokeOpacity="0.1" />
                <ellipse 
                  cx="320" 
                  cy="310" 
                  rx="270" 
                  ry="70" 
                  fill="none" 
                  stroke="#00d8ff" 
                  strokeWidth="1.5" 
                  strokeDasharray="5,15" 
                  strokeOpacity="0.35"
                />
                <ellipse 
                  cx="320" 
                  cy="310" 
                  rx="240" 
                  ry="62" 
                  fill="#030305" 
                  fillOpacity="0.9" 
                  stroke="#ffffff" 
                  strokeWidth="1.8" 
                  strokeOpacity="0.5"
                  filter="url(#cyber-glow)"
                />
                <ellipse cx="320" cy="310" rx="200" ry="52" fill="none" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.25" />
                <ellipse cx="320" cy="310" rx="140" ry="36" fill="none" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3,3" />
              </g>

              {/* ================= 2. VIDEO TUTORIALS MONITOR (Right back) ================= */}
              <g>
                {/* Outer frame */}
                <polygon points="405,210 525,200 525,95 405,103" fill="#020204" stroke="#22222a" strokeWidth="2" />
                {/* Screen panel */}
                <polygon points="410,206 520,197 520,100 410,108" fill="#04060c" stroke="#00a3ff" strokeWidth="1" strokeOpacity="0.6" filter="url(#cyber-glow)" />
                {/* Grid layout on screen */}
                <line x1="420" y1="180" x2="510" y2="172" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="420" y1="140" x2="510" y2="132" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                {/* Histograms/Bars on left of screen */}
                <rect x="420" y="150" width="8" height="40" fill="#00f0ff" fillOpacity="0.8" transform="skewY(-4)" />
                <rect x="432" y="135" width="8" height="55" fill="#3b82f6" fillOpacity="0.7" transform="skewY(-4)" />
                <rect x="444" y="160" width="8" height="30" fill="#6366f1" fillOpacity="0.6" transform="skewY(-4)" />
                {/* Glowing Play Circle with Triangle */}
                <circle cx="485" cy="145" r="18" fill="none" stroke="#ffffff" strokeWidth="2" filter="url(#cyber-glow)" />
                <polygon points="481,137 494,145 481,153" fill="#ffffff" />
              </g>

              {/* ================= 3. CENTER LAPTOP (Center) ================= */}
              <g>
                {/* Screen Bezel tilted back */}
                <polygon points="230,225 390,212 390,105 230,115" fill="#0a0a0f" stroke="#24242a" strokeWidth="2" />
                {/* Screen panel glass */}
                <polygon points="235,221 385,209 385,110 235,119" fill="#03050a" stroke="#00a3ff" strokeWidth="1" strokeOpacity="0.5" filter="url(#cyber-glow)" />
                {/* Chart Grid Lines */}
                <line x1="245" y1="200" x2="375" y2="190" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="245" y1="160" x2="375" y2="150" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="245" y1="120" x2="375" y2="110" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.1" />
                {/* Glowing Yellow Trend Line */}
                <path d="M 240,195 Q 265,150 295,170 T 340,135 T 380,120" fill="none" stroke="#ffd700" strokeWidth="2" filter="url(#cyber-glow)" />
                {/* Candles on screen */}
                <line x1="270" y1="140" x2="270" y2="180" stroke="#10b981" strokeWidth="1" />
                <rect x="267" y="150" width="6" height="20" fill="#10b981" />
                <line x1="310" y1="120" x2="310" y2="165" stroke="#ef4444" strokeWidth="1" />
                <rect x="307" y="130" width="6" height="25" fill="#ef4444" />
                <line x1="350" y1="135" x2="350" y2="175" stroke="#10b981" strokeWidth="1" />
                <rect x="347" y="145" width="6" height="22" fill="#10b981" />
                {/* Volume histogram at bottom of laptop screen */}
                <rect x="245" y="200" width="4" height="15" fill="#00f0ff" fillOpacity="0.4" />
                <rect x="252" y="195" width="4" height="20" fill="#00f0ff" fillOpacity="0.6" />
                <rect x="259" y="190" width="4" height="25" fill="#00f0ff" fillOpacity="0.8" />
                <rect x="266" y="202" width="4" height="13" fill="#00f0ff" fillOpacity="0.4" />
                <rect x="273" y="193" width="4" height="21" fill="#00f0ff" fillOpacity="0.5" />
                <rect x="280" y="185" width="4" height="29" fill="#00f0ff" fillOpacity="0.9" filter="url(#cyber-glow)" />
                <rect x="287" y="196" width="4" height="18" fill="#00f0ff" fillOpacity="0.5" />
                {/* Laptop Keyboard Base */}
                <polygon points="230,225 390,212 420,255 190,272" fill="#0c0c11" stroke="#2d2d3a" strokeWidth="1.2" />
                {/* Keyboard Backlight overlay */}
                <polygon points="235,228 385,216 410,251 205,267" fill="none" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.4" />
                {/* Trackpad */}
                <polygon points="285,252 325,247 328,255 287,261" fill="#15151e" stroke="#3c3c4a" strokeWidth="0.5" />
              </g>

              {/* ================= 4. HOLOGRAPHIC GLASS CHART PANE (Far Right Foreground) ================= */}
              <g>
                <polygon points="530,165 595,155 595,265 530,275" fill="#050811" fillOpacity="0.4" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.5" filter="url(#cyber-glow)" />
                {/* Holographic Bars */}
                <rect x="540" y="180" width="8" height="70" fill="#00f0ff" fillOpacity="0.8" transform="translate(0, 0)" />
                <rect x="552" y="195" width="8" height="55" fill="#3b82f6" fillOpacity="0.6" />
                <rect x="564" y="210" width="8" height="40" fill="#6366f1" fillOpacity="0.9" filter="url(#cyber-glow)" />
                <rect x="576" y="170" width="8" height="80" fill="#ffffff" fillOpacity="0.7" />
                {/* Candles on pane */}
                <line x1="544" y1="170" x2="544" y2="190" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="578" y1="160" x2="578" y2="185" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* ================= 5. UNDER-BOOKS PEDESTAL PLATE (Left Foreground) ================= */}
              <g>
                <ellipse cx="130" cy="285" rx="85" ry="24" fill="#08080c" stroke="#00f0ff" strokeWidth="1.8" strokeOpacity="0.7" filter="url(#cyber-glow)" />
                <ellipse cx="130" cy="285" rx="75" ry="21" fill="none" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.3" />
              </g>

              {/* ================= 6. BOOKS STACK & GRADUATION CAP ================= */}
              <g>
                {/* --- BOOK 3 (Bottom) --- */}
                <g>
                  {/* Page block side */}
                  <polygon points="185,248 198,245 194,268 180,273" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                  {/* Spine curved */}
                  <path d="M 70,255 C 55,265 55,275 70,285 L 180,273 C 165,263 165,253 180,248 Z" fill="#13131a" stroke="#252530" strokeWidth="1" />
                  {/* VUNEX Branding on spine */}
                  <text x="95" y="271" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="12" fill="#e2e8f0" letterSpacing="1.5" transform="rotate(-6, 95, 271)">VUNEX</text>
                  {/* Top cover page line */}
                  <polygon points="70,255 180,248 185,251 75,258" fill="#1e293b" />
                </g>

                {/* --- BOOK 2 (Middle) --- */}
                <g>
                  <polygon points="180,223 193,220 189,242 175,247" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                  <path d="M 80,230 C 68,238 68,246 80,254 L 175,244 C 163,236 163,228 175,220 Z" fill="#1c1c24" stroke="#2c2c38" strokeWidth="1" />
                  <text x="102" y="244" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="10" fill="#a1a1aa" letterSpacing="1" transform="rotate(-6, 102, 244)">MARKETS</text>
                </g>

                {/* --- BOOK 1 (Top) --- */}
                <g>
                  <polygon points="170,198 183,195 179,217 165,222" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                  <path d="M 75,202 C 65,209 65,217 75,225 L 165,215 C 155,207 155,199 165,191 Z" fill="#101015" stroke="#1d4ed8" strokeWidth="1" />
                  <text x="95" y="215" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" fill="#3b82f6" letterSpacing="1" transform="rotate(-6, 95, 215)">TRADING</text>
                </g>

                {/* --- MORTARBOARD GRADUATION CAP --- */}
                <g>
                  {/* Cap crown base */}
                  <path d="M 95,188 L 95,200 C 95,205 135,205 135,200 L 135,188" fill="#15151a" stroke="#222" strokeWidth="1" />
                  <path d="M 95,198 C 110,203 120,203 135,198" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.8" fill="none" filter="url(#cyber-glow)" />
                  {/* Diamond Top board */}
                  <polygon 
                    points="115,150 175,165 115,180 55,165" 
                    fill="#09090d" 
                    stroke="#00f0ff" 
                    strokeWidth="1.8" 
                    filter="url(#cyber-glow)"
                  />
                  {/* Button */}
                  <ellipse cx="115" cy="165" rx="4" ry="2" fill="#222" stroke="#00f0ff" strokeWidth="0.8" />
                  {/* Tassel cord and brush */}
                  <path d="M 115,165 Q 90,162 75,172 Q 65,180 66,192" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#cyber-glow)" />
                  <polygon points="63,192 69,192 71,208 61,208" fill="#00f0ff" filter="url(#cyber-glow)" />
                </g>
              </g>

              {/* Sparkles & indicators */}
              <g transform="translate(190, 290)" className="animate-pulse">
                <circle cx="0" cy="0" r="2.5" fill="#ffffff" filter="url(#cyber-glow)" />
              </g>
              <g transform="translate(420, 280)" className="animate-pulse">
                <circle cx="0" cy="0" r="2" fill="#00f0ff" filter="url(#cyber-glow)" />
              </g>
            </svg>
          </div>
        </div>

      </div>

      {/* --- SECTION 2: LIVE RESOURCE SEARCH BAR --- */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <div className="max-w-md bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-1.5 flex items-center gap-3 shadow-lg shadow-black/40">
          <div className="pl-3.5 text-zinc-500">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search guides, courses, definitions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-white placeholder-zinc-500 focus:ring-0 focus:outline-none text-sm font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-zinc-500 hover:text-white text-xs px-2.5 py-1 hover:bg-zinc-800 rounded-md font-sans transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* --- SECTION 3: CORE BENTO RESOURCES GRID (5-COLUMN ALIGNED LIKE USER IMAGE) --- */}
      <div id="resources-catalog-grid" className="max-w-7xl mx-auto relative z-10 mb-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-800/60 rounded-2xl bg-zinc-950/20">
            <HelpCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4 animate-bounce" />
            <p className="text-zinc-400 font-sans text-sm">No resources found matching &quot;{searchQuery}&quot;</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-3 text-brand-blue font-semibold font-sans text-xs hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="group relative bg-[#07070a]/90 backdrop-blur-md border border-[#14141a]/80 hover:border-brand-blue/30 rounded-xl p-5.5 flex flex-col justify-between shadow-lg shadow-black/80 transition-all duration-300 cursor-pointer"
              >
                {/* Ambient glow accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/0 to-indigo-500/0 group-hover:from-brand-blue/3 group-hover:to-indigo-500/2 rounded-xl transition-all duration-300" />
                
                <div className="space-y-4 relative z-10">
                  {/* Decorative glowing icon base */}
                  <div className="w-11 h-11 rounded-lg bg-[#0a0a0f] border border-zinc-800/60 flex items-center justify-center group-hover:border-brand-blue/30 transition-colors shadow-inner shadow-black">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="font-sans font-bold text-sm text-white tracking-wide group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-zinc-500 mt-1 leading-normal group-hover:text-zinc-400 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-5 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-brand-blue font-sans text-[11px] font-bold flex items-center gap-1">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* --- SECTION 4: NEWSLETTER GLASS SUBSCRIPTION CONTAINER (From image) --- */}
      <div className="max-w-7xl mx-auto mb-16 relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#060609] to-[#0b0c12] border border-white/[0.05] rounded-xl p-8 sm:p-10 shadow-2xl shadow-black">
          
          {/* Internal background glow effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-500/5 rounded-full blur-[65px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Icon + Description */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-14 h-14 bg-brand-blue/10 border border-brand-blue/20 rounded-xl flex items-center justify-center shadow-lg shadow-black">
                <Mail className="w-6 h-6 text-brand-blue" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-blue animate-ping" />
              </div>
              <div className="space-y-1.5 text-left">
                <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide">
                  Stay Informed. Stay Ahead.
                </h3>
                <p className="font-sans text-sm text-gray-400 leading-relaxed max-w-lg">
                  Subscribe to our newsletter and never miss important market updates, premium guides, and weekly technical alerts.
                </p>
              </div>
            </div>

            {/* Right Column: Dynamic Form */}
            <div className="lg:col-span-5 w-full">
              {isSubscribed ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-brand-blue/10 border border-brand-blue/30 text-brand-blue p-4 rounded-xl text-center text-sm font-semibold font-sans"
                >
                  🎉 Success! Thank you for subscribing to our updates.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050508]/80 border border-zinc-800/80 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-lg px-4 py-3.5 text-white placeholder-zinc-500 text-sm font-sans transition-all"
                  />
                  <button 
                    type="submit"
                    className="sm:w-32 bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-sm font-bold px-6 py-3.5 rounded-lg shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- SECTION 5: TRUSTED REGULATORY BAR BADGING (Identical to landing) --- */}
      <div className="max-w-7xl mx-auto border-t border-white/[0.04] pt-12 pb-6 text-center relative z-10">
        <p className="text-gray-500 font-sans text-xs uppercase tracking-[0.25em] font-bold mb-8">
          Trusted. Regulated. Secure.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-45 hover:opacity-75 transition-opacity duration-300 max-w-4xl mx-auto px-4">
          
          {/* Badge 1: FCA */}
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-xl tracking-wider text-white">FCA</span>
            <span className="text-[8px] tracking-widest text-gray-500 uppercase mt-0.5 font-sans">Financial Conduct Authority</span>
          </div>

          {/* Badge 2: ASIC */}
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-xl tracking-wider text-white">ASIC</span>
            <span className="text-[8px] tracking-widest text-gray-500 uppercase mt-0.5 font-sans">Securities &amp; Investments</span>
          </div>

          {/* Badge 3: FSCA */}
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-xl tracking-wider text-white">FSCA</span>
            <span className="text-[8px] tracking-widest text-gray-500 uppercase mt-0.5 font-sans">Financial Conduct Board</span>
          </div>

          {/* Badge 4: CySEC */}
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-xl tracking-wider text-white">CySEC</span>
            <span className="text-[8px] tracking-widest text-gray-500 uppercase mt-0.5 font-sans">Securities Exchange</span>
          </div>

          {/* Badge 5: DFSA */}
          <div className="flex flex-col items-center col-span-2 md:col-span-1">
            <span className="font-display font-black text-xl tracking-wider text-white">DFSA</span>
            <span className="text-[8px] tracking-widest text-gray-500 uppercase mt-0.5 font-sans">Dubai Financial Services</span>
          </div>

        </div>
      </div>

    </div>
  );
}
