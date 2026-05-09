import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cx } from '../lib/cx';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required, children, ...props },
  ref,
) {
  return (
    <label ref={ref} className={cx('vx-label', className)} {...props}>
      {children}
      {required ? <span className="vx-label__required" aria-hidden="true"> *</span> : null}
    </label>
  );
});
