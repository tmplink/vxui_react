import { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileCode2,
  FileText,
  FileX2,
  House,
  LayoutDashboard,
  List,
  LogIn,
  Menu,
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
  Globe,
  X,
} from 'lucide-react';
import { MobileShell, MobileTopBar, MobileIconButton } from './MobileShell';
import { BottomNav } from './BottomNav';
import { ActionSheet, ActionSheetItem } from './ActionSheet';
import { MobileList, MobileListSection, MobileListItem } from './MobileList';
import { MobileDrawer, DrawerNavItem, DrawerNavSection } from './MobileDrawer';
import { useI18n } from '../../i18n';
import { getPrivacyPolicyContent, getTermsOfServiceContent } from '../pages/legalPageContent';
import { getPublicHomeContent } from '../pages/homePageContent';
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
  LanguageSwitcher,
  MultiSelect,
  TimePicker,
  SegmentedControl,
  Dialog,
  AlertDialog,
  DatePicker,
  NumberInput,
  TagInput,
  FileUpload,
  Rating,
  Toggle,
  ToggleGroup,
  Stepper,
  Timeline,
  EmptyState,
  Sheet,
  ColorPicker,
  Carousel,
  TreeView,
  ScrollArea,
  HoverCard,
  ContextMenu,
  NavigationMenu,
  Menubar,
} from '../../lib';

// ─── Types ────────────────────────────────────────────────────────────────────

type MobileView = 'home' | 'docs' | 'login' | 'register' | 'privacy-policy' | 'terms-of-service';
type BottomTab = 'home' | 'docs' | 'search';

type PageKey =
  | 'introduction'
  | 'quick-start'
  | 'shell-sidebar'
  | 'grid-page'
  | 'button'
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
  | 'privacy-policy'
  | 'terms-of-service'
  | 'command-palette'
  | 'code-block'
  | 'language-switcher';

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

// ─── SearchBox ──────────────────────────────────────────────────────────────

interface SearchBoxProps {
  value: string;
  onChange?: (v: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
}

function SearchBox({ value, onChange, onFocus, placeholder, ariaLabel, inputRef, className, style }: SearchBoxProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        ...style,
      }}
    >
      <Search size={16} style={{ color: 'var(--vx-text-muted)', flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        onFocus={onFocus}
        readOnly={!onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontSize: 15,
          color: 'var(--vx-text)',
          minWidth: 0,
          cursor: onChange ? 'text' : 'pointer',
        }}
      />
      {value && onChange && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--vx-text-muted)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileApp() {
  const { t, locale, setLocale } = useI18n();
  const { push } = useToast();
  const { themes } = useTheme();
  const pp = t.publicPages;

  const pages = t.pageDefs as Record<PageKey, PageDefinition>;
  const { features, previewSections, metaItems } = getPublicHomeContent(t);
  const privacyContent = getPrivacyPolicyContent(locale);
  const termsContent = getTermsOfServiceContent(locale);

  // ── routing state ──────────────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<MobileView>(getMobileView);
  const [activePage, setActivePage] = useState<PageKey>(getMobilePage);
  const [activeTab, setActiveTab] = useState<BottomTab>(getMobileTab);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const docHeaderRef = useRef<HTMLDivElement | null>(null);
  const [isDocHeaderInView, setIsDocHeaderInView] = useState(true);

  // ── component preview state ────────────────────────────────────────────────
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [checkboxA, setCheckboxA] = useState(false);
  const [checkboxB, setCheckboxB] = useState(true);
  const [radioVal, setRadioVal] = useState('b');
  const [sliderVal, setSliderVal] = useState(42);
  const [paginationPage, setPaginationPage] = useState(1);
  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'alerts' | 'profile'>('home');
  const [selectVal, setSelectVal] = useState<string | undefined>(undefined);
  const [multiSelectVal, setMultiSelectVal] = useState<string[]>([]);
  const [timeVal, setTimeVal] = useState('');
  const [releaseTrackVal, setReleaseTrackVal] = useState<string | undefined>(undefined);
  const [dateVal, setDateVal] = useState<Date | undefined>();
  const [numVal, setNumVal] = useState(1);
  const [tagVal, setTagVal] = useState<string[]>(['react', 'vxui']);
  const [colorVal, setColorVal] = useState('#3b82f6');
  const [ratingVal, setRatingVal] = useState(3);
  const [toggleGroupVal, setToggleGroupVal] = useState<string | string[]>('list');
  const [stepperStep, setStepperStep] = useState(1);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [treeSelected, setTreeSelected] = useState('');

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

  useEffect(() => {
    if (mobileView !== 'docs') {
      setIsDocHeaderInView(true);
      return;
    }

    setIsDocHeaderInView(true);
  }, [mobileView, activePage]);

  // Auto-focus search input when switching to the search tab
  useEffect(() => {
    if (activeTab === 'search') {
      const id = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(id);
    }
  }, [activeTab]);

  useEffect(() => {
    if (mobileView !== 'docs') {
      return;
    }

    const target = docHeaderRef.current;

    if (!target || typeof IntersectionObserver === 'undefined') {
      setIsDocHeaderInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDocHeaderInView(entry.isIntersecting);
      },
      {
        rootMargin: '-56px 0px 0px 0px',
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [mobileView, activePage]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const selectPage = (page: PageKey) => {
    setActivePage(page);
    setMobileView('docs');
    setActiveTab('docs');
    setDrawerOpen(false);
  };

  const openLegalPage = (view: Extract<MobileView, 'privacy-policy' | 'terms-of-service'>) => {
    setMobileView(view);
    setActiveTab('home');
    setDrawerOpen(false);
  };

  const selectTab = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === 'home') setMobileView('home');
    else if (tab === 'docs') setMobileView('docs');
  };

  const activeDocument = pages[activePage];
  const docsTopBarFallback = locale === 'zh' ? '文档' : 'Docs';

  // ── nav sections for drawer ────────────────────────────────────────────────
  const navSections = [
    {
      title: t.nav.gettingStarted,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'introduction', label: t.pages.introduction, icon: <House size={16} /> },
        { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} /> },
      ],
    },
    {
      title: t.nav.layout,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} /> },
        { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: t.nav.components,
      collapsible: true,
      defaultOpen: false,
      items: [
        { key: 'button', label: t.pages.button, icon: <Sparkles size={16} /> },
        { key: 'elements', label: t.pages.elements, icon: <Package2 size={16} /> },
        { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} /> },
        { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} /> },
        { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} /> },
        { key: 'data-display', label: t.pages['data-display'], icon: <List size={16} /> },
        { key: 'navigation', label: t.pages.navigation, icon: <Compass size={16} /> },
        { key: 'data-list', label: t.pages['data-list'], icon: <List size={16} /> },
        { key: 'empty-states', label: t.pages['empty-states'], icon: <FileX2 size={16} /> },
        { key: 'command-palette', label: t.pages['command-palette'], icon: <Search size={16} /> },
        { key: 'code-block', label: t.pages['code-block'], icon: <FileCode2 size={16} /> },
        { key: 'language-switcher', label: t.pages['language-switcher'], icon: <Globe size={16} /> },
      ],
    },
    {
      title: t.nav.feedback,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'toasts', label: t.pages.toasts, icon: <Bell size={16} /> },
        { key: 'feedback', label: t.pages.feedback, icon: <Bell size={16} /> },
      ],
    },
    {
      title: t.nav.navigation,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'nav-layout', label: t.pages['nav-layout'], icon: <Compass size={16} /> },
      ],
    },
    {
      title: t.nav.mobile,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} /> },
      ],
    },
    {
      title: t.nav.templates,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'home-page', label: t.pages['home-page'], icon: <House size={16} /> },
        { key: 'login-page', label: t.pages['login-page'], icon: <LogIn size={16} /> },
        { key: 'register-page', label: t.pages['register-page'], icon: <UserPlus size={16} /> },
        { key: 'error-page', label: t.pages['error-page'], icon: <AlertTriangle size={16} /> },
        { key: 'privacy-policy', label: t.pages['privacy-policy'], icon: <ShieldCheck size={16} /> },
        { key: 'terms-of-service', label: t.pages['terms-of-service'], icon: <FileText size={16} /> },
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
      case 'button':
        return (
          <div className="vx-stack vx-stack--tight">
            <div className="vx-inline vx-inline--wrap">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="vx-inline vx-inline--wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        );
      case 'form-controls':
        return (
          <div className="vx-stack">
            <Input label="Project name" placeholder="vxui-docs" />
            <Select
              label="Release track"
              value={releaseTrackVal}
              onChange={setReleaseTrackVal}
              placeholder="Pick a track…"
              options={[
                { value: 'stable', label: 'Stable' },
                { value: 'preview', label: 'Preview' },
                { value: 'internal', label: 'Internal' },
              ]}
            />
            <Select
              label="Environment"
              value={selectVal}
              onChange={setSelectVal}
              clearable
              searchable={4}
              placeholder="Select environment…"
              searchPlaceholder="Search environments…"
              options={[
                { value: 'prod', label: 'Production' },
                { value: 'staging', label: 'Staging' },
                { value: 'preview', label: 'Preview' },
                { value: 'dev', label: 'Development' },
              ]}
            />
            <MultiSelect
              label="Tech stack"
              value={multiSelectVal}
              onChange={setMultiSelectVal}
              clearable
              options={[
                { value: 'react', label: 'React' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'vite', label: 'Vite' },
                { value: 'css', label: 'CSS' },
              ]}
            />
            <TimePicker
              label="Deploy time"
              value={timeVal}
              onChange={setTimeVal}
              placeholder="Select time"
            />
            <DatePicker
              label="Release date"
              value={dateVal}
              onChange={setDateVal}
              placeholder="Pick a date"
            />
            <Select
              label="Approval lane"
              hint="Single-select uses the same custom overlay behavior across mobile and desktop."
              defaultValue="review"
              options={[
                { value: 'review', label: 'Review' },
                { value: 'staged', label: 'Staged rollout' },
                { value: 'urgent', label: 'Urgent hotfix' },
              ]}
            />
            <NumberInput label="Quantity" value={numVal} onChange={setNumVal} min={0} max={99} />
            <TagInput label="Labels" value={tagVal} onChange={setTagVal} placeholder="Add label…" />
            <FileUpload label="Attachments" multiple />
            <ColorPicker label="Brand color" value={colorVal} onChange={setColorVal} />
            <Textarea label="Change summary" placeholder="Describe what changed…" resize="none" rows={3} />
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
            <div className="vx-stack vx-stack--tight">
              <Checkbox label="Accept terms" checked={checkboxA} onChange={e => setCheckboxA(e.target.checked)} />
              <Checkbox label="Subscribe" description="Weekly digest only" checked={checkboxB} onChange={e => setCheckboxB(e.target.checked)} />
            </div>
            <RadioGroup label="Notifications">
              <Radio name="mn" value="a" label="All alerts" checked={radioVal === 'a'} onChange={() => setRadioVal('a')} />
              <Radio name="mn" value="b" label="Mentions only" checked={radioVal === 'b'} onChange={() => setRadioVal('b')} />
              <Radio name="mn" value="c" label="None" checked={radioVal === 'c'} onChange={() => setRadioVal('c')} />
            </RadioGroup>
            <SegmentedControl
              value={radioVal}
              onChange={setRadioVal}
              fullWidth
              options={[
                { label: 'All', value: 'a' },
                { label: 'Mentions', value: 'b' },
                { label: 'None', value: 'c' },
              ]}
            />
            <Slider label="Score" showValue min={0} max={100} value={sliderVal} onChange={e => setSliderVal(Number(e.target.value))} />
            <Switch label="Push notifications" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            <Rating label="Satisfaction" value={ratingVal} onChange={setRatingVal} />
            <div className="vx-stack vx-stack--tight">
              <span style={{ fontSize: '0.875rem', color: 'var(--vx-text-secondary)' }}>View</span>
              <ToggleGroup
                items={[
                  { value: 'grid', label: 'Grid' },
                  { value: 'list', label: 'List' },
                  { value: 'table', label: 'Table' },
                ]}
                value={toggleGroupVal}
                onValueChange={v => setToggleGroupVal(v)}
              />
            </div>
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
            <Separator />
            <Dialog
              trigger={<Button variant="secondary" size="sm">Open Dialog</Button>}
              title="Delete project"
              description="This action removes access for the whole team."
              footer={<><Button variant="ghost">Cancel</Button><Button variant="danger">Delete</Button></>}
            >
              <p style={{ fontSize: '0.875rem', color: 'var(--vx-text-secondary)', margin: 0 }}>This project will be permanently removed.</p>
            </Dialog>
            <Dialog
              fullscreen
              trigger={<Button variant="secondary" size="sm">Fullscreen Dialog</Button>}
              title="Fullscreen Mode"
              description="Ideal for mobile devices"
              footer={<Button variant="ghost">Close</Button>}
            >
              <div style={{ fontSize: '0.875rem', color: 'var(--vx-text-secondary)', lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}>This dialog opens in fullscreen mode, occupying the entire viewport.</p>
                <p style={{ marginTop: 12 }}>Perfect for mobile devices where screen space is limited.</p>
                <div style={{ marginTop: 16, padding: 12, background: 'var(--vx-bg-accent)', borderRadius: 'var(--vx-radius)', fontSize: '0.8rem' }}>
                  <strong>Viewport:</strong> {window.innerWidth} × {window.innerHeight}
                </div>
              </div>
            </Dialog>
            <AlertDialog
              trigger={<Button variant="danger" size="sm">Delete account</Button>}
              title="Delete your account?"
              description="This action cannot be undone. All your data will be permanently removed."
              confirmLabel="Yes, delete"
              cancelLabel="Cancel"
              variant="danger"
            />
            <Sheet
              trigger={<Button variant="secondary" size="sm">Open Sheet</Button>}
              title="Notifications"
              description="Manage your notification preferences."
              side="bottom"
            >
              <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--vx-text-secondary)' }}>Sheet content goes here.</p>
            </Sheet>
            <HoverCard
              content={<div style={{ fontSize: '0.875rem', padding: '4px 0' }}>Detailed info on hover / focus</div>}
            >
              <Button variant="ghost" size="sm">HoverCard ↗</Button>
            </HoverCard>
            <ContextMenu
              items={[
                { label: 'Copy', onClick: () => {} },
                { label: 'Paste', onClick: () => {} },
                { label: 'Delete', danger: true, onClick: () => {} },
              ]}
            >
              <div style={{ padding: '12px', border: '1px dashed var(--vx-border)', borderRadius: 'var(--vx-radius)', fontSize: '0.875rem', color: 'var(--vx-text-secondary)', textAlign: 'center' }}>
                Right-click / long-press
              </div>
            </ContextMenu>
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
            <Separator />
            <NavigationMenu
              items={[
                { label: 'Docs', items: [
                  { label: 'Introduction', description: 'Get started', onClick: () => selectPage('introduction') },
                  { label: 'Quick Start', description: 'Install & use', onClick: () => selectPage('quick-start') },
                ]},
                { label: 'Components', items: [
                  { label: 'Button', onClick: () => selectPage('button') },
                  { label: 'Form Controls', onClick: () => selectPage('form-controls') },
                ]},
                { label: 'Mobile', onClick: () => selectPage('mobile'), active: activePage === 'mobile' },
              ]}
            />
            <Separator />
            <Menubar
              menus={[
                { label: 'File', items: [
                  { label: 'New', shortcut: '⌘N', onClick: () => {} },
                  { label: 'Open', shortcut: '⌘O', onClick: () => {} },
                  { label: 'Save', shortcut: '⌘S', onClick: () => {} },
                ]},
                { label: 'Edit', items: [
                  { label: 'Undo', shortcut: '⌘Z', onClick: () => {} },
                  { label: 'Redo', shortcut: '⌘⇧Z', onClick: () => {} },
                  { label: 'Delete', danger: true, onClick: () => {} },
                ]},
              ]}
            />
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
            <Separator />
            <Stepper
              currentStep={stepperStep}
              steps={[
                { label: 'Account' },
                { label: 'Profile' },
                { label: 'Review' },
              ]}
            />
            <div className="vx-inline" style={{ gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => setStepperStep(Math.max(0, stepperStep - 1))}>Back</Button>
              <Button size="sm" onClick={() => setStepperStep(Math.min(2, stepperStep + 1))}>Next</Button>
            </div>
            <Separator />
            <Timeline items={[
              { title: 'Deployed v1.2', time: '2h ago', status: 'success' },
              { title: 'Build started', time: '2h 5m ago', status: 'info' },
              { title: 'Tests passed', time: '2h 10m ago', status: 'success' },
              { title: 'PR merged', time: 'Yesterday' },
            ]} />
            <Separator />
            <ScrollArea maxHeight={120}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--vx-border)' : 'none', fontSize: '0.875rem' }}>
                  List item {i + 1}
                </div>
              ))}
            </ScrollArea>
            <Separator />
            <Carousel
              items={[
                <div key="1" style={{ height: 100, background: 'var(--vx-surface-raised)', borderRadius: 'var(--vx-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: 'var(--vx-text-secondary)' }}>Slide 1</div>,
                <div key="2" style={{ height: 100, background: 'var(--vx-accent-subtle)', borderRadius: 'var(--vx-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: 'var(--vx-accent)' }}>Slide 2</div>,
                <div key="3" style={{ height: 100, background: 'var(--vx-success-subtle)', borderRadius: 'var(--vx-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: 'var(--vx-success)' }}>Slide 3</div>,
              ]}
              index={carouselIdx}
              onIndexChange={setCarouselIdx}
              showDots
              showArrows
            />
            <Separator />
            <TreeView
              nodes={[
                { id: 'lib', label: 'src/lib', icon: <Package2 size={14} />, children: [
                  { id: 'index', label: 'index.ts', icon: <FileText size={14} /> },
                  { id: 'cx', label: 'cx.ts', icon: <FileText size={14} /> },
                ]},
                { id: 'components', label: 'src/components', icon: <Package2 size={14} />, children: [
                  { id: 'button', label: 'Button.tsx', icon: <FileCode2 size={14} /> },
                  { id: 'input', label: 'Input.tsx', icon: <FileCode2 size={14} /> },
                ]},
              ]}
              selected={treeSelected}
              onSelect={id => setTreeSelected(id)}
              defaultExpanded={['lib', 'components']}
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
            <Alert variant="info" title={locale === 'zh' ? '移动端组件套件' : 'Mobile component suite'}>
              {locale === 'zh'
                ? '5 个专为移动端设计的组件，支持侧边栏折叠分组和底部导航子菜单。'
                : '5 mobile-specific components. Drawer supports collapsible sections; BottomNav supports submenus.'}
            </Alert>
            <MobileList>
              <MobileListItem leading={<Zap size={18} />} label="MobileShell" description="Layout: topBar + main + bottomNav" chevron onClick={() => {}} />
              <MobileListItem leading={<Bell size={18} />} label="BottomNav" description={locale === 'zh' ? '支持子菜单弹出' : 'Supports submenu popups'} chevron onClick={() => {}} />
              <MobileListItem leading={<Package2 size={18} />} label="MobileDrawer" description={locale === 'zh' ? '侧边栏折叠分组' : 'Collapsible nav sections'} chevron onClick={() => {}} />
              <MobileListItem leading={<List size={18} />} label="MobileList" description={locale === 'zh' ? '触控优化列表行' : 'Touch-optimized list rows'} chevron onClick={() => {}} />
              <MobileListItem leading={<Smartphone size={18} />} label="ActionSheet" description={locale === 'zh' ? '底部上拉面板' : 'Bottom sheet for contextual actions'} chevron onClick={() => {}} />
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
      case 'introduction':
        return (
          <div className="vx-stack">
            <Alert variant="info" title="Welcome to vxUI">
              A lightweight React component library. Zero heavy dependencies, themeable, and dark-mode ready.
            </Alert>
            <div className="vx-inline vx-inline--wrap">
              <Badge variant="accent">React</Badge>
              <Badge variant="success">TypeScript</Badge>
              <Badge variant="warning">MIT</Badge>
              <Badge>Zero deps</Badge>
            </div>
          </div>
        );
      case 'shell-sidebar':
        return (
          <div className="vx-stack vx-stack--tight">
            <MobileList>
              <MobileListItem leading={<House size={16} />} label="Introduction" description="Getting started" chevron onClick={() => selectPage('introduction')} />
              <MobileListItem leading={<Zap size={16} />} label="Quick Start" description="Getting started" chevron onClick={() => selectPage('quick-start')} />
              <MobileListItem leading={<Sparkles size={16} />} label="Button" description="Components" chevron onClick={() => selectPage('button')} />
              <MobileListItem leading={<SlidersHorizontal size={16} />} label="Form Controls" description="Components" chevron onClick={() => selectPage('form-controls')} />
            </MobileList>
          </div>
        );
      case 'grid-page':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Components', value: '55+' },
              { label: 'Themes', value: '8' },
              { label: 'Locales', value: '2' },
              { label: 'Zero deps', value: '✓' },
            ].map(m => (
              <Card key={m.label}>
                <CardContent style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--vx-text-muted)', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--vx-text)' }}>{m.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 'data-list':
        return (
          <Table
            columns={[
              { key: 'name', header: 'Screen', accessor: (r: { name: string; status: string; variant: 'success' | 'accent' | 'warning' }) => r.name },
              { key: 'status', header: 'Status', accessor: (r: { name: string; status: string; variant: 'success' | 'accent' | 'warning' }) => <Badge variant={r.variant}>{r.status}</Badge> },
            ]}
            data={[
              { name: 'Home', status: 'Unified', variant: 'success' as const },
              { name: 'Error', status: 'New', variant: 'accent' as const },
              { name: 'Mobile', status: 'Reframed', variant: 'warning' as const },
            ]}
          />
        );
      case 'empty-states':
        return (
          <EmptyState
            icon={<AlertTriangle size={22} />}
            title="Nothing here yet"
            description="Empty states share the same visual language as error pages, with a lighter tone."
            action={<Button variant="secondary" size="sm" onClick={() => selectPage('introduction')}>Get started</Button>}
          />
        );
      case 'terms-of-service':
        return (
          <div className="vx-stack">
            <div>
              <p className="vx-muted" style={{ fontSize: '0.8rem', margin: '0 0 6px' }}>{termsContent.lead}</p>
              {termsContent.sections.slice(0, 1).map(s => (
                <div key={s.title}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{s.title}</h3>
                  <p className="vx-muted" style={{ margin: 0, fontSize: '0.875rem' }}>{s.paragraphs[0]}</p>
                </div>
              ))}
            </div>
            <Separator />
            <Button variant="secondary" size="sm" onClick={() => openLegalPage('terms-of-service')}>
              Read full terms
            </Button>
          </div>
        );
      case 'command-palette':
        return (
          <div className="vx-stack">
            <Alert variant="info" title="Keyboard first">
              Press ⌘K (Mac) or Ctrl+K (Windows) to open the command palette from anywhere without reaching for the mouse.
            </Alert>
          </div>
        );
      case 'code-block':
        return (
          <pre className="vx-docs-code" style={{ fontSize: 11, overflowX: 'auto' }}>
            {`import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>Click me</Button>;\n}`}
          </pre>
        );
      case 'language-switcher':
        return (
          <div className="vx-stack">
            <div className="vx-inline">
              <LanguageSwitcher variant="inline" />
            </div>
            <Alert variant="info" title="Global language switch">
              Switching locale updates all UI copy across the entire docs surface without a page reload.
            </Alert>
          </div>
        );
      default:
        return null;
    }
  };

  // ── renderers ──────────────────────────────────────────────────────────────

  const renderHomeContent = () => (
    <div className="vxm-docs-home">
      <div className="vxm-docs-home__hero">
        <div className="vxm-docs-home__hero-badge">
          <Badge variant="accent">{pp.heroTag}</Badge>
        </div>
        <h1 className="vxm-docs-home__title">{pp.heroTitle}</h1>
        <p className="vxm-docs-home__lead">{pp.heroLead}</p>
        <div className="vxm-docs-home__actions">
          <Button shape="pill" onClick={() => setMobileView('login')} style={{ flex: 1, minHeight: 48 }}>
            <Zap size={16} />
            {pp.heroCta}
          </Button>
          <Button variant="secondary" shape="pill" onClick={() => selectPage('introduction')} style={{ flex: 1, minHeight: 48 }}>
            {pp.heroCtaAlt}
          </Button>
        </div>
      </div>

      <div className="vxm-docs-home__bottom">
        <div className="vxm-docs-home__chips">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.key} className="vxm-docs-home__chip">
                <div className="vxm-docs-home__chip-icon">
                  <Icon size={16} />
                </div>
                <div className="vxm-docs-home__chip-body">
                  <span className="vxm-docs-home__chip-label">{feature.title}</span>
                  <span className="vxm-docs-home__chip-desc">{feature.description}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="vxm-docs-home__footer">
          <span className="vxm-docs-home__footer-copy">{pp.footerCopy}</span>
          <button
            type="button"
            className="vxm-docs-home__footer-link"
            onClick={() => openLegalPage('privacy-policy')}
          >
            {pp.footerPrivacy}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLegalContent = (content: ReturnType<typeof getPrivacyPolicyContent>) => (
    <div className="vxm-legal-page">
      <div className="vxm-legal-page__hero">
        <Badge variant="accent">{content.badgeLabel}</Badge>
        <h1 className="vxm-legal-page__title">{content.title}</h1>
        <p className="vxm-legal-page__lead">{content.lead}</p>
        <div className="vxm-legal-page__meta">
          {content.meta.map((item) => (
            <span key={item} className="vx-version-pill vx-version-pill--token">{item}</span>
          ))}
        </div>
      </div>

      <MobileListSection title={content.summaryTitle}>
        <MobileList className="vxm-legal-page__list">
          {content.summaryItems.map((item) => (
            <MobileListItem
              key={item}
              leading={<span className="vxm-legal-page__summary-icon"><Check size={16} /></span>}
              label={item}
            />
          ))}
        </MobileList>
      </MobileListSection>

      {content.sections.map((section) => (
        <MobileListSection key={section.title} title={section.title}>
          <div className="vxm-legal-page__section-card">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="vxm-legal-page__paragraph">{paragraph}</p>
            ))}
          </div>
        </MobileListSection>
      ))}

      <div className="vxm-legal-page__footer">{pp.footerCopy}</div>
    </div>
  );

  const renderDocContent = () => {
    if (!activeDocument) return null;
    const preview = renderPagePreview();

    return (
      <div className="vxm-docs-page">
        {/* Page header */}
        <div ref={docHeaderRef} className="vxm-docs-page__header">
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

  const renderSearchContent = () => {
    const q = searchQuery.trim().toLowerCase();
    const allItems = navSections.flatMap(s =>
      s.items.map(item => ({ ...item, section: s.title }))
    );
    const filtered = q
      ? allItems.filter(item =>
          item.label.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q)
        )
      : allItems;
    return (
      <div>
        <div style={{ padding: '12px 16px 0' }}>
          <SearchBox
            inputRef={searchInputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.searchPlaceholder}
            ariaLabel={t.searchAriaLabel}
            style={{
              padding: '0 14px',
              height: 44,
              borderRadius: 'var(--vx-radius)',
              background: 'var(--vx-bg-accent)',
            }}
          />
        </div>
        <MobileListSection
          title={q ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'All pages'}
          style={{ padding: '16px 16px 0' }}
        >
          {filtered.length > 0 ? (
            <MobileList>
              {filtered.map(item => (
                <MobileListItem
                  key={item.key}
                  leading={item.icon}
                  label={item.label}
                  description={item.section}
                  chevron
                  onClick={() => { selectPage(item.key as PageKey); setActiveTab('docs'); setSearchQuery(''); }}
                />
              ))}
            </MobileList>
          ) : (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--vx-text-muted)', fontSize: 14 }}>
              No results for "{searchQuery}"
            </div>
          )}
        </MobileListSection>
      </div>
    );
  };

  const renderLoginContent = () => {
    const isZh = t.locale === 'zh';
    return (
      <div className="vxm-auth-screen">
        <div className="vxm-auth-screen__body">
          <div className="vxm-auth-screen__icon">
            <Sparkles size={38} />
          </div>
          <h1 className="vxm-auth-screen__title">{t.publicPages.loginCta}</h1>
          <div className="vxm-auth-screen__fields">
            <div>
              <span className="vxm-auth-screen__label">{t.publicPages.loginEmail}</span>
              <Input type="email" placeholder={t.publicPages.loginEmailPlaceholder} />
            </div>
            <div>
              <span className="vxm-auth-screen__label">{t.publicPages.loginPassword}</span>
              <Input type="password" placeholder={t.publicPages.loginPasswordPlaceholder} />
            </div>
            <p className="vxm-auth-screen__forgot">
              <button type="button" className="vxm-auth-screen__forgot-btn">
                {isZh ? '忘记密码？来这里找回' : 'Forgot password?'}
              </button>
            </p>
          </div>
        </div>
        <div className="vxm-auth-screen__actions">
          <Button
            shape="pill"
            style={{ width: '100%', minHeight: 52, fontSize: '1rem', fontWeight: 600 }}
            onClick={() => { setMobileView('docs'); setActiveTab('docs'); }}
          >
            {t.publicPages.loginCta}
          </Button>
          <p className="vxm-auth-screen__footer-link">
            {t.publicPages.loginNoAccount}{' '}
            <button type="button" onClick={() => setMobileView('register')}>
              {isZh ? '点这里注册' : t.publicPages.loginRegister}
            </button>
          </p>
        </div>
      </div>
    );
  };

  const renderRegisterContent = () => {
    const isZh = t.locale === 'zh';
    return (
      <div className="vxm-auth-screen">
        <div className="vxm-auth-screen__body">
          <div className="vxm-auth-screen__icon">
            <Sparkles size={38} />
          </div>
          <h1 className="vxm-auth-screen__title">{t.publicPages.registerCta}</h1>
          <div className="vxm-auth-screen__fields">
            <div>
              <span className="vxm-auth-screen__label">{t.publicPages.registerName}</span>
              <Input placeholder={t.publicPages.registerNamePlaceholder} />
            </div>
            <div>
              <span className="vxm-auth-screen__label">{t.publicPages.registerEmail}</span>
              <Input type="email" placeholder={t.publicPages.registerEmailPlaceholder} />
            </div>
            <div>
              <span className="vxm-auth-screen__label">{t.publicPages.registerPassword}</span>
              <Input type="password" placeholder={t.publicPages.registerPasswordPlaceholder} />
            </div>
            <Checkbox
              label={`${t.publicPages.registerTermsAgree} ${t.publicPages.registerTermsLink} ${t.publicPages.registerTermsAnd} ${t.publicPages.registerPrivacyLink}`}
              checked={checkboxA}
              onChange={e => setCheckboxA(e.target.checked)}
            />
            <p className="vxm-auth-screen__legal-links">
              <button type="button" onClick={() => openLegalPage('terms-of-service')}>
                {t.publicPages.registerTermsLink}
              </button>
              <span>{t.publicPages.registerTermsAnd}</span>
              <button type="button" onClick={() => openLegalPage('privacy-policy')}>
                {t.publicPages.registerPrivacyLink}
              </button>
            </p>
          </div>
        </div>
        <div className="vxm-auth-screen__actions">
          <Button
            shape="pill"
            style={{ width: '100%', minHeight: 52, fontSize: '1rem', fontWeight: 600 }}
            onClick={() => { setMobileView('docs'); setActiveTab('docs'); }}
          >
            {t.publicPages.registerCta}
          </Button>
          <p className="vxm-auth-screen__footer-link">
            {t.publicPages.registerHasAccount}{' '}
            <button type="button" onClick={() => setMobileView('login')}>
              {isZh ? '点这里登录' : t.publicPages.registerLogin}
            </button>
          </p>
        </div>
      </div>
    );
  };

  // ── top bar ────────────────────────────────────────────────────────────────

  const renderTopBar = () => {
    const isDocsView = activeTab === 'docs' && mobileView === 'docs';
    const isLegalView = mobileView === 'privacy-policy' || mobileView === 'terms-of-service';
    const isSearchView = activeTab === 'search';
    const title = isDocsView
      ? (isDocHeaderInView ? (activeDocument?.section ?? docsTopBarFallback) : (activeDocument?.title ?? docsTopBarFallback))
      : isLegalView
        ? mobileView === 'privacy-policy' ? privacyContent.title : termsContent.title
        : isSearchView
          ? (locale === 'zh' ? '搜索' : 'Search')
          : 'vxUI';

    return (
      <MobileTopBar
        title={title}
        leading={
          isDocsView ? (
            <MobileIconButton label="Open navigation" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} />
            </MobileIconButton>
          ) : isLegalView ? (
            <MobileIconButton label={pp.backHome} onClick={() => { setMobileView('home'); setActiveTab('home'); }}>
              <ChevronLeft size={20} />
            </MobileIconButton>
          ) : undefined
        }
        trailing={
          isDocsView ? (
            <MobileIconButton label="Actions" onClick={() => setActionSheetOpen(true)}>
              <Share2 size={20} />
            </MobileIconButton>
          ) : (
            <MobileIconButton label={locale === 'zh' ? '快捷操作' : 'Quick actions'} onClick={() => setActionSheetOpen(true)}>
              <Menu size={20} />
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
    if (mobileView === 'privacy-policy') return renderLegalContent(privacyContent);
    if (mobileView === 'terms-of-service') return renderLegalContent(termsContent);
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
        <DrawerNavSection
          key={section.title}
          title={section.title}
          collapsible={section.collapsible}
          defaultOpen={section.defaultOpen}
        >
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

  const isAuthView = mobileView === 'login' || mobileView === 'register';
  const isLegalView = mobileView === 'privacy-policy' || mobileView === 'terms-of-service';

  const renderBottomNav = () => (
    <BottomNav
      items={[
        { key: 'home', label: 'Home', icon: <House size={22} />, active: activeTab === 'home' && !isAuthView && !isLegalView, onSelect: () => { selectTab('home'); setMobileView('home'); } },
        {
          key: 'docs',
          label: 'Docs',
          icon: <FileCode2 size={22} />,
          active: activeTab === 'docs' && !isAuthView && !isLegalView,
          submenu: [
            { key: 'introduction', label: t.pages.introduction, icon: <House size={16} />, onSelect: () => { selectPage('introduction'); selectTab('docs'); } },
            { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} />, onSelect: () => { selectPage('quick-start'); selectTab('docs'); } },
            { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} />, onSelect: () => { selectPage('shell-sidebar'); selectTab('docs'); } },
            { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('grid-page'); selectTab('docs'); } },
            { key: 'button', label: t.pages.button, icon: <Sparkles size={16} />, onSelect: () => { selectPage('button'); selectTab('docs'); } },
            { key: 'elements', label: t.pages.elements, icon: <Package2 size={16} />, onSelect: () => { selectPage('elements'); selectTab('docs'); } },
            { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} />, onSelect: () => { selectPage('form-controls'); selectTab('docs'); } },
            { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} />, onSelect: () => { selectPage('form-inputs'); selectTab('docs'); } },
            { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} />, onSelect: () => { selectPage('overlays'); selectTab('docs'); } },
            { key: 'data-display', label: t.pages['data-display'], icon: <List size={16} />, onSelect: () => { selectPage('data-display'); selectTab('docs'); } },
            { key: 'navigation', label: t.pages.navigation, icon: <Compass size={16} />, onSelect: () => { selectPage('navigation'); selectTab('docs'); } },
            { key: 'data-list', label: t.pages['data-list'], icon: <List size={16} />, onSelect: () => { selectPage('data-list'); selectTab('docs'); } },
            { key: 'empty-states', label: t.pages['empty-states'], icon: <FileX2 size={16} />, onSelect: () => { selectPage('empty-states'); selectTab('docs'); } },
            { key: 'command-palette', label: t.pages['command-palette'], icon: <Search size={16} />, onSelect: () => { selectPage('command-palette'); selectTab('docs'); } },
            { key: 'code-block', label: t.pages['code-block'], icon: <FileCode2 size={16} />, onSelect: () => { selectPage('code-block'); selectTab('docs'); } },
            { key: 'language-switcher', label: t.pages['language-switcher'], icon: <Globe size={16} />, onSelect: () => { selectPage('language-switcher'); selectTab('docs'); } },
            { key: 'toasts', label: t.pages.toasts, icon: <Bell size={16} />, onSelect: () => { selectPage('toasts'); selectTab('docs'); } },
            { key: 'feedback', label: t.pages.feedback, icon: <Bell size={16} />, onSelect: () => { selectPage('feedback'); selectTab('docs'); } },
            { key: 'nav-layout', label: t.pages['nav-layout'], icon: <Compass size={16} />, onSelect: () => { selectPage('nav-layout'); selectTab('docs'); } },
            { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} />, onSelect: () => { selectPage('mobile'); selectTab('docs'); } },
          ],
        },
        { key: 'search', label: 'Search', icon: <Search size={22} />, active: activeTab === 'search' && !isAuthView && !isLegalView, onSelect: () => { selectTab('search'); } },
      ]}
    />
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {renderDrawer()}
      <MobileShell
        topBar={!isAuthView ? renderTopBar() : undefined}
        bottomNav={!isAuthView && !isLegalView ? renderBottomNav() : undefined}
      >
        {renderContent()}
      </MobileShell>
      <ActionSheet
        open={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        title={mobileView === 'docs' ? (locale === 'zh' ? '页面操作' : 'Page actions') : (locale === 'zh' ? '快捷操作' : 'Quick actions')}
        description={mobileView === 'docs' ? (locale === 'zh' ? '为当前页面选择一个动作。' : 'Choose an action for this page.') : (locale === 'zh' ? '浏览首页、文档、账户与语言入口。' : 'Open home, docs, account, and language actions.')}
      >
        {mobileView === 'docs' ? (
          <>
            <ActionSheetItem icon={<Star size={18} />} onClick={() => setActionSheetOpen(false)}>{locale === 'zh' ? '收藏页面' : 'Bookmark page'}</ActionSheetItem>
            <ActionSheetItem icon={<Download size={18} />} onClick={() => setActionSheetOpen(false)}>{locale === 'zh' ? '下载 PDF' : 'Download PDF'}</ActionSheetItem>
            <ActionSheetItem icon={<Trash2 size={18} />} destructive onClick={() => setActionSheetOpen(false)}>{locale === 'zh' ? '清除历史' : 'Clear history'}</ActionSheetItem>
          </>
        ) : (
          <>
            <ActionSheetItem icon={<FileCode2 size={18} />} onClick={() => { setActionSheetOpen(false); selectPage('introduction'); }}>{pp.navDocs}</ActionSheetItem>
            <ActionSheetItem icon={<LogIn size={18} />} onClick={() => { setActionSheetOpen(false); setMobileView('login'); }}>{pp.navLogin}</ActionSheetItem>
            <ActionSheetItem icon={<UserPlus size={18} />} onClick={() => { setActionSheetOpen(false); setMobileView('register'); }}>{pp.navSignup}</ActionSheetItem>
            <ActionSheetItem icon={locale === 'zh' ? <Check size={18} /> : undefined} onClick={() => { setLocale('zh'); setActionSheetOpen(false); }}>中文</ActionSheetItem>
            <ActionSheetItem icon={locale === 'en' ? <Check size={18} /> : undefined} onClick={() => { setLocale('en'); setActionSheetOpen(false); }}>English</ActionSheetItem>
            <ActionSheetItem icon={<ShieldCheck size={18} />} onClick={() => { setActionSheetOpen(false); openLegalPage('privacy-policy'); }}>{pp.footerPrivacy}</ActionSheetItem>
            <ActionSheetItem icon={<FileText size={18} />} onClick={() => { setActionSheetOpen(false); openLegalPage('terms-of-service'); }}>{t.pages['terms-of-service']}</ActionSheetItem>
            <ActionSheetItem icon={<Smartphone size={18} />} onClick={() => { setActionSheetOpen(false); window.location.href = '/docs/introduction'; }}>{locale === 'zh' ? '桌面版文档' : 'Desktop docs'}</ActionSheetItem>
          </>
        )}
      </ActionSheet>
    </>
  );
}
