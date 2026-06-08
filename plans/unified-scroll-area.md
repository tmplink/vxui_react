# 统一 ScrollArea 组件重构计划

## 目标

将项目中两套滚动条方案合并为一个统一的 `ScrollArea` 组件：
- **方案 A**：`useScrollbarSync` Hook + overlay 滚动条（用于 Shell、Dialog）
- **方案 B**：`ScrollArea` 组件 + 原生滚动条（用于文档预览）

合并后，`ScrollArea` 默认使用 overlay 模式（方案 A），同时保留 `variant="native"` 作为原生降级选项。

---

## 架构设计

```
新 ScrollArea 组件
├── variant="overlay"（默认）
│   ├── 内部使用 useScrollbarSync Hook
│   ├── 隐藏原生滚动条（vx-scroll-hide-native）
│   ├── 渲染 overlay 滚动条 thumb
│   └── 支持 maxHeight / maxWidth 约束
│
└── variant="native"
    ├── 纯 CSS 方案，零 JS 开销
    ├── 使用 scrollbar-width: thin 美化原生滚动条
    └── 支持 maxHeight / maxWidth 约束
```

### 新 ScrollArea Props

```typescript
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** 滚动条样式变体。overlay: 自定义悬浮滚动条（默认）；native: 浏览器原生滚动条 */
  variant?: 'overlay' | 'native';
  /** 最大高度，超出后滚动。数字按 px 处理 */
  maxHeight?: string | number;
  /** 最大宽度，超出后滚动。数字按 px 处理 */
  maxWidth?: string | number;
  children: ReactNode;
}
```

---

## 详细步骤

### 步骤 1：重构 `ScrollArea.tsx`

**文件**：`src/components/ScrollArea.tsx`

- 导入 `useScrollbarSync` Hook
- 新增 `variant` prop，默认 `'overlay'`
- `variant="overlay"` 时：使用 `useScrollbarSync` + overlay 滚动条 DOM 结构
- `variant="native"` 时：保持现有纯 CSS 方案
- 两种模式都支持 `maxHeight`/`maxWidth` 约束

### 步骤 2：重构 `scroll-area.css`

**文件**：`src/styles/components/scroll-area.css`

- 从 `layout.css` 迁移 overlay 滚动条样式（`.vx-overlay-scrollbar`、`.vx-overlay-scrollbar__thumb`、`.vx-scroll-hide-native`、`.vx-scroll-host`）
- 保留现有原生滚动条样式（`.vx-scroll-area__viewport`）
- 新增 overlay 模式下的 viewport 样式

### 步骤 3：重构 `Shell.tsx`

**文件**：`src/components/Shell.tsx`

- `ShellSidebar`：移除手动 `useScrollbarSync` + overlay DOM 结构，改用 `<ScrollArea variant="overlay">`
- `ShellContent`：同上
- 移除 `useScrollbarSync` 导入
- 注意：`ShellSidebar` 内部有 header/footer 等复杂结构，需要确保 ScrollArea 只包裹可滚动内容部分

### 步骤 4：重构 `Dialog.tsx`

**文件**：`src/components/Dialog.tsx`

- `DialogBody`：移除手动 `useScrollbarSync` + overlay DOM 结构，改用 `<ScrollArea variant="overlay">`
- 移除 `useScrollbarSync` 导入
- 保留 `scrollable` prop 控制是否启用滚动

### 步骤 5：更新 `lib/index.ts`

**文件**：`src/lib/index.ts`

- 导出保持不变（`ScrollArea`、`ScrollAreaProps` 已导出）
- 确认 `useScrollbarSync` 不需要从 lib 导出（它是内部实现细节）

### 步骤 6：更新 `i18n/index.tsx`

**文件**：`src/i18n/index.tsx`

- 更新 ScrollArea 文档描述，新增 `variant` prop 说明
- 中英文文档同步更新

### 步骤 7：清理 `layout.css`

**文件**：`src/styles/layout.css`

- 移除已迁移到 `scroll-area.css` 的样式：
  - `.vx-scroll-hide-native`（第 470-479 行）
  - `.vx-overlay-scrollbar`（第 481-490 行）
  - `.vx-overlay-scrollbar__thumb`（第 492-504 行）
  - `.vx-overlay-scrollbar__thumb:hover`（第 506-511 行）
  - `.vx-scroll-host[data-scrollable]`（第 513-515 行）
  - `:root[data-theme='dark'] .vx-overlay-scrollbar__thumb`（第 517-520 行）
- 保留 `.vx-sidebar__scroll` 和 `.vx-shell__content` 的布局样式（flex、padding 等），只移除滚动条相关的 CSS

### 步骤 8：验证

- `DesktopApp.tsx` 中的 `<ScrollArea>` 使用不受影响（默认 overlay 模式，行为略有变化但功能正常）
- `shared.tsx` 中的 `<ScrollArea>` 使用不受影响
- Shell 侧边栏和内容区滚动条正常工作
- Dialog 滚动条正常工作

---

## 影响范围

| 文件 | 操作 | 风险 |
|---|---|---|
| `src/components/ScrollArea.tsx` | 重写 | 中 — 核心组件 |
| `src/styles/components/scroll-area.css` | 重写 | 中 — 样式合并 |
| `src/components/Shell.tsx` | 修改 | 中 — ShellSidebar/ShellContent 重构 |
| `src/components/Dialog.tsx` | 修改 | 低 — DialogBody 重构 |
| `src/styles/layout.css` | 删减 | 低 — 移除冗余样式 |
| `src/lib/index.ts` | 不变 | 无 |
| `src/i18n/index.tsx` | 修改 | 低 — 文档更新 |
| `src/app/DesktopApp.tsx` | 不变 | 无 |
| `src/app/doc-previews/shared.tsx` | 不变 | 无 |

---

## 不变项

- `useScrollbarSync` Hook 保留不变（作为 ScrollArea 的内部实现）
- `ScrollArea` 的公开 API 向后兼容（新增 `variant` prop 为可选，默认 `'overlay'`）
- 所有现有 `<ScrollArea>` 使用处无需修改（但行为从原生滚动条变为 overlay 滚动条）
