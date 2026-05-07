import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 36 };

export function Spinner({ className, size = 'md', label = 'Loading…', ...props }: SpinnerProps) {
  const s = sizeMap[size];
  return (
    <span
      role="status"
      aria-label={label}
      className={cx('vx-spinner', `vx-spinner--${size}`, className)}
      {...props}
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="42 14"
        />
      </svg>
    </span>
  );
}
