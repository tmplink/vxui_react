# VXUI React

VXUI React 是对原始 VXUI Foundation 的一次彻底 React 重写。

这份实现不保留旧的视图注册、hash 路由和框架运行时约束，而是直接提供一套适合后台、运营台、仪表盘和内部工具的通用 React UI 组件库。

## 技术选型

- React 19
- TypeScript
- Vite 库模式构建
- Radix UI primitives 作为可访问性交互底座
- 统一设计令牌与可注册多主题

## 当前包含

- AppShell：侧栏、顶栏、内容区布局
- Button / Badge / Card / Input
- Tabs / Switch / Dialog / Toast
- ThemeProvider：命名主题与浅色/深色模式切换
- 演示首页：用于开发和组件预览

## 启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 使用方式

```tsx
import {

  AppShell,
  Badge,
  Button,
  Card,
  createTheme,
  ThemeProvider,
  ToastProvider,
  themePresets,
} from 'vxui-react';

const themes = {
  light: themePresets.light,
  dark: themePresets.dark,
  sunset: themePresets.sunset,
  ocean: createTheme('dark', {
    label: 'Ocean',
    tokens: {
      '--vx-primary': '#38bdf8',
      '--vx-primary-soft': 'rgba(56, 189, 248, 0.16)',
      '--vx-bg': '#06131f',
      '--vx-surface': '#0d2236',
    },
  }),
};

function App() {
  return (
    <ThemeProvider themes={themes} defaultTheme="sunset">
      <ToastProvider>
        <AppShell navItems={[{ key: 'home', label: 'Home', active: true }]}>
          <Card>
            <Button>Ship</Button>
          </Card>
        </AppShell>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

运行时可通过 `useTheme()` 获取当前主题并切换到任意已注册主题，例如 `setTheme('ocean')`。内置还提供 `themePresets.light`、`themePresets.dark`、`themePresets.sunset`、`themePresets.mint`、`themePresets.graphite`、`themePresets.ocean` 这些现成主题。

如果你需要继续扩充组件，建议沿着“布局 + 表单 + 反馈 + 数据展示”的方向迭代，而不是把旧版自定义运行时直接搬回来。
