import { useState, useRef, useEffect, useLayoutEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { cx } from '../lib/cx';
import { getDialogPopoverContext } from '../lib/dialogPopover';
import { useIsMobile } from '../hooks/useIsMobile';
import { Sheet } from './Sheet';

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
  /**
   * 自定义移动端选择面板组件。
   * 默认使用 Sheet 组件。传入 null 可禁用移动端面板。
   */
  mobileSheet?: ReactNode;
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
  mobileSheet,
}: SelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
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
    /**
     * 下拉列表可用的最大高度（像素）。
     * 来自 trigger 与视口上下边缘之间的距离减去安全边距，
     * 这样下拉能完全显示在视口内且不会出现无谓的滚动条。
     */
    maxHeight: number;
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
      // 移动端需要延迟聚焦，等 Sheet 进入动画完成、body overflow 稳定后再聚焦
      // 否则 iOS Safari 会在 body overflow 切换间隙触发视口调整，导致页面跳动
      const delay = isMobile ? 350 : 0;
      const timeoutId = setTimeout(() => searchRef.current?.focus(), delay);
      return () => clearTimeout(timeoutId);
    }
  }, [open, showSearch, isMobile]);

  // ─── 桌面端：点击外部 / Escape 关闭 ──────────────────────────────
  useEffect(() => {
    if (!open || isMobile) return;
    const onOutside = (event: Event) => {
      const inWrap = wrapRef.current?.contains(event.target as Node);
      const inDropdown = dropdownRef.current?.contains(event.target as Node);
      if (!inWrap && !inDropdown) setOpen(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
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
    // 只有当下方空间不足以容纳最小下拉时才考虑向上展开
    const direction = spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down';
    // 留出 8px 边距避免贴边；并保留 120px 下限以防止极小空间时列表过窄
    const SAFETY_MARGIN = 8;
    const MIN_HEIGHT = 120;
    const available =
      direction === 'down'
        ? Math.max(MIN_HEIGHT, spaceBelow - SAFETY_MARGIN)
        : Math.max(MIN_HEIGHT, spaceAbove - SAFETY_MARGIN);
    setDropPos(
      direction === 'down'
        ? { top: rect.bottom + 4, left: rect.left, width: rect.width, direction, maxHeight: available }
        : { bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width, direction, maxHeight: available },
    );
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || !dropPos) return;
    const close = (event: Event) => {
      if (dropdownRef.current?.contains(event.target as Node)) return;
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
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  };

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isControlled) setInternalValue(undefined);
    onChange?.(undefined);
  };

  // ─── 移动端：pendingValue + 确认模式 ─────────────────────────────
  const [pendingValue, setPendingValue] = useState<string | undefined>(value);

  // 打开 Sheet 时，同步 pendingValue 为当前值
  useEffect(() => {
    if (open && isMobile) {
      setPendingValue(value);
    }
  }, [open, isMobile, value]);

  const handlePendingSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setPendingValue(option.value);
  };

  const handleConfirm = () => {
    if (!isControlled) setInternalValue(pendingValue);
    onChange?.(pendingValue);
    // Sheet 自主关闭
  };

  // Mobile Sheet content
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
                option.value === pendingValue && 'vx-select__option--selected',
                option.disabled && 'vx-select__option--disabled',
              )}
              role="option"
              aria-selected={option.value === pendingValue}
              aria-disabled={option.disabled}
              onClick={() => handlePendingSelect(option)}
            >
              <span>{option.label}</span>
              {option.value === pendingValue ? <Check size={14} /> : null}
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
            <ul
              id={listboxId}
              className="vx-select__list"
              role="listbox"
              aria-label={label ?? 'Options'}
              style={dropPos ? { maxHeight: dropPos.maxHeight } : undefined}
            >
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
        return shouldPortal ? createPortal(dropdownNode, document.body) : dropdownNode;
      })()}
      {/* Mobile Sheet — 可通过 mobileSheet prop 注入自定义组件 */}
      {isMobile && (mobileSheet !== undefined ? (
        mobileSheet
      ) : (
        <Sheet
          side="bottom"
          open={open}
          onOpenChange={(v) => { if (!v) setOpen(false); }}
          title={label || placeholder}
          showConfirm
          confirmDisabled={pendingValue === undefined}
          onConfirm={handleConfirm}
        >
          {mobileSheetContent}
        </Sheet>
      ))}
    </div>
  );
}
