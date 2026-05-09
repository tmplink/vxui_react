import type { ReactNode } from 'react';
import { useState, useCallback, useRef } from 'react';
import { cx } from '../lib/cx';

export type ResizableDirection = 'horizontal' | 'vertical';

export interface ResizablePanelGroupProps {
  direction?: ResizableDirection;
  children: ReactNode;
  className?: string;
}

export function ResizablePanelGroup({
  direction = 'horizontal',
  children,
  className,
}: ResizablePanelGroupProps) {
  return (
    <div
      className={cx(
        'vx-resizable-group',
        `vx-resizable-group--${direction}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ResizablePanelProps {
  children: ReactNode;
  /** Initial size as percentage (0–100) */
  defaultSize?: number;
  /** Min size in percentage */
  minSize?: number;
  /** Max size in percentage */
  maxSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  className,
  style,
}: ResizablePanelProps) {
  return (
    <div
      className={cx('vx-resizable-panel', className)}
      style={{ '--vx-panel-size': `${defaultSize}%`, ...style } as React.CSSProperties}
      data-min={minSize}
      data-max={maxSize}
    >
      {children}
    </div>
  );
}

export interface ResizableHandleProps {
  /** Which two adjacent panels this handle controls via CSS flex sizing */
  className?: string;
  direction?: ResizableDirection;
}

export function ResizableHandle({
  className,
  direction = 'horizontal',
}: ResizableHandleProps) {
  const isDragging = useRef(false);
  const [active, setActive] = useState(false);

  const startDrag = useCallback(
    (startEvent: React.MouseEvent | React.TouchEvent) => {
      const handle = (startEvent.currentTarget as HTMLElement);
      const prev = handle.previousElementSibling as HTMLElement | null;
      const next = handle.nextElementSibling as HTMLElement | null;
      if (!prev || !next) return;

      const parent = handle.parentElement!;
      const isH = direction === 'horizontal';
      const parentSize = isH ? parent.getBoundingClientRect().width : parent.getBoundingClientRect().height;

      const prevStart = isH ? prev.getBoundingClientRect().width : prev.getBoundingClientRect().height;
      const nextStart = isH ? next.getBoundingClientRect().width : next.getBoundingClientRect().height;

      const getClient = (e: MouseEvent | TouchEvent) =>
        'touches' in e ? (isH ? e.touches[0].clientX : e.touches[0].clientY) : (isH ? (e as MouseEvent).clientX : (e as MouseEvent).clientY);

      const startPos = getClient(startEvent.nativeEvent as MouseEvent | TouchEvent);

      isDragging.current = true;
      setActive(true);

      const prevMin = Number(prev.dataset.min ?? 10) / 100 * parentSize;
      const prevMax = Number(prev.dataset.max ?? 90) / 100 * parentSize;
      const nextMin = Number(next.dataset.min ?? 10) / 100 * parentSize;
      const nextMax = Number(next.dataset.max ?? 90) / 100 * parentSize;

      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current) return;
        const delta = getClient(e) - startPos;
        const newPrev = Math.min(Math.max(prevStart + delta, prevMin), prevMax);
        const newNext = Math.min(Math.max(nextStart - delta, nextMin), nextMax);
        prev.style.flexBasis = `${(newPrev / parentSize) * 100}%`;
        next.style.flexBasis = `${(newNext / parentSize) * 100}%`;
      };

      const onUp = () => {
        isDragging.current = false;
        setActive(false);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    },
    [direction],
  );

  return (
    <div
      role="separator"
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      className={cx(
        'vx-resizable-handle',
        `vx-resizable-handle--${direction}`,
        active && 'vx-resizable-handle--active',
        className,
      )}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      <span className="vx-resizable-handle__bar" aria-hidden="true" />
    </div>
  );
}
