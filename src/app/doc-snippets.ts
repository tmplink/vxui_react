/**
 * Documentation code snippets for VXUI React.
 * Extracted from App.tsx for better maintainability.
 */

export const QUICK_START_PREVIEW_SNIPPETS = {
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

export const DOC_USAGE_SNIPPETS: Record<string, string> = {
  calendar: String.raw`import { Calendar } from 'vxui-react';

export function CalendarExample() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Calendar />
      <Calendar weekStartsOnMonday />
      <Calendar min={new Date()} max={new Date(Date.now() + 30 * 86400000)} />
    </div>
  );
}`,
  'bottom-nav': String.raw`import { BottomNav } from 'vxui-react';
import { Bell, House, Search, User } from 'lucide-react';

export function MobileNav() {
  return (
    <BottomNav items={[
      { key: 'home', label: 'Home', icon: <House size={20} />, active: true },
      { key: 'search', label: 'Search', icon: <Search size={20} /> },
      { key: 'alerts', label: 'Alerts', icon: <Bell size={20} />, badge: 3 },
      { key: 'profile', label: 'Profile', icon: <User size={20} /> },
    ]} />
  );
}`,
  'vxui-provider': String.raw`import { VXUIProvider, themePresets } from 'vxui-react';
import 'vxui-react/styles.css';

export function App() {
  return (
    <VXUIProvider themes={themePresets} defaultTheme="light">
      <YourApp />
    </VXUIProvider>
  );
}`,
  viewport: String.raw`import { ViewportProvider, useViewport } from 'vxui-react';

function DeviceInfo() {
  const { viewport, isPhone, isTablet, isDesktop, screenWidth } = useViewport();
  return (
    <div>
      <p>Device: {viewport}</p>
      <p>Screen: {screenWidth}px</p>
    </div>
  );
}

export function App() {
  return (
    <ViewportProvider>
      <DeviceInfo />
    </ViewportProvider>
  );
}`,
  constants: String.raw`import { BREAKPOINTS, PHONE_MAX_WIDTH, PHONE_ASPECT_RATIO_THRESHOLD } from 'vxui-react';

// CSS layout breakpoints
console.log(BREAKPOINTS.sm); // 640
console.log(BREAKPOINTS.md); // 768
console.log(BREAKPOINTS.lg); // 1000

// Device detection thresholds
console.log(PHONE_MAX_WIDTH); // 1000
console.log(PHONE_ASPECT_RATIO_THRESHOLD); // 0.7`,
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
  AppShell, Button, Card, CardContent, CardHeader, CardTitle,
  Input, ThemeProvider, ToastProvider, ViewportProvider,
  themePresets, useToast,
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
        <Button size="sm" onClick={() => push({ tone: 'success', title: 'Saved', description: 'The project settings were updated.' })}>
          Save
        </Button>
      }
    >
      <Card>
        <CardHeader><CardTitle>Project</CardTitle></CardHeader>
        <CardContent>
          <Input label="Project name" value={projectName} onChange={(event) => setProjectName(event.target.value)} />
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
  'typography-base': String.raw`import {
  Article, ArticleHeader, ArticleTitle, ArticleBody,
  Section, SectionHeading, Pager, PropsTable,
  ArticleEmptyState, StatsGrid,
} from 'vxui-react';
import 'vxui-react/styles.css';

// 方式一：直接使用 CSS 类名
function UsingCSSClasses() {
  return (
    <div className="vx-article">
      <header className="vx-article__header">
        <span className="vx-kicker">Category</span>
        <h1 className="vx-article__title">Page Title</h1>
        <p className="vx-article__description">Page description.</p>
      </header>
      <div className="vx-article__body">
        <section className="vx-section">
          <h2 className="vx-section__heading">
            Section Title
            <a href="#section" className="vx-section__anchor">#</a>
          </h2>
          <p className="vx-lead">Lead paragraph text.</p>
          <ul className="vx-list">
            <li>List item one</li>
            <li>List item two</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// 方式二：使用 React 组件
function UsingComponents() {
  const columns = [
    { prop: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Button variant.' },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.', required: true },
  ];

  return (
    <Article>
      <ArticleHeader>
        <span className="vx-kicker">Components</span>
        <ArticleTitle>Button</ArticleTitle>
        <p className="vx-article__description">Primary action element.</p>
      </ArticleHeader>
      <ArticleBody>
        <Section sectionId="overview">
          <SectionHeading anchor="#overview">Overview</SectionHeading>
          <p>Content here...</p>
        </Section>
        <Section sectionId="api">
          <SectionHeading anchor="#api">API Reference</SectionHeading>
          <PropsTable columns={columns} />
        </Section>
      </ArticleBody>
      <Pager
        prev={{ label: 'Previous page', onClick: () => {} }}
        next={{ label: 'Next page', onClick: () => {} }}
      />
    </Article>
  );
}

// 方式三：空状态和统计网格
function Utilities() {
  return (
    <>
      <StatsGrid items={[
        { label: 'Components', value: '10', hint: 'Ready to import', icon: <Zap size={20} /> },
        { label: 'CSS Classes', value: '30+', hint: 'Out of the box', icon: <Palette size={20} /> },
      ]} />
      <ArticleEmptyState
        icon={<AlertTriangle size={20} />}
        title="No content yet"
        description="Use ArticleEmptyState to display empty states."
      />
    </>
  );
}`,
  dialog: String.raw`import { Dialog, Button, Select, Input } from 'vxui-react';
import { useState } from 'react';

export function DialogExample() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string>();
  return (
    <>
      <Button onClick={() => setOpen(true)}>Create User</Button>
      <Dialog trigger={<div />} title="New User" open={open} onOpenChange={setOpen}
        onConfirm={() => console.log({ role })} onCancel={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Name" placeholder="Full name" />
          <Input label="Email" placeholder="user@example.com" />
          <Select
            label="Role"
            placeholder="Choose a role"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'editor', label: 'Editor' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            value={role}
            onChange={setRole}
          />
        </div>
      </Dialog>
    </>
  );
}`,
  popover: String.raw`import { Popover, Button } from 'vxui-react';

export function PopoverExample() {
  return (
    <Popover content={<div style={{ padding: 16 }}>Popover content with <Button size="sm">Action</Button></div>}>
      <Button>Open Popover</Button>
    </Popover>
  );
}`,
  tooltip: String.raw`import { Tooltip } from 'vxui-react';

export function TooltipExample() {
  return (
    <Tooltip content="This is a tooltip">
      <span>Hover me</span>
    </Tooltip>
  );
}`,
  'hover-card': String.raw`import { HoverCard } from 'vxui-react';

export function HoverCardExample() {
  return (
    <HoverCard content={<div style={{ padding: 16 }}><strong>Details</strong><p>Rich preview content here.</p></div>}>
      <span>Hover for details</span>
    </HoverCard>
  );
}`,
  'dropdown-menu': String.raw`import { useState } from 'react';
import { DropdownMenu } from 'vxui-react';

export function DropdownMenuExample() {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wrapLines, setWrapLines] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  return (
    <DropdownMenu
      trigger={<button>Editor Settings</button>}
      onSelect={(item) => console.log('Selected:', item.label)}
      groups={[
        {
          label: 'Actions',
          items: [
            { label: 'Duplicate', onClick: () => {} },
            {
              label: 'Archive',
              description: 'Move to archive folder',
              onClick: () => {},
            },
          ],
        },
        {
          label: 'Preferences',
          items: [
            {
              label: 'Show Line Numbers',
              type: 'checkbox',
              checked: showLineNumbers,
              onClick: () => setShowLineNumbers((v) => !v),
            },
            {
              label: 'Wrap Lines',
              type: 'checkbox',
              checked: wrapLines,
              onClick: () => setWrapLines((v) => !v),
            },
          ],
        },
        {
          label: 'Font Size',
          items: [
            { label: 'Small',  type: 'radio', checked: fontSize === 'sm', onClick: () => setFontSize('sm') },
            { label: 'Medium', type: 'radio', checked: fontSize === 'md', onClick: () => setFontSize('md') },
            { label: 'Large',  type: 'radio', checked: fontSize === 'lg', onClick: () => setFontSize('lg') },
          ],
        },
        {
          items: [
            { label: 'Delete', danger: true, onClick: () => {} },
          ],
        },
      ]}
    />
  );
}`,
  'context-menu': String.raw`import { ContextMenu } from 'vxui-react';

export function ContextMenuExample() {
  return (
    <ContextMenu
      items={[
        { label: 'Copy', onClick: () => {} },
        { label: 'Paste', onClick: () => {} },
        { label: 'Delete', danger: true, onClick: () => {} },
      ]}
    >
      <div style={{ padding: 40, border: '1px dashed #ccc', textAlign: 'center' }}>
        Right-click this area
      </div>
    </ContextMenu>
  );
}`,
  'command-palette': String.raw`import { CommandPalette } from 'vxui-react';

export function CommandPaletteExample() {
  const entries = [
    { key: 'home', title: 'Home', section: 'Pages', description: 'Go to home page' },
    { key: 'settings', title: 'Settings', section: 'Pages', description: 'Open settings' },
  ];
  return (
    <CommandPalette
      entries={entries}
      open={false}
      onClose={() => {}}
      onSelect={(key) => console.log(key)}
    />
  );
}`,
  'navigation-menu': String.raw`import { NavigationMenu } from 'vxui-react';

export function NavigationMenuExample() {
  return (
    <NavigationMenu
      items={[
        { label: 'Home', href: '#' },
        { label: 'Products', items: [
          { label: 'Overview', href: '#' },
          { label: 'Pricing', href: '#' },
        ]},
        { label: 'About', href: '#' },
      ]}
    />
  );
}`,
  menubar: String.raw`import { Menubar } from 'vxui-react';

export function MenubarExample() {
  return (
    <Menubar
      menus={[
        { label: 'File', items: [
          { label: 'New', onClick: () => {} },
          { label: 'Open', onClick: () => {} },
          { label: 'Save', shortcut: 'Ctrl+S', onClick: () => {} },
        ]},
        { label: 'Edit', items: [
          { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => {} },
          { label: 'Redo', shortcut: 'Ctrl+Shift+Z', onClick: () => {} },
        ]},
      ]}
    />
  );
}`,
  resizable: String.raw`import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from 'vxui-react';

export function ResizableExample() {
  return (
    <ResizablePanelGroup direction="horizontal" style={{ height: 200 }}>
      <ResizablePanel defaultSize={50}>
        <div style={{ padding: 16 }}>Left panel</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div style={{ padding: 16 }}>Right panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}`,
  'file-upload': String.raw`import { FileUpload } from 'vxui-react';

export function FileUploadExample() {
  return (
    <FileUpload
      label="Upload files"
      hint="Drag and drop or click to browse"
      multiple
      onFiles={(files) => console.log(files)}
    />
  );
}`,
  'color-picker': String.raw`import { ColorPicker } from 'vxui-react';

export function ColorPickerExample() {
  return (
    <ColorPicker
      label="Brand color"
      defaultValue="#3b82f6"
      onChange={(color) => console.log(color)}
    />
  );
}`,
  accordion: String.raw`import { Accordion } from 'vxui-react';

export function AccordionExample() {
  return (
    <Accordion
      items={[
        { key: '1', title: 'Section 1', content: 'Content for section 1.' },
        { key: '2', title: 'Section 2', content: 'Content for section 2.' },
        { key: '3', title: 'Section 3', content: 'Content for section 3.' },
      ]}
    />
  );
}`,
  tabs: String.raw`import { Tabs, TabsList, TabsTrigger, TabsContent } from 'vxui-react';

export function TabsExample() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1.</TabsContent>
      <TabsContent value="tab2">Content for tab 2.</TabsContent>
      <TabsContent value="tab3">Content for tab 3.</TabsContent>
    </Tabs>
  );
}`,
  breadcrumb: String.raw`import { Breadcrumb } from 'vxui-react';

export function BreadcrumbExample() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Details' },
      ]}
    />
  );
}`,
  pagination: String.raw`import { Pagination } from 'vxui-react';

export function PaginationExample() {
  return (
    <Pagination
      page={1}
      total={100}
      onChange={(page) => console.log('Page:', page)}
    />
  );
}`,
  stepper: String.raw`import { Stepper } from 'vxui-react';

export function StepperExample() {
  return (
    <Stepper
      steps={[
        { label: 'Cart', description: 'Review items' },
        { label: 'Shipping', description: 'Enter address' },
        { label: 'Payment', description: 'Complete order' },
      ]}
      currentStep={1}
    />
  );
}`,
  progress: String.raw`import { Progress } from 'vxui-react';

export function ProgressExample() {
  return <Progress value={65} label="Upload progress" showLabel />;
}`,
  spinner: String.raw`import { Spinner } from 'vxui-react';

export function SpinnerExample() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}`,
  alert: String.raw`import { Alert } from 'vxui-react';

export function AlertExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert variant="info" title="Information" />
      <Alert variant="success" title="Success" />
      <Alert variant="warning" title="Warning" />
      <Alert variant="danger" title="Error" />
    </div>
  );
}`,
  table: String.raw`import { Table } from 'vxui-react';

const columns = [
  { key: 'name', header: 'Name', accessor: (row: any) => row.name, sortable: true },
  { key: 'role', header: 'Role', accessor: (row: any) => row.role },
];

const data = [
  { name: 'Alice', role: 'Engineer' },
  { name: 'Bob', role: 'Designer' },
];

export function TableExample() {
  return <Table columns={columns} data={data} striped />;
}`,
  'code-block': String.raw`import { CodeBlock } from 'vxui-react';

export function CodeBlockExample() {
  return (
    <CodeBlock
      code="npm install vxui-react"
      language="bash"
      copyLabel="Copy"
      copiedLabel="Copied"
      onCopy={async () => true}
    />
  );
}`,
  'language-switcher': String.raw`import { LanguageSwitcher } from 'vxui-react';

export function LanguageSwitcherExample() {
  return <LanguageSwitcher />;
}`,
  toasts: String.raw`import { Button, useToast } from 'vxui-react';

export function ToastExample() {
  const { push } = useToast();
  return (
    <Button onClick={() => push({ tone: 'success', title: 'Saved', description: 'Changes saved successfully.' })}>
      Show Toast
    </Button>
  );
}`,
  image: String.raw`import { Image } from 'vxui-react';

export function ImageExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Image
        src="https://picsum.photos/400/300"
        alt="Sample"
        width={320}
        height={220}
        radius="lg"
        preview
        caption="Click to preview"
      />
      <Image
        src="/broken.jpg"
        width={200}
        height={140}
        fallback={<span>Image unavailable</span>}
      />
    </div>
  );
}`,
  'pin-input': String.raw`import { useState } from 'react';
import { PinInput } from 'vxui-react';

export function PinInputExample() {
  const [code, setCode] = useState('');
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <PinInput
        label="Verification code"
        length={6}
        value={code}
        onChange={setCode}
        onComplete={(val) => console.log('Code:', val)}
      />
      <PinInput length={4} type="alphanumeric" size="sm" />
      <PinInput length={6} mask error="Incorrect code" />
    </div>
  );
}`,
  descriptions: String.raw`import { Descriptions, Badge } from 'vxui-react';

export function DescriptionsExample() {
  return (
    <Descriptions
      title="User Profile"
      items={[
        { label: 'Name', children: 'Alice Johnson' },
        { label: 'Email', children: 'alice@example.com' },
        { label: 'Role', children: <Badge variant="accent">Admin</Badge> },
        { label: 'Status', children: <Badge variant="success">Active</Badge> },
        { label: 'Joined', children: '2024-01-15' },
        { label: 'Last login', children: '2 hours ago' },
      ]}
      bordered
      column={2}
    />
  );
}`,
  notification: String.raw`import { NotificationProvider, useNotification, Button } from 'vxui-react';

function NotificationDemo() {
  const { push } = useNotification();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => push({ title: 'Upload complete', tone: 'success', description: '3 files uploaded.', duration: 4000 })}>
        Auto-dismiss
      </Button>
      <Button variant="secondary" onClick={() => push({ title: 'System update', tone: 'warning', description: 'Restart required.' })}>
        Persistent
      </Button>
    </div>
  );
}

export function NotificationExample() {
  return (
    <NotificationProvider placement="top-right">
      <NotificationDemo />
    </NotificationProvider>
  );
}`,
  result: String.raw`import { Result, Button } from 'vxui-react';

export function ResultExample() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Result
        status="success"
        title="Payment Successful"
        description="Your order #12345 has been confirmed."
        actions={
          <>
            <Button>View Order</Button>
            <Button variant="secondary">Back to Home</Button>
          </>
        }
      />
      <Result
        status="not-found"
        title="Page Not Found"
        description="The page you are looking for does not exist."
        actions={<Button variant="secondary">Go Home</Button>}
      />
    </div>
  );
}`,
};
