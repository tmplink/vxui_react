import { useState, useRef, useEffect } from 'react';
import { cx } from '../lib/cx';
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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  const handleSelect = (date: Date) => {
    if (!isControlled) setInternalValue(date);
    onChange?.(date);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={cx('vx-datepicker', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
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
      {open ? (
        <div className="vx-datepicker__popover" role="dialog" aria-label="Date picker">
          <Calendar
            value={selected}
            onChange={handleSelect}
            min={min}
            max={max}
            weekStartsOnMonday={weekStartsOnMonday}
          />
        </div>
      ) : null}
    </div>
  );
}
