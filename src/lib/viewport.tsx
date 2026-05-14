import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type ViewportType = 'phone' | 'tablet' | 'desktop';

export interface ViewportContextValue {
  viewport: ViewportType;
  isPhone: boolean;
  isTablet: boolean;
  /** True when the device is in the tablet width range AND screen orientation is portrait */
  isTabletPortrait: boolean;
  isDesktop: boolean;
}

// ─── Breakpoints ────────────────────────────────────────────────────────────

const PHONE_MAX = 767;   // ≤ 767px  → phone
const TABLET_MAX = 1023; // 768–1023px → tablet

function resolveViewport(): ViewportType {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w <= PHONE_MAX) return 'phone';
  if (w <= TABLET_MAX) return 'tablet';
  return 'desktop';
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ViewportContext = createContext<ViewportContextValue>({
  viewport: 'desktop',
  isPhone: false,
  isTablet: false,
  isTabletPortrait: false,
  isDesktop: true,
});

// ─── Provider ────────────────────────────────────────────────────────────────

export interface ViewportProviderProps {
  children: ReactNode;
}

function isPortraitNow(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
}

export function ViewportProvider({ children }: ViewportProviderProps) {
  // Synchronously read viewport on first render to avoid layout flash
  const [viewport, setViewport] = useState<ViewportType>(resolveViewport);
  const [portrait, setPortrait] = useState<boolean>(isPortraitNow);

  useEffect(() => {
    // Keep in sync when window is resized or orientation changes
    const onResize = () => {
      const next = resolveViewport();
      setViewport((prev) => (prev === next ? prev : next));
      const nextPortrait = isPortraitNow();
      setPortrait((prev) => (prev === nextPortrait ? prev : nextPortrait));
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isTablet = viewport === 'tablet';

  const value: ViewportContextValue = {
    viewport,
    isPhone: viewport === 'phone',
    isTablet,
    isTabletPortrait: isTablet && portrait,
    isDesktop: viewport === 'desktop',
  };

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useViewport(): ViewportContextValue {
  return useContext(ViewportContext);
}
