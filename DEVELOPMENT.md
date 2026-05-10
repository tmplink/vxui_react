# VXUI React — 开发指南与标准

本文档是 vxUI React 组件库的内部开发规范，供贡献者和维护者参考。

---

## 目录

1. [项目架构](#项目架构)
2. [开发环境](#开发环境)
3. [响应式系统](#响应式系统)
4. [主题系统](#主题系统)
5. [组件开发规范](#组件开发规范)
6. [CSS 规范](#css-规范)
7. [按钮外形标准](#按钮外形标准)
8. [移动端组件规范](#移动端组件规范)
9. [公共 API 导出](#公共-api-导出)
10. [国际化](#国际化)
11. [验证与构建](#验证与构建)

---

## 项目架构

```text
src/
  components/          # 桌面端组件（.vx-* 前缀）
    mobile/            # 移动端组件（.vxm-* 前缀）
  lib/
    viewport.tsx       # ViewportProvider + useViewport hook
    index.ts           # 公共 API 导出入口
    cx.ts              # class name 工具函数
  styles/
    base.css           # 所有组件样式（单一样式文件）
  i18n/
    index.tsx          # 国际化 Provider + useI18n hook
  main.tsx             # 演示应用入口
  App.tsx              # 演示/文档应用（Responsive 路由）
```

**原则：** 所有组件样式集中在 `src/styles/base.css` 一个文件中，不拆分为独立 CSS 文件。

---

## 开发环境

```bash
npm install            # 安装依赖
npm run dev            # 启动演示应用（Vite 开发服务器）
npm run typecheck      # TypeScript 类型检查
npm run build          # 生产构建（库 + 演示）
```

演示应用地址：`http://127.0.0.1:4173`（生产预览模式）

---

## 响应式系统

### 断点定义

| 视口类型 | 宽度范围 | 对应设备 |
| --- | --- | --- |
| phone | ≤ 767px | 手机 |
| tablet | 768–1023px | 平板 |
| desktop | ≥ 1024px | 桌面 |

断点在 `src/lib/viewport.tsx` 中定义：

```ts
const PHONE_MAX = 767;
const TABLET_MAX = 1023;
```

### 核心原则

**不使用 CSS 媒体查询切换布局**。布局决策由 `ViewportProvider` 在 JS 层完成，通过 `useViewport()` hook 读取当前视口类型，由组件自行决定渲染哪套 UI。

CSS 中的 `@media` 仍被允许用于**非布局**场景（文档网格列数调整、文字大小等），但禁止用于决定"渲染桌面组件还是移动组件"。

### ViewportProvider

必须在应用根节点包裹：

```tsx
// src/main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <ThemeProvider themes={themePresets} defaultTheme="light">
      <ViewportProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ViewportProvider>
    </ThemeProvider>
  </I18nProvider>,
);
```

**Provider 顺序：** I18nProvider → ThemeProvider → ViewportProvider → ToastProvider → App

### Responsive 组件

在需要根据视口渲染不同组件树时使用：

```tsx
import { Responsive } from 'vxui-react';

<Responsive
  desktop={<DesktopApp />}
  mobile={<MobileApp />}
/>
```

`Responsive` 在首次渲染时同步读取 `window.innerWidth`，不会产生闪烁。tablet 未传时默认使用 `desktop` 节点。

### AppShell 的平板模式

`AppShell` 内部调用 `useViewport()` 获取 `isTablet`，并将其写入根元素的 `data-tablet` 属性。CSS 通过 `[data-tablet='true']` 选择器启用抽屉式侧边栏，而不是 `@media`：

```css
/* 正确 */
[data-tablet='true'] .vx-sidebar { position: fixed; … }

/* 禁止 */
@media (max-width: 1024px) { .vx-sidebar { position: fixed; … } }
```

---

## 主题系统

### 主题定义

主题是一组 CSS token（CSS 自定义属性）的集合：

```ts
import { createTheme, themePresets } from 'vxui-react';

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
```

### 内置主题

`themePresets` 包含以下主题：

| 主题名 | 模式 |
| --- | --- |
| light | 亮色（默认） |
| dark | 暗色 |
| sunset | 亮色 |
| mint | 亮色 |
| graphite | 暗色 |
| indigo | 亮色 |
| violet | 亮色 |
| violet-dark | 暗色 |
| vxai | 亮色 |
| vxai-dark | 暗色 |
| ivory-gold | 亮色 |
| black-gold | 暗色 |

### 核心 CSS Token

| Token | 说明 |
| --- | --- |
| `--vx-primary` | 主色 |
| `--vx-primary-strong` | 主色深色变体（悬停/聚焦） |
| `--vx-primary-soft` | 主色浅色背景（角标、激活态） |
| `--vx-bg` | 页面背景 |
| `--vx-bg-accent` | 次级背景 |
| `--vx-surface` | 卡片/浮层背景 |
| `--vx-border` | 普通边框 |
| `--vx-border-strong` | 强调边框 |
| `--vx-text` | 主文字 |
| `--vx-text-secondary` | 次级文字 |
| `--vx-text-muted` | 辅助文字 |
| `--vx-radius` | 标准圆角（默认 10px） |
| `--vx-radius-sm` | 小圆角（8px） |
| `--vx-radius-lg` | 大圆角（14px） |
| `--vx-radius-xl` | 超大圆角（20px） |
| `--vx-shadow-sm` | 小阴影 |
| `--vx-shadow` | 标准阴影 |
| `--vx-shadow-lg` | 大阴影 |

### 主题开发限制

主题**只允许**覆盖颜色、排版（字重、字间距）、阴影、过渡等视觉样式属性。

**主题严禁覆盖的属性：**

- `border-radius`（圆角由组件 `shape` prop 控制，不由主题决定）
- `display`、`flex-direction`、`position` 等布局属性
- `width`、`height` 等尺寸属性

```css
/* ✅ 正确：只改颜色 */
[data-theme-name='ocean'] .vx-button--solid {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #fff;
}

/* ❌ 禁止：修改圆角会破坏 shape prop */
[data-theme-name='ocean'] .vx-button {
  border-radius: 999px;
}
```

---

## 组件开发规范

### 文件结构

每个组件一个文件，放在 `src/components/` 下：

```tsx
// src/components/MyComponent.tsx

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cx } from '../lib/cx';

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  function MyComponent({ className, variant = 'default', ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx('vx-my-component', `vx-my-component--${variant}`, className)}
        {...props}
      />
    );
  },
);
```

### 规范要点

- 使用 `forwardRef` 暴露 DOM ref
- Props 接口继承对应的原生 HTML 属性类型
- 将 `className` 和 `...props` 透传给根元素
- 使用 `cx()` 工具函数合并 class name
- 变体通过 BEM modifier 类名实现（`--variant`）
- 默认值在解构参数时声明，不在组件体内判断

### className 命名规范

使用 BEM 变体风格，所有桌面组件使用 `vx-` 前缀：

```text
vx-{component}                    # 块（Block）
vx-{component}__{element}         # 元素（Element）
vx-{component}--{modifier}        # 修饰符（Modifier）
```

示例：

- `.vx-button`（块）
- `.vx-button--solid`（变体修饰符）
- `.vx-button--sm`（尺寸修饰符）
- `.vx-sidebar__header`（元素）
- `.vx-nav-item--active`（状态修饰符）

---

## CSS 规范

### 单文件原则

所有样式写在 `src/styles/base.css` 中。按以下顺序组织：

1. `:root` — CSS 自定义属性（全局 token）
2. `:root[data-theme='dark']` — 深色模式 token 覆盖
3. 各命名主题 token（`:root[data-theme-name='xxx']`）
4. Reset / 基础样式（`body`、`button`、`a` 等）
5. 布局组件（`.vx-shell`、`.vx-sidebar`、`.vx-topbar` 等）
6. 通用组件（按字母顺序）
7. 移动端组件（`.vxm-*`）
8. 各主题的组件覆盖（`[data-theme-name='xxx'] .vx-yyy`）

### 避免 CSS 媒体查询用于布局

详见[响应式系统](#响应式系统)章节。

非布局场景可以使用 `@media`：

```css
/* ✅ 允许：文档网格的列数调整 */
@media (max-width: 1023px) {
  .vx-docs-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

### data 属性选择器

组件状态通过 `data-*` 属性传递给 CSS：

```tsx
// 组件
<div className="vx-shell" data-collapsed={sidebarCollapsed} data-tablet={isTablet}>

// CSS
.vx-shell[data-collapsed='true'] .vx-sidebar { … }
[data-tablet='true'] .vx-sidebar { position: fixed; … }
```

---

## 按钮外形标准

按钮提供三种固定外形，由 `shape` prop 控制。**外形是调用方的选择，主题不得修改。**

| shape | 类名 | border-radius | 适用场景 |
| --- | --- | --- | --- |
| `rect`（默认） | 无额外类 | `var(--vx-radius)`（10px） | 通用操作按钮 |
| `square` | `vx-button--square` | `0` | 工具栏、紧凑型界面 |
| `pill` | `vx-button--pill` | `9999px` | CTA、强调操作 |

```tsx
// 默认圆角（rect）
<Button variant="solid">保存</Button>

// 直角
<Button variant="solid" shape="square">确认</Button>

// 胶囊型
<Button variant="solid" shape="pill">立即开始</Button>
```

按钮变体（`variant`）控制颜色和样式，与外形正交：

| variant | 说明 |
| --- | --- |
| `solid` | 填充色主按钮 |
| `secondary` | 次级按钮 |
| `outline` | 描边按钮 |
| `ghost` | 幽灵按钮 |
| `soft` | 浅色填充按钮 |
| `danger` | 危险操作 |
| `danger-outline` | 描边危险按钮 |
| `primary-outline` | 主色描边按钮 |
| `gradient` | 渐变按钮 |

---

## 移动端组件规范

### CSS 前缀

移动端组件使用 `vxm-` 前缀，与桌面端 `vx-` 前缀区分：

```text
vxm-shell          # 移动端 Shell
vxm-topbar         # 顶部导航栏
vxm-bottomnav      # 底部导航栏
vxm-drawer         # 抽屉
vxm-list           # 列表
```

### 组件文件位置

移动端组件放在 `src/components/mobile/` 下。

### MobileShell 使用

```tsx
<MobileShell
  topBar={<MobileTopBar title="页面标题" />}
  bottomNav={<BottomNav items={navItems} />}
>
  {/* 页面内容 */}
</MobileShell>
```

`topBar` 和 `bottomNav` 均为可选项。认证页面（登录/注册）通常不传 `topBar` 和 `bottomNav`。

### 移动端认证页面风格

移动端登录/注册页面采用原生 App 风格，不使用桌面端 Card 组件：

```tsx
<div className="vxm-auth-screen">
  {/* 图标 + 大标题 */}
  <div className="vxm-auth-screen__hero">
    <div className="vxm-auth-screen__icon">…</div>
    <h1 className="vxm-auth-screen__title">应用名</h1>
  </div>

  {/* 无边框输入区 */}
  <div className="vxm-auth-screen__form">
    <Input label="邮箱" variant="filled" />
    <Button shape="pill" fullWidth>登录</Button>
  </div>
</div>
```

不添加社交登录按钮（如 Google 登录），除非平台明确支持该登录方式。

### 共享桌面组件

移动端页面可以直接使用桌面端通用组件（`Button`、`Input`、`Checkbox` 等）。这些组件是跨平台的，不需要专门的移动端版本。

---

## 公共 API 导出

所有公开 API 从 `src/lib/index.ts` 统一导出。新增组件时必须在此文件中添加导出：

```ts
// 导出组件
export { MyComponent } from '../components/MyComponent';
// 同时导出 Props 类型
export type { MyComponentProps } from '../components/MyComponent';
```

**命名规范：**

- 组件本身：PascalCase（`Button`、`MobileShell`）
- Props 类型：`{ComponentName}Props`（`ButtonProps`、`MobileShellProps`）
- Hook：`use{Name}` camelCase（`useViewport`、`useToast`、`useTheme`）
- Provider：`{Name}Provider`（`ViewportProvider`、`ThemeProvider`）

---

## 国际化

### 支持的语言

| key | 语言 |
| --- | --- |
| `en` | English（默认） |
| `zh` | 中文（简体） |

语言注册表位于 `src/i18n/index.tsx` 的 `locales` 对象：

```ts
export const locales: Record<string, Translations> = { en, zh };
```

### Provider 与持久化

`I18nProvider` 将选择的语言持久化到 `localStorage`（key: `vxui-locale`），刷新后恢复。已在根节点注册，**无需重复添加**：

```tsx
// src/main.tsx（已配置，仅供参考）
<I18nProvider>
  <ThemeProvider …>
    <ViewportProvider>
      <App />
    </ViewportProvider>
  </ThemeProvider>
</I18nProvider>
```

### useI18n() hook

```tsx
import { useI18n } from '../i18n';

function MyComponent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <h1>{t.nav.gettingStarted}</h1>
      <p>{t.docs.guidance}</p>
      {locale === 'zh' && <span>仅中文显示</span>}
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  );
}
```

| 返回值 | 类型 | 说明 |
| --- | --- | --- |
| `t` | `Translations` | 当前语言的翻译对象 |
| `locale` | `string` | 当前语言 key（`'en'` / `'zh'`） |
| `setLocale` | `(key: string) => void` | 切换语言并写入 localStorage |

### Translations 命名空间

`t` 对象按以下命名空间组织：

| 命名空间 | 说明 |
| --- | --- |
| `t.nav.*` | 侧边栏导航分组标题 |
| `t.pages.*` | 导航条目标签 |
| `t.docs.*` | 文档界面通用文本（预览、使用指南等） |
| `t.intro.*` | 简介页文案 |
| `t.glance.*` | 概览卡片数据 |
| `t.tokens.*` | 设计 token 说明 |
| `t.families.*` | 组件系列说明 |
| `t.dataList.*` | 数据列表列头 |
| `t.publicPages.*` | 主页、登录、注册等公开页文案 |
| `t.pageDefs.*` | 每个文档页的 section / title / description / guidance |

### LanguageSwitcher 组件

内置切换 UI，支持两种变体：

```tsx
import { LanguageSwitcher } from 'vxui-react';

// 顶栏/公共导航中使用（紧凑下拉）
<LanguageSwitcher variant="inline" />

// 侧边栏底部使用（全宽下拉）
<LanguageSwitcher variant="sidebar" />
```

### 新增翻译 key

1. 在 `src/i18n/index.tsx` 的 `Translations` 接口中添加字段：

```ts
export interface Translations {
  // … 已有字段
  mySection: {
    title: string;
    description: string;
  };
}
```

1. 同时在 `en` 和 `zh` 对象中补全翻译，**必须保持同步**：

```ts
export const en: Translations = {
  // …
  mySection: { title: 'My Section', description: 'Description here.' },
};

export const zh: Translations = {
  // …
  mySection: { title: '我的章节', description: '这里是描述。' },
};
```

TypeScript 会在缺少字段时报错，确保不会遗漏翻译。

---

## 验证与构建

### 日常开发

```bash
npm run typecheck   # TypeScript 类型检查，提交前必须通过（0 错误）
npm run build       # 生产构建，确认无构建报错
```

### 提交前检查清单

- [ ] `npm run typecheck` 通过（退出码 0）
- [ ] `npm run build` 通过（退出码 0）
- [ ] 新增组件已在 `src/lib/index.ts` 中导出
- [ ] 新增 CSS 类名使用正确的前缀（桌面 `vx-`，移动 `vxm-`）
- [ ] 主题覆盖样式中未修改 `border-radius` 等外形属性
- [ ] 响应式逻辑通过 `useViewport()` 实现，未使用 `@media` 做布局切换

---

最后更新：2026年5月
