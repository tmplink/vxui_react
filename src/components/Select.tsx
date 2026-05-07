import type { SelectHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  placeholder?: string;
}

export function Select({ className, label, hint, placeholder, children, ...props }: SelectProps) {
  return (
    <label className="vx-field-group">
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <span className={cx('vx-select', className)}>
        <select className="vx-select__field" {...props}>
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <span className="vx-select__arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      {hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
