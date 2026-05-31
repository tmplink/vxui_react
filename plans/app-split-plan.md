# App.tsx 拆分方案

## 现状

- [`App.tsx`](src/App.tsx) — **4860 行**，包含路由、导航配置、代码片段、桌面端文档应用、组件预览渲染、文档首页/详情页渲染等所有职责
- [`MobileApp.tsx`](src/components/mobile/MobileApp.tsx) — **2428 行**，同样包含大量重复的组件预览渲染逻辑
- 已部分提取的文件：`routes.ts`、`nav-config.tsx`、`doc-snippets.ts`、`DesktopApp.tsx`，但 `App.tsx` 中仍有重复定义

## 目标

将 `App.tsx` 从 4860 行缩减到 ~200 行以内，使其仅作为入口组合层。同时消除桌面端和移动端组件预览代码的重复。

## 拆分架构

```
src/
├── App.tsx                          # ~150 行，仅作为入口组合
├── app/
│   ├── routes.ts                    # 已存在，路由解析
│   ├── nav-config.tsx               # 已存在，导航配置
│   ├── doc-snippets.ts              # 已存在，代码片段
│   ├── DesktopApp.tsx               # 已存在，桌面端文档应用壳层
│   ├── useAppState.ts               # [新建] 应用级状态管理 Hook
│   ├── DocsHome.tsx                 # [新建] 文档首页组件
│   ├── DocPage.tsx                  # [新建] 文档详情页组件
│   └── doc-previews/                # [新建] 组件预览目录
│       ├── index.ts                 # 统一导出
│       ├── QuickStartPreview.tsx
│       ├── ShellSidebarPreview.tsx
│       ├── GridPagePreview.tsx
│       ├── ButtonPreview.tsx
│       ├── ElementsPreview.tsx
│       ├── FormControlsPreview.tsx
│       ├── FormInputsPreview.tsx
│       ├── NavigationPreview.tsx
│       ├── DataListPreview.tsx
│       ├── EmptyStatesPreview.tsx
│       ├── ToastsPreview.tsx
│       ├── FeedbackPreview.tsx
│       ├── OverlaysPreview.tsx
│       ├── NavLayoutPreview.tsx
│       ├── DataDisplayPreview.tsx
│       ├── MobileListPreview.tsx
│       ├── MobilePreview.tsx
│       ├── CommandPalettePreview.tsx
│       ├── CodeBlockPreview.tsx
│       ├── LanguageSwitcherPreview.tsx
│       ├── ScrollAreaPreview.tsx
│       ├── SeparatorPreview.tsx
│       ├── TimelinePreview.tsx
│       ├── TreeViewPreview.tsx
│       ├── CarouselPreview.tsx
│       ├── TogglePreview.tsx
│       ├── RatingPreview.tsx
│       ├── LabelPreview.tsx
│       ├── DatePickersPreview.tsx
│       ├── AvatarPreview.tsx
│       ├── BadgePreview.tsx
│       ├── SkeletonPreview.tsx
│       ├── TypographyPreview.tsx
│       ├── CardPreview.tsx
│       ├── FormPreview.tsx
│       ├── SheetPreview.tsx
│       ├── ResizablePreview.tsx
│       ├── AccordionPreview.tsx
│       ├── TabsPreview.tsx
│       ├── BreadcrumbPreview.tsx
│       ├── PaginationPreview.tsx
│       ├── StepperPreview.tsx
│       ├── ProgressPreview.tsx
│       ├── SpinnerPreview.tsx
│       ├── AlertPreview.tsx
│       ├── TablePreview.tsx
│       ├── FileUploadPreview.tsx
│       ├── ColorPickerPreview.tsx
│       ├── DialogPreview.tsx
│       ├── PopoverPreview.tsx
│       ├── TooltipPreview.tsx
│       ├── HoverCardPreview.tsx
│       ├── DropdownMenuPreview.tsx
│       ├── ContextMenuPreview.tsx
│       ├── NavigationMenuPreview.tsx
│       └── MenubarPreview.tsx
```

## 详细步骤

### Step 1: 创建 `src/app/useAppState.ts`

提取 `App.tsx` 中 `DesktopApp` 组件的状态管理和副作用逻辑：

- 路由状态：`route`、`setRoute`、`navigate`、`goBack`
- 会话状态：`viewerSession`、`persistSession`、`handleLogin`、`handleRegister`、`handleGuest`、`handleLogout`
- UI 状态：`mobileNavOpen`、`sidebarCollapsed`、`searchOpen`、`compactDensity`、`releaseTrack`
- 组件演示状态：`checkboxA/B`、`radioValue`、`sliderValue`、`paginationPage`、`multiSelectValue`、`selectEnv`、`selectRegionA/B`、`timeValue`、`paginationDemoPage`
- 工具栏宽度计算逻辑
- 所有 `useEffect` 副作用（popstate、resize、ResizeObserver、IntersectionObserver、键盘快捷键）
- `handleCopyCode` 函数
- `renderCodeBlock` 和 `renderTemplateLauncher` 辅助函数

**接口设计：**

```typescript
interface UseAppStateReturn {
  // 路由
  route: AppRoute;
  navigate: (nextRoute: AppRoute, options?: { replace?: boolean }) => void;
  goBack: (fallback: AppRoute) => void;
  
  // 会话
  viewerSession: ViewerSession | null;
  handleLogin: (payload: { email: string; password: string; remember: boolean }) => void;
  handleRegister: (payload: { name: string; email: string; password: string }) => void;
  handleGuest: () => void;
  handleLogout: () => void;
  
  // UI 状态
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  compactDensity: boolean;
  setCompactDensity: (dense: boolean) => void;
  releaseTrack: ReleaseTrack;
  setReleaseTrack: (track: ReleaseTrack) => void;
  
  // 组件演示状态
  checkboxA: boolean; setCheckboxA: (v: boolean) => void;
  checkboxB: boolean; setCheckboxB: (v: boolean) => void;
  radioValue: string; setRadioValue: (v: string) => void;
  sliderValue: number; setSliderValue: (v: number) => void;
  paginationPage: number; setPaginationPage: (v: number) => void;
  multiSelectValue: string[]; setMultiSelectValue: (v: string[]) => void;
  selectEnv: string | undefined; setSelectEnv: (v: string | undefined) => void;
  selectRegionA: string | undefined; setSelectRegionA: (v: string | undefined) => void;
  selectRegionB: string | undefined; setSelectRegionB: (v: string | undefined) => void;
  timeValue: string | undefined; setTimeValue: (v: string | undefined) => void;
  paginationDemoPage: number; setPaginationDemoPage: (v: number) => void;
  
  // 工具栏
  docsTopbarRef: RefObject<HTMLElement | null>;
  docHeaderRef: RefObject<HTMLElement | null>;
  docsTopbarWidth: number;
  isDocHeaderInView: boolean;
  docsToolbarVisibleCount: number;
  
  // 辅助函数
  handleCopyCode: (code: string) => Promise<boolean>;
  renderCodeBlock: (code: string, language?: 'tsx' | 'bash') => ReactNode;
  renderTemplateLauncher: (pageKey: Extract<PageKey, ...>) => ReactNode;
}
```

### Step 2: 创建 `src/app/doc-previews/` 目录

将 `renderSample` 函数中的每个 `case` 提取为独立的预览组件。

每个预览组件接收以下 props：

```typescript
interface DocPreviewProps {
  isZh: boolean;
  // 演示状态
  checkboxA: boolean;
  setCheckboxA: (v: boolean) => void;
  checkboxB: boolean;
  setCheckboxB: (v: boolean) => void;
  radioValue: string;
  setRadioValue: (v: string) => void;
  sliderValue: number;
  setSliderValue: (v: number) => void;
  paginationPage: number;
  setPaginationPage: (v: number) => void;
  multiSelectValue: string[];
  setMultiSelectValue: (v: string[]) => void;
  selectEnv: string | undefined;
  setSelectEnv: (v: string | undefined) => void;
  selectRegionA: string | undefined;
  setSelectRegionA: (v: string | undefined) => void;
  selectRegionB: string | undefined;
  setSelectRegionB: (v: string | undefined) => void;
  timeValue: string | undefined;
  setTimeValue: (v: string | undefined) => void;
  paginationDemoPage: number;
  setPaginationDemoPage: (v: number) => void;
  releaseTrack: ReleaseTrack;
  setReleaseTrack: (track: ReleaseTrack) => void;
  // 导航
  navigate: (route: AppRoute) => void;
  // 渲染辅助
  renderCodeBlock: (code: string, language?: 'tsx' | 'bash') => ReactNode;
  renderTemplateLauncher: (pageKey: Extract<PageKey, ...>) => ReactNode;
}
```

**统一导出**：`src/app/doc-previews/index.ts` 导出一个 `renderSample` 函数，内部使用 switch case 分发到各个预览组件。

### Step 3: 创建 `src/app/DocsHome.tsx`

将 `renderDocsHome` 函数提取为独立组件：

```typescript
interface DocsHomeProps {
  isZh: boolean;
  pages: Record<PageKey, PageDefinition>;
  docsHomeCopy: { ... };
  docsHomeGroups: Array<{ ... }>;
  metricCards: Array<{ ... }>;
  releaseTrack: ReleaseTrack;
  setReleaseTrack: (track: ReleaseTrack) => void;
  navigate: (route: AppRoute) => void;
  pageIcons: Record<PageKey, ReactNode>;
}
```

### Step 4: 创建 `src/app/DocPage.tsx`

将 `renderDocPage` 函数提取为独立组件：

```typescript
interface DocPageProps {
  isZh: boolean;
  activePage: PageKey;
  activeDocument: PageDefinition;
  pages: Record<PageKey, PageDefinition>;
  renderSample: (pageKey: PageKey) => ReactNode;
  renderCodeBlock: (code: string, language?: 'tsx' | 'bash') => ReactNode;
  navigate: (route: AppRoute) => void;
  docHeaderRef: RefObject<HTMLElement | null>;
  isDocHeaderInView: boolean;
}
```

### Step 5: 精简 `DesktopApp.tsx`

移除内联的 `renderDocsHome`、`renderDocPage`、`renderSample` 函数，改为引用新创建的组件。

### Step 6: 精简 `App.tsx`

移除所有重复定义（`DOC_PAGE_KEYS`、`DOC_NAV_GROUPS`、`pageIcons` 等已存在于 `routes.ts` 和 `nav-config.tsx`），仅保留：

```typescript
export default function App() {
  const isMobilePreview = typeof window !== 'undefined' && window.location.pathname.startsWith('/m');
  if (isMobilePreview) return <MobileApp />;
  return (
    <Responsive
      desktop={<DesktopApp />}
      mobile={<MobileApp />}
    />
  );
}
```

### Step 7: 同步拆分 `MobileApp.tsx`

`MobileApp.tsx` 中的 `renderPagePreview` 与桌面端的 `renderSample` 高度重复。拆分策略：

- 为移动端创建 `src/app/mobile-previews/` 目录，或直接复用桌面端预览组件
- 移动端预览组件接收更少的 props（移动端状态更简单）
- 提取 `renderHomeContent`、`renderLegalContent`、`renderDocContent` 为独立组件

## 预期成果

| 文件 | 当前行数 | 目标行数 |
|------|---------|---------|
| `App.tsx` | 4860 | ~150 |
| `MobileApp.tsx` | 2428 | ~300 |
| `DesktopApp.tsx` | 459 | ~200 |
| `useAppState.ts` | 0 | ~350 |
| `DocsHome.tsx` | 0 | ~200 |
| `DocPage.tsx` | 0 | ~200 |
| `doc-previews/*.tsx` | 0 | 每个 ~20-100 |

## 风险与注意事项

1. **Props 透传**：预览组件需要大量演示状态 props，考虑使用 Context 或提取为全局状态
2. **移动端复用**：移动端预览与桌面端预览不完全相同，需要评估哪些可以共享
3. **渐进式拆分**：建议按顺序执行，每完成一步验证一次，避免大规模重构风险
