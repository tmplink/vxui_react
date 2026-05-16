import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface BottomNavSubMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
}

export interface BottomNavItem {
  key: string;
  label: string;
  icon: ReactNode;
  /** 数字或字符串角标，超过 99 建议传 '99+' */
  badge?: string | number;
  active?: boolean;
  onSelect?: () => void;
  /** 子菜单项，有值时点击 item 将弹出子菜单而非直接触发 onSelect */
  submenu?: BottomNavSubMenuItem[];
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openItem = openKey ? items.find(i => i.key === openKey) : null;

  const handleItemClick = (item: BottomNavItem) => {
    if (item.submenu?.length) {
      setOpenKey(prev => (prev === item.key ? null : item.key));
    } else {
      setOpenKey(null);
      item.onSelect?.();
    }
  };

  return (
    <div className="vxm-bottomnav-wrap">
      {openKey && openItem?.submenu && (
        <>
          <div
            className="vxm-bottomnav__scrim"
            onClick={() => setOpenKey(null)}
            aria-hidden="true"
          />
          <div className="vxm-bottomnav__submenu" role="menu">
            {openItem.submenu.map(sub => (
              <button
                key={sub.key}
                type="button"
                role="menuitem"
                className="vxm-bottomnav__submenu-item"
                onClick={() => { sub.onSelect?.(); setOpenKey(null); }}
              >
                {sub.icon && <span className="vxm-bottomnav__submenu-icon">{sub.icon}</span>}
                <span>{sub.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <nav className={cx('vxm-bottomnav', className)} aria-label="底部导航">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={cx(
              'vxm-bottomnav__item',
              item.active && 'vxm-bottomnav__item--active',
              item.submenu?.length && openKey === item.key && 'vxm-bottomnav__item--submenu-open',
            )}
            onClick={() => handleItemClick(item)}
            aria-current={item.active ? 'page' : undefined}
            aria-expanded={item.submenu?.length ? openKey === item.key : undefined}
            aria-haspopup={item.submenu?.length ? 'menu' : undefined}
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
    </div>
  );
}
