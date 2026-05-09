import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { cx } from '../lib/cx';

export interface MenubarItemProps {
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface MenubarGroupProps {
  label?: string;
  items: MenubarItemProps[];
}

export interface MenubarMenuProps {
  label: string;
  groups?: MenubarGroupProps[];
  items?: MenubarItemProps[];
  disabled?: boolean;
}

export interface MenubarProps {
  menus: MenubarMenuProps[];
  className?: string;
}

export function Menubar({ menus, className }: MenubarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenIndex(null);
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
    <div ref={barRef} className={cx('vx-menubar', className)} role="menubar">
      {menus.map((menu, i) => {
        const sections = menu.groups ?? (menu.items ? [{ items: menu.items }] : []);
        const isOpen = openIndex === i;
        return (
          <div key={i} className="vx-menubar__item-wrap">
            <button
              type="button"
              role="menuitem"
              className={cx('vx-menubar__trigger', isOpen && 'vx-menubar__trigger--open')}
              disabled={menu.disabled}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              onMouseEnter={() => {
                if (openIndex !== null) setOpenIndex(i);
              }}
            >
              {menu.label}
            </button>
            {isOpen && (
              <div className="vx-dropdown__menu" role="menu">
                {sections.map((group, gi) => (
                  <div key={gi} className="vx-dropdown__group">
                    {gi > 0 && <div className="vx-dropdown__separator" />}
                    {group.label && (
                      <div className="vx-dropdown__group-label">{group.label}</div>
                    )}
                    {group.items.map((item, ii) => (
                      <button
                        key={ii}
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        className={cx(
                          'vx-dropdown__item',
                          item.danger && 'vx-dropdown__item--danger',
                          item.disabled && 'vx-dropdown__item--disabled',
                        )}
                        onClick={() => {
                          item.onClick?.();
                          setOpenIndex(null);
                        }}
                      >
                        {item.icon && (
                          <span className="vx-dropdown__item-icon">{item.icon}</span>
                        )}
                        <span className="vx-dropdown__item-label">{item.label}</span>
                        {item.shortcut && (
                          <span className="vx-dropdown__shortcut">{item.shortcut}</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
