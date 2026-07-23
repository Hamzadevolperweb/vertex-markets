import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Gavel, HelpCircle } from 'lucide-react';
import logo3dImg from '../assets/images/vertex_logo_3d_1784320410149.jpg';

interface BottomCTAProps {
  onGetStartedClick?: () => void;
}

export default function BottomCTA({ onGetStartedClick }: BottomCTAProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020203] border-t border-white/[0.05] overflow-hidden" id="footer-section">
      {/* Glow Effects */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.04]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 text-left space-y-6">
            <h3 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-[1.1]">
              Ready to Elevate Your Trading?
            </h3>
            <p className="font-sans text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
              Join thousands of traders who trust Vertex Markets for superior technology, tight pricing, transparency, and award-winning support.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                id="footer-get-started"
                onClick={onGetStartedClick}
                className="font-sans text-sm font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="#terminal" 
                className="font-sans text-sm font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 px-6 py-4 rounded-lg transition-colors group"
              >
                Open Demo Account
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Glowing 3D Emblem Asset */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ rotate: -5, opacity: 0, scale: 0.9 }}
              whileInView={{ rotate: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/[0.06] p-1.5 bg-[#030305]/40 shadow-2xl"
            >
              <div className="absolute inset-0 bg-brand-blue/10 rounded-full blur-2xl animate-pulse" />
              <div className="w-full h-full rounded-full overflow-hidden relative border border-white/[0.08]">
                <img
                  src={logo3dImg}
                  alt="Vertex Markets 3D Metallic V Logo Emblem"
                  className="w-full h-full object-cover select-none scale-105 hover:rotate-6 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  id="footer-logo-3d"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Information Grid and Legal Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-8">
        
        {/* Quick links & regulatory info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/[0.04] pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-display font-bold text-sm tracking-wider uppercase text-white">Vertex Markets</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Vertex Markets is a regulated global broker, empowering institutional and retail clients with low latency execution, tight spreads, and complete clarity.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Trading Specs</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <a href="#trading" className="hover:text-white transition-colors">Raw Spreads (0.0 pips)</a>
              <a href="#trading" className="hover:text-white transition-colors">Forex Instruments</a>
              <a href="#trading" className="hover:text-white transition-colors">Metals & Gold</a>
              <a href="#trading" className="hover:text-white transition-colors">Crypto CFDs</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Legal Docs</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Risk Disclosure Statements</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Configurations</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Help & Contacts</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Support Center (24/7)
              </a>
              <span className="text-[11px] text-gray-500">Global Head Office:<br />Vertex Building, financial Center, Dubai, UAE</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Gavel className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-bold tracking-wider uppercase font-display">Risk Warning & Leveraged Trading Disclaimer</span>
          </div>
          <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
            Trading leveraged products (such as Foreign Exchange CFDs and Commodity futures) involves significant risk and may not be suitable for all investors. You may sustain a loss of some or all of your invested capital; therefore, you should not speculate with capital that you cannot afford to lose. Please ensure you fully understand all the risks involved, read our legal disclosure manuals, and if necessary, seek independent financial advice prior to opening any accounts or deploying simulated order instructions on our network.
          </p>
          <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-600 font-mono pt-4 border-t border-white/[0.02]">
            <span>© {currentYear} Vertex Markets Ltd. All rights reserved.</span>
            <span>Ref ID: AIS-V-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
