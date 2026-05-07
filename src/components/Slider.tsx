import type { InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  hint?: string;
}

export function Slider({ className, label, showValue = false, hint, value, defaultValue, ...props }: SliderProps) {
  const displayValue = value ?? defaultValue ?? '';
  return (
    <label className="vx-field-group">
      {label || showValue ? (
        <span className="vx-slider__header">
          {label ? <span className="vx-field-group__label vx-slider__label">{label}</span> : null}
          {showValue ? <span className="vx-slider__value">{displayValue}</span> : null}
        </span>
      ) : null}
      <input
        type="range"
        className={cx('vx-slider', className)}
        value={value}
        defaultValue={defaultValue}
        {...props}
      />
      {hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
