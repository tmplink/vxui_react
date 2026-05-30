import { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileCode2,
  FileText,
  FileX2,
  Globe,
  GripHorizontal,
  House,
  LayoutDashboard,
  List,
  LogIn,
  Menu,
  Minus,
  Navigation,
  Package2,
  Palette,
  PanelRightClose,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  User,
  UserPlus,
  X,
  Zap,
  Share2,
  Download,
} from 'lucide-react';
import { MobileShell, MobileTopBar, MobileIconButton } from './MobileShell';
import { BottomNav } from './BottomNav';
import { MobileList, MobileListSection, MobileListItem } from './MobileList';
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
  Heading,
  Text,
  Label,
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../../lib';

// ─── Types ────────────────────────────────────────────────────────────────────

type MobileView = 'home' | 'docs' | 'login' | 'register' | 'privacy-policy' | 'terms-of-service';
type BottomTab = 'home' | 'docs' | 'search';

type PageKey =
  | 'introduction'
  | 'quick-start'
  | 'shell-sidebar'
  | 'grid-page'
  | 'nav-layout'
  | 'scroll-area'
  | 'separator'
  | 'resizable'
  | 'typography'
  | 'badge'
  | 'avatar'
  | 'skeleton'
  | 'card'
  | 'code-block'
  | 'language-switcher'
  | 'button'
  | 'elements'
  | 'form-controls'
  | 'form-inputs'
  | 'toggle'
  | 'rating'
  | 'label'
  | 'date-pickers'
  | 'file-upload'
  | 'color-picker'
  | 'form'
  | 'accordion'
  | 'tabs'
  | 'breadcrumb'
  | 'pagination'
  | 'stepper'
  | 'progress'
  | 'spinner'
  | 'alert'
  | 'toasts'
  | 'table'
  | 'data-list'
  | 'timeline'
  | 'tree-view'
  | 'carousel'
  | 'empty-states'
  | 'overlays'
  | 'data-display'
  | 'navigation'
  | 'feedback'
  | 'dialog'
  | 'alert-dialog'
  | 'sheet'
  | 'popover'
  | 'tooltip'
  | 'hover-card'
  | 'dropdown-menu'
  | 'context-menu'
  | 'command-palette'
  | 'navigation-menu'
  | 'menubar'
  | 'mobile'
  | 'mobile-list'
  | 'home-page'
  | 'login-page'
  | 'register-page'
  | 'error-page'
  | 'privacy-policy'
  | 'terms-of-service';

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
  inputRef?: React.RefObject<HTMLInputElement | null>;
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
        { key: 'introduction', label: t.pages.introduction, icon: <Compass size={16} /> },
      ],
    },
    {
      title: t.nav.layout,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} /> },
        { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} /> },
        { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} /> },
        { key: 'nav-layout', label: t.pages['nav-layout'], icon: <LayoutDashboard size={16} /> },
        { key: 'scroll-area', label: t.pages['scroll-area'], icon: <FileText size={16} /> },
        { key: 'separator', label: t.pages.separator, icon: <Minus size={16} /> },
        { key: 'resizable', label: t.pages.resizable, icon: <GripHorizontal size={16} /> },
      ],
    },
    {
      title: t.nav.content,
      collapsible: true,
      defaultOpen: false,
      items: [
        { key: 'typography', label: t.pages.typography, icon: <FileText size={16} /> },
        { key: 'badge', label: t.pages.badge, icon: <ShieldCheck size={16} /> },
        { key: 'avatar', label: t.pages.avatar, icon: <User size={16} /> },
        { key: 'skeleton', label: t.pages.skeleton, icon: <LayoutDashboard size={16} /> },
        { key: 'card', label: t.pages.card, icon: <LayoutDashboard size={16} /> },
        { key: 'code-block', label: t.pages['code-block'], icon: <FileCode2 size={16} /> },
        { key: 'language-switcher', label: t.pages['language-switcher'], icon: <Globe size={16} /> },
      ],
    },
    {
      title: t.nav.forms,
      collapsible: true,
      defaultOpen: false,
      items: [
        { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} /> },
        { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} /> },
        { key: 'toggle', label: t.pages.toggle, icon: <SlidersHorizontal size={16} /> },
        { key: 'rating', label: t.pages.rating, icon: <Star size={16} /> },
        { key: 'label', label: t.pages.label, icon: <Tag size={16} /> },
        { key: 'date-pickers', label: t.pages['date-pickers'], icon: <CalendarDays size={16} /> },
        { key: 'file-upload', label: t.pages['file-upload'], icon: <Upload size={16} /> },
        { key: 'color-picker', label: t.pages['color-picker'], icon: <Palette size={16} /> },
        { key: 'form', label: t.pages.form, icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: t.nav.components,
      collapsible: true,
      defaultOpen: false,
      items: [
        { key: 'button', label: t.pages.button, icon: <Sparkles size={16} /> },
        { key: 'elements', label: t.pages.elements, icon: <Package2 size={16} /> },
        { key: 'accordion', label: t.pages.accordion, icon: <List size={16} /> },
        { key: 'tabs', label: t.pages.tabs, icon: <FileText size={16} /> },
        { key: 'breadcrumb', label: t.pages.breadcrumb, icon: <List size={16} /> },
        { key: 'pagination', label: t.pages.pagination, icon: <List size={16} /> },
        { key: 'stepper', label: t.pages.stepper, icon: <List size={16} /> },
        { key: 'progress', label: t.pages.progress, icon: <List size={16} /> },
        { key: 'spinner', label: t.pages.spinner, icon: <List size={16} /> },
        { key: 'alert', label: t.pages.alert, icon: <AlertTriangle size={16} /> },
        { key: 'toasts', label: t.pages.toasts, icon: <Bell size={16} /> },
        { key: 'table', label: t.pages.table, icon: <FileText size={16} /> },
        { key: 'data-list', label: t.pages['data-list'], icon: <List size={16} /> },
        { key: 'timeline', label: t.pages.timeline, icon: <List size={16} /> },
        { key: 'tree-view', label: t.pages['tree-view'], icon: <Boxes size={16} /> },
        { key: 'carousel', label: t.pages.carousel, icon: <LayoutDashboard size={16} /> },
        { key: 'empty-states', label: t.pages['empty-states'], icon: <FileX2 size={16} /> },
      ],
    },
    {
      title: t.nav.overlays,
      collapsible: true,
      defaultOpen: false,
      items: [
        { key: 'dialog', label: t.pages.dialog, icon: <ChevronRight size={16} /> },
        { key: 'alert-dialog', label: t.pages['alert-dialog'], icon: <AlertTriangle size={16} /> },
        { key: 'sheet', label: t.pages.sheet, icon: <PanelRightClose size={16} /> },
        { key: 'popover', label: t.pages.popover, icon: <ChevronRight size={16} /> },
        { key: 'tooltip', label: t.pages.tooltip, icon: <ChevronRight size={16} /> },
        { key: 'hover-card', label: t.pages['hover-card'], icon: <ChevronRight size={16} /> },
        { key: 'dropdown-menu', label: t.pages['dropdown-menu'], icon: <ChevronRight size={16} /> },
        { key: 'context-menu', label: t.pages['context-menu'], icon: <ChevronRight size={16} /> },
        { key: 'command-palette', label: t.pages['command-palette'], icon: <Search size={16} /> },
        { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} /> },
      ],
    },
    {
      title: t.nav.navigation,
      collapsible: true,
      defaultOpen: false,
      items: [
        { key: 'navigation-menu', label: t.pages['navigation-menu'], icon: <Navigation size={16} /> },
        { key: 'menubar', label: t.pages.menubar, icon: <Menu size={16} /> },
      ],
    },
    {
      title: t.nav.feedback,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'feedback', label: t.pages.feedback, icon: <ShieldCheck size={16} /> },
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
    {
      title: t.nav.mobile,
      collapsible: true,
      defaultOpen: true,
      items: [
        { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} /> },
        { key: 'mobile-list', label: t.pages['mobile-list'], icon: <List size={16} /> },
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
      case 'feedback': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Alert variant="info" title={isZh ? '迁移进度' : 'Migration progress'}>
              {isZh ? '响应式壳层、模板页面和文档内容库已经收敛到同一套运行时。' : 'The responsive shell, template pages, and docs library now share the same runtime.'}
            </Alert>
            <Progress label={isZh ? '默认' : 'Default'} showLabel value={sliderVal} />
            <Progress label={isZh ? '成功' : 'Success'} showLabel value={sliderVal} variant="success" />
            <Progress label={isZh ? '警告' : 'Warning'} showLabel value={sliderVal} variant="warning" />
            <Progress label={isZh ? '危险' : 'Danger'} showLabel value={sliderVal} variant="danger" />
            <div className="vx-stack vx-stack--tight">
              <div className="vx-inline" style={{ alignItems: 'center' }}>
                <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
              </div>
              <Stepper currentStep={stepperStep} steps={[
                { label: isZh ? '步骤 1' : 'Step 1' },
                { label: isZh ? '步骤 2' : 'Step 2' },
                { label: isZh ? '步骤 3' : 'Step 3' }
              ]} />
              <div className="vx-inline" style={{ gap: 8 }}>
                <Button size="sm" variant="secondary" onClick={() => setStepperStep(Math.max(0, stepperStep - 1))}>{isZh ? '上一步' : 'Back'}</Button>
                <Button size="sm" onClick={() => setStepperStep(Math.min(2, stepperStep + 1))}>{isZh ? '下一步' : 'Next'}</Button>
              </div>
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
      }
      case 'overlays': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            {/* Basic Dialog */}
            <Dialog
              trigger={<Button variant="secondary" size="sm">{isZh ? '打开对话框' : 'Open dialog'}</Button>}
              title={isZh ? '删除项目' : 'Delete project'}
              description={isZh ? '此操作将移除所有成员的访问权限。' : 'This action removes access for the whole team.'}
              footer={
                <>
                  <Button variant="ghost">{isZh ? '取消' : 'Cancel'}</Button>
                  <Button variant="danger">{isZh ? '删除' : 'Delete'}</Button>
                </>
              }
            >
              <div style={{ padding: '4px 0', lineHeight: 1.5, color: 'var(--vx-text-secondary)' }}>
                {isZh ? '此项目将被永久删除且无法恢复。' : 'This project will be removed permanently and cannot be recovered.'}
              </div>
            </Dialog>

            {/* Fullscreen mode */}
            <Dialog
              fullscreen
              title={isZh ? '全屏表单' : 'Fullscreen Form'}
              description={isZh ? '全屏模式下包含表单控件，用于验证滚动条和表单控件交互' : 'Fullscreen form with form controls to verify scrollbar and form control behavior'}
              trigger={<Button variant="secondary" size="sm">{isZh ? '全屏表单' : 'Fullscreen Form'}</Button>}
              footer={<Button variant="ghost">{isZh ? '关闭' : 'Close'}</Button>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
                <Input
                  label={isZh ? '项目名称' : 'Project name'}
                  placeholder={isZh ? '输入项目名称…' : 'Enter project name…'}
                />
                <Select
                  label={isZh ? '部署环境' : 'Environment'}
                  placeholder={isZh ? '选择环境…' : 'Select environment…'}
                  options={[
                    { value: 'prod', label: isZh ? '生产' : 'Production' },
                    { value: 'staging', label: isZh ? '预发布' : 'Staging' },
                    { value: 'preview', label: isZh ? '预览' : 'Preview' },
                    { value: 'dev', label: isZh ? '开发' : 'Development' },
                  ]}
                />
                <MultiSelect
                  label={isZh ? '部署模块' : 'Deployment scope'}
                  placeholder={isZh ? '选择模块…' : 'Select scope…'}
                  clearable
                  options={[
                    { value: 'web', label: isZh ? 'Web 前端' : 'Web frontend' },
                    { value: 'api', label: isZh ? 'API 服务' : 'API service' },
                    { value: 'worker', label: isZh ? '异步任务' : 'Background jobs' },
                    { value: 'mobile', label: isZh ? '移动端' : 'Mobile app' },
                  ]}
                />
                <DatePicker label={isZh ? '上线日期' : 'Launch date'} />
                <TimePicker label={isZh ? '部署时间' : 'Deploy time'} />
                <Textarea
                  label={isZh ? '备注' : 'Notes'}
                  placeholder={isZh ? '输入备注…' : 'Enter notes…'}
                  rows={3}
                />
              </div>
            </Dialog>

            {/* Form in dialog */}
            <Dialog
              trigger={<Button variant="secondary" size="sm">{isZh ? '表单对话框' : 'Form in dialog'}</Button>}
              title={isZh ? '新建部署' : 'New deployment'}
              description={isZh ? '表单控件在对话框内可正常展开和交互。' : 'Form controls open correctly inside a dialog.'}
              footer={
                <>
                  <Button variant="ghost">{isZh ? '取消' : 'Cancel'}</Button>
                  <Button>{isZh ? '创建' : 'Create'}</Button>
                </>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
                <Input label={isZh ? '项目名称' : 'Project name'} placeholder={isZh ? '输入名称…' : 'Enter name…'} />
                <Select
                  label={isZh ? '部署环境' : 'Environment'}
                  placeholder={isZh ? '选择环境…' : 'Select environment…'}
                  options={[
                    { value: 'prod', label: isZh ? '生产' : 'Production' },
                    { value: 'staging', label: isZh ? '预发布' : 'Staging' },
                    { value: 'preview', label: isZh ? '预览' : 'Preview' },
                    { value: 'dev', label: isZh ? '开发' : 'Development' },
                  ]}
                />
                <MultiSelect
                  label={isZh ? '部署模块' : 'Deployment scope'}
                  placeholder={isZh ? '选择模块…' : 'Select scope…'}
                  clearable
                  options={[
                    { value: 'web', label: isZh ? 'Web 前端' : 'Web frontend' },
                    { value: 'api', label: isZh ? 'API 服务' : 'API service' },
                    { value: 'worker', label: isZh ? '异步任务' : 'Background jobs' },
                    { value: 'mobile', label: isZh ? '移动端' : 'Mobile app' },
                  ]}
                />
                <DatePicker label={isZh ? '上线日期' : 'Launch date'} />
                <TimePicker label={isZh ? '部署时间' : 'Deploy time'} />
                <ColorPicker label={isZh ? '标签颜色' : 'Label color'} />
              </div>
            </Dialog>

            <Separator />

            {/* Tooltip */}
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
              <Tooltip content={isZh ? '主要操作' : 'Primary action'} placement="top">
                <Button size="sm">{isZh ? '悬停 (上)' : 'Hover (top)'}</Button>
              </Tooltip>
              <Tooltip content={isZh ? '右侧' : 'Right'} placement="right">
                <Button size="sm" variant="secondary">{isZh ? '右侧' : 'Right'}</Button>
              </Tooltip>
            </div>

            {/* Popover */}
            <Separator />
            <Popover content={<div className="vx-stack vx-stack--tight"><p style={{ fontSize: '0.875rem', margin: 0 }}>{isZh ? 'Popover 用于补充上下文，而不是承载另一套页面层级。' : 'Popover adds context instead of carrying a second page hierarchy.'}</p></div>}>
              <Button variant="secondary" size="sm">{isZh ? '打开弹出' : 'Open popover'}</Button>
            </Popover>

            {/* DropdownMenu */}
            <Separator />
            <DropdownMenu
              trigger={<Button variant="secondary" size="sm">{isZh ? '更多操作' : 'More actions'}</Button>}
              items={[
                { label: isZh ? '打开首页' : 'Open home', onClick: () => {} },
                { label: isZh ? '打开文档' : 'Open docs', onClick: () => {} },
                { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} },
              ]}
            />

            {/* AlertDialog */}
            <Separator />
            <AlertDialog
              trigger={<Button variant="outline" size="sm">{isZh ? '警告框' : 'Alert Dialog'}</Button>}
              title={isZh ? '确定吗？' : 'Are you sure?'}
              description={isZh ? '此操作无法撤销。' : 'This action cannot be undone.'}
            />

            {/* Sheet */}
            <Separator />
            <Sheet
              trigger={<Button variant="secondary" size="sm">{isZh ? '打开抽屉' : 'Open Sheet'}</Button>}
              title={isZh ? '通知设置' : 'Notifications'}
              description={isZh ? '管理您的通知偏好。' : 'Manage your notification preferences.'}
              side="bottom"
            >
              <div className="vx-stack">
                <Switch label={isZh ? '邮件通知' : 'Email notifications'} checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
                <Switch label={isZh ? '推送通知' : 'Push notifications'} checked={checkboxA} onCheckedChange={setCheckboxA} />
                <Switch label={isZh ? '短信通知' : 'SMS notifications'} checked={checkboxB} onCheckedChange={setCheckboxB} />
              </div>
            </Sheet>

            {/* HoverCard */}
            <Separator />
            <HoverCard content={<div style={{ fontSize: '0.875rem', padding: '4px 0' }}>{isZh ? '悬停卡片内容。' : 'Hover card content.'}</div>}>
              <Button variant="ghost" size="sm">{isZh ? '悬停我' : 'Hover me'}</Button>
            </HoverCard>

            {/* ContextMenu */}
            <Separator />
            <ContextMenu
              items={[
                { label: isZh ? '复制' : 'Copy', onClick: () => {} },
                { label: isZh ? '粘贴' : 'Paste', onClick: () => {} },
                { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} },
              ]}
            >
              <div style={{ padding: '12px', border: '1px dashed var(--vx-border)', borderRadius: 'var(--vx-radius)', fontSize: '0.875rem', color: 'var(--vx-text-secondary)', textAlign: 'center' }}>
                {isZh ? '右键点击 / 长按' : 'Right-click / long-press'}
              </div>
            </ContextMenu>
          </div>
        );
      }
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
                { label: 'Mobile', onClick: () => selectPage('mobile'), active: (activePage as string) === 'mobile' },
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
      case 'data-display': {
        const isZh = locale === 'zh';
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
            <Separator />
            <EmptyState
              icon={<AlertTriangle size={22} />}
              title={isZh ? '暂无数据' : 'No data found'}
              description={isZh ? '请尝试调整筛选条件' : 'Try adjusting your filters'}
              action={<Button variant="secondary" size="sm">{isZh ? '清空筛选' : 'Clear filters'}</Button>}
            />
          </div>
        );
      }
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
      case 'command-palette': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap">
              <Button onClick={() => push({ tone: 'info', title: isZh ? '搜索' : 'Search', description: isZh ? '命令面板功能在此演示。' : 'Command palette demo.' })}>
                {isZh ? '打开搜索' : 'Open search'}
              </Button>
            </div>
            <Alert variant="info" title={isZh ? '键盘优先' : 'Keyboard first'}>
              {isZh
                ? '按下 ⌘K（Mac）或 Ctrl+K（Windows）即可随时唤起命令面板，无需鼠标。'
                : 'Press ⌘K (Mac) or Ctrl+K (Windows) to open the palette from anywhere without reaching for the mouse.'}
            </Alert>
          </div>
        );
      }
      case 'code-block': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <pre className="vx-docs-code" style={{ fontSize: 11, overflowX: 'auto' }}>
              {isZh
                ? `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>点击我</Button>;\n}`
                : `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>Click me</Button>;\n}`}
            </pre>
            <Alert variant="info" title={isZh ? '代码块' : 'Code block'}>
              {isZh
                ? 'CodeBlock 组件支持语法高亮和代码复制功能。'
                : 'The CodeBlock component supports syntax highlighting and code copying.'}
            </Alert>
          </div>
        );
      }
      case 'language-switcher': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline">
              <LanguageSwitcher variant="inline" />
            </div>
            <Alert variant="info" title={isZh ? '全局语言切换' : 'Global language switch'}>
              {isZh
                ? '切换语言后，文档内所有 UI 文案（包括顶栏和导航）同步更新，无需刷新页面。'
                : 'Switching locale updates all UI copy — including the topbar and nav — across the entire docs surface without a page reload.'}
            </Alert>
          </div>
        );
      }
      case 'scroll-area': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <ScrollArea maxHeight={160} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8 }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--vx-color-border)' }}>
                  {isZh ? `日志行 ${i + 1}` : `Log line ${i + 1}`}
                </div>
              ))}
            </ScrollArea>
          </div>
        );
      }
      case 'separator': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span>{isZh ? '左' : 'Left'}</span>
              <Separator orientation="vertical" style={{ height: 24 }} />
              <span>{isZh ? '中' : 'Center'}</span>
              <Separator orientation="vertical" style={{ height: 24 }} />
              <span>{isZh ? '右' : 'Right'}</span>
            </div>
            <Separator />
            <p>{isZh ? '水平分隔线上方内容' : 'Content above the horizontal separator.'}</p>
          </div>
        );
      }
      case 'resizable': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div style={{ height: 200, border: '1px solid var(--vx-border)', borderRadius: 'var(--vx-radius-lg)', overflow: 'hidden' }}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={20}>
                  <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--vx-surface)', color: 'var(--vx-text-secondary)' }}>
                    {isZh ? '左侧面板' : 'Left panel'}
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--vx-surface)', color: 'var(--vx-text-secondary)' }}>
                    {isZh ? '右侧面板' : 'Right panel'}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        );
      }
      case 'typography': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Heading level={1}>{isZh ? '标题 1' : 'Heading 1'}</Heading>
            <Heading level={2}>{isZh ? '标题 2' : 'Heading 2'}</Heading>
            <Heading level={3}>{isZh ? '标题 3' : 'Heading 3'}</Heading>
            <Text>{isZh ? '默认正文文本。' : 'Default body text.'}</Text>
            <Text variant="secondary">{isZh ? '次级强调文本。' : 'Secondary emphasis text.'}</Text>
            <Text variant="muted">{isZh ? '弱化辅助文本。' : 'Muted helper text.'}</Text>
            <Text weight="bold">{isZh ? '加粗正文。' : 'Bold body text.'}</Text>
          </div>
        );
      }
      case 'badge': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap">
              <Badge variant="accent">{isZh ? '新品' : 'New'}</Badge>
              <Badge variant="success">{isZh ? '在线' : 'Live'}</Badge>
              <Badge variant="warning">{isZh ? '测试版' : 'Beta'}</Badge>
              <Badge variant="neutral">{isZh ? '草稿' : 'Draft'}</Badge>
            </div>
          </div>
        );
      }
      case 'avatar': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
              <Avatar src="https://i.pravatar.cc/80?u=1" name="Alex Morgan" size="xs" />
              <Avatar src="https://i.pravatar.cc/80?u=2" name="Jamie Chen" size="sm" />
              <Avatar src="https://i.pravatar.cc/80?u=3" name="Taylor Kim" size="md" />
              <Avatar name="Sam Wilson" size="lg" />
              <Avatar size="xl" />
            </div>
          </div>
        );
      }
      case 'skeleton': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div style={{ display: 'grid', gap: 8, width: '100%' }}>
              <Skeleton variant="rect" width="100%" height={100} />
              <Skeleton variant="text" width="65%" />
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
        );
      }
      case 'card': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ gap: '0.5rem', alignItems: 'flex-start' }}>
              <Card variant="default" padding="md">
                <CardHeader><CardTitle>Default</CardTitle><CardDescription>Standard card surface.</CardDescription></CardHeader>
                <CardContent>Content goes here.</CardContent>
              </Card>
              <Card variant="elevated" padding="md" hoverable>
                <CardHeader><CardTitle>Elevated</CardTitle><CardDescription>Interactive with hover lift.</CardDescription></CardHeader>
                <CardContent>Hover over this card.</CardContent>
              </Card>
              <Card variant="outlined" padding="md">
                <CardHeader><CardTitle>Outlined</CardTitle><CardDescription>Bordered surface.</CardDescription></CardHeader>
                <CardContent>Content goes here.</CardContent>
              </Card>
              <Card variant="flat" padding="md">
                <CardHeader><CardTitle>Flat</CardTitle><CardDescription>No border or shadow.</CardDescription></CardHeader>
                <CardContent>Content goes here.</CardContent>
              </Card>
              <Card variant="ghost" padding="md">
                <CardHeader><CardTitle>Ghost</CardTitle><CardDescription>Minimal presence.</CardDescription></CardHeader>
                <CardContent>Content goes here.</CardContent>
              </Card>
              <Card variant="filled" padding="md">
                <CardHeader><CardTitle>Filled</CardTitle><CardDescription>Background fill.</CardDescription></CardHeader>
                <CardContent>Content goes here.</CardContent>
              </Card>
            </div>
            <Alert variant="info" title={isZh ? '可组合的子组件' : 'Composable sub-components'}>
              {isZh
                ? 'Card 可与 CardHeader、CardTitle、CardDescription、CardContent 自由组合。'
                : 'Card composes with CardHeader, CardTitle, CardDescription, and CardContent.'}
            </Alert>
          </div>
        );
      }
      case 'toggle': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
              <Toggle defaultPressed={false}><Text size="sm">{isZh ? '加粗' : 'Bold'}</Text></Toggle>
              <Toggle><Text size="sm">{isZh ? '斜体' : 'Italic'}</Text></Toggle>
              <Toggle><Text size="sm">{isZh ? '下划线' : 'Underline'}</Text></Toggle>
            </div>
            <ToggleGroup
              type="single"
              defaultValue="grid"
              items={[
                { value: 'grid', label: isZh ? '网格' : 'Grid' },
                { value: 'list', label: isZh ? '列表' : 'List' },
                { value: 'table', label: isZh ? '表格' : 'Table' },
              ]}
            />
          </div>
        );
      }
      case 'rating': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline" style={{ flexDirection: 'column', gap: 16 }}>
              <Rating defaultValue={3.5} allowHalf />
              <Rating defaultValue={4} size="sm" />
              <Rating defaultValue={5} size="lg" readOnly />
            </div>
          </div>
        );
      }
      case 'label': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack" style={{ maxWidth: 320 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <Label required>{isZh ? '电子邮箱' : 'Email'}</Label>
              <Input placeholder="name@example.com" />
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              <Label>{isZh ? '备注（选填）' : 'Notes (optional)'}</Label>
              <Input placeholder={isZh ? '添加备注...' : 'Add notes...'} />
            </div>
          </div>
        );
      }
      case 'date-pickers': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack" style={{ maxWidth: 320 }}>
            <DatePicker label={isZh ? '开始日期' : 'Start date'} />
            <DatePicker label={isZh ? '结束日期' : 'End date'} weekStartsOnMonday />
          </div>
        );
      }
      case 'file-upload': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack" style={{ maxWidth: 480 }}>
            <FileUpload
              multiple
              label={isZh ? '上传附件' : 'Upload attachments'}
              hint={isZh ? '支持多文件上传，单文件最大 10MB' : 'Multiple files allowed, up to 10MB each'}
              accept="image/*,.pdf"
            />
          </div>
        );
      }
      case 'color-picker': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack" style={{ maxWidth: 480 }}>
            <ColorPicker label={isZh ? '主题色' : 'Theme color'} />
          </div>
        );
      }
      case 'form': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Form style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
              <FormField>
                <FormLabel required>{isZh ? '邮箱' : 'Email'}</FormLabel>
                <FormDescription>{isZh ? '我们不会分享你的邮箱。' : 'We will never share your email.'}</FormDescription>
                <Input type="email" placeholder="name@example.com" />
                <FormMessage />
              </FormField>
              <FormField>
                <FormLabel required>{isZh ? '密码' : 'Password'}</FormLabel>
                <Input type="password" placeholder="••••••••" />
                <FormMessage />
              </FormField>
              <Button type="submit">{isZh ? '提交' : 'Submit'}</Button>
            </Form>
          </div>
        );
      }
      case 'accordion': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Accordion
              defaultOpen={['getting-started']}
              items={[
                { key: 'getting-started', title: isZh ? '快速开始' : 'Getting Started', content: isZh ? '安装包并配置 Provider。' : 'Install the package and set up providers.' },
                { key: 'components', title: isZh ? '组件库' : 'Components', content: isZh ? '按分类浏览全部组件。' : 'Browse the full component library organized by category.' },
                { key: 'templates', title: isZh ? '页面模板' : 'Templates', content: isZh ? '可直接引入项目的预置页面布局。' : 'Pre-built page layouts you can drop into your app.' },
              ]}
            />
          </div>
        );
      }
      case 'tabs': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">{isZh ? '预览' : 'Preview'}</TabsTrigger>
                <TabsTrigger value="code">{isZh ? '代码' : 'Code'}</TabsTrigger>
                <TabsTrigger value="props">{isZh ? '属性' : 'Props'}</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">{isZh ? '实时预览组件效果。' : 'Preview the component in real time.'}</TabsContent>
              <TabsContent value="code">{isZh ? '查看源代码并复制到项目中使用。' : 'View the source code and copy it into your project.'}</TabsContent>
              <TabsContent value="props">{isZh ? '浏览完整的 API 参考。' : 'Browse the full API reference with descriptions.'}</TabsContent>
            </Tabs>
          </div>
        );
      }
      case 'breadcrumb': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Breadcrumb
              items={[
                { label: isZh ? '首页' : 'Home', href: '#' },
                { label: isZh ? '组件' : 'Components', href: '#' },
                { label: isZh ? '导航' : 'Navigation' },
              ]}
            />
          </div>
        );
      }
      case 'pagination': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Pagination page={paginationPage} total={48} pageSize={10} onChange={setPaginationPage} />
          </div>
        );
      }
      case 'stepper': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Stepper
              currentStep={1}
              steps={[
                { label: isZh ? '规划' : 'Plan', description: isZh ? '定义需求' : 'Define requirements' },
                { label: isZh ? '开发' : 'Build', description: isZh ? '实现功能' : 'Implement features' },
                { label: isZh ? '发布' : 'Launch', description: isZh ? '部署上线' : 'Deploy to production' },
              ]}
            />
          </div>
        );
      }
      case 'progress': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Progress label={isZh ? '默认' : 'Default'} showLabel value={sliderVal} />
            <Progress label={isZh ? '成功' : 'Success'} showLabel value={sliderVal} variant="success" />
            <Progress label={isZh ? '警告' : 'Warning'} showLabel value={sliderVal} variant="warning" />
            <Progress label={isZh ? '危险' : 'Danger'} showLabel value={sliderVal} variant="danger" />
          </div>
        );
      }
      case 'spinner': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        );
      }
      case 'alert': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Alert title={isZh ? '提示信息' : 'Information'} variant="info">
              {isZh ? '这是一条提示信息。' : 'This is an informational message.'}
            </Alert>
            <Alert title={isZh ? '操作成功' : 'Success'} variant="success">
              {isZh ? '操作已成功完成。' : 'Operation completed successfully.'}
            </Alert>
            <Alert title={isZh ? '请注意' : 'Warning'} variant="warning">
              {isZh ? '请检查后再继续。' : 'Please review before proceeding.'}
            </Alert>
            <Alert title={isZh ? '错误' : 'Error'} variant="danger">
              {isZh ? '出错了，请重试。' : 'Something went wrong. Please try again.'}
            </Alert>
          </div>
        );
      }
      case 'table': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Table
              columns={[
                { key: 'name', header: isZh ? '名称' : 'Name', accessor: (row: { name: string }) => row.name },
                { key: 'role', header: isZh ? '角色' : 'Role', accessor: (row: { role: string }) => row.role },
                { key: 'status', header: isZh ? '状态' : 'Status', accessor: (row: { status: string }) => <Badge variant={(row.status === 'Active' ? 'success' : 'warning') as 'success' | 'warning'}>{row.status}</Badge> },
              ]}
              data={[
                { name: 'Alice Chen', role: isZh ? '设计师' : 'Designer', status: 'Active' },
                { name: 'Bo Wang', role: isZh ? '工程师' : 'Engineer', status: 'Active' },
                { name: 'Cora Lin', role: isZh ? '产品经理' : 'PM', status: 'Inactive' },
              ]}
              striped
              bordered
            />
          </div>
        );
      }
      case 'timeline': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Timeline
              items={[
                { title: isZh ? '订单已创建' : 'Order created', time: '09:42', status: 'success' },
                { title: isZh ? '支付成功' : 'Payment confirmed', time: '09:43', status: 'info' },
                { title: isZh ? '配送中' : 'Shipping', time: '10:15', status: 'warning' },
                { title: isZh ? '已签收' : 'Delivered', time: '14:30', status: 'default' },
              ]}
            />
          </div>
        );
      }
      case 'tree-view': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <TreeView
              nodes={[
                {
                  id: 'src', label: 'src',
                  children: [
                    { id: 'components', label: 'components', children: [{ id: 'btn', label: 'Button.tsx' }, { id: 'card', label: 'Card.tsx' }] },
                    { id: 'pages', label: 'pages', children: [{ id: 'home', label: 'Home.tsx' }, { id: 'about', label: 'About.tsx' }] },
                  ],
                },
                { id: 'public', label: 'public', children: [{ id: 'index', label: 'index.html' }] },
              ]}
              defaultExpanded={['src', 'components', 'pages']}
            />
          </div>
        );
      }
      case 'carousel': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Carousel
              items={[
                <div key="1" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-2)' }}>{isZh ? '第一张' : 'Slide 1'}</div>,
                <div key="2" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-3)' }}>{isZh ? '第二张' : 'Slide 2'}</div>,
                <div key="3" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-2)' }}>{isZh ? '第三张' : 'Slide 3'}</div>,
              ]}
              showDots
              showArrows
            />
          </div>
        );
      }
      case 'dialog': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Dialog
              trigger={<Button variant="secondary" size="sm">{isZh ? '打开对话框' : 'Open dialog'}</Button>}
              title={isZh ? '删除项目' : 'Delete project'}
              description={isZh ? '此操作将移除所有成员的访问权限。' : 'This action removes access for the whole team.'}
              footer={
                <>
                  <Button variant="ghost">{isZh ? '取消' : 'Cancel'}</Button>
                  <Button variant="danger">{isZh ? '删除' : 'Delete'}</Button>
                </>
              }
            >
              <div style={{ padding: '4px 0', lineHeight: 1.5, color: 'var(--vx-text-secondary)' }}>
                {isZh ? '此项目将被永久删除且无法恢复。' : 'This project will be removed permanently and cannot be recovered.'}
              </div>
            </Dialog>
          </div>
        );
      }
      case 'alert-dialog': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <AlertDialog
              trigger={<Button variant="outline" size="sm">{isZh ? '警告框' : 'Alert Dialog'}</Button>}
              title={isZh ? '确定吗？' : 'Are you sure?'}
              description={isZh ? '此操作无法撤销。' : 'This action cannot be undone.'}
            />
          </div>
        );
      }
      case 'sheet': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap">
              <Sheet
                trigger={<Button>{isZh ? '打开面板' : 'Open panel'}</Button>}
                title={isZh ? '侧滑面板' : 'Sheet panel'}
                description={isZh ? '这是从右侧滑入的面板。' : 'This panel slides in from the right.'}
                side="right"
              >
                <div style={{ padding: 16 }}>{isZh ? '面板内容' : 'Panel content'}</div>
              </Sheet>
            </div>
            <Alert variant="info" title={isZh ? '多方向支持' : 'Multiple sides'}>
              {isZh
                ? 'Sheet 支持从 left、right、top、bottom 四个方向滑入。'
                : 'Sheet supports left, right, top, and bottom directions.'}
            </Alert>
          </div>
        );
      }
      case 'popover': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <Popover content={<div style={{ fontSize: '0.875rem' }}>{isZh ? 'Popover 用于补充上下文，而不是承载另一套页面层级。' : 'Popover adds context instead of carrying a second page hierarchy.'}</div>}>
              <Button variant="secondary" size="sm">{isZh ? '打开弹出' : 'Open popover'}</Button>
            </Popover>
          </div>
        );
      }
      case 'tooltip': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <div className="vx-inline vx-inline--wrap" style={{ alignItems: 'center' }}>
              <Tooltip content={isZh ? '主要操作' : 'Primary action'} placement="top">
                <Button size="sm">{isZh ? '悬停 (上)' : 'Hover (top)'}</Button>
              </Tooltip>
              <Tooltip content={isZh ? '右侧' : 'Right'} placement="right">
                <Button size="sm" variant="secondary">{isZh ? '右侧' : 'Right'}</Button>
              </Tooltip>
            </div>
          </div>
        );
      }
      case 'hover-card': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <HoverCard content={<div style={{ fontSize: '0.875rem', padding: '4px 0' }}>{isZh ? '悬停卡片内容。' : 'Hover card content.'}</div>}>
              <Button variant="ghost" size="sm">{isZh ? '悬停我' : 'Hover me'}</Button>
            </HoverCard>
          </div>
        );
      }
      case 'dropdown-menu': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <DropdownMenu
              trigger={<Button variant="secondary" size="sm">{isZh ? '更多操作' : 'More actions'}</Button>}
              items={[
                { label: isZh ? '打开首页' : 'Open home', onClick: () => {} },
                { label: isZh ? '打开文档' : 'Open docs', onClick: () => {} },
                { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} },
              ]}
            />
          </div>
        );
      }
      case 'context-menu': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <ContextMenu
              items={[
                { label: isZh ? '复制' : 'Copy', onClick: () => {} },
                { label: isZh ? '粘贴' : 'Paste', onClick: () => {} },
                { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} },
              ]}
            >
              <div style={{ padding: '12px', border: '1px dashed var(--vx-border)', borderRadius: 'var(--vx-radius)', fontSize: '0.875rem', color: 'var(--vx-text-secondary)', textAlign: 'center' }}>
                {isZh ? '右键点击 / 长按' : 'Right-click / long-press'}
              </div>
            </ContextMenu>
          </div>
        );
      }
      case 'navigation-menu': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
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
                { label: 'Mobile', onClick: () => selectPage('mobile') },
              ]}
            />
          </div>
        );
      }
      case 'menubar': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
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
      }
      case 'mobile-list': {
        const isZh = locale === 'zh';
        return (
          <div className="vx-stack">
            <MobileList>
              <MobileListSection title={isZh ? '账户' : 'Account'}>
                <MobileListItem label={isZh ? '个人资料' : 'Profile'} chevron onClick={() => {}} />
                <MobileListItem label={isZh ? '安全设置' : 'Security'} chevron onClick={() => {}} />
              </MobileListSection>
              <MobileListSection title={isZh ? '偏好' : 'Preferences'}>
                <MobileListItem label={isZh ? '通知' : 'Notifications'} trailing={<Badge variant="accent">3</Badge>} />
                <MobileListItem label={isZh ? '主题' : 'Theme'} description={isZh ? '跟随系统' : 'System'} chevron onClick={() => {}} />
              </MobileListSection>
            </MobileList>
          </div>
        );
      }
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
    <Sheet
      side="left"
      open={drawerOpen}
      onOpenChange={(v) => { if (!v) setDrawerOpen(false); }}
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
        <div key={section.title} className="vxm-drawer-section">
          {section.title && (
            <div className="vxm-drawer-section__title">{section.title}</div>
          )}
          <div className="vxm-drawer-section__items">
            {section.items.map(item => (
              <button
                key={item.key}
                type="button"
                className={'vxm-drawer-item' + (activePage === item.key ? ' vxm-drawer-item--active' : '')}
                onClick={() => selectPage(item.key as PageKey)}
              >
                {item.icon && <span className="vxm-drawer-item__icon">{item.icon}</span>}
                <span className="vxm-drawer-item__label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </Sheet>
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
            { key: 'introduction', label: t.pages.introduction, icon: <Compass size={16} />, onSelect: () => { selectPage('introduction'); selectTab('docs'); } },
            { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} />, onSelect: () => { selectPage('quick-start'); selectTab('docs'); } },
            { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} />, onSelect: () => { selectPage('shell-sidebar'); selectTab('docs'); } },
            { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('grid-page'); selectTab('docs'); } },
            { key: 'nav-layout', label: t.pages['nav-layout'], icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('nav-layout'); selectTab('docs'); } },
            { key: 'scroll-area', label: t.pages['scroll-area'], icon: <FileText size={16} />, onSelect: () => { selectPage('scroll-area'); selectTab('docs'); } },
            { key: 'separator', label: t.pages.separator, icon: <Minus size={16} />, onSelect: () => { selectPage('separator'); selectTab('docs'); } },
            { key: 'resizable', label: t.pages.resizable, icon: <GripHorizontal size={16} />, onSelect: () => { selectPage('resizable'); selectTab('docs'); } },
            { key: 'typography', label: t.pages.typography, icon: <FileText size={16} />, onSelect: () => { selectPage('typography'); selectTab('docs'); } },
            { key: 'badge', label: t.pages.badge, icon: <ShieldCheck size={16} />, onSelect: () => { selectPage('badge'); selectTab('docs'); } },
            { key: 'avatar', label: t.pages.avatar, icon: <User size={16} />, onSelect: () => { selectPage('avatar'); selectTab('docs'); } },
            { key: 'skeleton', label: t.pages.skeleton, icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('skeleton'); selectTab('docs'); } },
            { key: 'card', label: t.pages.card, icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('card'); selectTab('docs'); } },
            { key: 'button', label: t.pages.button, icon: <Sparkles size={16} />, onSelect: () => { selectPage('button'); selectTab('docs'); } },
            { key: 'elements', label: t.pages.elements, icon: <Package2 size={16} />, onSelect: () => { selectPage('elements'); selectTab('docs'); } },
            { key: 'accordion', label: t.pages.accordion, icon: <List size={16} />, onSelect: () => { selectPage('accordion'); selectTab('docs'); } },
            { key: 'tabs', label: t.pages.tabs, icon: <FileText size={16} />, onSelect: () => { selectPage('tabs'); selectTab('docs'); } },
            { key: 'breadcrumb', label: t.pages.breadcrumb, icon: <List size={16} />, onSelect: () => { selectPage('breadcrumb'); selectTab('docs'); } },
            { key: 'pagination', label: t.pages.pagination, icon: <List size={16} />, onSelect: () => { selectPage('pagination'); selectTab('docs'); } },
            { key: 'stepper', label: t.pages.stepper, icon: <List size={16} />, onSelect: () => { selectPage('stepper'); selectTab('docs'); } },
            { key: 'progress', label: t.pages.progress, icon: <List size={16} />, onSelect: () => { selectPage('progress'); selectTab('docs'); } },
            { key: 'spinner', label: t.pages.spinner, icon: <List size={16} />, onSelect: () => { selectPage('spinner'); selectTab('docs'); } },
            { key: 'alert', label: t.pages.alert, icon: <AlertTriangle size={16} />, onSelect: () => { selectPage('alert'); selectTab('docs'); } },
            { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} />, onSelect: () => { selectPage('form-controls'); selectTab('docs'); } },
            { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} />, onSelect: () => { selectPage('form-inputs'); selectTab('docs'); } },
            { key: 'toggle', label: t.pages.toggle, icon: <SlidersHorizontal size={16} />, onSelect: () => { selectPage('toggle'); selectTab('docs'); } },
            { key: 'rating', label: t.pages.rating, icon: <Star size={16} />, onSelect: () => { selectPage('rating'); selectTab('docs'); } },
            { key: 'label', label: t.pages.label, icon: <Tag size={16} />, onSelect: () => { selectPage('label'); selectTab('docs'); } },
            { key: 'date-pickers', label: t.pages['date-pickers'], icon: <CalendarDays size={16} />, onSelect: () => { selectPage('date-pickers'); selectTab('docs'); } },
            { key: 'file-upload', label: t.pages['file-upload'], icon: <Upload size={16} />, onSelect: () => { selectPage('file-upload'); selectTab('docs'); } },
            { key: 'color-picker', label: t.pages['color-picker'], icon: <Palette size={16} />, onSelect: () => { selectPage('color-picker'); selectTab('docs'); } },
            { key: 'form', label: t.pages.form, icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('form'); selectTab('docs'); } },
            { key: 'toasts', label: t.pages.toasts, icon: <Bell size={16} />, onSelect: () => { selectPage('toasts'); selectTab('docs'); } },
            { key: 'table', label: t.pages.table, icon: <FileText size={16} />, onSelect: () => { selectPage('table'); selectTab('docs'); } },
            { key: 'data-list', label: t.pages['data-list'], icon: <List size={16} />, onSelect: () => { selectPage('data-list'); selectTab('docs'); } },
            { key: 'timeline', label: t.pages.timeline, icon: <List size={16} />, onSelect: () => { selectPage('timeline'); selectTab('docs'); } },
            { key: 'tree-view', label: t.pages['tree-view'], icon: <Boxes size={16} />, onSelect: () => { selectPage('tree-view'); selectTab('docs'); } },
            { key: 'carousel', label: t.pages.carousel, icon: <LayoutDashboard size={16} />, onSelect: () => { selectPage('carousel'); selectTab('docs'); } },
            { key: 'empty-states', label: t.pages['empty-states'], icon: <FileX2 size={16} />, onSelect: () => { selectPage('empty-states'); selectTab('docs'); } },
            { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} />, onSelect: () => { selectPage('overlays'); selectTab('docs'); } },
            { key: 'data-display', label: t.pages['data-display'], icon: <List size={16} />, onSelect: () => { selectPage('data-display'); selectTab('docs'); } },
            { key: 'navigation', label: t.pages.navigation, icon: <Compass size={16} />, onSelect: () => { selectPage('navigation'); selectTab('docs'); } },
            { key: 'feedback', label: t.pages.feedback, icon: <ShieldCheck size={16} />, onSelect: () => { selectPage('feedback'); selectTab('docs'); } },
            { key: 'dialog', label: t.pages.dialog, icon: <ChevronRight size={16} />, onSelect: () => { selectPage('dialog'); selectTab('docs'); } },
            { key: 'alert-dialog', label: t.pages['alert-dialog'], icon: <AlertTriangle size={16} />, onSelect: () => { selectPage('alert-dialog'); selectTab('docs'); } },
            { key: 'sheet', label: t.pages.sheet, icon: <PanelRightClose size={16} />, onSelect: () => { selectPage('sheet'); selectTab('docs'); } },
            { key: 'popover', label: t.pages.popover, icon: <ChevronRight size={16} />, onSelect: () => { selectPage('popover'); selectTab('docs'); } },
            { key: 'tooltip', label: t.pages.tooltip, icon: <ChevronRight size={16} />, onSelect: () => { selectPage('tooltip'); selectTab('docs'); } },
            { key: 'hover-card', label: t.pages['hover-card'], icon: <ChevronRight size={16} />, onSelect: () => { selectPage('hover-card'); selectTab('docs'); } },
            { key: 'dropdown-menu', label: t.pages['dropdown-menu'], icon: <ChevronRight size={16} />, onSelect: () => { selectPage('dropdown-menu'); selectTab('docs'); } },
            { key: 'context-menu', label: t.pages['context-menu'], icon: <ChevronRight size={16} />, onSelect: () => { selectPage('context-menu'); selectTab('docs'); } },
            { key: 'command-palette', label: t.pages['command-palette'], icon: <Search size={16} />, onSelect: () => { selectPage('command-palette'); selectTab('docs'); } },
            { key: 'code-block', label: t.pages['code-block'], icon: <FileCode2 size={16} />, onSelect: () => { selectPage('code-block'); selectTab('docs'); } },
            { key: 'language-switcher', label: t.pages['language-switcher'], icon: <Globe size={16} />, onSelect: () => { selectPage('language-switcher'); selectTab('docs'); } },
            { key: 'navigation-menu', label: t.pages['navigation-menu'], icon: <Navigation size={16} />, onSelect: () => { selectPage('navigation-menu'); selectTab('docs'); } },
            { key: 'menubar', label: t.pages.menubar, icon: <Menu size={16} />, onSelect: () => { selectPage('menubar'); selectTab('docs'); } },
            { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} />, onSelect: () => { selectPage('mobile'); selectTab('docs'); } },
            { key: 'mobile-list', label: t.pages['mobile-list'], icon: <List size={16} />, onSelect: () => { selectPage('mobile-list'); selectTab('docs'); } },
            { key: 'home-page', label: t.pages['home-page'], icon: <House size={16} />, onSelect: () => { selectPage('home-page'); selectTab('docs'); } },
            { key: 'login-page', label: t.pages['login-page'], icon: <LogIn size={16} />, onSelect: () => { selectPage('login-page'); selectTab('docs'); } },
            { key: 'register-page', label: t.pages['register-page'], icon: <UserPlus size={16} />, onSelect: () => { selectPage('register-page'); selectTab('docs'); } },
            { key: 'error-page', label: t.pages['error-page'], icon: <AlertTriangle size={16} />, onSelect: () => { selectPage('error-page'); selectTab('docs'); } },
            { key: 'privacy-policy', label: t.pages['privacy-policy'], icon: <ShieldCheck size={16} />, onSelect: () => { selectPage('privacy-policy'); selectTab('docs'); } },
            { key: 'terms-of-service', label: t.pages['terms-of-service'], icon: <FileText size={16} />, onSelect: () => { selectPage('terms-of-service'); selectTab('docs'); } },
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
      <Sheet
        variant="action"
        open={actionSheetOpen}
        onOpenChange={(v) => { if (!v) setActionSheetOpen(false); }}
        title={mobileView === 'docs' ? (locale === 'zh' ? '页面操作' : 'Page actions') : (locale === 'zh' ? '快捷操作' : 'Quick actions')}
        description={mobileView === 'docs' ? (locale === 'zh' ? '为当前页面选择一个动作。' : 'Choose an action for this page.') : (locale === 'zh' ? '浏览首页、文档、账户与语言入口。' : 'Open home, docs, account, and language actions.')}
      >
        {mobileView === 'docs' ? (
          <>
            <Sheet.Item icon={<Star size={18} />} onClick={() => setActionSheetOpen(false)}>{locale === 'zh' ? '收藏页面' : 'Bookmark page'}</Sheet.Item>
            <Sheet.Item icon={<Download size={18} />} onClick={() => setActionSheetOpen(false)}>{locale === 'zh' ? '下载 PDF' : 'Download PDF'}</Sheet.Item>
            <Sheet.Item icon={<Trash2 size={18} />} destructive onClick={() => setActionSheetOpen(false)}>{locale === 'zh' ? '清除历史' : 'Clear history'}</Sheet.Item>
          </>
        ) : (
          <>
            <Sheet.Item icon={<FileCode2 size={18} />} onClick={() => { setActionSheetOpen(false); selectPage('introduction'); }}>{pp.navDocs}</Sheet.Item>
            <Sheet.Item icon={<LogIn size={18} />} onClick={() => { setActionSheetOpen(false); setMobileView('login'); }}>{pp.navLogin}</Sheet.Item>
            <Sheet.Item icon={<UserPlus size={18} />} onClick={() => { setActionSheetOpen(false); setMobileView('register'); }}>{pp.navSignup}</Sheet.Item>
            <Sheet.Item icon={locale === 'zh' ? <Check size={18} /> : undefined} onClick={() => { setLocale('zh'); setActionSheetOpen(false); }}>中文</Sheet.Item>
            <Sheet.Item icon={locale === 'en' ? <Check size={18} /> : undefined} onClick={() => { setLocale('en'); setActionSheetOpen(false); }}>English</Sheet.Item>
            <Sheet.Item icon={<ShieldCheck size={18} />} onClick={() => { setActionSheetOpen(false); openLegalPage('privacy-policy'); }}>{pp.footerPrivacy}</Sheet.Item>
            <Sheet.Item icon={<FileText size={18} />} onClick={() => { setActionSheetOpen(false); openLegalPage('terms-of-service'); }}>{t.pages['terms-of-service']}</Sheet.Item>
            <Sheet.Item icon={<Smartphone size={18} />} onClick={() => { setActionSheetOpen(false); window.location.href = '/docs/introduction'; }}>{locale === 'zh' ? '桌面版文档' : 'Desktop docs'}</Sheet.Item>
          </>
        )}
      </Sheet>
    </>
  );
}
