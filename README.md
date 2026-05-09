# VXUI React

VXUI React 是对原始 VXUI Foundation 的 React 重写版本，目标是提供一套适合后台、运营台、仪表盘和内部工具的通用 UI 组件库。

文档内容现在按流行 UI 框架的写法组织：先给安装方式，再给最小可运行示例，最后给分场景的组件代码。

## 安装

```bash
npm install vxui-react
```

`react` 和 `react-dom` 需要由宿主应用提供。

## 引入样式

```tsx
import 'vxui-react/styles.css';
```

## 基础接入

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

## 第一个页面

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

## 表单示例

```tsx
import { Button, Checkbox, Input, Select, Textarea } from 'vxui-react';

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

      <Checkbox label="Notify operators after publish" defaultChecked />

      <Button type="submit">Save changes</Button>
    </form>
  );
}
```

## 反馈示例

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

## 自定义主题

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

运行时可以通过 `useTheme()` 获取当前主题并切换到任意已注册主题，例如 `setTheme('ocean')`。

## 当前包含

- Layout: AppShell、Card、Separator、Breadcrumb、Pagination
- Forms: Input、Select、Checkbox、Radio、Textarea、Slider、Switch
- Feedback: Alert、Toast、Progress、Skeleton、Spinner
- Overlay: Dialog、Popover、DropdownMenu、Tooltip
- Data Display: Avatar、Table、Badge
- Mobile: MobileShell、BottomNav、ActionSheet、MobileDrawer

## 本地开发

```bash
npm install
npm run dev
```

## 验证与构建

```bash
npm run typecheck
npm run build
```
