import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type TextVariant = 'default' | 'secondary' | 'muted' | 'danger' | 'success';
type TextSize = 'sm' | 'base' | 'lg' | 'xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextElement = 'p' | 'span' | 'div';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  truncate?: boolean;
}

export function Text({
  as: Component = 'p',
  variant = 'default',
  size = 'base',
  weight = 'normal',
  truncate = false,
  className,
  ...props
}: TextProps) {
  return (
    <Component
      className={cx(
        'vx-text-component',
        `vx-text--${variant}`,
        `vx-text-size--${size}`,
        `vx-text-weight--${weight}`,
        truncate && 'vx-text--truncate',
        className
      )}
      {...props}
    />
  );
}
