import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: ReactNode;
  /** 数字或字符串角标，超过 99 建议传 '99+' */
  badge?: string | number;
  active?: boolean;
  onSelect?: () => void;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  return (
    <nav className={cx('vxm-bottomnav', className)} aria-label="底部导航">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={cx('vxm-bottomnav__item', item.active && 'vxm-bottomnav__item--active')}
          onClick={item.onSelect}
          aria-current={item.active ? 'page' : undefined}
        >
          <span className="vxm-bottomnav__icon">
            {item.icon}
            {item.badge != null && (
              <span className="vxm-bottomnav__badge" aria-label={`${item.badge} 条未读`}>
                {item.badge}
              </span>
            )}
          </span>
          <span className="vxm-bottomnav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
