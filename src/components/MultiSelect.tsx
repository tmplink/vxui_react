import { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cx } from '../lib/cx';
import { useDropDirection } from '../hooks/useDropDirection';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  emptyText?: string;
  /** Max number of visible tags before showing "+N more" badge */
  maxDisplay?: number;
  className?: string;
}

export function MultiSelect({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  label,
  hint,
  error,
  disabled,
  clearable = false,
  emptyText = 'No results',
  maxDisplay,
  className,
}: MultiSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const dropDirection = useDropDirection(wrapRef, open, 300);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!open) {
      setSearch('');
      return;
    }
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

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

  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    const next = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const removeTag = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    const next = value.filter((v) => v !== val);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalValue([]);
    onChange?.([]);
  };

  const visibleTags = maxDisplay ? value.slice(0, maxDisplay) : value;
  const hiddenCount = maxDisplay ? Math.max(0, value.length - maxDisplay) : 0;
  const selectedLabels = options.reduce<Record<string, string>>((acc, o) => {
    acc[o.value] = o.label;
    return acc;
  }, {});

  return (
    <div ref={wrapRef} className={cx('vx-multiselect', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
        type="button"
        className={cx(
          'vx-multiselect__trigger',
          error && 'vx-multiselect__trigger--invalid',
          disabled && 'vx-multiselect__trigger--disabled',
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <span className="vx-multiselect__tags">
          {value.length === 0 ? (
            <span className="vx-multiselect__placeholder">{placeholder}</span>
          ) : (
            <>
              {visibleTags.map((v) => (
                <span key={v} className="vx-multiselect__tag">
                  {selectedLabels[v] ?? v}
                  {!disabled && (
                    <span
                      className="vx-multiselect__tag-remove"
                      role="button"
                      aria-label={`Remove ${selectedLabels[v] ?? v}`}
                      onClick={(e) => removeTag(e, v)}
                    >
                      <X size={11} />
                    </span>
                  )}
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="vx-multiselect__overflow">+{hiddenCount}</span>
              )}
            </>
          )}
        </span>
        <span className="vx-multiselect__icons">
          {clearable && value.length > 0 && (
            <span
              className="vx-multiselect__clear"
              role="button"
              aria-label="Clear all"
              onClick={clearAll}
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={cx('vx-multiselect__chevron', open && 'vx-multiselect__chevron--open')}
          />
        </span>
      </button>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
      {open && (
        <div className={cx('vx-multiselect__dropdown', dropDirection === 'up' && 'vx-multiselect__dropdown--up')}>
          <div className="vx-multiselect__search-wrap">
            <input
              ref={searchRef}
              type="text"
              className="vx-multiselect__search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={searchPlaceholder}
            />
          </div>
          <ul id={listboxId} className="vx-multiselect__list" role="listbox" aria-multiselectable="true" aria-label={label ?? 'Options'}>
            {filtered.length === 0 ? (
              <li className="vx-multiselect__empty">{emptyText}</li>
            ) : (
              filtered.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <li
                    key={option.value}
                    className={cx(
                      'vx-multiselect__option',
                      isSelected && 'vx-multiselect__option--selected',
                      option.disabled && 'vx-multiselect__option--disabled',
                    )}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => toggle(option)}
                  >
                    <span className={cx('vx-multiselect__checkbox', isSelected && 'vx-multiselect__checkbox--checked')}>
                      {isSelected ? <Check size={11} /> : null}
                    </span>
                    <span>{option.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
