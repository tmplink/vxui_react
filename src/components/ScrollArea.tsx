import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  maxWidth?: string | number;
  children: ReactNode;
}

export function ScrollArea({
  maxHeight,
  maxWidth,
  children,
  className,
  style,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      className={cx('vx-scroll-area', className)}
      style={{
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        ...style,
      }}
      {...props}
    >
      <div className="vx-scroll-area__viewport">{children}</div>
    </div>
  );
}
