import type { KeyboardEvent, ClipboardEvent } from 'react';
import { useState, useRef, useCallback, useId } from 'react';
import { cx } from '../lib/cx';

type PinInputType = 'numeric' | 'alphanumeric';
type PinInputSize = 'sm' | 'md' | 'lg';

export interface PinInputProps {
  /** Number of input fields. Default: 6 */
  length?: number;
  /** Controlled value (string of length `length`) */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Callback when all fields are filled or value changes */
  onChange?: (value: string) => void;
  /** Callback when all fields are filled */
  onComplete?: (value: string) => void;
  /** Input type. Default: 'numeric' */
  type?: PinInputType;
  /** Size preset. Default: 'md' */
  size?: PinInputSize;
  /** Placeholder character shown in empty fields. Default: '○' */
  placeholder?: string;
  /** Disable all inputs */
  disabled?: boolean;
  /** Show error state */
  error?: string;
  /** Label above the input group */
  label?: string;
  /** Hint text below the input group */
  hint?: string;
  /** Mask input (show dots). Default: false */
  mask?: boolean;
  /** Auto-focus the first input on mount. Default: false */
  autoFocus?: boolean;
  /** ARIA label for the group */
  'aria-label'?: string;
  className?: string;
}

function isValidChar(char: string, type: PinInputType): boolean {
  if (type === 'numeric') return /^\d$/.test(char);
  return /^[a-zA-Z0-9]$/.test(char);
}

export function PinInput({
  length = 6,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onComplete,
  type = 'numeric',
  size = 'md',
  placeholder = '○',
  disabled = false,
  error,
  label,
  hint,
  mask = false,
  autoFocus = false,
  'aria-label': ariaLabel,
  className,
}: PinInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue.padEnd(length, '').slice(0, length),
  );

  const chars = isControlled
    ? controlledValue.padEnd(length, '').slice(0, length).split('')
    : internalValue.padEnd(length, '').slice(0, length).split('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const groupId = useId();

  const updateValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);

      // Check if complete
      if (next.length === length && !next.includes('')) {
        onComplete?.(next);
      }
    },
    [isControlled, length, onChange, onComplete],
  );

  const focusAt = useCallback((index: number) => {
    const ref = inputRefs.current[index];
    if (ref) {
      ref.focus();
      ref.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!isValidChar(char, type)) return;

      const next = chars.map((c, i) => (i === index ? char : c));
      const valueStr = next.join('');
      updateValue(valueStr);

      // Auto-advance to next field
      if (index < length - 1) {
        focusAt(index + 1);
      }
    },
    [chars, type, length, updateValue, focusAt],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const next = chars.map((c, i) => (i === index ? '' : c));
        const valueStr = next.join('');
        updateValue(valueStr);
        if (index > 0) focusAt(index - 1);
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusAt(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        focusAt(index + 1);
      }
    },
    [chars, length, updateValue, focusAt],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').slice(0, length);
      const valid = pasted.split('').filter((c) => isValidChar(c, type)).join('');
      if (!valid) return;

      const next = chars.map((c, i) => (i < valid.length ? valid[i] : c));
      const valueStr = next.join('');
      updateValue(valueStr);

      // Focus the next empty slot or last field
      const nextEmpty = next.findIndex((c) => !c || c === ' ');
      focusAt(nextEmpty === -1 ? Math.min(valid.length, length - 1) : nextEmpty);
    },
    [chars, length, type, updateValue, focusAt],
  );

  return (
    <div className={cx('vx-pin-input', className)}>
      {label ? <label className="vx-field-group__label" htmlFor={`${groupId}-0`}>{label}</label> : null}
      <div
        className={cx(
          'vx-pin-input__group',
          `vx-pin-input--${size}`,
          error && 'vx-pin-input--invalid',
          disabled && 'vx-pin-input--disabled',
        )}
        role="group"
        aria-label={ariaLabel ?? label ?? 'Pin input'}
      >
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            id={`${groupId}-${i}`}
            ref={(el) => { inputRefs.current[i] = el; }}
            type={mask ? 'password' : type === 'numeric' ? 'tel' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={type === 'numeric' ? '[0-9]' : undefined}
            maxLength={1}
            value={chars[i] && chars[i] !== ' ' ? chars[i] : ''}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="one-time-code"
            aria-label={`Digit ${i + 1}`}
            className="vx-pin-input__field"
            autoFocus={autoFocus && i === 0}
            onChange={(e) => {
              const val = e.target.value;
              if (val) handleChange(i, val.slice(-1));
            }}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </div>
  );
}
