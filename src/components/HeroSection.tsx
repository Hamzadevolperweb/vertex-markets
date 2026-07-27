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
    <section className="relative pt-[80px] pb-6 md:pt-[88px] md:pb-8 overflow-hidden" id="hero-section">
      <div className="absolute top-[8%] right-[6%] w-[520px] h-[520px] bg-brand-blue/[0.12] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
          <div className="lg:col-span-5 text-left z-10">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold tracking-[0.24em] text-brand-blue uppercase mb-5"
            >
              Professional Trading. Worldwide.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="font-display text-[42px] sm:text-[50px] lg:text-[56px] font-bold text-white tracking-[-0.035em] leading-[1.02] mb-5"
            >
              Trade Smarter.
              <br />
              Trade Vunex.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-[15px] text-[#9ca3af] leading-[1.65] max-w-[400px] mb-8"
            >
              Institutional-grade technology, deep liquidity, and tight spreads across global markets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={onGetStartedClick}
                className="h-12 px-7 rounded-lg bg-brand-blue hover:bg-[#2a6aff] text-white text-[14px] font-semibold inline-flex items-center gap-2.5 shadow-[0_0_32px_rgba(30,96,255,0.45)] cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenDemoClick}
                className="h-12 px-7 rounded-lg border border-white/40 hover:border-white/70 text-white text-[14px] font-semibold bg-transparent cursor-pointer"
              >
                Open Demo Account
              </button>
            </motion.div>

            {/* Feature strip — single row under Get Started */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
              className="mt-8 flex items-start gap-2.5 sm:gap-3.5"
            >
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-white/[0.16] bg-white/[0.04] flex items-center justify-center text-white shrink-0">
                    {f.icon}
                  </div>
                  <div className="pt-0.5 whitespace-nowrap">
                    <div className="text-[10px] sm:text-[12px] font-semibold text-white leading-tight">
                      {f.title}
                    </div>
                    <div className="text-[9px] sm:text-[11px] text-white/50 mt-0.5 leading-tight">
                      {f.sub}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="lg:hidden mt-8 mb-1">
              <HeroVisual />
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-7 items-center justify-center lg:justify-end relative -mt-4">
            <HeroVisual className="!max-w-[660px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
