import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  PHONE_MAX_WIDTH,
  PHONE_ASPECT_RATIO_THRESHOLD,
  TABLET_ASPECT_RATIO_THRESHOLD,
} from './breakpoints';

// ─── Types ─────────────────────────────────────────────────────────────────

export type ViewportType = 'phone' | 'tablet' | 'desktop';

export interface ViewportContextValue {
  viewport: ViewportType;
  isPhone: boolean;
  isTablet: boolean;
  /** True when the device is in the tablet width range AND screen orientation is portrait */
  isTabletPortrait: boolean;
  isDesktop: boolean;
  /** The actual screen width in CSS pixels */
  screenWidth: number;
  /** The actual screen height in CSS pixels */
  screenHeight: number;
  /** Aspect ratio: width / height (0-1 for portrait, >1 for landscape) */
  aspectRatio: number;
}

/**
 * Detects device type based on screen physical dimensions and aspect ratio.
 *
 * Detection logic:
 * 1. Use PHYSICAL screen size (window.screen) to determine device category
 *    - This prevents false positives when desktop browsers are resized
 * 2. Physical width ≤ PHONE_MAX_WIDTH → phone or tablet (depends on orientation)
 * 3. Physical width > PHONE_MAX_WIDTH → desktop (even if viewport is small)
 *
 * Note: window.screen.width/height returns physical screen dimensions in CSS pixels.
 * These values do NOT change when the device rotates or the browser window resizes.
 */
function resolveViewport(): ViewportType {
  if (typeof window === 'undefined') return 'desktop';
  
  // Use PHYSICAL screen dimensions for device detection
  const physicalWidth = window.screen.width;
  const physicalHeight = window.screen.height;
  
  // If physical width > PHONE_MAX_WIDTH, it's definitely not a phone
  // (desktop browsers might be resized, but physical screen stays large)
  if (physicalWidth > PHONE_MAX_WIDTH) {
    return 'desktop';
  }
  
  // Physical width ≤ PHONE_MAX_WIDTH: could be phone or tablet
  // Use aspect ratio to differentiate:
  // - Phones are typically narrow (aspect ratio < threshold)
  // - Tablets are wider (aspect ratio >= threshold)
  const aspectRatio = physicalWidth / physicalHeight;
  
  if (aspectRatio < PHONE_ASPECT_RATIO_THRESHOLD) {
    return 'phone';
  }
  
  return 'tablet';
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ViewportContext = createContext<ViewportContextValue>({
  viewport: 'desktop',
  isPhone: false,
  isTablet: false,
  isTabletPortrait: false,
  isDesktop: true,
  screenWidth: 0,
  screenHeight: 0,
  aspectRatio: 0,
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

    // Listen for orientation changes using matchMedia (more reliable than orientationchange event)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const portraitQuery = window.matchMedia('(orientation: portrait)');
      const handleOrientationChange = () => {
        const nextPortrait = portraitQuery.matches;
        setPortrait((prev) => (prev === nextPortrait ? prev : nextPortrait));
        // Re-evaluate viewport type after orientation change
        const next = resolveViewport();
        setViewport((prev) => (prev === next ? prev : next));
      };

      portraitQuery.addEventListener('change', handleOrientationChange);
      return () => {
        window.removeEventListener('resize', onResize);
        portraitQuery.removeEventListener('change', handleOrientationChange);
      };
    }

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isTablet = viewport === 'tablet';

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const aspectRatio = screenWidth / screenHeight;

  const value: ViewportContextValue = {
    viewport,
    isPhone: viewport === 'phone',
    isTablet,
    isTabletPortrait: isTablet && portrait,
    isDesktop: viewport === 'desktop',
    screenWidth,
    screenHeight,
    aspectRatio,
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
