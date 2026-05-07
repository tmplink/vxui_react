import type { HTMLAttributes, ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cx } from '../lib/cx';

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  content: ReactNode;
  placement?: PopoverPlacement;
  trigger?: 'click' | 'hover';
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  content,
  placement = 'bottom',
  trigger = 'click',
  children,
  className,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const wrapRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [open, setOpen]);

  const triggerProps =
    trigger === 'click'
      ? { onClick: toggle }
      : { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) };

  return (
    <div ref={wrapRef} className={cx('vx-popover-wrap', className)} {...triggerProps}>
      {children}
      {open ? (
        <div className={cx('vx-popover', `vx-popover--${placement}`)} role="dialog">
          {content}
        </div>
      ) : null}
    </div>
  );
}
