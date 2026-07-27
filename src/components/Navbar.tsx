import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

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
  activeLink,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trading', onClick: onTradingClick },
    { name: 'Platforms', onClick: onPlatformsClick },
    { name: 'Markets', onClick: onMarketsClick },
    { name: 'Resources', onClick: onResourcesClick },
    { name: 'Company', onClick: onCompanyClick },
    { name: 'Partners', onClick: onPartnersClick },
  ];

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/[0.06]"
      id="main-navbar"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          <BrandLogo onClick={onLogoClick} variant="mark" />

          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => {
              const active = activeLink === link.name;
              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={link.onClick}
                  className={`relative text-[13px] font-medium tracking-wide transition-colors cursor-pointer py-1 ${
                    active ? 'text-white' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-brand-blue rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={onAdminClick}
              className="text-[11px] text-white/25 hover:text-white/50 px-1 py-2 cursor-pointer"
            >
              Admin
            </button>
            <button
              id="btn-login"
              type="button"
              onClick={onLoginClick}
              className="text-[13px] font-medium text-white border border-white/30 hover:border-white/55 px-5 h-10 rounded-lg transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              id="btn-get-started"
              type="button"
              onClick={onGetStartedClick}
              className="text-[13px] font-semibold bg-brand-blue hover:bg-[#2a6aff] text-white px-5 h-10 rounded-lg inline-flex items-center gap-2 shadow-[0_0_24px_rgba(30,96,255,0.4)] transition-all cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            className="md:hidden text-white/70 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    link.onClick?.();
                  }}
                  className="block w-full text-left text-sm text-white/70 hover:text-white py-2.5 cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <button type="button" onClick={() => { setIsOpen(false); onLoginClick?.(); }} className="w-full border border-white/20 text-white py-2.5 rounded-md text-sm cursor-pointer">Login</button>
                <button type="button" onClick={() => { setIsOpen(false); onGetStartedClick?.(); }} className="w-full bg-brand-blue text-white py-2.5 rounded-md text-sm font-semibold cursor-pointer">Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
