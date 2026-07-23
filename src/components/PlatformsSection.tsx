import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Smartphone, Globe, ArrowRight, CheckCircle2, ChevronRight, Laptop, Tablet, Download } from 'lucide-react';
import { Ticker, PlatformType } from '../types';
import TerminalWidget from './TerminalWidget';
import platformsImg from '../assets/images/trading_platforms_1784320397411.jpg';

interface PlatformsSectionProps {
  selectedTicker: Ticker;
  onTickerSelect: (ticker: Ticker) => void;
}

export default function PlatformsSection({ selectedTicker, onTickerSelect }: PlatformsSectionProps) {
  const [activeTab, setActiveTab] = useState<PlatformType>('web');

  const tabs = [
    {
      id: 'web' as PlatformType,
      label: 'Web Trader',
      sub: 'Access Anywhere',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 'desktop' as PlatformType,
      label: 'Desktop',
      sub: 'Windows & Mac',
      icon: <Laptop className="w-5 h-5" />,
    },
    {
      id: 'mobile' as PlatformType,
      label: 'Mobile App',
      sub: 'iOS & Android',
      icon: <Smartphone className="w-5 h-5" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'web':
        return (
          <motion.div
            key="web-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="text-left mb-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/15">
                Active Virtual Environment
              </span>
              <p className="text-gray-400 text-sm mt-3">
                Experience Vertex Web Trader in real time below. Switch tickers, configure margins, use leverage up to 500x, and place simulated BUY/SELL orders.
              </p>
            </div>
            
            {/* Embedded Live Simulation Terminal */}
            <TerminalWidget
              selectedTicker={selectedTicker}
              onTickerSelect={onTickerSelect}
            />
          </motion.div>
        );

      case 'desktop':
        return (
          <motion.div
            key="desktop-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#09090c]">
              <img
                src={platformsImg}
                alt="Vertex Desktop Trading Platform UI Mockup"
                className="w-full h-auto object-cover opacity-90 select-none hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div className="lg:col-span-5 text-left space-y-6">
              <div>
                <h4 className="font-display font-bold text-2xl text-white">Vertex Pro Desktop</h4>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Engineered for power-users, the Vertex Desktop client brings ultra-low latency executions and complete multi-monitor layout controls to your setup.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  'Advanced charting with 80+ technical indicators',
                  'One-click order entry & keyboard hotkey mapping',
                  'Custom indicator programming using modern scripts',
                  'Dedicated workspace profiles and layout grids',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-sm font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20">
                  <Download className="w-4 h-4" />
                  Download for Windows
                </button>
                <button className="text-white hover:text-brand-blue border border-white/10 hover:border-brand-blue/30 bg-white/5 hover:bg-brand-blue/5 font-sans text-sm font-semibold px-6 py-3 rounded-lg transition-all">
                  Mac OS Client (Apple Silicon)
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'mobile':
        return (
          <motion.div
            key="mobile-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#09090c] max-w-lg mx-auto w-full">
              <img
                src={platformsImg}
                alt="Vertex Mobile App Dashboard Mockup"
                className="w-full h-auto object-cover opacity-90 select-none scale-95"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="lg:col-span-5 text-left space-y-6">
              <div>
                <h4 className="font-display font-bold text-2xl text-white">Vertex Mobile App</h4>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Never miss a market event. The Vertex Mobile App keeps institutional-grade trading tools in your pocket with deep liquidity access anywhere.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  'Live ticking notifications and customized price alerts',
                  'Full execution order tickets (Limits, Stops, SL/TP)',
                  'Integrated secure deposit and withdrawal gateways',
                  'Biometric authentication (FaceID & Fingerprint)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a href="#" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-2 transition-all">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.1 16.5 4.3 9.42 8.04 9.17c1.16.08 2.02.6 2.78.6.76 0 1.9-.66 3.42-.5 1.5.15 2.62.78 3.2 1.63-3.08 1.83-2.58 5.86.5 7.1-.64 1.61-1.35 3.32-2.3 4.28zM15 3c-.1 2.3-2 4.14-4.14 4-2.3-.15-4.1-2.1-3.9-4.2C9.36 2.7 11.24 1 13.3 1c1 .1 1.7.5 1.7 2z"/>
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] block text-gray-400 uppercase leading-none">Download on the</span>
                    <span className="text-xs font-bold leading-none block mt-1">App Store</span>
                  </div>
                </a>
                <a href="#" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-2 transition-all">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3.25c-.32 0-.6.18-.73.47L12 11.5l7.73-7.78c-.13-.29-.4-.47-.73-.47H5zm14.47 1.53L12.75 12l6.72 6.72c.29-.13.47-.4.47-.72V5.5c0-.32-.18-.6-.47-.73zM12 13.5l-7.73 7.78c.13.29.4.47.73.47h13.0c.32 0 .6-.18.73-.47L12 13.5zm-7.47-1.5L2.25 5.5v13.0c0 .32.18.6.47.73L9.47 12z"/>
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] block text-gray-400 uppercase leading-none">Get it on</span>
                    <span className="text-xs font-bold leading-none block mt-1">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section className="py-24 bg-[#050508]/40 border-t border-white/[0.04]" id="platforms">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand-blue uppercase font-display">
            Powerful Platforms. Anytime, Anywhere.
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-3 font-display">
            Trade on Your Terms. Anywhere.
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Experience next-generation trading across our award-winning platforms. Seamless, powerful, and built for ultimate speed.
          </p>
        </div>

        {/* Tab Buttons bar */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 max-w-2xl w-full gap-2 p-1.5 rounded-2xl bg-[#09090c] border border-white/[0.06]">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all relative ${
                    isActive ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/15' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id={`tab-${tab.id}`}
                >
                  {tab.icon}
                  <span className="text-xs font-bold font-display mt-1.5 tracking-wide">{tab.label}</span>
                  <span className={`text-[9px] font-sans opacity-60 mt-0.5 ${isActive ? 'text-white' : 'text-gray-500'}`}>{tab.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display area */}
        <div className="w-full relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
