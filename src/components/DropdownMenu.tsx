import type { ReactNode, ReactElement, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useId, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { useDialogContentRef } from '../lib/dialogPopover';
import { useIsMobile } from '../hooks/useIsMobile';
import { Sheet } from './Sheet';

/* ── Types ─────────────────────────────────────────────── */

export interface DropdownMenuItemProps {
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  /** Optional sub-menu items for nested menus (1 level deep) */
  subItems?: DropdownMenuItemProps[];
  onClick?: () => void;
}

export interface DropdownMenuGroupProps {
  label?: string;
  items: DropdownMenuItemProps[];
}

export type DropdownSide = 'top' | 'bottom';
export type DropdownAlign = 'start' | 'end';

export interface DropdownMenuProps {
  /** The trigger element. When passed a single React element, handlers are merged. */
  trigger: ReactNode;
  /** Grouped menu items (renders separators between groups). */
  groups?: DropdownMenuGroupProps[];
  /** Flat list of menu items. */
  items?: DropdownMenuItemProps[];
  /** Side to render the menu: 'top' | 'bottom' (default: 'bottom'). */
  side?: DropdownSide;
  /** Alignment: 'start' | 'end' (default: 'start'). */
  align?: DropdownAlign;
  /** Offset from the trigger in pixels (default: 4). */
  sideOffset?: number;
  className?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownMenuSubProps {
  trigger: ReactNode;
  items: DropdownMenuItemProps[];
  disabled?: boolean;
}

/* ── Internal focus utilities ──────────────────────────── */

function getValidItems(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      '.vx-dropdown__item:not(.vx-dropdown__item--disabled):not([aria-hidden])',
    ),
  );
}

function focusItem(index: number, items: HTMLElement[]) {
  if (items.length === 0) return;
  const idx = Math.max(0, Math.min(index, items.length - 1));
  items[idx]?.focus();
}

/* ── SubMenu component (single level nesting) ──────────── */

function DropdownSubMenu({ trigger, items, disabled }: DropdownMenuSubProps) {
  const [subOpen, setSubOpen] = useState(false);
  const subWrapRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const subId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeSub = useCallback(() => setSubOpen(false), []);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    clearTimeout(timeoutRef.current);
    setSubOpen(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(closeSub, 150);
  }, [closeSub]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  useEffect(() => {
    if (!subOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        closeSub();
        (subWrapRef.current?.closest('.vx-dropdown__item') as HTMLElement | null)?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [subOpen, closeSub]);

  const handleSubKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!subMenuRef.current) return;
    const its = getValidItems(subMenuRef.current);
    if (its.length === 0) return;
    const currentIdx = its.indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusItem(currentIdx + 1, its); break;
      case 'ArrowUp': e.preventDefault(); focusItem(currentIdx - 1, its); break;
      case 'Home': e.preventDefault(); focusItem(0, its); break;
      case 'End': e.preventDefault(); focusItem(its.length - 1, its); break;
    }
  }, []);

  return (
    <div ref={subWrapRef} className="vx-dropdown__sub-wrap"
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
    >
      {trigger}
      {subOpen && !disabled ? (
        <div ref={subMenuRef} id={subId} className="vx-dropdown__sub-menu" role="menu" onKeyDown={handleSubKeyDown}>
          {items.map((item, ii) => (
            <button key={ii} role="menuitem" disabled={item.disabled}
              className={cx('vx-dropdown__item', item.danger && 'vx-dropdown__item--danger', item.disabled && 'vx-dropdown__item--disabled')}
              aria-disabled={item.disabled || undefined}
              onClick={() => { if (!item.disabled) { item.onClick?.(); closeSub(); } }}
            >
              {item.icon ? <span className="vx-dropdown__item-icon">{item.icon}</span> : null}
              <span className="vx-dropdown__item-label">{item.label}</span>
              {item.shortcut ? <kbd className="vx-dropdown__shortcut">{item.shortcut}</kbd> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Slot helper (asChild pattern) ─────────────────────── */

function Slot({ asChild, children, extraProps, wrapper }: {
  asChild?: boolean; children: ReactNode; extraProps: Record<string, unknown>; wrapper: ReactElement;
}) {
  if (asChild && isValidElement(children)) return cloneElement(children, extraProps);
  return cloneElement(wrapper, extraProps, children);
}

/* ── Main DropdownMenu ─────────────────────────────────── */

export function DropdownMenu({
  trigger, groups, items, side = 'bottom', align = 'start', sideOffset = 4,
  className, open: controlledOpen, onOpenChange,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const dialogContent = useDialogContentRef();
  const isMobile = useIsMobile();

  // ── Positioning state ─────────────────────────────────
  const [pos, setPos] = useState<{
    top?: number; bottom?: number; left?: number; right?: number;
    maxHeight: number; actualSide: 'top' | 'bottom'; width?: number;
  } | null>(null);

  // ── Open/close helpers ────────────────────────────────
  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  // ── Dynamic position calculation ──────────────────────
  const calcPosition = useCallback(() => {
    if (!triggerRef.current || isMobile) { setPos(null); return; }
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const SAFETY = 8;
    const MIN_HEIGHT = 120;

    let actualSide = side;
    if (side === 'bottom' && spaceBelow < 200 && spaceAbove > spaceBelow) actualSide = 'top';
    else if (side === 'top' && spaceAbove < 200 && spaceBelow > spaceAbove) actualSide = 'bottom';

    const available = actualSide === 'bottom'
      ? Math.max(MIN_HEIGHT, spaceBelow - sideOffset - SAFETY)
      : Math.max(MIN_HEIGHT, spaceAbove - sideOffset - SAFETY);

    setPos({
      top: actualSide === 'bottom' ? rect.bottom + sideOffset : undefined,
      bottom: actualSide === 'top' ? window.innerHeight - rect.top + sideOffset : undefined,
      left: align === 'start' ? rect.left : undefined,
      right: align === 'end' ? window.innerWidth - rect.right : undefined,
      maxHeight: available, actualSide, width: rect.width,
    });
  }, [side, sideOffset, align, isMobile]);

  useLayoutEffect(() => {
    if (open && !isMobile) calcPosition();
    else setPos(null);
  }, [open, isMobile, calcPosition]);

  // Recalculate on scroll/resize
  useEffect(() => {
    if (!open || isMobile) return;
    const handle = () => calcPosition();
    window.addEventListener('scroll', handle, { capture: true, passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, { capture: true });
      window.removeEventListener('resize', handle);
    };
  }, [open, isMobile, calcPosition]);

  // ── Outside click + Escape close ──────────────────────
  useEffect(() => {
    if (!open || isMobile) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    };
    const onOutside = (e: globalThis.MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onOutside); };
  }, [open, isMobile, setOpen]);

  // ── Auto-focus first item when menu opens ─────────────
  useEffect(() => {
    if (!open || isMobile || !menuRef.current) return;
    const raf = requestAnimationFrame(() => {
      const items = getValidItems(menuRef.current!);
      if (items.length > 0) items[0].focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [open, isMobile]);

  // ── Arrow key navigation ──────────────────────────────
  const handleMenuKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const items = getValidItems(menuRef.current);
    if (items.length === 0) return;
    const currentIdx = items.indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusItem(currentIdx + 1, items); break;
      case 'ArrowUp': e.preventDefault(); focusItem(currentIdx - 1, items); break;
      case 'Home': e.preventDefault(); focusItem(0, items); break;
      case 'End': e.preventDefault(); focusItem(items.length - 1, items); break;
      case 'Tab': e.preventDefault(); break;
    }
  }, []);

  // ── Build groups ──────────────────────────────────────
  const allGroups: DropdownMenuGroupProps[] = groups ?? (items ? [{ items }] : []);

  // ── Render a single item (handles sub-menus) ──────────
  const renderItem = (item: DropdownMenuItemProps, index: number): ReactNode => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <DropdownSubMenu key={index} disabled={item.disabled}
          trigger={
            <button role="menuitem" aria-haspopup="menu" disabled={item.disabled}
              className={cx('vx-dropdown__item', item.danger && 'vx-dropdown__item--danger', item.disabled && 'vx-dropdown__item--disabled')}
              aria-disabled={item.disabled || undefined}
            >
              {item.icon ? <span className="vx-dropdown__item-icon">{item.icon}</span> : null}
              <span className="vx-dropdown__item-label">{item.label}</span>
              <span className="vx-dropdown__sub-arrow" aria-hidden="true">▶</span>
            </button>
          }
          items={item.subItems}
        />
      );
    }
    return (
      <button key={index} role="menuitem" disabled={item.disabled}
        className={cx('vx-dropdown__item', item.danger && 'vx-dropdown__item--danger', item.disabled && 'vx-dropdown__item--disabled')}
        aria-disabled={item.disabled || undefined}
        onClick={() => { if (!item.disabled) { item.onClick?.(); setOpen(false); triggerRef.current?.focus(); } }}
      >
        {item.icon ? <span className="vx-dropdown__item-icon">{item.icon}</span> : null}
        <span className="vx-dropdown__item-label">{item.label}</span>
        {item.shortcut ? <kbd className="vx-dropdown__shortcut">{item.shortcut}</kbd> : null}
      </button>
    );
  };

  // ── Menu panel content ────────────────────────────────
  const menuContent = (
    <div ref={menuRef} id={menuId} role="menu"
      className={cx('vx-dropdown__menu', `vx-dropdown__menu--${pos?.actualSide ?? side}`, align === 'end' && 'vx-dropdown__menu--align-end', Boolean(dialogContent) && 'vx-dropdown__menu--in-dialog')}
      style={{ top: pos?.top, bottom: pos?.bottom, left: pos?.left, right: pos?.right, maxHeight: pos?.maxHeight, minWidth: pos?.width }}
      onKeyDown={handleMenuKeyDown} aria-label="Menu"
    >
      {allGroups.length === 0 ? (
        <div className="vx-dropdown__empty" role="presentation">No items</div>
      ) : allGroups.map((group, gi) => (
        <div key={gi} className="vx-dropdown__group">
          {group.label ? <div className="vx-dropdown__group-label" aria-hidden="true">{group.label}</div> : null}
          {gi > 0 && !group.label ? <div className="vx-dropdown__separator" role="separator" aria-orientation="horizontal" /> : null}
          {group.items.map((item, ii) => renderItem(item, ii))}
        </div>
      ))}
    </div>
  );

  // ── Portal target ─────────────────────────────────────
  const portalTarget = !isMobile ? document.body : null;

  // ── Detect if trigger is a valid React element ────────
  const isSingleElement = isValidElement(trigger) && typeof (trigger as ReactElement).type === 'function';

  // ── Trigger shared props ──────────────────────────────
  const triggerProps = {
    ref: triggerRef as React.Ref<HTMLButtonElement>,
    type: 'button' as const,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': menuId,
    onClick: (e: ReactMouseEvent) => {
      if (isSingleElement && (trigger as ReactElement).props && typeof (trigger as ReactElement).props === 'object') {
        const p = (trigger as ReactElement).props as Record<string, unknown>;
        if (typeof p.onClick === 'function') (p.onClick as (e: ReactMouseEvent) => void)(e);
      }
      if (!e.defaultPrevented) toggle();
    },
    onKeyDown: (e: ReactKeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); toggle(); }
      if (isSingleElement && (trigger as ReactElement).props && typeof (trigger as ReactElement).props === 'object') {
        const p = (trigger as ReactElement).props as Record<string, unknown>;
        if (typeof p.onKeyDown === 'function') (p.onKeyDown as (e: ReactKeyboardEvent) => void)(e);
      }
    },
  };

  return (
    <div ref={wrapRef} className={cx('vx-dropdown', open && 'vx-dropdown--open', className)}>
      {isMobile ? (
        <>
          <button ref={triggerRef} type="button" className="vx-dropdown__trigger vx-dropdown__trigger--default"
            onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId}
          >
            {trigger}
          </button>
          <Sheet side="bottom" open={open} onOpenChange={(v) => { if (!v) setOpen(false); }} title="">
            <div className="vx-dropdown__mobile-sheet">
              {allGroups.map((group, gi) => (
                <div key={gi} className="vx-dropdown__group">
                  {group.label ? <div className="vx-dropdown__group-label" aria-hidden="true">{group.label}</div> : null}
                  {gi > 0 && !group.label ? <div className="vx-dropdown__separator" role="separator" aria-orientation="horizontal" /> : null}
                  {group.items.map((item, ii) => (
                    <button key={ii} type="button"
                      className={cx('vx-dropdown__item', item.danger && 'vx-dropdown__item--danger', item.disabled && 'vx-dropdown__item--disabled')}
                      disabled={item.disabled}
                      onClick={() => { if (!item.disabled) { item.onClick?.(); setOpen(false); } }}
                    >
                      {item.icon ? <span className="vx-dropdown__item-icon">{item.icon}</span> : null}
                      <span className="vx-dropdown__item-label">{item.label}</span>
                      {item.shortcut ? <kbd className="vx-dropdown__shortcut">{item.shortcut}</kbd> : null}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </Sheet>
        </>
      ) : (
        <>
          {isSingleElement ? (
            <Slot asChild wrapper={<button className="vx-dropdown__trigger" />}
              extraProps={triggerProps as unknown as Record<string, unknown>}
            >
              {trigger}
            </Slot>
          ) : (
            <button className="vx-dropdown__trigger vx-dropdown__trigger--default" {...(triggerProps as any)}>
              {trigger}
            </button>
          )}
          {open && portalTarget ? createPortal(menuContent, portalTarget) : null}
        </>
      )}
    </div>
  );
}
