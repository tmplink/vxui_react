import { type ReactNode, type Ref } from 'react';
import {
  Shell,
  ShellSidebar,
  ShellNav,
  ShellNavSection,
  ShellNavItem,
  ShellOverlay,
  ShellMain,
  ShellTopbar,
  ShellContent,
  type ShellNavItem as ShellNavItemType,
  type ShellNavSection as ShellNavSectionType,
} from './Shell';

// Re-export the primitive sub-components so consumers can import them from AppShell if preferred
export {
  Shell,
  ShellSidebar,
  ShellNav,
  ShellNavSection,
  ShellNavItem,
  ShellOverlay,
  ShellMain,
  ShellTopbar,
  ShellContent,
};
export type {
  ShellProps,
  ShellSidebarProps,
  ShellNavProps,
  ShellNavSectionProps,
  ShellNavItemProps,
  ShellOverlayProps,
  ShellMainProps,
  ShellTopbarProps,
  ShellContentProps,
} from './Shell';

// Backwards-compatible type aliases
export type AppShellNavItem = ShellNavItemType;
export type AppShellNavSection = ShellNavSectionType;

export interface AppShellProps {
  brand?: string;
  brandCaption?: string;
  brandIcon?: ReactNode;
  topbarRef?: Ref<HTMLElement>;
  breadcrumb?: ReactNode;
  title?: string;
  description?: string;
  navItems?: AppShellNavItem[];
  navSections?: AppShellNavSection[];
  sidebarCollapsed?: boolean;
  mobileNavOpen?: boolean;
  density?: 'comfortable' | 'compact';
  onSidebarToggle?: () => void;
  onMobileNavToggle?: () => void;
  onSidebarClick?: (e: React.MouseEvent<HTMLElement>) => void;
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
  topbarRef,
  breadcrumb,
  title,
  description,
  navItems,
  navSections,
  sidebarCollapsed = false,
  mobileNavOpen = false,
  onSidebarToggle,
  onMobileNavToggle,
  onSidebarClick,
  menuButtonLabel = 'Open navigation',
  sidebarCollapseLabel = 'Collapse',
  sidebarExpandLabel = 'Expand',
  sidebarCloseLabel = 'Close sidebar',
  density,
  headerActions,
  sidebarFooter,
  children,
}: AppShellProps) {
  const sections = navSections ?? (navItems ? [{ items: navItems }] : []);

  return (
    <Shell collapsed={sidebarCollapsed} mobileNavOpen={mobileNavOpen} density={density}>
      <ShellSidebar
        brand={brand}
        brandCaption={brandCaption}
        brandIcon={brandIcon}
        collapsed={sidebarCollapsed}
        footer={sidebarFooter}
        onToggle={onSidebarToggle}
        onSidebarClick={onSidebarClick}
        collapseLabel={sidebarCollapseLabel}
        expandLabel={sidebarExpandLabel}
      >
        <ShellNav>
          {sections.map((section, sectionIndex) => (
            <ShellNavSection key={section.key ?? section.title ?? sectionIndex} title={section.title}>
              {section.items.map(({ key, onSelect, ...rest }) => (
                <ShellNavItem key={key} onSelect={onSelect} {...rest} />
              ))}
            </ShellNavSection>
          ))}
        </ShellNav>
      </ShellSidebar>

      {onMobileNavToggle ? (
        <ShellOverlay onClose={onMobileNavToggle} closeLabel={sidebarCloseLabel} />
      ) : null}

      <ShellMain>
        <ShellTopbar
          ref={topbarRef}
          breadcrumb={breadcrumb}
          title={title}
          description={description}
          actions={headerActions}
          onMenuToggle={onMobileNavToggle}
          mobileNavOpen={mobileNavOpen}
          menuButtonLabel={menuButtonLabel}
        />
        <ShellContent>{children}</ShellContent>
      </ShellMain>
    </Shell>
  );
}
