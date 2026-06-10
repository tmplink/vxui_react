/**
 * DesktopApp — 桌面端文档应用组件
 * 精简版，文案/辅助函数已提取到独立文件
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Globe, House, LogIn, Menu, Monitor, Moon, MoreHorizontal, Palette, Search,
  SlidersHorizontal, Sun, User, UserPlus, Zap, AlertTriangle, Bell,
} from 'lucide-react';
import type { AppShellNavSection } from '../components/AppShell';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { locales, useI18n } from '../i18n';
import {
  AppShell, Button, DropdownMenu, useTheme, useToast, useViewport,
  VXUIProvider, BottomNav,
  BREAKPOINTS, PHONE_MAX_WIDTH, PHONE_ASPECT_RATIO_THRESHOLD, TABLET_ASPECT_RATIO_THRESHOLD,
  Accordion, Alert, Avatar, Badge, Breadcrumb, Calendar, Card, CardContent,
  CardDescription, CardHeader, CardTitle, Carousel, Checkbox, ColorPicker,
  ContextMenu, DatePicker, Dialog, DialogClose, DropdownMenu as DM,
  EmptyState, FileUpload, Form, FormField, FormLabel, FormDescription,
  FormMessage, Heading, HoverCard, Input, Label, Menubar, MobileList,
  MobileListItem, MobileListSection, MultiSelect, NavigationMenu,
  NumberInput, Pagination, Popover, Progress, Radio, RadioGroup, Rating,
  ResizableHandle, ResizablePanel, ResizablePanelGroup, ScrollArea,
  SegmentedControl, Select, Separator, ShellNav, ShellNavItem,
  ShellNavSection, Sheet, Skeleton, Slider, Spinner, Stepper, Switch,
  Tabs, TabsContent, TabsList, TabsTrigger, Table, TagInput, Text,
  Textarea, TimePicker, Timeline, Toggle, ToggleGroup, Tooltip, TreeView,
} from '../lib';
import type { PageKey, AppRoute, ReleaseTrack, ViewerSession, PageDefinition } from './routes';
import { DOC_PAGE_KEYS } from './routes';
import { DOC_NAV_GROUPS, getDocsGroupLabel, getDocsGroupDescription, pageIcons } from './nav-config';
import { QUICK_START_PREVIEW_SNIPPETS } from './doc-snippets';
import { CommandPalette } from '../components/CommandPalette';
import type { SearchEntry } from '../components/CommandPalette';
import { DocsHome } from './DocsHome';
import { DocPage } from './DocPage';
import { getDocsCopy, getDocsHomeCopy } from './doc-copy';
import { createDocHelpers } from './doc-helpers';
import { useIntersectionInView } from '../hooks/useIntersectionInView';

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
  const pages = t.pageDefs as Record<PageKey, PageDefinition>;
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
  const { ref: docHeaderRef, isInView: isDocHeaderInView } = useIntersectionInView({ rootMargin: '-72px 0px 0px 0px' });

  const copy = getDocsCopy(isZh);
  const docsHomeCopy = getDocsHomeCopy(isZh);
  const helpers = createDocHelpers(isZh, pages, copy, onNavigate, push);

  const activePage: PageKey = route.view === 'docs' ? route.page ?? 'introduction' : 'introduction';
  const activeDocument = pages[activePage] ?? pages.introduction;
  const isDocDetailPage = route.view === 'docs' && route.page !== undefined;
  const showPinnedDocTitle = isDocDetailPage && !isDocHeaderInView;
  const topbarDocLabel = showPinnedDocTitle ? activeDocument.title : (isZh ? '文档' : 'Documentation');

  // CSS handles responsive visibility via media queries in docs-toolbar.css
  // All toolbar items are always rendered — JS no longer calculates widths
  const showBack = true;
  const showSearch = true;
  const showDensity = true;
  const showThemeBtn = true;
  const showAccountBtn = true;
  const showLanguageBtn = true;
  const showMoreMenu = true;

  const densityLabel = isZh ? `密度：${compactDensity ? '紧凑' : '舒适'}` : `Density: ${compactDensity ? 'Compact' : 'Comfortable'}`;

  const themeOptions = themeEntries.map(([themeName, definition]) => ({
    value: themeName,
    label: `${definition.label ?? themeName}${theme === themeName ? (isZh ? ' (当前)' : ' (current)') : ''}`,
  }));

  // 保留 DropdownMenu 格式用于更多菜单中的主题选项
  const themeMenuItems = themeOptions.map(option => ({
    label: option.label,
    icon: <Palette size={14} />,
    onClick: () => setTheme(option.value),
  }));
  const accountMenuItems = viewerSession
    ? [{ label: t.publicPages.navLogout, icon: <User size={14} />, onClick: onLogout }]
    : [
        { label: t.publicPages.navLogin, icon: <LogIn size={14} />, onClick: () => onNavigate({ view: 'login' }) },
        { label: t.publicPages.navSignup, icon: <UserPlus size={14} />, onClick: () => onNavigate({ view: 'register' }) },
        { label: t.publicPages.guestLabel, icon: <User size={14} />, onClick: onGuest },
      ];

  // Select 格式：选项列表（无持久选中值，通过 onChange 触发动作）
  const accountSelectOptions: import('../components/Select').SelectOption[] = viewerSession
    ? [{ value: 'logout', label: t.publicPages.navLogout }]
    : [
        { value: 'login',    label: t.publicPages.navLogin },
        { value: 'register', label: t.publicPages.navSignup },
        { value: 'guest',    label: t.publicPages.guestLabel },
      ];

  function handleAccountSelect(value: string | undefined) {
    if (!value) return;
    if (value === 'logout')   { onLogout(); return; }
    if (value === 'guest')    { onGuest();  return; }
    if (value === 'login')    { onNavigate({ view: 'login' });    return; }
    if (value === 'register') { onNavigate({ view: 'register' }); return; }
  }

  const docsNavigationMenuGroup = {
    label: isZh ? '导航' : 'Navigation',
    items: [
      { label: t.publicPages.backHome, icon: <House size={14} />, onClick: () => onNavigate({ view: 'home' }) },
      { label: t.searchTrigger, icon: <Search size={14} />, shortcut: '⌘K', onClick: () => onSearchOpenChange(true) },
    ],
  };
  const docsViewMenuGroup = {
    label: isZh ? '视图' : 'View',
    items: [{ label: densityLabel, icon: <SlidersHorizontal size={14} />, onClick: () => onCompactDensityChange(!compactDensity) }],
  };
  const docsThemeMenuGroup = { label: isZh ? '主题' : 'Theme', items: themeMenuItems };
  const docsAccountMenuGroup = { label: copy.accountMenu, items: accountMenuItems };
  const docsLanguageMenuGroup = {
    label: isZh ? '语言' : 'Language',
    items: Object.entries(locales).map(([localeKey, definition]) => ({
      label: `${definition.label}${locale === localeKey ? (isZh ? ' (当前)' : ' (current)') : ''}`,
      icon: <Globe size={14} />,
      onClick: () => setLocale(localeKey),
    })),
  };
  const docsControlMenuGroups = [
    docsNavigationMenuGroup, docsViewMenuGroup, docsThemeMenuGroup,
    docsAccountMenuGroup, docsLanguageMenuGroup,
  ];

  const metricCards = [
    { label: copy.metrics.templates, value: '6', hint: copy.metrics.templatesDesc },
    { label: copy.metrics.docs, value: String(DOC_PAGE_KEYS.length), hint: copy.metrics.docsDesc },
    { label: copy.metrics.breakpoints, value: '3', hint: copy.metrics.breakpointsDesc },
    { label: copy.metrics.themes, value: String(themeEntries.length), hint: copy.metrics.themesDesc },
  ];

  const searchEntries = useMemo<SearchEntry[]>(
    () => DOC_PAGE_KEYS.map((key) => ({
      key, title: pages[key].title, section: pages[key].section,
      description: pages[key].description, keywords: pages[key].guidance,
      icon: pageIcons[key],
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
            key: pageKey, label: pages[pageKey].title, icon: pageIcons[pageKey],
            active: pageKey === activePage, onSelect: () => onNavigate({ view: 'docs', page: pageKey }),
          };
        }
        const title = isZh ? locales.zh.families[item.i18nKey] : locales.en.families[item.i18nKey];
        return {
          key: item.key, label: title, icon: item.icon,
          children: item.pages.map((pageKey) => ({
            key: pageKey, label: pages[pageKey].title, icon: pageIcons[pageKey],
            active: pageKey === activePage, onSelect: () => onNavigate({ view: 'docs', page: pageKey }),
          })),
        };
      }),
    })),
    [activePage, isZh, pages, onNavigate],
  );

  const docsHomeGroups = DOC_NAV_GROUPS.map((group) => ({
    ...group,
    pages: group.items.flatMap((item) => (typeof item === 'string' ? item : item.pages)),
    label: getDocsGroupLabel(group.key, isZh),
    description: getDocsGroupDescription(group.key, isZh),
  }));

  // ── renderSample ──
  function renderSample(pageKey: PageKey): ReactNode {
    const { renderCodeBlock, renderTemplateLauncher } = helpers;
    switch (pageKey) {
      case 'quick-start': {
        const tabs = [
          { value: 'install', label: isZh ? '安装' : 'Install', code: QUICK_START_PREVIEW_SNIPPETS.install },
          { value: 'providers', label: isZh ? 'Providers' : 'Providers', code: QUICK_START_PREVIEW_SNIPPETS.providers },
          { value: 'layout', label: isZh ? '页面壳层' : 'Layout', code: QUICK_START_PREVIEW_SNIPPETS.layout },
          { value: 'feedback', label: isZh ? '反馈' : 'Feedback', code: QUICK_START_PREVIEW_SNIPPETS.feedback },
        ] as const;
        return (
          <Tabs defaultValue="install">
            <TabsList>{tabs.map((tab) => (<TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>))}</TabsList>
            {tabs.map((tab) => (<TabsContent key={tab.value} value={tab.value}>{renderCodeBlock(tab.code, tab.value === 'install' ? 'bash' : 'tsx')}</TabsContent>))}
          </Tabs>
        );
      }
      case 'shell-sidebar':
        return (
          <div className="vx-preview-stack">
            <div style={{ background: 'var(--vx-surface)', border: '1px solid var(--vx-border)', borderRadius: 'var(--vx-radius-lg)', overflow: 'hidden' }}>
              <ShellNav label={isZh ? '导航示例' : 'Navigation demo'}>
                <ShellNavSection title={isZh ? '快速开始' : 'Getting started'}>
                  <ShellNavItem label={isZh ? '介绍' : 'Introduction'} active onSelect={() => {}} />
                </ShellNavSection>
                <ShellNavSection title={isZh ? '组件' : 'Components'}>
                  <ShellNavItem label={isZh ? '表单控件' : 'Form controls'} defaultOpen onSelect={() => {}}>
                    <ShellNavItem label={isZh ? '输入框' : 'Input'} onSelect={() => {}} />
                    <ShellNavItem label={isZh ? '多选框' : 'MultiSelect'} onSelect={() => {}} />
                    <ShellNavItem label={isZh ? '时间选择器' : 'TimePicker'} onSelect={() => {}} />
                  </ShellNavItem>
                  <ShellNavItem label={isZh ? '叠层浮层' : 'Overlays'} onSelect={() => {}}>
                    <ShellNavItem label={isZh ? '对话框' : 'Dialog'} onSelect={() => {}} />
                    <ShellNavItem label={isZh ? '抽屉' : 'Sheet'} onSelect={() => {}} />
                  </ShellNavItem>
                  <ShellNavItem label={isZh ? '导航' : 'Navigation'} onSelect={() => {}} />
                </ShellNavSection>
              </ShellNav>
            </div>
          </div>
        );
      case 'grid-page':
        return (
          <div className="vx-stats-grid">
            {metricCards.map((m) => (
              <div key={m.label} className="vx-stats-grid__item">
                <span>{m.label}</span><strong>{m.value}</strong><small>{m.hint}</small>
              </div>
            ))}
          </div>
        );
      case 'button':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Button>{isZh ? '主要按钮' : 'Primary'}</Button>
              <Button variant="secondary">{isZh ? '次级按钮' : 'Secondary'}</Button>
              <Button variant="ghost">{isZh ? '幽灵按钮' : 'Ghost'}</Button>
              <Button variant="danger">{isZh ? '危险按钮' : 'Danger'}</Button>
            </div>
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Button size="sm">{isZh ? '小' : 'Small'}</Button>
              <Button size="md">{isZh ? '中' : 'Medium'}</Button>
              <Button size="lg">{isZh ? '大' : 'Large'}</Button>
            </div>
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Button shape="square">{isZh ? '直角' : 'Square'}</Button>
              <Button shape="rect">{isZh ? '圆角' : 'Rounded'}</Button>
              <Button shape="pill">{isZh ? '胶囊' : 'Pill'}</Button>
              <Button variant="secondary" shape="pill">{isZh ? '次级胶囊' : 'Secondary pill'}</Button>
            </div>
            <Button fullWidth>{isZh ? '整行操作' : 'Full width action'}</Button>
          </div>
        );
      case 'elements':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline">
              <Button><Zap size={16} />{isZh ? '主要操作' : 'Primary action'}</Button>
              <Button variant="secondary">{isZh ? '次级操作' : 'Secondary'}</Button>
              <Button variant="ghost">{isZh ? '幽灵按钮' : 'Ghost'}</Button>
            </div>
            <div className="vx-preview-inline">
              <Badge variant="accent">Brand</Badge><Badge variant="success">Live</Badge><Badge variant="warning">Beta</Badge>
            </div>
            <Alert title={isZh ? '统一风格' : 'Unified styling'} variant="info">
              {isZh ? '基础元素在所有页面共享同一套颜色、圆角和交互节奏。' : 'Core elements now share the same color, radius, and interaction rhythm.'}
            </Alert>
            <div className="vx-preview-stack__group">
              <Heading level={1}>{isZh ? 'H1 标题' : 'Heading 1'}</Heading>
              <Heading level={2}>{isZh ? 'H2 标题' : 'Heading 2'}</Heading>
              <Heading level={3}>{isZh ? 'H3 标题' : 'Heading 3'}</Heading>
              <Text variant="secondary">{isZh ? '大段文本' : 'Lead text'}</Text>
              <Text variant="muted">{isZh ? '次要文本' : 'Muted text'}</Text>
            </div>
          </div>
        );
      case 'form-controls':
        return (
          <div className="vx-preview-stack">
            <Input label={isZh ? '项目名称' : 'Project name'} value="VXUI Workspace" readOnly />
            <Select label={copy.releaseLabel} value={releaseTrack}
              onChange={(v) => { if (v) onReleaseTrackChange(v as ReleaseTrack); }}
              options={[{ value: 'stable', label: copy.releaseOptions.stable }, { value: 'preview', label: copy.releaseOptions.preview }, { value: 'internal', label: copy.releaseOptions.internal }]} />
            <Select label={isZh ? '部署环境' : 'Environment'} value={selectEnv} onChange={setSelectEnv}
              clearable searchable={4} placeholder={isZh ? '选择环境…' : 'Select environment…'}
              options={[{ value: 'prod', label: isZh ? '生产' : 'Production' }, { value: 'staging', label: isZh ? '预发布' : 'Staging' }, { value: 'preview', label: isZh ? '预览' : 'Preview' }, { value: 'dev', label: isZh ? '开发' : 'Development' }, { value: 'sandbox', label: isZh ? '沙箱' : 'Sandbox' }]} />
            <MultiSelect label={isZh ? '技术栈' : 'Tech stack'} value={multiSelectValue} onChange={setMultiSelectValue} clearable
              options={[{ value: 'react', label: 'React' }, { value: 'typescript', label: 'TypeScript' }, { value: 'vite', label: 'Vite' }, { value: 'css', label: 'CSS' }]} />
            <TimePicker label={isZh ? '部署时间' : 'Deploy time'} value={timeValue} onChange={setTimeValue} placeholder={isZh ? '选择时间' : 'Select time'} />
            <Textarea label={isZh ? '变更摘要' : 'Change summary'} value={isZh ? '整合移动端与桌面端资源。' : 'Consolidate mobile and desktop resources.'} readOnly resize="none" />
            <div style={{ borderTop: '1px solid var(--vx-border)', paddingTop: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--vx-text-muted)', margin: '0 0 12px' }}>
                {isZh ? '堆叠验证' : 'Stacking verification'}
              </p>
              <div style={{ display: 'grid', gap: 12 }}>
                <Select label={isZh ? '来源区域' : 'Source region'} value={selectRegionA} onChange={setSelectRegionA}
                  placeholder={isZh ? '选择区域…' : 'Select region…'}
                  options={[{ value: 'us-east-1', label: 'US East' }, { value: 'us-west-2', label: 'US West' }, { value: 'eu-west-1', label: 'EU West' }, { value: 'ap-southeast-1', label: 'Singapore' }]} />
                <Select label={isZh ? '目标区域' : 'Target region'} value={selectRegionB} onChange={setSelectRegionB}
                  placeholder={isZh ? '选择区域…' : 'Select region…'}
                  options={[{ value: 'us-east-1', label: 'US East' }, { value: 'us-west-2', label: 'US West' }, { value: 'eu-west-1', label: 'EU West' }, { value: 'ap-southeast-1', label: 'Singapore' }]} />
              </div>
            </div>
          </div>
        );
      case 'form-inputs':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-stack__group">
              <Checkbox checked={checkboxA} label={isZh ? '默认启用响应式抽屉' : 'Enable responsive drawer'} onChange={(e) => setCheckboxA(e.target.checked)} />
              <Checkbox checked={checkboxB} label={isZh ? '显示调试边界' : 'Show debug boundaries'} onChange={(e) => setCheckboxB(e.target.checked)} />
            </div>
            <RadioGroup label={isZh ? '密度策略' : 'Density strategy'}>
              <Radio checked={radioValue === 'system'} label={isZh ? '跟随系统' : 'Follow system'} name="density" onChange={() => setRadioValue('system')} />
              <Radio checked={radioValue === 'comfortable'} label={isZh ? '舒适' : 'Comfortable'} name="density" onChange={() => setRadioValue('comfortable')} />
              <Radio checked={radioValue === 'compact'} label={isZh ? '紧凑' : 'Compact'} name="density" onChange={() => setRadioValue('compact')} />
            </RadioGroup>
            <SegmentedControl value={radioValue} onChange={setRadioValue} fullWidth
              options={[{ label: <><Monitor size={16} />{isZh ? '跟随系统' : 'System'}</>, value: 'system' }, { label: <><Sun size={16} />{isZh ? '浅色' : 'Light'}</>, value: 'comfortable' }, { label: <><Moon size={16} />{isZh ? '深色' : 'Dark'}</>, value: 'compact' }]} />
            <Slider label={isZh ? '文档完成度' : 'Coverage'} max={100} min={0} onChange={(e) => setSliderValue(Number(e.target.value))} showValue value={sliderValue} />
            <div className="vx-preview-stack__group" style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Toggle data-state="on">{isZh ? '自动保存' : 'Auto-save'}</Toggle>
                <Toggle>{isZh ? '多标签模式' : 'Multiple tabs'}</Toggle>
              </div>
              <Switch defaultChecked label={isZh ? '开启实验性功能' : 'Enable experimental features'} />
              <NumberInput min={0} max={100} defaultValue={10} label={isZh ? '阈值' : 'Threshold'} />
              <TagInput placeholder={isZh ? '添加标签...' : 'Add tag...'} defaultValue={['React', 'Vite']} />
              <FileUpload multiple label={isZh ? '上传附件' : 'Upload attachments'} />
              <div style={{ marginTop: 8 }}><Calendar /></div>
            </div>
          </div>
        );
      case 'navigation':
        return (
          <div className="vx-preview-stack">
            <Tabs defaultValue="library">
              <TabsList>
                <TabsTrigger value="library">{copy.libraryTitle}</TabsTrigger>
                <TabsTrigger value="templates">{isZh ? '模板' : 'Templates'}</TabsTrigger>
                <TabsTrigger value="responsive">{isZh ? '响应式' : 'Responsive'}</TabsTrigger>
              </TabsList>
              <TabsContent value="library">{copy.libraryLead}</TabsContent>
              <TabsContent value="templates">{pages['home-page']?.description}</TabsContent>
              <TabsContent value="responsive">{pages.mobile?.description}</TabsContent>
            </Tabs>
            <Pagination page={paginationPage} total={96} pageSize={8} onChange={setPaginationPage} />
          </div>
        );
      case 'data-list':
        return (
          <Table columns={[
            { key: 'name', header: isZh ? '页面' : 'Screen', accessor: (r: any) => r.name },
            { key: 'status', header: isZh ? '状态' : 'Status', accessor: (r: any) => <Badge variant={r.v}>{r.status}</Badge> },
            { key: 'updated', header: isZh ? '更新时间' : 'Updated', accessor: (r: any) => r.updated },
          ]} data={[
            { name: pages['home-page']?.title ?? 'Home', status: isZh ? '已整合' : 'Unified', updated: '2026-05-08', v: 'success' as const },
            { name: pages['error-page']?.title ?? 'Error', status: isZh ? '新增' : 'New', updated: '2026-05-08', v: 'accent' as const },
            { name: pages.mobile?.title ?? 'Mobile', status: isZh ? '已重写' : 'Reframed', updated: '2026-05-08', v: 'warning' as const },
          ]} />
        );
      case 'empty-states':
        return (
          <div className="vx-empty">
            <div className="vx-empty__icon"><AlertTriangle size={20} /></div>
            <strong>{isZh ? '这里暂时没有内容' : 'Nothing lives here yet'}</strong>
            <p>{isZh ? '空状态与错误页共享同一套视觉策略。' : 'Empty states share the same visual language.'}</p>
            <Button variant="secondary" onClick={() => onNavigate({ view: 'error' })}>{copy.openPage}</Button>
          </div>
        );
      case 'toasts':
        return (
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Button onClick={() => push({ tone: 'info', title: isZh ? '文档树已同步' : 'Docs tree synced', description: isZh ? '所有页面已映射到统一壳层。' : 'Every page is mapped to the unified shell.' })}>
              {isZh ? '信息提示' : 'Info toast'}
            </Button>
            <Button variant="secondary" onClick={() => push({ tone: 'success', title: isZh ? '路由更新完成' : 'Route update complete', description: isZh ? '桌面端、平板和手机已共享同一套页面定义。' : 'Desktop, tablet, and phone now share one page definition set.' })}>
              {isZh ? '成功提示' : 'Success toast'}
            </Button>
          </div>
        );
      case 'feedback':
        return (
          <div className="vx-preview-stack">
            <Alert title={isZh ? '迁移进度' : 'Migration progress'} variant="info">{isZh ? '响应式壳层、模板页面和文档内容库已经收敛到同一套运行时。' : 'The responsive shell, template pages, and docs library now share the same runtime.'}</Alert>
            <Progress label={isZh ? '默认' : 'Default'} showLabel value={sliderValue} />
            <Progress label={isZh ? '成功' : 'Success'} showLabel value={sliderValue} variant="success" />
            <Progress label={isZh ? '警告' : 'Warning'} showLabel value={sliderValue} variant="warning" />
            <Progress label={isZh ? '危险' : 'Danger'} showLabel value={sliderValue} variant="danger" />
            <Progress label={isZh ? '炫彩' : 'Rainbow'} showLabel value={sliderValue} variant="rainbow" size="lg" />
            <div className="vx-doc-skeleton-grid"><Skeleton lines={3} variant="text" /><Skeleton height={92} /></div>
            <div className="vx-preview-stack__group">
              <div className="vx-preview-inline"><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></div>
              <Stepper currentStep={2} steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]} />
            </div>
          </div>
        );
      case 'overlays':
        return (
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Dialog trigger={<Button variant="secondary">{isZh ? '打开对话框' : 'Open dialog'}</Button>}
              title={isZh ? '删除项目' : 'Delete project'} description={isZh ? '此操作将移除所有成员的访问权限。' : 'This action removes access for the whole team.'}
              confirmLabel={isZh ? '删除' : 'Delete'} cancelLabel={isZh ? '取消' : 'Cancel'} confirmVariant="danger">
              <div style={{ padding: '4px 0', lineHeight: 1.5, color: 'var(--vx-text-secondary)' }}>{isZh ? '此项目将被永久删除且无法恢复。' : 'This project will be removed permanently and cannot be recovered.'}</div>
            </Dialog>
            <Popover content={<div>{isZh ? 'Popover 用于补充上下文。' : 'Popover adds context.'}</div>}>
              <Button variant="secondary">Popover</Button>
            </Popover>
            <DropdownMenu trigger={<Button variant="secondary">{isZh ? '更多操作' : 'More actions'}</Button>}
              items={[{ label: isZh ? '打开首页' : 'Open home', onClick: () => onNavigate({ view: 'home' }) }, { label: isZh ? '打开文档' : 'Open docs', onClick: () => onNavigate({ view: 'docs', page: 'introduction' }) }]} />
            <Sheet trigger={<Button variant="secondary" size="sm">{isZh ? '底部抽屉' : 'Bottom sheet'}</Button>} title={isZh ? '通知设置' : 'Notifications'} side="bottom">
              <div className="vx-stack"><Switch label={isZh ? '邮件通知' : 'Email notifications'} defaultChecked /><Switch label={isZh ? '推送通知' : 'Push notifications'} defaultChecked /></div>
            </Sheet>
            <Tooltip content={isZh ? '这是一个工具提示' : 'This is a tooltip'}><Button variant="ghost">{isZh ? '工具提示' : 'Tooltip'}</Button></Tooltip>
          </div>
        );
      case 'nav-layout':
        return (
          <div className="vx-preview-stack">
            <Breadcrumb items={[{ label: 'Home' }, { label: 'Components' }, { label: 'Navigation' }]} />
            <Menubar menus={[{ label: 'File', items: [{ label: 'New', shortcut: '⌘N' }, { label: 'Open...', shortcut: '⌘O' }, { label: 'Exit', danger: true }] }, { label: 'Edit', items: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }] }]} />
            <Separator />
            <ScrollArea style
={{ height: 100, border: '1px solid var(--vx-border)', borderRadius: 'var(--vx-radius-md)', padding: 16 }}>
              {(isZh ? '此区域展示了 ScrollArea 组件的用法。' : 'This area demonstrates the ScrollArea component. ').repeat(20)}
            </ScrollArea>
            <Accordion defaultOpen={['hierarchy']} items={[
              { key: 'hierarchy', title: isZh ? '层级保持一致' : 'Hierarchy stays consistent', content: isZh ? '所有断点共享同一路由。' : 'Every breakpoint shares the same route tree.' },
              { key: 'density', title: isZh ? '壳层只调密度' : 'Shell adjusts density', content: isZh ? '导航抽屉、顶部工具区和内容栅格按宽度变化。' : 'The drawer, header tools, and content grids adapt by width.' },
            ]} />
          </div>
        );
      case 'data-display':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline"><Avatar name="Alice Chen" size="sm" /><Avatar name="Bo Wang" size="md" /><Avatar name="Cora Lin" size="lg" /></div>
            <Table columns={[{ key: 'name', header: isZh ? '角色' : 'Role', accessor: (r: any) => r.name }, { key: 'scope', header: 'Scope', accessor: (r: any) => r.scope }]}
              data={[{ name: isZh ? '设计系统' : 'Design system', scope: isZh ? '公共组件' : 'Shared primitives' }, { name: isZh ? '文档库' : 'Documentation', scope: isZh ? '内容导航' : 'Content navigation' }]} />
            <Timeline items={[{ title: isZh ? '已创建' : 'Created', time: '10:00 AM' }, { title: isZh ? '处理中' : 'Processing', time: '10:05 AM' }, { title: isZh ? '已完成' : 'Completed', time: '10:15 AM' }]} />
            <Carousel items={[
              <div key="1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, background: 'var(--vx-surface-elevated)', borderRadius: 'var(--vx-radius-md)' }}>Slide 1</div>,
              <div key="2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, background: 'var(--vx-surface-elevated)', borderRadius: 'var(--vx-radius-md)' }}>Slide 2</div>,
            ]} />
          </div>
        );
      case 'mobile-list':
        return (
          <div className="vx-preview-stack" style={{ maxWidth: 320, border: '1px solid var(--vx-color-border)', borderRadius: 8, overflow: 'hidden' }}>
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
      case 'mobile':
        return (
          <div className="vx-breakpoint-grid">
            {copy.supportCards?.map((card: any) => (
              <div key={card.label} className="vx-breakpoint-card">
                <Badge variant="accent">{card.accent}</Badge><strong>{card.label}</strong><p>{card.description}</p>
              </div>
            ))}
            <Alert title={copy.splitTitle} variant="info">{copy.splitBody}</Alert>
          </div>
        );
      case 'home-page':
      case 'login-page':
      case 'register-page':
      case 'error-page':
      case 'privacy-policy':
      case 'terms-of-service':
        return renderTemplateLauncher(pageKey);
      case 'command-palette':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline">
              <Button onClick={() => onSearchOpenChange(true)}>
                {isZh ? '打开搜索' : 'Open search'}<kbd className="vx-search-kbd">⌘K</kbd>
              </Button>
            </div>
            <Alert variant="info" title={isZh ? '键盘优先' : 'Keyboard first'}>
              {isZh ? '按下 ⌘K 即可随时唤起命令面板。' : 'Press ⌘K to open the palette from anywhere.'}
            </Alert>
          </div>
        );
      case 'code-block':
        return renderCodeBlock(isZh ? `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>点击我</Button>;\n}` : `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>Click me</Button>;\n}`, 'tsx');
      case 'language-switcher':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline"><LanguageSwitcher variant="inline" /></div>
            <Alert variant="info" title={isZh ? '全局语言切换' : 'Global language switch'}>
              {isZh ? '切换语言后，文档内所有 UI 文案同步更新。' : 'Switching locale updates all UI copy across the entire docs surface.'}
            </Alert>
          </div>
        );
      case 'scroll-area':
        return (
          <div className="vx-preview-stack">
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vx-text-secondary)', margin: 0 }}>{isZh ? '场景一：Overlay 模式（默认）' : 'Scene 1: Overlay mode (default)'}</p>
            <ScrollArea maxHeight={160} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8 }}>
              {Array.from({ length: 15 }, (_, i) => (<div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--vx-color-border)' }}>{isZh ? `日志行 ${i + 1}` : `Log line ${i + 1}`}</div>))}
            </ScrollArea>
            {renderCodeBlock(isZh
              ? `<ScrollArea maxHeight={160}>\n  {/* 默认 variant="overlay" */}\n  {...children}\n</ScrollArea>`
              : `<ScrollArea maxHeight={160}>\n  {/* Default variant="overlay" */}\n  {...children}\n</ScrollArea>`)}

            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vx-text-secondary)', margin: 0 }}>{isZh ? '场景二：Native 模式' : 'Scene 2: Native mode'}</p>
            <ScrollArea variant="native" maxHeight={160} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8 }}>
              {Array.from({ length: 15 }, (_, i) => (<div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--vx-color-border)' }}>{isZh ? `日志行 ${i + 1}` : `Log line ${i + 1}`}</div>))}
            </ScrollArea>
            {renderCodeBlock(isZh
              ? `<ScrollArea variant="native" maxHeight={160}>\n  {/* 浏览器原生滚动条 */}\n  {...children}\n</ScrollArea>`
              : `<ScrollArea variant="native" maxHeight={160}>\n  {/* Native browser scrollbar */}\n  {...children}\n</ScrollArea>`)}

            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vx-text-secondary)', margin: 0 }}>{isZh ? '场景三：水平 + 垂直滚动' : 'Scene 3: Horizontal + vertical scroll'}</p>
            <ScrollArea maxHeight={120} maxWidth={300} style={{ border: '1px solid var(--vx-color-border)', borderRadius: 8, padding: '8px 0' }}>
              <div style={{ width: 500, padding: '0 12px' }}>
                {Array.from({ length: 8 }, (_, i) => (<div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--vx-color-border)', whiteSpace: 'nowrap' }}>{isZh ? `宽内容行 ${i + 1} — 这行文字超出容器宽度因此会触发水平滚动` : `Wide content row ${i + 1} — this text exceeds container width so horizontal scroll is triggered`}</div>))}
              </div>
            </ScrollArea>
            {renderCodeBlock(`<ScrollArea maxHeight={120} maxWidth={300}>\n  <div style={{ width: 500 }}>\n    {/* 宽内容触发水平滚动 */}\n  </div>\n</ScrollArea>`)}
          </div>
        );
      case 'separator':
        return (
          <div className="vx-preview-stack">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span>{isZh ? '左' : 'Left'}</span><Separator orientation="vertical" style={{ height: 24 }} /><span>{isZh ? '中' : 'Center'}</span><Separator orientation="vertical" style={{ height: 24 }} /><span>{isZh ? '右' : 'Right'}</span>
            </div>
            <Separator />
            <p>{isZh ? '水平分隔线上方内容' : 'Content above the horizontal separator.'}</p>
          </div>
        );
      case 'timeline':
        return (
          <div className="vx-preview-stack">
            <Timeline items={[{ title: isZh ? '订单已创建' : 'Order created', time: '09:42', status: 'success' }, { title: isZh ? '支付成功' : 'Payment confirmed', time: '09:43', status: 'info' }, { title: isZh ? '配送中' : 'Shipping', time: '10:15', status: 'warning' }, { title: isZh ? '已签收' : 'Delivered', time: '14:30', status: 'default' }]} />
          </div>
        );
      case 'tree-view':
        return (
          <div className="vx-preview-stack">
            <TreeView nodes={[{ id: 'src', label: 'src', children: [{ id: 'components', label: 'components', children: [{ id: 'btn', label: 'Button.tsx' }, { id: 'card', label: 'Card.tsx' }] }, { id: 'pages', label: 'pages', children: [{ id: 'home', label: 'Home.tsx' }, { id: 'about', label: 'About.tsx' }] }] }, { id: 'public', label: 'public', children: [{ id: 'index', label: 'index.html' }] }]} defaultExpanded={['src', 'components', 'pages']} />
          </div>
        );
      case 'carousel':
        return (
          <div className="vx-preview-stack">
            <div style={{ maxWidth: 400 }}>
              <Carousel items={[
                <div key="1" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-2)' }}>{isZh ? '第一张' : 'Slide 1'}</div>,
                <div key="2" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-3)' }}>{isZh ? '第二张' : 'Slide 2'}</div>,
                <div key="3" style={{ padding: 40, textAlign: 'center', background: 'var(--vx-color-surface-2)' }}>{isZh ? '第三张' : 'Slide 3'}</div>,
              ]} showDots showArrows />
            </div>
          </div>
        );
      case 'toggle':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline" style={{ marginBottom: 12 }}>
              <Toggle defaultPressed={false}><Text size="sm">{isZh ? '加粗' : 'Bold'}</Text></Toggle>
              <Toggle><Text size="sm">{isZh ? '斜体' : 'Italic'}</Text></Toggle>
              <Toggle><Text size="sm">{isZh ? '下划线' : 'Underline'}</Text></Toggle>
            </div>
            <ToggleGroup type="single" defaultValue="grid" items={[{ value: 'grid', label: isZh ? '网格' : 'Grid' }, { value: 'list', label: isZh ? '列表' : 'List' }, { value: 'table', label: isZh ? '表格' : 'Table' }]} />
          </div>
        );
      case 'rating':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline" style={{ flexDirection: 'column', gap: 16 }}>
              <Rating defaultValue={3.5} allowHalf /><Rating defaultValue={4} size="sm" /><Rating defaultValue={5} size="lg" readOnly />
            </div>
          </div>
        );
      case 'label':
        return (
          <div className="vx-preview-stack" style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
            <div style={{ display: 'grid', gap: 4 }}><Label required>{isZh ? '电子邮箱' : 'Email'}</Label><Input placeholder="name@example.com" /></div>
            <div style={{ display: 'grid', gap: 4 }}><Label>{isZh ? '备注（选填）' : 'Notes (optional)'}</Label><Input placeholder={isZh ? '添加备注...' : 'Add notes...'} /></div>
          </div>
        );
      case 'date-pickers':
        return (
          <div className="vx-preview-stack" style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
            <DatePicker label={isZh ? '开始日期' : 'Start date'} /><DatePicker label={isZh ? '结束日期' : 'End date'} weekStartsOnMonday />
          </div>
        );
      case 'avatar':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline" style={{ gap: 16, alignItems: 'center' }}>
              <Avatar src="https://i.pravatar.cc/80?u=1" name="Alex Morgan" size="xs" />
              <Avatar src="https://i.pravatar.cc/80?u=2" name="Jamie Chen" size="sm" />
              <Avatar src="https://i.pravatar.cc/80?u=3" name="Taylor Kim" size="md" />
              <Avatar name="Sam Wilson" size="lg" /><Avatar size="xl" />
            </div>
          </div>
        );
      case 'badge':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline">
              <Badge variant="accent">{isZh ? '新品' : 'New'}</Badge><Badge variant="success">{isZh ? '在线' : 'Live'}</Badge>
              <Badge variant="warning">{isZh ? '测试版' : 'Beta'}</Badge><Badge variant="neutral">{isZh ? '草稿' : 'Draft'}</Badge>
            </div>
          </div>
        );
      case 'skeleton':
        return (
          <div className="vx-preview-stack">
            <div style={{ display: 'grid', gap: 8, width: 240 }}>
              <Skeleton variant="rect" width="100%" height={100} /><Skeleton variant="text" width="65%" /><Skeleton variant="text" lines={2} />
            </div>
          </div>
        );
      case 'typography':
        return (
          <div className="vx-preview-stack" style={{ display: 'grid', gap: 8 }}>
            <Heading level={1}>{isZh ? '标题 1' : 'Heading 1'}</Heading>
            <Heading level={2}>{isZh ? '标题 2' : 'Heading 2'}</Heading>
            <Heading level={3}>{isZh ? '标题 3' : 'Heading 3'}</Heading>
            <Text>{isZh ? '默认正文文本。' : 'Default body text.'}</Text>
            <Text variant="secondary">{isZh ? '次级强调文本。' : 'Secondary emphasis text.'}</Text>
            <Text variant="muted">{isZh ? '弱化辅助文本。' : 'Muted helper text.'}</Text>
            <Text weight="bold">{isZh ? '加粗正文。' : 'Bold body text.'}</Text>
          </div>
        );
      case 'card':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Card variant="default" padding="md"><CardHeader><CardTitle>Default</CardTitle><CardDescription>Standard card.</CardDescription></CardHeader><CardContent>Content.</CardContent></Card>
              <Card variant="elevated" padding="md" hoverable><CardHeader><CardTitle>Elevated</CardTitle><CardDescription>Interactive.</CardDescription></CardHeader><CardContent>Hover over this card.</CardContent></Card>
              <Card variant="outlined" padding="md"><CardHeader><CardTitle>Outlined</CardTitle><CardDescription>Bordered.</CardDescription></CardHeader><CardContent>Content.</CardContent></Card>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="vx-preview-stack">
            <Form style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
              <FormField><FormLabel required>{isZh ? '邮箱' : 'Email'}</FormLabel><FormDescription>{isZh ? '我们不会分享你的邮箱。' : 'We will never share your email.'}</FormDescription><Input type="email" placeholder="name@example.com" /><FormMessage /></FormField>
              <FormField><FormLabel required>{isZh ? '密码' : 'Password'}</FormLabel><Input type="password" placeholder="••••••••" /><FormMessage /></FormField>
              <Button type="submit">{isZh ? '提交' : 'Submit'}</Button>
            </Form>
          </div>
        );
      case 'sheet':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline">
              <Sheet trigger={<Button>{isZh ? '打开面板' : 'Open panel'}</Button>} title={isZh ? '侧滑面板' : 'Sheet panel'} description={isZh ? '这是从右侧滑入的面板。' : 'This panel slides in from the right.'} side="right">
                <div style={{ padding: 16 }}>{isZh ? '面板内容' : 'Panel content'}</div>
              </Sheet>
            </div>
          </div>
        );
      case 'resizable':
        return (
          <div className="vx-preview-stack">
            <div style={{ height: 200, border: '1px solid var(--vx-border)', borderRadius: 'var(--vx-radius-lg)', overflow: 'hidden' }}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={20}><div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isZh ? '左侧面板' : 'Left panel'}</div></ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50} minSize={20}><div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isZh ? '右侧面板' : 'Right panel'}</div></ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        );
      case 'accordion':
        return (
          <div className="vx-preview-stack">
            <Accordion defaultOpen={['getting-started']} items={[
              { key: 'getting-started', title: isZh ? '快速开始' : 'Getting Started', content: isZh ? '安装包并配置 Provider。' : 'Install the package and set up providers.' },
              { key: 'components', title: isZh ? '组件库' : 'Components', content: isZh ? '按分类浏览全部组件。' : 'Browse the full component library.' },
              { key: 'templates', title: isZh ? '页面模板' : 'Templates', content: isZh ? '可直接引入项目的预置页面布局。' : 'Pre-built page layouts.' },
            ]} />
          </div>
        );
      case 'tabs':
        return (
          <div className="vx-preview-stack">
            <Tabs defaultValue="preview">
              <TabsList><TabsTrigger value="preview">{isZh ? '预览' : 'Preview'}</TabsTrigger><TabsTrigger value="code">{isZh ? '代码' : 'Code'}</TabsTrigger><TabsTrigger value="props">{isZh ? '属性' : 'Props'}</TabsTrigger></TabsList>
              <TabsContent value="preview">{isZh ? '实时预览组件效果。' : 'Preview the component in real time.'}</TabsContent>
              <TabsContent value="code">{isZh ? '查看源代码并复制到项目中使用。' : 'View the source code.'}</TabsContent>
              <TabsContent value="props">{isZh ? '浏览完整的 API 参考。' : 'Browse the full API reference.'}</TabsContent>
            </Tabs>
          </div>
        );
      case 'breadcrumb':
        return (
          <div className="vx-preview-stack">
            <Breadcrumb items={[{ label: isZh ? '首页' : 'Home', href: '#' }, { label: isZh ? '组件' : 'Components', href: '#' }, { label: isZh ? '导航' : 'Navigation' }]} />
          </div>
        );
      case 'pagination':
        return (
          <div className="vx-preview-stack">
            <Pagination page={paginationDemoPage} total={48} pageSize={10} onChange={setPaginationDemoPage} />
          </div>
        );
      case 'stepper':
        return (
          <div className="vx-preview-stack">
            <Stepper currentStep={1} steps={[
              { label: isZh ? '规划' : 'Plan', description: isZh ? '确定需求和目标' : 'Define requirements & goals' },
              { label: isZh ? '开发' : 'Build', description: isZh ? '编码与测试' : 'Code & test' },
              { label: isZh ? '发布' : 'Launch', description: isZh ? '部署上线' : 'Deploy to production' },
            ]} />
          </div>
        );
      case 'progress':
        return (
          <div className="vx-preview-stack">
            <Progress label={isZh ? '默认' : 'Default'} showLabel value={sliderValue} />
            <Progress label={isZh ? '成功' : 'Success'} showLabel value={sliderValue} variant="success" />
            <Progress label={isZh ? '警告' : 'Warning'} showLabel value={sliderValue} variant="warning" />
            <Progress label={isZh ? '危险' : 'Danger'} showLabel value={sliderValue} variant="danger" />
          </div>
        );
      case 'spinner':
        return (
          <div className="vx-preview-inline vx-preview-inline--wrap">
            <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
          </div>
        );
      case 'alert':
        return (
          <div className="vx-preview-stack">
            <Alert title={isZh ? '提示信息' : 'Information'} variant="info">{isZh ? '这是一条提示信息。' : 'This is an informational message.'}</Alert>
            <Alert title={isZh ? '操作成功' : 'Success'} variant="success">{isZh ? '操作已成功完成。' : 'Operation completed successfully.'}</Alert>
            <Alert title={isZh ? '错误' : 'Error'} variant="danger">{isZh ? '出错了，请重试。' : 'Something went wrong.'}</Alert>
          </div>
        );
      case 'table': {
        // Large dataset for the scroll / sticky-header stress-test demo
        const largeRoles = isZh ? ['设计师', '工程师', '产品经理', '测试'] : ['Designer', 'Engineer', 'Product manager', 'QA'];
        const largeTeams = isZh ? ['设计系统', '平台', '增长', '基础架构'] : ['Design system', 'Platform', 'Growth', 'Infrastructure'];
        const largeStatuses = isZh ? ['在岗', '休假', '出差'] : ['Active', 'On leave', 'On site'];
        const largeData = Array.from({ length: 200 }, (_, i) => ({
          id: i + 1,
          name: `User-${String(i + 1).padStart(3, '0')}`,
          role: largeRoles[i % largeRoles.length],
          team: largeTeams[i % largeTeams.length],
          status: largeStatuses[i % largeStatuses.length],
          score: (i * 37) % 100,
        }));
        const largeColumns = [
          { key: 'id', header: isZh ? '编号' : 'ID', accessor: (r: { id: number }) => r.id, sortable: true, width: 80, align: 'right' as const },
          { key: 'name', header: isZh ? '姓名' : 'Name', accessor: (r: { name: string }) => r.name, sortable: true },
          { key: 'role', header: isZh ? '角色' : 'Role', accessor: (r: { role: string }) => r.role },
          { key: 'team', header: isZh ? '团队' : 'Team', accessor: (r: { team: string }) => r.team },
          { key: 'status', header: isZh ? '状态' : 'Status', accessor: (r: { status: string }) => <Badge variant={((r.status === 'Active' || r.status === '在岗') ? 'success' : 'warning') as 'success' | 'warning'}>{r.status}</Badge>, sortable: true },
          { key: 'score', header: isZh ? '得分' : 'Score', accessor: (r: { score: number }) => r.score, align: 'right' as const, sortable: true },
        ];
        return (
          <div className="vx-preview-stack">
            <Table columns={[
              { key: 'name', header: isZh ? '名称' : 'Name', accessor: (r: { name: string }) => r.name },
              { key: 'role', header: isZh ? '角色' : 'Role', accessor: (r: { role: string }) => r.role },
              { key: 'status', header: isZh ? '状态' : 'Status', accessor: (r: { status: string }) => <Badge variant={(r.status === 'Active' ? 'success' : 'warning') as 'success' | 'warning'}>{r.status}</Badge> },
            ]} data={[
              { name: 'Alice Chen', role: isZh ? '设计师' : 'Designer', status: 'Active' },
              { name: 'Bo Wang', role: isZh ? '工程师' : 'Engineer', status: 'Active' },
            ]} striped bordered />
            <p style={{ fontSize: 13, color: 'var(--vx-text-muted)', margin: '4px 0 0' }}>
              {isZh
                ? '大量数据 + 表头吸顶 + 容器滚动（共 200 行）。向下滚动以验证 stickyHeader 效果：'
                : 'Large dataset with sticky header and scrollable container (200 rows). Scroll down to verify stickyHeader:'}
            </p>
            <Table
              columns={largeColumns}
              data={largeData}
              stickyHeader
              striped
              hoverable
              style={{ maxHeight: 360, overflow: 'auto' }}
              caption={isZh ? `成员名单 · ${largeData.length} 人` : `Roster · ${largeData.length} members`}
            />
          </div>
        );
      }
      case 'file-upload':
        return (
          <div className="vx-preview-stack" style={{ maxWidth: 480 }}>
            <FileUpload multiple label={isZh ? '上传附件' : 'Upload attachments'} hint={isZh ? '支持多文件上传，单文件最大 10MB' : 'Multiple files allowed, up to 10MB each'} accept="image/*,.pdf" />
          </div>
        );
      case 'color-picker':
        return (
          <div className="vx-preview-stack" style={{ maxWidth: 480 }}>
            <ColorPicker label={isZh ? '主题色' : 'Theme color'} />
          </div>
        );
      case 'dialog':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Dialog trigger={<Button>{isZh ? '打开对话框' : 'Open dialog'}</Button>}
                title={isZh ? '确认操作' : 'Confirm action'} description={isZh ? '请确认此操作。' : 'Please confirm this operation.'}
                confirmLabel={isZh ? '确认' : 'Confirm'} cancelLabel={isZh ? '取消' : 'Cancel'}>
                {isZh ? '此操作将立即生效。' : 'This action will be applied immediately.'}
              </Dialog>
              <Dialog placement="right" title={isZh ? '侧边面板' : 'Side panel'} trigger={<Button variant="secondary">{isZh ? '侧边面板' : 'Side panel'}</Button>}>
                {isZh ? '固定在右侧边缘的对话框。' : 'A dialog anchored to the right edge.'}
              </Dialog>
            </div>
          </div>
        );
      case 'popover':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Popover content={<div style={{ padding: 8 }}>{isZh ? '弹出内容，提供额外信息。' : 'Popover content.'}</div>}>
                <Button variant="secondary">{isZh ? '点击打开' : 'Click me'}</Button>
              </Popover>
            </div>
          </div>
        );
      case 'tooltip':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <Tooltip content={isZh ? '这是一个工具提示' : 'This is a tooltip'}><Button variant="secondary">{isZh ? '悬停查看' : 'Hover me'}</Button></Tooltip>
              <Tooltip content={isZh ? '顶部提示' : 'Top tooltip'} placement="top"><Button variant="ghost">{isZh ? '顶部' : 'Top'}</Button></Tooltip>
            </div>
          </div>
        );
      case 'hover-card':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <HoverCard content={<div style={{ padding: 12, maxWidth: 220 }}><strong>{isZh ? '用户资料' : 'User profile'}</strong><p style={{ margin: '4px 0 0', color: 'var(--vx-text-secondary)' }}>{isZh ? '无需导航即可预览更多上下文。' : 'Preview additional context.'}</p></div>}>
                <Button variant="secondary">{isZh ? '悬停查看' : 'Hover me'}</Button>
              </HoverCard>
            </div>
          </div>
        );
      case 'dropdown-menu':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline vx-preview-inline--wrap">
              <DropdownMenu trigger={<Button variant="secondary">{isZh ? '操作' : 'Actions'}</Button>}
                items={[{ label: isZh ? '复制' : 'Duplicate', onClick: () => {} }, { label: isZh ? '归档' : 'Archive', onClick: () => {} }, { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} }]} />
            </div>
          </div>
        );
      case 'context-menu':
        return (
          <div className="vx-preview-stack">
            <div className="vx-preview-inline">
              <ContextMenu items={[{ label: isZh ? '复制' : 'Copy', onClick: () => {} }, { label: isZh ? '粘贴' : 'Paste', onClick: () => {} }, { label: isZh ? '删除' : 'Delete', danger: true, onClick: () => {} }]}>
                <div style={{ padding: '2rem 3rem', border: '1px dashed var(--vx-color-border)', borderRadius: 'var(--vx-radius-md)', textAlign: 'center', color: 'var(--vx-text-secondary)' }}>
                  {isZh ? '在此区域右键点击' : 'Right-click this area'}
                </div>
              </ContextMenu>
            </div>
          </div>
        );
      case 'navigation-menu':
        return (
          <div className="vx-preview-stack">
            <NavigationMenu items={[
              { label: isZh ? '文档' : 'Docs', items: [{ label: isZh ? '介绍' : 'Introduction', description: isZh ? '开始使用 VXUI' : 'Get started', onClick: () => {} }, { label: isZh ? '快速开始' : 'Quick Start', description: isZh ? '安装和配置' : 'Install and configure', onClick: () => {} }] },
              { label: isZh ? '组件' : 'Components', items: [{ label: 'Button', description: isZh ? '主要操作元素' : 'Primary action', onClick: () => {} }, { label: 'Dialog', description: isZh ? '模态叠层' : 'Modal overlay', onClick: () => {} }] },
              { label: isZh ? '模板' : 'Templates', onClick: () => {} },
            ]} />
          </div>
        );
      case 'menubar':
        return (
          <div className="vx-preview-stack">
            <Menubar menus={[
              { label: 'File', items: [{ label: 'New', shortcut: '⌘N', onClick: () => {} }, { label: 'Open...', shortcut: '⌘O', onClick: () => {} }, { label: 'Save', shortcut: '⌘S', onClick: () => {} }, { label: 'Exit', danger: true, onClick: () => {} }] },
              { label: 'Edit', items: [{ label: 'Undo', shortcut: '⌘Z', onClick: () => {} }, { label: 'Redo', shortcut: '⇧⌘Z', onClick: () => {} }] },
            ]} />
          </div>
        );
      case 'typography-base':
        return (
          <div className="vx-preview-stack">
            {/* CSS 类名用法 */}
            <div className="vx-article">
              <header className="vx-article__header">
                <span className="vx-kicker">{isZh ? 'CSS 类名' : 'CSS Classes'}</span>
                <h1 className="vx-article__title">{isZh ? '使用 CSS 类名' : 'Using CSS Classes'}</h1>
                <p className="vx-article__description">
                  {isZh ? '直接使用 className 即可应用排版样式，无需额外组件。' : 'Apply typography styles directly via className — no extra components needed.'}
                </p>
              </header>
              <div className="vx-article__body">
                <section className="vx-section">
                  <h2 className="vx-section__heading">
                    {isZh ? '章节标题' : 'Section Heading'}
                    <a href="#section" className="vx-section__anchor">#</a>
                  </h2>
                  <p className="vx-lead">{isZh ? '这是导语文本（vx-lead），用于段落开头的引导性内容。' : 'This is lead text (vx-lead), used for introductory content at the start of a section.'}</p>
                  <ul className="vx-list">
                    <li>{isZh ? '使用 vx-article 作为文章容器' : 'Use vx-article as the article container'}</li>
                    <li>{isZh ? '使用 vx-section 划分章节' : 'Use vx-section to divide chapters'}</li>
                    <li>{isZh ? '使用 vx-kicker 作为分类标签' : 'Use vx-kicker as a category label'}</li>
                  </ul>
                </section>
              </div>
            </div>

            {/* React 组件用法 */}
            <div className="vx-section">
              <h2 className="vx-section__heading">
                {isZh ? 'React 组件' : 'React Components'}
                <a href="#components" className="vx-section__anchor">#</a>
              </h2>
              <div className="vx-example">
                <div className="vx-stats" style={{ marginBottom: 16 }}>
                  <div className="vx-stat">
                    <div className="vx-stat__copy">
                      <span className="vx-stat__label">{isZh ? '组件' : 'Components'}</span>
                      <strong className="vx-stat__value">10</strong>
                      <small className="vx-stat__hint">{isZh ? '可直接导入使用' : 'Ready to import'}</small>
                    </div>
                    <div className="vx-stat__icon"><Zap size={20} /></div>
                  </div>
                  <div className="vx-stat">
                    <div className="vx-stat__copy">
                      <span className="vx-stat__label">{isZh ? 'CSS 类' : 'CSS Classes'}</span>
                      <strong className="vx-stat__value">30+</strong>
                      <small className="vx-stat__hint">{isZh ? '开箱即用' : 'Out of the box'}</small>
                    </div>
                    <div className="vx-stat__icon"><Palette size={20} /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 空状态示例 */}
            <div className="vx-section">
              <h2 className="vx-section__heading">
                {isZh ? '空状态' : 'Empty State'}
                <a href="#empty" className="vx-section__anchor">#</a>
              </h2>
              <div className="vx-empty">
                <div className="vx-empty__icon"><AlertTriangle size={20} /></div>
                <strong>{isZh ? '暂无内容' : 'No content yet'}</strong>
                <p>{isZh ? '使用 vx-empty 和 vx-empty__icon 展示空状态。' : 'Use vx-empty and vx-empty__icon to display empty states.'}</p>
              </div>
            </div>
          </div>
        );
      case 'vxui-provider':
        return (
          <div className="vx-preview-stack">
            <Alert variant="info" title={isZh ? '组合 Provider' : 'Combined Provider'}>
              {isZh ? 'VXUIProvider 将 ThemeProvider、ViewportProvider 和 ToastProvider 合并为单一根组件。' : 'VXUIProvider merges ThemeProvider, ViewportProvider, and ToastProvider into one root component.'}
            </Alert>
            <div className="vx-example">
              {renderCodeBlock(isZh ? `import { VXUIProvider, themePresets } from 'vxui-react';\n\nexport function App() {\n  return (\n    <VXUIProvider themes={themePresets} defaultTheme="light">\n      <Shell>\n        <ShellMain>\n          <p>应用内容</p>\n        </ShellMain>\n      </Shell>\n    </VXUIProvider>\n  );\n}` : `import { VXUIProvider, themePresets } from 'vxui-react';\n\nexport function App() {\n  return (\n    <VXUIProvider themes={themePresets} defaultTheme="light">\n      <Shell>\n        <ShellMain>\n          <p>App content</p>\n        </ShellMain>\n      </Shell>\n    </VXUIProvider>\n  );\n}`)}
            </div>
          </div>
        );
      case 'viewport':
        return (
          <div className="vx-preview-stack">
            <Alert variant="info" title={isZh ? '响应式设备检测' : 'Responsive Device Detection'}>
              {isZh ? 'ViewportProvider 根据物理屏幕宽度自动检测设备类型，并通过 useViewport hook 暴露状态。' : 'ViewportProvider automatically detects device type based on physical screen width and exposes state via the useViewport hook.'}
            </Alert>
            {renderCodeBlock(isZh ? `import { ViewportProvider, useViewport } from 'vxui-react';\n\nfunction DeviceInfo() {\n  const { viewport, isPhone, isTablet, isDesktop } = useViewport();\n  return <p>设备类型：{viewport}</p>;\n}\n\nexport function App() {\n  return (\n    <ViewportProvider>\n      <DeviceInfo />\n    </ViewportProvider>\n  );\n}` : `import { ViewportProvider, useViewport } from 'vxui-react';\n\nfunction DeviceInfo() {\n  const { viewport, isPhone, isTablet, isDesktop } = useViewport();\n  return <p>Device: {viewport}</p>;\n}\n\nexport function App() {\n  return (\n    <ViewportProvider>\n      <DeviceInfo />\n    </ViewportProvider>\n  );\n}`)}
          </div>
        );
      case 'constants':
        return (
          <div className="vx-preview-stack">
            <div className="vx-stats" style={{ marginBottom: 16 }}>
              {[
                { label: 'BREAKPOINTS.sm', value: BREAKPOINTS.sm },
                { label: 'BREAKPOINTS.md', value: BREAKPOINTS.md },
                { label: 'BREAKPOINTS.lg', value: BREAKPOINTS.lg },
                { label: 'PHONE_MAX_WIDTH', value: PHONE_MAX_WIDTH },
                { label: 'PHONE_ASPECT_RATIO_THRESHOLD', value: PHONE_ASPECT_RATIO_THRESHOLD },
                { label: 'TABLET_ASPECT_RATIO_THRESHOLD', value: TABLET_ASPECT_RATIO_THRESHOLD },
              ].map((c) => (
                <div key={c.label} className="vx-stat">
                  <div className="vx-stat__copy">
                    <span className="vx-stat__label">{c.label}</span>
                    <strong className="vx-stat__value">{c.value}</strong>
                  </div>
                </div>
              ))}
            </div>
            {renderCodeBlock(`import { BREAKPOINTS, PHONE_MAX_WIDTH } from 'vxui-react';\n\nconsole.log(BREAKPOINTS.lg); // 1000\nconsole.log(PHONE_MAX_WIDTH); // 1000`)}
          </div>
        );
      case 'calendar':
        return (
          <div className="vx-preview-stack" style={{ display: 'grid', gap: 16 }}>
            <Calendar />
            <Calendar weekStartsOnMonday />
          </div>
        );
      case 'bottom-nav':
        return (
          <div className="vx-preview-stack" style={{ maxWidth: 400, border: '1px solid var(--vx-color-border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: 16 }}>
              <BottomNav items={[
                { key: 'home', label: isZh ? '首页' : 'Home', icon: <House size={20} />, active: true },
                { key: 'search', label: isZh ? '搜索' : 'Search', icon: <Search size={20} /> },
                { key: 'alerts', label: isZh ? '通知' : 'Alerts', icon: <Bell size={20} />, badge: 3 },
                { key: 'profile', label: isZh ? '我的' : 'Profile', icon: <User size={20} /> },
              ]} />
            </div>
          </div>
        );
      case 'introduction':
      default:
        return null;
    }
  }

  // ── 主渲染 ──
  const activePageKey: PageKey = route.view === 'docs' ? route.page ?? 'introduction' : 'introduction';
  const isHomePage = route.view === 'docs' && !route.page;

  return (
    <>
      <CommandPalette
        ariaLabel={t.searchAriaLabel}
        emptyText={t.searchEmpty}
        entries={searchEntries}
        labelClose={t.searchClose}
        labelGo={t.searchGo}
        labelNavigate={t.searchNavigate}
        onClose={() => onSearchOpenChange(false)}
        onSelect={(key) => onNavigate({ view: 'docs', page: key as PageKey })}
        open={searchOpen}
        placeholder={t.searchPlaceholder}
      />
      <AppShell
        brand="vxUI"
        brandCaption={isZh ? '统一响应式系统' : 'Unified responsive system'}
        brandIcon={<img src="/colorful_flat_icon.svg" alt="" />}
        topbarRef={docsTopbarRef}
        density={compactDensity ? 'compact' : 'comfortable'}
        breadcrumb={
          <div className="vx-breadcrumb" data-state={showPinnedDocTitle ? 'pinned' : 'overview'}>
            {showPinnedDocTitle ? <span className="vx-breadcrumb__kicker">{activeDocument.section}</span> : null}
            <strong>{topbarDocLabel}</strong>
          </div>
        }
        headerActions={
          <div className="vx-docs-toolbar">
            {showBack ? (
              <Button className="vx-docs-toolbar__item--back" variant="outline" size="sm" onClick={() => onNavigate({ view: 'home' })}>
                <House size={14} />{t.publicPages.backHome}
              </Button>
            ) : null}
            {showSearch ? (
              <Button className="vx-docs-toolbar__item--search" variant="outline" size="sm" onClick={() => onSearchOpenChange(true)}>
                <Search size={14} />{t.searchTrigger}<kbd className="vx-search-kbd">⌘K</kbd>
              </Button>
            ) : null}
            {showDensity ? (
              <Button className="vx-docs-toolbar__item--density" variant={compactDensity ? 'soft' : 'outline'} size="sm" onClick={() => onCompactDensityChange(!compactDensity)}>
                <SlidersHorizontal size={14} />{densityLabel}
              </Button>
            ) : null}
            {showThemeBtn ? (
              <Select
                className="vx-docs-toolbar__item--theme"
                options={themeOptions}
                value={theme}
                onChange={(val) => val && setTheme(val)}
                placeholder={isZh ? '选择主题' : 'Select theme'}
                searchable={false}
              />
            ) : null}
            {showAccountBtn ? (
              <Select
                className="vx-docs-toolbar__item--account"
                options={accountSelectOptions}
                placeholder={viewerSession?.name ?? t.publicPages.guestLabel}
                searchable={false}
                onChange={handleAccountSelect}
              />
            ) : null}
            {showLanguageBtn ? <span className="vx-docs-toolbar__item--language"><LanguageSwitcher variant="inline" /></span> : null}
            {showMoreMenu ? (
              <DropdownMenu key="docs-toolbar-more" className="vx-docs-toolbar__more"
                trigger={<Button variant="outline" size="sm"><MoreHorizontal size={14} />{isZh ? '更多' : 'More'}</Button>}
                groups={[
                  ...(!showBack || !showSearch ? [{
                    label: isZh ? '导航' : 'Navigation',
                    items: [
                      ...(!showBack ? [{ label: t.publicPages.backHome, icon: <House size={14} />, onClick: () => onNavigate({ view: 'home' }) }] : []),
                      ...(!showSearch ? [{ label: t.searchTrigger, icon: <Search size={14} />, shortcut: '⌘K', onClick: () => onSearchOpenChange(true) }] : []),
                    ],
                  }] : []),
                  ...(!showDensity ? [{ label: isZh ? '视图' : 'View', items: [{ label: densityLabel, onClick: () => onCompactDensityChange(!compactDensity) }] }] : []),
                  ...(!showThemeBtn ? [{ label: isZh ? '主题' : 'Theme', items: themeMenuItems }] : []),
                  ...(!showAccountBtn ? [{ label: copy.accountMenu, items: accountMenuItems }] : []),
                  ...(!showLanguageBtn ? [{ label: isZh ? '语言' : 'Language', items: Object.entries(locales).map(([k, d]) => ({ label: `${d.label}${locale === k ? (isZh ? ' (当前)' : ' (current)') : ''}`, icon: <Globe size={14} />, onClick: () => setLocale(k) })) }] : []),
                ]}
                align="end" />
            ) : null}
          </div>
        }
        menuButtonLabel={isZh ? '切换导航' : 'Toggle navigation'}
        mobileNavOpen={mobileNavOpen}
        navSections={navSections}
        onMobileNavToggle={onMobileNavToggle}
        onSidebarToggle={onSidebarToggle}
        onSidebarClick={(e) => {
          if (isTabletPortrait && !mobileNavOpen) {
            e.stopPropagation();
            e.preventDefault();
            onMobileNavToggle();
          }
        }}
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
        <div className="vx-docs-workspace">
          {isHomePage ? (
            <DocsHome
              isZh={isZh}
              docsHomeCopy={docsHomeCopy}
              copy={copy}
              docsHomeGroups={docsHomeGroups}
              metricCards={metricCards}
              releaseTrack={releaseTrack}
              setReleaseTrack={onReleaseTrackChange}
              navigate={onNavigate}
              pages={pages}
            />
          ) : (
            <DocPage
              isZh={isZh}
              activePage={activePageKey}
              activeDocument={activeDocument}
              pages={pages}
              copy={copy}
              renderSample={renderSample}
              renderCodeBlock={helpers.renderCodeBlock}
              renderTemplateLauncher={helpers.renderTemplateLauncher}
              navigate={onNavigate}
              docHeaderRef={docHeaderRef}
            />
          )}
        </div>
      </AppShell>
    </>
  );
}
