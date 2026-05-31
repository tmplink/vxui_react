# 将排版功能（typography-base）加入文档页面的计划

## 目标

在桌面版和移动版文档中添加一个"排版基础"（Typography Base）页面，展示 vxui-react 提供的排版 CSS 类和 React 组件的用法。

## 涉及文件

| # | 文件 | 修改内容 |
|---|------|---------|
| 1 | [`src/app/routes.ts`](src/app/routes.ts) | 在 `DOC_PAGE_KEYS` 中添加 `'typography-base'` |
| 2 | [`src/app/nav-config.tsx`](src/app/nav-config.tsx) | 添加 `typography-base` 的图标，加入 `content` 导航组 |
| 3 | [`src/i18n/index.tsx`](src/i18n/index.tsx) | 在 `Translations.pages` 和 `pageDefs` 中添加中英文页面定义 |
| 4 | [`src/app/DesktopApp.tsx`](src/app/DesktopApp.tsx) | 在 `renderSample` 中添加 `'typography-base'` 的示例渲染 |
| 5 | [`src/app/doc-snippets.ts`](src/app/doc-snippets.ts) | 在 `DOC_USAGE_SNIPPETS` 中添加用法代码片段 |

## 详细计划

### 步骤1: routes.ts

在 `DOC_PAGE_KEYS` 数组中，在 `'typography'` 之后添加 `'typography-base'`。

### 步骤2: nav-config.tsx

在 `pageIcons` 中添加 `'typography-base': <FileText size={16} />`。
在 `DOC_NAV_GROUPS` 的 `content` 组中，在 `'typography'` 之后添加 `'typography-base'`。

### 步骤3: i18n/index.tsx

在 `Translations.pages` 接口中添加 `'typography-base': string;`。
在中文和英文的 `pages` 对象中添加：
- 中文：`'typography-base': '排版基础'`
- 英文：`'typography-base': 'Typography Base'`

在中文和英文的 `pageDefs` 中添加：

```typescript
'typography-base': {
  section: isZh ? '内容展示' : 'Content',
  title: isZh ? '排版基础' : 'Typography Base',
  description: isZh
    ? '开箱即用的排版 CSS 工具类和 React 组件，参考 Bootstrap 命名风格，适用于文章、文档、API 参考等页面。'
    : 'Ready-to-use typography CSS utilities and React components inspired by Bootstrap naming conventions. Ideal for articles, documentation, and API reference pages.',
  guidance: [
    isZh ? '排版样式通过 import "vxui-react" 自动加载，无需额外配置。' : 'Typography styles are loaded automatically when you import "vxui-react".',
    isZh ? '可直接使用 className（如 vx-article、vx-section），也可使用 React 组件（如 Article、Section）。' : 'Use className directly (e.g., vx-article, vx-section) or use React components (e.g., Article, Section).',
    isZh ? '所有颜色使用 CSS 变量，自动适配亮/暗主题。' : 'All colors use CSS variables and automatically adapt to light/dark themes.',
    isZh ? '内置响应式断点，移动端和桌面端体验统一。' : 'Built-in responsive breakpoints ensure a consistent experience on mobile and desktop.',
  ],
  props: [
    { prop: 'Article', type: 'Component', description: isZh ? '文章容器，提供标准文档排版布局。' : 'Article container with standard document layout.' },
    { prop: 'ArticleHeader', type: 'Component', description: isZh ? '文章头部，包含标题和描述。' : 'Article header containing title and description.' },
    { prop: 'ArticleTitle', type: 'Component', description: isZh ? '文章标题（h1）。' : 'Article title (h1).' },
    { prop: 'ArticleBody', type: 'Component', description: isZh ? '文章正文容器。' : 'Article body container.' },
    { prop: 'Section', type: 'Component', description: isZh ? '文档章节，支持锚点跳转。' : 'Document section with anchor support.' },
    { prop: 'SectionHeading', type: 'Component', description: isZh ? '章节标题（h2），可选锚点链接。' : 'Section heading (h2) with optional anchor link.' },
    { prop: 'Pager', type: 'Component', description: isZh ? '上下页导航。' : 'Previous/next page navigation.' },
    { prop: 'PropsTable', type: 'Component', description: isZh ? 'API 属性表格。' : 'API props reference table.' },
    { prop: 'ArticleEmptyState', type: 'Component', description: isZh ? '空状态展示。' : 'Empty state display.' },
    { prop: 'StatsGrid', type: 'Component', description: isZh ? '统计指标网格。' : 'Statistics metrics grid.' },
  ],
}
```

### 步骤4: DesktopApp.tsx

在 `renderSample` 的 switch 语句中添加 `'typography-base'` case，展示：
1. 使用 CSS 类名的示例（vx-article、vx-section 等）
2. 使用 React 组件的示例（Article、Section、PropsTable 等）

### 步骤5: doc-snippets.ts

在 `DOC_USAGE_SNIPPETS` 中添加 typography-base 的用法代码片段。

### 步骤6: 移动端

移动端文档页面（`src/app/mobile/MobileDocContent.tsx`）使用与桌面端相同的 `DocPage` 组件和路由，所以添加页面 key 后会自动在移动端生效。只需确认 `MOBILE_PREVIEW_PAGES` 中已包含 `'typography-base'`。

## 示例内容设计

示例应展示以下内容：
1. **文章容器**：Article + ArticleHeader + ArticleTitle + ArticleBody
2. **章节**：Section + SectionHeading（带锚点）
3. **属性表格**：PropsTable
4. **统计网格**：StatsGrid
5. **空状态**：ArticleEmptyState
6. **分页导航**：Pager
