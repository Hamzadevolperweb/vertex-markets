import { useState, useEffect, useCallback, useRef } from 'react';
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
import { useAuth } from './auth/AuthContext';
import {
  type AppView,
  type LoginMode,
  type AppNavState,
  readNavState,
  pushNavState,
  replaceNavState,
  goBackOr,
  initNavStackDepth,
  notifyNavPop,
  normalizeTraderTab,
} from './navigation';
import type { AdminPageId } from './components/admin/adminTypes';

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

function sectionForView(view: AppView, section?: string): string | undefined {
  if (view === 'markets') return section || 'Overview';
  return section || undefined;
}

export default function App() {
  const { logout } = useAuth();
  const initialNav = readNavState();
  const [view, setView] = useState<AppView>(initialNav.view);
  const [loginInitialMode, setLoginInitialMode] = useState<LoginMode>(
    initialNav.loginMode ?? 'signin',
  );
  const [section, setSection] = useState<string | undefined>(
    sectionForView(initialNav.view, initialNav.section),
  );
  const [selectedTicker, setSelectedTicker] = useState<Ticker>(INITIAL_TICKER);
  const [adminTab, setAdminTab] = useState<AdminPageId>(
    (initialNav.view === 'admin-dashboard'
      ? (initialNav.tab as AdminPageId)
      : 'dashboard') || 'dashboard',
  );
  const [traderTab, setTraderTab] = useState<string>(
    initialNav.view === 'dashboard'
      ? normalizeTraderTab(initialNav.tab)
      : 'Overview',
  );
  const skipHistoryPush = useRef(false);

  const applyNavState = useCallback((next: AppNavState) => {
    setLoginInitialMode(next.loginMode ?? 'signin');
    setView(next.view);
    setSection(sectionForView(next.view, next.section));
    if (next.view === 'admin-dashboard') {
      setAdminTab((next.tab as AdminPageId) || 'dashboard');
    }
    if (next.view === 'dashboard') {
      setTraderTab(normalizeTraderTab(next.tab));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!window.history.state?.view) {
      replaceNavState(initialNav);
    }
    initNavStackDepth();

    const onPopState = () => {
      skipHistoryPush.current = true;
      notifyNavPop();
      applyNavState(readNavState());
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [applyNavState]);

  useEffect(() => {
    if (view !== 'landing' || !section) return;
    const id = section === 'trading' ? 'trading' : section === 'platforms' ? 'platforms' : null;
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [view, section]);

  const buildNavState = useCallback(
    (
      newView: AppView,
      mode: LoginMode = 'signin',
      options?: { tab?: string; section?: string },
    ): AppNavState => ({
      view: newView,
      loginMode: mode,
      tab:
        options?.tab ??
        (newView === 'admin-dashboard'
          ? 'dashboard'
          : newView === 'dashboard'
            ? 'Overview'
            : undefined),
      section:
        options?.section !== undefined
          ? options.section
          : sectionForView(newView, undefined),
    }),
    [],
  );

  const handleSetView = useCallback(
    (
      newView: AppView,
      mode: LoginMode = 'signin',
      options?: { tab?: string; section?: string; replace?: boolean },
    ) => {
      const nextState = buildNavState(newView, mode, options);
      const nextSection = sectionForView(newView, nextState.section);

      setLoginInitialMode(mode);
      setView(newView);
      setSection(nextSection);
      if (newView === 'admin-dashboard') {
        setAdminTab((nextState.tab as AdminPageId) || 'dashboard');
      }
      if (newView === 'dashboard') {
        setTraderTab(normalizeTraderTab(nextState.tab));
      }
      if (newView === 'landing' && !options?.section) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (newView !== 'landing') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      if (skipHistoryPush.current) {
        skipHistoryPush.current = false;
        return;
      }

      if (options?.replace) {
        replaceNavState({ ...nextState, section: nextSection });
      } else {
        pushNavState({ ...nextState, section: nextSection });
      }
    },
    [buildNavState],
  );

  const handleSetSection = useCallback(
    (nextSection: string | undefined) => {
      const resolved = nextSection || sectionForView(view, undefined);
      setSection(resolved);

      if (skipHistoryPush.current) {
        skipHistoryPush.current = false;
        return;
      }

      pushNavState({
        view,
        loginMode: loginInitialMode,
        tab:
          view === 'admin-dashboard'
            ? adminTab
            : view === 'dashboard'
              ? traderTab
              : undefined,
        section: resolved,
      });
    },
    [view, loginInitialMode, adminTab, traderTab],
  );

  const handleAdminNavigate = useCallback((page: AdminPageId) => {
    setAdminTab(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (skipHistoryPush.current) {
      skipHistoryPush.current = false;
      return;
    }
    pushNavState({
      view: 'admin-dashboard',
      loginMode: 'signin',
      tab: page,
      section: undefined,
    });
  }, []);

  const handleTraderNavigate = useCallback((tab: string) => {
    const canonical = normalizeTraderTab(tab);
    setTraderTab(canonical);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (skipHistoryPush.current) {
      skipHistoryPush.current = false;
      return;
    }
    pushNavState({
      view: 'dashboard',
      loginMode: 'signin',
      tab: canonical,
      section: undefined,
    });
  }, []);

  const handleLoginModeChange = useCallback((mode: LoginMode) => {
    setLoginInitialMode(mode);
    if (skipHistoryPush.current) {
      skipHistoryPush.current = false;
      return;
    }
    pushNavState({ view: 'login', loginMode: mode, section: undefined });
  }, []);

  const handleBack = useCallback(() => {
    goBackOr(() => handleSetView('landing'));
  }, [handleSetView]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      handleSetView('landing', 'signin', { replace: true });
    }
  };

  const scrollToLandingSection = useCallback(
    (target: 'trading' | 'platforms') => {
      if (view === 'landing') {
        handleSetSection(target);
      } else {
        handleSetView('landing', 'signin', { section: target });
      }
    },
    [view, handleSetSection, handleSetView],
  );

  if (view === 'admin') {
    return (
      <AdminLogin
        onBackToHome={handleBack}
        onLoginSuccess={() => handleSetView('admin-dashboard', 'signin')}
      />
    );
  }

  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        activePage={adminTab}
        onNavigate={handleAdminNavigate}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage
        onBackToHome={handleBack}
        initialMode={loginInitialMode}
        onModeChange={handleLoginModeChange}
        onLoginSuccess={(user) =>
          handleSetView(
            user.role === 'Admin' ? 'admin-dashboard' : 'dashboard',
            'signin',
            { replace: true },
          )
        }
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <TraderDashboard
        onLogout={handleLogout}
        activeTab={traderTab}
        onNavigate={handleTraderNavigate}
      />
    );
  }

  const marketsFilter =
    section && section !== 'Overview' ? section : section || 'Overview';

  return (
    <div className="min-h-screen bg-black text-[#f4f4f5] overflow-x-hidden antialiased">
      <div className="absolute top-0 left-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent pointer-events-none" />

      <Navbar
        onLoginClick={() => handleSetView('login', 'signin')}
        onGetStartedClick={() => handleSetView('login', 'signup')}
        onLogoClick={() => handleSetView('landing')}
        onAdminClick={() => handleSetView('admin')}
        onMarketsClick={() => handleSetView('markets')}
        onResourcesClick={() => handleSetView('resources')}
        onCompanyClick={() => handleSetView('company')}
        onPartnersClick={() => handleSetView('partners')}
        onTradingClick={() => scrollToLandingSection('trading')}
        onPlatformsClick={() => scrollToLandingSection('platforms')}
        activeLink={
          view === 'markets'
            ? 'Markets'
            : view === 'resources'
              ? 'Resources'
              : view === 'company'
                ? 'Company'
                : view === 'partners'
                  ? 'Partners'
                  : view === 'landing'
                    ? 'Trading'
                    : ''
        }
      />

      <main className="relative pt-[72px]">
        {view === 'markets' ? (
          <MarketsPage
            onGetStartedClick={() => handleSetView('login', 'signup')}
            activeFilter={marketsFilter}
            onFilterChange={(filter) => handleSetSection(filter)}
            onTradeClick={(ticker) => {
              setSelectedTicker({
                symbol: ticker.symbol,
                name: ticker.name,
                price: ticker.price,
                change: ticker.change,
                sparkline: ticker.sparkline,
                high: ticker.price * 1.015,
                low: ticker.price * 0.985,
                digits: ticker.symbol.includes('JPY') ? 3 : 5,
              });
              handleSetView('login', 'signin');
            }}
          />
        ) : view === 'resources' ? (
          <ResourcesPage onGetStartedClick={() => handleSetView('login', 'signup')} />
        ) : view === 'company' ? (
          <CompanyPage
            onGetStartedClick={() => handleSetView('login', 'signup')}
            activeSection={section ?? null}
            onSectionChange={(s) => handleSetSection(s ?? undefined)}
          />
        ) : view === 'partners' ? (
          <PartnersPage
            onGetStartedClick={() => handleSetView('login', 'signup')}
            activeSection={section ?? null}
            onSectionChange={(s) => handleSetSection(s ?? undefined)}
          />
        ) : (
          <>
            <div id="trading">
              <HeroSection
                onOpenDemoClick={() => handleSetView('login', 'signup')}
                onGetStartedClick={() => handleSetView('login', 'signup')}
              />
            </div>
            <RegulatoryBar />
            <AdvantagesGrid />
            <TickerBar />
            <div id="platforms">
              <PlatformsSection
                selectedTicker={selectedTicker}
                onTickerSelect={setSelectedTicker}
                onExploreClick={() => handleSetView('login', 'signup')}
              />
            </div>
            <BottomCTA
              onGetStartedClick={() => handleSetView('login', 'signup')}
              onDemoClick={() => handleSetView('login', 'signup')}
            />
          </>
        )}
      </main>
    </div>
  );
}
