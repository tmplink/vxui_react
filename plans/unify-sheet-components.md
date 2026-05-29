# Sheet 组件合并方案

## 背景分析

当前项目中存在 **4 个** 与 Sheet（面板/抽屉）相关的组件，功能高度重叠：

| 组件 | 文件 | 核心用途 | 动画方向 | 拖拽关闭 | trigger | 确认按钮 |
|------|------|---------|---------|---------|--------|---------|
| `Sheet` | `src/components/Sheet.tsx` | 桌面端四方向滑入面板 | left/right/top/bottom | ❌ | ✅ | ❌ |
| `BottomSheet` | `src/components/mobile/BottomSheet.tsx` | 移动端底部弹出面板 | bottom only | ✅ | ❌ | ✅ |
| `ActionSheet` | `src/components/mobile/ActionSheet.tsx` | 移动端操作列表 | bottom only | ✅ | ❌ | ❌ |
| `MobileDrawer` | `src/components/mobile/MobileDrawer.tsx` | 移动端左侧导航抽屉 | left only | ✅ | ❌ | ❌ |

### 重叠问题

1. **`Sheet` vs `BottomSheet`**：`Sheet(side='bottom')` 和 `BottomSheet` 都是底部滑入面板，但实现完全不同
   - `Sheet` 使用简单 CSS animation，无退出动画
   - `BottomSheet` 使用状态机管理 entering/visible/exiting 三阶段，有完整进出动画
   - `BottomSheet` 支持拖拽手势关闭、确认按钮、`inlineInDialog` 等高级功能
   - `Sheet` 支持 trigger prop 和受控/非受控模式

2. **`BottomSheet` vs `ActionSheet`**：两者都是底部弹出，结构高度相似
   - `ActionSheet` 更简单，专为操作列表设计
   - `BottomSheet` 功能更丰富（标题、描述、确认按钮、拖拽关闭）
   - 两者都有独立的拖拽手势实现（代码重复）

3. **`MobileDrawer`**：左侧抽屉，与 `Sheet(side='left')` 功能重叠
   - `MobileDrawer` 有 header/footer 插槽
   - `Sheet(side='left')` 有 trigger、受控模式

4. **CSS 样式重复**：4 个组件各自定义了一套样式，大量重复代码（overlay、handle、header、body、footer 等）

## 合并目标

打造一个 **统一的 `Sheet` 组件**，覆盖所有使用场景：

```
Unified Sheet
├── Desktop 模式
│   ├── side='right'  → 右侧面板（默认）
│   ├── side='left'   → 左侧面板
│   ├── side='top'    → 顶部面板
│   └── side='bottom' → 底部面板
├── Mobile 模式（自动检测）
│   ├── side='bottom' → 全屏底部 Sheet（带拖拽、确认按钮）
│   ├── side='left'   → 左侧抽屉
│   └── side='right'  → 右侧抽屉
└── ActionSheet 模式
    └── variant='action' → 操作列表样式
```

## 统一接口设计

```typescript
export type SheetSide = 'left' | 'right' | 'top' | 'bottom';
export type SheetVariant = 'default' | 'action';

export interface SheetProps {
  // ─── 基础 ───
  trigger?: ReactNode;
  children: ReactNode;
  side?: SheetSide;           // 默认 'right'
  variant?: SheetVariant;     // 默认 'default'
  
  // ─── 标题/描述 ───
  title?: ReactNode;
  description?: ReactNode;
  
  // ─── 插槽 ───
  header?: ReactNode;         // 自定义头部（覆盖 title/description）
  footer?: ReactNode;         // 底部内容
  
  // ─── 控制 ───
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // ─── 行为 ───
  draggable?: boolean;        // 仅 side='bottom' 时有效，移动端底部 Sheet 拖拽关闭
  showClose?: boolean;        // 是否显示关闭按钮（默认 true）
  showConfirm?: boolean;      // 是否显示确认按钮
  confirmText?: string;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  
  // ─── 样式 ───
  className?: string;
  width?: number | string;    // 侧边面板宽度
  maxHeight?: string;         // 底部面板最大高度
  
  // ─── 高级 ───
  inlineInDialog?: boolean;   // 是否在 Dialog 内联渲染
  mobileMode?: 'auto' | 'sheet' | 'fullscreen';  // 移动端展示模式
}
```

## 架构设计

### 组件结构

```
src/components/Sheet/
├── Sheet.tsx              # 主入口：检测环境，分发到不同渲染策略
├── SheetDesktop.tsx       # 桌面端四方向面板
├── SheetMobile.tsx        # 移动端底部 Sheet（带拖拽、确认按钮）
├── SheetDrawer.tsx        # 移动端侧边抽屉
├── SheetAction.tsx        # ActionSheet 变体
├── SheetContext.tsx       # 共享上下文（状态、回调）
└── index.ts               # 统一导出
```

### 状态管理

统一使用 `useDialogState` hook 管理受控/非受控状态，所有子组件共享同一状态机：

```
[hidden] → [entering] → [visible] → [exiting] → [hidden]
```

### 移动端自适应

- 通过 `useIsMobile` hook 自动检测移动端
- `side='bottom'` 在移动端使用 `SheetMobile`（全屏底部弹出）
- `side='left'|'right'` 在移动端使用 `SheetDrawer`（无拖拽，保持简单）
- `variant='action'` 使用 `SheetAction`（操作列表样式）
- 桌面端统一使用 `SheetDesktop`（四方向滑入）

## 迁移计划

### 步骤 1：创建统一 Sheet 组件

1. 创建 `src/components/Sheet/` 目录
2. 实现核心组件和子组件
3. 统一 CSS 样式（合并到 `base.css`）

### 步骤 2：更新消费者

| 消费者 | 当前使用 | 迁移后 |
|--------|---------|--------|
| `Select.tsx` | `BottomSheet` | `<Sheet side="bottom" mobileMode="sheet">` |
| `MultiSelect.tsx` | `BottomSheet` | `<Sheet side="bottom" mobileMode="sheet">` |
| `ColorPicker.tsx` | `BottomSheet` | `<Sheet side="bottom" mobileMode="sheet">` |
| `DatePicker.tsx` | `BottomSheet` | `<Sheet side="bottom" mobileMode="sheet">` |
| `TimePicker.tsx` | `BottomSheet` | `<Sheet side="bottom" mobileMode="sheet">` |
| `MobileApp.tsx` | `ActionSheet` + `MobileDrawer` + `Sheet` | 统一使用 `<Sheet>` |
| `MobilePreviewPage.tsx` | `ActionSheet` + `MobileDrawer` | 统一使用 `<Sheet>` |

### 步骤 3：废弃旧组件

- 保留旧文件但标记为 `@deprecated`
- 更新导出指向新组件
- 删除旧 CSS 样式

### 步骤 4：清理

- 删除 `src/components/mobile/BottomSheet.tsx`
- 删除 `src/components/mobile/ActionSheet.tsx`
- 删除 `src/components/mobile/MobileDrawer.tsx`
- 删除 `src/components/Sheet.tsx`（旧文件）
- 清理 `base.css` 中对应的旧样式

## 详细实施步骤

### Step 1: 创建目录结构和基础文件

```
src/components/Sheet/
├── index.ts              # 导出
├── Sheet.tsx             # 主入口
├── useSheetState.ts      # 状态管理 hook
├── SheetDesktop.tsx      # 桌面端
├── SheetMobile.tsx       # 移动端底部
├── SheetDrawer.tsx       # 移动端抽屉
└── SheetAction.tsx       # ActionSheet
```

### Step 2: 实现 `useSheetState.ts`

- 基于 `useDialogState` 封装
- 增加动画阶段管理（entering/visible/exiting）
- 提供 `startExiting` 方法供子组件调用

### Step 3: 实现 `SheetDesktop.tsx`

- 从旧 `Sheet.tsx` 迁移
- 支持四方向动画
- 使用 `createPortal` 渲染到 `document.body`

### Step 4: 实现 `SheetMobile.tsx`

- 从旧 `BottomSheet.tsx` 迁移
- 全屏底部弹出
- 拖拽手势关闭
- 确认按钮支持

### Step 5: 实现 `SheetDrawer.tsx`

- 从旧 `MobileDrawer.tsx` 迁移，**移除拖拽手势逻辑**
- 支持左右两侧
- header/footer 插槽
- 使用 CSS animation 实现滑入/滑出动画

### Step 6: 实现 `SheetAction.tsx`

- 从旧 `ActionSheet.tsx` 迁移
- 操作列表样式
- 支持 `ActionSheetItem` 子组件

### Step 7: 实现 `Sheet.tsx` 主入口

- 检测 `variant` 和 `side`
- 检测移动端环境
- 分发到对应子组件
- 统一管理状态

### Step 8: 更新 CSS

- 合并所有样式到 `base.css` 的 Sheet 区域
- 统一 CSS 变量
- 删除旧样式

### Step 9: 更新消费者

- 逐个更新引用 `BottomSheet` 的组件
- 更新 `MobileApp.tsx` 和 `MobilePreviewPage.tsx`
- 更新 `lib/index.ts` 导出

### Step 10: 清理旧文件

- 删除旧组件文件
- 删除旧 CSS
- 运行测试确保无回归

## 兼容性保证

- 所有现有 `BottomSheet` 的 props 在新组件中继续支持
- `ActionSheet` 和 `ActionSheetItem` 通过 `variant='action'` 和 `Sheet.Item` 子组件支持
- `MobileDrawer` 通过 `side='left'` 在移动端自动切换为抽屉模式（无拖拽）
- 旧 `Sheet` 组件完全向后兼容
