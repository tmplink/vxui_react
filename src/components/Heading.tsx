import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingVariant = 'default' | 'secondary';
type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: `h${HeadingLevel}`;
  level?: HeadingLevel;
  variant?: HeadingVariant;
  weight?: HeadingWeight;
  truncate?: boolean;
}

export function Heading({
  as,
  level = 2,
  variant = 'default',
  weight = 'bold',
  truncate = false,
  className,
  ...props
}: HeadingProps) {
  const Component = as || `h${level}`;

  return (
    <Component
      className={cx(
        'vx-heading',
        `vx-heading--h${level}`,
        `vx-heading--${variant}`,
        `vx-heading-weight--${weight}`,
        truncate && 'vx-text--truncate',
        className
      )}
      {...props}
    />
  );
}
