import type { ImgHTMLAttributes } from 'react';
import { useState } from 'react';
import { cx } from '../lib/cx';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  fallback?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const hues = [0, 30, 60, 120, 160, 200, 240, 270, 300, 340];
function pickHue(name: string) {
  let code = 0;
  for (let i = 0; i < name.length; i++) code += name.charCodeAt(i);
  return hues[code % hues.length];
}

export function Avatar({ src, name, size = 'md', shape = 'circle', fallback, className, alt, ...props }: AvatarProps) {
  const [error, setError] = useState(false);

  const showImage = src && !error;
  const label = name ?? alt ?? '';
  const hue = label ? pickHue(label) : 200;

  return (
    <span
      className={cx('vx-avatar', `vx-avatar--${size}`, `vx-avatar--${shape}`, className)}
      aria-label={label || undefined}
      style={showImage ? undefined : ({ '--vx-avatar-hue': hue } as React.CSSProperties)}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? ''}
          className="vx-avatar__img"
          onError={() => setError(true)}
          {...props}
        />
      ) : fallback ? (
        <span className="vx-avatar__fallback">{fallback}</span>
      ) : label ? (
        <span className="vx-avatar__initials">{initials(label)}</span>
      ) : (
        <svg className="vx-avatar__placeholder" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

// needed for the style prop type
import type React from 'react';
