import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { getDialogPopoverContext } from '../lib/dialogPopover';
import { useIsMobile } from '../hooks/useIsMobile';
import { BottomSheet } from './mobile/BottomSheet';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function parseTime(val: string): { h: number; m: number; s: number } {
  const parts = val.split(':').map(Number);
  return { h: parts[0] ?? 0, m: parts[1] ?? 0, s: parts[2] ?? 0 };
}

function formatTime(h: number, m: number, s: number, withSeconds: boolean): string {
  return withSeconds ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}`;
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.5 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SpinnerColumnProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  label: string;
}

function SpinnerColumn({ value, min, max, onChange, label }: SpinnerColumnProps) {
  const total = max - min + 1;

  const decrement = () => onChange(value === min ? max : value - 1);
  const increment = () => onChange(value === max ? min : value + 1);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) increment();
    else decrement();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); decrement(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); increment(); }
  };

  // Show prev, current, next
  const prev = value === min ? max : value - 1;
  const next = value === max ? min : value + 1;

  return (
    <div
      className="vx-timepicker__col"
      role="spinbutton"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={pad(value)}
      tabIndex={0}
      onKeyDown={handleKey}
      onWheel={handleWheel}
    >
      <button
        type="button"
        className="vx-timepicker__col-btn"
        onClick={decrement}
        aria-label={`Decrease ${label}`}
        tabIndex={-1}
      >
        <ChevronUp size={13} />
      </button>
      <div className="vx-timepicker__col-items">
        <div className="vx-timepicker__col-item vx-timepicker__col-item--adjacent">{pad(prev)}</div>
        <div className="vx-timepicker__col-item vx-timepicker__col-item--selected">{pad(value)}</div>
        <div className="vx-timepicker__col-item vx-timepicker__col-item--adjacent">{pad(next)}</div>
      </div>
      <button
        type="button"
        className="vx-timepicker__col-btn"
        onClick={increment}
        aria-label={`Increase ${label}`}
        tabIndex={-1}
      >
        <ChevronDown size={13} />
      </button>
    </div>
  );
}

export interface TimePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Show seconds column. Default false */
  seconds?: boolean;
  className?: string;
}

export function TimePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select time',
  label,
  hint,
  error,
  disabled,
  seconds = false,
  className,
}: TimePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const current = isControlled ? controlledValue : internalValue;

  const parsed = current ? parseTime(current) : { h: 12, m: 0, s: 0 };
  const [h, setH] = useState(parsed.h);
  const [m, setM] = useState(parsed.m);
  const [s, setS] = useState(parsed.s);

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

  // Sync local state when controlled value changes
  useEffect(() => {
    if (controlledValue) {
      const p = parseTime(controlledValue);
      setH(p.h); setM(p.m); setS(p.s);
    }
  }, [controlledValue]);

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
    const direction = spaceBelow < 220 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropPos(
      direction === 'down'
        ? { top: rect.bottom + 4, left: rect.left, direction }
        : { bottom: window.innerHeight - rect.top + 4, left: rect.left, direction },
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

  const commit = useCallback(
    (nextH: number, nextM: number, nextS: number) => {
      const formatted = formatTime(nextH, nextM, nextS, seconds);
      if (!isControlled) setInternalValue(formatted);
      onChange?.(formatted);
    },
    [isControlled, seconds, onChange],
  );

  const handleH = (val: number) => { setH(val); commit(val, m, s); };
  const handleM = (val: number) => { setM(val); commit(h, val, s); };
  const handleS = (val: number) => { setS(val); commit(h, m, val); };

  const displayValue = current ?? (open ? formatTime(h, m, s, seconds) : undefined);

  // ─── 移动端：pendingValue + 确认模式 ─────────────────────────────
  const [pendingH, setPendingH] = useState(parsed.h);
  const [pendingM, setPendingM] = useState(parsed.m);
  const [pendingS, setPendingS] = useState(parsed.s);

  // 打开 BottomSheet 时，同步 pending 值为当前值
  useEffect(() => {
    if (open && isMobile) {
      const p = current ? parseTime(current) : { h: 12, m: 0, s: 0 };
      setPendingH(p.h);
      setPendingM(p.m);
      setPendingS(p.s);
    }
  }, [open, isMobile, current]);

  const handlePendingH = (val: number) => setPendingH(val);
  const handlePendingM = (val: number) => setPendingM(val);
  const handlePendingS = (val: number) => setPendingS(val);

  const handleConfirm = () => {
    commit(pendingH, pendingM, pendingS);
    // BottomSheet 自主关闭
  };

  // Mobile BottomSheet content
  const mobileSheetContent = (
    <>
      <div className="vx-timepicker__columns">
        <SpinnerColumn value={pendingH} min={0} max={23} onChange={handlePendingH} label="Hours" />
        <span className="vx-timepicker__sep">:</span>
        <SpinnerColumn value={pendingM} min={0} max={59} onChange={handlePendingM} label="Minutes" />
        {seconds && (
          <>
            <span className="vx-timepicker__sep">:</span>
            <SpinnerColumn value={pendingS} min={0} max={59} onChange={handlePendingS} label="Seconds" />
          </>
        )}
      </div>
    </>
  );

  return (
    <div ref={wrapRef} className={cx('vx-timepicker', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
        ref={triggerRef}
        type="button"
        className={cx(
          'vx-timepicker__trigger',
          error && 'vx-timepicker__trigger--invalid',
          disabled && 'vx-timepicker__trigger--disabled',
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <ClockIcon />
        <span className={cx('vx-timepicker__value', !displayValue && 'vx-timepicker__value--placeholder')}>
          {displayValue ?? placeholder}
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
            'vx-timepicker__popover',
            dropPos?.direction === 'up' && 'vx-timepicker__popover--up',
            Boolean(dialogContentRef.current) && 'vx-timepicker__popover--in-dialog',
          )}
          role="dialog"
          aria-label="Time picker"
          style={popoverStyle}
        >
          <div className="vx-timepicker__columns">
            <SpinnerColumn value={h} min={0} max={23} onChange={handleH} label="Hours" />
            <span className="vx-timepicker__sep">:</span>
            <SpinnerColumn value={m} min={0} max={59} onChange={handleM} label="Minutes" />
            {seconds && (
              <>
                <span className="vx-timepicker__sep">:</span>
                <SpinnerColumn value={s} min={0} max={59} onChange={handleS} label="Seconds" />
              </>
            )}
          </div>
          <div className="vx-timepicker__footer">
            <button
              type="button"
              className="vx-timepicker__done"
              onClick={() => {
                if (!current) commit(h, m, s);
                setOpen(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
        );
        return shouldPortal ? createPortal(popoverNode, dialogContentRef.current ?? document.body) : popoverNode;
      })()}
      {/* Mobile BottomSheet */}
      {isMobile && open && (
        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title={label || 'Select time'}
          draggable
          showConfirm
          onConfirm={handleConfirm}
        >
          {mobileSheetContent}
        </BottomSheet>
      )}
    </div>
  );
}
