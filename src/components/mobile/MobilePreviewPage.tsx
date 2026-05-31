import { useState } from 'react';
import {
  Bell,
  ChevronRight,
  House,
  Package2,
  Search,
  Settings,
  Share2,
  Download,
  Trash2,
  User,
  Zap,
  X,
  ArrowLeft,
  Plus,
  Star,
  MoreHorizontal,
  Menu,
  Palette,
  FileCode2,
  LogOut,
} from 'lucide-react';
import { MobileShell, MobileTopBar, MobileIconButton } from './MobileShell';
import { BottomNav } from './BottomNav';
import { MobileList, MobileListSection, MobileListItem } from './MobileList';
import { Sheet } from '../Sheet';
import { Badge } from '../Badge';
import { Button } from '../Button';

type Tab = 'home' | 'search' | 'alerts' | 'profile';
type Screen = 'list' | 'detail';

interface MobilePreviewPageProps {
  onExit: () => void;
}

export function MobilePreviewPage({ onExit }: MobilePreviewPageProps) {
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>('list');
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerActive, setDrawerActive] = useState('shell-sidebar');
  const [starred, setStarred] = useState(false);

  const renderHome = () =>
    screen === 'detail' ? (
      <>
        <MobileTopBar
          title="Shell & Sidebar"
          leading={
            <MobileIconButton label="Back" onClick={() => setScreen('list')}>
              <ArrowLeft size={20} />
            </MobileIconButton>
          }
          trailing={
            <MobileIconButton label="More" onClick={() => setActionSheetOpen(true)}>
              <MoreHorizontal size={20} />
            </MobileIconButton>
          }
        />
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Badge variant="accent">Layout</Badge>
            <MobileIconButton
              label={starred ? 'Unstar' : 'Star'}
              onClick={() => setStarred((v) => !v)}
              style={{ color: starred ? 'var(--vx-warning)' : undefined }}
            >
              <Star size={20} fill={starred ? 'currentColor' : 'none'} />
            </MobileIconButton>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--vx-text)', lineHeight: 1.2 }}>
            Shell & Sidebar
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--vx-text-secondary)', lineHeight: 1.6 }}>
            The shell is responsible for sidebar hierarchy, sticky header spacing, and content
            width. Pages should inherit structure instead of rebuilding it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Keep navigation labels short', 'Use section titles to separate groups', 'Let the content area own its headings'].map(
              (tip) => (
                <div
                  key={tip}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 'var(--vx-radius)',
                    background: 'var(--vx-bg-accent)',
                    fontSize: 13,
                    color: 'var(--vx-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: 'var(--vx-primary)', flexShrink: 0, marginTop: 1 }}>•</span>
                  {tip}
                </div>
              ),
            )}
          </div>
          <Button onClick={() => setActionSheetOpen(true)}>
            <Share2 size={16} />
            Share
          </Button>
        </div>
      </>
    ) : (
      <>
        <MobileTopBar
          title="Components"
          leading={
            <MobileIconButton label="Open navigation" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} />
            </MobileIconButton>
          }
          trailing={
            <MobileIconButton label="Add">
              <Plus size={20} />
            </MobileIconButton>
          }
        />
        <div style={{ padding: '16px 16px 8px', fontSize: 22, fontWeight: 700, color: 'var(--vx-text)' }}>
          Good morning 👋
        </div>
        <div style={{ padding: '0 16px 16px', fontSize: 14, color: 'var(--vx-text-secondary)' }}>
          Pick a component to explore.
        </div>
        <MobileListSection title="Layout" style={{ padding: '0 16px 24px' }}>
          <MobileList>
            <MobileListItem
              leading={<Package2 size={18} />}
              label="Shell & Sidebar"
              description="App chrome and navigation structure"
              trailing={<Badge variant="accent">Layout</Badge>}
              chevron
              onClick={() => setScreen('detail')}
            />
            <MobileListItem
              leading={<Zap size={18} />}
              label="Grid & Page"
              description="Responsive column layouts"
              chevron
              onClick={() => {}}
            />
          </MobileList>
        </MobileListSection>
        <MobileListSection title="Components" style={{ padding: '0 16px 24px' }}>
          <MobileList>
            <MobileListItem
              leading={<Star size={18} />}
              label="Elements"
              description="Buttons, badges, cards"
              trailing={<Badge variant="success">Stable</Badge>}
              chevron
              onClick={() => {}}
            />
            <MobileListItem
              leading={<Settings size={18} />}
              label="Form Controls"
              description="Inputs, switches, dialogs"
              chevron
              onClick={() => {}}
            />
            <MobileListItem
              leading={<Bell size={18} />}
              label="Toasts"
              description="Transient feedback messages"
              chevron
              onClick={() => {}}
            />
          </MobileList>
        </MobileListSection>
      </>
    );

  const renderSearch = () => (
    <>
      <MobileTopBar title="Search" />
      <div style={{ padding: '12px 16px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 14px',
            height: 44,
            borderRadius: 'var(--vx-radius)',
            background: 'var(--vx-bg-accent)',
            color: 'var(--vx-text-muted)',
            fontSize: 15,
          }}
        >
          <Search size={16} />
          <span>Search components…</span>
        </div>
      </div>
      <MobileListSection title="Recent" style={{ padding: '20px 16px 0' }}>
        <MobileList>
          {['Button', 'MobileShell', 'ActionSheet', 'BottomNav'].map((name) => (
            <MobileListItem key={name} label={name} leading={<Search size={16} />} chevron onClick={() => {}} />
          ))}
        </MobileList>
      </MobileListSection>
    </>
  );

  const renderAlerts = () => (
    <>
      <MobileTopBar title="Alerts" />
      <MobileListSection title="Today" style={{ padding: '16px 16px 0' }}>
        <MobileList>
          <MobileListItem
            leading={<Zap size={18} />}
            label="Build passed"
            description="vxui-react v1.0 — 2 min ago"
            trailing={<Badge variant="success">OK</Badge>}
            onClick={() => {}}
          />
          <MobileListItem
            leading={<Package2 size={18} />}
            label="New component merged"
            description="MobileList — 1 hr ago"
            trailing={<Badge variant="accent">New</Badge>}
            onClick={() => {}}
          />
          <MobileListItem
            leading={<Bell size={18} />}
            label="Reminder"
            description="Review open PRs — 3 hr ago"
            onClick={() => {}}
          />
        </MobileList>
      </MobileListSection>
    </>
  );

  const renderProfile = () => (
    <>
      <MobileTopBar
        title="Profile"
        trailing={
          <MobileIconButton label="Settings">
            <Settings size={20} />
          </MobileIconButton>
        }
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 16px 20px',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--vx-primary-soft)',
            color: 'var(--vx-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={32} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--vx-text)' }}>Developer</div>
        <div style={{ fontSize: 13, color: 'var(--vx-text-muted)' }}>vxui@example.com</div>
        <Badge variant="accent">Pro</Badge>
      </div>
      <MobileListSection style={{ padding: '0 16px' }}>
        <MobileList>
          <MobileListItem leading={<Settings size={18} />} label="Preferences" chevron onClick={() => {}} />
          <MobileListItem leading={<Star size={18} />} label="Starred components" chevron onClick={() => {}} />
          <MobileListItem leading={<Download size={18} />} label="Exports" chevron onClick={() => {}} />
          <MobileListItem leading={<Trash2 size={18} />} label="Delete account" destructive onClick={() => {}} />
        </MobileList>
      </MobileListSection>
    </>
  );

  const renderTab = () => {
    switch (tab) {
      case 'home': return renderHome();
      case 'search': return renderSearch();
      case 'alerts': return renderAlerts();
      case 'profile': return renderProfile();
    }
  };

  return (
    <div className="vxm-fullscreen-preview">
      {/* Exit bar */}
      <div className="vxm-fullscreen-preview__bar">
        <span className="vxm-fullscreen-preview__label">
          <Smartphone size={15} />
          Mobile Preview
        </span>
        <button
          type="button"
          className="vxm-fullscreen-preview__exit"
          onClick={onExit}
          aria-label="Exit mobile preview"
        >
          <X size={16} />
          Exit Preview
        </button>
      </div>

      {/* Simulated phone content — fills remaining space */}
      <div className="vxm-fullscreen-preview__stage">
        <MobileShell
          bottomNav={
            <BottomNav
              items={[
                {
                  key: 'home',
                  label: 'Home',
                  icon: <House size={22} />,
                  active: tab === 'home',
                  onSelect: () => { setTab('home'); setScreen('list'); },
                },
                {
                  key: 'search',
                  label: 'Search',
                  icon: <Search size={22} />,
                  active: tab === 'search',
                  onSelect: () => setTab('search'),
                },
                {
                  key: 'alerts',
                  label: 'Alerts',
                  icon: <Bell size={22} />,
                  badge: 3,
                  active: tab === 'alerts',
                  onSelect: () => setTab('alerts'),
                },
                {
                  key: 'profile',
                  label: 'Profile',
                  icon: <User size={22} />,
                  active: tab === 'profile',
                  onSelect: () => setTab('profile'),
                },
              ]}
            />
          }
        >
          {renderTab()}
        </MobileShell>

        {/* Drawer — rendered inside the stage so it overlays the phone UI */}
        <Sheet
          side="left"
          open={drawerOpen}
          onOpenChange={(v) => { if (!v) setDrawerOpen(false); }}
          width={260}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--vx-primary-soft)',
                  color: 'var(--vx-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--vx-text)' }}>Developer</div>
                <div style={{ fontSize: 12, color: 'var(--vx-text-muted)' }}>vxui@example.com</div>
              </div>
            </div>
          }
          footer={
            <div>
              <button type="button" className="vxm-drawer-item" onClick={() => setDrawerOpen(false)}>
                <span className="vxm-drawer-item__icon"><Settings size={18} /></span>
                <span className="vxm-drawer-item__label">Settings</span>
              </button>
              <button type="button" className="vxm-drawer-item" onClick={() => setDrawerOpen(false)}>
                <span className="vxm-drawer-item__icon"><LogOut size={18} /></span>
                <span className="vxm-drawer-item__label">Sign out</span>
              </button>
            </div>
          }
        >
          <div className="vxm-drawer-section">
            <div className="vxm-drawer-section__title">Getting Started</div>
            <div className="vxm-drawer-section__items">
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'intro' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('intro'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><House size={18} /></span>
                <span className="vxm-drawer-item__label">Introduction</span>
              </button>
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'quickstart' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('quickstart'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><Zap size={18} /></span>
                <span className="vxm-drawer-item__label">Quick Start</span>
              </button>
            </div>
          </div>
          <div className="vxm-drawer-section">
            <div className="vxm-drawer-section__title">Layout</div>
            <div className="vxm-drawer-section__items">
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'shell-sidebar' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('shell-sidebar'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><Package2 size={18} /></span>
                <span className="vxm-drawer-item__label">Shell & Sidebar</span>
              </button>
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'grid' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('grid'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><FileCode2 size={18} /></span>
                <span className="vxm-drawer-item__label">Grid & Page</span>
              </button>
            </div>
          </div>
          <div className="vxm-drawer-section">
            <div className="vxm-drawer-section__title">Components</div>
            <div className="vxm-drawer-section__items">
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'elements' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('elements'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><Star size={18} /></span>
                <span className="vxm-drawer-item__label">Elements</span>
              </button>
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'theming' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('theming'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><Palette size={18} /></span>
                <span className="vxm-drawer-item__label">Theming</span>
                <span className="vxm-drawer-item__badge">2</span>
              </button>
              <button type="button" className={'vxm-drawer-item' + (drawerActive === 'toasts' ? ' vxm-drawer-item--active' : '')} onClick={() => { setDrawerActive('toasts'); setDrawerOpen(false); }}>
                <span className="vxm-drawer-item__icon"><Bell size={18} /></span>
                <span className="vxm-drawer-item__label">Toasts</span>
              </button>
            </div>
          </div>
        </Sheet>
      </div>

      <Sheet
        variant="action"
        open={actionSheetOpen}
        onOpenChange={(v) => { if (!v) setActionSheetOpen(false); }}
        title="Share"
        description="Choose how to share this component."
      >
        <Sheet.Item icon={<Share2 size={18} />} onClick={() => setActionSheetOpen(false)}>
          Copy link
        </Sheet.Item>
        <Sheet.Item icon={<Download size={18} />} onClick={() => setActionSheetOpen(false)}>
          Download source
        </Sheet.Item>
        <Sheet.Item icon={<Trash2 size={18} />} destructive onClick={() => setActionSheetOpen(false)}>
          Remove from library
        </Sheet.Item>
      </Sheet>
    </div>
  );
}

// Inline import for Smartphone icon used in the bar label
function Smartphone({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
