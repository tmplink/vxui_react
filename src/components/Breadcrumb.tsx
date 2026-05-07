import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

const DefaultSeparator = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cx('vx-breadcrumb', className)}>
      <ol className="vx-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="vx-breadcrumb__item">
              {isLast ? (
                <span className="vx-breadcrumb__current" aria-current="page">{item.label}</span>
              ) : item.href ? (
                <a href={item.href} className="vx-breadcrumb__link">{item.label}</a>
              ) : (
                <button type="button" className="vx-breadcrumb__link" onClick={item.onClick}>{item.label}</button>
              )}
              {!isLast ? (
                <span className="vx-breadcrumb__sep" aria-hidden="true">
                  {separator ?? <DefaultSeparator />}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
