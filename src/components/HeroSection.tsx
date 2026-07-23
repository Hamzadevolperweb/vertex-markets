import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Headphones, Minimize2, Percent } from 'lucide-react';
import heroBullImg from '../assets/images/vertex_hero_bull_1784320384594.jpg';

interface HeroSectionProps {
  onOpenDemoClick?: () => void;
}

export default function HeroSection({ onOpenDemoClick }: HeroSectionProps) {
  const features = [
    {
      icon: <Percent className="w-5 h-5 text-brand-blue" />,
      title: 'Tight Spreads',
      subtitle: 'From 0.0 pips',
    },
    {
      icon: <Zap className="w-5 h-5 text-brand-blue" />,
      title: 'Ultra-Fast',
      subtitle: 'Execution under 30ms',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-blue" />,
      title: 'Secure & Regulated',
      subtitle: 'Client Protection',
    },
    {
      icon: <Headphones className="w-5 h-5 text-brand-blue" />,
      title: '24/7 Support',
      subtitle: 'Real Traders',
    },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden" id="hero-section">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center lg:items-start justify-between">
          
          {/* Left Hero Text */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-6 z-10 text-left lg:pt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase bg-brand-blue/10 px-3 py-1.5 rounded-full border border-brand-blue/20">
                Professional Trading. Worldwide.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]"
            >
              Trade Smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-blue">Trade Vunex.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 font-sans text-lg md:text-xl leading-relaxed max-w-lg"
            >
              Institutional-grade technology, deep liquidity, and tight spreads across global markets. Access the world's most popular instruments with an award-winning broker.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
              id="hero-cta-buttons"
            >
              <a
                href="#platforms"
                className="font-sans text-sm font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenDemoClick}
                className="font-sans text-sm font-semibold text-white hover:text-brand-blue border border-white/10 hover:border-brand-blue/30 bg-white/5 hover:bg-brand-blue/5 px-8 py-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                Open Demo Account
              </button>
            </motion.div>

            {/* Mobile-only Cow/Bull image visual placed directly below the CTA buttons */}
            <div className="w-full relative flex items-center justify-center min-h-[320px] py-4 block lg:hidden" id="hero-cow-mobile">
              {/* Pedestal Shadow and Circle Backgrounds (Blue and White radial glow) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,rgba(255,255,255,0.06)_40%,transparent_70%)] pointer-events-none" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[440px] aspect-[4/3] flex items-center justify-center bg-transparent rounded-2xl overflow-visible"
              >
                {/* Outer Glow & Background Halo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 via-white/5 to-[#00f0ff]/10 rounded-3xl blur-2xl pointer-events-none opacity-60" />
                
                {/* Main Premium Image Container */}
                <div className="relative w-full h-full rounded-2xl p-[1.5px] bg-gradient-to-r from-brand-blue via-white to-[#00f0ff] overflow-hidden shadow-2xl group">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#020205] via-[#050b18] to-[#020205] p-1 overflow-hidden relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/25 via-white/10 to-[#00f0ff]/15 opacity-80 pointer-events-none -z-10" />
                    <img
                      src={heroBullImg}
                      alt="Vunex 3D Metallic Trading Bull"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.03] scale-x-[-1]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg pointer-events-none" />
                  </div>
                </div>

                {/* FLOATING HUD HOLOGRAM ELEMENTS */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute top-4 left-4 glass-panel-light px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-2xl backdrop-blur-xl pointer-events-none flex flex-col gap-0.5"
                >
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider">EURUSD</span>
                  <span className="text-sm font-mono font-bold text-white">1.08945</span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">+0.47%</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute bottom-16 -left-6 glass-panel-light px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-2xl backdrop-blur-xl pointer-events-none flex flex-col gap-0.5"
                >
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider">XAUUSD</span>
                  <span className="text-sm font-mono font-bold text-white">2,384.65</span>
                  <span className="text-[10px] font-semibold text-brand-blue flex items-center gap-0.5">+0.62%</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-12 -right-4 glass-panel-light px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-2xl backdrop-blur-xl pointer-events-none flex flex-col gap-0.5"
                >
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider">GBPUSD</span>
                  <span className="text-sm font-mono font-bold text-white">1.27482</span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">+0.35%</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Quick stats / highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 md:gap-6 pt-10 border-t border-white/[0.06]"
              id="hero-features-list"
            >
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-blue/10 border border-brand-blue/15 mt-0.5">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white tracking-wide">{feat.title}</h4>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">{feat.subtitle}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Hero Visuals */}
          <div className="w-full lg:w-1/2 relative flex items-center justify-center min-h-[450px] hidden lg:flex">
            
            {/* Pedestal Shadow and Circle Backgrounds (Blue and White radial glow) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,rgba(255,255,255,0.06)_40%,transparent_70%)] pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[580px] aspect-[4/3] flex items-center justify-center bg-transparent rounded-2xl overflow-visible"
            >
              {/* Outer Glow & Background Halo (Blue and White) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 via-white/5 to-[#00f0ff]/10 rounded-3xl blur-2xl pointer-events-none opacity-60" />
              
              {/* Main Premium Image Container with Custom Blue and White Glowing Border */}
              <div className="relative w-full h-full rounded-2xl p-[1.5px] bg-gradient-to-r from-brand-blue via-white to-[#00f0ff] overflow-hidden shadow-2xl group">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#020205] via-[#050b18] to-[#020205] p-1 overflow-hidden relative flex items-center justify-center">
                  
                  {/* Glowing Blue and White background wall panel */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/25 via-white/10 to-[#00f0ff]/15 opacity-80 pointer-events-none -z-10" />
                  
                  <img
                    src={heroBullImg}
                    alt="Vunex 3D Metallic Trading Bull"
                    className="w-full h-full object-contain rounded-lg transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.03] scale-x-[-1]"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Visual Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg pointer-events-none" />
                </div>
              </div>

              {/* FLOATING HUD HOLOGRAM ELEMENTS */}
              {/* EURUSD Floating Badge (Top Left overlay) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute top-4 left-4 glass-panel-light px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-2xl backdrop-blur-xl pointer-events-none flex flex-col gap-0.5"
              >
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider">EURUSD</span>
                <span className="text-sm font-mono font-bold text-white">1.08945</span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">+0.47%</span>
              </motion.div>

              {/* XAUUSD Floating Badge (Middle Left overlay) */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-16 -left-6 glass-panel-light px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-2xl backdrop-blur-xl pointer-events-none flex flex-col gap-0.5"
              >
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider">XAUUSD</span>
                <span className="text-sm font-mono font-bold text-white">2,384.65</span>
                <span className="text-[10px] font-semibold text-brand-blue flex items-center gap-0.5">+0.62%</span>
              </motion.div>

              {/* GBPUSD Floating Badge (Middle Right overlay) */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-12 -right-4 glass-panel-light px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-2xl backdrop-blur-xl pointer-events-none flex flex-col gap-0.5"
              >
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider">GBPUSD</span>
                <span className="text-sm font-mono font-bold text-white">1.27482</span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">+0.35%</span>
              </motion.div>

              {/* Corner HUD coordinates label */}
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <span className="text-[10px] font-mono text-white/30">Support</span>
                <span className="block text-[8px] font-sans text-white/20 uppercase tracking-widest mt-0.5">Traders</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
