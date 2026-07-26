import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Headphones, Percent } from 'lucide-react';
import HeroVisual from './HeroVisual';

interface HeroSectionProps {
  onOpenDemoClick?: () => void;
  onGetStartedClick?: () => void;
}

export default function HeroSection({ onOpenDemoClick, onGetStartedClick }: HeroSectionProps) {
  const features = [
    { icon: <Percent className="w-[15px] h-[15px]" />, title: 'Tight Spreads', sub: 'From 0.0 pips' },
    { icon: <Zap className="w-[15px] h-[15px]" />, title: 'Ultra-Fast', sub: 'Execution' },
    { icon: <ShieldCheck className="w-[15px] h-[15px]" />, title: 'Secure & Regulated', sub: 'Client Protection' },
    { icon: <Headphones className="w-[15px] h-[15px]" />, title: '24/7 Support', sub: 'Real Traders' },
  ];

  return (
    <section className="relative pt-[88px] pb-10 md:pt-[100px] md:pb-12 overflow-hidden" id="hero-section">
      <div className="absolute top-0 right-[5%] w-[420px] h-[420px] bg-brand-blue/[0.09] rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
          {/* Left copy */}
          <div className="lg:col-span-5 text-left z-10 lg:pr-2">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold tracking-[0.2em] text-brand-blue uppercase mb-4"
            >
              Professional Trading. Worldwide.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="font-display text-[40px] sm:text-[48px] lg:text-[54px] font-bold text-white tracking-[-0.03em] leading-[1.05] mb-4"
            >
              Trade Smarter.
              <br />
              Trade Vunex.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-[14px] sm:text-[15px] text-[#9ca3af] leading-[1.55] max-w-[380px] mb-7"
            >
              Institutional-grade technology, deep liquidity, and tight spreads across global markets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <button
                type="button"
                onClick={onGetStartedClick}
                className="h-11 px-6 rounded-lg bg-brand-blue hover:bg-[#2a6aff] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-[0_0_28px_rgba(30,96,255,0.4)] cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenDemoClick}
                className="h-11 px-6 rounded-lg border border-white/30 hover:border-white/55 text-white text-[13px] font-semibold bg-transparent cursor-pointer"
              >
                Open Demo Account
              </button>
            </motion.div>

            <div className="lg:hidden mb-6">
              <HeroVisual />
            </div>
          </div>

          {/* Right visual */}
          <div className="hidden lg:flex lg:col-span-7 items-center justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>

        {/* Feature row — full width under hero, 4 across (design) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 pt-7 border-t border-white/[0.08]"
        >
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center text-brand-blue shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white leading-tight">{f.title}</div>
                <div className="text-[11px] text-white/40 mt-0.5">{f.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
