import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, TrendingUp } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
  onLogoClick?: () => void;
  onAdminClick?: () => void;
  onMarketsClick?: () => void;
  onTradingClick?: () => void;
  onPlatformsClick?: () => void;
  onResourcesClick?: () => void;
  onCompanyClick?: () => void;
  onPartnersClick?: () => void;
  activeLink?: string;
}

export default function Navbar({ 
  onLoginClick, 
  onGetStartedClick, 
  onLogoClick, 
  onAdminClick,
  onMarketsClick,
  onTradingClick,
  onPlatformsClick,
  onResourcesClick,
  onCompanyClick,
  onPartnersClick,
  activeLink
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trading', href: '#trading', onClick: onTradingClick },
    { name: 'Platforms', href: '#platforms', onClick: onPlatformsClick },
    { name: 'Markets', href: '#markets', onClick: onMarketsClick },
    { name: 'Resources', href: '#resources', onClick: onResourcesClick },
    { name: 'Company', href: '#company', onClick: onCompanyClick },
    { name: 'Partners', href: '#partners', onClick: onPartnersClick },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-md border-b border-white/[0.05]"
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onLogoClick}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none text-left"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Visual Vertex 'V' Icon */}
                <span className="absolute inset-0 bg-brand-blue/20 rounded-lg blur-sm group-hover:bg-brand-blue/30 transition-all"></span>
                <svg className="w-6 h-6 text-brand-blue relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer V Chevron */}
                  <path d="M3 5L12 21L21 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Inner V Chevron */}
                  <path d="M7 5L12 14L17 5" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-bold text-lg tracking-wider text-white uppercase leading-none">Vunex</span>
                <span className="font-sans text-[9px] tracking-[0.3em] text-gray-400 uppercase leading-none mt-1">Markets</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isLinkActive = activeLink === link.name;
              return (
                <a
                  key={link.name}
                  href={link.onClick ? undefined : link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className={`font-sans text-sm font-medium transition-colors py-2 relative group cursor-pointer ${
                    isLinkActive ? 'text-brand-blue font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-blue transition-all ${
                    isLinkActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </a>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              id="btn-admin-portal"
              onClick={onAdminClick}
              className="font-sans text-sm font-medium text-gray-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Admin Portal
            </button>
            <button 
              id="btn-login"
              onClick={onLoginClick}
              className="font-sans text-sm font-medium text-white hover:text-brand-blue border border-white/10 hover:border-brand-blue/30 bg-white/5 hover:bg-brand-blue/5 px-5 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Login
            </button>
            <button 
              id="btn-get-started"
              onClick={onGetStartedClick}
              className="font-sans text-sm font-medium bg-brand-blue hover:bg-brand-blue/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-2"
              aria-label="Toggle menu"
              id="btn-mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505] border-b border-white/[0.05]"
            id="mobile-drawer"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isLinkActive = activeLink === link.name;
                return (
                  <a
                    key={link.name}
                    href={link.onClick ? undefined : link.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      if (link.onClick) {
                        e.preventDefault();
                        link.onClick();
                      }
                    }}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors cursor-pointer ${
                      isLinkActive 
                        ? 'bg-brand-blue/10 text-brand-blue font-bold border-l-2 border-brand-blue pl-2.5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="pt-4 flex flex-col gap-3 px-3">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onAdminClick?.();
                  }}
                  className="w-full text-center font-sans text-sm font-medium text-gray-400 border border-white/5 hover:border-white/10 hover:bg-white/5 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Admin Portal
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick?.();
                  }}
                  className="w-full text-center font-sans text-sm font-medium text-white hover:text-brand-blue border border-white/10 bg-white/5 py-3 rounded-lg transition-all cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onGetStartedClick?.();
                  }}
                  className="w-full text-center font-sans text-sm font-medium bg-brand-blue hover:bg-brand-blue/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
