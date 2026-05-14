import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface SegmentedControlOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  fullWidth,
  size = 'md',
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const [style, setStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    // We defer measurement by 1 frame to ensure DOM layout is complete, 
    // mainly for fonts and padding calculations to stabilize.
    requestAnimationFrame(() => {
      const selectedBtn = refs.current[currentValue];
      if (selectedBtn) {
        setStyle({
          left: selectedBtn.offsetLeft,
          width: selectedBtn.offsetWidth,
          opacity: 1,
        });
      }
    });
  }, [currentValue, options, fullWidth, size]);

  const handleSelect = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div 
      ref={containerRef} 
      className={cx(
        'vx-segmented-control',
        `vx-segmented-control--${size}`,
        fullWidth && 'vx-segmented-control--full',
        className
      )}
    >
      <div 
        className="vx-segmented-control__slider" 
        style={{ 
          transform: `translateX(${style.left}px)`, 
          width: `${style.width}px`,
          opacity: style.opacity 
        }} 
      />
      {options.map((opt) => {
        const isActive = currentValue === opt.value;
        return (
          <button
            key={opt.value}
            ref={(el) => { refs.current[opt.value] = el; }}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && handleSelect(opt.value)}
            className={cx(
              'vx-segmented-control__item',
              isActive && 'vx-segmented-control__item--active'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}