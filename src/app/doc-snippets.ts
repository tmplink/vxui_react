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
};
