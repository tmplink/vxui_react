import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import { cx } from '../lib/cx';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Toggle({
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  size = 'md',
  className,
  children,
  onClick,
  ...props
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = controlledPressed !== undefined;
  const pressed = isControlled ? controlledPressed : internalPressed;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isControlled) setInternalPressed((p) => !p);
    onPressedChange?.(!pressed);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx('vx-toggle', `vx-toggle--${size}`, pressed && 'vx-toggle--on', className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ToggleGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ToggleGroup({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  type = 'single',
  size = 'md',
  className,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (type === 'multiple' ? [] : ''),
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isSelected = (v: string) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  const handleClick = (v: string) => {
    let next: string | string[];
    if (type === 'multiple') {
      const arr = Array.isArray(value) ? value : [];
      next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    } else {
      next = value === v ? '' : v;
    }
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div className={cx('vx-toggle-group', className)} role="group">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={isSelected(item.value)}
          disabled={item.disabled}
          className={cx(
            'vx-toggle',
            `vx-toggle--${size}`,
            isSelected(item.value) && 'vx-toggle--on',
            'vx-toggle-group__item',
          )}
          onClick={() => !item.disabled && handleClick(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
