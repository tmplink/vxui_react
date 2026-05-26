import type { HTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { cx } from '../lib/cx';

export interface DropdownMenuItemProps {
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuGroupProps {
  label?: string;
  items: DropdownMenuItemProps[];
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  groups?: DropdownMenuGroupProps[];
  items?: DropdownMenuItemProps[];
  align?: 'left' | 'right';
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({
  trigger,
  groups,
  items,
  align = 'left',
  className,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [actualAlign, setActualAlign] = useState(align);

  // 初始化 / 重置方向
  useLayoutEffect(() => {
    if (open) {
      setActualAlign(align);
    }
  }, [open, align]);

  // 渲染后检测是否溢出屏幕，自动翻转
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return; // Ignore in JSDOM
    const safeEdge = 8; // 屏幕边缘安全距离
    
    if (actualAlign === 'left' && rect.right > window.innerWidth - safeEdge) {
      setActualAlign('right');
    } else if (actualAlign === 'right' && rect.left < safeEdge) {
      setActualAlign('left');
    }
  }, [open, actualAlign]);

  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent_) => { if (e.key === 'Escape') setOpen(false); };
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey as EventListenerOrEventListenerObject);
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey as EventListenerOrEventListenerObject);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [open, setOpen]);

  const allGroups: DropdownMenuGroupProps[] = groups ?? (items ? [{ items }] : []);

  return (
    <div ref={wrapRef} className={cx('vx-dropdown', open && 'vx-dropdown--open', className)}>
      <div className="vx-dropdown__trigger" onClick={toggle} role="button" tabIndex={0}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}>
        {trigger}
      </div>
      {open ? (
        <div ref={menuRef} className={cx('vx-dropdown__menu', `vx-dropdown__menu--${actualAlign}`)} role="menu">
          {allGroups.map((group, gi) => (
            <div key={gi} className="vx-dropdown__group">
              {group.label ? <div className="vx-dropdown__group-label">{group.label}</div> : null}
              {gi > 0 && !group.label ? <div className="vx-dropdown__separator" role="separator" /> : null}
              {group.items.map((item, ii) => (
                <button
                  key={ii}
                  role="menuitem"
                  disabled={item.disabled}
                  className={cx(
                    'vx-dropdown__item',
                    item.danger && 'vx-dropdown__item--danger',
                    item.disabled && 'vx-dropdown__item--disabled',
                  )}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick?.();
                      setOpen(false);
                    }
                  }}
                >
                  {item.icon ? <span className="vx-dropdown__item-icon">{item.icon}</span> : null}
                  <span className="vx-dropdown__item-label">{item.label}</span>
                  {item.shortcut ? <kbd className="vx-dropdown__shortcut">{item.shortcut}</kbd> : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// workaround for the naming collision with React's KeyboardEvent
type KeyboardEvent_ = globalThis.KeyboardEvent;
