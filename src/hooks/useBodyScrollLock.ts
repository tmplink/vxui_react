import { useEffect, useRef } from 'react';

/**
 * Locks body scroll when a dialog/sheet is open.
 *
 * Features:
 * - Sets `overflow: hidden` on `document.body`
 * - Compensates for scrollbar width to prevent layout shift
 * - Supports nested dialogs via a counter (only the outermost lock applies)
 * - Restores original overflow value on unlock
 */
export function useBodyScrollLock(active: boolean) {
  const counterRef = useRef(0);

  useEffect(() => {
    if (active) {
      counterRef.current += 1;

      if (counterRef.current === 1) {
        // Only lock when the first dialog opens
        lockScroll();
      }
    } else {
      counterRef.current -= 1;

      if (counterRef.current <= 0) {
        counterRef.current = 0;
        unlockScroll();
      }
    }

    return () => {
      counterRef.current -= 1;
      if (counterRef.current <= 0) {
        counterRef.current = 0;
        unlockScroll();
      }
    };
  }, [active]);
}

// Store original values for restoration
let originalOverflow: string | null = null;
let originalPaddingRight: string | null = null;

function lockScroll() {
  const body = document.body;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  originalOverflow = body.style.overflow;
  originalPaddingRight = body.style.paddingRight;

  body.style.overflow = 'hidden';

  if (scrollbarWidth > 0) {
    const currentPadding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
}

function unlockScroll() {
  const body = document.body;

  if (originalOverflow !== null) {
    body.style.overflow = originalOverflow;
    originalOverflow = null;
  } else {
    body.style.overflow = '';
  }

  if (originalPaddingRight !== null) {
    body.style.paddingRight = originalPaddingRight;
    originalPaddingRight = null;
  } else {
    body.style.paddingRight = '';
  }
}
