import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

type InputVariant = 'default' | 'filled' | 'underline' | 'borderless';
type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  label?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
  /** Visual style */
  variant?: InputVariant;
  /** Height / font-size preset */
  size?: InputSize;
  /** Pill-shaped input */
  rounded?: boolean;
}

export function Input({ className, label, hint, prefix, suffix, error,
  variant = 'default', size = 'md', rounded = false, ...props }: InputProps) {
  return (
    <label className="vx-field-group">
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <span className={cx(
        'vx-input',
        variant !== 'default' && `vx-input--${variant}`,
        size !== 'md' && `vx-input--${size}`,
        rounded && 'vx-input--rounded',
        error && 'vx-input--invalid',
        className,
      )}>
        {prefix ? <span className="vx-input__ornament">{prefix}</span> : null}
        <input className="vx-input__field" aria-invalid={error ? 'true' : undefined} {...props} />
        {suffix ? <span className="vx-input__ornament">{suffix}</span> : null}
      </span>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
