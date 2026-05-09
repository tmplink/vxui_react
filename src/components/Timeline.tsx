import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export type TimelineItemStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface TimelineItem {
  title: string;
  description?: string;
  time?: string;
  icon?: ReactNode;
  status?: TimelineItemStatus;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx('vx-timeline', className)} aria-label="Timeline">
      {items.map((item, i) => (
        <li
          key={i}
          className={cx(
            'vx-timeline__item',
            item.status && `vx-timeline__item--${item.status}`,
          )}
        >
          <div className="vx-timeline__dot" aria-hidden="true">
            {item.icon ?? null}
          </div>
          <div className="vx-timeline__body">
            <div className="vx-timeline__header">
              <span className="vx-timeline__title">{item.title}</span>
              {item.time && <span className="vx-timeline__time">{item.time}</span>}
            </div>
            {item.description && (
              <p className="vx-timeline__description">{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
