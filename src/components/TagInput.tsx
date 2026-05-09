import type { InputHTMLAttributes, KeyboardEvent } from 'react';
import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';

export interface TagInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'defaultValue'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  /** Keys that confirm a tag. Defaults to Enter and comma */
  confirmKeys?: string[];
  /** Maximum number of tags */
  maxTags?: number;
  /** Validate a tag before adding; return false or error message to reject */
  validate?: (tag: string) => boolean | string;
  className?: string;
}

export function TagInput({
  value: controlledValue,
  defaultValue = [],
  onChange,
  label,
  hint,
  error,
  placeholder = 'Add tag...',
  confirmKeys = ['Enter', ','],
  maxTags,
  validate,
  disabled,
  className,
  ...inputProps
}: TagInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const tags = isControlled ? controlledValue : internalTags;

  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  const setTags = (next: string[]) => {
    if (!isControlled) setInternalTags(next);
    onChange?.(next);
  };

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (tags.includes(tag)) {
      setValidationError('Tag already exists');
      return;
    }
    if (maxTags && tags.length >= maxTags) {
      setValidationError(`Max ${maxTags} tags`);
      return;
    }
    if (validate) {
      const result = validate(tag);
      if (result === false) {
        setValidationError('Invalid tag');
        return;
      }
      if (typeof result === 'string') {
        setValidationError(result);
        return;
      }
    }
    setValidationError(undefined);
    setTags([...tags, tag]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (confirmKeys.includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const displayError = error ?? validationError;

  return (
    <div className={cx('vx-tag-input', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <div
        className={cx(
          'vx-tag-input__wrap',
          displayError && 'vx-tag-input__wrap--invalid',
          disabled && 'vx-tag-input__wrap--disabled',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span key={i} className="vx-tag-input__tag">
            {tag}
            {!disabled && (
              <button
                type="button"
                className="vx-tag-input__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(i);
                }}
                aria-label={`Remove tag ${tag}`}
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          className="vx-tag-input__input"
          value={inputValue}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setInputValue(e.target.value);
            setValidationError(undefined);
          }}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          aria-label={label ?? 'Tag input'}
          {...inputProps}
        />
      </div>
      {displayError ? <span className="vx-field-group__error">{displayError}</span> : null}
      {!displayError && hint ? <span className="vx-field-group__hint">{hint}</span> : null}
    </div>
  );
}
