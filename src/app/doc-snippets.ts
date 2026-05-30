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
  // More snippets can be added here as needed
};
