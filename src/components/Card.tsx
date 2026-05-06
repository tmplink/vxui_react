import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cx('vx-card', className)} {...props} />;
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
