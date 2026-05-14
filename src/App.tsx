import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  ChevronRight,
  Compass,
  FileCode2,
  FileText,
  Globe,
  House,
  LayoutDashboard,
  List,
  LogIn,
  MoreHorizontal,
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
import { CodeBlock } from './components/CodeBlock';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ErrorPage } from './components/pages/ErrorPage';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { locales, useI18n } from './i18n';
import { Responsive } from './components/Responsive';
import { MobileApp } from './components/mobile/MobileApp';
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
  Dialog,
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
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useTheme,
  useToast,
  useViewport,
} from './lib';

const DOC_PAGE_KEYS = [
  'introduction',
  'quick-start',
  'shell-sidebar',
  'grid-page',
  'button',
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
  'command-palette',
  'code-block',
  'language-switcher',
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
  { key: 'gettingStarted', pages: ['introduction'] },
  { key: 'layout', pages: ['quick-start'] },
  {
    key: 'components',
    pages: [
      'shell-sidebar',
      'grid-page',
      'nav-layout',
      'button',
      'elements',
      'form-controls',
      'form-inputs',
      'navigation',
      'overlays',
      'data-display',
      'data-list',
      'empty-states',
      'toasts',
      'feedback',
      'command-palette',
      'code-block',
      'language-switcher',
    ],
  },
  {
    key: 'templates',
    pages: ['home-page', 'login-page', 'register-page', 'error-page', 'privacy-policy', 'terms-of-service'],
  },
  { key: 'mobile', pages: ['mobile'] },
];

const MOBILE_PREVIEW_PAGES = new Set<PageKey>([
  'quick-start',
  'shell-sidebar',
  'grid-page',
  'button',
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
  'command-palette',
  'code-block',
  'language-switcher',
  'mobile',
  'home-page',
  'login-page',
  'register-page',
  'error-page',
  'privacy-policy',
]);

const pageIcons: Record<PageKey, ReactNode> = {
  introduction: <Compass size={16} />,
  'quick-start': <Zap size={16} />,
  'shell-sidebar': <PanelsTopLeft size={16} />,
  'grid-page': <LayoutDashboard size={16} />,
  button: <Sparkles size={16} />,
  elements: <Palette size={16} />,
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
  'command-palette': <Search size={16} />,
  'code-block': <FileText size={16} />,
  'language-switcher': <Globe size={16} />,
  mobile: <Smartphone size={16} />,
  'home-page': <House size={16} />,
  'login-page': <LogIn size={16} />,
  'register-page': <UserPlus size={16} />,
  'error-page': <AlertTriangle size={16} />,
  'privacy-policy': <ShieldCheck size={16} />,
  'terms-of-service': <FileCode2 size={16} />,
};

function getDocsGroupLabel(key: NavGroupKey, isZh: boolean) {
  switch (key) {
    case 'gettingStarted':
      return isZh ? '介绍' : 'Introduction';
    case 'layout':
      return isZh ? '安装' : 'Installation';
    case 'components':
      return isZh ? '组件' : 'Components';
    case 'templates':
      return isZh ? '模板' : 'Templates';
    case 'mobile':
      return isZh ? '响应式' : 'Responsive';
    case 'feedback':
      return isZh ? '反馈' : 'Feedback';
    default:
      return isZh ? '文档' : 'Docs';
  }
}

function getDocsGroupDescription(key: NavGroupKey, isZh: boolean) {
  switch (key) {
    case 'gettingStarted':
      return isZh
        ? '先理解设计目标、页面壳层和这套组件系统解决的问题。'
        : 'Start with the design goals, the page shell, and what this library is meant to solve.';
    case 'layout':
      return isZh
        ? '安装包、引入样式、挂载 Provider，并创建第一个页面。'
        : 'Install the package, import styles, mount providers, and create the first page.';
    case 'components':
      return isZh
        ? '布局、表单、反馈、数据展示与浮层统一收敛到一个组件入口。'
        : 'Layout, forms, feedback, data display, and overlays now live under one component entry point.';
    case 'templates':
      return isZh
        ? '直接查看主页、认证页、错误页和法务页等完整页面结构。'
        : 'Jump straight to full-page examples for home, auth, error, and legal flows.';
    case 'mobile':
      return isZh
        ? '同一套路由和内容模型如何适配手机、平板和桌面。'
        : 'See how the same route tree and content model adapt across phone, tablet, and desktop.';
    case 'feedback':
      return isZh ? '确认状态、加载状态和空状态的反馈模式。' : 'Review status, loading, and empty-state feedback patterns.';
    default:
      return isZh ? '浏览文档内容。' : 'Browse documentation content.';
  }
}

const QUICK_START_PREVIEW_SNIPPETS = {
  install: String.raw`npm install vxui-react

// src/main.tsx
import 'vxui-react/styles.css';`,
  providers: String.raw`import ReactDOM from 'react-dom/client';
import { ThemeProvider, ToastProvider, ViewportProvider, themePresets } from 'vxui-react';
import App from './App';
import 'vxui-react/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider themes={themePresets} defaultTheme="light">
    <ViewportProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ViewportProvider>
  </ThemeProvider>,
);`,
  layout: String.raw`import {
  AppShell,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ViewportProvider,
} from 'vxui-react';

const navSections = [
  {
    title: 'Workspace',
    items: [
      { key: 'overview', label: 'Overview', active: true },
      { key: 'components', label: 'Components' },
    ],
  },
];

export default function App() {
  return (
    <ViewportProvider>
      <AppShell
        brand="Acme Ops"
        title="Overview"
        description="Build admin screens from one reusable shell."
        navSections={navSections}
        headerActions={<Button size="sm">Create order</Button>}
      >
        <Card>
          <CardHeader>
            <CardTitle>Queue health</CardTitle>
          </CardHeader>
          <CardContent>All services are online.</CardContent>
        </Card>
      </AppShell>
    </ViewportProvider>
  );
}`,
  feedback: String.raw`import { Button, useToast } from 'vxui-react';

export function SaveButton() {
  const { push } = useToast();

  return (
    <Button
      onClick={() =>
        push({
          tone: 'success',
          title: 'Saved',
          description: 'The latest changes are now available to your team.',
        })
      }
    >
      Save changes
    </Button>
  );
}`,
} as const;

const DOC_USAGE_SNIPPETS: Partial<Record<PageKey, string>> = {
  introduction: String.raw`import {
  AppShell,
  ThemeProvider,
  ToastProvider,
  ViewportProvider,
  themePresets,
} from 'vxui-react';
import 'vxui-react/styles.css';

export function App() {
  return (
    <ThemeProvider themes={themePresets} defaultTheme="light">
      <ViewportProvider>
        <ToastProvider>
          <AppShell
            title="Overview"
            description="Start with the shell, then compose cards, forms, and feedback."
            navItems={[{ key: 'home', label: 'Home', active: true }]}
          >
            <div>Your first VXUI screen.</div>
          </AppShell>
        </ToastProvider>
      </ViewportProvider>
    </ThemeProvider>
  );
}`,
  'quick-start': String.raw`import { useState } from 'react';
import {
  AppShell,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ThemeProvider,
  ToastProvider,
  ViewportProvider,
  themePresets,
  useToast,
} from 'vxui-react';
import 'vxui-react/styles.css';

const navSections = [
  {
    title: 'Workspace',
    items: [{ key: 'overview', label: 'Overview', active: true }],
  },
];

function Workspace() {
  const [projectName, setProjectName] = useState('Launch checklist');
  const { push } = useToast();

  return (
    <AppShell
      brand="Acme Ops"
      title="Overview"
      description="Ship internal tools with one component system."
      navSections={navSections}
      headerActions={
        <Button
          size="sm"
          onClick={() =>
            push({
              tone: 'success',
              title: 'Saved',
              description: 'The project settings were updated.',
            })
          }
        >
          Save
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Project name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider themes={themePresets} defaultTheme="light">
      <ViewportProvider>
        <ToastProvider>
          <Workspace />
        </ToastProvider>
      </ViewportProvider>
    </ThemeProvider>
  );
}`,
  'shell-sidebar': String.raw`import { AppShell, Button, Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

const navSections = [
  {
    title: 'Guides',
    items: [
      { key: 'overview', label: 'Overview', active: true },
      { key: 'components', label: 'Components', badge: '18' },
      { key: 'templates', label: 'Templates' },
    ],
  },
];

export function DocsShell() {
  return (
    <AppShell
      brand="VXUI Docs"
      brandCaption="React component library"
      title="Overview"
      description="Keep navigation, header actions, and content in one shell."
      navSections={navSections}
      headerActions={<Button size="sm">Publish</Button>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Layout overview</CardTitle>
        </CardHeader>
        <CardContent>Use AppShell as the outer frame for docs, dashboards, and tools.</CardContent>
      </Card>
    </AppShell>
  );
}`,
  'grid-page': String.raw`import { Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

const metrics = [
  { label: 'Orders', value: '128' },
  { label: 'Pending', value: '12' },
  { label: 'SLA', value: '99.9%' },
];

export function MetricsGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      }}
    >
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle>{metric.label}</CardTitle>
          </CardHeader>
          <CardContent>{metric.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}`,
  button: String.raw`import { Button } from 'vxui-react';

export function ButtonExamples() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      <Button fullWidth>Full width action</Button>
    </div>
  );
}`,
  elements: String.raw`import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

export function ActionCard() {
  return (
    <Card>
      <CardHeader>
        <Badge variant="accent">New</Badge>
        <CardTitle>Operator workspace</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button>Save</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="ghost">Cancel</Button>
        <Badge variant="success">Live</Badge>
      </CardContent>
    </Card>
  );
}`,
  'form-controls': String.raw`import { Button, Input, Select, Textarea } from 'vxui-react';

export function ProjectForm() {
  return (
    <form style={{ display: 'grid', gap: 16 }}>
      <Input label="Project name" placeholder="Northwind migration" />

      <Select label="Release track" defaultValue="stable">
        <option value="stable">Stable</option>
        <option value="preview">Preview</option>
        <option value="internal">Internal</option>
      </Select>

      <Textarea
        label="Summary"
        rows={4}
        placeholder="Describe what changed in this release."
      />

      <Button type="submit">Save changes</Button>
    </form>
  );
}`,
  'form-inputs': String.raw`import { useState } from 'react';
import { Checkbox, Radio, RadioGroup, Slider, Switch } from 'vxui-react';

export function PreferencesForm() {
  const [realtimeAlerts, setRealtimeAlerts] = useState(true);
  const [coverage, setCoverage] = useState(80);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox
        defaultChecked
        label="Enable weekly digest"
        description="Summarize the most important operational changes."
      />

      <Switch
        checked={realtimeAlerts}
        onCheckedChange={setRealtimeAlerts}
        label="Realtime alerts"
        description="Push toast notifications when deployments finish."
      />

      <RadioGroup label="Density">
        <Radio name="density" value="comfortable" label="Comfortable" defaultChecked />
        <Radio name="density" value="compact" label="Compact" />
      </RadioGroup>

      <Slider
        label="Documentation coverage"
        min={0}
        max={100}
        value={coverage}
        onChange={(event) => setCoverage(Number(event.target.value))}
        showValue
      />
    </div>
  );
}`,
  navigation: String.raw`import { useState } from 'react';
import { Pagination, Tabs, TabsContent, TabsList, TabsTrigger } from 'vxui-react';

export function DocsNavigation() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="mobile">Responsive</TabsTrigger>
        </TabsList>

        <TabsContent value="components">Browse primitives and composition patterns.</TabsContent>
        <TabsContent value="templates">Open ready-made page structures.</TabsContent>
        <TabsContent value="mobile">Keep the same content model on smaller screens.</TabsContent>
      </Tabs>

      <Pagination page={page} total={48} pageSize={8} onChange={setPage} />
    </div>
  );
}`,
  'data-list': String.raw`import { Badge, Table } from 'vxui-react';

type ReleaseRow = {
  name: string;
  owner: string;
  status: 'Live' | 'Draft';
};

const columns = [
  { key: 'name', header: 'Release', accessor: (row: ReleaseRow) => row.name },
  { key: 'owner', header: 'Owner', accessor: (row: ReleaseRow) => row.owner },
  {
    key: 'status',
    header: 'Status',
    accessor: (row: ReleaseRow) => (
      <Badge variant={row.status === 'Live' ? 'success' : 'warning'}>{row.status}</Badge>
    ),
  },
];

const data: ReleaseRow[] = [
  { name: 'May rollout', owner: 'Alice', status: 'Live' },
  { name: 'June beta', owner: 'Bo', status: 'Draft' },
];

export function ReleaseTable() {
  return <Table columns={columns} data={data} striped bordered />;
}`,
  'empty-states': String.raw`import { Button, Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

export function EmptyProjects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No projects yet</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'grid', gap: 12 }}>
        <p>Create the first project to start tracking releases.</p>
        <div>
          <Button>Create project</Button>
        </div>
      </CardContent>
    </Card>
  );
}`,
  toasts: String.raw`import { Button, useToast } from 'vxui-react';

export function PublishButton() {
  const { push } = useToast();

  return (
    <Button
      onClick={() =>
        push({
          tone: 'success',
          title: 'Release published',
          description: 'Customers can see the new version now.',
        })
      }
    >
      Publish release
    </Button>
  );
}`,
  feedback: String.raw`import { Alert, Progress, Skeleton } from 'vxui-react';

export function SyncStatus({ loading = false }: { loading?: boolean }) {
  if (loading) {
    return <Skeleton variant="text" lines={3} />;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert variant="info" title="Migration in progress">
        Shared routes and page templates have been consolidated into one runtime.
      </Alert>
      <Progress label="Rollout progress" value={72} showLabel />
    </div>
  );
}`,
  overlays: String.raw`import { Button, Dialog, DropdownMenu, Popover } from 'vxui-react';

export function OverlayExamples() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Dialog
        trigger={<Button>Delete project</Button>}
        title="Delete project"
        description="This action removes access for the whole team."
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Delete</Button>
          </>
        }
      >
        This project will be removed permanently.
      </Dialog>

      <Popover content={<div>Show context without leaving the current page.</div>}>
        <Button variant="secondary">Open popover</Button>
      </Popover>

      <DropdownMenu
        trigger={<Button variant="secondary">More actions</Button>}
        items={[
          { label: 'Duplicate' },
          { label: 'Archive' },
          { label: 'Delete', danger: true },
        ]}
      />
    </div>
  );
}`,
  'nav-layout': String.raw`import { Accordion } from 'vxui-react';

const items = [
  {
    key: 'route-tree',
    title: 'Single route tree',
    content: 'Keep docs, auth, and legal pages inside one app shell.',
  },
  {
    key: 'responsive-shell',
    title: 'Responsive shell',
    content: 'Collapse navigation at narrow widths without forking the page tree.',
  },
];

export function InformationArchitecture() {
  return <Accordion items={items} defaultOpen={['route-tree']} />;
}`,
  'data-display': String.raw`import { Avatar, Badge, Table } from 'vxui-react';

type TeamRow = {
  role: string;
  scope: string;
  status: 'Stable' | 'Live';
};

const columns = [
  { key: 'role', header: 'Role', accessor: (row: TeamRow) => row.role },
  { key: 'scope', header: 'Scope', accessor: (row: TeamRow) => row.scope },
  {
    key: 'status',
    header: 'Status',
    accessor: (row: TeamRow) => (
      <Badge variant={row.status === 'Stable' ? 'success' : 'accent'}>{row.status}</Badge>
    ),
  },
];

const data: TeamRow[] = [
  { role: 'Design system', scope: 'Shared primitives', status: 'Stable' },
  { role: 'Documentation', scope: 'Content navigation', status: 'Live' },
];

export function OwnershipTable() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Avatar name="Alice Chen" size="sm" />
        <Avatar name="Bo Wang" size="md" />
        <Avatar name="Cora Lin" size="lg" />
      </div>
      <Table columns={columns} data={data} compact />
    </div>
  );
}`,
  mobile: String.raw`import { Bell, Home, Search, User } from 'lucide-react';
import {
  BottomNav,
  MobileIconButton,
  MobileShell,
  MobileTopBar,
} from 'vxui-react';

const items = [
  { key: 'home', label: 'Home', icon: <Home size={18} />, active: true },
  { key: 'search', label: 'Search', icon: <Search size={18} /> },
  { key: 'alerts', label: 'Alerts', icon: <Bell size={18} />, badge: '3' },
  { key: 'profile', label: 'Profile', icon: <User size={18} /> },
];

export function MobileWorkspace() {
  return (
    <MobileShell
      topBar={
        <MobileTopBar
          title="Orders"
          trailing={<MobileIconButton label="Notifications"><Bell size={18} /></MobileIconButton>}
        />
      }
      bottomNav={<BottomNav items={items} />}
    >
      <div style={{ padding: 16 }}>Keep the same content model, just adapt the shell.</div>
    </MobileShell>
  );
}`,
  'home-page': String.raw`import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

export function MarketingHome() {
  return (
    <section style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <Badge variant="accent">New release</Badge>
        <h1>Build internal tools faster</h1>
        <p>Combine layout, forms, feedback, and responsive navigation in one system.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button>Get started</Button>
          <Button variant="secondary">Browse docs</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why teams use VXUI</CardTitle>
        </CardHeader>
        <CardContent>One shell, one theme system, and one component vocabulary.</CardContent>
      </Card>
    </section>
  );
}`,
  'login-page': String.raw`import { Button, Card, CardContent, CardHeader, CardTitle, Input } from 'vxui-react';

export function LoginScreen() {
  return (
    <Card style={{ maxWidth: 420, margin: '0 auto' }}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'grid', gap: 16 }}>
        <Input label="Email" type="email" placeholder="team@example.com" />
        <Input label="Password" type="password" placeholder="Enter your password" />
        <Button type="submit" fullWidth>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}`,
  'register-page': String.raw`import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input } from 'vxui-react';

export function RegisterScreen() {
  return (
    <Card style={{ maxWidth: 420, margin: '0 auto' }}>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'grid', gap: 16 }}>
        <Input label="Name" placeholder="Alex Morgan" />
        <Input label="Email" type="email" placeholder="alex@example.com" />
        <Input label="Password" type="password" placeholder="Create a password" />
        <Checkbox label="I agree to the terms of service and privacy policy" />
        <Button type="submit" fullWidth>
          Create account
        </Button>
      </CardContent>
    </Card>
  );
}`,
  'error-page': String.raw`import { Alert, Button, Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

export function ErrorState() {
  return (
    <Card style={{ maxWidth: 560, margin: '0 auto' }}>
      <CardHeader>
        <CardTitle>We could not load this workspace</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'grid', gap: 16 }}>
        <Alert variant="danger" title="Request failed">
          Try refreshing the page or returning to a known route.
        </Alert>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button>Retry</Button>
          <Button variant="secondary">Back to dashboard</Button>
        </div>
      </CardContent>
    </Card>
  );
}`,
  'privacy-policy': String.raw`import { Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

export function PrivacyPolicyPage() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>Privacy policy</CardTitle>
        </CardHeader>
        <CardContent>
          We collect operational data only to provide access control, product analytics, and support.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data retention</CardTitle>
        </CardHeader>
        <CardContent>Document how long logs, audit events, and profile details are retained.</CardContent>
      </Card>
    </div>
  );
}`,
  'terms-of-service': String.raw`import { Card, CardContent, CardHeader, CardTitle } from 'vxui-react';

export function TermsOfServicePage() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>Terms of service</CardTitle>
        </CardHeader>
        <CardContent>
          Explain account responsibilities, acceptable use, and the support boundaries for your product.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service commitments</CardTitle>
        </CardHeader>
        <CardContent>List uptime targets, incident communication, and escalation paths.</CardContent>
      </Card>
    </div>
  );
}`,
  'command-palette': String.raw`import { useState } from 'react';
import { Button, CommandPalette } from 'vxui-react';

const entries = [
  { key: 'home', label: 'Home', description: 'Back to the main landing page' },
  { key: 'docs', label: 'Documentation', description: 'Browse all components' },
  { key: 'button', label: 'Button', description: 'Primary action component' },
  { key: 'dialog', label: 'Dialog', description: 'Modal confirmation overlay' },
];

export function SearchExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open search <kbd>⌘K</kbd>
      </Button>
      <CommandPalette
        open={open}
        entries={entries}
        placeholder="Search components, pages…"
        emptyText={(q) => \`No results for "\${q}"\`}
        ariaLabel="Search"
        labelClose="Close"
        labelGo="Go"
        labelNavigate="Navigate"
        onClose={() => setOpen(false)}
        onSelect={(key) => { setOpen(false); console.log('selected:', key); }}
      />
    </>
  );
}`,
  'code-block': String.raw`import { CodeBlock } from 'vxui-react';

const snippet = \`import { Button } from 'vxui-react';

export function Example() {
  return <Button>Click me</Button>;
}\`;

export function CodeExample() {
  return <CodeBlock code={snippet} language="tsx" />;
}`,
  'language-switcher': String.raw`import { LanguageSwitcher } from 'vxui-react';

// Wrap your app with the i18n provider, then drop in the switcher anywhere.
export function TopbarActions() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <LanguageSwitcher variant="inline" />
    </div>
  );
}`,
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

function buildMobilePreviewPath(pageKey: PageKey) {
  return `/m/docs/${pageKey}`;
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

function DesktopApp() {
  const { t, locale, setLocale } = useI18n();
  const isZh = locale === 'zh';
  const pages = t.pageDefs as Record<PageKey, PageDefinition>;
  const { push } = useToast();
  const { mode, setTheme, theme, themes } = useTheme();
  const { isTablet, isTabletPortrait } = useViewport();
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
  const docsTopbarRef = useRef<HTMLElement | null>(null);
  const docHeaderRef = useRef<HTMLElement | null>(null);
  const [docsTopbarWidth, setDocsTopbarWidth] = useState<number>(() => (typeof window === 'undefined' ? 0 : window.innerWidth));
  const [isDocHeaderInView, setIsDocHeaderInView] = useState(true);
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
        accountMenu: 'Account',
      };

  const activePage = route.view === 'docs' ? route.page ?? 'introduction' : 'introduction';
  const activeDocument = pages[activePage] ?? pages.introduction;
  const isDocDetailPage = route.view === 'docs' && activePage !== 'introduction';
  const showPinnedDocTitle = isDocDetailPage && !isDocHeaderInView;
  const topbarDocLabel = showPinnedDocTitle ? activeDocument.title : (isZh ? '文档' : 'Documentation');
  // Progressive toolbar overflow: estimate how many buttons fit in the available topbar width.
  // In tablet mode (≤1023px, landscape) the actions row wraps to a new full-width line (padding overhead ≈ 40px).
  // In desktop mode or tablet portrait, actions are inline and share space with breadcrumbs (overhead ≈ 246px).
  const isTabletLandscape = isTablet && !isTabletPortrait;
  const TOOLBAR_OVERHEAD = isTabletLandscape ? 40 : (isTabletPortrait ? 130 : 246);
  const TOOLBAR_GAP = 10;
  const MORE_BTN_WIDTH = 92;
  // Estimated widths (px) for each sm button in priority order
  const TOOLBAR_ITEM_WIDTHS = [130, 110, 170, 105, 95, 125]; // back, search, density, theme, account, language
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
  const showBack = docsToolbarVisibleCount >= 1;
  const showSearch = docsToolbarVisibleCount >= 2;
  const showDensity = docsToolbarVisibleCount >= 3;
  const showThemeBtn = docsToolbarVisibleCount >= 4;
  const showAccountBtn = docsToolbarVisibleCount >= 5;
  const showLanguageBtn = docsToolbarVisibleCount >= 6;
  const showMoreMenu = docsToolbarVisibleCount < TOOLBAR_ITEM_WIDTHS.length;
  const densityLabel = isZh ? `密度：${compactDensity ? '紧凑' : '舒适'}` : `Density: ${compactDensity ? 'Compact' : 'Comfortable'}`;
  const themeMenuItems = themeEntries.map(([themeName, definition]) => ({
    label: `${definition.label ?? themeName}${theme === themeName ? (isZh ? ' (当前)' : ' (current)') : ''}`,
    icon: <Palette size={14} />,
    onClick: () => setTheme(themeName),
  }));
  const accountMenuItems = viewerSession
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
      ];
  const docsNavigationMenuGroup = {
    label: isZh ? '导航' : 'Navigation',
    items: [
      {
        label: t.publicPages.backHome,
        icon: <House size={14} />,
        onClick: () => navigate({ view: 'home' }),
      },
      {
        label: t.searchTrigger,
        icon: <Search size={14} />,
        shortcut: '⌘K',
        onClick: () => setSearchOpen(true),
      },
    ],
  };
  const docsViewMenuGroup = {
    label: isZh ? '视图' : 'View',
    items: [
      {
        label: densityLabel,
        icon: <SlidersHorizontal size={14} />,
        onClick: () => setCompactDensity((current) => !current),
      },
    ],
  };
  const docsThemeMenuGroup = {
    label: isZh ? '主题' : 'Theme',
    items: themeMenuItems,
  };
  const docsAccountMenuGroup = {
    label: copy.accountMenu,
    items: accountMenuItems,
  };
  const docsLanguageMenuGroup = {
    label: isZh ? '语言' : 'Language',
    items: Object.entries(locales).map(([localeKey, definition]) => ({
      label: `${definition.label}${locale === localeKey ? (isZh ? ' (当前)' : ' (current)') : ''}`,
      icon: <Globe size={14} />,
      onClick: () => setLocale(localeKey),
    })),
  };
  const docsControlMenuGroups = [
    docsNavigationMenuGroup,
    docsViewMenuGroup,
    docsThemeMenuGroup,
    docsAccountMenuGroup,
    docsLanguageMenuGroup,
  ];

  const metricCards = [
    { label: copy.metrics.templates, value: '6', hint: copy.metrics.templatesDesc },
    { label: copy.metrics.docs, value: String(DOC_PAGE_KEYS.length), hint: copy.metrics.docsDesc },
    { label: copy.metrics.breakpoints, value: '3', hint: copy.metrics.breakpointsDesc },
    { label: copy.metrics.themes, value: String(themeEntries.length), hint: copy.metrics.themesDesc },
  ];

  const docsHomeCopy = isZh
    ? {
        badge: 'Documentation',
        title: 'VXUI React 文档',
        lead: '文档入口按标准组件库目录组织：先看介绍，再完成安装，然后进入组件、模板和响应式模式。',
        primary: '阅读简介',
        secondary: '开始安装',
        pathTitle: '推荐顺序',
        pathBody: '首次接入建议按照 介绍 -> 安装 -> 组件 -> 模板 -> 响应式 的顺序浏览。',
        indexTitle: 'Documentation Index',
        indexLead: '五个标准入口覆盖整个文档库，避免把概念、接入方式和页面模板混在一起。',
        sectionsTitle: '按章节浏览',
        sectionsLead: '使用更标准的文档分层，让用户先找到“看什么”，再决定“怎么用”。',
        pathsTitle: '推荐阅读路径',
        pathsLead: '不同任务从不同入口进入，但都落在同一套文档结构里。',
        rulesTitle: '全局约定',
        rulesLead: '规则性的说明适合集中放在首页，避免在每个组件页和模板页重复出现。',
        rulesItems: [
          '保持所有断点上的路由树一致，只调整壳层结构和内容密度。',
          '在窄屏上把常驻侧边导航转成抽屉，而不是复制另一套页面实现。',
          '让卡片、表单和表格从多列到单列平滑重排，不改变组件归属。',
        ],
        toolsTitle: '文档级控制',
        toolsLead: '主题、密度和搜索属于全局工具，应放在文档工具栏统一控制，而不是在每个章节底部重复渲染。',
        toolsItems: [
          '主题切换统一放在顶部工具栏的 Theme 菜单中。',
          '紧凑模式通过顶部工具栏的密度切换按钮统一开关。',
          '详情页默认只保留 Guidance、Preview 和 Code Example 三个核心区块。',
        ],
        openSection: '打开章节',
        entryCount: '个条目',
        walkthroughTitle: '首次接入',
        walkthroughItems: [
          '先看简介，明确这套组件库的边界和目标。',
          '进入安装章节，完成样式引入、Provider 挂载和第一个页面。',
          '再浏览组件章节，按布局、表单、反馈和数据展示逐步接入。',
        ],
        adoptionTitle: '常见使用路径',
        adoptionItems: [
          { key: 'product', title: '搭业务页面', content: '从安装开始，然后进入 Components，优先看 Shell、Form Controls、Data Display。' },
          { key: 'marketing', title: '搭公共页面', content: '先看 Templates，再回到 Components 补充按钮、表单和反馈细节。' },
          { key: 'responsive', title: '做多端适配', content: '最后看 Responsive，确认同一套路由和内容在窄屏下如何重排。' },
        ],
      }
    : {
        badge: 'Documentation',
        title: 'VXUI React Documentation',
        lead: 'The docs entry is now organized like a standard UI library: introduction first, installation next, then components, templates, and responsive patterns.',
        primary: 'Read introduction',
        secondary: 'Start installation',
        pathTitle: 'Recommended order',
        pathBody: 'For a first pass, follow Introduction -> Installation -> Components -> Templates -> Responsive.',
        indexTitle: 'Documentation Index',
        indexLead: 'Five standard entry points cover the whole library so concepts, setup, and page examples no longer compete on the same screen.',
        sectionsTitle: 'Browse by Section',
        sectionsLead: 'Use a more standard information architecture so people can find what to read before deciding how to apply it.',
        pathsTitle: 'Recommended Paths',
        pathsLead: 'Different tasks start from different entry points, but they all land in the same documentation structure.',
        rulesTitle: 'Global Conventions',
        rulesLead: 'Rule-oriented guidance belongs on the docs entry page so it does not repeat across every component or template page.',
        rulesItems: [
          'Keep one route tree across breakpoints and only adapt shell structure and density.',
          'Turn persistent side navigation into a drawer on narrow screens instead of duplicating page implementations.',
          'Let cards, forms, and tables reflow from multiple columns to one without changing component ownership.',
        ],
        toolsTitle: 'Documentation Controls',
        toolsLead: 'Theme, density, and search are global documentation tools, so they belong in the toolbar instead of being repeated at the bottom of every page.',
        toolsItems: [
          'Theme switching lives in the top toolbar Theme menu.',
          'Compact density is controlled through the toolbar density toggle.',
          'Detail pages now keep only Guidance, Preview, and Code Example as the core content blocks.',
        ],
        openSection: 'Open section',
        entryCount: 'entries',
        walkthroughTitle: 'First integration',
        walkthroughItems: [
          'Read the introduction to understand the goals and boundaries of the library.',
          'Move to installation to import styles, mount providers, and ship the first page.',
          'Browse components next, starting with shell, form controls, feedback, and data display.',
        ],
        adoptionTitle: 'Common reading paths',
        adoptionItems: [
          { key: 'product', title: 'Build product screens', content: 'Start with Installation, then move into Components, especially Shell, Form Controls, and Data Display.' },
          { key: 'marketing', title: 'Build public pages', content: 'Start from Templates, then return to Components to refine actions, forms, and feedback.' },
          { key: 'responsive', title: 'Ship across devices', content: 'Finish with Responsive to verify how the same route tree and content reflow at smaller widths.' },
        ],
      };

  const docsHomeGroups = DOC_NAV_GROUPS.map((group) => ({
    ...group,
    label: getDocsGroupLabel(group.key, isZh),
    description: getDocsGroupDescription(group.key, isZh),
  }));

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
        title: getDocsGroupLabel(group.key, isZh),
        items: group.pages.map((pageKey) => ({
          key: pageKey,
          label: pages[pageKey].title,
          icon: pageIcons[pageKey],
          active: pageKey === activePage,
          onSelect: () => navigate({ view: 'docs', page: pageKey }),
        })),
      })),
    [activePage, isZh, pages],
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
    const target = docsTopbarRef.current;

    if (!target) {
      return;
    }

    const syncWidth = () => {
      setDocsTopbarWidth(target.getBoundingClientRect().width);
    };

    syncWidth();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDocsTopbarWidth(entry ? entry.contentRect.width : target.getBoundingClientRect().width);
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    
    // Automatically reset scroll position across the app on route change
    requestAnimationFrame(() => {
      const scrollable = document.querySelector('.vx-shell__content');
      if (scrollable) {
        scrollable.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    });
  }, [route]);

  useEffect(() => {
    if (!isDocDetailPage) {
      setIsDocHeaderInView(true);
      return;
    }

    setIsDocHeaderInView(true);
  }, [isDocDetailPage, activePage]);

  useEffect(() => {
    if (!isDocDetailPage) {
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
        rootMargin: '-72px 0px 0px 0px',
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isDocDetailPage, activePage]);

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

  async function handleCopyCode(code: string) {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        throw new Error('Clipboard is unavailable.');
      }

      push({
        tone: 'success',
        title: isZh ? '代码已复制' : 'Code copied',
        description: isZh ? '示例代码已复制到剪贴板。' : 'The example code was copied to your clipboard.',
      });
      return true;
    } catch {
      push({
        tone: 'warning',
        title: isZh ? '复制失败' : 'Copy failed',
        description: isZh ? '当前环境不支持自动复制，请手动选择代码。' : 'Automatic copy is unavailable here. Please select and copy the code manually.',
      });
      return false;
    }
  }

  function renderCodeBlock(code: string, language: 'tsx' | 'bash' = 'tsx') {
    return (
      <CodeBlock
        code={code}
        language={language}
        copyLabel={isZh ? '复制代码' : 'Copy code'}
        copiedLabel={isZh ? '已复制' : 'Copied'}
        onCopy={handleCopyCode}
      />
    );
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
        const quickStartTabs = [
          { value: 'install', label: isZh ? '安装' : 'Install', code: QUICK_START_PREVIEW_SNIPPETS.install },
          { value: 'providers', label: isZh ? 'Providers' : 'Providers', code: QUICK_START_PREVIEW_SNIPPETS.providers },
          { value: 'layout', label: isZh ? '页面壳层' : 'Layout', code: QUICK_START_PREVIEW_SNIPPETS.layout },
          { value: 'feedback', label: isZh ? '反馈' : 'Feedback', code: QUICK_START_PREVIEW_SNIPPETS.feedback },
        ] as const;

        return (
          <Tabs defaultValue="install">
            <TabsList>
              {quickStartTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {quickStartTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {renderCodeBlock(tab.code, tab.value === 'install' ? 'bash' : 'tsx')}
              </TabsContent>
            ))}
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
      case 'button':
        return (
          <div className="vx-doc-preview-stack">
            <div className="vx-doc-preview-inline vx-doc-preview-inline--wrap">
              <Button>{isZh ? '主要按钮' : 'Primary'}</Button>
              <Button variant="secondary">{isZh ? '次级按钮' : 'Secondary'}</Button>
              <Button variant="ghost">{isZh ? '幽灵按钮' : 'Ghost'}</Button>
              <Button variant="danger">{isZh ? '危险按钮' : 'Danger'}</Button>
            </div>
            <div className="vx-doc-preview-inline vx-doc-preview-inline--wrap">
              <Button size="sm">{isZh ? '小' : 'Small'}</Button>
              <Button size="md">{isZh ? '中' : 'Medium'}</Button>
              <Button size="lg">{isZh ? '大' : 'Large'}</Button>
            </div>
            <div className="vx-doc-preview-inline vx-doc-preview-inline--wrap">
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
            <Progress label={isZh ? '默认' : 'Default'} showLabel value={sliderValue} />
            <Progress label={isZh ? '成功' : 'Success'} showLabel value={sliderValue} variant="success" />
            <Progress label={isZh ? '警告' : 'Warning'} showLabel value={sliderValue} variant="warning" />
            <Progress label={isZh ? '危险' : 'Danger'} showLabel value={sliderValue} variant="danger" />
            <Progress label={isZh ? '炫彩' : 'Rainbow'} showLabel value={sliderValue} variant="rainbow" size="lg" />
            <div className="vx-doc-skeleton-grid">
              <Skeleton lines={3} variant="text" />
              <Skeleton height={92} />
            </div>
          </div>
        );
      case 'overlays':
        return (
          <div className="vx-doc-preview-inline vx-doc-preview-inline--wrap">
            <Dialog
              trigger={<Button variant="secondary">{isZh ? '打开对话框' : 'Open dialog'}</Button>}
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
      case 'command-palette':
        return (
          <div className="vx-doc-preview-stack">
            <div className="vx-doc-preview-inline">
              <Button onClick={() => setSearchOpen(true)}>
                {isZh ? '打开搜索' : 'Open search'}
                <kbd className="vx-search-kbd">⌘K</kbd>
              </Button>
            </div>
            <Alert variant="info" title={isZh ? '键盘优先' : 'Keyboard first'}>
              {isZh
                ? '按下 ⌘K（Mac）或 Ctrl+K（Windows）即可随时唤起命令面板，无需鼠标。'
                : 'Press ⌘K (Mac) or Ctrl+K (Windows) to open the palette from anywhere without reaching for the mouse.'}
            </Alert>
          </div>
        );
      case 'code-block':
        return renderCodeBlock(
          isZh
            ? `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>点击我</Button>;\n}`
            : `import { Button } from 'vxui-react';\n\nexport function Example() {\n  return <Button>Click me</Button>;\n}`,
          'tsx',
        );
      case 'language-switcher':
        return (
          <div className="vx-doc-preview-stack">
            <div className="vx-doc-preview-inline">
              <LanguageSwitcher variant="inline" />
            </div>
            <Alert variant="info" title={isZh ? '全局语言切换' : 'Global language switch'}>
              {isZh
                ? '切换语言后，文档内所有 UI 文案（包括顶栏和导航）同步更新，无需刷新页面。'
                : 'Switching locale updates all UI copy — including the topbar and nav — across the entire docs surface without a page reload.'}
            </Alert>
          </div>
        );
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
            <Badge variant="accent">{docsHomeCopy.badge}</Badge>
            <h1>{docsHomeCopy.title}</h1>
            <p>{docsHomeCopy.lead}</p>
            <div className="vx-docs-home__actions">
              <Button size="lg" onClick={() => navigate({ view: 'docs', page: 'introduction' })}>
                <Compass size={16} />
                {docsHomeCopy.primary}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate({ view: 'docs', page: 'quick-start' })}>
                <Zap size={16} />
                {docsHomeCopy.secondary}
              </Button>
            </div>
            <Alert title={docsHomeCopy.pathTitle} variant="info">
              {docsHomeCopy.pathBody}
            </Alert>
          </div>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{docsHomeCopy.indexTitle}</h2>
            <p>{docsHomeCopy.indexLead}</p>
          </div>
          <div className="vx-doc-architecture-grid">
            <Card className="vx-docs-home__panel">
              <CardHeader>
                <CardTitle>{isZh ? '文档总览' : 'Docs Overview'}</CardTitle>
                <CardDescription>
                  {isZh
                    ? '从页面规模、断点层级和发布轨道快速判断当前文档范围。'
                    : 'Review the scope of the docs through page count, breakpoints, and release track.'}
                </CardDescription>
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
                <div className="vx-doc-control-grid vx-doc-control-grid--single">
                  <Select label={copy.releaseLabel} value={releaseTrack} onChange={(event) => setReleaseTrack(event.target.value as ReleaseTrack)}>
                    <option value="stable">{copy.releaseOptions.stable}</option>
                    <option value="preview">{copy.releaseOptions.preview}</option>
                    <option value="internal">{copy.releaseOptions.internal}</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="vx-docs-home__panel">
              <CardHeader>
                <CardTitle>{copy.contentMapTitle}</CardTitle>
                <CardDescription>{copy.libraryLead}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-doc-content-map">
                  {docsHomeGroups.map((group) => (
                    <button
                      key={group.key}
                      type="button"
                      className="vx-doc-content-map__row"
                      onClick={() => navigate({ view: 'docs', page: group.pages[0] })}
                    >
                      <div>
                        <strong>{group.label}</strong>
                        <span>{group.description}</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{docsHomeCopy.sectionsTitle}</h2>
            <p>{docsHomeCopy.sectionsLead}</p>
          </div>
          <div className="vx-doc-library-grid">
            {docsHomeGroups.map((group) => (
              <Card key={group.key} className="vx-doc-library-card">
                <CardHeader>
                  <CardTitle>{group.label}</CardTitle>
                  <CardDescription>
                    {group.pages.length} {docsHomeCopy.entryCount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="vx-doc-library-card__links">
                    {group.pages.slice(0, 5).map((pageKey) => (
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
                  <div style={{ marginTop: 14 }}>
                    <Button size="sm" variant="secondary" onClick={() => navigate({ view: 'docs', page: group.pages[0] })}>
                      {docsHomeCopy.openSection}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{docsHomeCopy.pathsTitle}</h2>
            <p>{docsHomeCopy.pathsLead}</p>
          </div>
          <div className="vx-doc-architecture-grid">
            <Card>
              <CardHeader>
                <CardTitle>{docsHomeCopy.walkthroughTitle}</CardTitle>
                <CardDescription>{docsHomeCopy.pathBody}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="vx-doc-list">
                  {docsHomeCopy.walkthroughItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{docsHomeCopy.adoptionTitle}</CardTitle>
                <CardDescription>{docsHomeCopy.sectionsLead}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion items={docsHomeCopy.adoptionItems} defaultOpen={['product']} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="vx-docs-home__section">
          <div className="vx-docs-home__section-head">
            <h2>{docsHomeCopy.rulesTitle}</h2>
            <p>{docsHomeCopy.rulesLead}</p>
          </div>
          <div className="vx-doc-architecture-grid">
            <Card>
              <CardHeader>
                <CardTitle>{docsHomeCopy.rulesTitle}</CardTitle>
                <CardDescription>{docsHomeCopy.rulesLead}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="vx-doc-list">
                  {docsHomeCopy.rulesItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{docsHomeCopy.toolsTitle}</CardTitle>
                <CardDescription>{docsHomeCopy.toolsLead}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="vx-doc-list">
                  {docsHomeCopy.toolsItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  function renderDocPage() {
    const usageSnippet = DOC_USAGE_SNIPPETS[activePage];
    const sample = renderSample(activePage);
    const hasSample = sample !== null;
    const mobilePreviewPath = MOBILE_PREVIEW_PAGES.has(activePage)
      ? buildMobilePreviewPath(activePage)
      : null;

    // Flat ordered page list for prev/next navigation
    const flatPages = DOC_NAV_GROUPS.flatMap((g) => g.pages);
    const currentIndex = flatPages.indexOf(activePage);
    const prevPage = currentIndex > 0 ? flatPages[currentIndex - 1] : null;
    const nextPage = currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

    return (
      <article className="vx-bs-doc-page">
        {/* Page header */}
        <header ref={docHeaderRef} className="vx-bs-doc-header">
          <span className="vx-bs-doc-kicker">{activeDocument.section}</span>
          <h1>{activeDocument.title}</h1>
          <p className="vx-bs-doc-lead">{activeDocument.description}</p>
          <div className="vx-bs-doc-header-badges">
            <span className="vx-version-pill">{copy.livePreview}</span>
          </div>
        </header>

        {/* Content body + right TOC */}
        <div className="vx-bs-doc-body">
          <div className="vx-bs-doc-content">
            {/* Overview / Guidance */}
            <section id="overview" className="vx-bs-doc-section">
              <h2 className="vx-bs-section-heading">
                {isZh ? '使用指南' : 'Overview'}
                <a href="#overview" className="vx-bs-anchor" aria-label={isZh ? '链接到使用指南' : 'Link to Overview'}>#</a>
              </h2>
              <ul className="vx-doc-list">
                {activeDocument.guidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Live example */}
            {hasSample && (
              <section id="example" className="vx-bs-doc-section">
                <h2 className="vx-bs-section-heading">
                  {isZh ? '示例' : 'Example'}
                  <a href="#example" className="vx-bs-anchor" aria-label={isZh ? '链接到示例' : 'Link to Example'}>#</a>
                </h2>
                <div className="vx-bs-example-grid">
                  <div className="vx-bs-example-panel">
                    <div className="vx-bs-example-panel__meta">
                      <span className="vx-bs-example-panel__eyebrow">{isZh ? '桌面端' : 'Desktop'}</span>
                      <strong>{copy.livePreview}</strong>
                    </div>
                    <div className="vx-bs-example">{sample}</div>
                  </div>

                  {mobilePreviewPath && (
                    <div className="vx-bs-example-panel vx-bs-example-panel--mobile">
                      <div className="vx-bs-example-panel__meta">
                        <span className="vx-bs-example-panel__eyebrow">{isZh ? '移动端' : 'Mobile'}</span>
                        <strong>{isZh ? '同步预览' : 'Synced preview'}</strong>
                      </div>
                      <div className="vx-bs-mobile-preview">
                        <div className="vxm-phone-frame vx-bs-mobile-preview__frame">
                          <iframe
                            className="vx-bs-mobile-preview__iframe"
                            loading="lazy"
                            src={mobilePreviewPath}
                            title={`${activeDocument.title} ${isZh ? '移动端预览' : 'mobile preview'}`}
                          />
                        </div>
                        <p className="vx-bs-mobile-preview__hint">
                          {isZh
                            ? '这里加载真实的移动端文档页，便于同时对比桌面与手机呈现。'
                            : 'This loads the real mobile docs page so desktop and phone presentations stay in sync.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Code usage */}
            {usageSnippet && (
              <section id="usage" className="vx-bs-doc-section">
                <h2 className="vx-bs-section-heading">
                  {isZh ? '用法' : 'Usage'}
                  <a href="#usage" className="vx-bs-anchor" aria-label={isZh ? '链接到用法' : 'Link to Usage'}>#</a>
                </h2>
                {renderCodeBlock(usageSnippet)}
              </section>
            )}
          </div>

        </div>

        {/* Prev / Next page navigation */}
        {(prevPage ?? nextPage) && (
          <nav className="vx-bs-doc-pager" aria-label={isZh ? '分页导航' : 'Page navigation'}>
            {prevPage ? (
              <button
                type="button"
                className="vx-bs-doc-pager__btn"
                onClick={() => navigate({ view: 'docs', page: prevPage })}
              >
                <span className="vx-bs-doc-pager__dir">← {isZh ? '上一页' : 'Previous'}</span>
                <span className="vx-bs-doc-pager__label">{pages[prevPage].title}</span>
              </button>
            ) : (
              <div />
            )}
            {nextPage && (
              <button
                type="button"
                className="vx-bs-doc-pager__btn vx-bs-doc-pager__btn--next"
                onClick={() => navigate({ view: 'docs', page: nextPage })}
              >
                <span className="vx-bs-doc-pager__dir">{isZh ? '下一页' : 'Next'} →</span>
                <span className="vx-bs-doc-pager__label">{pages[nextPage].title}</span>
              </button>
            )}
          </nav>
        )}
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
        brandIcon={<img src="/colorful_flat_icon.svg" alt="" />}
        topbarRef={docsTopbarRef}
        density={compactDensity ? 'compact' : 'comfortable'}
        breadcrumb={
          <div className="vx-doc-breadcrumb" data-state={showPinnedDocTitle ? 'pinned' : 'overview'}>
            {showPinnedDocTitle ? <span className="vx-doc-breadcrumb__kicker">{activeDocument.section}</span> : null}
            <strong>{topbarDocLabel}</strong>
            {showPinnedDocTitle ? <span className="vx-doc-breadcrumb__summary">{activeDocument.description}</span> : null}
          </div>
        }
        headerActions={
          <div className="vx-docs-toolbar">
            {showBack ? (
              <Button variant="outline" size="sm" onClick={() => navigate({ view: 'home' })}>
                <House size={14} />
                {t.publicPages.backHome}
              </Button>
            ) : null}
            {showSearch ? (
              <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
                <Search size={14} />
                {t.searchTrigger}
                <kbd className="vx-search-kbd">⌘K</kbd>
              </Button>
            ) : null}
            {showDensity ? (
              <Button
                variant={compactDensity ? 'soft' : 'outline'}
                size="sm"
                onClick={() => setCompactDensity((current) => !current)}
              >
                <SlidersHorizontal size={14} />
                {densityLabel}
              </Button>
            ) : null}
            {showThemeBtn ? (
              <DropdownMenu
                trigger={
                  <Button variant="outline" size="sm">
                    <Palette size={14} />
                    {themes[theme]?.label ?? theme}
                  </Button>
                }
                items={themeMenuItems}
                align="right"
              />
            ) : null}
            {showAccountBtn ? (
              <DropdownMenu
                trigger={
                  <Button variant="outline" size="sm">
                    <User size={14} />
                    {viewerSession?.name ?? t.publicPages.guestLabel}
                  </Button>
                }
                groups={[{ label: copy.accountMenu, items: accountMenuItems }]}
                align="right"
              />
            ) : null}
            {showLanguageBtn ? <LanguageSwitcher variant="inline" /> : null}
            {showMoreMenu ? (
              <DropdownMenu
                key="docs-toolbar-more"
                trigger={
                  <Button variant="outline" size="sm">
                    <MoreHorizontal size={14} />
                    {isZh ? '更多' : 'More'}
                  </Button>
                }
                groups={[
                  ...(!showBack || !showSearch ? [{
                    label: isZh ? '导航' : 'Navigation',
                    items: [
                      ...(!showBack ? [{ label: t.publicPages.backHome, icon: <House size={14} />, onClick: () => navigate({ view: 'home' }) }] : []),
                      ...(!showSearch ? [{ label: t.searchTrigger, icon: <Search size={14} />, shortcut: '⌘K', onClick: () => setSearchOpen(true) }] : []),
                    ],
                  }] : []),
                  ...(!showDensity ? [{ label: isZh ? '视图' : 'View', items: [{ label: densityLabel, icon: <SlidersHorizontal size={14} />, onClick: () => setCompactDensity((c) => !c) }] }] : []),
                  ...(!showThemeBtn ? [{ label: isZh ? '主题' : 'Theme', items: themeMenuItems }] : []),
                  ...(!showAccountBtn ? [{ label: copy.accountMenu, items: accountMenuItems }] : []),
                  ...(!showLanguageBtn ? [{ label: isZh ? '语言' : 'Language', items: Object.entries(locales).map(([k, d]) => ({ label: `${d.label}${locale === k ? (isZh ? ' (当前)' : ' (current)') : ''}`, icon: <Globe size={14} />, onClick: () => setLocale(k) })) }] : []),
                ]}
                align="right"
              />
            ) : null}
          </div>
        }
        menuButtonLabel={isZh ? '切换导航' : 'Toggle navigation'}
        mobileNavOpen={mobileNavOpen}
        navSections={navSections}
        onMobileNavToggle={() => setMobileNavOpen((current) => !current)}
        onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
        onSidebarClick={(e) => {
          if (isTabletPortrait && !mobileNavOpen) {
            e.stopPropagation();
            e.preventDefault();
            setMobileNavOpen(true);
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
          {activePage === 'introduction' ? renderDocsHome() : renderDocPage()}
        </div>
      </AppShell>
    </>
  );
}

export default function App() {
  return (
    <Responsive
      desktop={<DesktopApp />}
      mobile={<MobileApp />}
    />
  );
}