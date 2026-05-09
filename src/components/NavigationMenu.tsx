import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../lib/cx';

export interface NavMenuSubItem {
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface NavMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  items?: NavMenuSubItem[];
  active?: boolean;
}

export interface NavigationMenuProps {
  items: NavMenuItem[];
  className?: string;
}

export function NavigationMenu({ items, className }: NavigationMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenIndex(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [openIndex]);

  return (
    <nav ref={navRef} className={cx('vx-nav-menu', className)} aria-label="Main navigation">
      <ul className="vx-nav-menu__list" role="list">
        {items.map((item, i) => {
          const hasDropdown = item.items && item.items.length > 0;
          const isOpen = openIndex === i;
          return (
            <li key={i} className="vx-nav-menu__item-wrap">
              {hasDropdown ? (
                <button
                  type="button"
                  className={cx(
                    'vx-nav-menu__link',
                    item.active && 'vx-nav-menu__link--active',
                    isOpen && 'vx-nav-menu__link--open',
                  )}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={cx(
                      'vx-nav-menu__chevron',
                      isOpen && 'vx-nav-menu__chevron--open',
                    )}
                  />
                </button>
              ) : (
                <a
                  href={item.href ?? '#'}
                  className={cx(
                    'vx-nav-menu__link',
                    item.active && 'vx-nav-menu__link--active',
                  )}
                  onClick={item.onClick}
                >
                  {item.label}
                </a>
              )}
              {hasDropdown && isOpen && (
                <div className="vx-nav-menu__dropdown">
                  {item.items!.map((sub, si) => (
                    <a
                      key={si}
                      href={sub.href ?? '#'}
                      className="vx-nav-menu__sub-item"
                      onClick={() => {
                        sub.onClick?.();
                        setOpenIndex(null);
                      }}
                    >
                      {sub.icon && (
                        <span className="vx-nav-menu__sub-icon">{sub.icon}</span>
                      )}
                      <span>
                        <span className="vx-nav-menu__sub-label">{sub.label}</span>
                        {sub.description && (
                          <span className="vx-nav-menu__sub-desc">{sub.description}</span>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
