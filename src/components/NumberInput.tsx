import type { InputHTMLAttributes } from 'react';
import { useCallback } from 'react';
import { cx } from '../lib/cx';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  label?: string;
  hint?: string;
  error?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  className,
  label,
  hint,
  error,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  ...props
}: NumberInputProps) {
  const clamp = useCallback(
    (v: number) => {
      let result = v;
      if (min !== undefined) result = Math.max(min, result);
      if (max !== undefined) result = Math.min(max, result);
      return result;
    },
    [min, max],
  );

  const increment = () => {
    if (disabled) return;
    onChange?.(clamp((value ?? 0) + step));
  };

  const decrement = () => {
    if (disabled) return;
    onChange?.(clamp((value ?? 0) - step));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange?.(clamp(v));
  };

  const atMin = min !== undefined && (value ?? 0) <= min;
  const atMax = max !== undefined && (value ?? 0) >= max;

  return (
    <label className="vx-field-group">
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <span
        className={cx(
          'vx-number-input',
          error && 'vx-number-input--invalid',
          disabled && 'vx-number-input--disabled',
          className,
        )}
      >
        <button
          type="button"
          className="vx-number-input__btn"
          onClick={decrement}
          disabled={disabled || atMin}
          aria-label="Decrease"
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <input
          type="number"
          className="vx-number-input__field"
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        <button
          type="button"
          className="vx-number-input__btn"
          onClick={increment}
          disabled={disabled || atMax}
          aria-label="Increase"
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 2v8M2 6h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </span>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
