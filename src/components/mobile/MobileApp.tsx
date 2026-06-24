/**
 * MobileApp — 移动端文档应用
 * 精简版，渲染逻辑已提取到 src/app/mobile/
 */
import { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Bell, Boxes, CalendarDays, Check, ChevronLeft, ChevronRight,
  Compass, Download, FileCode2, FileText, FileX2, Globe, GripHorizontal, House,
  LayoutDashboard, List, LogIn, Menu, Minus, Navigation, Package2, Palette,
  PanelRightClose, PanelsTopLeft, Search, ShieldCheck, SlidersHorizontal,
  Smartphone, Sparkles, Star, Tag, Trash2, Upload, User, UserPlus, X, Zap,
  Share2,
} from 'lucide-react';
import { MobileShell, MobileTopBar, MobileIconButton } from './MobileShell';
import { BottomNav } from './BottomNav';
import { MobileList, MobileListSection, MobileListItem } from './MobileList';
import { useI18n } from '../../i18n';
import { getPrivacyPolicyContent, getTermsOfServiceContent } from '../pages/legalPageContent';
import { getPublicHomeContent } from '../pages/homePageContent';
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Select,
  Textarea, Alert, Popover, DropdownMenu, Breadcrumb, Pagination, Accordion,
  Table, Tooltip, useToast, useTheme, LanguageSwitcher,
  Dialog, Sheet, Timeline,
} from '../../lib';
import { MobileHomeContent } from '../../app/mobile/MobileHomeContent';
import { MobileAuthContent } from '../../app/mobile/MobileAuthContent';
import { MobileSearchContent } from '../../app/mobile/MobileSearchContent';
import { MobileLegalContent } from '../../app/mobile/MobileLegalContent';
import { MobileDocContent } from '../../app/mobile/MobileDocContent';
import { renderSharedPreview } from '../../app/doc-previews/shared';

type MobileView = 'home' | 'docs' | 'login' | 'register' | 'privacy-policy' | 'terms-of-service';
type BottomTab = 'home' | 'docs' | 'search';

type PageKey =
  | 'introduction' | 'quick-start' | 'shell-sidebar' | 'grid-page' | 'nav-layout'
  | 'scroll-area' | 'separator' | 'resizable' | 'typography' | 'badge' | 'avatar'
  | 'skeleton' | 'card' | 'code-block' | 'language-switcher' | 'button' | 'elements'
  | 'form-controls' | 'form-inputs' | 'toggle' | 'rating' | 'label' | 'date-pickers'
  | 'file-upload' | 'color-picker' | 'form' | 'accordion' | 'tabs' | 'breadcrumb'
  | 'pagination' | 'stepper' | 'progress' | 'spinner' | 'alert' | 'toasts' | 'table'
  | 'data-list' | 'timeline' | 'tree-view' | 'carousel' | 'empty-states' | 'overlays'
  | 'data-display' | 'navigation' | 'feedback' | 'dialog' | 'sheet' | 'popover'
  | 'tooltip' | 'hover-card' | 'dropdown-menu' | 'context-menu' | 'command-palette'
  | 'navigation-menu' | 'menubar' | 'mobile' | 'mobile-list' | 'home-page'
  | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service';

interface PageDefinition {
  section: string;
  title: string;
  description: string;
  guidance: string[];
}

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

export function MobileApp() {
  const { t, locale, setLocale } = useI18n();
  const { push } = useToast();
  const { themes } = useTheme();
  const pp = t.publicPages;
  const pages = t.pageDefs as Record<PageKey, PageDefinition>;
  const { features } = getPublicHomeContent(t);
  const privacyContent = getPrivacyPolicyContent(locale);
  const termsContent = getTermsOfServiceContent(locale);

  // ── routing state ──
  const [mobileView, setMobileView] = useState<MobileView>(getMobileView);
  const [activePage, setActivePage] = useState<PageKey>(getMobilePage);
  const [activeTab, setActiveTab] = useState<BottomTab>(getMobileView() === 'docs' ? 'docs' : 'home');

  // ── UI state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const docHeaderRef = useRef<HTMLDivElement | null>(null);

  // ── component preview state ──


  // ── URL sync ──
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

  // ── helpers ──
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

  // ── nav sections for drawer ──
  const navSections = [
    { title: t.nav.gettingStarted, collapsible: true, defaultOpen: true, items: [{ key: 'introduction', label: t.pages.introduction, icon: <Compass size={16} /> }] },
    { title: t.nav.layout, collapsible: true, defaultOpen: true, items: [
      { key: 'quick-start', label: t.pages['quick-start'], icon: <Zap size={16} /> },
      { key: 'shell-sidebar', label: t.pages['shell-sidebar'], icon: <PanelsTopLeft size={16} /> },
      { key: 'grid-page', label: t.pages['grid-page'], icon: <LayoutDashboard size={16} /> },
      { key: 'nav-layout', label: t.pages['nav-layout'], icon: <LayoutDashboard size={16} /> },
      { key: 'scroll-area', label: t.pages['scroll-area'], icon: <FileText size={16} /> },
      { key: 'separator', label: t.pages.separator, icon: <Minus size={16} /> },
      { key: 'resizable', label: t.pages.resizable, icon: <GripHorizontal size={16} /> },
    ]},
    { title: t.nav.content, collapsible: true, defaultOpen: false, items: [
      { key: 'typography', label: t.pages.typography, icon: <FileText size={16} /> },
      { key: 'badge', label: t.pages.badge, icon: <ShieldCheck size={16} /> },
      { key: 'avatar', label: t.pages.avatar, icon: <User size={16} /> },
      { key: 'skeleton', label: t.pages.skeleton, icon: <LayoutDashboard size={16} /> },
      { key: 'card', label: t.pages.card, icon: <LayoutDashboard size={16} /> },
      { key: 'code-block', label: t.pages['code-block'], icon: <FileCode2 size={16} /> },
      { key: 'language-switcher', label: t.pages['language-switcher'], icon: <Globe size={16} /> },
    ]},
    { title: t.nav.forms, collapsible: true, defaultOpen: false, items: [
      { key: 'form-controls', label: t.pages['form-controls'], icon: <SlidersHorizontal size={16} /> },
      { key: 'form-inputs', label: t.pages['form-inputs'], icon: <SlidersHorizontal size={16} /> },
      { key: 'toggle', label: t.pages.toggle, icon: <SlidersHorizontal size={16} /> },
      { key: 'rating', label: t.pages.rating, icon: <Star size={16} /> },
      { key: 'label', label: t.pages.label, icon: <Tag size={16} /> },
      { key: 'date-pickers', label: t.pages['date-pickers'], icon: <CalendarDays size={16} /> },
      { key: 'file-upload', label: t.pages['file-upload'], icon: <Upload size={16} /> },
      { key: 'color-picker', label: t.pages['color-picker'], icon: <Palette size={16} /> },
      { key: 'form', label: t.pages.form, icon: <LayoutDashboard size={16} /> },
    ]},
    { title: t.nav.components, collapsible: true, defaultOpen: false, items: [
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
    ]},
    { title: t.nav.overlays, collapsible: true, defaultOpen: false, items: [
      { key: 'dialog', label: t.pages.dialog, icon: <ChevronRight size={16} /> },
      { key: 'sheet', label: t.pages.sheet, icon: <PanelRightClose size={16} /> },
      { key: 'popover', label: t.pages.popover, icon: <ChevronRight size={16} /> },
      { key: 'tooltip', label: t.pages.tooltip, icon: <ChevronRight size={16} /> },
      { key: 'hover-card', label: t.pages['hover-card'], icon: <ChevronRight size={16} /> },
      { key: 'dropdown-menu', label: t.pages['dropdown-menu'], icon: <ChevronRight size={16} /> },
      { key: 'context-menu', label: t.pages['context-menu'], icon: <ChevronRight size={16} /> },
      { key: 'command-palette', label: t.pages['command-palette'], icon: <Search size={16} /> },
      { key: 'overlays', label: t.pages.overlays, icon: <Package2 size={16} /> },
    ]},
    { title: t.nav.navigation, collapsible: true, defaultOpen: false, items: [
      { key: 'navigation-menu', label: t.pages['navigation-menu'], icon: <Navigation size={16} /> },
      { key: 'menubar', label: t.pages.menubar, icon: <Menu size={16} /> },
    ]},
    { title: t.nav.feedback, collapsible: true, defaultOpen: true, items: [{ key: 'feedback', label: t.pages.feedback, icon: <ShieldCheck size={16} /> }] },
    { title: t.nav.templates, collapsible: true, defaultOpen: true, items: [
      { key: 'home-page', label: t.pages['home-page'], icon: <House size={16} /> },
      { key: 'login-page', label: t.pages['login-page'], icon: <LogIn size={16} /> },
      { key: 'register-page', label: t.pages['register-page'], icon: <UserPlus size={16} /> },
      { key: 'error-page', label: t.pages['error-page'], icon: <AlertTriangle size={16} /> },
      { key: 'privacy-policy', label: t.pages['privacy-policy'], icon: <ShieldCheck size={16} /> },
      { key: 'terms-of-service', label: t.pages['terms-of-service'], icon: <FileText size={16} /> },
    ]},
    { title: t.nav.mobile, collapsible: true, defaultOpen: true, items: [
      { key: 'mobile', label: t.pages.mobile, icon: <Smartphone size={16} /> },
      { key: 'mobile-list', label: t.pages['mobile-list'], icon: <List size={16} /> },
    ]},
  ];

  // ── component preview renderer ──
  const renderPagePreview = () => {
    const isZh = locale === 'zh';
    // Shared preview — covers all component pages aligned with desktop
    const shared = renderSharedPreview(activePage, { isZh, pages, push, onNavigate: selectPage });
    if (shared !== null) return shared;

    // Fallback — pages that need mobile-specific treatment
    switch (activePage) {
      case 'introduction':
        return (
          <div className="vx-stack">
            <Alert variant="info" title="Welcome to vxUI">A lightweight React component library. Zero heavy dependencies, themeable, and dark-mode ready.</Alert>
            <div className="vx-inline vx-inline--wrap"><Badge variant="accent">React</Badge><Badge variant="success">TypeScript</Badge><Badge variant="warning">MIT</Badge><Badge>Zero deps</Badge></div>
          </div>
        );
      default:
        return null;
    }
  };

  // ── renderers ──
  const renderHomeContent = () => (
    <MobileHomeContent
      pp={pp}
      features={features}
      onLogin={() => setMobileView('login')}
      onDocs={() => selectPage('introduction')}
      onPrivacy={() => openLegalPage('privacy-policy')}
    />
  );

  const renderLegalContent = (content: ReturnType<typeof getPrivacyPolicyContent>) => (
    <MobileLegalContent content={content} footerCopy={pp.footerCopy} />
  );

  const renderDocContent = () => {
    if (!activeDocument) return null;
    const preview = renderPagePreview();
    return (
      <MobileDocContent
        activeDocument={activeDocument}
        preview={preview}
        hasPreview={preview !== null}
        docHeaderRef={docHeaderRef}
      />
    );
  };

  const renderSearchContent = () => {
    const allItems = navSections.flatMap(s => s.items.map(item => ({ ...item, section: s.title })));
    const q = searchQuery.trim().toLowerCase();
    const filtered = q ? allItems.filter(item => item.label.toLowerCase().includes(q) || item.section.toLowerCase().includes(q)) : allItems;
    return (
      <MobileSearchContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredItems={filtered}
        onSelect={(key) => { selectPage(key as PageKey); setActiveTab('docs'); }}
        placeholder={t.searchPlaceholder}
        ariaLabel={t.searchAriaLabel}
      />
    );
  };

  const renderLoginContent = () => (
    <MobileAuthContent
      mode="login"
      t={t}
      onSwitchMode={() => setMobileView('register')}
      onBack={() => setMobileView('home')}
    />
  );

  const renderRegisterContent = () => (
    <MobileAuthContent
      mode="register"
      t={t}
      onSwitchMode={() => setMobileView('login')}
      onBack={() => setMobileView('home')}
    />
  );

  // ── top bar ──
  const renderTopBar = () => {
    const isDocsView = activeTab === 'docs' && mobileView === 'docs';
    const isLegalView = mobileView === 'privacy-policy' || mobileView === 'terms-of-service';
    const isSearchView = activeTab === 'search';
    const title = isDocsView
      ? (activeDocument?.title ?? docsTopBarFallback)
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
          <MobileIconButton label="Actions" onClick={() => setActionSheetOpen(true)}>
            <Share2 size={20} />
          </MobileIconButton>
        }
      />
    );
  };

  // ── main content ──
  const renderContent = () => {
    if (mobileView === 'login') return renderLoginContent();
    if (mobileView === 'register') return renderRegisterContent();
    if (mobileView === 'privacy-policy') return renderLegalContent(privacyContent);
    if (mobileView === 'terms-of-service') return renderLegalContent(termsContent);
    if (activeTab === 'search') return renderSearchContent();
    if (activeTab === 'docs') return renderDocContent();
    return renderHomeContent();
  };

  // ── drawer ──
  const renderDrawer = () => (
    <Sheet side="left" open={drawerOpen} onOpenChange={(v) => { if (!v) setDrawerOpen(false); }}
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--vx-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>vx</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--vx-text)' }}>vxUI Docs</span>
        </div>
      }
      footer={
        <button type="button" className="vx-cmd-trigger" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
          onClick={() => { window.location.href = '/docs/introduction'; }}>
          <Smartphone size={13} />Desktop version<ChevronRight size={13} />
        </button>
      }>
      {navSections.map(section => (
        <div key={section.title} className="vxm-drawer-section">
          {section.title && <div className="vxm-drawer-section__title">{section.title}</div>}
          <div className="vxm-drawer-section__items">
            {section.items.map(item => (
              <button key={item.key} type="button"
                className={'vxm-drawer-item' + (activePage === item.key ? ' vxm-drawer-item--active' : '')}
                onClick={() => selectPage(item.key as PageKey)}>
                {item.icon && <span className="vxm-drawer-item__icon">{item.icon}</span>}
                <span className="vxm-drawer-item__label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </Sheet>
  );

  // ── bottom nav ──
  const isAuthView = mobileView === 'login' || mobileView === 'register';
  const isLegalView = mobileView === 'privacy-policy' || mobileView === 'terms-of-service';

  const renderBottomNav = () => (
    <BottomNav items={[
      { key: 'home', label: locale === 'zh' ? '首页' : 'Home', icon: <House size={22} />, active: activeTab === 'home' && !isAuthView && !isLegalView, onSelect: () => { selectTab('home'); setMobileView('home'); } },
      { key: 'docs', label: locale === 'zh' ? '文档' : 'Docs', icon: <FileCode2 size={22} />, active: activeTab === 'docs' && !isAuthView && !isLegalView,
        submenu: navSections.flatMap(s => s.items).map(item => ({
          key: item.key, label: item.label, icon: item.icon,
          onSelect: () => { selectPage(item.key as PageKey); selectTab('docs'); },
        })),
      },
      { key: 'search', label: locale === 'zh' ? '搜索' : 'Search', icon: <Search size={22} />, active: activeTab === 'search' && !isAuthView && !isLegalView, onSelect: () => { selectTab('search'); } },
    ]} />
  );

  // ── render ──
  return (
    <>
      {renderDrawer()}
      <MobileShell topBar={!isAuthView ? renderTopBar() : undefined} bottomNav={!isAuthView && !isLegalView ? renderBottomNav() : undefined}>
        {renderContent()}
      </MobileShell>
      <Sheet variant="action" open={actionSheetOpen} onOpenChange={(v) => { if (!v) setActionSheetOpen(false); }}
        title={mobileView === 'docs' ? (locale === 'zh' ? '页面操作' : 'Page actions') : (locale === 'zh' ? '快捷操作' : 'Quick actions')}
        description={mobileView === 'docs' ? (locale === 'zh' ? '为当前页面选择一个动作。' : 'Choose an action for this page.') : (locale === 'zh' ? '浏览首页、文档、账户与语言入口。' : 'Open home, docs, account, and language actions.')}>
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
