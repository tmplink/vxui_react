import { createContext, useContext, useEffect, useRef, useState, forwardRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cx } from '../lib/cx';
import { useViewport } from '../lib/viewport';
import { Button } from './Button';

// ---------- Shared types ----------

/** Internal context that propagates whether the shell sidebar is collapsed. */
const ShellCollapsedCtx = createContext(false);

export interface ShellNavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  trailing?: ReactNode;
  active?: boolean;
  onSelect?: () => void;
  /** Nested sub-items; renders an expandable sub-menu */
  children?: ShellNavItem[];
  /** Whether sub-menu is open by default */
  defaultOpen?: boolean;
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
  density?: 'comfortable' | 'compact';
  /** Optional: Configure sidebar width via string (e.g., "18rem") or number (e.g., 280 for px) */
  sidebarWidth?: number | string;
  className?: string;
  children: ReactNode;
}

export function Shell({ collapsed = false, mobileNavOpen = false, density, sidebarWidth, className, children }: ShellProps) {
  const { isTablet, isTabletPortrait } = useViewport();
  
  const style = sidebarWidth ? { '--vx-sidebar-width': typeof sidebarWidth === 'number' ? `${sidebarWidth}px` : sidebarWidth } as React.CSSProperties : undefined;

  return (
    <ShellCollapsedCtx.Provider value={collapsed}>
      <div
        className={cx('vx-shell', className)}
        data-collapsed={collapsed}
        data-nav-open={mobileNavOpen}
        data-tablet={isTablet}
        data-tablet-portrait={isTabletPortrait}
        data-density={density}
        style={style}
      >
        {children}
      </div>
    </ShellCollapsedCtx.Provider>
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
  onSidebarClick?: (e: React.MouseEvent<HTMLElement>) => void;
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
  onSidebarClick,
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
      onClickCapture={onSidebarClick}
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
  /** Nested sub-items rendered as an expandable sub-menu */
  children?: ReactNode;
  /** Whether sub-menu starts open. Defaults to false */
  defaultOpen?: boolean;
}

export function ShellNavItem({ label, icon, badge, trailing, active, onSelect, children, defaultOpen = false }: ShellNavItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [flyoutVisible, setFlyoutVisible] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const collapsed = useContext(ShellCollapsedCtx);
  const hasChildren = Boolean(children);

  // Clean up pending hide timer on unmount
  useEffect(() => () => { if (hideTimer.current !== undefined) clearTimeout(hideTimer.current); }, []);

  const handleClick = () => {
    if (hasChildren && !collapsed) setOpen((o) => !o);
    if (!hasChildren || collapsed) onSelect?.();
  };

  /** Show flyout anchored to the right edge of the sidebar. */
  const openFlyout = () => {
    if (!collapsed || !hasChildren || !wrapRef.current) return;
    if (hideTimer.current !== undefined) clearTimeout(hideTimer.current);
    const r = wrapRef.current.getBoundingClientRect();
    // Anchor to the sidebar's right edge, not the item wrap's right edge
    const sidebar = wrapRef.current.closest<HTMLElement>('.vx-sidebar');
    const sidebarRight = sidebar ? sidebar.getBoundingClientRect().right : r.right;
    setFlyoutPos({ top: r.top - 6, left: sidebarRight + 4 });
    setFlyoutVisible(true);
  };

  const scheduleFlyoutClose = () => {
    hideTimer.current = setTimeout(() => setFlyoutVisible(false), 100);
  };

  const cancelFlyoutClose = () => {
    if (hideTimer.current !== undefined) clearTimeout(hideTimer.current);
  };

  const btn = (
    <button
      type="button"
      className={cx('vx-nav-item', active && 'vx-nav-item--active', hasChildren && 'vx-nav-item--parent')}
      onClick={handleClick}
      aria-expanded={hasChildren && !collapsed ? open : undefined}
      title={collapsed ? label : undefined}
    >
      {icon ? <span className="vx-nav-item__icon">{icon}</span> : null}
      <span className="vx-nav-item__label">{label}</span>
      {badge ? <span className="vx-nav-item__badge">{badge}</span> : null}
      {hasChildren ? (
        <ChevronRight size={14} className={cx('vx-nav-item__chevron', open && 'vx-nav-item__chevron--open')} />
      ) : trailing ? (
        <span className="vx-nav-item__trailing">{trailing}</span>
      ) : null}
    </button>
  );

  if (!hasChildren) return btn;

  return (
    <div
      ref={wrapRef}
      className="vx-nav-item-wrap"
      onMouseEnter={openFlyout}
      onMouseLeave={collapsed ? scheduleFlyoutClose : undefined}
    >
      {btn}

      {/* Inline sub-menu — shown only in expanded sidebar */}
      {!collapsed && open && (
        <div className="vx-nav-sublist" role="group">
          {children}
        </div>
      )}

      {/* Fixed flyout — shown on hover in collapsed sidebar, portalled to body
          so it escapes the sidebar's backdrop-filter containing block */}
      {collapsed && flyoutVisible && createPortal(
        <ShellCollapsedCtx.Provider value={false}>
          <div
            className="vx-nav-sublist-flyout"
            style={{ top: flyoutPos.top, left: flyoutPos.left }}
            role="group"
            onMouseEnter={cancelFlyoutClose}
            onMouseLeave={scheduleFlyoutClose}
          >
            <div className="vx-nav-sublist-flyout__label">{label}</div>
            {children}
          </div>
        </ShellCollapsedCtx.Provider>,
        document.body,
      )}
    </div>
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
