import { useEffect, useState } from 'react';
import {
  ArrowRight,
  AlertTriangle,
  Bell,
  Boxes,
  Check,
  ChevronRight,
  Compass,
  Download,
  FileCode2,
  FileText,
  FileX2,
  House,
  LayoutDashboard,
  List,
  LogIn,
  MoonStar,
  Package2,
  Palette,
  PanelsTopLeft,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SlidersHorizontal,
  Trash2,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';
import { CommandPalette } from './components/CommandPalette';
import type { SearchEntry } from './components/CommandPalette';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { useI18n } from './i18n';
import {
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
  useTheme,
  MobileShell,
  MobileTopBar,
  MobileIconButton,
  BottomNav,
  ActionSheet,
  ActionSheetItem,
  MobileList,
  MobileListSection,
  MobileListItem,
  // New components
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
  Tooltip,
  Popover,
  DropdownMenu,
  Breadcrumb,
  Pagination,
  Accordion,
  Separator,
  Avatar,
  Table,
} from './lib';
import { MobilePreviewPage } from './components/mobile/MobilePreviewPage';

type AppView = 'home' | 'login' | 'register' | 'docs' | 'privacy-policy' | 'terms-of-service';

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

// Static token base values (color values don't change with locale)
const tokenBaseValues = [
  { key: 'primary' as const, variable: '--vx-primary', value: '#2563eb' },
  { key: 'surface' as const, variable: '--vx-surface', value: '#ffffff' },
  { key: 'border' as const, variable: '--vx-border', value: '#e2e8f0' },
  { key: 'text' as const, variable: '--vx-text', value: '#0f172a' },
];


export default function App() {
  const { t } = useI18n();
  const getInitialView = (): AppView => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/privacy-policy') return 'privacy-policy';
    if (path === '/terms-of-service') return 'terms-of-service';
    if (path.startsWith('/docs')) return 'docs';
    return 'home';
  };

  const getInitialPage = (): PageKey => {
    if (typeof window === 'undefined') return 'introduction';
    const path = window.location.pathname;
    if (path.startsWith('/docs/')) {
      const page = path.split('/')[2];
      // simplified check, full check would need keys
      if (page) return page as PageKey;
    }
    return 'introduction';
  };

  const [appView, setAppView] = useState<AppView>(getInitialView);
  const pages = t.pageDefs as Record<PageKey, PageDefinition>;

  // Arrays that depend on translations
  const glanceCards = [
    { label: t.glance.zeroDeps, value: '0', hint: t.glance.zeroDepsHint, icon: <Check size={18} /> },
    { label: t.glance.components, value: '30+', hint: t.glance.componentsHint, icon: <Boxes size={18} /> },
    { label: t.glance.coreCSS, value: '~24 KB', hint: t.glance.coreCSSHint, icon: <FileCode2 size={18} /> },
    { label: t.glance.darkMode, value: 'Built-in', hint: t.glance.darkModeHint, icon: <MoonStar size={18} /> },
  ];
  const tokenCards = [
    { key: 'primary' as const, name: t.tokens.primary, variable: '--vx-primary', value: '#2563eb', description: t.tokens.primaryDesc },
    { key: 'surface' as const, name: t.tokens.surface, variable: '--vx-surface', value: '#ffffff', description: t.tokens.surfaceDesc },
    { key: 'border' as const, name: t.tokens.border, variable: '--vx-border', value: '#e2e8f0', description: t.tokens.borderDesc },
    { key: 'text' as const, name: t.tokens.text, variable: '--vx-text', value: '#0f172a', description: t.tokens.textDesc },
  ];
  const componentFamilies = [
    { title: t.families.layout, description: t.families.layoutDesc, page: 'shell-sidebar' as PageKey },
    { title: t.families.elements, description: t.families.elementsDesc, page: 'elements' as PageKey },
    { title: t.families.forms, description: t.families.formsDesc, page: 'form-controls' as PageKey },
    { title: t.families.feedback, description: t.families.feedbackDesc, page: 'toasts' as PageKey },
  ];
  const dataListRows = [
    { name: 'introduction.mdx', kind: 'Guide', updated: '2026-05-02' },
    { name: 'shell-sidebar.tsx', kind: 'Layout', updated: '2026-05-01' },
    { name: 'tokens.json', kind: 'Config', updated: '2026-04-28' },
  ];

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth < 960;
  });
  const [activePage, setActivePage] = useState<PageKey>(getInitialPage());
  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'alerts' | 'profile'>('home');
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [compactDensity, setCompactDensity] = useState(false);
  const [checkboxA, setCheckboxA] = useState(false);
  const [checkboxB, setCheckboxB] = useState(true);
  const [radioVal, setRadioVal] = useState('b');
  const [sliderVal, setSliderVal] = useState(42);
  const [paginationPage, setPaginationPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Build search index from pages
  const searchEntries: SearchEntry[] = Object.entries(pages).map(([key, page]) => ({
    key,
    title: page.title,
    section: page.section,
    description: page.description,
    keywords: page.guidance,
  }));
  const { push } = useToast();
  const { mode, setTheme, theme, themes } = useTheme();
  const [tokenValues, setTokenValues] = useState<Record<string, string>>(() =>
    tokenBaseValues.reduce<Record<string, string>>((snapshot, token) => {
      snapshot[token.variable] = token.value;
      return snapshot;
    }, {}),
  );

  const activeDocument = pages[activePage];
  const themeEntries = Object.entries(themes);

  // Update URL purely visually when navigation state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let path = '/';
    if (appView === 'login') path = '/login';
    else if (appView === 'register') path = '/register';
    else if (appView === 'privacy-policy') path = '/privacy-policy';
    else if (appView === 'terms-of-service') path = '/terms-of-service';
    else if (appView === 'docs') path = `/docs/${activePage}`;
    
    if (window.location.pathname !== path) {
      window.history.pushState({ appView, activePage }, '', path);
    }
  }, [appView, activePage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') setAppView('login');
      else if (path === '/register') setAppView('register');
      else if (path === '/privacy-policy') setAppView('privacy-policy');
      else if (path === '/terms-of-service') setAppView('terms-of-service');
      else if (path.startsWith('/docs')) {
        setAppView('docs');
        const page = path.split('/')[2];
        if (page && Object.keys(pages).includes(page)) {
          setActivePage(page as PageKey);
        }
      } else {
        setAppView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pages]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const styles = window.getComputedStyle(document.documentElement);
    const snapshot = tokenBaseValues.reduce<Record<string, string>>((currentValues, token) => {
      currentValues[token.variable] = styles.getPropertyValue(token.variable).trim() || token.value;
      return currentValues;
    }, {});

    setTokenValues(snapshot);
  }, [theme]);

  const selectPage = (page: PageKey) => {
    setActivePage(page);

    if (typeof window !== 'undefined' && window.innerWidth < 960) {
      setSidebarCollapsed(true);
    }
  };

  const navSections = [
    {
      title: t.nav.gettingStarted,
      items: [
        { key: 'introduction', label: t.pages.introduction, icon: <House size={16} />, active: activePage === 'introduction', onSelect: () => selectPage('introduction') },
        { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} />, active: activePage === 'quick-start', onSelect: () => selectPage('quick-start') },
      ],
    },
    {
      title: t.nav.layout,
      items: [
        { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} />, active: activePage === 'shell-sidebar', onSelect: () => selectPage('shell-sidebar') },
        { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} />, active: activePage === 'grid-page', onSelect: () => selectPage('grid-page') },
      ],
    },
    {
      title: t.nav.components,
      items: [
        { key: 'elements', label: t.pages.elements, icon: <Package2 size={16} />, trailing: <ChevronRight size={14} />, active: activePage === 'elements', onSelect: () => selectPage('elements') },
        { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} />, trailing: <ChevronRight size={14} />, active: activePage === 'form-controls', onSelect: () => selectPage('form-controls') },
        { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} />, trailing: <ChevronRight size={14} />, active: activePage === 'form-inputs', onSelect: () => selectPage('form-inputs') },
        { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} />, trailing: <ChevronRight size={14} />, active: activePage === 'overlays', onSelect: () => selectPage('overlays') },
        { key: 'data-display', label: t.pages['data-display'], icon: <List size={16} />, trailing: <ChevronRight size={14} />, active: activePage === 'data-display', onSelect: () => selectPage('data-display') },
        { key: 'navigation', label: t.pages.navigation, icon: <Compass size={16} />, trailing: <ChevronRight size={14} />, active: activePage === 'navigation', onSelect: () => selectPage('navigation') },
        { key: 'data-list', label: t.pages['data-list'], icon: <List size={16} />, active: activePage === 'data-list', onSelect: () => selectPage('data-list') },
        { key: 'empty-states', label: t.pages['empty-states'], icon: <FileX2 size={16} />, active: activePage === 'empty-states', onSelect: () => selectPage('empty-states') },
      ],
    },
    {
      title: t.nav.feedback,
      items: [
        { key: 'toasts', label: t.pages.toasts, icon: <Bell size={16} />, active: activePage === 'toasts', onSelect: () => selectPage('toasts') },
        { key: 'feedback', label: t.pages.feedback, icon: <Bell size={16} />, active: activePage === 'feedback', onSelect: () => selectPage('feedback') },
      ],
    },
    {
      title: t.nav.navigation,
      items: [
        { key: 'nav-layout', label: t.pages['nav-layout'], icon: <Compass size={16} />, active: activePage === 'nav-layout', onSelect: () => selectPage('nav-layout') },
      ],
    },
    {
      title: t.nav.mobile,
      items: [
        { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} />, active: activePage === 'mobile', onSelect: () => selectPage('mobile') },
      ],
    },
    {
      title: t.nav.templates,
      items: [
        { key: 'home-page', label: t.pages['home-page'], icon: <House size={16} />, active: activePage === 'home-page', onSelect: () => selectPage('home-page') },
        { key: 'login-page', label: t.pages['login-page'], icon: <LogIn size={16} />, active: activePage === 'login-page', onSelect: () => selectPage('login-page') },
        { key: 'register-page', label: t.pages['register-page'], icon: <UserPlus size={16} />, active: activePage === 'register-page', onSelect: () => selectPage('register-page') },
        { key: 'error-page', label: t.pages['error-page'], icon: <AlertTriangle size={16} />, active: activePage === 'error-page', onSelect: () => selectPage('error-page') },
        { key: 'privacy-policy', label: t.pages['privacy-policy'], icon: <ShieldCheck size={16} />, active: activePage === 'privacy-policy', onSelect: () => selectPage('privacy-policy') },
      ],
    },
  ];

  const renderPageSample = () => {
    switch (activePage) {
      case 'quick-start': {
        const quickStartCode = [
          "import { AppShell, ThemeProvider, ToastProvider, createTheme, themePresets } from 'vxui-react';",
          '',
          'const themes = {',
          '  light: themePresets.light,',
          '  dark: themePresets.dark,',
          '  sunset: themePresets.sunset,',
          "  ocean: createTheme('dark', {",
          "    label: 'Ocean',",
          "    tokens: { '--vx-primary': '#38bdf8' },",
          '  }),',
          '};',
          '',
          'export function App() {',
          '  return (',
          '    <ThemeProvider themes={themes} defaultTheme="sunset">',
          '      <ToastProvider>',
          '        <AppShell navSections={sections}>...</AppShell>',
          '      </ToastProvider>',
          '    </ThemeProvider>',
          '  );',
          '}',
        ].join('\n');

        return <pre className="vx-docs-code">{quickStartCode}</pre>;
      }
      case 'shell-sidebar':
        return (
          <div className="vx-preview-shell">
            <div className="vx-preview-shell__sidebar">
              <div className="vx-preview-shell__line vx-preview-shell__line--strong" />
              <div className="vx-preview-shell__line" />
              <div className="vx-preview-shell__line" />
              <div className="vx-preview-shell__line" />
            </div>
            <div className="vx-preview-shell__content">
              <div className="vx-preview-shell__line vx-preview-shell__line--header" />
              <div className="vx-preview-grid">
                <div className="vx-preview-grid__item" />
                <div className="vx-preview-grid__item" />
                <div className="vx-preview-grid__item" />
              </div>
            </div>
          </div>
        );
      case 'grid-page':
        return (
          <div className="vx-preview-grid vx-preview-grid--page">
            <div className="vx-preview-grid__item vx-preview-grid__item--wide" />
            <div className="vx-preview-grid__item" />
            <div className="vx-preview-grid__item" />
            <div className="vx-preview-grid__item" />
          </div>
        );
      case 'elements':
        return (
          <div className="vx-stack vx-stack--tight">
            <div className="vx-inline vx-inline--wrap">
              <Button>Primary action</Button>
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
            <Input
              label="Workspace name"
              hint="Use a short label that matches the visible page title."
              placeholder="vxui-docs"
            />
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
              label="Realtime alerts"
              description="Send a compact toast when documentation content ships."
            />
            <Dialog
              trigger={<Button variant="secondary">Open dialog sample</Button>}
              title="Publish documentation"
              description="Confirm before pushing a new release tag to the showcase site."
              footer={<Button>Confirm publish</Button>}
            >
              <div className="vx-stack">
                <Input label="Version" placeholder="v1.0" />
                <Input label="Release note" placeholder="Document shell and design tokens" />
              </div>
            </Dialog>
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
              <p className="vx-muted">Tabs separate sibling views without leaving the current page context.</p>
            </TabsContent>
            <TabsContent value="api">
              <p className="vx-muted">Expose structural props first, then visual overrides as needed.</p>
            </TabsContent>
            <TabsContent value="examples">
              <p className="vx-muted">Use tabs when the user compares nearby representations of the same entity.</p>
            </TabsContent>
          </Tabs>
        );
      case 'data-list':
        return (
          <div className="vx-preview-list">
            <div className="vx-preview-list__row vx-preview-list__row--header">
              <span>{t.dataList.name}</span>
              <span>{t.dataList.kind}</span>
              <span>{t.dataList.updated}</span>
            </div>
            {dataListRows.map((row) => (
              <div key={row.name} className="vx-preview-list__row">
                <span>{row.name}</span>
                <span>{row.kind}</span>
                <span>{row.updated}</span>
              </div>
            ))}
          </div>
        );
      case 'empty-states':
        return (
          <div className="vx-empty-state">
            <div className="vx-empty-state__icon">
              <FileX2 size={20} />
            </div>
            <div className="vx-empty-state__title">No components found</div>
            <div className="vx-empty-state__copy">
              Create the first example or switch to another category to keep building the documentation surface.
            </div>
            <Button>Create example</Button>
          </div>
        );
      case 'form-inputs':
        return (
          <div className="vx-stack">
            <Select label="Framework" placeholder="Pick a framework…">
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
            </Select>
            <div className="vx-inline vx-inline--wrap">
              <Checkbox label="Accept terms" checked={checkboxA} onChange={e => setCheckboxA(e.target.checked)} />
              <Checkbox label="Subscribe to updates" description="Weekly digest only" checked={checkboxB} onChange={e => setCheckboxB(e.target.checked)} />
            </div>
            <RadioGroup label="Notification preference">
              <Radio name="notif" value="a" label="All alerts" checked={radioVal === 'a'} onChange={() => setRadioVal('a')} />
              <Radio name="notif" value="b" label="Mentions only" description="Only when someone tags you" checked={radioVal === 'b'} onChange={() => setRadioVal('b')} />
              <Radio name="notif" value="c" label="None" checked={radioVal === 'c'} onChange={() => setRadioVal('c')} />
            </RadioGroup>
            <Textarea label="Release notes" placeholder="Describe what changed…" rows={3} />
            <Slider label="Confidence score" showValue min={0} max={100} value={sliderVal}
              onChange={e => setSliderVal(Number(e.target.value))} />
          </div>
        );
      case 'feedback':
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <Progress label="Uploading bundle" showLabel value={68} />
            <Progress label="Processing" indeterminate />
            <Alert variant="info" title="New version available">
              vxUI 1.1 includes Accordion, Table, and Avatar components.
            </Alert>
            <Alert variant="success" title="Build complete" onClose={() => {}} />
            <Alert variant="warning" title="Deprecation notice">The old color token names will be removed in v2.</Alert>
            <Alert variant="danger" title="Deploy failed">Build step exited with code 1.</Alert>
            <div className="vx-stack vx-stack--tight">
              <Skeleton variant="text" lines={3} />
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
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center', gap: '1rem' }}>
              <Tooltip content="Primary action" placement="top">
                <Button size="sm">Hover me (top)</Button>
              </Tooltip>
              <Tooltip content="Right tooltip" placement="right">
                <Button size="sm" variant="secondary">Right</Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" placement="bottom">
                <Button size="sm" variant="ghost">Bottom</Button>
              </Tooltip>
            </div>
            <Separator />
            <Popover
              content={
                <div className="vx-stack vx-stack--tight">
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>Popover content area</p>
                  <Button size="sm">Confirm</Button>
                </div>
              }
            >
              <Button variant="secondary" size="sm">Open popover</Button>
            </Popover>
            <Separator />
            <DropdownMenu
              trigger={<Button variant="secondary" size="sm">Actions ▾</Button>}
              groups={[
                {
                  items: [
                    { label: 'Edit', shortcut: '⌘E', onClick: () => {} },
                    { label: 'Duplicate', onClick: () => {} },
                  ],
                },
                {
                  items: [
                    { label: 'Archive', onClick: () => {} },
                    { label: 'Delete', danger: true, onClick: () => {} },
                  ],
                },
              ]}
            />
          </div>
        );
      case 'nav-layout':
        return (
          <div className="vx-stack">
            <Breadcrumb
              items={[
                { label: 'Home', onClick: () => {} },
                { label: 'Components', onClick: () => {} },
                { label: 'Navigation & Layout' },
              ]}
            />
            <Separator />
            <Pagination page={paginationPage} total={120} pageSize={10} onChange={setPaginationPage} />
            <Separator />
            <Accordion
              items={[
                { key: 'a', title: 'What is vxUI?', content: 'A lightweight React component library built on CSS custom properties.' },
                { key: 'b', title: 'Does it support dark mode?', content: 'Yes — all color tokens are semantic. Switching themes changes every component at once.' },
                { key: 'c', title: 'Can I add custom themes?', content: 'Use createTheme() to register any number of named themes.', },
              ]}
            />
          </div>
        );
      case 'data-display':
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center', gap: '0.75rem' }}>
              <Avatar size="xs" name="Alice Wang" />
              <Avatar size="sm" name="Bob Zhang" />
              <Avatar size="md" name="Carol Liu" />
              <Avatar size="lg" name="David Chen" />
              <Avatar size="xl" shape="square" name="Eve Kim" />
              <Avatar size="md" />
            </div>
            <Separator />
            <Table
              striped
              columns={[
                { key: 'name', header: 'Name', accessor: r => r.name, sortable: true },
                { key: 'role', header: 'Role', accessor: r => r.role },
                { key: 'status', header: 'Status', accessor: r => <Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge> },
              ]}
              data={[
                { name: 'Alice Wang', role: 'Engineer', status: 'Active' },
                { name: 'Bob Zhang', role: 'Designer', status: 'Away' },
                { name: 'Carol Liu', role: 'PM', status: 'Active' },
              ]}
            />
          </div>
        );
      case 'toasts':
        return (
          <div className="vx-inline vx-inline--wrap">
            <Button
              onClick={() =>
                push({
                  tone: 'info',
                  title: 'Docs synced',
                  description: 'The showcase index is now aligned with the latest component exports.',
                })
              }
            >
              Info toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                push({
                  tone: 'success',
                  title: 'Build complete',
                  description: 'The style token bundle compiled successfully.',
                })
              }
            >
              Success toast
            </Button>
          </div>
        );
      case 'mobile':
        return (
          <div className="vxm-phone-frame">
            <MobileShell
              topBar={
                <MobileTopBar
                  title="Messages"
                  leading={
                    <MobileIconButton label="Back">
                      <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                    </MobileIconButton>
                  }
                  trailing={
                    <MobileIconButton label="Share" onClick={() => setActionSheetOpen(true)}>
                      <Share2 size={18} />
                    </MobileIconButton>
                  }
                />
              }
              bottomNav={
                <BottomNav
                  items={[
                    { key: 'home', label: 'Home', icon: <House size={20} />, active: mobileTab === 'home', onSelect: () => setMobileTab('home') },
                    { key: 'search', label: 'Search', icon: <Search size={20} />, active: mobileTab === 'search', onSelect: () => setMobileTab('search') },
                    { key: 'alerts', label: 'Alerts', icon: <Bell size={20} />, badge: 3, active: mobileTab === 'alerts', onSelect: () => setMobileTab('alerts') },
                    { key: 'profile', label: 'Profile', icon: <User size={20} />, active: mobileTab === 'profile', onSelect: () => setMobileTab('profile') },
                  ]}
                />
              }
            >
              <MobileListSection title="Recent">
                <MobileList>
                  <MobileListItem leading={<Bell size={18} />} label="Deployment complete" description="vxui-react v1.0 shipped" chevron onClick={() => {}} />
                  <MobileListItem leading={<Package2 size={18} />} label="New component" description="MobileList added" chevron onClick={() => {}} />
                  <MobileListItem leading={<Zap size={18} />} label="Build passed" description="All 12 checks passed" trailing={<Badge variant="success">OK</Badge>} onClick={() => {}} />
                  <MobileListItem leading={<Trash2 size={18} />} label="Delete workspace" destructive chevron onClick={() => {}} />
                  <MobileListItem leading={<User size={18} />} label="Offline user" description="Cannot sync" disabled />
                </MobileList>
              </MobileListSection>
            </MobileShell>
            <ActionSheet
              open={actionSheetOpen}
              onClose={() => setActionSheetOpen(false)}
              title="Share"
              description="Choose how to share this item."
            >
              <ActionSheetItem icon={<Download size={18} />} onClick={() => setActionSheetOpen(false)}>Download</ActionSheetItem>
              <ActionSheetItem icon={<Share2 size={18} />} onClick={() => setActionSheetOpen(false)}>Copy link</ActionSheetItem>
              <ActionSheetItem icon={<Trash2 size={18} />} destructive onClick={() => setActionSheetOpen(false)}>Delete</ActionSheetItem>
            </ActionSheet>
          </div>
        );
      case 'home-page':
        return (
          <div className="vx-stack">
            <div style={{ textAlign: 'center', padding: '20px 16px' }}>
              <Badge variant="accent" style={{ marginBottom: 10 }}>New release</Badge>
              <h2 style={{ fontSize: '1.375rem', margin: '0 0 8px' }}>Build faster with vxUI</h2>
              <p className="vx-muted" style={{ marginBottom: 16, fontSize: '0.9rem' }}>
                A lightweight component system for modern admin interfaces.
              </p>
              <div className="vx-inline" style={{ justifyContent: 'center' }}>
                <Button onClick={() => selectPage('quick-start')}>
                  <Zap size={14} />
                  Get started
                </Button>
                <Button variant="secondary" onClick={() => selectPage('elements')}>Browse components</Button>
              </div>
            </div>
            <div className="vx-docs-component-grid">
              <Card>
                <CardHeader>
                  <CardTitle><Zap size={14} style={{ display: 'inline', marginRight: 6 }} />Fast</CardTitle>
                  <CardDescription>Zero-dependency runtime, no build pipeline required.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Palette size={14} style={{ display: 'inline', marginRight: 6 }} />Themeable</CardTitle>
                  <CardDescription>Swap the whole system with a single theme key.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><ShieldCheck size={14} style={{ display: 'inline', marginRight: 6 }} />Accessible</CardTitle>
                  <CardDescription>WCAG-aware tokens and semantic markup throughout.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        );
      case 'login-page':
        return (
          <div style={{ maxWidth: 340, margin: '0 auto' }}>
            <Card>
              <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-stack">
                  <Input label="Email" type="email" placeholder="you@example.com" />
                  <Input label="Password" type="password" placeholder="••••••••" />
                  <Button style={{ width: '100%' }}>
                    <LogIn size={14} />
                    Sign in
                  </Button>
                  <p className="vx-muted" style={{ textAlign: 'center', fontSize: '0.8125rem', margin: 0 }}>
                    Don't have an account?{' '}
                    <button type="button" className="vx-link" onClick={() => selectPage('register-page')}>
                      Register
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'register-page':
        return (
          <div style={{ maxWidth: 340, margin: '0 auto' }}>
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
                  <Checkbox
                    label="I agree to the terms of service"
                    checked={checkboxA}
                    onChange={(e) => setCheckboxA(e.target.checked)}
                  />
                  <Button style={{ width: '100%' }}>
                    <UserPlus size={14} />
                    Create account
                  </Button>
                  <p className="vx-muted" style={{ textAlign: 'center', fontSize: '0.8125rem', margin: 0 }}>
                    Already have an account?{' '}
                    <button type="button" className="vx-link" onClick={() => selectPage('login-page')}>
                      Sign in
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'error-page':
        return (
          <div className="vx-empty-state">
            <div className="vx-empty-state__icon">
              <AlertTriangle size={22} />
            </div>
            <div className="vx-empty-state__title">404 — Page not found</div>
            <div className="vx-empty-state__copy">
              The page you're looking for doesn't exist or has been moved to a new location.
            </div>
            <div className="vx-inline">
              <Button onClick={() => selectPage('introduction')}>
                <House size={14} />
                Go home
              </Button>
              <Button variant="secondary">Go back</Button>
            </div>
          </div>
        );
      case 'privacy-policy':
        return (
          <div className="vx-stack">
            <div>
              <p className="vx-muted" style={{ fontSize: '0.8125rem', margin: '0 0 8px' }}>
                Last updated: May 2026 · v1.0
              </p>
              <h3 style={{ margin: '0 0 6px', fontSize: '1rem' }}>Data Collection</h3>
              <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                We collect only the information necessary to provide the service, including your email address and usage data.
              </p>
            </div>
            <Separator />
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1rem' }}>Data Usage</h3>
              <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                Your data is used solely to improve your experience and is never sold to third parties.
              </p>
            </div>
            <Separator />
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1rem' }}>Cookies</h3>
              <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                We use essential cookies for authentication and preference storage. No tracking or advertising cookies are used.
              </p>
            </div>
            <Separator />
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1rem' }}>Contact</h3>
              <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                For privacy inquiries, contact <span style={{ color: 'var(--vx-primary)' }}>privacy@example.com</span>
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderIntroduction = () => (
    <>
      <section className="vx-docs-hero">
        <h1>vxUI</h1>
        <p>
          {t.intro.tagline}
        </p>
        <div className="vx-docs-actions">
          <Button onClick={() => selectPage('quick-start')}>
            <Zap size={16} />
            {t.intro.getStarted}
          </Button>
          <Button variant="secondary" onClick={() => selectPage('elements')}>
            {t.intro.browseComponents}
          </Button>
        </div>
      </section>

      <section className="vx-docs-section">
        <h2>{t.intro.atAGlance}</h2>
        <div className="vx-docs-stats">
          {glanceCards.map((card) => (
            <Card key={card.label} className="vx-doc-stat">
              <div className="vx-doc-stat__copy">
                <div className="vx-doc-stat__label">{card.label}</div>
                <div className="vx-doc-stat__value">{card.value}</div>
                <div className="vx-doc-stat__hint">{card.hint}</div>
              </div>
              <div className="vx-doc-stat__icon">{card.icon}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="vx-docs-section">
        <h2>{t.intro.designTokens}</h2>
        <p className="vx-docs-lead">
          {t.intro.designTokensLead}
        </p>
        <div className="vx-docs-token-grid">
          {tokenCards.map((token) => {
            const tokenValue = tokenValues[token.variable] ?? token.value;

            return (
              <Card key={token.variable} className="vx-doc-token-card">
                <div
                  className="vx-doc-token-card__swatch"
                  style={{ background: tokenValue }}
                  aria-hidden="true"
                />
                <div className="vx-doc-token-card__row">
                  <div>
                    <div className="vx-doc-token-card__name">{token.name}</div>
                    <div className="vx-doc-token-card__var">{token.variable}</div>
                  </div>
                  <span className="vx-version-pill vx-version-pill--token">{tokenValue}</span>
                </div>
                <div className="vx-doc-token-card__description">{token.description}</div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="vx-docs-section">
        <h2>{t.intro.componentFamilies}</h2>
        <div className="vx-docs-component-grid">
          {componentFamilies.map((family) => (
            <Card key={family.title} className="vx-doc-family-card">
              <CardHeader>
                <CardTitle>{family.title}</CardTitle>
                <CardDescription>{family.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" onClick={() => selectPage(family.page)}>
                  {t.docs.openSection}
                  <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );

  const renderGuidePage = () => (
    <article className="vx-docs-article">
      <div className="vx-docs-kicker">{activeDocument.section}</div>
      <h1>{activeDocument.title}</h1>
      <p className="vx-docs-lead">{activeDocument.description}</p>
      <div className="vx-docs-article-grid">
        <Card>
          <CardHeader>
            <CardTitle>{t.docs.guidance}</CardTitle>
            <CardDescription>
              {t.docs.guidanceDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="vx-docs-guidance">
              {activeDocument.guidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.docs.preview}</CardTitle>
            <CardDescription>
              {t.docs.previewDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderPageSample()}</CardContent>
        </Card>
      </div>
      <section className="vx-docs-section">
        <h2>{t.docs.notes}</h2>
        <div className="vx-docs-token-grid">
          <Card>
            <CardHeader>
              <CardTitle>{t.docs.primaryTheme}</CardTitle>
              <CardDescription>
                {t.docs.primaryThemeDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-inline vx-inline--wrap">
                <Badge variant="accent">Core</Badge>
                <Badge variant="success">Accessible</Badge>
                <Badge variant="warning">Documented</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t.docs.tokenScale}</CardTitle>
              <CardDescription>
                {t.docs.tokenScaleDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-inline vx-inline--wrap">
                <span className="vx-version-pill vx-version-pill--token">--vx-bg</span>
                <span className="vx-version-pill vx-version-pill--token">--vx-surface</span>
                <span className="vx-version-pill vx-version-pill--token">--vx-border</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </article>
  );

  if (appView === 'home') {
    return (
      <HomePage
        onLogin={() => setAppView('login')}
        onRegister={() => setAppView('register')}
        onDocs={() => setAppView('docs')}
        onPrivacy={() => setAppView('privacy-policy')}
      />
    );
  }

  if (appView === 'login') {
    return (
      <LoginPage
        onLogin={() => setAppView('docs')}
        onRegister={() => setAppView('register')}
        onGuest={() => setAppView('docs')}
        onBack={() => setAppView('home')}
      />
    );
  }

  if (appView === 'register') {
    return (
      <RegisterPage
        onRegister={() => setAppView('docs')}
        onLogin={() => setAppView('login')}
        onGuest={() => setAppView('docs')}
        onPrivacy={() => setAppView('privacy-policy')}
        onTerms={() => setAppView('terms-of-service')}
        onBack={() => setAppView('home')}
      />
    );
  }

  if (appView === 'privacy-policy') {
    return <PrivacyPolicyPage onBack={() => setAppView('home')} />;
  }

  if (appView === 'terms-of-service') {
    return <TermsOfServicePage onBack={() => setAppView('home')} />;
  }

  return (
    <>
      {mobilePreview && <MobilePreviewPage onExit={() => setMobilePreview(false)} />}
      <CommandPalette
        entries={searchEntries}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(key) => { selectPage(key as PageKey); }}
        placeholder={t.searchPlaceholder}
        ariaLabel={t.searchAriaLabel}
        emptyText={t.searchEmpty}
        labelNavigate={t.searchNavigate}
        labelGo={t.searchGo}
        labelClose={t.searchClose}
      />
      <AppShell
      brand="vxUI"
      breadcrumb={(
        <div className="vx-topbar__breadcrumb">
          <span>VXUI</span>
          <span className="vx-topbar__separator">/</span>
          <strong>{activeDocument.title}</strong>
        </div>
      )}
      navSections={navSections}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed((value) => !value)}
      sidebarFooter={<LanguageSwitcher variant="sidebar" />}
      headerActions={(
        <div className="vx-inline vx-inline--wrap">
          <button type="button" className="vx-cmd-trigger" onClick={() => setAppView('home')}>
            <House size={14} />
            {t.publicPages.backHome}
          </button>
          <button type="button" className="vx-cmd-trigger" onClick={() => setSearchOpen(true)}>
            <Search size={14} />
            {t.searchTrigger}
            <kbd>⌘K</kbd>
          </button>
          <LanguageSwitcher variant="inline" />
          <span className="vx-version-pill">v1.0</span>
          <span className="vx-version-pill vx-version-pill--token">
            <Palette size={14} />
            {themes[theme]?.label ?? theme}
          </span>
          <span className="vx-version-pill vx-version-pill--token">
            <MoonStar size={14} />
            {t.modeLabel(mode)}
          </span>
          <button type="button" className="vx-cmd-trigger" onClick={() => setMobilePreview(true)}>
            <Smartphone size={14} />
            {t.mobilePreview}
          </button>
        </div>
      )}
    >
      <div className="vx-page">
        {activePage === 'introduction' ? renderIntroduction() : renderGuidePage()}

        <section className="vx-docs-section">
          <h2>{t.docs.systemPreview}</h2>
          <div className="vx-docs-component-grid">
            <Card>
              <CardHeader>
                <CardTitle>{t.docs.themeStudio}</CardTitle>
                <CardDescription>
                  {t.docs.themeStudioDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-stack vx-stack--tight">
                  <div className="vx-inline vx-inline--wrap">
                    {themeEntries.map(([themeName, definition]) => (
                      <Button
                        key={themeName}
                        size="sm"
                        variant={theme === themeName ? 'solid' : 'secondary'}
                        onClick={() => setTheme(themeName)}
                      >
                        {definition.label ?? themeName}
                      </Button>
                    ))}
                  </div>
                  <div className="vx-inline vx-inline--wrap">
                    <span className="vx-version-pill vx-version-pill--token">
                      <Palette size={14} />
                      {themes[theme]?.label ?? theme}
                    </span>
                    <span className="vx-version-pill vx-version-pill--token">
                      <Sparkles size={14} />
                      {t.modeLabel(mode)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.docs.liveControls}</CardTitle>
                <CardDescription>
                  {t.docs.liveControlsDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-stack vx-stack--tight">
                  <Input label={t.docs.searchDocs} placeholder={t.docs.searchDocsPlaceholder} />
                  <Switch
                    checked={compactDensity}
                    onCheckedChange={setCompactDensity}
                    label={t.docs.compactDensity}
                    description={t.docs.compactDensityDesc}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
    </>
  );
}
