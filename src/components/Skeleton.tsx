import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  lines?: number;
}

export function Skeleton({
  className,
  width,
  height,
  variant = 'rect',
  lines = 1,
  style,
  ...props
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className={cx('vx-skeleton-text', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="vx-skeleton vx-skeleton--text"
            style={i === lines - 1 ? { width: '70%' } : undefined}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={cx(
        'vx-skeleton',
        `vx-skeleton--${variant}`,
        className,
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}
