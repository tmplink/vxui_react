import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../lib/cx';

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  /** 抽屉宽度，默认 280px */
  width?: number;
  /** 抽屉头部内容（品牌 logo、用户信息等） */
  header?: ReactNode;
  /** 抽屉底部内容（设置、登出等） */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function MobileDrawer({
  open,
  onClose,
  width = 280,
  header,
  footer,
  children,
  className,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  // 关闭时重置拖动位移
  useEffect(() => {
    if (!open) {
      setOffsetX(0);
      currentXRef.current = 0;
    }
  }, [open]);

  // Escape 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // 锁定 body 滚动
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = 0;
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - startXRef.current;
    if (delta > 0) return; // 只允许向左拖（关闭方向）
    currentXRef.current = delta;
    setOffsetX(delta);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (Math.abs(currentXRef.current) > width * 0.3) {
      onClose();
    } else {
      setOffsetX(0);
    }
  };

  if (!open) return null;

  // 遮罩透明度随拖动减弱
  const progress = Math.max(0, 1 + offsetX / width);
  const overlayOpacity = 0.52 * progress;

  return (
    <div className="vxm-drawer__overlay" style={{ '--vxm-overlay-opacity': overlayOpacity } as React.CSSProperties}>
      {/* 点击遮罩关闭 */}
      <div
        className="vxm-drawer__scrim"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        className={cx('vxm-drawer', className)}
        style={{
          width,
          transform: `translateX(${offsetX}px)`,
          transition: dragging ? 'none' : 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal
        aria-label="Navigation drawer"
      >
        {header && <div className="vxm-drawer__header">{header}</div>}
        <div className="vxm-drawer__body">{children}</div>
        {footer && <div className="vxm-drawer__footer">{footer}</div>}
      </div>
    </div>
  );
}

export interface DrawerNavItemProps {
  icon?: ReactNode;
  label: ReactNode;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
}

export function DrawerNavItem({ icon, label, badge, active, onClick }: DrawerNavItemProps) {
  return (
    <button
      type="button"
      className={cx('vxm-drawer-item', active && 'vxm-drawer-item--active')}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {icon && <span className="vxm-drawer-item__icon">{icon}</span>}
      <span className="vxm-drawer-item__label">{label}</span>
      {badge != null && (
        <span className="vxm-drawer-item__badge">{badge}</span>
      )}
    </button>
  );
}

export interface DrawerNavSectionProps {
  title?: string;
  /** 是否可折叠，默认 false */
  collapsible?: boolean;
  /** 初始展开状态，collapsible=true 时有效，默认 true */
  defaultOpen?: boolean;
  children: ReactNode;
}

export function DrawerNavSection({ title, collapsible = false, defaultOpen = true, children }: DrawerNavSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cx('vxm-drawer-section', collapsible && 'vxm-drawer-section--collapsible')}>
      {title && (
        collapsible ? (
          <button
            type="button"
            className="vxm-drawer-section__header"
            onClick={() => setIsOpen(v => !v)}
            aria-expanded={isOpen}
          >
            <span className="vxm-drawer-section__title">{title}</span>
            <ChevronDown
              size={14}
              className={cx('vxm-drawer-section__chevron', isOpen && 'vxm-drawer-section__chevron--open')}
            />
          </button>
        ) : (
          <div className="vxm-drawer-section__title">{title}</div>
        )
      )}
      <div className={cx('vxm-drawer-section__items-wrap', !isOpen && 'vxm-drawer-section__items-wrap--closed')}>
        <div className="vxm-drawer-section__items">{children}</div>
      </div>
    </div>
  );
}
