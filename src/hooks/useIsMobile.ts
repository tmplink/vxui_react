import { useViewport } from '../lib/viewport';

/**
 * Returns true when the device is detected as a phone based on:
 * 1. Physical screen width ≤ 1000px (CSS pixels)
 * 2. Portrait orientation (height > width)
 *
 * This avoids false positives from desktop browsers resized to small widths.
 */
export function useIsMobile(): boolean {
  const { isPhone, screenWidth, aspectRatio } = useViewport();
  
  // Primary detection: useViewport() already determined it's a phone
  if (isPhone) return true;
  
  // Additional check: portrait device with phone-like aspect ratio (< 0.75)
  // and narrow width (< 1000px) is likely a phone even if viewport says otherwise
  if (aspectRatio > 0 && aspectRatio < 0.75 && screenWidth <= 1000) {
    return true;
  }
  
  return false;
}
