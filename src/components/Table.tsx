import type { ReactNode, HTMLAttributes } from 'react';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cx } from '../lib/cx';
import { Input } from './Input';
import { Select, type SelectOption } from './Select';
import { Checkbox } from './Checkbox';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  /** 此列是否可作为筛选条件 */
  filterable?: boolean;
  /** 筛选类型：'text' 文本搜索 | 'select' 下拉选择 */
  filterType?: 'text' | 'select';
  /** 当下拉筛选时，可选的选项列表（不传则从 data 中自动提取去重值） */
  filterOptions?: SelectOption[];
  /** 是否参与全局文本搜索（默认 true） */
  searchable?: boolean;
}

export type TableVariant = 'default' | 'dark' | 'outline';

/** 可从哪个边移除边框 */
export type TableBorderSide = 'top' | 'right' | 'bottom' | 'left';

export interface TableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  data: T[];
  /** Row height preset. */
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  /** @deprecated Use size="sm" instead */
  compact?: boolean;
  stickyHeader?: boolean;
  /** 搜索栏是否吸顶（滚动时保持可见），默认 false */
  stickyFilter?: boolean;
  borderless?: boolean;
  headless?: boolean;
  rounded?: boolean;
  loading?: boolean;
  caption?: string;
  emptyText?: ReactNode;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (column: string, direction: SortDirection) => void;

  // ── 视觉变体 ──
  /** 表格视觉变体：'default' | 'dark' | 'outline' */
  variant?: TableVariant;
  /** 固定表格布局（列宽严格按 width 分配，不换行截断） */
  fixed?: boolean;

  // ── 边框控制 ──
  /** 移除指定边边框：'all' 移除四边，或传入边列表。用于嵌入 Card 等容器场景 */
  removeBorders?: 'all' | TableBorderSide[];
  /** 紧凑嵌入模式：移除内边距、圆角和外边框，适合直接放入 Card 中 */
  flush?: boolean;

  // ── 行交互 ──
  /** 行点击回调 */
  onRowClick?: (row: T, index: number) => void;
  /** 自定义行类名（字符串或函数） */
  rowClassName?: string | ((row: T, index: number) => string);

  // ── 行选择 ──
  /** 启用行选择（显示复选框列） */
  selectable?: boolean;
  /** 受控选中行索引集合 */
  selectedRows?: Set<number>;
  /** 选中行变化回调 */
  onSelectionChange?: (selected: Set<number>) => void;

  // ── 筛选栏 ──
  /** 是否显示筛选栏（默认数据 > filterThreshold 时自动显示） */
  filterable?: boolean;
  /** 搜索框占位文本 */
  filterPlaceholder?: string;
  /** 当前筛选文本（受控） */
  filterValue?: string;
  /** 筛选文本变化回调 */
  onFilterChange?: (value: string) => void;
  /** 列筛选状态 */
  columnFilters?: Record<string, string>;
  /** 列筛选变化回调 */
  onColumnFilterChange?: (columnKey: string, value: string) => void;
  /** 数据量超过此值时自动显示筛选栏（默认 10） */
  filterThreshold?: number;

  // ── 搜索优化 ──
  /** 搜索防抖延迟（毫秒），默认 200。设为 0 禁用防抖 */
  searchDebounce?: number;
  /** 限定参与文本搜索的列 key 列表，不传则搜索所有 searchable !== false 的列 */
  searchColumns?: string[];
}

// ── 排序图标 ──
function SortIcon({ dir, active }: { dir: SortDirection; active: boolean }) {
  if (!active) return <ArrowUpDown size={12} className="vx-table__sort-icon" />;
  if (dir === 'asc') return <ArrowUp size={12} className="vx-table__sort-icon vx-table__sort-icon--active" />;
  return <ArrowDown size={12} className="vx-table__sort-icon vx-table__sort-icon--active" />;
}

// ══════════════════════════════════════════════════════════════════════════════
//  Table 主组件
// ══════════════════════════════════════════════════════════════════════════════

export function Table<T>({
  columns,
  data,
  size = 'md',
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  stickyHeader = false,
  stickyFilter = false,
  borderless = false,
  headless = false,
  rounded = true,
  loading = false,
  caption,
  emptyText = '暂无数据',
  sortColumn: controlledSortCol,
  sortDirection: controlledSortDir,
  onSortChange,
  variant = 'default',
  fixed = false,
  removeBorders,
  flush = false,
  onRowClick,
  rowClassName,
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  className,
  filterable: filterableProp,
  filterPlaceholder = '搜索...',
  filterValue: controlledFilterValue,
  onFilterChange,
  columnFilters: controlledColumnFilters,
  onColumnFilterChange,
  filterThreshold = 10,
  searchDebounce = 200,
  searchColumns,
  ...props
}: TableProps<T>) {
  const resolvedSize = compact ? 'sm' : size;

  // ── 排序状态 ──
  const [internalSortCol, setInternalSortCol] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDirection>(null);

  const isSortControlled = controlledSortCol !== undefined;
  const sortCol = isSortControlled ? controlledSortCol : internalSortCol;
  const sortDir = isSortControlled ? (controlledSortDir ?? null) : internalSortDir;

  const handleSort = useCallback((key: string) => {
    let newDir: SortDirection;
    if (sortCol !== key) {
      newDir = 'asc';
    } else if (sortDir === 'asc') {
      newDir = 'desc';
    } else if (sortDir === 'desc') {
      newDir = null;
    } else {
      newDir = 'asc';
    }

    if (!isSortControlled) {
      setInternalSortCol(newDir === null ? null : key);
      setInternalSortDir(newDir);
    }
    onSortChange?.(key, newDir);
  }, [sortCol, sortDir, isSortControlled, onSortChange]);

  // ── 筛选状态 ──
  const [internalFilterValue, setInternalFilterValue] = useState('');
  const [internalColumnFilters, setInternalColumnFilters] = useState<Record<string, string>>({});

  const filterValue = controlledFilterValue ?? internalFilterValue;
  const columnFilters = controlledColumnFilters ?? internalColumnFilters;

  // 防抖搜索值（用于实际过滤）
  const [debouncedFilterValue, setDebouncedFilterValue] = useState(filterValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchDebounce <= 0) {
      setDebouncedFilterValue(filterValue);
      return;
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilterValue(filterValue);
    }, searchDebounce);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [filterValue, searchDebounce]);

  const handleFilterChange = useCallback((val: string) => {
    if (onFilterChange) {
      onFilterChange(val);
    } else {
      setInternalFilterValue(val);
    }
  }, [onFilterChange]);

  const handleColumnFilterChange = useCallback((colKey: string, val: string) => {
    if (onColumnFilterChange) {
      onColumnFilterChange(colKey, val);
    } else {
      setInternalColumnFilters((prev) => {
        const next = { ...prev };
        if (val === '' || val === undefined) {
          delete next[colKey];
        } else {
          next[colKey] = val;
        }
        return next;
      });
    }
  }, [onColumnFilterChange]);

  // ── 可搜索列 ──
  const searchableCols = useMemo(() => {
    if (searchColumns) return searchColumns;
    return columns.filter((c) => c.searchable !== false).map((c) => c.key);
  }, [columns, searchColumns]);

  // ── 筛选逻辑（使用防抖后的值）──
  const filteredData = useMemo(() => {
    let result = data;
    if (debouncedFilterValue) {
      const q = debouncedFilterValue.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          if (!searchableCols.includes(col.key)) return false;
          const val = col.accessor(row);
          return String(val ?? '').toLowerCase().includes(q);
        }),
      );
    }
    for (const [colKey, colVal] of Object.entries(columnFilters)) {
      if (!colVal) continue;
      result = result.filter((row) => {
        const col = columns.find((c) => c.key === colKey);
        if (!col) return true;
        return String(col.accessor(row) ?? '') === colVal;
      });
    }
    return result;
  }, [data, debouncedFilterValue, columnFilters, columns, searchableCols]);

  // ── 排序逻辑（在过滤后执行） ──
  const displayData = useMemo(() => {
    if (isSortControlled) return filteredData;
    if (!sortCol || !sortDir) return filteredData;
    const col = columns.find((c) => c.key === sortCol);
    if (!col) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aRaw = col.accessor(a);
      const bRaw = col.accessor(b);
      let cmp: number;
      if (typeof aRaw === 'number' && typeof bRaw === 'number') {
        cmp = aRaw - bRaw;
      } else {
        cmp = String(aRaw ?? '').localeCompare(String(bRaw ?? ''), undefined, { numeric: true });
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [filteredData, sortCol, sortDir, columns, isSortControlled]);

  // ── 行选择 ──
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<number>>(new Set());
  const selectedSet = controlledSelectedRows ?? internalSelectedRows;

  const handleSelectRow = useCallback((index: number) => {
    const next = new Set(selectedSet);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    if (!controlledSelectedRows) {
      setInternalSelectedRows(next);
    }
    onSelectionChange?.(next);
  }, [selectedSet, controlledSelectedRows, onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    const allFilteredIndices = displayData.map((_, i) => i);
    const allSelected = allFilteredIndices.every((i) => selectedSet.has(i));
    const next = new Set(selectedSet);
    if (allSelected) {
      allFilteredIndices.forEach((i) => next.delete(i));
    } else {
      allFilteredIndices.forEach((i) => next.add(i));
    }
    if (!controlledSelectedRows) {
      setInternalSelectedRows(next);
    }
    onSelectionChange?.(next);
  }, [displayData, selectedSet, controlledSelectedRows, onSelectionChange]);

  const isAllSelected = displayData.length > 0 && displayData.every((_, i) => selectedSet.has(i));
  const isIndeterminate = !isAllSelected && displayData.some((_, i) => selectedSet.has(i));

  // ── 是否显示筛选栏 ──
  const showFilter = filterableProp === true || (filterableProp !== false && data.length > filterThreshold);
  const filterableColumns = columns.filter((c) => c.filterable);

  // ── 自动提取列筛选选项 ──
  const columnFilterOptions = useMemo(() => {
    const map: Record<string, SelectOption[]> = {};
    for (const col of filterableColumns) {
      if (col.filterOptions) {
        map[col.key] = col.filterOptions;
      } else {
        const values = [...new Set(data.map((row) => String(col.accessor(row) ?? '')))];
        map[col.key] = values.map((v) => ({ value: v, label: v }));
      }
    }
    return map;
  }, [filterableColumns, data]);

  // 边框控制类名
  const borderSideClasses = useMemo(() => {
    if (!removeBorders) return {};
    if (removeBorders === 'all') return { top: true, right: true, bottom: true, left: true };
    return Object.fromEntries(removeBorders.map((s) => [s, true]));
  }, [removeBorders]);

  return (
    <div className={cx(
      'vx-table-wrap',
      variant !== 'default' && `vx-table-wrap--${variant}`,
      borderless && 'vx-table-wrap--borderless',
      !rounded && 'vx-table-wrap--square',
      flush && 'vx-table-wrap--flush',
      borderSideClasses.top && 'vx-table-wrap--no-top',
      borderSideClasses.right && 'vx-table-wrap--no-right',
      borderSideClasses.bottom && 'vx-table-wrap--no-bottom',
      borderSideClasses.left && 'vx-table-wrap--no-left',
      stickyFilter && 'vx-table-wrap--sticky-filter',
      className,
    )} {...props}>
      {/* ── 筛选栏 ── */}
      {showFilter ? (
        <div className="vx-table__filterbar">
          <div className="vx-table__filterbar-search">
            <Input
              size="sm"
              placeholder={filterPlaceholder}
              value={filterValue}
              onChange={(e) => handleFilterChange(e.target.value)}
              prefix={<Search size={14} />}
              rounded
            />
          </div>
          {filterableColumns.map((col) => (
            <div key={col.key} className="vx-table__filterbar-col">
              <Select
                options={[
                  { value: '', label: `全部${col.header}` },
                  ...(columnFilterOptions[col.key] ?? []),
                ]}
                value={columnFilters[col.key] ?? ''}
                onChange={(val) => handleColumnFilterChange(col.key, val ?? '')}
                placeholder={`筛选${col.header}`}
                searchable={false}
                clearable
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* ── 表格 ── */}
      <table
        className={cx(
          'vx-table',
          `vx-table--${variant}`,
          striped && 'vx-table--striped',
          hoverable && 'vx-table--hoverable',
          bordered && 'vx-table--bordered',
          borderless && 'vx-table--borderless',
          fixed && 'vx-table--fixed',
          resolvedSize !== 'md' && `vx-table--${resolvedSize}`,
          stickyHeader && 'vx-table--sticky',
          onRowClick && 'vx-table--clickable',
          selectable && 'vx-table--selectable',
        )}
      >
        {caption ? <caption className="vx-table__caption">{caption}</caption> : null}
        {!headless ? (
          <thead>
          <tr>
            {selectable ? (
              <th className="vx-table__th vx-table__th--checkbox" style={{ width: 44 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  aria-label="全选"
                />
              </th>
            ) : null}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cx(
                  'vx-table__th',
                  col.sortable && 'vx-table__th--sortable',
                  col.align && `vx-table__th--${col.align}`,
                  col.className,
                )}
                style={{ width: col.width }}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  sortCol === col.key
                    ? sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'
                    : undefined
                }
              >
                <span className="vx-table__th-inner">
                  {col.header}
                  {col.sortable ? (
                    <SortIcon dir={sortCol === col.key ? sortDir : null} active={sortCol === col.key} />
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
          </thead>
        ) : null}
        <tbody className={cx(loading && 'vx-table__body--loading')}>
          {displayData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="vx-table__empty">{emptyText}</td>
            </tr>
          ) : (
            displayData.map((row, ri) => {
              const isSelected = selectedSet.has(ri);
              const extraClassName = typeof rowClassName === 'function'
                ? rowClassName(row, ri)
                : rowClassName;
              return (
                <tr
                  key={ri}
                  className={cx(
                    'vx-table__row',
                    isSelected && 'vx-table__row--selected',
                    extraClassName,
                  )}
                  onClick={onRowClick ? () => onRowClick(row, ri) : undefined}
                >
                  {selectable ? (
                    <td className="vx-table__td vx-table__td--checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(ri)}
                        aria-label={`选择第 ${ri + 1} 行`}
                      />
                    </td>
                  ) : null}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx('vx-table__td', col.align && `vx-table__td--${col.align}`, col.className)}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
