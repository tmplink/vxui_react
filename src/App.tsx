import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  ChevronRight,
  Compass,
  FileCode2,
  FileText,
  House,
  LayoutDashboard,
  List,
  LogIn,
  Palette,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';
import { CommandPalette } from './components/CommandPalette';
import type { SearchEntry } from './components/CommandPalette';
import type { AppShellNavSection } from './components/AppShell';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ErrorPage } from './components/pages/ErrorPage';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { useI18n } from './i18n';
import {
  Accordion,
  Alert,
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  Input,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Switch,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useTheme,
  useToast,
} from './lib';

const DOC_PAGE_KEYS = [
  'introduction',
  'quick-start',
  'shell-sidebar',
  'grid-page',
  'elements',
  'form-controls',
  'form-inputs',
  'navigation',
  'data-list',
  'empty-states',
  'toasts',
  'feedback',
  'overlays',
  'nav-layout',
  'data-display',
  'mobile',
  'home-page',
  'login-page',
  'register-page',
  'error-page',
  'privacy-policy',
  'terms-of-service',
] as const;

type PageKey = (typeof DOC_PAGE_KEYS)[number];
type NavGroupKey = 'gettingStarted' | 'layout' | 'components' | 'feedback' | 'templates' | 'mobile';
type RouteView = 'home' | 'login' | 'register' | 'docs' | 'privacy-policy' | 'terms-of-service' | 'error';
type ReleaseTrack = 'stable' | 'preview' | 'internal';

interface AppRoute {
  view: RouteView;
  page?: PageKey;
  path?: string;
}

interface PageDefinition {
  section: string;
  title: string;
  description: string;
  guidance: string[];
}

interface ViewerSession {
  name: string;
  mode: 'member' | 'guest';
}

const SESSION_STORAGE_KEY = 'vxui-react-auth-session';

const DOC_NAV_GROUPS: Array<{ key: NavGroupKey; pages: PageKey[] }> = [
  { key: 'gettingStarted', pages: ['introduction', 'quick-start'] },
  { key: 'layout', pages: ['shell-sidebar', 'grid-page', 'nav-layout'] },
  {
    key: 'components',
    pages: ['elements', 'form-controls', 'form-inputs', 'overlays', 'navigation', 'data-display'],
  },
  { key: 'feedback', pages: ['data-list', 'empty-states', 'toasts', 'feedback'] },
  {
    key: 'templates',
    pages: ['home-page', 'login-page', 'register-page', 'error-page', 'privacy-policy', 'terms-of-service'],
  },
  { key: 'mobile', pages: ['mobile'] },
];

const pageIcons: Record<PageKey, ReactNode> = {
  introduction: <Compass size={16} />,
  'quick-start': <Zap size={16} />,
  'shell-sidebar': <PanelsTopLeft size={16} />,
  'grid-page': <LayoutDashboard size={16} />,
  elements: <Sparkles size={16} />,
  'form-controls': <FileText size={16} />,
  'form-inputs': <SlidersHorizontal size={16} />,
  navigation: <Compass size={16} />,
  'data-list': <List size={16} />,
  'empty-states': <AlertTriangle size={16} />,
  toasts: <Bell size={16} />,
  feedback: <ShieldCheck size={16} />,
  overlays: <ChevronRight size={16} />,
  'nav-layout': <LayoutDashboard size={16} />,
  'data-display': <Boxes size={16} />,
  mobile: <Smartphone size={16} />,
  'home-page': <House size={16} />,
  'login-page': <LogIn size={16} />,
  'register-page': <UserPlus size={16} />,
  'error-page': <AlertTriangle size={16} />,
  'privacy-policy': <ShieldCheck size={16} />,
  'terms-of-service': <FileCode2 size={16} />,
};

function isPageKey(value: string | undefined): value is PageKey {
  return Boolean(value && DOC_PAGE_KEYS.includes(value as PageKey));
}

function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

function parseRoute(pathname: string): AppRoute {
  const normalized = normalizePath(pathname);

  if (normalized === '/') return { view: 'home' };
  if (normalized === '/login') return { view: 'login' };
  if (normalized === '/register') return { view: 'register' };
  if (normalized === '/privacy-policy') return { view: 'privacy-policy' };
  if (normalized === '/terms-of-service') return { view: 'terms-of-service' };
  if (normalized === '/error') return { view: 'error' };
  if (normalized === '/docs') return { view: 'docs', page: 'introduction' };

  if (normalized.startsWith('/docs/')) {
    const pageKey = normalized.split('/')[2];

    if (isPageKey(pageKey)) {
      return { view: 'docs', page: pageKey };
    }
  }

  return { view: 'error', path: normalized };
}

function buildRoutePath(route: AppRoute) {
  switch (route.view) {
    case 'home':
      return '/';
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'privacy-policy':
      return '/privacy-policy';
    case 'terms-of-service':
      return '/terms-of-service';
    case 'error':
      return '/error';
    case 'docs':
    default:
      return `/docs/${route.page ?? 'introduction'}`;
  }
}

function loadSession(): ViewerSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ViewerSession>;

    if (typeof parsed.name === 'string' && (parsed.mode === 'member' || parsed.mode === 'guest')) {
      return { name: parsed.name, mode: parsed.mode };
    }
  } catch {
    return null;
  }

  return null;
}

export default function App() {
  const { t, locale } = useI18n();
  const isZh = locale === 'zh';
  const pages = t.pageDefs as Record<PageKey, PageDefinition>;
  const { push } = useToast();
  const { mode, setTheme, theme, themes } = useTheme();
  const themeEntries = Object.entries(themes);
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return { view: 'home' };
    return parseRoute(window.location.pathname);
  });
  const [viewerSession, setViewerSession] = useState<ViewerSession | null>(loadSession);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);
  const [releaseTrack, setReleaseTrack] = useState<ReleaseTrack>('stable');
  const [checkboxA, setCheckboxA] = useState(true);
  const [checkboxB, setCheckboxB] = useState(false);
  const [radioValue, setRadioValue] = useState('system');
  const [sliderValue, setSliderValue] = useState(68);
  const [paginationPage, setPaginationPage] = useState(4);

  const copy = isZh
    ? {
        docsBadge: '统一响应式 UI 框架',
        docsTitle: '一套资源，覆盖手机、平板与桌面',
        docsLead:
          '首页、登录页、注册页、错误页、隐私政策、服务条款和文档内容库全部运行在同一套路由、同一套布局壳层与同一套设计 Token 上。',
        docsPrimary: '查看快速开始',
        docsSecondary: '返回首页',
        splitTitle: '不再维护独立移动端应用',
        splitBody: '手机端通过抽屉导航、一列排版和内容重排适配，而不是切换到另一套 /m 路由和另一套页面组件。',
        libraryTitle: '文档内容库',
        libraryLead: '每个章节都可搜索、可预览、可直接打开真实页面。',
        supportTitle: '响应式支撑',
        supportCards: [
          {
            label: '手机',
            accent: '单列',
            description: '关键操作保持在拇指可达区域，侧边导航收拢为抽屉，内容卡片自然堆叠。',
          },
          {
            label: '平板',
            accent: '双列',
            description: '保留文档上下文与工具区，同时把表单、统计卡和内容区平衡到双列结构。',
          },
          {
            label: '桌面',
            accent: '三轨',
            description: '支持长文档、实时预览和控制面板并行出现，无需复制组件与状态管理。',
          },
        ],
        architectureTitle: '统一信息架构',
        architectureLead: '搜索、导航、预览和页面跳转绑定到同一个内容模型，不再分裂成两套应用。',
        architectureBullets: [
          '桌面端保留常驻导航和工具栏，适合长文档浏览。',
          '平板端压缩密度与栅格，不改动页面层级和数据源。',
          '手机端将侧边栏转成抽屉，仍然使用同一套路由和组件。',
        ],
        rolloutTitle: '落地方式',
        rolloutItems: [
          { key: 'shell', title: '统一入口', content: '入口只渲染一个 App，所有设备共享同一套路由解析和状态管理。' },
          { key: 'pages', title: '统一页面树', content: '首页、认证页、错误页、法务页和文档页全部保留在同一个页面树中。' },
          { key: 'shell-responsive', title: '统一壳层响应式', content: '侧边栏在窄屏收为抽屉，顶部工具区自动换行，内容从多列过渡为单列。' },
        ],
        releaseLabel: '发布轨道',
        releaseOptions: { stable: '稳定版', preview: '预览版', internal: '内部版' },
        contentMapTitle: '内容地图',
        metrics: {
          templates: '模板页面',
          templatesDesc: '首页、认证、错误与法务',
          docs: '文档条目',
          docsDesc: '单一内容树驱动导航与搜索',
          breakpoints: '断点层级',
          breakpointsDesc: '手机 / 平板 / 桌面',
          themes: '主题预设',
          themesDesc: '统一作用于全站',
        },
        livePreview: '实时预览',
        openPage: '打开完整页面',
        deliveryTitle: '交付清单',
        responsiveTitle: '响应式检查',
        responsiveChecklist: [
          '主操作是否在 390px 宽度下仍位于首屏可见区域。',
          '文档导航是否从常驻侧栏平滑转为抽屉，不复制状态。',
          '卡片、表格和表单是否可从三列过渡为单列而不溢出。',
        ],
        runtimeTitle: '控制台',
        runtimeDesc: '把主题、密度和会话状态视为全局能力，而不是页面特例。',
        sessionMember: '成员视图',
        sessionGuest: '访客视图',
        quickStartTabs: { install: '安装', theme: '主题', launch: '落地' },
        installCode: "npm install vxui-react\nimport 'vxui-react/styles.css';",
        themeCode: '<ThemeProvider themes={themePresets}>...</ThemeProvider>',
        launchCode: '<AppShell navSections={docsNav} />',
        accountMenu: '账户',
      }
    : {
        docsBadge: 'Unified Responsive UI Framework',
        docsTitle: 'One resource system for phone, tablet, and desktop',
        docsLead:
          'The home page, login, register, error, privacy policy, terms of service, and documentation library now run on one route tree, one layout shell, and one token system.',
        docsPrimary: 'Open Quick Start',
        docsSecondary: 'Back to Home',
        splitTitle: 'No separate mobile application anymore',
        splitBody: 'Phone layouts now adapt through drawer navigation, single-column composition, and content reflow instead of switching to a second /m route tree.',
        libraryTitle: 'Documentation Library',
        libraryLead: 'Every section is searchable, previewable, and linked to the full live page.',
        supportTitle: 'Responsive Support',
        supportCards: [
          {
            label: 'Phone',
            accent: 'Single column',
            description: 'Primary actions stay thumb-reachable, the sidebar becomes a drawer, and cards stack without losing hierarchy.',
          },
          {
            label: 'Tablet',
            accent: 'Two columns',
            description: 'The shell keeps context visible while forms, stats, and content rebalance into comfortable two-column compositions.',
          },
          {
            label: 'Desktop',
            accent: 'Three tracks',
            description: 'Long-form docs, live previews, and controls can sit side by side without duplicating components or state.',
          },
        ],
        architectureTitle: 'Unified Information Architecture',
        architectureLead: 'Search, navigation, previews, and route changes are all driven by the same content model instead of two different apps.',
        architectureBullets: [
          'Desktop keeps persistent navigation and a utility-rich header for long-form browsing.',
          'Tablet compresses density and grid structure without changing routes or data sources.',
          'Phone turns the sidebar into a drawer while keeping the same components and route ownership.',
        ],
        rolloutTitle: 'How It Lands',
        rolloutItems: [
          { key: 'shell', title: 'Single entry point', content: 'The entry now renders one App, so every device shares the same route parsing and state model.' },
          { key: 'pages', title: 'Single page tree', content: 'Home, auth, error, legal, and docs remain in one page tree instead of being copied for mobile.' },
          { key: 'shell-responsive', title: 'Responsive shell', content: 'The sidebar collapses into a drawer on narrow screens, the top bar wraps, and content shifts from multi-column to single-column layouts.' },
        ],
        releaseLabel: 'Release Track',
        releaseOptions: { stable: 'Stable', preview: 'Preview', internal: 'Internal' },
        contentMapTitle: 'Content Map',
        metrics: {
          templates: 'Template screens',
          templatesDesc: 'Home, auth, error, and legal',
          docs: 'Doc entries',
          docsDesc: 'One content tree drives nav and search',
          breakpoints: 'Breakpoints',
          breakpointsDesc: 'Phone / tablet / desktop',
          themes: 'Theme presets',
          themesDesc: 'Applied across the whole app',
        },
        livePreview: 'Live preview',
        openPage: 'Open full page',
        deliveryTitle: 'Delivery Checklist',
        responsiveTitle: 'Responsive Checklist',
        responsiveChecklist: [
          'Keep the primary action visible within a 390px viewport.',
          'Turn docs navigation into a drawer instead of duplicating route state.',
          'Let cards, tables, and forms reflow from three columns to one without overflow.',
        ],
        runtimeTitle: 'Control Panel',
        runtimeDesc: 'Treat theme, density, and session state as app-wide capabilities instead of page-specific exceptions.',
        sessionMember: 'Member view',
        sessionGuest: 'Guest view',
        quickStartTabs: { install: 'Install', theme: 'Theme', launch: 'Launch' },
        installCode: "npm install vxui-react\nimport 'vxui-react/styles.css';",
        themeCode: '<ThemeProvider themes={themePresets}>...</ThemeProvider>',
        launchCode: '<AppShell navSections={docsNav} />',
        accountMenu: 'Account',
      };

  const activePage = route.view === 'docs' ? route.page ?? 'introduction' : 'introduction';
  const activeDocument = pages[activePage] ?? pages.introduction;

  const metricCards = [
    { label: copy.metrics.templates, value: '6', hint: copy.metrics.templatesDesc },
    { label: copy.metrics.docs, value: String(DOC_PAGE_KEYS.length), hint: copy.metrics.docsDesc },
    { label: copy.metrics.breakpoints, value: '3', hint: copy.metrics.breakpointsDesc },
    { label: copy.metrics.themes, value: String(themeEntries.length), hint: copy.metrics.themesDesc },
  ];

  const searchEntries = useMemo<SearchEntry[]>(
    () =>
      DOC_PAGE_KEYS.map((key) => ({
        key,
        title: pages[key].title,
        section: pages[key].section,
        description: pages[key].description,
        keywords: pages[key].guidance,
      })),
    [pages],
  );

  const navSections = useMemo<AppShellNavSection[]>(
    () =>
      DOC_NAV_GROUPS.map((group) => ({
        key: group.key,
        title: t.nav[group.key],
        items: group.pages.map((pageKey) => ({
          key: pageKey,
          label: pages[pageKey].title,
          icon: pageIcons[pageKey],
          active: pageKey === activePage,
          onSelect: () => navigate({ view: 'docs', page: pageKey }),
        })),
      })),
    [activePage, pages, t],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parsed = parseRoute(window.location.pathname);

    if (!(parsed.view === 'error' && parsed.path && parsed.path !== '/error')) {
      const canonicalPath = buildRoutePath(parsed);

      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState(parsed, '', canonicalPath);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
      setMobileNavOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false);
      } else {
        setMobileNavOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [route]);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function navigate(nextRoute: AppRoute, options?: { replace?: boolean }) {
    setRoute(nextRoute);

    if (typeof window === 'undefined') return;

    if (nextRoute.view === 'error' && nextRoute.path && nextRoute.path !== '/error') {
      return;
    }

    const nextPath = buildRoutePath(nextRoute);

    if (window.location.pathname === nextPath) return;

    const method = options?.replace ? 'replaceState' : 'pushState';
    window.history[method](nextRoute, '', nextPath);
  }

  function persistSession(session: ViewerSession | null) {
    setViewerSession(session);

    if (typeof window === 'undefined') return;

    if (session) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  function goBack(fallback: AppRoute) {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate(fallback, { replace: true });
  }

  function handleLogin(payload: { email: string; password: string; remember: boolean }) {
    const session = {
      name: payload.email.split('@')[0] || 'member',
      mode: 'member' as const,
    };

    persistSession(session);
    push({
      tone: 'success',
      title: t.publicPages.sessionLoginTitle,
      description: t.publicPages.sessionLoginBody,
    });
    navigate({ view: 'docs', page: 'introduction' });
  }

  function handleRegister(payload: { name: string; email: string; password: string }) {
    persistSession({ name: payload.name, mode: 'member' });
    push({
      tone: 'success',
      title: t.publicPages.sessionRegisterTitle,
      description: t.publicPages.sessionRegisterBody,
    });
    navigate({ view: 'docs', page: 'introduction' });
  }

  function handleGuest() {
    persistSession({ name: t.publicPages.guestLabel, mode: 'guest' });
    push({
      tone: 'info',
      title: t.publicPages.sessionGuestTitle,
      description: t.publicPages.sessionGuestBody,
    });
    navigate({ view: 'docs', page: 'introduction' });
  }

  function handleLogout() {
    persistSession(null);
    push({
      tone: 'info',
      title: t.publicPages.sessionLogoutTitle,
      description: t.publicPages.sessionLogoutBody,
    });
    navigate({ view: 'home' });
  }

  function renderTemplateLauncher(
    pageKey: Extract<PageKey, 'home-page' | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service'>,
  ) {
    const actionMap: Record<typeof pageKey, () => void> = {
      'home-page': () => navigate({ view: 'home' }),
      'login-page': () => navigate({ view: 'login' }),
      'register-page': () => navigate({ view: 'register' }),
      'error-page': () => navigate({ view: 'error' }),
      'privacy-policy': () => navigate({ view: 'privacy-policy' }),
      'terms-of-service': () => navigate({ view: 'terms-of-service' }),
    };

    return (
      <div className="vx-template-launch">
        <div className="vx-template-launch__head">
          <span className="vx-template-launch__icon">{pageIcons[pageKey]}</span>
          <div>
            <strong>{pages[pageKey].title}</strong>
            <p>{pages[pageKey].description}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={actionMap[pageKey]}>
          <ArrowRight size={16} />
          {copy.openPage}
        </Button>
      </div>
    );
  }

  function renderSample(pageKey: PageKey) {
    switch (pageKey) {
      case 'quick-start':
        return (
          <Tabs defaultValue="install">
            <TabsList>
              <TabsTrigger value="install">{copy.quickStartTabs.install}</TabsTrigger>
              <TabsTrigger value="theme">{copy.quickStartTabs.theme}</TabsTrigger>
              <TabsTrigger value="launch">{copy.quickStartTabs.launch}</TabsTrigger>
            </TabsList>
            <TabsContent value="install">
              <pre className="vx-code-block">
                <code>{copy.installCode}</code>
              </pre>
            </TabsContent>
            <TabsContent value="theme">
              <pre className="vx-code-block">
                <code>{copy.themeCode}</code>
              </pre>
            </TabsContent>
            <TabsContent value="launch">
              <pre className="vx-code-block">
                <code>{copy.launchCode}</code>
              </pre>
            </TabsContent>
          </Tabs>
        );
      case 'shell-sidebar':
        return (
          <div className="vx-doc-shell-sample">
            <div className="vx-doc-shell-sample__nav">
              <span>{isZh ? '导航' : 'Navigation'}</span>
              <strong>Docs / Templates</strong>
            </div>
            <div className="vx-doc-shell-sample__main">
              <div className="vx-doc-shell-sample__bar">{isZh ? '顶部工具区' : 'Top tools'}</div>
              <div className="vx-doc-shell-sample__canvas">
                <div className="vx-doc-shell-sample__card" />
                <div className="vx-doc-shell-sample__card" />
                <div className="vx-doc-shell-sample__card vx-doc-shell-sample__card--wide" />
              </div>
            </div>
          </div>
        );
      case 'grid-page':
        return (
          <div className="vx-doc-stat-grid">
            {metricCards.map((metric) => (
              <div key={metric.label} className="vx-doc-stat-grid__item">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.hint}</small>
              </div>
            ))}
          </div>
        );
      case 'elements':
        return (
          <div className="vx-doc-preview-stack">
            <div className="vx-doc-preview-inline">
              <Button>
                <Zap size={16} />
                {isZh ? '主要操作' : 'Primary action'}
              </Button>
              <Button variant="secondary">{isZh ? '次级操作' : 'Secondary'}</Button>
              <Button variant="ghost">{isZh ? '幽灵按钮' : 'Ghost'}</Button>
            </div>
            <div className="vx-doc-preview-inline">
              <Badge variant="accent">Brand</Badge>
              <Badge variant="success">Live</Badge>
              <Badge variant="warning">Beta</Badge>
            </div>
            <Alert title={isZh ? '统一风格' : 'Unified styling'} variant="info">
              {isZh ? '基础元素在所有页面共享同一套颜色、圆角和交互节奏。' : 'Core elements now share the same color, radius, and interaction rhythm across the whole app.'}
            </Alert>
          </div>
        );
      case 'form-controls':
        return (
          <div className="vx-doc-preview-stack">
            <Input
              label={isZh ? '项目名称' : 'Project name'}
              value="VXUI Responsive Workspace"
              readOnly
            />
            <Select
              label={copy.releaseLabel}
              value={releaseTrack}
              onChange={(event) => setReleaseTrack(event.target.value as ReleaseTrack)}
            >
              <option value="stable">{copy.releaseOptions.stable}</option>
              <option value="preview">{copy.releaseOptions.preview}</option>
              <option value="internal">{copy.releaseOptions.internal}</option>
            </Select>
            <Textarea
              label={isZh ? '变更摘要' : 'Change summary'}
              value={
                isZh
                  ? '整合移动端与桌面端资源，统一路由、壳层和页面模板。'
                  : 'Consolidate mobile and desktop resources into one route tree, one shell, and one set of page templates.'
              }
              readOnly
              resize="none"
            />
          </div>
        );
      case 'form-inputs':
        return (
          <div className="vx-doc-preview-stack">
            <div className="vx-doc-preview-stack__group">
              <Checkbox
                checked={checkboxA}
                label={isZh ? '默认启用响应式抽屉' : 'Enable responsive drawer by default'}
                onChange={(event) => setCheckboxA(event.target.checked)}
              />
              <Checkbox
                checked={checkboxB}
                label={isZh ? '显示调试边界' : 'Show debug boundaries'}
                onChange={(event) => setCheckboxB(event.target.checked)}
              />
            </div>
            <RadioGroup label={isZh ? '密度策略' : 'Density strategy'}>
              <Radio
                checked={radioValue === 'system'}
                label={isZh ? '跟随系统' : 'Follow system'}
                name="density-strategy"
                onChange={() => setRadioValue('system')}
              />
              <Radio
                checked={radioValue === 'comfortable'}
                label={isZh ? '舒适' : 'Comfortable'}
                name="density-strategy"
                onChange={() => setRadioValue('comfortable')}
              />
              <Radio
                checked={radioValue === 'compact'}
                label={isZh ? '紧凑' : 'Compact'}
                name="density-strategy"
                onChange={() => setRadioValue('compact')}
              />
            </RadioGroup>
            <Slider
              label={isZh ? '文档完成度' : 'Documentation coverage'}
              max={100}
              min={0}
              onChange={(event) => setSliderValue(Number(event.target.value))}
              showValue
              value={sliderValue}
            />
          </div>
        );
      case 'navigation':
        return (
          <div className="vx-doc-preview-stack">
            <Tabs defaultValue="library">
              <TabsList>
                <TabsTrigger value="library">{copy.libraryTitle}</TabsTrigger>
                <TabsTrigger value="templates">{t.nav.templates}</TabsTrigger>
                <TabsTrigger value="responsive">{t.nav.mobile}</TabsTrigger>
              </TabsList>
              <TabsContent value="library">{copy.libraryLead}</TabsContent>
              <TabsContent value="templates">{pages['home-page'].description}</TabsContent>
              <TabsContent value="responsive">{pages.mobile.description}</TabsContent>
            </Tabs>
            <Pagination page={paginationPage} total={96} pageSize={8} onChange={setPaginationPage} />
          </div>
        );
      case 'data-list':
        return (
          <Table
            columns={[
              { key: 'name', header: isZh ? '页面' : 'Screen', accessor: (row) => row.name },
              {
                key: 'status',
                header: isZh ? '状态' : 'Status',
                accessor: (row) => <Badge variant={row.variant}>{row.status}</Badge>,
              },
              { key: 'updated', header: isZh ? '更新时间' : 'Updated', accessor: (row) => row.updated },
            ]}
            data={[
              {
                name: pages['home-page'].title,
                status: isZh ? '已整合' : 'Unified',
                updated: '2026-05-08',
                variant: 'success' as const,
              },
              {
                name: pages['error-page'].title,
                status: isZh ? '新增' : 'New',
                updated: '2026-05-08',
                variant: 'accent' as const,
              },
              {
                name: pages.mobile.title,
                status: isZh ? '已重写' : 'Reframed',
                updated: '2026-05-08',
                variant: 'warning' as const,
              },
            ]}
          />
        );
      case 'empty-states':
        return (
          <div className="vx-doc-empty-state">
            <div className="vx-doc-empty-state__icon">
              <AlertTriangle size={20} />
            </div>
            <strong>{isZh ? '这里暂时没有内容' : 'Nothing lives here yet'}</strong>
            <p>
              {isZh ? '空状态与错误页共享同一套视觉策略，只是语气更轻。' : 'Empty states now share the same visual language as error handling, with a lighter tone.'}
            </p>
            <Button variant="secondary" onClick={() => navigate({ view: 'error' })}>
              {copy.openPage}
            </Button>
          </div>
        );
      case 'toasts':
        return (
          <div className="vx-doc-preview-inline vx-doc-preview-inline--wrap">
            <Button
              onClick={() =>
                push({
                  tone: 'info',
                  title: isZh ? '文档树已同步' : 'Docs tree synced',
                  description: isZh ? '所有页面都已映射到统一的响应式壳层。' : 'Every page is now mapped to the unified responsive shell.',
                })
              }
            >
              {isZh ? '信息提示' : 'Info toast'}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                push({
                  tone: 'success',
                  title: isZh ? '路由更新完成' : 'Route update complete',
                  description: isZh ? '桌面端、平板和手机已共享同一套页面定义。' : 'Desktop, tablet, and phone now share one page definition set.',
                })
              }
            >
              {isZh ? '成功提示' : 'Success toast'}
            </Button>
          </div>
        );
      case 'feedback':
        return (
          <div className="vx-doc-preview-stack">
            <Alert title={isZh ? '迁移进度' : 'Migration progress'} variant="info">
              {isZh ? '响应式壳层、模板页面和文档内容库已经收敛到同一套运行时。' : 'The responsive shell, template pages, and docs library now share the same runtime.'}
            </Alert>
            <Progress label={isZh ? '重构完成度' : 'Refactor completion'} showLabel value={sliderValue} />
            <div className="vx-doc-skeleton-grid">
              <Skeleton lines={3} variant="text" />
              <Skeleton height={92} />
            </div>
          </div>
        );
      case 'overlays':
        return (
          <div className="vx-doc-preview-inline vx-doc-preview-inline--wrap">
            <Popover
              content={
                <div className="vx-doc-popover-copy">
                  {isZh ? 'Popover 用于补充上下文，而不是承载另一套页面层级。' : 'Popover adds context instead of carrying a second page hierarchy.'}
                </div>
              }
            >
              <Button variant="secondary">Popover</Button>
            </Popover>
            <DropdownMenu
              trigger={<Button variant="secondary">{isZh ? '更多操作' : 'More actions'}</Button>}
              items={[
                { label: isZh ? '打开首页' : 'Open home', icon: <House size={14} />, onClick: () => navigate({ view: 'home' }) },
                { label: isZh ? '打开文档' : 'Open docs', icon: <Search size={14} />, onClick: () => navigate({ view: 'docs', page: 'introduction' }) },
                { label: isZh ? '查看错误页' : 'Open error page', icon: <AlertTriangle size={14} />, onClick: () => navigate({ view: 'error' }) },
              ]}
            />
          </div>
        );
      case 'nav-layout':
        return (
          <Accordion
            defaultOpen={['hierarchy']}
            items={[
              {
                key: 'hierarchy',
                title: isZh ? '层级保持一致' : 'Hierarchy stays consistent',
                content: isZh ? '所有断点共享同一路由和文档分组。' : 'Every breakpoint shares the same route tree and documentation grouping.',
              },
              {
                key: 'density',
                title: isZh ? '壳层只调密度' : 'The shell only adjusts density',
                content: isZh ? '导航抽屉、顶部工具区和内容栅格按宽度变化，不复制页面实现。' : 'The drawer, header tools, and content grids adapt by width instead of copying page implementations.',
              },
              {
                key: 'legal',
                title: isZh ? '法律页面也纳入同一体系' : 'Legal pages live in the same system',
                content: isZh ? '隐私政策与服务条款使用相同的公共框架与响应式排版。' : 'Privacy policy and terms share the same public shell and responsive typography.',
              },
            ]}
          />
        );
      case 'data-display':
        return (
          <div className="vx-doc-preview-stack">
            <div className="vx-doc-preview-inline">
              <Avatar name="Alice Chen" size="sm" />
              <Avatar name="Bo Wang" size="md" />
              <Avatar name="Cora Lin" size="lg" />
            </div>
            <Table
              columns={[
                { key: 'name', header: isZh ? '角色' : 'Role', accessor: (row) => row.name },
                { key: 'scope', header: isZh ? '负责范围' : 'Scope', accessor: (row) => row.scope },
                {
                  key: 'status',
                  header: isZh ? '状态' : 'Status',
                  accessor: (row) => <Badge variant={row.variant}>{row.status}</Badge>,
                },
              ]}
              data={[
                { name: isZh ? '设计系统' : 'Design system', scope: isZh ? '公共组件' : 'Shared primitives', status: isZh ? '稳定' : 'Stable', variant: 'success' as const },
                { name: isZh ? '文档库' : 'Documentation', scope: isZh ? '内容导航' : 'Content navigation', status: isZh ? '在线' : 'Live', variant: 'accent' as const },
                { name: isZh ? '模板页' : 'Templates', scope: isZh ? '公共入口' : 'Public entry points', status: isZh ? '已统一' : 'Unified', variant: 'warning' as const },
              ]}
            />
          </div>
        );
      case 'mobile':
        return (
          <div className="vx-breakpoint-grid">
            {copy.supportCards.map((card) => (
              <div key={card.label} className="vx-breakpoint-card">
                <Badge variant="accent">{card.accent}</Badge>
                <strong>{card.label}</strong>
                <p>{card.description}</p>
              </div>
            ))}
            <Alert title={copy.splitTitle} variant="info">
              {copy.splitBody}
            </Alert>
          </div>
        );
      case 'home-page':
      case 'login-page':
      case 'register-page':
      case 'error-page':
      case 'privacy-policy':
      case 'terms-of-service':
        return renderTemplateLauncher(pageKey);
      case 'introduction':
      default:
        return null;
    }
  }

  function renderDocsHome() {
    return (
      <div className="vx-docs-workspace__home">
        <section className="vx-docs-home__hero">
          <div className="vx-docs-home__copy">
            <Badge variant="accent">{copy.docsBadge}</Badge>
            <h1>{copy.docsTitle}</h1>
            <p>{copy.docsLead}</p>
            <div className="vx-docs-home__actions">
              <Button size="lg" onClick={() => navigate({ view: 'docs', page: 'quick-start' })}>
                <Zap size={16} />
                {copy.docsPrimary}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate({ view: 'home' })}>
                <House size={16} />
                {copy.docsSecondary}
              </Button>
            </div>
            <Alert title={copy.splitTitle} variant="info">
              {copy.splitBody}
            </Alert>
          </div>

          <Card className="vx-docs-home__panel">
            <CardHeader>
              <CardTitle>{copy.contentMapTitle}</CardTitle>
              <CardDescription>{copy.libraryLead}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-doc-metric-grid">
                {metricCards.map((metric) => (
                  <div key={metric.label} className="vx-doc-metric-grid__item">
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small>{metric.hint}</small>
                  </div>
                ))}
              </div>
              <div className="vx-doc-control-grid">
                <Select label={copy.releaseLabel} value={releaseTrack} onChange={(event) => setReleaseTrack(event.target.value as ReleaseTrack)}>
                  <option value="stable">{copy.releaseOptions.stable}</option>
                  <option value="preview">{copy.releaseOptions.preview}</option>
                  <option value="internal">{copy.releaseOptions.internal}</option>
                </Select>
                <Switch
                  checked={compactDensity}
                  description={t.docs.compactDensityDesc}
                  label={t.docs.compactDensity}
                  onCheckedChange={setCompactDensity}
                />
              </div>
              <div className="vx-doc-content-map">
                {DOC_NAV_GROUPS.map((group) => (
                  <button
                    key={group.key}
                    type="button"
                    className="vx-doc-content-map__row"
                    onClick={() => navigate({ view: 'docs', page: group.pages[0] })}
                  >
                    <div>
                      <strong>{t.nav[group.key]}</strong>
                      <span>{group.pages.length} {isZh ? '个条目' : 'entries'}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{copy.supportTitle}</h2>
            <p>{copy.libraryLead}</p>
          </div>
          <div className="vx-breakpoint-grid">
            {copy.supportCards.map((card) => (
              <Card key={card.label} className="vx-breakpoint-card vx-breakpoint-card--panel">
                <CardHeader>
                  <Badge variant="accent">{card.accent}</Badge>
                  <CardTitle>{card.label}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{copy.libraryTitle}</h2>
            <p>{copy.libraryLead}</p>
          </div>
          <div className="vx-doc-library-grid">
            {DOC_NAV_GROUPS.map((group) => (
              <Card key={group.key} className="vx-doc-library-card">
                <CardHeader>
                  <CardTitle>{t.nav[group.key]}</CardTitle>
                  <CardDescription>{group.pages.length} {isZh ? '个章节' : 'sections'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="vx-doc-library-card__links">
                    {group.pages.map((pageKey) => (
                      <button
                        key={pageKey}
                        type="button"
                        className="vx-doc-library-card__link"
                        onClick={() => navigate({ view: 'docs', page: pageKey })}
                      >
                        <span>{pageIcons[pageKey]}</span>
                        <span>{pages[pageKey].title}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{copy.architectureTitle}</h2>
            <p>{copy.architectureLead}</p>
          </div>
          <div className="vx-doc-architecture-grid">
            <Card>
              <CardHeader>
                <CardTitle>{copy.architectureTitle}</CardTitle>
                <CardDescription>{copy.architectureLead}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="vx-doc-list">
                  {copy.architectureBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{copy.rolloutTitle}</CardTitle>
                <CardDescription>{isZh ? '本次重构的一步到位路径。' : 'The one-step delivery path for this refactor.'}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion items={copy.rolloutItems} defaultOpen={['shell']} />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  function renderDocPage() {
    const relatedPages =
      DOC_NAV_GROUPS.find((group) => group.pages.includes(activePage))?.pages.filter((pageKey) => pageKey !== activePage).slice(0, 3) ?? [];

    return (
      <article className="vx-doc-page">
        <section className="vx-doc-page__hero">
          <div>
            <span className="vx-doc-page__kicker">{activeDocument.section}</span>
            <h1>{activeDocument.title}</h1>
            <p>{activeDocument.description}</p>
          </div>
          <div className="vx-doc-page__meta">
            <span className="vx-version-pill">{copy.livePreview}</span>
            <span className="vx-version-pill vx-version-pill--token">{copy.releaseOptions[releaseTrack]}</span>
          </div>
        </section>

        <div className="vx-doc-page__grid">
          <Card>
            <CardHeader>
              <CardTitle>{t.docs.guidance}</CardTitle>
              <CardDescription>{t.docs.guidanceDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="vx-doc-list">
                {activeDocument.guidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="vx-doc-page__preview-card">
            <CardHeader>
              <CardTitle>{t.docs.preview}</CardTitle>
              <CardDescription>{t.docs.previewDesc}</CardDescription>
            </CardHeader>
            <CardContent>{renderSample(activePage)}</CardContent>
          </Card>
        </div>

        <div className="vx-doc-page__grid vx-doc-page__grid--support">
          <Card>
            <CardHeader>
              <CardTitle>{copy.deliveryTitle}</CardTitle>
              <CardDescription>{isZh ? '当前章节可直接落地的实现要点。' : 'The implementation points you can ship directly from this section.'}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="vx-doc-list vx-doc-list--tight">
                {activeDocument.guidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{copy.responsiveTitle}</CardTitle>
              <CardDescription>{pages.mobile.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="vx-doc-list vx-doc-list--tight">
                {copy.responsiveChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{copy.runtimeTitle}</CardTitle>
              <CardDescription>{copy.runtimeDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-doc-runtime-panel">
                <div className="vx-doc-runtime-panel__themes">
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
                <Switch
                  checked={compactDensity}
                  description={t.docs.compactDensityDesc}
                  label={t.docs.compactDensity}
                  onCheckedChange={setCompactDensity}
                />
                <div className="vx-doc-runtime-panel__links">
                  {relatedPages.map((pageKey) => (
                    <button
                      key={pageKey}
                      type="button"
                      className="vx-doc-runtime-panel__link"
                      onClick={() => navigate({ view: 'docs', page: pageKey })}
                    >
                      <span>{pageIcons[pageKey]}</span>
                      <span>{pages[pageKey].title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>
    );
  }

  if (route.view === 'home') {
    return (
      <HomePage
        viewerName={viewerSession?.name ?? null}
        onLogin={() => navigate({ view: 'login' })}
        onRegister={() => navigate({ view: 'register' })}
        onDocs={(pageKey) => navigate({ view: 'docs', page: isPageKey(pageKey) ? pageKey : 'introduction' })}
        onPrivacy={() => navigate({ view: 'privacy-policy' })}
        onLogout={handleLogout}
      />
    );
  }

  if (route.view === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={() => navigate({ view: 'register' })}
        onGuest={handleGuest}
        onBack={() => navigate({ view: 'home' })}
      />
    );
  }

  if (route.view === 'register') {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onLogin={() => navigate({ view: 'login' })}
        onGuest={handleGuest}
        onPrivacy={() => navigate({ view: 'privacy-policy' })}
        onTerms={() => navigate({ view: 'terms-of-service' })}
        onBack={() => navigate({ view: 'home' })}
      />
    );
  }

  if (route.view === 'privacy-policy') {
    return <PrivacyPolicyPage onBack={() => navigate({ view: 'home' })} />;
  }

  if (route.view === 'terms-of-service') {
    return <TermsOfServicePage onBack={() => navigate({ view: 'home' })} />;
  }

  if (route.view === 'error') {
    return (
      <ErrorPage
        requestedPath={route.path}
        statusCode={404}
        onBack={() => goBack({ view: 'home' })}
        onDocs={() => navigate({ view: 'docs', page: 'introduction' })}
        onHome={() => navigate({ view: 'home' })}
      />
    );
  }

  return (
    <>
      <CommandPalette
        ariaLabel={t.searchAriaLabel}
        emptyText={t.searchEmpty}
        entries={searchEntries}
        labelClose={t.searchClose}
        labelGo={t.searchGo}
        labelNavigate={t.searchNavigate}
        onClose={() => setSearchOpen(false)}
        onSelect={(key) => navigate({ view: 'docs', page: key as PageKey })}
        open={searchOpen}
        placeholder={t.searchPlaceholder}
      />

      <AppShell
        brand="vxUI"
        brandCaption={isZh ? '统一响应式系统' : 'Unified responsive system'}
        brandIcon={<Sparkles size={16} />}
        breadcrumb={
          <div className="vx-doc-breadcrumb">
            <span className="vx-doc-breadcrumb__kicker">{activeDocument.section}</span>
            <strong>{activeDocument.title}</strong>
            <span className="vx-doc-breadcrumb__summary">{activeDocument.description}</span>
          </div>
        }
        headerActions={
          <div className="vx-docs-toolbar">
            <button type="button" className="vx-cmd-trigger" onClick={() => navigate({ view: 'home' })}>
              <House size={14} />
              {t.publicPages.backHome}
            </button>
            <button type="button" className="vx-cmd-trigger" onClick={() => setSearchOpen(true)}>
              <Search size={14} />
              {t.searchTrigger}
              <kbd>⌘K</kbd>
            </button>
            <DropdownMenu
              trigger={
                <button type="button" className="vx-cmd-trigger">
                  <Palette size={14} />
                  {themes[theme]?.label ?? theme}
                </button>
              }
              items={themeEntries.map(([themeName, definition]) => ({
                label: definition.label ?? themeName,
                onClick: () => setTheme(themeName),
              }))}
            />
            <DropdownMenu
              trigger={
                <button type="button" className="vx-cmd-trigger">
                  <User size={14} />
                  {viewerSession?.name ?? t.publicPages.guestLabel}
                </button>
              }
              groups={[
                {
                  label: copy.accountMenu,
                  items: viewerSession
                    ? [
                        {
                          label: t.publicPages.navLogout,
                          icon: <User size={14} />,
                          onClick: handleLogout,
                        },
                      ]
                    : [
                        {
                          label: t.publicPages.navLogin,
                          icon: <LogIn size={14} />,
                          onClick: () => navigate({ view: 'login' }),
                        },
                        {
                          label: t.publicPages.navSignup,
                          icon: <UserPlus size={14} />,
                          onClick: () => navigate({ view: 'register' }),
                        },
                      ],
                },
              ]}
            />
            <LanguageSwitcher variant="inline" />
          </div>
        }
        menuButtonLabel={isZh ? '切换导航' : 'Toggle navigation'}
        mobileNavOpen={mobileNavOpen}
        navSections={navSections}
        onMobileNavToggle={() => setMobileNavOpen((current) => !current)}
        onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
        sidebarCloseLabel={t.sidebarCloseLabel}
        sidebarCollapseLabel={t.sidebarCollapse}
        sidebarExpandLabel={t.sidebarExpand}
        sidebarCollapsed={sidebarCollapsed}
        sidebarFooter={
          <div className="vx-sidebar-session">
            <div className="vx-sidebar-session__card">
              <span>{viewerSession ? copy.sessionMember : copy.sessionGuest}</span>
              <strong>{viewerSession?.name ?? t.publicPages.guestLabel}</strong>
            </div>
            <div className="vx-sidebar-session__meta">
              <span className="vx-version-pill">{t.versionLabel}</span>
              <span className="vx-version-pill vx-version-pill--token">{t.modeLabel(mode)}</span>
            </div>
          </div>
        }
      >
        <div className="vx-docs-workspace" data-density={compactDensity ? 'compact' : 'comfortable'}>
          {activePage === 'introduction' ? renderDocsHome() : renderDocPage()}
        </div>
      </AppShell>
    </>
  );
}