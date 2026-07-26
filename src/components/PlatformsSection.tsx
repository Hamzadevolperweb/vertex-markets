import { motion } from 'motion/react';
import { Monitor, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { Ticker } from '../types';
import { platformsComposed } from '../assets/images';

interface PlatformsSectionProps {
  selectedTicker: Ticker;
  onTickerSelect: (ticker: Ticker) => void;
  onExploreClick?: () => void;
}

export default function PlatformsSection({ onExploreClick }: PlatformsSectionProps) {
  const platforms = [
    { icon: <Globe className="w-[18px] h-[18px]" />, title: 'Web Trader', sub: 'Trade instantly in your browser' },
    { icon: <Monitor className="w-[18px] h-[18px]" />, title: 'Desktop', sub: 'Windows & Mac' },
    { icon: <Smartphone className="w-[18px] h-[18px]" />, title: 'Mobile App', sub: 'iOS & Android' },
  ];

  return (
    <section className="py-16 md:py-20 bg-black" id="platforms">
      <div className="w-full px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="absolute inset-[18%] bg-brand-blue/20 blur-[70px] rounded-full pointer-events-none" />
            <img
              src={platformsComposed}
              alt="Vunex platforms on desktop and mobile"
              className="relative z-10 w-full max-w-[520px] object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-blue uppercase mb-3">
              Powerful Platforms. Anytime, Anywhere.
            </p>
            <h2 className="font-display text-[34px] md:text-[42px] font-bold text-white tracking-tight leading-[1.1] mb-4">
              Trade on Your Terms.
              <br />
              Anywhere.
            </h2>
            <p className="text-[14px] text-white/45 leading-relaxed max-w-md mb-7">
              Experience next-generation trading across our award-winning platforms. Seamless, powerful, and built for ultimate speed.
            </p>

            <div className="space-y-3 mb-8">
              {platforms.map((p) => (
                <div
                  key={p.title}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0c0c0e] px-4 py-3.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-white">{p.title}</div>
                    <div className="text-[12px] text-white/40 mt-0.5">{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onExploreClick}
              className="h-11 px-6 rounded-lg bg-brand-blue hover:bg-[#2a6aff] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-[0_0_24px_rgba(30,96,255,0.35)] cursor-pointer"
            >
              Explore Platforms
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
