import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: string;
}

export function Radio({ className, label, description, ...props }: RadioProps) {
  return (
    <label className={cx('vx-radio', props.disabled && 'vx-radio--disabled')}>
      <span className="vx-radio__control-wrap">
        <input type="radio" className={cx('vx-radio__input', className)} {...props} />
        <span className="vx-radio__circle" aria-hidden="true">
          <span className="vx-radio__dot" />
        </span>
      </span>
      {label ? (
        <span className="vx-radio__copy">
          <span className="vx-radio__label">{label}</span>
          {description ? <span className="vx-radio__description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

export interface RadioGroupProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({ label, children, className }: RadioGroupProps) {
  return (
    <fieldset className={cx('vx-radio-group', className)}>
      {label ? <legend className="vx-field-group__label">{label}</legend> : null}
      <div className="vx-radio-group__items">{children}</div>
    </fieldset>
  );
}
