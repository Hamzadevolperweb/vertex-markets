import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { logo3dComposed } from '../assets/images';

interface BottomCTAProps {
  onGetStartedClick?: () => void;
  onDemoClick?: () => void;
}

export default function BottomCTA({ onGetStartedClick, onDemoClick }: BottomCTAProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/[0.06]" id="footer-section">
      <div className="w-full px-6 lg:px-10 xl:px-14 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-left">
            <h3 className="font-display text-[32px] md:text-[40px] font-bold text-white tracking-tight leading-[1.15] mb-3">
              Ready to Elevate Your Trading?
            </h3>
            <p className="text-[14px] text-white/45 max-w-lg mb-7 leading-relaxed">
              Join thousands of traders who trust Vunex Market for superior technology, tight pricing, and award-winning support.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onGetStartedClick}
                className="h-11 px-6 rounded-lg bg-brand-blue hover:bg-[#2a6aff] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-[0_0_24px_rgba(30,96,255,0.35)] cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onDemoClick}
                className="text-[13px] font-semibold text-white/70 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                Open Demo Account
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative min-h-[200px]">
            <div className="absolute bottom-[8%] w-[48%] h-[38%] bg-brand-blue/35 blur-[48px] rounded-full" />
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src={logo3dComposed}
              alt="Vunex 3D logo"
              className="relative z-10 w-[200px] md:w-[230px] object-contain"
            />
          </div>
        </div>

        <p className="mt-12 text-[11px] text-white/30 leading-relaxed max-w-4xl text-center mx-auto">
          Trading leveraged products involves significant risk and may not be suitable for all investors. Please ensure you fully understand the risks involved.
        </p>
        <div className="mt-6 pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[12px] text-white/35">© {year} Vunex Market Ltd. All rights reserved.</p>
          <div className="flex gap-5 text-[12px] text-white/35">
            <a href="#" className="hover:text-white/70">Privacy Policy</a>
            <a href="#" className="hover:text-white/70">Terms of Service</a>
            <a href="#" className="hover:text-white/70">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
