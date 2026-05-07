import type { HTMLAttributes, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from '../../lib/cx';

export function MobileList({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cx('vxm-list', className)} role="list" {...props} />;
}

export interface MobileListSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function MobileListSection({ title, className, children, ...props }: MobileListSectionProps) {
  return (
    <div className={cx('vxm-list-section', className)} {...props}>
      {title && <div className="vxm-list-section__title">{title}</div>}
      {children}
    </div>
  );
}

export interface MobileListItemProps {
  /** 左侧图标或头像区域 */
  leading?: ReactNode;
  /** 右侧自定义内容（如状态标签、数值） */
  trailing?: ReactNode;
  /** 主标签文本 */
  label: ReactNode;
  /** 副文本描述 */
  description?: ReactNode;
  /** 是否显示右侧箭头（表示可进入下一层） */
  chevron?: boolean;
  /** 破坏性操作，文字变为危险色 */
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MobileListItem({
  leading,
  trailing,
  label,
  description,
  chevron,
  destructive,
  disabled,
  onClick,
  className,
}: MobileListItemProps) {
  const inner = (
    <>
      {leading && <span className="vxm-list-item__leading">{leading}</span>}
      <span className="vxm-list-item__content">
        <span className="vxm-list-item__label">{label}</span>
        {description && <span className="vxm-list-item__description">{description}</span>}
      </span>
      {trailing && <span className="vxm-list-item__trailing">{trailing}</span>}
      {chevron && <ChevronRight size={16} className="vxm-list-item__chevron" aria-hidden="true" />}
    </>
  );

  return (
    <li
      className={cx(
        'vxm-list-item',
        destructive && 'vxm-list-item--destructive',
        disabled && 'vxm-list-item--disabled',
        !onClick && 'vxm-list-item--static',
        className,
      )}
    >
      <button
        type="button"
        className="vxm-list-item__btn"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        tabIndex={onClick ? 0 : -1}
      >
        {inner}
      </button>
    </li>
  );
}
