import type { ReactNode } from 'react';
import { useState, useRef, useCallback } from 'react';
import { cx } from '../lib/cx';

export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface HoverCardProps {
  content: ReactNode;
  placement?: HoverCardPlacement;
  /** Delay in ms before showing */
  delay?: number;
  children: ReactNode;
  className?: string;
}

export function HoverCard({
  content,
  placement = 'bottom',
  delay = 400,
  children,
  className,
}: HoverCardProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timer.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  return (
    <span
      className={cx('vx-hovercard-wrap', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div className={cx('vx-hovercard', `vx-hovercard--${placement}`)}>
          {content}
        </div>
      )}
    </span>
  );
}
