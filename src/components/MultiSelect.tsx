import { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { cx } from '../lib/cx';
import { getDialogPopoverContext } from '../lib/dialogPopover';
import { useIsMobile } from '../hooks/useIsMobile';
import { BottomSheet } from './mobile/BottomSheet';

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const isMobile = useIsMobile();

  /** Fixed position for portaled desktop dropdown. null = render inline (mobile). */
  const [dropPos, setDropPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    direction: 'down' | 'up';
  } | null>(null);
  const dialogContentRef = useRef<HTMLElement | null>(null);

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

  // ─── 桌面端：点击外部 / Escape 关闭 ──────────────────────────────
  useEffect(() => {
    if (!open || isMobile) return;
    const onOutside = (e: Event) => {
      const inWrap = wrapRef.current?.contains(e.target as Node);
      const inDropdown = dropdownRef.current?.contains(e.target as Node);
      if (!inWrap && !inDropdown) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('keydown', onKey);
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

  // Use an inline mobile sheet only outside Dialog so dialog popovers can escape clipping.
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
    const direction = spaceBelow < 300 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropPos(
      direction === 'down'
        ? { top: rect.bottom + 4, left: rect.left, width: rect.width, direction }
        : { bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width, direction },
    );
  }, [open, isMobile]);

  // Close fixed-position dropdown on scroll/resize (but not when scrolling inside it)
  useEffect(() => {
    if (!open || !dropPos) return;
    const close = (e: Event) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
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
  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    const next = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
    setOpen(false);
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

  // ─── 移动端：pendingValue + 确认模式 ─────────────────────────────
  const [pendingValue, setPendingValue] = useState<string[]>(value);

  // 打开 BottomSheet 时，同步 pendingValue 为当前值
  useEffect(() => {
    if (open && isMobile) {
      setPendingValue(value);
    }
  }, [open, isMobile, value]);

  const handlePendingToggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    setPendingValue((prev) =>
      prev.includes(option.value)
        ? prev.filter((v) => v !== option.value)
        : [...prev, option.value],
    );
  };

  const handleConfirm = () => {
    if (!isControlled) setInternalValue(pendingValue);
    onChange?.(pendingValue);
    // BottomSheet 自主关闭
  };

  // Mobile BottomSheet content
  const mobileSheetContent = (
    <>
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
            const isSelected = pendingValue.includes(option.value);
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
                onClick={() => handlePendingToggle(option)}
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
    </>
  );

  return (
    <div ref={wrapRef} className={cx('vx-multiselect', open && 'vx-multiselect--open', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
        ref={triggerRef}
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
      {/* Desktop dropdown - fixed position */}
      {open && !isMobile && (() => {
        const shouldPortal = Boolean(dropPos);
        const dropdownStyle = shouldPortal && dropPos
          ? { top: dropPos.top, bottom: dropPos.bottom, left: dropPos.left, width: dropPos.width, pointerEvents: 'auto' as const }
          : undefined;
        const dropdownNode = (
          <div
            ref={dropdownRef}
            className={cx(
              'vx-multiselect__dropdown',
              dropPos?.direction === 'up' && 'vx-multiselect__dropdown--up',
              Boolean(dialogContentRef.current) && 'vx-multiselect__dropdown--in-dialog',
            )}
            style={dropdownStyle}
          >
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
        );
        return shouldPortal ? createPortal(dropdownNode, dialogContentRef.current ?? document.body) : dropdownNode;
      })()}
      {/* Mobile BottomSheet */}
      {isMobile && (
        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title={label || placeholder}
          draggable
          showConfirm
          confirmDisabled={pendingValue.length === 0}
          onConfirm={handleConfirm}
          inlineInDialog={Boolean(getDialogPopoverContext(wrapRef.current).dialogContent)}
        >
          {mobileSheetContent}
        </BottomSheet>
      )}
    </div>
  );
}
