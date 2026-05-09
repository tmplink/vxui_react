import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cx } from '../lib/cx';

type ButtonVariant = 'solid' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft' | 'danger-outline' | 'primary-outline' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'rect' | 'pill';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  shape?: ButtonShape;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'solid', size = 'md', shape = 'rect', fullWidth = false, type = 'button', ...props },
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
        shape === 'pill' && 'vx-button--pill',
        fullWidth && 'vx-button--full-width',
        className,
      )}
      {...props}
    />
  );
});
