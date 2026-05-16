import { useState, useEffect, type RefObject } from 'react';

/**
 * Determines whether a dropdown should open upward to avoid viewport overflow.
 * @param ref - ref to the wrapper/container element
 * @param open - whether the dropdown is currently open
 * @param dropdownHeight - estimated max height of the dropdown in px (used as threshold)
 */
export function useDropDirection(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  dropdownHeight = 260,
): 'down' | 'up' {
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  useEffect(() => {
    if (!open || !ref.current) {
      setDirection('down');
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDirection('up');
    } else {
      setDirection('down');
    }
  }, [open, ref, dropdownHeight]);

  return direction;
}
