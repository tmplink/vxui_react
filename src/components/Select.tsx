import { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { cx } from '../lib/cx';
import { getDialogPopoverContext } from '../lib/dialogPopover';
import { useIsMobile } from '../hooks/useIsMobile';
import { BottomSheet } from './mobile/BottomSheet';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
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
  searchable?: boolean | number;
  className?: string;
}

export function Select({
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
}: SelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const isMobile = useIsMobile();

  const [dropPos, setDropPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    direction: 'down' | 'up';
  } | null>(null);
  const dialogContentRef = useRef<HTMLElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );
  const showSearch =
    typeof searchable === 'number' ? options.length > searchable : searchable;

  useEffect(() => {
    if (!open) {
      setSearch('');
      return;
    }
    if (showSearch) {
      const timeoutId = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open, showSearch]);

  // Close with animation for mobile bottom sheet
  const closeWithAnimation = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 300);
  };

  useEffect(() => {
    if (!open) return;
    const onOutside = (event: Event) => {
      const inWrap = wrapRef.current?.contains(event.target as Node);
      const inDropdown = dropdownRef.current?.contains(event.target as Node);
      if (!inWrap && !inDropdown) closeWithAnimation();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeWithAnimation();
      }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, closeWithAnimation]);

  // Mark dialog content when BottomSheet is open on mobile
  useEffect(() => {
    if (!open || !isMobile) return;
    const dialogContent = wrapRef.current?.closest<HTMLElement>('.vx-dialog__content');
    if (dialogContent) {
      dialogContent.dataset.hasOpenBottomSheet = '1';
      return () => { delete dialogContent.dataset.hasOpenBottomSheet; };
    }
  }, [open, isMobile]);

  useEffect(() => {
    const { shouldInline } = getDialogPopoverContext(wrapRef.current);
    if (!open || !shouldInline) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
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
    const direction = spaceBelow < 280 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropPos(
      direction === 'down'
        ? { top: rect.bottom + 4, left: rect.left, width: rect.width, direction }
        : { bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width, direction },
    );
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || !dropPos) return;
    const close = (event: Event) => {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      closeWithAnimation();
    };
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [open, dropPos, closeWithAnimation]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    closeWithAnimation();
  };

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isControlled) setInternalValue(undefined);
    onChange?.(undefined);
  };

  // Mobile BottomSheet content
  const mobileSheetContent = (
    <>
      {showSearch && (
        <div className="vx-select__search-wrap">
          <input
            ref={searchRef}
            type="text"
            className="vx-select__search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={searchPlaceholder}
          />
        </div>
      )}
      <ul id={listboxId} className="vx-select__list" role="listbox" aria-label={label ?? 'Options'}>
        {filtered.length === 0 ? (
          <li className="vx-select__empty">{emptyText}</li>
        ) : (
          filtered.map((option) => (
            <li
              key={option.value}
              className={cx(
                'vx-select__option',
                option.value === value && 'vx-select__option--selected',
                option.disabled && 'vx-select__option--disabled',
              )}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {option.value === value ? <Check size={14} /> : null}
            </li>
          ))
        )}
      </ul>
    </>
  );

  return (
    <div ref={wrapRef} className={cx('vx-select', open && 'vx-select--open', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <button
        ref={triggerRef}
        type="button"
        className={cx(
          'vx-select__trigger',
          error && 'vx-select__trigger--invalid',
          disabled && 'vx-select__trigger--disabled',
        )}
        onClick={() => !disabled && setOpen((isOpen) => !isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <span className={cx('vx-select__value', !selectedOption && 'vx-select__value--placeholder')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="vx-select__icons">
          {clearable && selectedOption && (
            <span
              className="vx-select__clear"
              onClick={clear}
              role="button"
              aria-label="Clear selection"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={cx('vx-select__chevron', open && 'vx-select__chevron--open')}
          />
        </span>
      </button>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
      {/* Desktop dropdown - fixed position */}
      {open && !isMobile && (() => {
        const shouldPortal = Boolean(dropPos);
        const dropdownStyle = dropPos
          ? { top: dropPos.top, bottom: dropPos.bottom, left: dropPos.left, width: dropPos.width, pointerEvents: 'auto' as const }
          : undefined;
        const dropdownNode = (
          <div
            ref={dropdownRef}
            className={cx(
              'vx-select__dropdown',
              closing && 'vx-select__dropdown--closing',
              dropPos?.direction === 'up' && 'vx-select__dropdown--up',
              Boolean(dialogContentRef.current) && 'vx-select__dropdown--in-dialog',
            )}
            style={dropdownStyle}
          >
            {showSearch && (
              <div className="vx-select__search-wrap">
                <input
                  ref={searchRef}
                  type="text"
                  className="vx-select__search"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label={searchPlaceholder}
                />
              </div>
            )}
            <ul id={listboxId} className="vx-select__list" role="listbox" aria-label={label ?? 'Options'}>
              {filtered.length === 0 ? (
                <li className="vx-select__empty">{emptyText}</li>
              ) : (
                filtered.map((option) => (
                  <li
                    key={option.value}
                    className={cx(
                      'vx-select__option',
                      option.value === value && 'vx-select__option--selected',
                      option.disabled && 'vx-select__option--disabled',
                    )}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                  >
                    <span>{option.label}</span>
                    {option.value === value ? <Check size={14} /> : null}
                  </li>
                ))
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
          onClose={closeWithAnimation}
          title={label || placeholder}
          draggable
          closeOnOverlayClick
        >
          {mobileSheetContent}
        </BottomSheet>
      )}
    </div>
  );
}
