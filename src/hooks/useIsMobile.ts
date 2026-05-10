import { useViewport } from '../lib/viewport';

/**
 * Returns true when the current viewport is 'phone' (≤767px).
 * Thin alias over useViewport() kept for backward-compat.
 */
export function useIsMobile(): boolean {
  return useViewport().isPhone;
}
