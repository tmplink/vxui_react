/**
 * DesktopAppShell — 桌面端应用壳层
 * 包含路由状态管理、会话管理、UI 状态和副作用
 */
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { useToast } from '../components/Toast';
import { DesktopApp } from './DesktopApp';
import {
  parseRoute, buildRoutePath, loadSession, SESSION_STORAGE_KEY,
  type AppRoute, type ReleaseTrack, type ViewerSession,
} from './routes';

export function DesktopAppShell() {
  const { t } = useI18n();
  const { push } = useToast();

  // ── 路由状态 ──
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return { view: 'home' };
    return parseRoute(window.location.pathname);
  });

  // ── 会话状态 ──
  const [viewerSession, setViewerSession] = useState<ViewerSession | null>(loadSession);

  // ── UI 状态 ──
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);
  const [releaseTrack, setReleaseTrack] = useState<ReleaseTrack>('stable');

  // ── 副作用 ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const parsed = parseRoute(window.location.pathname);
    if (!(parsed.view === 'error' && parsed.path && parsed.path !== '/error')) {
      const canonicalPath = buildRoutePath(parsed);
      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState(parsed, '', canonicalPath);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
      setMobileNavOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false);
      } else {
        setMobileNavOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setTimeout(() => {
      const scrollable = document.querySelector('.vx-shell__content');
      if (scrollable) {
        scrollable.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }, 50);
  }, [route.view, route.page]);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ── 路由导航 ──
  function navigate(nextRoute: AppRoute, options?: { replace?: boolean }) {
    setRoute(nextRoute);
    if (typeof window === 'undefined') return;
    if (nextRoute.view === 'error' && nextRoute.path && nextRoute.path !== '/error') return;
    const nextPath = buildRoutePath(nextRoute);
    if (window.location.pathname === nextPath) return;
    const method = options?.replace ? 'replaceState' : 'pushState';
    window.history[method](nextRoute, '', nextPath);
  }

  function goBack(fallback: AppRoute) {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate(fallback, { replace: true });
  }

  // ── 会话管理 ──
  function persistSession(session: ViewerSession | null) {
    setViewerSession(session);
    if (typeof window === 'undefined') return;
    if (session) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return;
    }
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  function handleLogin(payload: { email: string; password: string; remember: boolean }) {
    const session = { name: payload.email.split('@')[0] || 'member', mode: 'member' as const };
    persistSession(session);
    push({ tone: 'success', title: t.publicPages.sessionLoginTitle, description: t.publicPages.sessionLoginBody });
    navigate({ view: 'docs', page: 'introduction' });
  }

  function handleRegister(payload: { name: string; email: string; password: string }) {
    persistSession({ name: payload.name, mode: 'member' });
    push({ tone: 'success', title: t.publicPages.sessionRegisterTitle, description: t.publicPages.sessionRegisterBody });
    navigate({ view: 'docs', page: 'introduction' });
  }

  function handleGuest() {
    persistSession({ name: t.publicPages.guestLabel, mode: 'guest' });
    push({ tone: 'info', title: t.publicPages.sessionGuestTitle, description: t.publicPages.sessionGuestBody });
    navigate({ view: 'docs', page: 'introduction' });
  }

  function handleLogout() {
    persistSession(null);
    push({ tone: 'info', title: t.publicPages.sessionLogoutTitle, description: t.publicPages.sessionLogoutBody });
    navigate({ view: 'home' });
  }

  return (
    <DesktopApp
      route={route}
      onNavigate={navigate}
      onMobileNavToggle={() => setMobileNavOpen((current) => !current)}
      mobileNavOpen={mobileNavOpen}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
      searchOpen={searchOpen}
      onSearchOpenChange={setSearchOpen}
      compactDensity={compactDensity}
      onCompactDensityChange={setCompactDensity}
      releaseTrack={releaseTrack}
      onReleaseTrackChange={setReleaseTrack}
      viewerSession={viewerSession}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onGuest={handleGuest}
      onLogout={handleLogout}
    />
  );
}
