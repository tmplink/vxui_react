import type { HTMLAttributes, ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cx } from '../lib/cx';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, placement = 'top', delay = 600, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timer.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <span className={cx('vx-tooltip-wrap', className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible ? (
        <span role="tooltip" className={cx('vx-tooltip', `vx-tooltip--${placement}`)}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
