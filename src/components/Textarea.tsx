import type { TextareaHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export function Textarea({ className, label, hint, resize = 'vertical', style, ...props }: TextareaProps) {
  return (
    <label className="vx-field-group">
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <textarea
        className={cx('vx-textarea', className)}
        style={{ resize, ...style }}
        {...props}
      />
      {hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </label>
  );
}
