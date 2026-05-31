# 将文档排版样式抽象到 vxui 基础库的计划

## 背景

当前 [`src/styles/base.css`](src/styles/base.css) 中包含大量桌面版文档特有的排版样式（`vx-docs-*`、`vx-doc-*`、`vx-bs-doc-*` 等），这些样式虽然以 `vx-` 前缀命名，但实际上不属于 vxui 组件库的基础样式，而是本项目文档页面的自定义样式。

目标是将这些样式中**通用、可复用**的部分抽象到 vxui 基础样式库中，让用户能直接使用 vxui 的排版 CSS 来构建文档/文章页面，同时确保移动端和桌面端体验统一。

---

## 分析：哪些样式可以抽象到基础库

### 1. 文章/文档排版（通用，应抽象）

这些样式是通用的文章排版需求，任何使用 vxui 的项目都可能用到：

| 当前类名 | 用途 | 建议新类名 |
|---------|------|-----------|
| `.vx-docs-hero h1` | 页面大标题 | `.vx-doc-title--hero` |
| `.vx-docs-lead` | 导语段落 | `.vx-doc-lead` |
| `.vx-docs-section` | 章节容器 | `.vx-doc-section` |
| `.vx-docs-section h2` | 章节标题 | `.vx-doc-section__title` |
| `.vx-docs-kicker` | 章节标签/徽标 | `.vx-doc-kicker` |
| `.vx-docs-guidance` | 指导列表 | `.vx-doc-guidance` |
| `.vx-docs-code` | 内联代码块 | `.vx-doc-code` |
| `.vx-docs-article` | 文章容器 | `.vx-doc-article` |
| `.vx-docs-article h1` | 文章标题 | `.vx-doc-article__title` |
| `.vx-docs-actions` | 操作按钮组 | `.vx-doc-actions` |
| `.vx-docs-home__copy h1` | 首页大标题 | `.vx-doc-heading--display` |
| `.vx-docs-home__copy p` | 首页描述 | `.vx-doc-text--lead` |
| `.vx-docs-home__section-head h2` | 区块标题 | `.vx-doc-heading--section` |
| `.vx-doc-page__hero h1` | 页面标题 | `.vx-doc-heading--page` |
| `.vx-doc-page__hero p` | 页面描述 | `.vx-doc-text--page` |
| `.vx-doc-page__kicker` | 页面标签 | `.vx-doc-kicker`（复用） |
| `.vx-doc-page__meta` | 页面元信息 | `.vx-doc-meta` |
| `.vx-doc-breadcrumb` | 面包屑导航 | `.vx-doc-breadcrumb` |
| `.vx-doc-empty-state` | 空状态 | `.vx-doc-empty-state` |
| `.vx-doc-list` | 文档列表 | `.vx-doc-list` |

### 2. Bootstrap 风格文档页（通用，应抽象）

| 当前类名 | 用途 | 建议新类名 |
|---------|------|-----------|
| `.vx-bs-doc-page` | 文档页容器 | `.vx-doc-page` |
| `.vx-bs-doc-header` | 文档页头部 | `.vx-doc-page__header` |
| `.vx-bs-doc-kicker` | 分类标签 | `.vx-doc-kicker`（复用） |
| `.vx-bs-doc-header h1` | 文档标题 | `.vx-doc-page__title` |
| `.vx-bs-doc-lead` | 文档描述 | `.vx-doc-page__description` |
| `.vx-bs-doc-header-badges` | 徽标组 | `.vx-doc-badges` |
| `.vx-bs-doc-body` | 文档正文 | `.vx-doc-body` |
| `.vx-bs-doc-content` | 内容容器 | `.vx-doc-content` |
| `.vx-bs-doc-section` | 文档章节 | `.vx-doc-section`（复用） |
| `.vx-bs-section-heading` | 章节标题 | `.vx-doc-section__heading` |
| `.vx-bs-anchor` | 锚点链接 | `.vx-doc-anchor` |
| `.vx-bs-example` | 示例区域 | `.vx-doc-example` |
| `.vx-bs-example-grid` | 示例网格 | `.vx-doc-example__grid` |
| `.vx-bs-example-panel` | 示例面板 | `.vx-doc-example__panel` |
| `.vx-bs-example-panel__meta` | 示例元信息 | `.vx-doc-example__meta` |
| `.vx-bs-example-panel__eyebrow` | 示例标签 | `.vx-doc-example__eyebrow` |
| `.vx-bs-doc-pager` | 上下页导航 | `.vx-doc-pager` |
| `.vx-bs-doc-pager__btn` | 导航按钮 | `.vx-doc-pager__btn` |
| `.vx-bs-doc-pager__dir` | 导航方向 | `.vx-doc-pager__dir` |
| `.vx-bs-doc-pager__label` | 导航标签 | `.vx-doc-pager__label` |
| `.vx-bs-mobile-preview` | 移动端预览 | `.vx-doc-mobile-preview` |
| `.vx-bs-mobile-preview__frame` | 预览框架 | `.vx-doc-mobile-preview__frame` |
| `.vx-bs-mobile-preview__iframe` | 预览 iframe | `.vx-doc-mobile-preview__iframe` |
| `.vx-bs-mobile-preview__hint` | 预览提示 | `.vx-doc-mobile-preview__hint` |
| `.vx-bs-props-table` | 属性表格 | `.vx-doc-props-table` |
| `.vx-bs-prop-required` | 必填标记 | `.vx-doc-prop-required` |
| `.vx-bs-prop-type` | 类型代码 | `.vx-doc-prop-type` |
| `.vx-bs-prop-dash` | 默认值占位 | `.vx-doc-prop-dash` |

### 3. 文档首页特有（部分通用，部分保留）

| 当前类名 | 用途 | 建议 |
|---------|------|------|
| `.vx-docs-stats` | 统计网格 | 抽象为 `.vx-doc-stats-grid` |
| `.vx-doc-stat` | 统计卡片 | 抽象为 `.vx-doc-stat` |
| `.vx-docs-token-grid` | Token 网格 | 保留在项目 |
| `.vx-docs-component-grid` | 组件网格 | 保留在项目 |
| `.vx-docs-article-grid` | 文章网格 | 保留在项目 |
| `.vx-doc-token-card` | Token 卡片 | 保留在项目 |
| `.vx-doc-family-card` | 家族卡片 | 保留在项目 |
| `.vx-docs-home__hero` | 首页 hero | 保留在项目 |
| `.vx-docs-home__copy` | 首页文案 | 保留在项目 |
| `.vx-docs-home__section` | 首页区块 | 保留在项目 |
| `.vx-docs-home__actions` | 首页操作 | 保留在项目 |

### 4. 预览相关（部分通用）

| 当前类名 | 用途 | 建议 |
|---------|------|------|
| `.vx-preview-shell` | 预览壳层 | 抽象为 `.vx-doc-preview-shell` |
| `.vx-preview-grid` | 预览网格 | 抽象为 `.vx-doc-preview-grid` |
| `.vx-preview-list` | 预览列表 | 抽象为 `.vx-doc-preview-list` |
| `.vx-doc-preview-stack` | 预览堆叠 | 抽象为 `.vx-doc-preview-stack` |
| `.vx-doc-preview-inline` | 预览行内 | 抽象为 `.vx-doc-preview-inline` |

### 5. 法律/错误页面（保留在项目）

这些是项目特定页面，不适合抽象到基础库：
- `.vx-legal-layout`、`.vx-legal-shell`、`.vx-legal-main`、`.vx-legal-rail`
- `.vx-error-shell`、`.vx-error-card`

### 6. 紧凑模式覆盖样式（保留在项目）

`[data-density='compact']` 下的覆盖样式是桌面版文档特有的，保留在项目。

---

## 实施步骤

### 第一步：创建 `src/styles/typography-base.css`

新建文件，包含以下通用排版样式：

```css
/* ═══════════════════════════════════════════════════════════
   VXUI Typography Base — 通用文章/文档排版样式
   适用于任何需要展示文档、文章、API 参考等内容的页面
   ═══════════════════════════════════════════════════════════ */

/* ── 文档页面容器 ──────────────────────────────────── */
.vx-doc-page { ... }
.vx-doc-page__header { ... }
.vx-doc-page__title { ... }
.vx-doc-page__description { ... }

/* ── 文档正文 ──────────────────────────────────────── */
.vx-doc-body { ... }
.vx-doc-content { ... }
.vx-doc-section { ... }
.vx-doc-section__heading { ... }
.vx-doc-anchor { ... }

/* ── 排版层级 ──────────────────────────────────────── */
.vx-doc-heading--display { ... }
.vx-doc-heading--page { ... }
.vx-doc-heading--section { ... }
.vx-doc-text--lead { ... }
.vx-doc-text--page { ... }

/* ── 文档元素 ──────────────────────────────────────── */
.vx-doc-kicker { ... }
.vx-doc-lead { ... }
.vx-doc-list { ... }
.vx-doc-guidance { ... }
.vx-doc-code { ... }
.vx-doc-badges { ... }
.vx-doc-meta { ... }
.vx-doc-breadcrumb { ... }
.vx-doc-empty-state { ... }

/* ── 示例区域 ──────────────────────────────────────── */
.vx-doc-example { ... }
.vx-doc-example__grid { ... }
.vx-doc-example__panel { ... }
.vx-doc-example__meta { ... }
.vx-doc-example__eyebrow { ... }

/* ── 属性表格 ──────────────────────────────────────── */
.vx-doc-props-table { ... }
.vx-doc-prop-required { ... }
.vx-doc-prop-type { ... }
.vx-doc-prop-dash { ... }

/* ── 上下页导航 ────────────────────────────────────── */
.vx-doc-pager { ... }
.vx-doc-pager__btn { ... }
.vx-doc-pager__dir { ... }
.vx-doc-pager__label { ... }

/* ── 移动端预览 ────────────────────────────────────── */
.vx-doc-mobile-preview { ... }
.vx-doc-mobile-preview__frame { ... }
.vx-doc-mobile-preview__iframe { ... }
.vx-doc-mobile-preview__hint { ... }

/* ── 预览组件 ──────────────────────────────────────── */
.vx-doc-preview-shell { ... }
.vx-doc-preview-grid { ... }
.vx-doc-preview-list { ... }
.vx-doc-preview-stack { ... }
.vx-doc-preview-inline { ... }

/* ── 统计网格 ──────────────────────────────────────── */
.vx-doc-stats-grid { ... }
.vx-doc-stat { ... }

/* ── 响应式 ────────────────────────────────────────── */
@media (max-width: 1023px) { ... }
@media (max-width: 720px) { ... }
@media (max-width: 640px) { ... }
```

### 第二步：从 `base.css` 迁移样式

将上述通用样式从 [`src/styles/base.css`](src/styles/base.css) 中剪切到新文件，并更新类名。

### 第三步：更新 `base.css`

将已迁移的样式替换为 `@import`：

```css
@import './components/typography-base.css';
```

### 第四步：更新桌面版文档组件

更新 [`src/app/DesktopApp.tsx`](src/app/DesktopApp.tsx)、[`src/app/DocPage.tsx`](src/app/DocPage.tsx) 等组件中的类名引用，使用新的标准化类名。

### 第五步：确保移动端一致性

检查 [`src/styles/mobile.css`](src/styles/mobile.css) 中的移动端文档样式（`vxm-docs-*`），确保与桌面端排版样式在视觉上保持一致（字体大小、行高、间距等）。

---

## 关键原则

1. **向后兼容**：先添加新样式，再逐步迁移旧类名，避免一次性破坏现有页面
2. **命名规范**：统一使用 `vx-doc-` 前缀（而非 `vx-docs-` 或 `vx-bs-doc-`）
3. **响应式内置**：基础排版样式应内置响应式断点，确保移动端开箱即用
4. **主题感知**：所有颜色使用 CSS 变量（`var(--vx-text)`、`var(--vx-text-secondary)` 等），自动适配亮/暗主题
5. **不包含项目特定样式**：首页特有布局、法律/错误页面、紧凑模式覆盖等保留在项目
