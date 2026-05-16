import { useState, useRef, useEffect, useCallback } from 'react';
import { cx } from '../lib/cx';
import { useDropDirection } from '../hooks/useDropDirection';

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
  const dropDirection = useDropDirection(wrapRef, open, 220);

  // Sync local state when controlled value changes
  useEffect(() => {
    if (controlledValue) {
      const p = parseTime(controlledValue);
      setH(p.h); setM(p.m); setS(p.s);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
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
  }, [open]);

  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 640px)').matches) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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

  return (
    <div ref={wrapRef} className={cx('vx-timepicker', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
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
      {open && (
        <div className={cx('vx-timepicker__popover', dropDirection === 'up' && 'vx-timepicker__popover--up')} role="dialog" aria-label="Time picker">
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
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
