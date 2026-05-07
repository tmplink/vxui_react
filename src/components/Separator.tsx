import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorProps) {
  return (
    <hr
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cx('vx-separator', `vx-separator--${orientation}`, className)}
      {...props}
    />
  );
}
