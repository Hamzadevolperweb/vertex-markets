import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ctaLogoScene, decoLogoPedestal } from '../assets/images';

interface BottomCTAProps {
  onGetStartedClick?: () => void;
  onDemoClick?: () => void;
}

export default function BottomCTA({ onGetStartedClick, onDemoClick }: BottomCTAProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black" id="footer-section">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="rounded-2xl border border-white/[0.09] bg-[#0c0c0e] px-5 py-8 md:px-10 md:py-10 mb-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 text-left relative z-10">
              <h3 className="font-display text-[26px] md:text-[34px] font-bold text-white tracking-tight leading-[1.1] mb-3">
                Ready to Elevate Your Trading?
              </h3>
              <p className="text-[14px] text-white/50 max-w-md mb-6 leading-relaxed">
                Join thousands of traders who trust Vunex Market for superior technology, tight pricing, and award-winning support.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onGetStartedClick}
                  className="h-11 px-6 rounded-lg bg-brand-blue hover:bg-[#2a6aff] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-[0_0_24px_rgba(30,96,255,0.4)] cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onDemoClick}
                  className="h-11 px-5 rounded-lg border border-white/35 hover:border-white/60 text-white text-[13px] font-semibold inline-flex items-center gap-2 bg-transparent cursor-pointer"
                >
                  Open Demo Account
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Extracted 3D V on pedestal */}
            <div className="lg:col-span-5 flex justify-center relative min-h-[180px]">
              <div className="absolute bottom-[10%] w-[45%] h-[32%] bg-brand-blue/40 blur-[48px] rounded-full pointer-events-none" />
              <motion.img
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                src={ctaLogoScene}
                alt="Vunex 3D logo"
                className="relative z-10 w-[180px] md:w-[220px] object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = decoLogoPedestal;
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-white/35 leading-relaxed max-w-4xl text-center mx-auto">
          Trading leveraged products involves significant risk and may not be suitable for all investors. Please ensure you fully understand the risks involved.
        </p>
        <div className="mt-7 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[12px] text-white/40">© {year} Vunex Market Ltd. All rights reserved.</p>
          <div className="flex gap-5 text-[12px] text-white/40">
            <a href="#" className="hover:text-white/75">Privacy Policy</a>
            <a href="#" className="hover:text-white/75">Terms of Service</a>
            <a href="#" className="hover:text-white/75">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
