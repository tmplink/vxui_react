import { useEffect, useRef, forwardRef, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cx } from '../lib/cx';
import { useViewport } from '../lib/viewport';
import { Button } from './Button';

// ---------- Shared types ----------

export interface ShellNavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  trailing?: ReactNode;
  active?: boolean;
  onSelect?: () => void;
}

export interface ShellNavSection {
  key?: string;
  title?: string;
  items: ShellNavItem[];
}

// ---------- Internal scrollbar sync hook ----------

function useScrollbarSync(
  hostRef: { current: HTMLElement | null },
  scrollRef: { current: HTMLElement | null },
) {
  useEffect(() => {
    const host = hostRef.current;
    const scroll = scrollRef.current;
    if (!host || !scroll) return;

    let hideTimer: number | undefined;

    const syncThumb = () => {
      const isScrollable = scroll.scrollHeight > scroll.clientHeight + 1;
      host.dataset.scrollable = isScrollable ? 'true' : 'false';

      if (!isScrollable) {
        host.dataset.scrollbarState = 'hidden';
        host.style.setProperty('--vx-scrollbar-thumb-height', '0px');
        host.style.setProperty('--vx-scrollbar-thumb-offset', '0px');
        return;
      }

      const trackHeight = Math.max(host.clientHeight - 16, 0);
      const thumbHeight = Math.max((scroll.clientHeight / scroll.scrollHeight) * trackHeight, 36);
      const maxScrollTop = scroll.scrollHeight - scroll.clientHeight;
      const maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);
      const thumbOffset = maxScrollTop > 0 ? (scroll.scrollTop / maxScrollTop) * maxThumbOffset : 0;

      host.style.setProperty('--vx-scrollbar-thumb-height', `${thumbHeight}px`);
      host.style.setProperty('--vx-scrollbar-thumb-offset', `${thumbOffset}px`);

      if (host.dataset.scrollbarState !== 'active') {
        host.dataset.scrollbarState = 'hidden';
      }
    };

    const showThumb = () => {
      if (host.dataset.scrollable !== 'true') return;
      host.dataset.scrollbarState = 'active';
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        host.dataset.scrollbarState = 'hidden';
      }, 640);
    };

    const handleScroll = () => { syncThumb(); showThumb(); };

    syncThumb();
    scroll.addEventListener('scroll', handleScroll, { passive: true });

    const ro = new ResizeObserver(() => syncThumb());
    ro.observe(host);
    ro.observe(scroll);

    return () => {
      scroll.removeEventListener('scroll', handleScroll);
      ro.disconnect();
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ---------- Shell ----------

export interface ShellProps {
  collapsed?: boolean;
  mobileNavOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export function Shell({ collapsed = false, mobileNavOpen = false, className, children }: ShellProps) {
  const { isTablet } = useViewport();
  return (
    <div
      className={cx('vx-shell', className)}
      data-collapsed={collapsed}
      data-nav-open={mobileNavOpen}
      data-tablet={isTablet}
    >
      {children}
    </div>
  );
}

// ---------- ShellSidebar ----------

export interface ShellSidebarProps {
  brand?: string;
  brandCaption?: string;
  brandIcon?: ReactNode;
  collapsed?: boolean;
  footer?: ReactNode;
  onToggle?: () => void;
  collapseLabel?: string;
  expandLabel?: string;
  children?: ReactNode;
}

export function ShellSidebar({
  brand = 'VXUI',
  brandCaption,
  brandIcon,
  collapsed = false,
  footer,
  onToggle,
  collapseLabel = 'Collapse',
  expandLabel = 'Expand',
  children,
}: ShellSidebarProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLElement | null>(null);
  useScrollbarSync(hostRef, scrollRef);

  return (
    <aside
      ref={hostRef}
      className="vx-sidebar vx-scroll-host"
      data-scrollable="false"
      data-scrollbar-state="hidden"
    >
      <div
        ref={(el) => { scrollRef.current = el; }}
        className="vx-sidebar__scroll vx-scroll-hide-native"
      >
        <div className="vx-sidebar__header">
          <div className="vx-sidebar__brand">
            {brandIcon ? <span className="vx-sidebar__brand-icon">{brandIcon}</span> : null}
            <div className="vx-sidebar__brand-copy">
              <span className="vx-sidebar__brand-text">{brand}</span>
              {brandCaption ? <span className="vx-sidebar__brand-caption">{brandCaption}</span> : null}
            </div>
          </div>
        </div>

        {children}

        <div className="vx-sidebar__footer">
          {footer ? <div className="vx-sidebar__footer-content">{footer}</div> : null}
          {onToggle ? (
            <Button
              variant="ghost"
              size="sm"
              className="vx-sidebar__toggle"
              onClick={onToggle}
              aria-label={collapsed ? expandLabel : collapseLabel}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              <span className="vx-sidebar__toggle-label">
                {collapsed ? expandLabel : collapseLabel}
              </span>
            </Button>
          ) : null}
        </div>
      </div>
      <span className="vx-overlay-scrollbar" aria-hidden="true">
        <span className="vx-overlay-scrollbar__thumb" />
      </span>
    </aside>
  );
}

// ---------- ShellNav ----------

export interface ShellNavProps {
  label?: string;
  children?: ReactNode;
}

export function ShellNav({ label = 'Primary navigation', children }: ShellNavProps) {
  return (
    <nav className="vx-sidebar__nav" aria-label={label}>
      {children}
    </nav>
  );
}

// ---------- ShellNavSection ----------

export interface ShellNavSectionProps {
  title?: string;
  children?: ReactNode;
}

export function ShellNavSection({ title, children }: ShellNavSectionProps) {
  return (
    <div className="vx-nav-section-block">
      {title ? <div className="vx-nav-section-block__title">{title}</div> : null}
      <div className="vx-nav-section-block__items">{children}</div>
    </div>
  );
}

// ---------- ShellNavItem ----------

export interface ShellNavItemProps {
  label: string;
  icon?: ReactNode;
  badge?: string;
  trailing?: ReactNode;
  active?: boolean;
  onSelect?: () => void;
}

export function ShellNavItem({ label, icon, badge, trailing, active, onSelect }: ShellNavItemProps) {
  return (
    <button
      type="button"
      className={cx('vx-nav-item', active && 'vx-nav-item--active')}
      onClick={onSelect}
    >
      {icon ? <span className="vx-nav-item__icon">{icon}</span> : null}
      <span className="vx-nav-item__label">{label}</span>
      {badge ? <span className="vx-nav-item__badge">{badge}</span> : null}
      {trailing ? <span className="vx-nav-item__trailing">{trailing}</span> : null}
    </button>
  );
}

// ---------- ShellOverlay ----------

export interface ShellOverlayProps {
  onClose?: () => void;
  closeLabel?: string;
}

export function ShellOverlay({ onClose, closeLabel = 'Close sidebar' }: ShellOverlayProps) {
  return (
    <button
      type="button"
      className="vx-shell__overlay"
      aria-label={closeLabel}
      onClick={onClose}
    />
  );
}

// ---------- ShellMain ----------

export interface ShellMainProps {
  children: ReactNode;
}

export function ShellMain({ children }: ShellMainProps) {
  return <div className="vx-shell__main">{children}</div>;
}

// ---------- ShellTopbar ----------

export interface ShellTopbarProps {
  title?: string;
  description?: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  onMenuToggle?: () => void;
  mobileNavOpen?: boolean;
  menuButtonLabel?: string;
}

export const ShellTopbar = forwardRef<HTMLElement, ShellTopbarProps>(function ShellTopbar(
  {
    title,
    description,
    breadcrumb,
    actions,
    onMenuToggle,
    mobileNavOpen = false,
    menuButtonLabel = 'Open navigation',
  },
  ref,
) {
  return (
    <header ref={ref} className="vx-topbar">
      {onMenuToggle ? (
        <Button
          variant="ghost"
          size="sm"
          className="vx-topbar__menu"
          aria-label={menuButtonLabel}
          onClick={onMenuToggle}
        >
          {mobileNavOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </Button>
      ) : null}
      <div className="vx-topbar__title-group">
        {breadcrumb ? (
          breadcrumb
        ) : (
          <div>
            {title ? <h1 className="vx-topbar__title">{title}</h1> : null}
            {description ? <p className="vx-topbar__description">{description}</p> : null}
          </div>
        )}
      </div>
      {actions ? <div className="vx-topbar__actions">{actions}</div> : null}
    </header>
  );
});

// ---------- ShellContent ----------

export interface ShellContentProps {
  children: ReactNode;
}

export function ShellContent({ children }: ShellContentProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLElement | null>(null);
  useScrollbarSync(hostRef, scrollRef);

  return (
    <div
      ref={(el) => { hostRef.current = el; }}
      className="vx-shell__content-wrap vx-scroll-host"
      data-scrollable="false"
      data-scrollbar-state="hidden"
    >
      <main ref={(el) => { scrollRef.current = el; }} className="vx-shell__content vx-scroll-hide-native">
        {children}
      </main>
      <span className="vx-overlay-scrollbar" aria-hidden="true">
        <span className="vx-overlay-scrollbar__thumb" />
      </span>
    </div>
  );
}
