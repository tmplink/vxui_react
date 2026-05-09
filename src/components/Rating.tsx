import { useState } from 'react';
import { cx } from '../lib/cx';

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {half ? (
        <>
          <defs>
            <linearGradient id="vx-star-half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="none" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.44.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
            fill="url(#vx-star-half)"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.44.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  /** Allow half-star values */
  allowHalf?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  max = 5,
  allowHalf = false,
  disabled,
  readOnly,
  label,
  className,
  size = 'md',
}: RatingProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? value;

  const getStarValue = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!allowHalf) return starIndex;
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2;
    return half ? starIndex - 0.5 : starIndex;
  };

  const handleClick = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    const newVal = getStarValue(starIndex, e);
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  };

  const handleMouseMove = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    setHovered(getStarValue(starIndex, e));
  };

  return (
    <div
      className={cx('vx-rating', `vx-rating--${size}`, disabled && 'vx-rating--disabled', className)}
      role="group"
      aria-label={label ?? 'Rating'}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const filled = display >= starIndex;
        const half = !filled && display >= starIndex - 0.5;
        return (
          <button
            key={i}
            type="button"
            className={cx(
              'vx-rating__star',
              (filled || half) && 'vx-rating__star--active',
            )}
            onClick={(e) => handleClick(starIndex, e)}
            onMouseMove={(e) => handleMouseMove(starIndex, e)}
            onMouseLeave={() => setHovered(null)}
            disabled={disabled}
            aria-label={`${starIndex} star${starIndex !== 1 ? 's' : ''}`}
            aria-pressed={value >= starIndex}
            tabIndex={readOnly || disabled ? -1 : 0}
          >
            <StarIcon filled={filled} half={half} />
          </button>
        );
      })}
    </div>
  );
}
