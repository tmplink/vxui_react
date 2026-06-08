import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useScrollbarSync } from '../hooks/useScrollbarSync';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 滚动条样式变体。
   * - `'overlay'`（默认）：自定义悬浮滚动条，不占用布局空间，自动隐藏。
   * - `'native'`：浏览器原生滚动条，零 JS 开销。
   */
  variant?: 'overlay' | 'native';
  /** 最大高度，超出后滚动。数字按 px 处理，字符串如 `"50vh"` 按相对尺寸。 */
  maxHeight?: string | number;
  /** 最大宽度，超出后滚动。数字按 px 处理，字符串如 `"100%"` 按相对尺寸。 */
  maxWidth?: string | number;
  children: ReactNode;
}

/**
 * ScrollArea — 统一滚动容器组件。
 *
 * 默认使用 overlay 模式（自定义悬浮滚动条），
 * 可通过 `variant="native"` 切换为浏览器原生滚动条。
 */
export function ScrollArea({
  variant = 'overlay',
  maxHeight,
  maxWidth,
  children,
  className,
  style,
  ...props
}: ScrollAreaProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // overlay 模式使用 useScrollbarSync 驱动自定义滚动条
  useScrollbarSync(hostRef, scrollRef, variant === 'overlay');

  const resolvedMaxHeight =
    typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  const resolvedMaxWidth =
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  const isOverlay = variant === 'overlay';

  return (
    <div
      ref={hostRef}
      className={cx(
        'vx-scroll-area',
        isOverlay && 'vx-scroll-host',
        className,
      )}
      data-scrollable={isOverlay ? 'false' : undefined}
      data-scrollbar-state={isOverlay ? 'hidden' : undefined}
      style={{
        maxHeight: resolvedMaxHeight,
        maxWidth: resolvedMaxWidth,
        ...style,
      }}
      {...props}
    >
      <div
        ref={scrollRef}
        className={cx(
          'vx-scroll-area__viewport',
          isOverlay && 'vx-scroll-hide-native',
        )}
      >
        {children}
      </div>
      {isOverlay && (
        <span className="vx-overlay-scrollbar" aria-hidden="true">
          <span className="vx-overlay-scrollbar__thumb" />
        </span>
      )}
    </div>
  );
}
