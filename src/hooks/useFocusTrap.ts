import { useEffect, useRef, type RefObject } from 'react';

/**
 * Focusable element selector matching interactive elements.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled]):not([aria-hidden="true"])',
  'input:not([disabled]):not([aria-hidden="true"])',
  'textarea:not([disabled]):not([aria-hidden="true"])',
  'select:not([disabled]):not([aria-hidden="true"])',
  '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
  'area[href]',
  'iframe',
  'object',
  'embed',
].join(', ');

export interface UseFocusTrapOptions {
  /** When true, the focus trap is active. */
  active: boolean;
  /**
   * If true, auto-focus the first focusable element inside the container on activation.
   * Default: true
   */
  autoFocus?: boolean;
  /**
   * Callback fired when the focus trap is first activated and auto-focus happens.
   * Return false to prevent default auto-focus behavior.
   */
  onMountAutoFocus?: (e: Event) => void;
  /**
   * Callback fired when the focus trap is deactivated and focus is restored.
   * Return false to prevent default restore behavior.
   */
  onUnmountAutoFocus?: (e: Event) => void;
}

/**
 * Traps keyboard focus within a container element.
 *
 * - On activation, auto-focuses the first focusable element.
 * - Tab / Shift+Tab cycles through focusable elements within the container.
 * - On deactivation, restores focus to the previously active element.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions,
) {
  const { active, autoFocus = true, onMountAutoFocus, onUnmountAutoFocus } = options;
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      // Restore focus to the previously active element
      if (previousActiveElement.current && document.contains(previousActiveElement.current)) {
        const prev = previousActiveElement.current;
        const event = new Event('focusrestore');
        const shouldRestore = onUnmountAutoFocus?.(event) ?? true;
        if (shouldRestore) {
          // Use requestAnimationFrame to ensure the DOM is ready
          requestAnimationFrame(() => {
            prev.focus({ preventScroll: true });
          });
        }
      }
      previousActiveElement.current = null;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Save the currently focused element before we trap focus
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    // Auto-focus the first focusable element inside the container
    if (autoFocus) {
      const event = new Event('focusauto');
      const shouldAutoFocus = onMountAutoFocus?.(event) ?? true;
      if (shouldAutoFocus) {
        const firstFocusable = getFirstFocusable(container);
        if (firstFocusable) {
          firstFocusable.focus({ preventScroll: true });
        } else {
          // Fallback: focus the container itself if it has a tabIndex
          container.focus({ preventScroll: true });
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

      if (e.shiftKey) {
        // Shift+Tab: if at the first element, wrap to the last
        if (currentIndex <= 0) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else {
        // Tab: if at the last element, wrap to the first
        if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, autoFocus, containerRef, onMountAutoFocus, onUnmountAutoFocus]);
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
}
