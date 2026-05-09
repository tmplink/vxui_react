import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '../lib/cx';

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  className?: string;
  weekStartsOnMonday?: boolean;
}

export function Calendar({
  value: controlledValue,
  defaultValue,
  onChange,
  min,
  max,
  className,
  weekStartsOnMonday = false,
}: CalendarProps) {
  const today = new Date();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;

  const [viewYear, setViewYear] = useState((selected ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((selected ?? today).getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const offset = weekStartsOnMonday ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;

  const WEEKDAYS = weekStartsOnMonday
    ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDisabled = useCallback(
    (day: number) => {
      const date = new Date(viewYear, viewMonth, day);
      if (min) {
        const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate());
        if (date < minDay) return true;
      }
      if (max) {
        const maxDay = new Date(max.getFullYear(), max.getMonth(), max.getDate());
        if (date > maxDay) return true;
      }
      return false;
    },
    [viewYear, viewMonth, min, max],
  );

  const selectDay = (day: number) => {
    if (isDisabled(day)) return;
    const date = new Date(viewYear, viewMonth, day);
    if (!isControlled) setInternalValue(date);
    onChange?.(date);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });

  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className={cx('vx-calendar', className)}>
      <div className="vx-calendar__header">
        <button
          type="button"
          className="vx-calendar__nav-btn"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="vx-calendar__month-label">
          {monthName} {viewYear}
        </span>
        <button
          type="button"
          className="vx-calendar__nav-btn"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="vx-calendar__grid" role="grid" aria-label={`${monthName} ${viewYear}`}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="vx-calendar__weekday" role="columnheader">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="vx-calendar__cell vx-calendar__cell--empty" />;
          }
          const date = new Date(viewYear, viewMonth, day);
          const isToday = isSameDay(date, today);
          const isSelected = selected ? isSameDay(date, selected) : false;
          const disabled = isDisabled(day);
          return (
            <button
              key={day}
              type="button"
              role="gridcell"
              className={cx(
                'vx-calendar__cell',
                isToday && 'vx-calendar__cell--today',
                isSelected && 'vx-calendar__cell--selected',
                disabled && 'vx-calendar__cell--disabled',
              )}
              onClick={() => selectDay(day)}
              disabled={disabled}
              aria-label={date.toLocaleDateString()}
              aria-selected={isSelected}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
