import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { getDialogPopoverContext } from '../lib/dialogPopover';
import { useIsMobile } from '../hooks/useIsMobile';
import { Sheet } from './Sheet';
import { Calendar } from './Calendar';

function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 6.5h13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 1v3M10 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  weekStartsOnMonday?: boolean;
  className?: string;
}

export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select date',
  label,
  hint,
  error,
  min,
  max,
  disabled,
  weekStartsOnMonday,
  className,
}: DatePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();
  const [dropPos, setDropPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    direction: 'down' | 'up';
  } | null>(null);

  // ─── 桌面端：点击外部 / Escape 关闭 ──────────────────────────────
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: Event) => {
      const inWrap = wrapRef.current?.contains(e.target as Node);
      const inPopover = popoverRef.current?.contains(e.target as Node);
      if (!inWrap && !inPopover) setOpen(false);
    };
    const keyHandler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open, isMobile]);

  useEffect(() => {
    const { shouldInline } = getDialogPopoverContext(wrapRef.current);
    if (!open || !shouldInline) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open || !dropPos) return;
    const el = dialogContentRef.current;
    if (!el) return;
    el.dataset.hasOpenPortal = '1';
    return () => { delete el.dataset.hasOpenPortal; };
  }, [open, dropPos]);

  useLayoutEffect(() => {
    const { dialogContent, shouldInline } = getDialogPopoverContext(wrapRef.current);
    if (!open || !triggerRef.current || shouldInline || isMobile) {
      setDropPos(null);
      dialogContentRef.current = null;
      return;
    }
    dialogContentRef.current = dialogContent;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const direction = spaceBelow < 320 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropPos(
      direction === 'down'
        ? { top: rect.bottom + 6, left: rect.left, direction }
        : { bottom: window.innerHeight - rect.top + 6, left: rect.left, direction },
    );
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || !dropPos) return;
    const close = (event: Event) => {
      if (popoverRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [open, dropPos]);

  // ─── 桌面端：选中即关 ────────────────────────────────────────────
  const handleSelect = (date: Date) => {
    if (!isControlled) setInternalValue(date);
    onChange?.(date);
    setOpen(false);
  };

  // ─── 移动端：pendingValue + 确认模式 ─────────────────────────────
  const [pendingValue, setPendingValue] = useState<Date | undefined>(selected);

  // 打开 Sheet 时，同步 pendingValue 为当前值
  useEffect(() => {
    if (open && isMobile) {
      setPendingValue(selected);
    }
  }, [open, isMobile, selected]);

  const handlePendingSelect = (date: Date) => {
    setPendingValue(date);
  };

  const handleConfirm = () => {
    if (!isControlled) setInternalValue(pendingValue);
    onChange?.(pendingValue);
    // Sheet 自主关闭
  };

  // Mobile Sheet content
  const mobileSheetContent = (
    <>
      <Calendar
        value={pendingValue}
        onChange={handlePendingSelect}
        min={min}
        max={max}
        weekStartsOnMonday={weekStartsOnMonday}
      />
    </>
  );

  return (
    <div ref={wrapRef} className={cx('vx-datepicker', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
        ref={triggerRef}
        type="button"
        className={cx(
          'vx-datepicker__trigger',
          error && 'vx-datepicker__trigger--invalid',
          disabled && 'vx-datepicker__trigger--disabled',
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CalendarIcon />
        <span className={cx('vx-datepicker__value', !selected && 'vx-datepicker__value--placeholder')}>
          {selected ? formatDate(selected) : placeholder}
        </span>
      </button>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
      {/* Desktop popover - fixed position */}
      {open && !isMobile && (() => {
        const shouldPortal = Boolean(dropPos);
        const popoverStyle = dropPos
          ? { position: 'fixed' as const, top: dropPos.top, bottom: dropPos.bottom, left: dropPos.left, pointerEvents: 'auto' as const }
          : undefined;
        const popoverNode = (
        <div
          ref={popoverRef}
          className={cx(
            'vx-datepicker__popover',
            dropPos?.direction === 'up' && 'vx-datepicker__popover--up',
            Boolean(dialogContentRef.current) && 'vx-datepicker__popover--in-dialog',
          )}
          role="dialog"
          aria-label="Date picker"
          style={popoverStyle}
        >
          <Calendar
            value={selected}
            onChange={handleSelect}
            min={min}
            max={max}
            weekStartsOnMonday={weekStartsOnMonday}
          />
        </div>
        );
        return shouldPortal ? createPortal(popoverNode, dialogContentRef.current ?? document.body) : popoverNode;
      })()}
      {/* Mobile Sheet */}
      {isMobile && open && (
        <Sheet
          side="bottom"
          open={open}
          onOpenChange={(v) => { if (!v) setOpen(false); }}
          title={label || 'Select date'}
          showConfirm
          confirmDisabled={pendingValue === undefined}
          onConfirm={handleConfirm}
        >
          {mobileSheetContent}
        </Sheet>
      )}
    </div>
  );
}
