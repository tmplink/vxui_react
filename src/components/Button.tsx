import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cx } from '../lib/cx';

type ButtonVariant = 'solid' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft' | 'danger-outline' | 'primary-outline' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'rect' | 'square' | 'pill' | 'circle';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  shape?: ButtonShape;
  /** Show a loading spinner and disable the button */
  loading?: boolean;
  /** Left-side icon slot (renders before children) */
  startIcon?: ReactNode;
  /** Right-side icon slot (renders after children) */
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'solid', size = 'md', shape = 'rect', fullWidth = false,
    loading = false, startIcon, endIcon, disabled, type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'vx-button',
        `vx-button--${variant}`,
        `vx-button--${size}`,
        shape === 'square' && 'vx-button--square',
        shape === 'pill' && 'vx-button--pill',
        shape === 'circle' && 'vx-button--circle',
        fullWidth && 'vx-button--full-width',
        loading && 'vx-button--loading',
        className,
      )}
      {...props}
    >
      {loading ? <span className="vx-button__spinner" aria-hidden="true" /> : (startIcon ?? null)}
      {children}
      {!loading && endIcon ? endIcon : null}
    </button>
  );
});
