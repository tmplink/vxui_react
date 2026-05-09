import type { ReactNode } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '../lib/cx';

export interface CarouselProps {
  items: ReactNode[];
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  autoPlay?: boolean;
  /** Interval in ms for auto-play */
  interval?: number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function Carousel({
  items,
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange,
  autoPlay = false,
  interval = 3000,
  loop = true,
  showDots = true,
  showArrows = true,
  className,
}: CarouselProps) {
  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const current = isControlled ? controlledIndex : internalIndex;
  const total = items.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      let idx = next;
      if (loop) {
        idx = ((next % total) + total) % total;
      } else {
        idx = Math.max(0, Math.min(next, total - 1));
      }
      if (!isControlled) setInternalIndex(idx);
      onIndexChange?.(idx);
    },
    [isControlled, loop, onIndexChange, total],
  );

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => go(current + 1), interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, current, go, interval]);

  const prev = () => go(current - 1);
  const next = () => go(current + 1);

  if (total === 0) return null;

  return (
    <div
      className={cx('vx-carousel', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div className="vx-carousel__track-wrap">
        <div
          className="vx-carousel__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="vx-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}
              aria-hidden={i !== current}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            className="vx-carousel__arrow vx-carousel__arrow--prev"
            onClick={prev}
            disabled={!loop && current === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="vx-carousel__arrow vx-carousel__arrow--next"
            onClick={next}
            disabled={!loop && current === total - 1}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {showDots && (
        <div className="vx-carousel__dots" role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className={cx('vx-carousel__dot', i === current && 'vx-carousel__dot--active')}
              onClick={() => go(i)}
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
