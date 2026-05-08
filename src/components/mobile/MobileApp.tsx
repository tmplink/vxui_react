import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bell,
  Boxes,
  Check,
  ChevronRight,
  Compass,
  FileCode2,
  FileX2,
  House,
  LayoutDashboard,
  List,
  LogIn,
  Menu,
  MoonStar,
  Package2,
  Palette,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Trash2,
  User,
  UserPlus,
  Zap,
  Share2,
  Download,
  Star,
} from 'lucide-react';
import { MobileShell, MobileTopBar, MobileIconButton } from './MobileShell';
import { BottomNav } from './BottomNav';
import { ActionSheet, ActionSheetItem } from './ActionSheet';
import { MobileList, MobileListSection, MobileListItem } from './MobileList';
import { MobileDrawer, DrawerNavItem, DrawerNavSection } from './MobileDrawer';
import { useI18n } from '../../i18n';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Textarea,
  Slider,
  Spinner,
  Progress,
  Alert,
  Skeleton,
  Popover,
  DropdownMenu,
  Breadcrumb,
  Pagination,
  Accordion,
  Separator,
  Avatar,
  Table,
  Tooltip,
  useToast,
  useTheme,
} from '../../lib';

// ─── Types ────────────────────────────────────────────────────────────────────

type MobileView = 'home' | 'docs' | 'login' | 'register' | 'privacy-policy' | 'terms-of-service';
type BottomTab = 'home' | 'docs' | 'search';

type PageKey =
  | 'introduction'
  | 'quick-start'
  | 'shell-sidebar'
  | 'grid-page'
  | 'elements'
  | 'form-controls'
  | 'form-inputs'
  | 'navigation'
  | 'data-list'
  | 'empty-states'
  | 'toasts'
  | 'feedback'
  | 'overlays'
  | 'nav-layout'
  | 'data-display'
  | 'mobile'
  | 'home-page'
  | 'login-page'
  | 'register-page'
  | 'error-page'
  | 'privacy-policy';

interface PageDefinition {
  section: string;
  title: string;
  description: string;
  guidance: string[];
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

function getMobileView(): MobileView {
  if (typeof window === 'undefined') return 'home';
  const sub = window.location.pathname.replace(/^\/m/, '') || '/';
  if (sub === '/login') return 'login';
  if (sub === '/register') return 'register';
  if (sub === '/privacy-policy') return 'privacy-policy';
  if (sub === '/terms-of-service') return 'terms-of-service';
  if (sub.startsWith('/docs')) return 'docs';
  return 'home';
}

function getMobilePage(): PageKey {
  if (typeof window === 'undefined') return 'introduction';
  const sub = window.location.pathname.replace(/^\/m/, '') || '/';
  if (sub.startsWith('/docs/')) {
    const page = sub.split('/')[2];
    if (page) return page as PageKey;
  }
  return 'introduction';
}

function getMobileTab(): BottomTab {
  const view = getMobileView();
  if (view === 'docs') return 'docs';
  return 'home';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileApp() {
  const { t } = useI18n();
  const { push } = useToast();
  const { mode, setTheme, theme, themes } = useTheme();

  const pages = t.pageDefs as Record<PageKey, PageDefinition>;

  // ── routing state ──────────────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<MobileView>(getMobileView);
  const [activePage, setActivePage] = useState<PageKey>(getMobilePage);
  const [activeTab, setActiveTab] = useState<BottomTab>(getMobileTab);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  // ── component preview state ────────────────────────────────────────────────
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [checkboxA, setCheckboxA] = useState(false);
  const [checkboxB, setCheckboxB] = useState(true);
  const [radioVal, setRadioVal] = useState('b');
  const [sliderVal, setSliderVal] = useState(42);
  const [paginationPage, setPaginationPage] = useState(1);
  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'alerts' | 'profile'>('home');

  // ── URL sync ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let path = '/m';
    if (mobileView === 'login') path = '/m/login';
    else if (mobileView === 'register') path = '/m/register';
    else if (mobileView === 'privacy-policy') path = '/m/privacy-policy';
    else if (mobileView === 'terms-of-service') path = '/m/terms-of-service';
    else if (mobileView === 'docs') path = `/m/docs/${activePage}`;

    if (window.location.pathname !== path) {
      window.history.pushState({ mobileView, activePage }, '', path);
    }
  }, [mobileView, activePage]);

  // ── browser back/forward ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const view = getMobileView();
      const page = getMobilePage();
      setMobileView(view);
      setActivePage(page);
      setActiveTab(view === 'docs' ? 'docs' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── helpers ────────────────────────────────────────────────────────────────
  const selectPage = (page: PageKey) => {
    setActivePage(page);
    setMobileView('docs');
    setActiveTab('docs');
    setDrawerOpen(false);
  };

  const selectTab = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === 'home') setMobileView('home');
    else if (tab === 'docs') setMobileView('docs');
  };

  const activeDocument = pages[activePage];

  // ── nav sections for drawer ────────────────────────────────────────────────
  const navSections = [
    {
      title: t.nav.gettingStarted,
      items: [
        { key: 'introduction', label: t.pages.introduction, icon: <House size={16} /> },
        { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} /> },
      ],
    },
    {
      title: t.nav.layout,
      items: [
        { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} /> },
        { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: t.nav.components,
      items: [
        { key: 'elements', label: t.pages.elements, icon: <Package2 size={16} /> },
        { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} /> },
        { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} /> },
        { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} /> },
        { key: 'data-display', label: t.pages['data-display'], icon: <List size={16} /> },
        { key: 'navigation', label: t.pages.navigation, icon: <Compass size={16} /> },
        { key: 'data-list', label: t.pages['data-list'], icon: <List size={16} /> },
        { key: 'empty-states', label: t.pages['empty-states'], icon: <FileX2 size={16} /> },
      ],
    },
    {
      title: t.nav.feedback,
      items: [
        { key: 'toasts', label: t.pages.toasts, icon: <Bell size={16} /> },
        { key: 'feedback', label: t.pages.feedback, icon: <Bell size={16} /> },
      ],
    },
    {
      title: t.nav.navigation,
      items: [
        { key: 'nav-layout', label: t.pages['nav-layout'], icon: <Compass size={16} /> },
      ],
    },
    {
      title: t.nav.mobile,
      items: [
        { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} /> },
      ],
    },
    {
      title: t.nav.templates,
      items: [
        { key: 'home-page', label: t.pages['home-page'], icon: <House size={16} /> },
        { key: 'login-page', label: t.pages['login-page'], icon: <LogIn size={16} /> },
        { key: 'register-page', label: t.pages['register-page'], icon: <UserPlus size={16} /> },
        { key: 'error-page', label: t.pages['error-page'], icon: <AlertTriangle size={16} /> },
        { key: 'privacy-policy', label: t.pages['privacy-policy'], icon: <ShieldCheck size={16} /> },
      ],
    },
  ];

  // ── component preview renderer (shared with desktop) ──────────────────────
  const renderPagePreview = () => {
    switch (activePage) {
      case 'quick-start':
        return (
          <pre className="vx-docs-code" style={{ fontSize: 11, overflowX: 'auto' }}>
            {`import { AppShell, ThemeProvider } from 'vxui-react';\n\nexport function App() {\n  return (\n    <ThemeProvider themes={themes} defaultTheme="sunset">\n      <AppShell navSections={sections}>...</AppShell>\n    </ThemeProvider>\n  );\n}`}
          </pre>
        );
      case 'elements':
        return (
          <div className="vx-stack vx-stack--tight">
            <div className="vx-inline vx-inline--wrap">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="vx-inline vx-inline--wrap">
              <Badge>Neutral</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>
        );
      case 'form-controls':
        return (
          <div className="vx-stack">
            <Input label="Workspace name" placeholder="vxui-docs" />
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} label="Realtime alerts" />
          </div>
        );
      case 'navigation':
        return (
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="vx-muted">Tabs separate sibling views.</p>
            </TabsContent>
            <TabsContent value="api">
              <p className="vx-muted">Expose structural props first.</p>
            </TabsContent>
            <TabsContent value="examples">
              <p className="vx-muted">Use tabs for nearby representations.</p>
            </TabsContent>
          </Tabs>
        );
      case 'form-inputs':
        return (
          <div className="vx-stack">
            <Select label="Framework" placeholder="Pick a framework…">
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
            </Select>
            <div className="vx-stack vx-stack--tight">
              <Checkbox label="Accept terms" checked={checkboxA} onChange={e => setCheckboxA(e.target.checked)} />
              <Checkbox label="Subscribe" description="Weekly digest only" checked={checkboxB} onChange={e => setCheckboxB(e.target.checked)} />
            </div>
            <RadioGroup label="Notifications">
              <Radio name="mn" value="a" label="All alerts" checked={radioVal === 'a'} onChange={() => setRadioVal('a')} />
              <Radio name="mn" value="b" label="Mentions only" checked={radioVal === 'b'} onChange={() => setRadioVal('b')} />
              <Radio name="mn" value="c" label="None" checked={radioVal === 'c'} onChange={() => setRadioVal('c')} />
            </RadioGroup>
            <Textarea label="Notes" placeholder="Describe what changed…" rows={3} />
            <Slider label="Score" showValue min={0} max={100} value={sliderVal} onChange={e => setSliderVal(Number(e.target.value))} />
          </div>
        );
      case 'feedback':
        return (
          <div className="vx-stack">
            <div className="vx-inline" style={{ alignItems: 'center' }}>
              <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
            </div>
            <Progress label="Uploading" showLabel value={68} />
            <Progress label="Processing" indeterminate />
            <Alert variant="info" title="New version available">vxUI 1.1 ships now.</Alert>
            <Alert variant="success" title="Build complete" onClose={() => {}} />
            <div className="vx-stack vx-stack--tight">
              <Skeleton variant="text" lines={2} />
              <div className="vx-inline">
                <Skeleton variant="circle" width={40} height={40} />
                <div className="vx-stack vx-stack--tight" style={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={14} />
                  <Skeleton variant="text" width="40%" height={12} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'overlays':
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
              <Tooltip content="Primary action" placement="top">
                <Button size="sm">Hover (top)</Button>
              </Tooltip>
              <Tooltip content="Right" placement="right">
                <Button size="sm" variant="secondary">Right</Button>
              </Tooltip>
            </div>
            <Separator />
            <Popover content={<div className="vx-stack vx-stack--tight"><p style={{ fontSize: '0.875rem', margin: 0 }}>Popover content</p><Button size="sm">Confirm</Button></div>}>
              <Button variant="secondary" size="sm">Open popover</Button>
            </Popover>
            <Separator />
            <DropdownMenu
              trigger={<Button variant="secondary" size="sm">Actions ▾</Button>}
              groups={[
                { items: [{ label: 'Edit', shortcut: '⌘E', onClick: () => {} }, { label: 'Duplicate', onClick: () => {} }] },
                { items: [{ label: 'Archive', onClick: () => {} }, { label: 'Delete', danger: true, onClick: () => {} }] },
              ]}
            />
          </div>
        );
      case 'nav-layout':
        return (
          <div className="vx-stack">
            <Breadcrumb items={[{ label: 'Home', onClick: () => {} }, { label: 'Components', onClick: () => {} }, { label: 'Navigation' }]} />
            <Separator />
            <Pagination page={paginationPage} total={120} pageSize={10} onChange={setPaginationPage} />
            <Separator />
            <Accordion items={[
              { key: 'a', title: 'What is vxUI?', content: 'A lightweight React component library.' },
              { key: 'b', title: 'Dark mode?', content: 'Yes — all color tokens are semantic.' },
            ]} />
          </div>
        );
      case 'data-display':
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center', gap: '0.5rem' }}>
              <Avatar size="sm" name="Alice Wang" />
              <Avatar size="md" name="Bob Zhang" />
              <Avatar size="lg" name="Carol Liu" />
              <Avatar size="md" />
            </div>
            <Separator />
            <Table
              columns={[
                { key: 'name', header: 'Name', accessor: r => r.name },
                { key: 'role', header: 'Role', accessor: r => r.role },
                { key: 'status', header: 'Status', accessor: r => <Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge> },
              ]}
              data={[
                { name: 'Alice Wang', role: 'Engineer', status: 'Active' },
                { name: 'Bob Zhang', role: 'Designer', status: 'Away' },
              ]}
            />
          </div>
        );
      case 'toasts':
        return (
          <div className="vx-stack">
            <Button onClick={() => push({ tone: 'info', title: 'Docs synced', description: 'Showcase index updated.' })}>Info toast</Button>
            <Button variant="secondary" onClick={() => push({ tone: 'success', title: 'Build complete', description: 'Bundle compiled.' })}>Success toast</Button>
          </div>
        );
      case 'mobile':
        return (
          <div className="vx-stack vx-stack--tight">
            <Alert variant="info" title="You are viewing the mobile docs site">
              This page demonstrates the same mobile components that power this very interface.
            </Alert>
            <MobileList>
              <MobileListItem leading={<Zap size={18} />} label="MobileShell" description="Layout: topBar + main + bottomNav" chevron onClick={() => {}} />
              <MobileListItem leading={<Bell size={18} />} label="BottomNav" description="Tab navigation with badges" chevron onClick={() => {}} />
              <MobileListItem leading={<Package2 size={18} />} label="MobileDrawer" description="Slide-in navigation with swipe-to-close" chevron onClick={() => {}} />
              <MobileListItem leading={<List size={18} />} label="MobileList" description="Touch-optimized list rows" chevron onClick={() => {}} />
            </MobileList>
          </div>
        );
      case 'home-page':
        return (
          <div className="vx-stack">
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <Badge variant="accent" style={{ marginBottom: 8 }}>New release</Badge>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem' }}>Build faster with vxUI</h3>
              <p className="vx-muted" style={{ marginBottom: 12, fontSize: '0.875rem' }}>Lightweight component system for modern interfaces.</p>
              <div className="vx-inline" style={{ justifyContent: 'center' }}>
                <Button onClick={() => selectPage('quick-start')}><Zap size={14} />Get started</Button>
                <Button variant="secondary" onClick={() => selectPage('elements')}>Browse</Button>
              </div>
            </div>
          </div>
        );
      case 'login-page':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Enter your credentials to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-stack">
                <Input label="Email" type="email" placeholder="you@example.com" />
                <Input label="Password" type="password" placeholder="••••••••" />
                <Button style={{ width: '100%' }}><LogIn size={14} />Sign in</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'register-page':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create account</CardTitle>
              <CardDescription>Fill in the details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-stack">
                <Input label="Full name" placeholder="Jane Smith" />
                <Input label="Email" type="email" placeholder="you@example.com" />
                <Input label="Password" type="password" placeholder="At least 8 characters" />
                <Checkbox label="I agree to the terms of service" checked={checkboxA} onChange={e => setCheckboxA(e.target.checked)} />
                <Button style={{ width: '100%' }}><UserPlus size={14} />Create account</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'error-page':
        return (
          <div className="vx-empty-state">
            <div className="vx-empty-state__icon"><AlertTriangle size={22} /></div>
            <div className="vx-empty-state__title">404 — Page not found</div>
            <div className="vx-empty-state__copy">The page doesn't exist or has been moved.</div>
            <Button onClick={() => selectPage('introduction')}><House size={14} />Go home</Button>
          </div>
        );
      case 'privacy-policy':
        return (
          <div className="vx-stack">
            <div>
              <p className="vx-muted" style={{ fontSize: '0.8rem', margin: '0 0 6px' }}>Last updated: May 2026</p>
              <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>Data Collection</h3>
              <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>We collect only information necessary to provide the service.</p>
            </div>
            <Separator />
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>Contact</h3>
              <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Contact <span style={{ color: 'var(--vx-primary)' }}>privacy@example.com</span></p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ── renderers ──────────────────────────────────────────────────────────────

  const renderHomeContent = () => (
    <div className="vxm-docs-home">
      {/* Hero */}
      <div className="vxm-docs-home__hero">
        <div className="vxm-docs-home__hero-badge">
          <Badge variant="accent">v1.0</Badge>
          <span className="vxm-docs-home__hero-badge-label">vxUI React</span>
        </div>
        <h1 className="vxm-docs-home__title">vxUI</h1>
        <p className="vxm-docs-home__lead">A lightweight React component library built on CSS custom properties. Zero dependencies. Built-in dark mode.</p>
        <div className="vxm-docs-home__actions">
          <Button onClick={() => selectPage('quick-start')} style={{ flex: 1 }}>
            <Zap size={16} />
            Get started
          </Button>
          <Button variant="secondary" onClick={() => selectPage('elements')} style={{ flex: 1 }}>
            Browse components
          </Button>
        </div>
      </div>

      {/* Stats */}
      <MobileListSection title="At a glance" style={{ padding: '0 16px 8px' }}>
        <div className="vxm-docs-home__stats">
          <div className="vxm-docs-home__stat">
            <div className="vxm-docs-home__stat-icon"><Check size={18} /></div>
            <div className="vxm-docs-home__stat-value">0</div>
            <div className="vxm-docs-home__stat-label">Dependencies</div>
          </div>
          <div className="vxm-docs-home__stat">
            <div className="vxm-docs-home__stat-icon"><Boxes size={18} /></div>
            <div className="vxm-docs-home__stat-value">30+</div>
            <div className="vxm-docs-home__stat-label">Components</div>
          </div>
          <div className="vxm-docs-home__stat">
            <div className="vxm-docs-home__stat-icon"><FileCode2 size={18} /></div>
            <div className="vxm-docs-home__stat-value">~24 KB</div>
            <div className="vxm-docs-home__stat-label">Core CSS</div>
          </div>
          <div className="vxm-docs-home__stat">
            <div className="vxm-docs-home__stat-icon"><MoonStar size={18} /></div>
            <div className="vxm-docs-home__stat-value">Built-in</div>
            <div className="vxm-docs-home__stat-label">Dark mode</div>
          </div>
        </div>
      </MobileListSection>

      {/* Quick nav */}
      <MobileListSection title="Getting started" style={{ padding: '0 16px 8px' }}>
        <MobileList>
          <MobileListItem leading={<House size={18} />} label="Introduction" description="What is vxUI and how it works" chevron onClick={() => selectPage('introduction')} />
          <MobileListItem leading={<Zap size={18} />} label="Quick start" description="Up and running in minutes" chevron onClick={() => selectPage('quick-start')} />
        </MobileList>
      </MobileListSection>

      <MobileListSection title="Components" style={{ padding: '0 16px 8px' }}>
        <MobileList>
          <MobileListItem leading={<Package2 size={18} />} label="Elements" description="Buttons, badges, cards" trailing={<Badge variant="accent">UI</Badge>} chevron onClick={() => selectPage('elements')} />
          <MobileListItem leading={<SlidersHorizontal size={18} />} label="Form controls" description="Input, switch, dialog" chevron onClick={() => selectPage('form-controls')} />
          <MobileListItem leading={<SlidersHorizontal size={18} />} label="Form inputs" description="Select, checkbox, radio, slider" chevron onClick={() => selectPage('form-inputs')} />
          <MobileListItem leading={<Bell size={18} />} label="Feedback" description="Spinner, progress, alert, skeleton" chevron onClick={() => selectPage('feedback')} />
          <MobileListItem leading={<Package2 size={18} />} label="Overlays" description="Tooltip, popover, dropdown" chevron onClick={() => selectPage('overlays')} />
          <MobileListItem leading={<Smartphone size={18} />} label="Mobile components" trailing={<Badge variant="success">New</Badge>} description="Shell, BottomNav, Drawer, List" chevron onClick={() => selectPage('mobile')} />
        </MobileList>
      </MobileListSection>

      {/* Theme switcher */}
      <MobileListSection title="Theme" style={{ padding: '0 16px 8px' }}>
        <div style={{ padding: '4px 0 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(themes).map(([key, def]) => (
            <Button key={key} size="sm" variant={theme === key ? 'solid' : 'secondary'} onClick={() => setTheme(key)}>
              {def.label ?? key}
            </Button>
          ))}
        </div>
        <div className="vx-inline" style={{ paddingBottom: 8 }}>
          <span className="vx-version-pill vx-version-pill--token">
            <Palette size={13} />{themes[theme]?.label ?? theme}
          </span>
          <span className="vx-version-pill vx-version-pill--token">
            <Sparkles size={13} />{t.modeLabel(mode)}
          </span>
        </div>
      </MobileListSection>

      {/* Desktop link */}
      <div style={{ padding: '8px 16px 32px' }}>
        <button
          type="button"
          className="vx-cmd-trigger"
          style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
          onClick={() => { window.location.href = '/docs/introduction'; }}
        >
          <Smartphone size={14} style={{ transform: 'rotate(0deg)' }} />
          Switch to desktop version
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );

  const renderDocContent = () => {
    if (!activeDocument) return null;
    const preview = renderPagePreview();

    return (
      <div className="vxm-docs-page">
        {/* Page header */}
        <div className="vxm-docs-page__header">
          <span className="vxm-docs-page__kicker">{activeDocument.section}</span>
          <h1 className="vxm-docs-page__title">{activeDocument.title}</h1>
          <p className="vxm-docs-page__lead">{activeDocument.description}</p>
        </div>

        {/* Component preview */}
        {preview && (
          <div className="vxm-docs-page__section">
            <div className="vxm-docs-page__section-title">Preview</div>
            <Card>
              <CardContent style={{ paddingTop: '1rem' }}>
                {preview}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Guidance */}
        <div className="vxm-docs-page__section">
          <div className="vxm-docs-page__section-title">Guidance</div>
          <MobileList>
            {activeDocument.guidance.map((item, i) => (
              <MobileListItem key={i} label={item} leading={<Check size={16} style={{ color: 'var(--vx-primary)' }} />} />
            ))}
          </MobileList>
        </div>

        {/* Badges */}
        <div className="vxm-docs-page__section">
          <div className="vx-inline vx-inline--wrap">
            <Badge variant="accent">Core</Badge>
            <Badge variant="success">Accessible</Badge>
            <Badge variant="warning">Documented</Badge>
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 32 }} />
      </div>
    );
  };

  const renderSearchContent = () => (
    <div>
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
      <MobileListSection title="All pages" style={{ padding: '16px 16px 0' }}>
        <MobileList>
          {navSections.flatMap(s =>
            s.items.map(item => (
              <MobileListItem
                key={item.key}
                leading={item.icon}
                label={item.label}
                description={s.title}
                chevron
                onClick={() => { selectPage(item.key as PageKey); setActiveTab('docs'); }}
              />
            ))
          )}
        </MobileList>
      </MobileListSection>
    </div>
  );

  const renderLoginContent = () => (
    <div style={{ padding: '32px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--vx-text)', marginBottom: 6 }}>vxUI</div>
        <p className="vx-muted" style={{ fontSize: 14 }}>Sign in to continue</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your credentials to access the docs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="vx-stack">
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Button style={{ width: '100%' }} onClick={() => { setMobileView('docs'); setActiveTab('docs'); }}>
              <LogIn size={14} />Sign in
            </Button>
            <Button variant="ghost" style={{ width: '100%' }} onClick={() => { setMobileView('docs'); setActiveTab('docs'); }}>
              Continue as guest
            </Button>
            <p className="vx-muted" style={{ textAlign: 'center', fontSize: '0.8125rem', margin: 0 }}>
              No account?{' '}
              <button type="button" className="vx-link" onClick={() => setMobileView('register')}>Register</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegisterContent = () => (
    <div style={{ padding: '32px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--vx-text)', marginBottom: 6 }}>vxUI</div>
        <p className="vx-muted" style={{ fontSize: 14 }}>Create an account</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Fill in the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="vx-stack">
            <Input label="Full name" placeholder="Jane Smith" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="At least 8 characters" />
            <Checkbox label="I agree to the terms of service" checked={checkboxA} onChange={e => setCheckboxA(e.target.checked)} />
            <Button style={{ width: '100%' }} onClick={() => { setMobileView('docs'); setActiveTab('docs'); }}>
              <UserPlus size={14} />Create account
            </Button>
            <p className="vx-muted" style={{ textAlign: 'center', fontSize: '0.8125rem', margin: 0 }}>
              Already have an account?{' '}
              <button type="button" className="vx-link" onClick={() => setMobileView('login')}>Sign in</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ── top bar ────────────────────────────────────────────────────────────────

  const renderTopBar = () => {
    const isDocsView = activeTab === 'docs' && mobileView === 'docs';
    const title = isDocsView ? (activeDocument?.title ?? 'Docs') : 'vxUI';

    return (
      <MobileTopBar
        title={title}
        leading={
          isDocsView ? (
            <MobileIconButton label="Open navigation" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} />
            </MobileIconButton>
          ) : undefined
        }
        trailing={
          isDocsView ? (
            <MobileIconButton label="Actions" onClick={() => setActionSheetOpen(true)}>
              <Share2 size={20} />
            </MobileIconButton>
          ) : (
            <MobileIconButton label="Sign in" onClick={() => setMobileView('login')}>
              <User size={20} />
            </MobileIconButton>
          )
        }
      />
    );
  };

  // ── main content ───────────────────────────────────────────────────────────

  const renderContent = () => {
    if (mobileView === 'login') return renderLoginContent();
    if (mobileView === 'register') return renderRegisterContent();
    if (activeTab === 'search') return renderSearchContent();
    if (activeTab === 'docs') return renderDocContent();
    return renderHomeContent();
  };

  // ── drawer ─────────────────────────────────────────────────────────────────

  const renderDrawer = () => (
    <MobileDrawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--vx-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>vx</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--vx-text)' }}>vxUI Docs</span>
        </div>
      }
      footer={
        <button
          type="button"
          className="vx-cmd-trigger"
          style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
          onClick={() => { window.location.href = '/docs/introduction'; }}
        >
          <Smartphone size={13} />
          Desktop version
          <ChevronRight size={13} />
        </button>
      }
    >
      {navSections.map(section => (
        <DrawerNavSection key={section.title} title={section.title}>
          {section.items.map(item => (
            <DrawerNavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activePage === item.key}
              onClick={() => selectPage(item.key as PageKey)}
            />
          ))}
        </DrawerNavSection>
      ))}
    </MobileDrawer>
  );

  // ── bottom nav ─────────────────────────────────────────────────────────────

  const isLoginOrRegister = mobileView === 'login' || mobileView === 'register';

  const renderBottomNav = () => (
    <BottomNav
      items={[
        { key: 'home', label: 'Home', icon: <House size={22} />, active: activeTab === 'home' && !isLoginOrRegister, onSelect: () => { selectTab('home'); setMobileView('home'); } },
        { key: 'docs', label: 'Docs', icon: <FileCode2 size={22} />, active: activeTab === 'docs' && !isLoginOrRegister, onSelect: () => { selectTab('docs'); setMobileView('docs'); } },
        { key: 'search', label: 'Search', icon: <Search size={22} />, active: activeTab === 'search' && !isLoginOrRegister, onSelect: () => { selectTab('search'); } },
      ]}
    />
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {renderDrawer()}
      <MobileShell
        topBar={renderTopBar()}
        bottomNav={!isLoginOrRegister ? renderBottomNav() : undefined}
      >
        {renderContent()}
      </MobileShell>
      <ActionSheet
        open={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        title="Options"
        description="Choose an action for this page."
      >
        <ActionSheetItem icon={<Star size={18} />} onClick={() => setActionSheetOpen(false)}>Bookmark page</ActionSheetItem>
        <ActionSheetItem icon={<Download size={18} />} onClick={() => setActionSheetOpen(false)}>Download PDF</ActionSheetItem>
        <ActionSheetItem icon={<Trash2 size={18} />} destructive onClick={() => setActionSheetOpen(false)}>Clear history</ActionSheetItem>
      </ActionSheet>
    </>
  );
}
