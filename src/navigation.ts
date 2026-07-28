export type AppView =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'admin'
  | 'admin-dashboard'
  | 'markets'
  | 'resources'
  | 'company'
  | 'partners';

export type LoginMode = 'signin' | 'signup';

export type AppNavState = {
  view: AppView;
  loginMode?: LoginMode;
  /** Admin sidebar page or trader dashboard tab */
  tab?: string;
  /** In-page overlay, filter, or scroll target (e.g. company modal, markets filter) */
  section?: string;
};

const VIEW_PATHS: Record<AppView, string> = {
  landing: '/',
  login: '/login',
  dashboard: '/dashboard',
  admin: '/admin',
  'admin-dashboard': '/admin/dashboard',
  markets: '/markets',
  resources: '/resources',
  company: '/company',
  partners: '/partners',
};

const PATH_TO_VIEW_ENTRIES = Object.entries(VIEW_PATHS).sort(
  ([, a], [, b]) => b.length - a.length,
);

/** Map legacy tab labels to canonical URL/history values */
const TRADER_TAB_ALIASES: Record<string, string> = {
  Markets: 'Trade',
  KYC: 'KYCVerification',
  Funds: 'Deposit',
};

export function normalizeTraderTab(tab: string | undefined): string {
  if (!tab) return 'Overview';
  return TRADER_TAB_ALIASES[tab] ?? tab;
}

function matchViewFromPath(pathname: string): AppView {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  for (const [view, path] of PATH_TO_VIEW_ENTRIES) {
    if (normalized === path) return view as AppView;
  }
  return 'landing';
}

function defaultTab(view: AppView): string | undefined {
  if (view === 'admin-dashboard') return 'dashboard';
  if (view === 'dashboard') return 'Overview';
  return undefined;
}

function defaultSection(view: AppView): string | undefined {
  if (view === 'markets') return 'Overview';
  return undefined;
}

function resolveNavState(partial: AppNavState): AppNavState {
  const view = partial.view;
  const loginMode = partial.loginMode ?? 'signin';
  const tab = partial.tab ?? defaultTab(view);
  const normalizedTab =
    view === 'dashboard' ? normalizeTraderTab(tab) : tab;
  const section = partial.section ?? defaultSection(view);
  return { view, loginMode, tab: normalizedTab, section };
}

export function stateToUrl(state: AppNavState): string {
  const resolved = resolveNavState(state);
  const base = VIEW_PATHS[resolved.view] ?? '/';
  const params = new URLSearchParams();

  if (resolved.view === 'login' && resolved.loginMode === 'signup') {
    params.set('mode', 'signup');
  }

  const defTab = defaultTab(resolved.view);
  if (resolved.tab && defTab && resolved.tab !== defTab) {
    params.set('tab', resolved.tab);
  }

  const defSection = defaultSection(resolved.view);
  if (resolved.section && resolved.section !== defSection) {
    params.set('section', resolved.section);
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function viewToUrl(
  view: AppView,
  loginMode: LoginMode = 'signin',
  tab?: string,
  section?: string,
): string {
  return stateToUrl({ view, loginMode, tab, section });
}

export function parseLocation(pathname: string, search: string): AppNavState {
  const view = matchViewFromPath(pathname);
  const params = new URLSearchParams(search);
  const loginMode = params.get('mode') === 'signup' ? 'signup' : 'signin';
  const tabParam = params.get('tab');
  const tab = tabParam || defaultTab(view);
  const sectionParam = params.get('section');
  const section = sectionParam ?? defaultSection(view);

  const normalizedTab =
    view === 'dashboard' ? normalizeTraderTab(tab) : tab;

  return {
    view,
    loginMode,
    tab: normalizedTab,
    section,
  };
}

export function readNavState(): AppNavState {
  if (typeof window === 'undefined') {
    return { view: 'landing', loginMode: 'signin' };
  }
  return parseLocation(window.location.pathname, window.location.search);
}

function currentUrl(): string {
  return `${window.location.pathname}${window.location.search}`;
}

/** Tracks SPA history depth so back doesn't leave the site unexpectedly. */
let navStackDepth = 0;

export function initNavStackDepth() {
  navStackDepth = 1;
}

export function notifyNavPop() {
  navStackDepth = Math.max(1, navStackDepth - 1);
}

/** Returns false if URL is unchanged (no history entry needed). */
export function pushNavState(state: AppNavState): boolean {
  const resolved = resolveNavState(state);
  const url = stateToUrl(resolved);
  if (url === currentUrl()) return false;

  window.history.pushState(resolved, '', url);
  navStackDepth += 1;
  return true;
}

export function replaceNavState(state: AppNavState) {
  const resolved = resolveNavState(state);
  window.history.replaceState(resolved, '', stateToUrl(resolved));
}

export function goBackOr(fallback: () => void) {
  if (navStackDepth > 1) {
    window.history.back();
  } else {
    fallback();
  }
}
