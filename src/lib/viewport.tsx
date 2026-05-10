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
  isDesktop: true,
});

// ─── Provider ────────────────────────────────────────────────────────────────

export interface ViewportProviderProps {
  children: ReactNode;
}

export function ViewportProvider({ children }: ViewportProviderProps) {
  // Synchronously read viewport on first render to avoid layout flash
  const [viewport, setViewport] = useState<ViewportType>(resolveViewport);

  useEffect(() => {
    // Keep in sync when window is resized
    const onResize = () => {
      const next = resolveViewport();
      setViewport((prev) => (prev === next ? prev : next));
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const value: ViewportContextValue = {
    viewport,
    isPhone: viewport === 'phone',
    isTablet: viewport === 'tablet',
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
