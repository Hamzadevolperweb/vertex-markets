import { motion } from 'motion/react';
import { Monitor, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { Ticker } from '../types';
import { assetPlatforms } from '../assets/images';

interface PlatformsSectionProps {
  selectedTicker: Ticker;
  onTickerSelect: (ticker: Ticker) => void;
  onExploreClick?: () => void;
}

export default function PlatformsSection({ onExploreClick }: PlatformsSectionProps) {
  const platforms = [
    { icon: <Globe className="w-5 h-5" />, title: 'Web Trader', sub: 'Trade instantly in your browser' },
    { icon: <Monitor className="w-5 h-5" />, title: 'Desktop', sub: 'Windows & Mac' },
    { icon: <Smartphone className="w-5 h-5" />, title: 'Mobile App', sub: 'iOS & Android' },
  ];

  return (
    <section className="py-16 md:py-20 bg-black" id="platforms">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start"
          >
            {/* Soft bloom only — no heavy blur on the image itself */}
            <div className="absolute left-[20%] top-[30%] w-[50%] h-[40%] bg-brand-blue/25 blur-[70px] rounded-full pointer-events-none" />
            <img
              src={assetPlatforms}
              alt="Vunex platforms on desktop and mobile"
              className="relative z-10 w-full max-w-[620px] object-contain"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.65))',
              }}
              draggable={false}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-blue uppercase mb-4">
              Powerful Platforms. Anytime, Anywhere.
            </p>
            <h2 className="font-display text-[36px] md:text-[44px] font-bold text-white tracking-[-0.03em] leading-[1.08] mb-4">
              Trade on Your Terms.
              <br />
              Anywhere.
            </h2>
            <p className="text-[15px] text-white/50 leading-relaxed max-w-md mb-9">
              Experience next-generation trading across our award-winning platforms. Seamless, powerful, and built for ultimate speed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-10">
              {platforms.map((p) => (
                <div
                  key={p.title}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.1] bg-[#121214] px-3 py-2.5 hover:border-brand-blue/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-md bg-brand-blue/15 border border-brand-blue/35 text-brand-blue flex items-center justify-center shrink-0">
                    {p.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-white leading-tight">{p.title}</div>
                    <div className="text-[11px] text-white/45 mt-0.5 leading-tight truncate">{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onExploreClick}
              className="h-12 px-7 rounded-lg bg-brand-blue hover:bg-[#2a6aff] text-white text-[14px] font-semibold inline-flex items-center gap-2.5 shadow-[0_0_28px_rgba(30,96,255,0.4)] cursor-pointer"
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
