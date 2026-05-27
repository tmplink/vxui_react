# VXUI React · v1.3.3

**Website**: [ui.vx.link](https://ui.vx.link) &nbsp;|&nbsp; **GitHub**: [tmplink/vxui_react](https://github.com/tmplink/vxui_react) &nbsp;|&nbsp; [中文](README.md)

VXUI React is a general-purpose React UI component library designed for admin panels, ops dashboards, internal tools, and data-heavy interfaces.

## 🚀 Changelog

> **v1.3.3** — 2025-05
> - Added [`llms.txt`](llms.txt) — AI knowledge base file for AI tools to read component documentation directly
> - Bundle size optimization, removed redundant dependencies
> - Fixed style compatibility issues across multiple components

See full changelog at [GitHub Releases](https://github.com/tmplink/vxui_react/releases).

The documentation follows the conventions of popular UI frameworks: installation first, then a minimal working example, then scenario-specific component code.

## Installation

Install from npm:

```bash
npm install vxui-react
```

`react` and `react-dom` must be provided by the host application.

## Import Styles

```tsx
import 'vxui-react/styles.css';
```

## Basic Setup

```tsx
// src/main.tsx
import ReactDOM from 'react-dom/client';
import { ThemeProvider, ToastProvider, themePresets } from 'vxui-react';
import App from './App';
import 'vxui-react/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider themes={themePresets} defaultTheme="light">
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);
```

## First Page

```tsx
import {
  AppShell,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from 'vxui-react';

const navSections = [
  {
    title: 'Workspace',
    items: [{ key: 'overview', label: 'Overview', active: true }],
  },
];

export function App() {
  return (
    <AppShell
      brand="Acme Ops"
      title="Overview"
      description="Build internal tools with a single shell."
      navSections={navSections}
      headerActions={<Button size="sm">Create order</Button>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Queue health</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="Search orders" placeholder="PO-1024" />
        </CardContent>
      </Card>
    </AppShell>
  );
}
```

## Form Example

```tsx
import { Button, Checkbox, Input, Select, Textarea } from 'vxui-react';

export function ProjectForm() {
  return (
    <form style={{ display: 'grid', gap: 16 }}>
      <Input label="Project name" placeholder="Northwind migration" />

      <Select
        label="Release track"
        defaultValue="stable"
        options={[
          { value: 'stable', label: 'Stable' },
          { value: 'preview', label: 'Preview' },
          { value: 'internal', label: 'Internal' },
        ]}
      />

      <Textarea
        label="Summary"
        rows={4}
        placeholder="Describe what changed in this release."
      />

      <Checkbox label="Notify operators after publish" defaultChecked />

      <Button type="submit">Save changes</Button>
    </form>
  );
}
```

## Feedback Example

```tsx
import { Alert, Button, Progress, useToast } from 'vxui-react';

export function PublishActions() {
  const { push } = useToast();

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert variant="info" title="Ready to publish">
        Confirm the release notes before you notify customers.
      </Alert>

      <Progress label="Rollout progress" value={72} showLabel />

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
    </div>
  );
}
```

## Custom Theme

```tsx
import { ThemeProvider, createTheme, themePresets } from 'vxui-react';

const themes = {
  ...themePresets,
  ocean: createTheme('dark', {
    label: 'Ocean',
    tokens: {
      '--vx-primary': '#38bdf8',
      '--vx-primary-strong': '#0ea5e9',
      '--vx-primary-soft': 'rgba(56, 189, 248, 0.16)',
      '--vx-bg': '#06131f',
      '--vx-surface': '#0d2236',
    },
  }),
};

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themes={themes} defaultTheme="ocean">
      {children}
    </ThemeProvider>
  );
}
```

Use `useTheme()` at runtime to read the current theme or call `setTheme('ocean')` to switch to any registered theme.

## What's Included

- **Layout**: AppShell, Card, Separator, Breadcrumb, Pagination, Resizable, ScrollArea
- **Forms**: Input, Select, Checkbox, Radio, Textarea, Slider, Switch, NumberInput, TagInput, ColorPicker, DatePicker, FileUpload, Form, Rating
- **Feedback**: Alert, AlertDialog, Toast, Progress, Skeleton, Spinner, Stepper, Timeline, EmptyState
- **Overlay**: Dialog, Sheet, Popover, DropdownMenu, ContextMenu, Tooltip, HoverCard, CommandPalette, Menubar, NavigationMenu

### Dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| trigger | ReactNode | **required** | Element that triggers opening the dialog |
| title | string | **required** | Dialog title |
| description | string | — | Optional description below the title |
| children | ReactNode | **required** | Dialog body content |
| footer | ReactNode | — | Footer action area |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'md' | Width preset |
| placement | 'center' \| 'top' \| 'right' \| 'bottom' \| 'left' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'top-half' \| 'right-half' \| 'bottom-half' \| 'left-half' | 'center' | Screen position (desktop only) |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | Inner padding preset |
| scrollable | boolean | true | Enable scroll when content overflows |
| closable | boolean | true | Show close button (×) |
| **fullscreen** | **boolean** | **false** | **Fullscreen mode: occupies the entire viewport, ideal for mobile devices** |
| className | string | — | Additional CSS class |
| defaultOpen | boolean | false | Whether the dialog is open by default |
| open | boolean | — | Controlled open state |
| onOpenChange | (open: boolean) => void | — | Open state change handler |
- **Data Display**: Avatar, Table, Badge, Tabs, Accordion, TreeView, Carousel, Calendar
- **Typography**: Heading, Text, Label, CodeBlock
- **Mobile**: MobileShell, BottomNav, ActionSheet, MobileDrawer, MobileList

## Local Development

```bash
npm install
npm run dev
```

## Validation & Build

```bash
# TypeScript type check
npm run typecheck

# Build component library (for npm publish)
npm run build

# Build demo site (for Pages deployment, output to dist-demo/)
npm run build:demo
```
