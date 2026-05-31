import { useViewport } from '../lib/viewport';
import { TABLET_ASPECT_RATIO_THRESHOLD, PHONE_MAX_WIDTH } from '../lib/breakpoints';

/**
 * Returns true when the device is detected as a phone based on:
 * 1. Physical screen width ≤ PHONE_MAX_WIDTH (CSS pixels)
 * 2. Portrait orientation (height > width)
 *
 * This avoids false positives from desktop browsers resized to small widths.
 */
export function useIsMobile(): boolean {
  const { isPhone, screenWidth, aspectRatio } = useViewport();
  
  // Primary detection: useViewport() already determined it's a phone
  if (isPhone) return true;
  
  // Additional check: portrait device with phone-like aspect ratio (< threshold)
  // and narrow width (<= PHONE_MAX_WIDTH) is likely a phone even if viewport says otherwise
  if (aspectRatio > 0 && aspectRatio < TABLET_ASPECT_RATIO_THRESHOLD && screenWidth <= PHONE_MAX_WIDTH) {
    return true;
  }
  
  return false;
}
