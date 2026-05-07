import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: string;
  indeterminate?: boolean;
}

export function Checkbox({ className, label, description, indeterminate, ...props }: CheckboxProps) {
  return (
    <label className={cx('vx-checkbox', props.disabled && 'vx-checkbox--disabled')}>
      <span className="vx-checkbox__control-wrap">
        <input
          type="checkbox"
          className={cx('vx-checkbox__input', className)}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate ?? false;
          }}
          {...props}
        />
        <span className="vx-checkbox__box" aria-hidden="true">
          {indeterminate ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      {label ? (
        <span className="vx-checkbox__copy">
          <span className="vx-checkbox__label">{label}</span>
          {description ? <span className="vx-checkbox__description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
