import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
}

export function Input({ className, label, hint, prefix, suffix, error, ...props }: InputProps) {
  return (
    <label className="vx-field-group">
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <span className={cx('vx-input', error && 'vx-input--invalid', className)}>
        {prefix ? <span className="vx-input__ornament">{prefix}</span> : null}
        <input className="vx-input__field" aria-invalid={error ? 'true' : undefined} {...props} />
        {suffix ? <span className="vx-input__ornament">{suffix}</span> : null}
      </span>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
