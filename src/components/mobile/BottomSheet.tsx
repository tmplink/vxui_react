import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** 标题 */
  title?: ReactNode;
  /** 描述 */
  description?: ReactNode;
  /** 是否显示拖动把手，默认 true */
  draggable?: boolean;
  /** 是否点击遮罩关闭，默认 true */
  closeOnOverlayClick?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 内容区域 */
  children: ReactNode;
  /** 是否在 Dialog 内渲染到 dialogContent 中，默认 false */
  inlineInDialog?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  draggable = true,
  closeOnOverlayClick = true,
  className,
  children,
  inlineInDialog = false,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const [dragging, setDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const draggedRef = useRef<number>(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 关闭时重置位移
  useEffect(() => {
    if (!open) {
      setTranslateY(0);
      draggedRef.current = 0;
      setDragging(false);
    }
  }, [open]);

  // Escape 键关闭
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // 锁定 body 滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!draggable) return;
    startYRef.current = e.touches[0].clientY;
    draggedRef.current = 0;
    setDragging(true);
  }, [draggable]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggable || !dragging) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta < 0) return; // 不允许向上拖超出原始位置
    draggedRef.current = delta;
    setTranslateY(delta);
  }, [draggable, dragging]);

  const handleTouchEnd = useCallback(() => {
    if (!draggable) return;
    setDragging(false);
    const sheet = sheetRef.current;
    if (!sheet) return;
    const threshold = sheet.offsetHeight * 0.32;
    if (draggedRef.current > threshold) {
      onCloseRef.current();
    } else {
      setTranslateY(0);
    }
  }, [draggable]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) {
      onCloseRef.current();
    }
  }, [closeOnOverlayClick]);

  if (!open) return null;

  const sheetContent = (
    <div
      className="vxm-bottomsheet__overlay"
      onClick={handleOverlayClick}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={sheetRef}
        className={cx('vxm-bottomsheet', className)}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging ? 'none' : 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal
      >
        {/* 拖动把手 */}
        {draggable && (
          <div className="vxm-bottomsheet__handle" aria-hidden="true" />
        )}
        {(title || description) && (
          <div className="vxm-bottomsheet__header">
            {title && <h3 className="vxm-bottomsheet__title">{title}</h3>}
            {description && <p className="vxm-bottomsheet__description">{description}</p>}
          </div>
        )}
        <div className="vxm-bottomsheet__body">{children}</div>
      </div>
    </div>
  );

  // 如果需要在 Dialog 内渲染到 dialogContent 中
  if (inlineInDialog) {
    const dialogContent = document.querySelector('.vx-dialog__content');
    if (dialogContent) {
      return createPortal(sheetContent, dialogContent);
    }
  }

  return createPortal(sheetContent, document.body);
}
