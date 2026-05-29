import { useEffect, useRef, useId, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { cx } from '../../lib/cx';
import type { SheetPhase } from './useSheetState';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetPanelProps {
  side: SheetSide;
  phase: SheetPhase;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  showClose?: boolean;
  showConfirm?: boolean;
  confirmText?: string;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
  /** 点击遮罩层关闭 */
  closeOnOverlayClick?: boolean;
  /** action 变体：使用操作列表样式（无关闭按钮、无确认按钮） */
  action?: boolean;
  /** 抽屉宽度（仅 left/right 有效） */
  width?: number;
}

/**
 * 统一的 Sheet 面板组件
 *
 * 同时处理桌面端和移动端的所有方向：
 * - left/right：侧边滑入面板
 * - top/bottom：顶部/底部滑入面板
 * - action：底部操作列表（无关闭/确认按钮）
 *
 * 行为统一：
 * - 只能通过关闭按钮或确认按钮关闭，不能点击遮罩
 * - 统一的打开/关闭 animation
 * - 统一的确认按钮
 */
export function SheetPanel({
  side,
  phase,
  title,
  description,
  children,
  header,
  footer,
  className,
  showClose = true,
  showConfirm = false,
  confirmText = '确认',
  confirmDisabled = false,
  onConfirm,
  onClose,
  closeOnOverlayClick = true,
  action = false,
  width,
}: SheetPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const isVisible = phase !== 'hidden';

  useBodyScrollLock(isVisible);
  useFocusTrap(contentRef, { active: phase === 'visible' });

  // Escape 关闭
  useEffect(() => {
    if (phase !== 'visible') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [phase, onClose]);

  if (!isVisible) return null;

  const isSidePanel = side === 'left' || side === 'right';

  return createPortal(
    <div
      className={cx(
        'vx-sheet__overlay',
        phase === 'exiting' && 'vx-sheet__overlay--exiting',
      )}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cx(
          'vx-sheet',
          `vx-sheet--${side}`,
          phase === 'exiting' && 'vx-sheet--exiting',
          action && 'vx-sheet--action',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        style={isSidePanel && width ? { width } : undefined}
      >
        {/* 拖动把手（仅装饰性） */}
        <div className="vx-sheet__handle" aria-hidden="true" />

        {/* 关闭按钮 */}
        {!action && showClose && (
          <button
            type="button"
            className="vx-sheet__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        {/* 自定义头部 */}
        {header}

        {/* 默认标题/描述 */}
        {!header && (title || description) && (
          <div className="vx-sheet__header">
            <div>
              {title && <h2 id={titleId} className="vx-sheet__title">{title}</h2>}
              {description && <p id={descId} className="vx-sheet__description">{description}</p>}
            </div>
          </div>
        )}

        {/* 内容 */}
        <div className={cx('vx-sheet__body', action && 'vx-sheet__body--action')}>
          {children}
        </div>

        {/* 自定义底部 */}
        {footer}

        {/* 确认按钮 */}
        {!action && showConfirm && (
          <div className="vx-sheet__footer">
            <button
              type="button"
              className="vx-sheet__confirm"
              disabled={confirmDisabled}
              onClick={() => { onConfirm?.(); onClose(); }}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

// ── ActionSheet Item 子组件 ──────────────────────────────────────────────

export interface SheetActionItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  destructive?: boolean;
}

export function SheetActionItem({ icon, destructive, className, children, ...props }: SheetActionItemProps) {
  return (
    <button
      type="button"
      className={cx('vxm-actionsheet-item', destructive && 'vxm-actionsheet-item--destructive', className)}
      {...props}
    >
      {icon && <span className="vxm-actionsheet-item__icon">{icon}</span>}
      {children}
    </button>
  );
}
