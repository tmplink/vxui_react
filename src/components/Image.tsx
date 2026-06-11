import type { ImgHTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';
import { cx } from '../lib/cx';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type ImageFit = 'cover' | 'contain' | 'fill' | 'none';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'width' | 'height'> {
  /** Image source URL */
  src: string;
  /** Alt text */
  alt?: string;
  /** Fixed width (CSS value or number in px) */
  width?: string | number;
  /** Fixed height (CSS value or number in px) */
  height?: string | number;
  /** Border radius preset */
  radius?: ImageRadius;
  /** Object-fit CSS value */
  fit?: ImageFit;
  /** Enable lazy loading via IntersectionObserver. Default: true */
  lazy?: boolean;
  /** Placeholder content shown while loading */
  placeholder?: ReactNode;
  /** Fallback content shown on error */
  fallback?: ReactNode;
  /** Enable click-to-preview lightbox. Default: false */
  preview?: boolean;
  /** Caption text below the image */
  caption?: ReactNode;
  className?: string;
}

const RADIUS_MAP: Record<ImageRadius, string> = {
  none: '0',
  sm: 'var(--vx-radius-sm)',
  md: 'var(--vx-radius)',
  lg: 'var(--vx-radius-lg)',
  full: '9999px',
};

export function Image({
  src,
  alt = '',
  width,
  height,
  radius = 'md',
  fit = 'cover',
  lazy = true,
  placeholder,
  fallback,
  preview = false,
  caption,
  className,
  style,
  ...props
}: ImageProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [previewOpen, setPreviewOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading
  useEffect(() => {
    if (!lazy) {
      setStatus('loading');
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatus('loading');
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, src]);

  const handleLoad = useCallback(() => setStatus('loaded'), []);
  const handleError = useCallback(() => setStatus('error'), []);

  const handlePreviewClick = useCallback(() => {
    if (preview && status === 'loaded') setPreviewOpen(true);
  }, [preview, status]);

  const isLoading = status === 'idle' || status === 'loading';
  const hasError = status === 'error';

  const containerStyle: React.CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    '--vx-image-radius': RADIUS_MAP[radius],
  } as React.CSSProperties;

  return (
    <>
      <div
        ref={containerRef}
        className={cx(
          'vx-image',
          preview && status === 'loaded' && 'vx-image--preview',
          className,
        )}
        style={containerStyle}
      >
        {hasError && fallback ? (
          <div className="vx-image__fallback">{fallback}</div>
        ) : (
          <>
            {isLoading && (
              <div className="vx-image__placeholder">
                {placeholder ?? (
                  <svg viewBox="0 0 24 24" fill="none" className="vx-image__placeholder-icon" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 16l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )}
            {status !== 'idle' && (
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="vx-image__img"
                style={{ objectFit: fit }}
                onLoad={handleLoad}
                onError={handleError}
                onClick={handlePreviewClick}
                {...props}
              />
            )}
            {preview && status === 'loaded' && (
              <div className="vx-image__preview-hint" aria-hidden="true">
                <ZoomIn size={14} />
              </div>
            )}
          </>
        )}
      </div>

      {caption && !hasError && (
        <p className="vx-image__caption">{caption}</p>
      )}

      {/* Lightbox */}
      {previewOpen &&
        createPortal(
          <ImagePreview src={src} alt={alt} onClose={() => setPreviewOpen(false)} />,
          document.body,
        )}
    </>
  );
}

// ── Lightbox ────────────────────────────────────────────────────────────────

function ImagePreview({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: ReactMouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="vx-image-lightbox" onClick={handleOverlayClick}>
      <img src={src} alt={alt} className="vx-image-lightbox__img" />
      <button
        type="button"
        className="vx-image-lightbox__close"
        onClick={onClose}
        aria-label="关闭预览"
      >
        <X size={20} />
      </button>
    </div>
  );
}
