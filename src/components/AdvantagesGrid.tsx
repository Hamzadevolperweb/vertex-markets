import { motion } from 'motion/react';

export default function AdvantagesGrid() {
  const advantages = [
    {
      title: 'Institutional Liquidity',
      desc: 'Access deep liquidity from Tier-1 providers for minimal slippage and maximum stability.',
      id: 'advantage-liquidity',
      // SVG 3D Bar chart with glowing glass pillars
      visual: (
        <svg className="w-full h-28 overflow-visible" viewBox="0 0 160 112" fill="none">
          <defs>
            <linearGradient id="glassGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1e60ff" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="glassGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e60ff" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="topCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1e60ff" />
            </linearGradient>
          </defs>
          
          {/* Floor grid shadow */}
          <ellipse cx="80" cy="98" rx="70" ry="12" fill="url(#floorShadow)" className="opacity-40" />
          <linearGradient id="floorShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Pillar 1 */}
          <motion.g whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
            {/* Back / Body */}
            <rect x="25" y="70" width="18" height="25" rx="3" fill="url(#glassGrad1)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Front Glass Accent */}
            <rect x="25" y="70" width="18" height="25" rx="3" fill="none" stroke="url(#glassGrad2)" strokeWidth="1.5" className="opacity-50" />
            {/* Glowing top cap */}
            <ellipse cx="34" cy="70" rx="9" ry="3.5" fill="url(#topCapGrad)" />
            {/* Glowing bottom bulb */}
            <circle cx="34" cy="95" r="4" fill="#1e60ff" className="blur-[3px]" />
          </motion.g>

          {/* Pillar 2 */}
          <motion.g whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300, delay: 0.05 }}>
            <rect x="55" y="50" width="18" height="45" rx="3" fill="url(#glassGrad1)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <rect x="55" y="50" width="18" height="45" rx="3" fill="none" stroke="url(#glassGrad2)" strokeWidth="1.5" className="opacity-65" />
            <ellipse cx="64" cy="50" rx="9" ry="3.5" fill="url(#topCapGrad)" />
            <circle cx="64" cy="95" r="5" fill="#1e60ff" className="blur-[4px]" />
          </motion.g>

          {/* Pillar 3 */}
          <motion.g whileHover={{ y: -12 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}>
            <rect x="85" y="35" width="18" height="60" rx="3" fill="url(#glassGrad1)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <rect x="85" y="35" width="18" height="60" rx="3" fill="none" stroke="url(#glassGrad2)" strokeWidth="1.5" className="opacity-80" />
            <ellipse cx="94" cy="35" rx="9" ry="3.5" fill="url(#topCapGrad)" />
            <circle cx="94" cy="95" r="6" fill="#1e60ff" className="blur-[5px]" />
          </motion.g>

          {/* Pillar 4 */}
          <motion.g whileHover={{ y: -14 }} transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}>
            <rect x="115" y="15" width="18" height="80" rx="3" fill="url(#glassGrad1)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <rect x="115" y="15" width="18" height="80" rx="3" fill="none" stroke="url(#glassGrad2)" strokeWidth="1.5" className="opacity-100" />
            <ellipse cx="124" cy="15" rx="9" ry="3.5" fill="url(#topCapGrad)" />
            {/* Major neon laser emitter bottom */}
            <ellipse cx="124" cy="95" rx="8" ry="3" fill="#1e60ff" className="blur-[4px]" />
            <circle cx="124" cy="95" r="3" fill="#ffffff" />
          </motion.g>
        </svg>
      )
    },
    {
      title: 'Lightning Execution',
      desc: 'Average execution speed under 30ms with no dealing desk interference.',
      id: 'advantage-execution',
      // SVG 3D modern speedometer gauge
      visual: (
        <svg className="w-full h-28 overflow-visible" viewBox="0 0 160 112" fill="none">
          {/* Base Outer Circular ring */}
          <circle cx="80" cy="56" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <path d="M45 80 A 42 42 0 1 1 115 80" stroke="url(#gaugeOuterGrad)" strokeWidth="3" strokeLinecap="round" />
          
          <linearGradient id="gaugeOuterGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e60ff" />
            <stop offset="50%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Glowing neon tick marks */}
          <circle cx="80" cy="56" r="32" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 8" />

          {/* Central Core Display */}
          <circle cx="80" cy="56" r="14" fill="#09090b" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="80" cy="56" r="14" fill="#1e60ff" className="opacity-10 blur-[4px]" />

          {/* Moving Needle */}
          <motion.g
            animate={{ rotate: [15, 135, 120, 160, 45, 120] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: 'easeInOut',
            }}
            style={{ originX: '80px', originY: '56px' }}
          >
            <line x1="80" y1="56" x2="108" y2="38" stroke="#1e60ff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="80" y1="56" x2="114" y2="34" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" className="opacity-80" />
            <circle cx="80" cy="56" r="4" fill="#ffffff" />
          </motion.g>

          {/* Execution Time Display overlay */}
          <text x="80" y="86" fill="#1e60ff" className="font-mono text-[10px] font-bold" textAnchor="middle">
            &lt; 30ms
          </text>
        </svg>
      )
    },
    {
      title: 'Security You Can Trust',
      desc: 'Segregated client funds, advanced encryption, and global regulatory oversight.',
      id: 'advantage-security',
      // SVG 3D metallic shield
      visual: (
        <svg className="w-full h-28 overflow-visible" viewBox="0 0 160 112" fill="none">
          <defs>
            <linearGradient id="shieldMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2e2e34" />
              <stop offset="40%" stopColor="#0d0d10" />
              <stop offset="70%" stopColor="#41414e" />
              <stop offset="100%" stopColor="#1a1a24" />
            </linearGradient>
            <linearGradient id="shieldGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e60ff" />
              <stop offset="100%" stopColor="#00d2ff" />
            </linearGradient>
          </defs>

          {/* Base Back Glow */}
          <path d="M80 18 C105 18 115 28 115 54 C115 82 80 96 80 96 C80 96 45 82 45 54 C45 28 55 18 80 18 Z" fill="url(#shieldGlow)" className="opacity-25 blur-[12px]" />

          <motion.g
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Outer Heavy Ring Shield */}
            <path d="M80 18 C105 18 115 28 115 54 C115 82 80 96 80 96 C80 96 45 82 45 54 C45 28 55 18 80 18 Z" fill="url(#shieldMetal)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            
            {/* Inner Glowing Shield Border */}
            <path d="M80 24 C100 24 108 32 108 52 C108 74 80 87 80 87 C80 87 52 74 52 52 C52 32 60 24 80 24 Z" fill="none" stroke="url(#shieldGlow)" strokeWidth="2" strokeLinecap="round" />

            {/* Shield Center emblem (Sleek padlock symbol or cross checkmark) */}
            <path d="M80 34 L80 74" stroke="url(#shieldGlow)" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M60 54 L100 54" stroke="url(#shieldGlow)" strokeWidth="1.5" strokeOpacity="0.4" />
            
            {/* Neon Lock / Safe Icon */}
            <rect x="73" y="48" width="14" height="12" rx="2" fill="#09090b" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M76 48 V44 C76 41.8 77.8 40 80 40 C82.2 40 84 41.8 84 44 V48" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="80" cy="54" r="1.5" fill="#1e60ff" />
          </motion.g>
        </svg>
      )
    },
    {
      title: 'Pro Trading Conditions',
      desc: 'Raw spreads, flexible leverage, and low commissions built for consistent performance.',
      id: 'advantage-conditions',
      // SVG 3D mechanical slider board
      visual: (
        <svg className="w-full h-28 overflow-visible" viewBox="0 0 160 112" fill="none">
          {/* Base Console Panel */}
          <rect x="35" y="16" width="90" height="80" rx="12" fill="#0c0c0e" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          
          {/* Internal shadow effect */}
          <rect x="39" y="20" width="82" height="72" rx="8" fill="none" stroke="rgba(30,96,255,0.04)" strokeWidth="4" />

          {/* Slider slots */}
          <line x1="55" y1="32" x2="55" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />
          <line x1="80" y1="32" x2="80" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />
          <line x1="105" y1="32" x2="105" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />

          {/* Slider active glowing tracks */}
          <line x1="55" y1="60" x2="55" y2="80" stroke="#1e60ff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="45" x2="80" y2="80" stroke="#1e60ff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="105" y1="70" x2="105" y2="80" stroke="#1e60ff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Active indicator track glows */}
          <line x1="55" y1="60" x2="55" y2="80" stroke="#1e60ff" strokeWidth="5" strokeLinecap="round" className="opacity-25 blur-[3px]" />
          <line x1="80" y1="45" x2="80" y2="80" stroke="#1e60ff" strokeWidth="5" strokeLinecap="round" className="opacity-25 blur-[3px]" />
          <line x1="105" y1="70" x2="105" y2="80" stroke="#1e60ff" strokeWidth="5" strokeLinecap="round" className="opacity-25 blur-[3px]" />

          {/* Slider knobs (interactive motion) */}
          {/* Knob 1 */}
          <motion.g
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ originX: '55px' }}
          >
            <rect x="47" y="54" width="16" height="10" rx="3" fill="#1a1a20" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="51" y1="59" x2="59" y2="59" stroke="#1e60ff" strokeWidth="1.5" />
          </motion.g>

          {/* Knob 2 */}
          <motion.g
            animate={{ y: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            style={{ originX: '80px' }}
          >
            <rect x="72" y="40" width="16" height="10" rx="3" fill="#1a1a20" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="76" y1="45" x2="84" y2="45" stroke="#1e60ff" strokeWidth="1.5" />
            <circle cx="80" cy="45" r="1.5" fill="#ffffff" />
          </motion.g>

          {/* Knob 3 */}
          <motion.g
            animate={{ y: [-2, 8, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ originX: '105px' }}
          >
            <rect x="97" y="64" width="16" height="10" rx="3" fill="#1a1a20" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="101" y1="69" x2="109" y2="69" stroke="#1e60ff" strokeWidth="1.5" />
          </motion.g>
        </svg>
      )
    },
  ];

  return (
    <section className="py-24 bg-[#030303] relative" id="trading">
      {/* Dynamic graphic elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-blue/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand-blue uppercase font-display">
            Advantages Built For
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2 font-display">
            SERIOUS TRADERS
          </h2>
          <div className="w-12 h-[3px] bg-brand-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {advantages.map((adv, index) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, borderColor: 'rgba(30, 96, 255, 0.3)', boxShadow: '0 12px 30px -10px rgba(30, 96, 255, 0.15)' }}
              className="group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border border-white/[0.05] bg-[#070709] transition-all duration-300 relative overflow-hidden"
              id={adv.id}
            >
              {/* Backlight on hover */}
              <div className="absolute inset-x-0 -top-12 h-24 bg-brand-blue/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* 3D Visual Asset Illustration */}
              <div className="w-full flex justify-center items-center mb-6 bg-white/[0.01] rounded-xl py-4 border border-white/[0.02] relative group-hover:bg-brand-blue/[0.01] group-hover:border-brand-blue/[0.03] transition-all">
                {adv.visual}
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-semibold text-lg text-white tracking-wide mb-3 group-hover:text-brand-blue transition-colors">
                {adv.title}
              </h3>
              <p className="font-sans text-xs text-gray-400 leading-relaxed">
                {adv.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
