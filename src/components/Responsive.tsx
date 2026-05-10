import type { ReactNode } from 'react';
import { useViewport } from '../lib/viewport';

export interface ResponsiveProps {
  /** Rendered on desktop (≥1024px) and, when tablet is omitted, on tablet too */
  desktop: ReactNode;
  /** Rendered on phone (≤767px) */
  mobile: ReactNode;
  /**
   * Rendered on tablet (768–1023px).
   * When omitted, the desktop node is used instead.
   */
  tablet?: ReactNode;
}

/**
 * Renders the correct subtree based on the current viewport.
 * Viewport detection is synchronous on first render so there is no flash.
 *
 * Usage:
 * ```tsx
 * <Responsive
 *   desktop={<AppShell>…</AppShell>}
 *   mobile={<MobileApp />}
 * />
 * ```
 */
export function Responsive({ desktop, mobile, tablet }: ResponsiveProps) {
  const { viewport } = useViewport();

  if (viewport === 'phone') return <>{mobile}</>;
  if (viewport === 'tablet') return <>{tablet ?? desktop}</>;
  return <>{desktop}</>;
}
