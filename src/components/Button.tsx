import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cx } from '../lib/cx';

type ButtonVariant = 'solid' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'solid', size = 'md', fullWidth = false, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'vx-button',
        `vx-button--${variant}`,
        `vx-button--${size}`,
        fullWidth && 'vx-button--full-width',
        className,
      )}
      {...props}
    />
  );
});
