import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Input({ className, label, hint, prefix, suffix, ...props }: InputProps) {
  return (
    <label className="vx-field-group">
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <span className={cx('vx-input', className)}>
        {prefix ? <span className="vx-input__ornament">{prefix}</span> : null}
        <input className="vx-input__field" {...props} />
        {suffix ? <span className="vx-input__ornament">{suffix}</span> : null}
      </span>
      {hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
