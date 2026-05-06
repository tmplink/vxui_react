import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return <span className={cx('vx-badge', `vx-badge--${variant}`, className)} {...props} />;
}
