# VXUI React · v1.3.9

**官网**：[ui.vx.link](https://ui.vx.link) &nbsp;|&nbsp; **GitHub**：[tmplink/vxui_react](https://github.com/tmplink/vxui_react) &nbsp;|&nbsp; [English](README.en.md)

VXUI React 是一套适合后台、运营台、仪表盘和内部工具的通用 UI 组件库。

## 🚀 更新公告

> **v1.3.9** — 2026-06
> - Version bump to 1.3.9
> - 移除 AlertDialog 独立组件，功能已合并至 Dialog
> - 移除 demo 构建配置 (vite.demo.config.ts)
>
> **v1.3.6** — 2025-05
> - 优化组件中的 createPortal 调用，支持使用 dialogContentRef 作为目标元素
> - 更新测试用例，优化用户交互模拟，增强组件可用性验证

查看完整更新日志请访问 [GitHub Releases](https://github.com/tmplink/vxui_react/releases)。

### v1.3.9 适配指南

#### Dialog 组件新增属性

v1.3.7 为 [`Dialog`](src/components/Dialog.tsx) 组件新增了内置确认/取消按钮支持，无需再手动实现：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `onConfirm` | `() => void` | — | 点击确认按钮时的回调 |
| `onCancel` | `() => void` | — | 点击取消按钮时的回调 |
| `confirmLabel` | `string` | `'确认'` | 确认按钮文本 |
| `cancelLabel` | `string` | `'取消'` | 取消按钮文本 |
| `confirmVariant` | `'solid' \| 'danger'` | `'solid'` | 确认按钮样式变体 |

**使用示例：**

```tsx
import { Dialog, useToast } from 'vxui-react';

function DeleteConfirm() {
  const { push } = useToast();

  return (
    <Dialog
      trigger={<Button variant="danger">删除项目</Button>}
      title="确认删除"
      description="此操作不可撤销，确定要继续吗？"
      onConfirm={() => {
        // 执行删除逻辑
        push({ tone: 'success', title: '已删除' });
      }}
      onCancel={() => {
        // 取消逻辑
      }}
      confirmLabel="确认删除"
      cancelLabel="暂不删除"
      confirmVariant="danger"
    >
      <p>删除后所有相关数据将被永久移除。</p>
    </Dialog>
  );
}
```

#### AlertDialog 移除

v1.3.7 移除了独立的 `AlertDialog` 组件。如需危险操作确认对话框，请使用 Dialog 的 `confirmVariant="danger"`：

**迁移前（v1.3.6）：**
```tsx
import { AlertDialog } from 'vxui-react';

<AlertDialog
  trigger={<Button variant="danger">删除</Button>}
  title="确认删除"
  onConfirm={() => {}}
/>
```

**迁移后（v1.3.7）：**
```tsx
import { Dialog, Button } from 'vxui-react';

<Dialog
  trigger={<Button variant="danger">删除</Button>}
  title="确认删除"
  confirmVariant="danger"
  onConfirm={() => {}}
/>
```

#### demo 构建配置移除

`vite.demo.config.ts` 已从项目中移除。如需运行演示站点，使用标准的 `npm run dev` 命令即可。

文档内容现在按流行 UI 框架的写法组织：先给安装方式，再给最小可运行示例，最后给分场景的组件代码。

## 安装

从 npm 安装：

```bash
npm install vxui-react
```

`react` 和 `react-dom` 需要由宿主应用提供。

## 引入样式

安装完成后，包名仍然保持为 `vxui-react`。

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

- **Layout**: AppShell、Card、Separator、Breadcrumb、Pagination、Resizable、ScrollArea
- **Forms**: Input、Select、Checkbox、Radio、Textarea、Slider、Switch、NumberInput、TagInput、ColorPicker、DatePicker、FileUpload、Form、Rating
- **Feedback**: Alert、AlertDialog、Toast、Progress、Skeleton、Spinner、Stepper、Timeline、EmptyState
- **Overlay**: Dialog、Sheet、Popover、DropdownMenu、ContextMenu、Tooltip、HoverCard、CommandPalette、Menubar、NavigationMenu

### Dialog 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| trigger | ReactNode | 必填 | 触发打开对话框的元素 |
| title | string | 必填 | 对话框标题 |
| description | string | — | 标题下方的描述文字 |
| children | ReactNode | 必填 | 对话框内容 |
| footer | ReactNode | — | 底部操作区 |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'md' | 宽度预设 |
| placement | 'center' \| 'top' \| 'right' \| 'bottom' \| 'left' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'top-half' \| 'right-half' \| 'bottom-half' \| 'left-half' | 'center' | 屏幕位置（仅桌面端） |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | 内边距预设 |
| scrollable | boolean | true | 内容溢出时是否可滚动 |
| closable | boolean | true | 是否显示关闭按钮（×） |
| **fullscreen** | **boolean** | **false** | **全屏模式：启用后对话框将占据整个视口，适用于移动设备** |
| className | string | — | 额外 CSS 类名 |
| defaultOpen | boolean | false | 默认是否打开 |
| open | boolean | — | 受控打开状态 |
| onOpenChange | (open: boolean) => void | — | 打开状态变化回调 |
- **Data Display**: Avatar、Table、Badge、Tabs、Accordion、TreeView、Carousel、Calendar
- **Typography**: Heading、Text、Label、CodeBlock
- **Mobile**: MobileShell、BottomNav、ActionSheet、MobileDrawer、MobileList

## 本地开发

```bash
npm install
npm run dev
```

## 验证与构建

```bash
# TypeScript 类型检查
npm run typecheck

# 构建组件库（用于 npm publish）
npm run build

```
