/**
 * DesktopApp — 桌面端文档应用组件
 * 从 App.tsx 提取，包含文档导航、工具栏、页面渲染等逻辑
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, ArrowRight, Bell, ChevronRight, Globe, House,
  LogIn, Menu, Monitor, Moon, Palette, Search, SlidersHorizontal,
  Sun, User, UserPlus, Zap,
} from 'lucide-react';
import type { AppShellNavSection } from '../components/AppShell';
import { CodeBlock } from '../components/CodeBlock';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { locales, useI18n } from '../i18n';
import {
  Accordion, Alert, AppShell, Avatar, Badge, Breadcrumb, Button,
  Calendar, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Carousel, Checkbox, ColorPicker, ContextMenu, DatePicker, Dialog,
  DialogClose, DropdownMenu, EmptyState, FileUpload, Form, FormDescription,
  FormField, FormLabel, FormMessage, Heading, HoverCard, Input, Label,
  Menubar, MobileList, MobileListItem, MobileListSection, MultiSelect,
  NavigationMenu, NumberInput, Pagination, Popover, Progress, Radio,
  RadioGroup, Rating, ResizableHandle, ResizablePanel, ResizablePanelGroup,
  ScrollArea, SegmentedControl, Select, Separator, ShellNav, ShellNavItem,
  ShellNavSection, Sheet, Skeleton, Slider, Spinner, Stepper, Switch,
  Tabs, TabsContent, TabsList, TabsTrigger, Table, TagInput, Text,
  Textarea, TimePicker, Timeline, Toggle, ToggleGroup, Tooltip, TreeView,
  useTheme, useToast, useViewport,
} from '../lib';
import type { PageKey, AppRoute, ReleaseTrack, ViewerSession } from './routes';
import {
  DOC_PAGE_KEYS, SESSION_STORAGE_KEY, buildRoutePath, loadSession, parseRoute,
} from './routes';
import { DOC_NAV_GROUPS, getDocsGroupLabel, getDocsGroupDescription, pageIcons } from './nav-config';
import { QUICK_START_PREVIEW_SNIPPETS } from './doc-snippets';

interface DesktopAppProps {
  route: AppRoute;
  onNavigate: (nextRoute: AppRoute, options?: { replace?: boolean }) => void;
  onMobileNavToggle: () => void;
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  compactDensity: boolean;
  onCompactDensityChange: (dense: boolean) => void;
  releaseTrack: ReleaseTrack;
  onReleaseTrackChange: (track: ReleaseTrack) => void;
  viewerSession: ViewerSession | null;
  onLogin: (payload: { email: string; password: string; remember: boolean }) => void;
  onRegister: (payload: { name: string; email: string; password: string }) => void;
  onGuest: () => void;
  onLogout: () => void;
}

export function DesktopApp({
  route, onNavigate, onMobileNavToggle, mobileNavOpen,
  sidebarCollapsed, onSidebarToggle, searchOpen, onSearchOpenChange,
  compactDensity, onCompactDensityChange, releaseTrack, onReleaseTrackChange,
  viewerSession, onLogin, onRegister, onGuest, onLogout,
}: DesktopAppProps) {
  const { t, locale, setLocale } = useI18n();
  const isZh = locale === 'zh';
  const pages = t.pageDefs as Record<PageKey, import('./routes').PageDefinition>;
  const { push } = useToast();
  const { mode, setTheme, theme, themes } = useTheme();
  const { isTablet, isTabletPortrait } = useViewport();
  const themeEntries = Object.entries(themes);

  const [checkboxA, setCheckboxA] = useState(true);
  const [checkboxB, setCheckboxB] = useState(false);
  const [radioValue, setRadioValue] = useState('system');
  const [sliderValue, setSliderValue] = useState(68);
  const [paginationPage, setPaginationPage] = useState(4);
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['react', 'typescript']);
  const [selectEnv, setSelectEnv] = useState<string | undefined>(undefined);
  const [selectRegionA, setSelectRegionA] = useState<string | undefined>(undefined);
  const [selectRegionB, setSelectRegionB] = useState<string | undefined>(undefined);
  const [timeValue, setTimeValue] = useState<string | undefined>(undefined);
  const [paginationDemoPage, setPaginationDemoPage] = useState(1);
  const docsTopbarRef = useRef<HTMLElement | null>(null);
  const docHeaderRef = useRef<HTMLElement | null>(null);
  const [docsTopbarWidth, setDocsTopbarWidth] = useState<number>(() => (typeof window === 'undefined' ? 0 : window.innerWidth));
  const [isDocHeaderInView, setIsDocHeaderInView] = useState(true);

  const copy = isZh ? {
    docsBadge: '统一响应式 UI 框架',
    docsTitle: '一套资源，覆盖手机、平板与桌面',
    docsLead: '首页、登录页、注册页、错误页、隐私政策、服务条款和文档内容库全部运行在同一套路由、同一套布局壳层与同一套设计 Token 上。',
    docsPrimary: '查看快速开始',
    docsSecondary: '返回首页',
    splitTitle: '不再维护独立移动端应用',
    splitBody: '手机端通过抽屉导航、一列排版和内容重排适配，而不是切换到另一套 /m 路由和另一套页面组件。',
    libraryTitle: '文档内容库',
    libraryLead: '每个章节都可搜索、可预览、可直接打开真实页面。',
    supportTitle: '响应式支撑',
    supportCards: [
      { label: '手机', accent: '单列', description: '关键操作保持在拇指可达区域，侧边导航收拢为抽屉，内容卡片自然堆叠。' },
      { label: '平板', accent: '双列', description: '保留文档上下文与工具区，同时把表单、统计卡和内容区平衡到双列结构。' },
      { label: '桌面', accent: '三轨', description: '支持长文档、实时预览和控制面板并行出现，无需复制组件与状态管理。' },
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
      templates: '模板页面', templatesDesc: '首页、认证、错误与法务',
      docs: '文档条目', docsDesc: '单一内容树驱动导航与搜索',
      breakpoints: '断点层级', breakpointsDesc: '手机 / 平板 / 桌面',
      themes: '主题预设', themesDesc: '统一作用于全站',
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
    accountMenu: '账户',
  } : {
    docsBadge: 'Unified Responsive UI Framework',
    docsTitle: 'One resource system for phone, tablet, and desktop',
    docsLead: 'The home page, login, register, error, privacy policy, terms of service, and documentation library now run on one route tree, one layout shell, and one token system.',
    docsPrimary: 'Open Quick Start',
    docsSecondary: 'Back to Home',
    splitTitle: 'No separate mobile application anymore',
    splitBody: 'Phone layouts now adapt through drawer navigation, single-column composition, and content reflow instead of switching to a second /m route tree.',
    libraryTitle: 'Documentation Library',
    libraryLead: 'Every section is searchable, previewable, and linked to the full live page.',
    supportTitle: 'Responsive Support',
    supportCards: [
      { label: 'Phone', accent: 'Single column', description: 'Primary actions stay thumb-reachable, the sidebar becomes a drawer, and cards stack without losing hierarchy.' },
      { label: 'Tablet', accent: 'Two columns', description: 'The shell keeps context visible while forms, stats, and content rebalance into comfortable two-column compositions.' },
      { label: 'Desktop', accent: 'Three tracks', description: 'Long-form docs, live previews, and controls can sit side by side without duplicating components or state.' },
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
      templates: 'Template screens', templatesDesc: 'Home, auth, error, and legal',
      docs: 'Doc entries', docsDesc: 'One content tree drives nav and search',
      breakpoints: 'Breakpoints', breakpointsDesc: 'Phone / tablet / desktop',
      themes: 'Theme presets', themesDesc: 'Applied across the whole app',
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
    accountMenu: 'Account',
  };

  const activePage = route.view === 'docs' ? route.page ?? 'introduction' : 'introduction';
  const activeDocument = pages[activePage] ?? pages.introduction;
  const isDocDetailPage = route.view === 'docs' && activePage !== 'introduction';
  const showPinnedDocTitle = isDocDetailPage && !isDocHeaderInView;
  const topbarDocLabel = showPinnedDocTitle ? activeDocument.title : (isZh ? '文档' : 'Documentation');

  // Toolbar overflow calculation
  const isTabletLandscape = isTablet && !isTabletPortrait;
  const TOOLBAR_OVERHEAD = isTabletLandscape ? 40 : (isTabletPortrait ? 130 : 246);
  const TOOLBAR_GAP = 10;
  const MORE_BTN_WIDTH = 92;
  const TOOLBAR_ITEM_WIDTHS = [130, 110, 170, 105, 95, 125];
  const availableForActions = docsTopbarWidth > 0 ? docsTopbarWidth - TOOLBAR_OVERHEAD : 9999;
  const totalAllWidths = TOOLBAR_ITEM_WIDTHS.reduce((sum, w, i) => sum + w + (i > 0 ? TOOLBAR_GAP : 0), 0);
  let docsToolbarVisibleCount: number;
  if (totalAllWidths <= availableForActions) {
    docsToolbarVisibleCount = TOOLBAR_ITEM_WIDTHS.length;
  } else {
    const inlineBudget = availableForActions - MORE_BTN_WIDTH - TOOLBAR_GAP;
    let acc = 0;
    docsToolbarVisibleCount = 0;
    for (const w of TOOLBAR_ITEM_WIDTHS) {
      const needed = docsToolbarVisibleCount === 0 ? w : acc + TOOLBAR_GAP + w;
      if (needed <= inlineBudget) { acc = needed; docsToolbarVisibleCount++; } else break;
    }
  }

  const densityLabel = isZh ? `密度：${compactDensity ? '紧凑' : '舒适'}` : `Density: ${compactDensity ? 'Compact' : 'Comfortable'}`;
  const themeMenuItems = themeEntries.map(([themeName, definition]) => ({
    label: `${definition.label ?? themeName}${theme === themeName ? (isZh ? ' (当前)' : ' (current)') : ''}`,
    icon: <Palette size={14} />,
    onClick: () => setTheme(themeName),
  }));

  const accountMenuItems = viewerSession
    ? [{ label: t.publicPages.navLogout, icon: <User size={14} />, onClick: onLogout }]
    : [
        { label: t.publicPages.navLogin, icon: <LogIn size={14} />, onClick: () => onNavigate({ view: 'login' }) },
        { label: t.publicPages.navSignup, icon: <UserPlus size={14} />, onClick: () => onNavigate({ view: 'register' }) },
      ];

  const docsControlMenuGroups = [
    {
      label: isZh ? '导航' : 'Navigation',
      items: [
        { label: t.publicPages.backHome, icon: <House size={14} />, onClick: () => onNavigate({ view: 'home' }) },
        { label: t.searchTrigger, icon: <Search size={14} />, shortcut: '⌘K', onClick: () => onSearchOpenChange(true) },
      ],
    },
    {
      label: isZh ? '视图' : 'View',
      items: [{ label: densityLabel, icon: <SlidersHorizontal size={14} />, onClick: () => onCompactDensityChange(!compactDensity) }],
    },
    { label: isZh ? '主题' : 'Theme', items: themeMenuItems },
    { label: copy.accountMenu, items: accountMenuItems },
    {
      label: isZh ? '语言' : 'Language',
      items: Object.entries(locales).map(([localeKey, definition]) => ({
        label: `${definition.label}${locale === localeKey ? (isZh ? ' (当前)' : ' (current)') : ''}`,
        icon: <Globe size={14} />,
        onClick: () => setLocale(localeKey),
      })),
    },
  ];

  const metricCards = [
    { label: copy.metrics.templates, value: '6', hint: copy.metrics.templatesDesc },
    { label: copy.metrics.docs, value: String(DOC_PAGE_KEYS.length), hint: copy.metrics.docsDesc },
    { label: copy.metrics.breakpoints, value: '3', hint: copy.metrics.breakpointsDesc },
    { label: copy.metrics.themes, value: String(themeEntries.length), hint: copy.metrics.themesDesc },
  ];

  const searchEntries = useMemo<import('../components/CommandPalette').SearchEntry[]>(
    () => DOC_PAGE_KEYS.map((key) => ({
      key,
      title: pages[key].title,
      section: pages[key].section,
      description: pages[key].description,
      keywords: pages[key].guidance,
    })),
    [pages],
  );

  const navSections = useMemo<AppShellNavSection[]>(
    () => DOC_NAV_GROUPS.map((group) => ({
      key: group.key,
      title: getDocsGroupLabel(group.key, isZh),
      items: group.items.map((item) => {
        if (typeof item === 'string') {
          const pageKey = item;
          return {
            key: pageKey,
            label: pages[pageKey].title,
            icon: pageIcons[pageKey],
            active: pageKey === activePage,
            onSelect: () => onNavigate({ view: 'docs', page: pageKey }),
          };
        }
        const title = isZh ? locales.zh.families[item.i18nKey] : locales.en.families[item.i18nKey];
        return {
          key: item.key,
          label: title,
          icon: item.icon,
          children: item.pages.map((pageKey) => ({
            key: pageKey,
            label: pages[pageKey].title,
            icon: pageIcons[pageKey],
            active: pageKey === activePage,
            onSelect: () => onNavigate({ view: 'docs', page: pageKey }),
          })),
        };
      }),
    })),
    [activePage, isZh, pages, onNavigate],
  );

  // ResizeObserver for topbar width
  useEffect(() => {
    const target = docsTopbarRef.current;
    if (!target) return;
    const syncWidth = () => setDocsTopbarWidth(target.getBoundingClientRect().width);
    syncWidth();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDocsTopbarWidth(entry ? entry.contentRect.width : target.getBoundingClientRect().width);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver for doc header
  useEffect(() => {
    if (!isDocDetailPage) { setIsDocHeaderInView(true); return; }
    const target = docHeaderRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') { setIsDocHeaderInView(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => setIsDocHeaderInView(entry.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [isDocDetailPage, activePage]);

  // Render helpers
  function renderCodeBlock(code: string, language: 'tsx' | 'bash' = 'tsx') {
    return (
      <CodeBlock code={code} language={language}
        copyLabel={isZh ? '复制代码' : 'Copy code'}
        copiedLabel={isZh ? '已复制' : 'Copied'}
        onCopy={async (c) => { try { await navigator.clipboard.writeText(c); return true; } catch { return false; } }}
      />
    );
  }

  function renderTemplateLauncher(pageKey: Extract<PageKey, 'home-page' | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service'>) {
    const actionMap: Record<typeof pageKey, () => void> = {
      'home-page': () => onNavigate({ view: 'home' }),
      'login-page': () => onNavigate({ view: 'login' }),
      'register-page': () => onNavigate({ view: 'register' }),
      'error-page': () => onNavigate({ view: 'error' }),
      'privacy-policy': () => onNavigate({ view: 'privacy-policy' }),
      'terms-of-service': () => onNavigate({ view: 'terms-of-service' }),
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
          <ArrowRight size={16} /> {copy.openPage}
        </Button>
      </div>
    );
  }

  // Main render
  return (
    <AppShell
      brand="VXUI"
      brandCaption={isZh ? 'React 组件库' : 'React component library'}
      topbarRef={docsTopbarRef}
      breadcrumb={
        <div className="vx-doc-breadcrumb" data-state={isDocDetailPage ? 'detail' : 'overview'}>
          <span className="vx-doc-breadcrumb__kicker">{topbarDocLabel}</span>
          {showPinnedDocTitle && <><span className="vx-topbar__separator">/</span><strong>{activeDocument.title}</strong></>}
        </div>
      }
      title={activeDocument.title}
      description={activeDocument.description}
      navSections={navSections}
      sidebarCollapsed={sidebarCollapsed}
      mobileNavOpen={mobileNavOpen}
      density={compactDensity ? 'compact' : undefined}
      onSidebarToggle={onSidebarToggle}
      onMobileNavToggle={onMobileNavToggle}
      headerActions={
        <div className="vx-docs-toolbar">
          {docsToolbarVisibleCount >= 1 && (
            <Button variant="ghost" size="sm" onClick={() => onNavigate({ view: 'home' })}>
              <House size={16} /> {isZh ? '首页' : 'Home'}
            </Button>
          )}
          {docsToolbarVisibleCount >= 2 && (
            <Button variant="ghost" size="sm" onClick={() => onSearchOpenChange(true)}>
              <Search size={16} /> {isZh ? '搜索' : 'Search'} <kbd className="vx-search-kbd">⌘K</kbd>
            </Button>
          )}
          {docsToolbarVisibleCount >= 3 && (
            <Button variant="ghost" size="sm" onClick={() => onCompactDensityChange(!compactDensity)}>
              <SlidersHorizontal size={16} /> {densityLabel}
            </Button>
          )}
          {docsToolbarVisibleCount >= 4 && (
            <DropdownMenu
              trigger={<Button variant="ghost" size="sm"><Palette size={16} /> {isZh ? '主题' : 'Theme'}</Button>}
              items={themeMenuItems}
            />
          )}
          {docsToolbarVisibleCount >= 5 && (
            <DropdownMenu
              trigger={<Button variant="ghost" size="sm"><User size={16} /> {viewerSession?.name ?? (isZh ? '账户' : 'Account')}</Button>}
              items={accountMenuItems}
            />
          )}
          {docsToolbarVisibleCount >= 6 && <LanguageSwitcher variant="inline" />}
          {docsToolbarVisibleCount < 6 && (
            <DropdownMenu
              trigger={<Button variant="ghost" size="sm"><Menu size={16} /></Button>}
              groups={docsControlMenuGroups}
            />
          )}
        </div>
      }
    >
      {/* Content rendering based on route - simplified for now */}
      <div className="vx-docs-workspace">
        {route.view === 'home' && (
          <div className="vx-docs-workspace__home">
            <div className="vx-docs-home__hero">
              <div className="vx-docs-home__copy">
                <Badge variant="accent">{copy.docsBadge}</Badge>
                <h1>{copy.docsTitle}</h1>
                <p>{copy.docsLead}</p>
                <div className="vx-docs-home__actions">
                  <Button onClick={() => onNavigate({ view: 'docs', page: 'quick-start' })}>
                    <Zap size={16} /> {copy.docsPrimary}
                  </Button>
                  <Button variant="secondary" onClick={() => onNavigate({ view: 'docs', page: 'introduction' })}>
                    {copy.docsSecondary}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Other page rendering would go here */}
      </div>
    </AppShell>
  );
}
