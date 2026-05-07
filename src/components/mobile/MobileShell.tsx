import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface MobileShellProps {
  /** 固定在顶部的导航栏区域 */
  topBar?: ReactNode;
  /** 固定在底部的导航栏区域 */
  bottomNav?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function MobileShell({ topBar, bottomNav, children, className }: MobileShellProps) {
  return (
    <div className={cx('vxm-shell', className)}>
      {topBar && <div className="vxm-shell__topbar">{topBar}</div>}
      <main className="vxm-shell__main">{children}</main>
      {bottomNav && <div className="vxm-shell__bottomnav">{bottomNav}</div>}
    </div>
  );
}

export interface MobileTopBarProps {
  /** 标题文本或节点 */
  title?: ReactNode;
  /** 左侧区域，通常为返回按钮 */
  leading?: ReactNode;
  /** 右侧区域，通常为操作按钮 */
  trailing?: ReactNode;
  className?: string;
}

export function MobileTopBar({ title, leading, trailing, className }: MobileTopBarProps) {
  return (
    <div className={cx('vxm-topbar', className)}>
      <div className="vxm-topbar__leading">{leading}</div>
      <div className="vxm-topbar__title">{title}</div>
      <div className="vxm-topbar__trailing">{trailing}</div>
    </div>
  );
}

export interface MobileIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function MobileIconButton({ label, className, children, ...props }: MobileIconButtonProps) {
  return (
    <button type="button" className={cx('vxm-icon-btn', className)} aria-label={label} {...props}>
      {children}
    </button>
  );
}
