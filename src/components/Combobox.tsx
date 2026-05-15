import type { ReactNode } from 'react';
import { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cx } from '../lib/cx';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  emptyText?: string;
  /**
   * Controls when the search input is shown.
   * - `true` (default): always show
   * - `false`: never show
   * - `number N`: show only when `options.length > N`
   */
  searchable?: boolean | number;
  className?: string;
}

export function Combobox({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  label,
  hint,
  error,
  disabled,
  clearable = false,
  emptyText = 'No results',
  searchable = true,
  className,
}: ComboboxProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const showSearch =
    typeof searchable === 'number' ? options.length > searchable : searchable;

  useEffect(() => {
    if (!open) {
      setSearch('');
      return;
    }
    if (showSearch) {
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open, showSearch]);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalValue(undefined);
    onChange?.(undefined);
  };

  return (
    <div ref={wrapRef} className={cx('vx-combobox', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
        type="button"
        className={cx(
          'vx-combobox__trigger',
          error && 'vx-combobox__trigger--invalid',
          disabled && 'vx-combobox__trigger--disabled',
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <span className={cx('vx-combobox__value', !selectedOption && 'vx-combobox__value--placeholder')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="vx-combobox__icons">
          {clearable && selectedOption && (
            <span
              className="vx-combobox__clear"
              onClick={clear}
              role="button"
              aria-label="Clear selection"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={cx('vx-combobox__chevron', open && 'vx-combobox__chevron--open')}
          />
        </span>
      </button>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
      {open && (
        <div className="vx-combobox__dropdown">
          {showSearch && (
            <div className="vx-combobox__search-wrap">
              <input
                ref={searchRef}
                type="text"
                className="vx-combobox__search"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          <ul id={listboxId} className="vx-combobox__list" role="listbox" aria-label={label ?? 'Options'}>
            {filtered.length === 0 ? (
              <li className="vx-combobox__empty">{emptyText}</li>
            ) : (
              filtered.map((option) => (
                <li
                  key={option.value}
                  className={cx(
                    'vx-combobox__option',
                    option.value === value && 'vx-combobox__option--selected',
                    option.disabled && 'vx-combobox__option--disabled',
                  )}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onClick={() => select(option)}
                >
                  <span>{option.label}</span>
                  {option.value === value ? <Check size={14} /> : null}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
