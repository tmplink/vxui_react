import { useState, useCallback, useRef, useEffect } from 'react';
import { cx } from '../lib/cx';

// ─── Utilities ─────────────────────────────────────────────────────────────
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = d / (l > 0.5 ? 2 - max - min : max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r: number;
  let g: number;
  let b: number;
  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(v: string) {
  return /^#[0-9a-f]{6}$/i.test(v);
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#0f172a', '#ffffff', '#f8fafc',
];

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  presets?: string[];
  showPresets?: boolean;
  className?: string;
}

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#3b82f6',
  onChange,
  label,
  hint,
  error,
  disabled,
  presets = PRESET_COLORS,
  showPresets = true,
  className,
}: ColorPickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const color = isControlled ? controlledValue : internalValue;

  const [hexInput, setHexInput] = useState(color);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 640px)').matches) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const [h, s, l] = isValidHex(color) ? hexToHsl(color) : [0, 0, 50];

  const set = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      setHexInput(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleHexChange = (raw: string) => {
    const v = raw.startsWith('#') ? raw : `#${raw}`;
    setHexInput(v);
    if (isValidHex(v)) set(v);
  };

  return (
    <div ref={wrapRef} className={cx('vx-colorpicker', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <div className="vx-colorpicker__row">
        <button
          type="button"
          className={cx(
            'vx-colorpicker__swatch-btn',
            disabled && 'vx-colorpicker__swatch-btn--disabled',
          )}
          style={{ '--vx-cp-color': color } as React.CSSProperties}
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          aria-label={`Current color: ${color}. Click to open color picker.`}
          aria-haspopup="dialog"
          aria-expanded={open}
        />
        <input
          type="text"
          className="vx-colorpicker__hex-input"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          disabled={disabled}
          aria-label="Hex color value"
          maxLength={7}
        />
      </div>
      {error ? <span className="vx-field-group__error">{error}</span> : null}
      {!error && hint ? <span className="vx-field-group__hint">{hint}</span> : null}

      {open && (
        <div className="vx-colorpicker__panel" role="dialog" aria-label="Color picker">
          {/* Hue slider */}
          <div className="vx-colorpicker__section-label">Hue</div>
          <input
            type="range"
            className="vx-colorpicker__hue-slider"
            min="0"
            max="360"
            value={h}
            onChange={(e) => set(hslToHex(Number(e.target.value), s, l))}
            aria-label="Hue"
          />

          {/* Saturation slider */}
          <div className="vx-colorpicker__section-label">Saturation</div>
          <input
            type="range"
            className="vx-colorpicker__sat-slider"
            min="0"
            max="100"
            value={s}
            style={{ '--vx-cp-hue': h } as React.CSSProperties}
            onChange={(e) => set(hslToHex(h, Number(e.target.value), l))}
            aria-label="Saturation"
          />

          {/* Lightness slider */}
          <div className="vx-colorpicker__section-label">Lightness</div>
          <input
            type="range"
            className="vx-colorpicker__lit-slider"
            min="0"
            max="100"
            value={l}
            style={{ '--vx-cp-hue': h, '--vx-cp-sat': `${s}%` } as React.CSSProperties}
            onChange={(e) => set(hslToHex(h, s, Number(e.target.value)))}
            aria-label="Lightness"
          />

          {/* Presets */}
          {showPresets && (
            <div className="vx-colorpicker__presets">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={cx(
                    'vx-colorpicker__preset',
                    color.toLowerCase() === p.toLowerCase() && 'vx-colorpicker__preset--active',
                  )}
                  style={{ background: p }}
                  onClick={() => set(p)}
                  aria-label={p}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className="vx-colorpicker__close"
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
