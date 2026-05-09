import { useEffect, useRef, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cx } from '../lib/cx';
import { Button } from './Button';

export interface AppShellNavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  trailing?: ReactNode;
  active?: boolean;
  onSelect?: () => void;
}

export interface AppShellNavSection {
  key?: string;
  title?: string;
  items: AppShellNavItem[];
}

export interface AppShellProps {
  brand?: string;
  brandCaption?: string;
  brandIcon?: ReactNode;
  breadcrumb?: ReactNode;
  title?: string;
  description?: string;
  navItems?: AppShellNavItem[];
  navSections?: AppShellNavSection[];
  sidebarCollapsed?: boolean;
  mobileNavOpen?: boolean;
  onSidebarToggle?: () => void;
  onMobileNavToggle?: () => void;
  menuButtonLabel?: string;
  sidebarCollapseLabel?: string;
  sidebarExpandLabel?: string;
  sidebarCloseLabel?: string;
  headerActions?: ReactNode;
  sidebarFooter?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  brand = 'VXUI',
  brandCaption,
  brandIcon,
  breadcrumb,
  title,
  description,
  navItems,
  navSections,
  sidebarCollapsed = false,
  mobileNavOpen = false,
  onSidebarToggle,
  onMobileNavToggle,
  menuButtonLabel = 'Open navigation',
  sidebarCollapseLabel = 'Collapse',
  sidebarExpandLabel = 'Expand',
  sidebarCloseLabel = 'Close sidebar',
  headerActions,
  sidebarFooter,
  children,
}: AppShellProps) {
  const sections = navSections ?? (navItems ? [{ items: navItems }] : []);
  const sidebarHostRef = useRef<HTMLElement | null>(null);
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const contentHostRef = useRef<HTMLDivElement | null>(null);
  const contentScrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const bindings = [
      { host: sidebarHostRef.current, scroll: sidebarScrollRef.current },
      { host: contentHostRef.current, scroll: contentScrollRef.current },
    ];

    const cleanups = bindings.flatMap(({ host, scroll }) => {
      if (!host || !scroll) {
        return [];
      }

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
        if (host.dataset.scrollable !== 'true') {
          return;
        }

        host.dataset.scrollbarState = 'active';
        if (hideTimer !== undefined) {
          window.clearTimeout(hideTimer);
        }
        hideTimer = window.setTimeout(() => {
          host.dataset.scrollbarState = 'hidden';
        }, 640);
      };

      const handleScroll = () => {
        syncThumb();
        showThumb();
      };

      syncThumb();

      scroll.addEventListener('scroll', handleScroll, { passive: true });

      const resizeObserver = new ResizeObserver(() => {
        syncThumb();
      });
      resizeObserver.observe(host);
      resizeObserver.observe(scroll);

      return [() => {
        scroll.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
        if (hideTimer !== undefined) {
          window.clearTimeout(hideTimer);
        }
      }];
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="vx-shell" data-collapsed={sidebarCollapsed} data-nav-open={mobileNavOpen}>
      <aside
        ref={sidebarHostRef}
        className="vx-sidebar vx-scroll-host"
        data-scrollable="false"
        data-scrollbar-state="hidden"
      >
        <div ref={sidebarScrollRef} className="vx-sidebar__scroll vx-scroll-hide-native">
          <div className="vx-sidebar__header">
            <div className="vx-sidebar__brand">
              {brandIcon ? <span className="vx-sidebar__brand-icon">{brandIcon}</span> : null}
              <div className="vx-sidebar__brand-copy">
                <span className="vx-sidebar__brand-text">{brand}</span>
                {brandCaption ? <span className="vx-sidebar__brand-caption">{brandCaption}</span> : null}
              </div>
            </div>
          </div>

          <nav className="vx-sidebar__nav" aria-label="Primary navigation">
            {sections.map((section, sectionIndex) => (
              <div
                key={section.key ?? section.title ?? sectionIndex}
                className="vx-nav-section-block"
              >
                {section.title ? (
                  <div className="vx-nav-section-block__title">{section.title}</div>
                ) : null}
                <div className="vx-nav-section-block__items">
                  {section.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={cx('vx-nav-item', item.active && 'vx-nav-item--active')}
                      onClick={item.onSelect}
                    >
                      {item.icon ? <span className="vx-nav-item__icon">{item.icon}</span> : null}
                      <span className="vx-nav-item__label">{item.label}</span>
                      {item.badge ? <span className="vx-nav-item__badge">{item.badge}</span> : null}
                      {item.trailing ? (
                        <span className="vx-nav-item__trailing">{item.trailing}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="vx-sidebar__footer">
            {sidebarFooter ? <div className="vx-sidebar__footer-content">{sidebarFooter}</div> : null}
            {onSidebarToggle ? (
              <Button
                variant="ghost"
                size="sm"
                className="vx-sidebar__toggle"
                onClick={onSidebarToggle}
                aria-label={sidebarCollapsed ? sidebarExpandLabel : sidebarCollapseLabel}
              >
                {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                <span className="vx-sidebar__toggle-label">
                  {sidebarCollapsed ? sidebarExpandLabel : sidebarCollapseLabel}
                </span>
              </Button>
            ) : null}
          </div>
        </div>
        <span className="vx-overlay-scrollbar" aria-hidden="true">
          <span className="vx-overlay-scrollbar__thumb" />
        </span>
      </aside>

      {onMobileNavToggle ? (
        <button
          type="button"
          className="vx-shell__overlay"
          aria-label={sidebarCloseLabel}
          onClick={onMobileNavToggle}
        />
      ) : null}

      <div className="vx-shell__main">
        <header className="vx-topbar">
          {onMobileNavToggle ? (
            <Button
              variant="ghost"
              size="sm"
              className="vx-topbar__menu"
              aria-label={menuButtonLabel}
              onClick={onMobileNavToggle}
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
          {headerActions ? <div className="vx-topbar__actions">{headerActions}</div> : null}
        </header>
        <div
          ref={contentHostRef}
          className="vx-shell__content-wrap vx-scroll-host"
          data-scrollable="false"
          data-scrollbar-state="hidden"
        >
          <main ref={contentScrollRef} className="vx-shell__content vx-scroll-hide-native">{children}</main>
          <span className="vx-overlay-scrollbar" aria-hidden="true">
            <span className="vx-overlay-scrollbar__thumb" />
          </span>
        </div>
      </div>
    </div>
  );
}
