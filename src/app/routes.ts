/**
 * Route configuration for VXUI React documentation app.
 * Extracted from App.tsx for better maintainability.
 */

export const DOC_PAGE_KEYS = [
  'introduction',
  'quick-start',
  'shell-sidebar',
  'grid-page',
  'nav-layout',
  'scroll-area',
  'separator',
  'resizable',
  'typography',
  'typography-base',
  'badge',
  'avatar',
  'skeleton',
  'card',
  'code-block',
  'language-switcher',
  'button',
  'elements',
  'form-controls',
  'form-inputs',
  'toggle',
  'rating',
  'label',
  'date-pickers',
  'file-upload',
  'color-picker',
  'form',
  'accordion',
  'tabs',
  'breadcrumb',
  'pagination',
  'stepper',
  'progress',
  'spinner',
  'alert',
  'toasts',
  'table',
  'data-list',
  'timeline',
  'tree-view',
  'carousel',
  'empty-states',
  'vxui-provider',
  'viewport',
  'constants',
  'calendar',
  'bottom-nav',
  'overlays',
  'data-display',
  'navigation',
  'feedback',
  'dialog',
  'sheet',
  'popover',
  'tooltip',
  'hover-card',
  'dropdown-menu',
  'context-menu',
  'command-palette',
  'navigation-menu',
  'menubar',
  'mobile',
  'mobile-list',
  'image',
  'pin-input',
  'descriptions',
  'notification',
  'result',
  'home-page',
  'login-page',
  'register-page',
  'error-page',
  'privacy-policy',
  'terms-of-service',
] as const;

export type PageKey = (typeof DOC_PAGE_KEYS)[number];
export type NavGroupKey = 'gettingStarted' | 'layout' | 'content' | 'forms' | 'components' | 'overlays' | 'navigation' | 'feedback' | 'templates' | 'mobile';
export type RouteView = 'home' | 'login' | 'register' | 'docs' | 'privacy-policy' | 'terms-of-service' | 'error';
export type ReleaseTrack = 'stable' | 'preview' | 'internal';

export interface AppRoute {
  view: RouteView;
  page?: PageKey;
  path?: string;
}

export interface PageDefinition {
  section: string;
  title: string;
  description: string;
  guidance: string[];
  props?: Array<{
    prop: string;
    type: string;
    default?: string;
    required?: boolean;
    description: string;
  }>;
}

export interface ViewerSession {
  name: string;
  mode: 'member' | 'guest';
}

export const SESSION_STORAGE_KEY = 'vxui-react-auth-session';

export type NavGroupItem = PageKey | { type: 'submenu'; key: string; i18nKey: 'layout' | 'content' | 'elements' | 'forms' | 'inputs' | 'overlays' | 'navigation' | 'feedback'; pages: PageKey[]; icon: React.ReactNode };

export function isPageKey(value: string | undefined): value is PageKey {
  return Boolean(value && DOC_PAGE_KEYS.includes(value as PageKey));
}

export function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

export function parseRoute(pathname: string): AppRoute {
  const normalized = normalizePath(pathname);

  if (normalized === '/') return { view: 'home' };
  if (normalized === '/login') return { view: 'login' };
  if (normalized === '/register') return { view: 'register' };
  if (normalized === '/privacy-policy') return { view: 'privacy-policy' };
  if (normalized === '/terms-of-service') return { view: 'terms-of-service' };
  if (normalized === '/error') return { view: 'error' };
  if (normalized === '/docs') return { view: 'docs' };

  if (normalized.startsWith('/docs/')) {
    const pageKey = normalized.split('/')[2];
    if (isPageKey(pageKey)) {
      return { view: 'docs', page: pageKey };
    }
  }

  return { view: 'error', path: normalized };
}

export function buildRoutePath(route: AppRoute) {
  switch (route.view) {
    case 'home': return '/';
    case 'login': return '/login';
    case 'register': return '/register';
    case 'privacy-policy': return '/privacy-policy';
    case 'terms-of-service': return '/terms-of-service';
    case 'error': return '/error';
    case 'docs':
    default: return route.page ? `/docs/${route.page}` : '/docs';
  }
}

export function buildMobilePreviewPath(pageKey: PageKey) {
  return `/m/docs/${pageKey}`;
}

export function loadSession(): ViewerSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ViewerSession>;
    if (typeof parsed.name === 'string' && (parsed.mode === 'member' || parsed.mode === 'guest')) {
      return { name: parsed.name, mode: parsed.mode };
    }
  } catch {
    return null;
  }
  return null;
}
