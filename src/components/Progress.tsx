import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'rainbow';
  indeterminate?: boolean;
}

export function Progress({
  className,
  value = 0,
  max = 100,
  label,
  showLabel = false,
  size = 'md',
  variant = 'default',
  indeterminate = false,
  ...props
}: ProgressProps) {
  const pct = indeterminate ? undefined : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cx('vx-progress-wrap', className)} {...props}>
      {label || showLabel ? (
        <div className="vx-progress__header">
          {label ? <span className="vx-progress__label">{label}</span> : null}
          {showLabel && !indeterminate ? (
            <span className="vx-progress__value">{Math.round(pct!)}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cx(
          'vx-progress',
          `vx-progress--${size}`,
          `vx-progress--${variant}`,
          indeterminate && 'vx-progress--indeterminate',
        )}
      >
        <div
          className="vx-progress__bar"
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
