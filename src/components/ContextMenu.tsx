import type { ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cx } from '../lib/cx';

export interface ContextMenuItemProps {
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface ContextMenuGroupProps {
  label?: string;
  items: ContextMenuItemProps[];
}

export interface ContextMenuProps {
  groups?: ContextMenuGroupProps[];
  items?: ContextMenuItemProps[];
  children: ReactNode;
  className?: string;
}

export function ContextMenu({ groups, items, children, className }: ContextMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const sections = groups ?? (items ? [{ items }] : []);

  useEffect(() => {
    if (!pos) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setPos(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setPos(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [pos]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className={cx('vx-context-menu-wrap', className)} onContextMenu={handleContextMenu}>
      {children}
      {pos && (
        <div
          ref={menuRef}
          className="vx-dropdown__menu vx-context-menu"
          style={{ position: 'fixed', top: pos.y, left: pos.x }}
          role="menu"
        >
          {sections.map((group, gi) => (
            <div key={gi} className="vx-dropdown__group">
              {gi > 0 && <div className="vx-dropdown__separator" />}
              {group.label && <div className="vx-dropdown__group-label">{group.label}</div>}
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
                    setPos(null);
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
}
