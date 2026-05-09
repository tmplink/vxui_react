import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cx('vx-empty-state', className)} role="status" aria-live="polite">
      {icon && (
        <div className="vx-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="vx-empty-state__title">{title}</p>
      {description && <p className="vx-empty-state__description">{description}</p>}
      {action && <div className="vx-empty-state__action">{action}</div>}
    </div>
  );
}
