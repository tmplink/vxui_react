import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseDialogStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseDialogStateReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Manages dialog open/close state with support for both controlled and uncontrolled modes.
 *
 * - Controlled: when `open` prop is provided, the dialog state is fully controlled by the parent.
 * - Uncontrolled: when `defaultOpen` is provided, the dialog manages its own state internally.
 */
export function useDialogState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: UseDialogStateProps): UseDialogStateReturn {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isOpen = isControlled ? openProp : internalOpen;
  const latestOnOpenChange = useRef(onOpenChange);
  latestOnOpenChange.current = onOpenChange;

  const setOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      if (isControlled) {
        const resolved = typeof next === 'function' ? next(openProp!) : next;
        latestOnOpenChange.current?.(resolved);
      } else {
        setInternalOpen(next);
      }
    },
    [isControlled, openProp],
  );

  // Sync internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setInternalOpen(openProp);
    }
  }, [isControlled, openProp]);

  // Notify parent on internal state changes (uncontrolled mode)
  useEffect(() => {
    if (!isControlled) {
      latestOnOpenChange.current?.(internalOpen);
    }
  }, [isControlled, internalOpen]);

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  return { isOpen, open, close, toggle };
}
