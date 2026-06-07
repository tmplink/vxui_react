import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { cx } from '../lib/cx';

export type ResizableDirection = 'horizontal' | 'vertical';

export interface ResizablePanelGroupProps {
  direction?: ResizableDirection;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Disable user interaction on every child handle */
  disabled?: boolean;
}

interface ResizableGroupContextValue {
  direction: ResizableDirection;
  disabled: boolean;
}

const ResizableGroupContext = createContext<ResizableGroupContextValue | null>(null);

function useResizableGroup(component: string): ResizableGroupContextValue {
  const ctx = useContext(ResizableGroupContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <ResizablePanelGroup>.`);
  }
  return ctx;
}

export function ResizablePanelGroup({
  direction = 'horizontal',
  children,
  className,
  style,
  disabled = false,
}: ResizablePanelGroupProps) {
  const ctx = useMemo<ResizableGroupContextValue>(
    () => ({ direction, disabled }),
    [direction, disabled],
  );

  return (
    <ResizableGroupContext.Provider value={ctx}>
      <div
        className={cx(
          'vx-resizable-group',
          `vx-resizable-group--${direction}`,
          disabled && 'vx-resizable-group--disabled',
          className,
        )}
        style={style}
        data-direction={direction}
      >
        {children}
      </div>
    </ResizableGroupContext.Provider>
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
  const { direction } = useResizableGroup('ResizablePanel');
  const flexBasis = `${Math.min(Math.max(defaultSize, 0), 100)}%`;

  // Layout axis must match the group direction so flex children stack correctly.
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={cx('vx-resizable-panel', className)}
      style={{
        flexBasis,
        flexGrow: 0,
        flexShrink: 1,
        width: isHorizontal ? flexBasis : '100%',
        height: isHorizontal ? '100%' : flexBasis,
        ...style,
      } as React.CSSProperties}
      data-min={minSize}
      data-max={maxSize}
      data-size={defaultSize}
    >
      {children}
    </div>
  );
}

export interface ResizableHandleProps {
  /**
   * @deprecated Direction is now inherited from the surrounding
   * `<ResizablePanelGroup>`. This prop is kept for backwards compatibility
   * and is ignored at runtime.
   */
  direction?: ResizableDirection;
  /** Optional aria-label for assistive tech. */
  ariaLabel?: string;
  className?: string;
}

function getClientAxis(
  e: MouseEvent | TouchEvent,
  isHorizontal: boolean,
): number {
  if ('touches' in e) {
    const t = e.touches[0] ?? (e as TouchEvent).changedTouches?.[0];
    return isHorizontal ? t.clientX : t.clientY;
  }
  return isHorizontal ? e.clientX : e.clientY;
}

export function ResizableHandle({
  direction: _legacyDirection,
  ariaLabel,
  className,
}: ResizableHandleProps) {
  const { direction, disabled } = useResizableGroup('ResizableHandle');
  const isHorizontal = direction === 'horizontal';

  const isDragging = useRef(false);
  const startPos = useRef(0);
  const startParent = useRef(0);
  const startPrev = useRef(0);
  const startNext = useRef(0);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [keyboardValue, setKeyboardValue] = useState<number | null>(null);

  const computeSizes = useCallback(() => {
    const handle = handleRef.current;
    if (!handle) return null;
    const prev = handle.previousElementSibling as HTMLElement | null;
    const next = handle.nextElementSibling as HTMLElement | null;
    if (!prev || !next) return null;
    const parent = handle.parentElement;
    if (!parent) return null;

    const parentSize = isHorizontal
      ? parent.getBoundingClientRect().width
      : parent.getBoundingClientRect().height;
    const prevSize = isHorizontal
      ? prev.getBoundingClientRect().width
      : prev.getBoundingClientRect().height;
    const nextSize = isHorizontal
      ? next.getBoundingClientRect().width
      : next.getBoundingClientRect().height;

    const prevMinPct = Number(prev.dataset.min ?? 10);
    const prevMaxPct = Number(prev.dataset.max ?? 90);
    const nextMinPct = Number(next.dataset.min ?? 10);
    const nextMaxPct = Number(next.dataset.max ?? 90);

    return {
      handle,
      prev,
      next,
      parent,
      parentSize,
      prevSize,
      nextSize,
      prevMin: (prevMinPct / 100) * parentSize,
      prevMax: (prevMaxPct / 100) * parentSize,
      nextMin: (nextMinPct / 100) * parentSize,
      nextMax: (nextMaxPct / 100) * parentSize,
    };
  }, [isHorizontal]);

  const applySizes = useCallback(
    (newPrev: number, newNext: number, sizes: ReturnType<typeof computeSizes>) => {
      if (!sizes) return;
      const { prev, next, parentSize } = sizes;
      const clampedPrev = Math.min(Math.max(newPrev, sizes.prevMin), sizes.prevMax);
      const clampedNext = Math.min(Math.max(newNext, sizes.nextMin), sizes.nextMax);
      const prevPct = (clampedPrev / parentSize) * 100;
      const nextPct = (clampedNext / parentSize) * 100;
      const prevBasis = `${prevPct}%`;
      const nextBasis = `${nextPct}%`;

      prev.style.flexBasis = prevBasis;
      prev.style.flexGrow = '0';
      prev.style.flexShrink = '1';
      if (isHorizontal) {
        prev.style.width = prevBasis;
      } else {
        prev.style.height = prevBasis;
      }

      next.style.flexBasis = nextBasis;
      next.style.flexGrow = '0';
      next.style.flexShrink = '1';
      if (isHorizontal) {
        next.style.width = nextBasis;
      } else {
        next.style.height = nextBasis;
      }
    },
    [isHorizontal],
  );

  const startDrag = useCallback(
    (startEvent: ReactMouseEvent | ReactTouchEvent) => {
      if (disabled) return;
      // Avoid hijacking text selection on the bar child.
      startEvent.preventDefault();

      const sizes = computeSizes();
      if (!sizes) return;

      startPos.current = getClientAxis(
        startEvent.nativeEvent as MouseEvent | TouchEvent,
        isHorizontal,
      );
      startParent.current = sizes.parentSize;
      startPrev.current = sizes.prevSize;
      startNext.current = sizes.nextSize;
      isDragging.current = true;
      setActive(true);

      const moveHandler = (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current) return;
        if (e.cancelable) e.preventDefault();
        const liveSizes = computeSizes() ?? sizes;
        const current = getClientAxis(e, isHorizontal);
        const delta = current - startPos.current;
        applySizes(startPrev.current + delta, startNext.current - delta, liveSizes);
      };

      const upHandler = () => {
        isDragging.current = false;
        setActive(false);
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', upHandler);
        document.removeEventListener('touchcancel', upHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
      document.addEventListener('touchmove', moveHandler, { passive: false });
      document.addEventListener('touchend', upHandler);
      document.addEventListener('touchcancel', upHandler);
    },
    [applySizes, computeSizes, disabled, isHorizontal],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const isIncreaseKey = isHorizontal
        ? event.key === 'ArrowRight' || event.key === 'ArrowUp'
        : event.key === 'ArrowDown' || event.key === 'ArrowRight';
      const isDecreaseKey = isHorizontal
        ? event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft';
      if (!isIncreaseKey && !isDecreaseKey) return;

      event.preventDefault();
      const sizes = computeSizes();
      if (!sizes) return;
      const step = event.shiftKey ? 10 : 2;
      const directionDelta = isIncreaseKey ? step : -step;
      // Use cached start sizes so each keystep is relative to the same baseline.
      if (startPrev.current === 0) {
        startPrev.current = sizes.prevSize;
        startNext.current = sizes.nextSize;
      }
      const delta = (sizes.parentSize * directionDelta) / 100;
      applySizes(sizes.prevSize + delta, sizes.nextSize - delta, sizes);
      setKeyboardValue(directionDelta);
    },
    [applySizes, computeSizes, disabled, isHorizontal],
  );

  useEffect(() => {
    if (keyboardValue === null) return;
    const t = window.setTimeout(() => setKeyboardValue(null), 600);
    return () => window.clearTimeout(t);
  }, [keyboardValue]);

  return (
    <div
      ref={handleRef}
      role="separator"
      tabIndex={disabled ? -1 : 0}
      aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-valuenow={keyboardValue ?? undefined}
      className={cx(
        'vx-resizable-handle',
        `vx-resizable-handle--${direction}`,
        active && 'vx-resizable-handle--active',
        disabled && 'vx-resizable-handle--disabled',
        className,
      )}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onKeyDown={handleKeyDown}
    >
      <span className="vx-resizable-handle__bar" aria-hidden="true" />
    </div>
  );
}
