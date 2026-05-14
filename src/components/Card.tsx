import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type CardVariant = 'default' | 'flat' | 'elevated' | 'outlined' | 'ghost' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style preset */
  variant?: CardVariant;
  /** Inner padding size */
  padding?: CardPadding;
  /** Add a hover lift effect — useful for clickable cards */
  hoverable?: boolean;
}

export function Card({ className, variant = 'default', padding, hoverable = false, ...props }: CardProps) {
  return (
    <section
      className={cx(
        'vx-card',
        variant !== 'default' && `vx-card--${variant}`,
        padding && `vx-card--pad-${padding}`,
        hoverable && 'vx-card--hoverable',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <header className={cx('vx-card__header', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx('vx-card__title', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('vx-card__description', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('vx-card__content', className)} {...props} />;
}
