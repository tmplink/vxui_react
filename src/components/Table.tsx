import type { ReactNode, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { useState, useCallback } from 'react';
import { cx } from '../lib/cx';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  data: T[];
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  caption?: string;
  emptyText?: ReactNode;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (column: string, direction: SortDirection) => void;
}

export function Table<T>({
  columns,
  data,
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  stickyHeader = false,
  caption,
  emptyText = '暂无数据',
  sortColumn: controlledSortCol,
  sortDirection: controlledSortDir,
  onSortChange,
  className,
  ...props
}: TableProps<T>) {
  const [internalSortCol, setInternalSortCol] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDirection>(null);

  const isControlled = controlledSortCol !== undefined;
  const sortCol = isControlled ? controlledSortCol : internalSortCol;
  const sortDir = isControlled ? (controlledSortDir ?? null) : internalSortDir;

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

    if (!isControlled) {
      setInternalSortCol(newDir === null ? null : key);
      setInternalSortDir(newDir);
    }
    onSortChange?.(key, newDir);
  }, [sortCol, sortDir, isControlled, onSortChange]);

  return (
    <div className={cx('vx-table-wrap', className)} {...props}>
      <table
        className={cx(
          'vx-table',
          striped && 'vx-table--striped',
          hoverable && 'vx-table--hoverable',
          bordered && 'vx-table--bordered',
          compact && 'vx-table--compact',
          stickyHeader && 'vx-table--sticky',
        )}
      >
        {caption ? <caption className="vx-table__caption">{caption}</caption> : null}
        <thead>
          <tr>
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
                    <span className="vx-table__sort-icon" aria-hidden="true">
                      {sortCol === col.key && sortDir === 'asc' ? '↑' : sortCol === col.key && sortDir === 'desc' ? '↓' : '↕'}
                    </span>
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="vx-table__empty">{emptyText}</td>
            </tr>
          ) : (
            data.map((row, ri) => (
              <tr key={ri} className="vx-table__row">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx('vx-table__td', col.align && `vx-table__td--${col.align}`, col.className)}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
