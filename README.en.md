# VXUI React · v1.3.9

**Website**: [ui.vx.link](https://ui.vx.link) &nbsp;|&nbsp; **GitHub**: [tmplink/vxui_react](https://github.com/tmplink/vxui_react) &nbsp;|&nbsp; [中文](README.md)

VXUI React is a general-purpose React UI component library designed for admin panels, ops dashboards, internal tools, and data-heavy interfaces.

## 🚀 Changelog

> **v1.3.9** — 2026-06
> - Version bump to 1.3.9
> - Remove AlertDialog component (merged into Dialog)
> - Remove demo build config (vite.demo.config.ts)
>
> **v1.3.6** — 2025-05
> - Update createPortal calls in components to support dialogContentRef as target element
> - Update test cases, optimize user interaction simulation, enhance component availability verification

See full changelog at [GitHub Releases](https://github.com/tmplink/vxui_react/releases).

### v1.3.9 Migration Guide

#### New Dialog Props

v1.3.7 adds built-in confirm/cancel button support to [`Dialog`](src/components/Dialog.tsx):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onConfirm` | `() => void` | — | Callback when confirm button is clicked |
| `onCancel` | `() => void` | — | Callback when cancel button is clicked |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `confirmVariant` | `'solid' \| 'danger'` | `'solid'` | Confirm button style variant |

**Usage example:**

```tsx
import { Dialog, useToast } from 'vxui-react';

function DeleteConfirm() {
  const { push } = useToast();

  return (
    <Dialog
      trigger={<Button variant="danger">Delete Project</Button>}
      title="Confirm Deletion"
      description="This action cannot be undone."
      onConfirm={() => {
        // Execute delete logic
        push({ tone: 'success', title: 'Deleted' });
      }}
      onCancel={() => {}}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      confirmVariant="danger"
    >
      <p>All related data will be permanently removed.</p>
    </Dialog>
  );
}
```

#### AlertDialog Removal

v1.3.7 removes the standalone `AlertDialog` component. Use Dialog with `confirmVariant="danger"` for destructive actions:

**Before (v1.3.6):**
```tsx
import { AlertDialog } from 'vxui-react';

<AlertDialog
  trigger={<Button variant="danger">Delete</Button>}
  title="Confirm Delete"
  onConfirm={() => {}}
/>
```

**After (v1.3.7):**
```tsx
import { Dialog, Button } from 'vxui-react';

<Dialog
  trigger={<Button variant="danger">Delete</Button>}
  title="Confirm Delete"
  confirmVariant="danger"
  onConfirm={() => {}}
/>
```

#### Demo Build Config Removal

`vite.demo.config.ts` has been removed. Use `npm run dev` to run the demo site.

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

```
