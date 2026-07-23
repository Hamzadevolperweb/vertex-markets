import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RegulatoryBar from './components/RegulatoryBar';
import AdvantagesGrid from './components/AdvantagesGrid';
import TickerBar from './components/TickerBar';
import PlatformsSection from './components/PlatformsSection';
import BottomCTA from './components/BottomCTA';
import LoginPage from './components/LoginPage';
import TraderDashboard from './components/TraderDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MarketsPage from './components/MarketsPage';
import ResourcesPage from './components/ResourcesPage';
import CompanyPage from './components/CompanyPage';
import PartnersPage from './components/PartnersPage';
import { Ticker } from './types';

// Default starting ticker
const INITIAL_TICKER: Ticker = {
  symbol: 'EURUSD',
  name: 'Euro / US Dollar',
  price: 1.08945,
  change: 0.47,
  sparkline: [1.085, 1.086, 1.084, 1.087, 1.088, 1.089, 1.08945],
  high: 1.09100,
  low: 1.08320,
  digits: 5,
};

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'admin' | 'admin-dashboard' | 'markets' | 'resources' | 'company' | 'partners'>('landing');
  const [loginInitialMode, setLoginInitialMode] = useState<'signin' | 'signup'>('signin');
  const [selectedTicker, setSelectedTicker] = useState<Ticker>(INITIAL_TICKER);

  const handleTickerSelect = (ticker: Ticker) => {
    setSelectedTicker(ticker);
    
    // Smooth scroll directly to the terminal simulator if user clicks a ticker in the tickerbar
    const terminalEl = document.getElementById('platforms');
    if (terminalEl) {
      terminalEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch views and scroll instantly to top for best user experience
  const handleSetView = (newView: 'landing' | 'login' | 'dashboard' | 'admin' | 'admin-dashboard' | 'markets' | 'resources' | 'company' | 'partners', mode: 'signin' | 'signup' = 'signin') => {
    setLoginInitialMode(mode);
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (view === 'admin') {
    return (
      <AdminLogin 
        onBackToHome={() => handleSetView('landing')}
        onLoginSuccess={() => handleSetView('admin-dashboard')}
      />
    );
  }

  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard 
        onLogout={() => handleSetView('landing')}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage 
        onBackToHome={() => handleSetView('landing')} 
        initialMode={loginInitialMode}
        onLoginSuccess={() => handleSetView('dashboard')}
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <TraderDashboard 
        onLogout={() => handleSetView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] overflow-x-hidden antialiased">
      {/* Decorative top backlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent pointer-events-none" />
      
      {/* Navbar overlay */}
      <Navbar 
        onLoginClick={() => handleSetView('login', 'signin')} 
        onGetStartedClick={() => handleSetView('login', 'signup')}
        onLogoClick={() => handleSetView('landing')}
        onAdminClick={() => handleSetView('admin')}
        onMarketsClick={() => handleSetView('markets')}
        onResourcesClick={() => handleSetView('resources')}
        onCompanyClick={() => handleSetView('company')}
        onPartnersClick={() => handleSetView('partners')}
        onTradingClick={() => {
          handleSetView('landing');
          setTimeout(() => {
            const el = document.getElementById('trading');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onPlatformsClick={() => {
          handleSetView('landing');
          setTimeout(() => {
            const el = document.getElementById('platforms');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        activeLink={view === 'markets' ? 'Markets' : view === 'resources' ? 'Resources' : view === 'company' ? 'Company' : view === 'partners' ? 'Partners' : view === 'landing' ? 'Trading' : ''}
      />

      <main className="relative pt-20">
        {view === 'markets' ? (
          <MarketsPage 
            onGetStartedClick={() => handleSetView('login', 'signup')}
            onTradeClick={(ticker) => {
              setSelectedTicker({
                symbol: ticker.symbol,
                name: ticker.name,
                price: ticker.price,
                change: ticker.change,
                sparkline: ticker.sparkline,
                high: ticker.price * 1.015,
                low: ticker.price * 0.985,
                digits: ticker.symbol.includes('JPY') ? 3 : 5
              });
              handleSetView('login', 'signin');
            }}
          />
        ) : view === 'resources' ? (
          <ResourcesPage 
            onGetStartedClick={() => handleSetView('login', 'signup')}
          />
        ) : view === 'company' ? (
          <CompanyPage 
            onGetStartedClick={() => handleSetView('login', 'signup')}
          />
        ) : view === 'partners' ? (
          <PartnersPage 
            onGetStartedClick={() => handleSetView('login', 'signup')}
          />
        ) : (
          <>
            {/* 1. Hero Landing Presentation Section */}
            <div id="trading">
              <HeroSection onOpenDemoClick={() => handleSetView('login', 'signup')} />
            </div>

            {/* 2. Trusted Regulatory badging strip */}
            <RegulatoryBar />

            {/* 3. Ticker strip with dynamic flashing prices and charts */}
            <TickerBar 
              onTickerSelect={handleTickerSelect} 
              activeSymbol={selectedTicker.symbol} 
            />

            {/* 4. Core Value Proposition Grid with premium coded SVG 3D components */}
            <AdvantagesGrid />

            {/* 5. Platform tabs & Live Simulation Terminal Widget */}
            <div id="platforms">
              <PlatformsSection 
                selectedTicker={selectedTicker}
                onTickerSelect={setSelectedTicker}
              />
            </div>

            {/* 6. Ready to Elevate footer cta section */}
            <BottomCTA onGetStartedClick={() => handleSetView('login', 'signup')} />
          </>
        )}
      </main>
    </div>
  );
}

