/**
 * Navigation configuration for VXUI React documentation app.
 * Extracted from App.tsx for better maintainability.
 */

import type { ReactNode } from 'react';
import {
  AlertTriangle, Bell, Boxes, CalendarDays, ChevronRight, CheckCircle2, Compass,
  FileCode2, FileText, Globe, GripHorizontal, Hash, House, ImageIcon, LayoutDashboard,
  List, LogIn, Menu, Minus, Monitor, Moon, Navigation, Palette,
  PanelsTopLeft, PanelRightClose, Search, ShieldCheck, SlidersHorizontal,
  Smartphone, Sparkles, Star, Sun, Tag, Upload, User, UserPlus, Zap,
} from 'lucide-react';
import type { PageKey, NavGroupKey, NavGroupItem } from './routes';

export const pageIcons: Record<PageKey, ReactNode> = {
  introduction: <Compass size={16} />,
  'quick-start': <Zap size={16} />,
  'shell-sidebar': <PanelsTopLeft size={16} />,
  'grid-page': <LayoutDashboard size={16} />,
  'nav-layout': <LayoutDashboard size={16} />,
  'scroll-area': <FileText size={16} />,
  separator: <Minus size={16} />,
  resizable: <GripHorizontal size={16} />,
  typography: <FileText size={16} />,
  'typography-base': <FileText size={16} />,
  badge: <ShieldCheck size={16} />,
  avatar: <User size={16} />,
  skeleton: <LayoutDashboard size={16} />,
  card: <LayoutDashboard size={16} />,
  'code-block': <FileCode2 size={16} />,
  'language-switcher': <Globe size={16} />,
  button: <Sparkles size={16} />,
  elements: <Palette size={16} />,
  'form-controls': <FileText size={16} />,
  'form-inputs': <SlidersHorizontal size={16} />,
  toggle: <SlidersHorizontal size={16} />,
  rating: <Star size={16} />,
  label: <Tag size={16} />,
  'vxui-provider': <Boxes size={16} />,
  viewport: <Monitor size={16} />,
  constants: <SlidersHorizontal size={16} />,
  calendar: <CalendarDays size={16} />,
  'bottom-nav': <Menu size={16} />,
  'date-pickers': <CalendarDays size={16} />,
  'file-upload': <Upload size={16} />,
  'color-picker': <Palette size={16} />,
  form: <LayoutDashboard size={16} />,
  accordion: <List size={16} />,
  tabs: <FileText size={16} />,
  breadcrumb: <List size={16} />,
  pagination: <List size={16} />,
  stepper: <List size={16} />,
  progress: <List size={16} />,
  spinner: <List size={16} />,
  alert: <AlertTriangle size={16} />,
  toasts: <Bell size={16} />,
  table: <FileText size={16} />,
  'data-list': <List size={16} />,
  timeline: <List size={16} />,
  'tree-view': <Boxes size={16} />,
  carousel: <LayoutDashboard size={16} />,
  'empty-states': <AlertTriangle size={16} />,
  overlays: <ChevronRight size={16} />,
  'data-display': <Boxes size={16} />,
  navigation: <Compass size={16} />,
  feedback: <ShieldCheck size={16} />,
  dialog: <ChevronRight size={16} />,
  sheet: <PanelRightClose size={16} />,
  popover: <ChevronRight size={16} />,
  tooltip: <ChevronRight size={16} />,
  'hover-card': <ChevronRight size={16} />,
  'dropdown-menu': <ChevronRight size={16} />,
  'context-menu': <ChevronRight size={16} />,
  'command-palette': <Search size={16} />,
  'navigation-menu': <Navigation size={16} />,
  menubar: <Menu size={16} />,
  mobile: <Smartphone size={16} />,
  'mobile-list': <List size={16} />,
  image: <ImageIcon size={16} />,
  'pin-input': <Hash size={16} />,
  descriptions: <List size={16} />,
  notification: <Bell size={16} />,
  result: <CheckCircle2 size={16} />,
  'home-page': <House size={16} />,
  'login-page': <LogIn size={16} />,
  'register-page': <UserPlus size={16} />,
  'error-page': <AlertTriangle size={16} />,
  'privacy-policy': <ShieldCheck size={16} />,
  'terms-of-service': <FileCode2 size={16} />,
};

export const DOC_NAV_GROUPS: Array<{ key: NavGroupKey; items: NavGroupItem[] }> = [
  { key: 'gettingStarted', items: ['introduction', 'vxui-provider', 'viewport', 'constants'] },
  { key: 'layout', items: ['quick-start', 'shell-sidebar', 'grid-page', 'nav-layout', 'scroll-area', 'separator', 'resizable'] },
  { key: 'content', items: ['typography', 'typography-base', 'badge', 'avatar', 'skeleton', 'card', 'code-block', 'language-switcher', 'image', 'descriptions'] },
  {
    key: 'forms',
    items: [
      { type: 'submenu', key: 'inputs', i18nKey: 'inputs', pages: ['form-controls', 'form-inputs'], icon: <SlidersHorizontal size={16} /> },
      'toggle', 'rating', 'label', 'date-pickers', 'file-upload', 'color-picker', 'form', 'calendar', 'pin-input',
    ],
  },
  {
    key: 'components',
    items: [
      'button', 'elements', 'accordion', 'tabs', 'breadcrumb', 'pagination',
      'stepper', 'progress', 'spinner', 'alert', 'toasts', 'table',
      'data-list', 'timeline', 'tree-view', 'carousel', 'empty-states', 'notification', 'result',
    ],
  },
  {
    key: 'overlays',
    items: [
      'dialog', 'sheet', 'popover', 'tooltip', 'hover-card',
      'dropdown-menu', 'context-menu', 'command-palette',
    ],
  },
  { key: 'navigation', items: ['navigation-menu', 'menubar'] },
  { key: 'feedback', items: ['feedback'] },
  {
    key: 'templates',
    items: ['home-page', 'login-page', 'register-page', 'error-page', 'privacy-policy', 'terms-of-service'],
  },
  { key: 'mobile', items: ['mobile', 'mobile-list', 'bottom-nav'] },
];

export const MOBILE_PREVIEW_PAGES = new Set<PageKey>([
  'quick-start', 'shell-sidebar', 'grid-page', 'nav-layout', 'scroll-area',
  'separator', 'resizable', 'typography', 'typography-base', 'badge', 'avatar', 'skeleton',
  'card', 'code-block', 'language-switcher', 'button', 'elements',
  'form-controls', 'form-inputs', 'toggle', 'rating', 'label', 'date-pickers',
  'file-upload', 'color-picker', 'form', 'calendar', 'accordion', 'tabs', 'breadcrumb',
  'vxui-provider', 'viewport', 'constants', 'calendar', 'bottom-nav',
  'pagination', 'stepper', 'progress', 'spinner', 'alert', 'toasts', 'table',
  'data-list', 'timeline', 'tree-view', 'carousel', 'empty-states', 'overlays',
  'data-display', 'navigation', 'feedback', 'dialog', 'sheet', 'popover',
  'tooltip', 'hover-card', 'dropdown-menu', 'context-menu', 'command-palette',
  'navigation-menu', 'menubar', 'mobile', 'mobile-list', 'home-page',
  'login-page', 'register-page', 'error-page', 'privacy-policy', 'terms-of-service',
  'image', 'pin-input', 'descriptions', 'notification', 'result',
]);

export function getDocsGroupLabel(key: NavGroupKey, isZh: boolean) {
  const labels: Record<NavGroupKey, [string, string]> = {
    gettingStarted: ['介绍', 'Getting Started'],
    layout: ['布局', 'Layout'],
    content: ['内容展示', 'Content'],
    forms: ['表单', 'Forms'],
    components: ['组件', 'Components'],
    overlays: ['浮层', 'Overlays'],
    navigation: ['导航', 'Navigation'],
    feedback: ['反馈', 'Feedback'],
    templates: ['模板', 'Templates'],
    mobile: ['响应式', 'Responsive'],
  };
  const pair = labels[key];
  return isZh ? pair[0] : pair[1];
}

export function getDocsGroupDescription(key: NavGroupKey, isZh: boolean) {
  const descriptions: Record<NavGroupKey, [string, string]> = {
    gettingStarted: ['先理解设计目标、页面壳层和这套组件系统解决的问题。', 'Start with the design goals, the page shell, and what this library is meant to solve.'],
    layout: ['页面框架、栅格系统、布局组件和响应式容器。', 'Page shell, grid system, layout components, and responsive containers.'],
    content: ['排版、徽章、头像、卡片和代码块等内容展示组件。', 'Typography, badges, avatars, cards, and code blocks for content display.'],
    forms: ['输入框、选择器、开关、日期选择器和表单组合模式。', 'Inputs, selectors, switches, date pickers, and form composition patterns.'],
    components: ['按钮、反馈、数据展示和交互核心组件。', 'Buttons, feedback, data display, and core interaction components.'],
    overlays: ['弹窗、弹出框、提示和侧滑面板等浮层组件。', 'Modals, popovers, tooltips, and sheet panels for overlay interactions.'],
    navigation: ['导航菜单和菜单栏组件。', 'Navigation menu and menubar components.'],
    feedback: ['确认状态、加载状态和空状态的反馈模式。', 'Review status, loading, and empty-state feedback patterns.'],
    templates: ['直接查看主页、认证页、错误页和法务页等完整页面结构。', 'Jump straight to full-page examples for home, auth, error, and legal flows.'],
    mobile: ['同一套路由和内容模型如何适配手机、平板和桌面。', 'See how the same route tree and content model adapt across phone, tablet, and desktop.'],
  };
  const pair = descriptions[key];
  return isZh ? pair[0] : pair[1];
}
