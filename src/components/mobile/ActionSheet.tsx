import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';

export interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ActionSheet({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ActionSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const [dragging, setDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const draggedRef = useRef<number>(0);

  // 关闭时重置位移
  useEffect(() => {
    if (!open) {
      setTranslateY(0);
      draggedRef.current = 0;
    }
  }, [open]);

  // Escape 键关闭
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    draggedRef.current = 0;
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta < 0) return; // 不允许向上拖超出原始位置
    draggedRef.current = delta;
    setTranslateY(delta);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    const sheet = sheetRef.current;
    if (!sheet) return;
    const threshold = sheet.offsetHeight * 0.32;
    if (draggedRef.current > threshold) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  if (!open) return null;

  return (
    <div
      className="vxm-actionsheet__overlay"
      onClick={onClose}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={sheetRef}
        className={cx('vxm-actionsheet', className)}
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
        aria-label={title ?? 'Action sheet'}
      >
        {/* 拖动把手 */}
        <div className="vxm-actionsheet__handle" aria-hidden="true" />
        {(title || description) && (
          <div className="vxm-actionsheet__header">
            {title && <h3 className="vxm-actionsheet__title">{title}</h3>}
            {description && <p className="vxm-actionsheet__description">{description}</p>}
          </div>
        )}
        <div className="vxm-actionsheet__body">{children}</div>
      </div>
    </div>
  );
}

export interface ActionSheetItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  destructive?: boolean;
}

export function ActionSheetItem({ icon, destructive, className, children, ...props }: ActionSheetItemProps) {
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
