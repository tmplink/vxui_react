# 修复 `vx-multiselect__search` 在 BottomSheet 中无法点击的问题

## 问题描述

在移动端（`useIsMobile()` 返回 true）时，`MultiSelect` 组件会渲染 `BottomSheet` 来展示选项列表。但 BottomSheet 中的搜索输入框（`.vx-multiselect__search`）无法被点击/聚焦，用户无法输入搜索关键词。

## 根因分析

### 主要问题：`user-select: none`

在 [`src/styles/base.css:2866`](../src/styles/base.css:2866) 中，`.vxm-bottomsheet` 设置了：

```css
.vxm-bottomsheet {
  ...
  user-select: none;
  -webkit-user-select: none;
}
```

`user-select: none` 会阻止所有子元素的文本选择。在移动端 Safari 和部分浏览器中，父元素的 `user-select: none` 会阻止子元素 `<input>` 接收点击事件和焦点，导致输入框无法被点击聚焦。

### 辅助因素：`touch-action: pan-y`

同一样式块中的 `touch-action: pan-y` 限制了触摸事件只能垂直滚动，这可能会干扰搜索输入框的触摸事件处理。

### 代码路径

1. [`BottomSheet.tsx:200`](../src/components/mobile/BottomSheet.tsx:200) — `.vxm-bottomsheet` 元素应用了 `user-select: none`
2. [`MultiSelect.tsx:216-224`](../src/components/mobile/MultiSelect.tsx:216) — `vx-multiselect__search` input 渲染在 BottomSheet 的 `vxm-bottomsheet__body` 中
3. [`base.css:2866`](../src/styles/base.css:2866) — CSS 中设置了 `user-select: none`

## 修复方案

### 方案一（推荐）：在 `.vxm-bottomsheet__body` 中重置 `user-select`

在 [`src/styles/base.css`](../src/styles/base.css) 中，为 `.vxm-bottomsheet__body` 添加 `user-select: auto`：

```css
.vxm-bottomsheet__body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0;
  flex: 1 1 auto;
  user-select: auto;
  -webkit-user-select: auto;
}
```

**优点**：简单直接，一次性修复 BottomSheet body 内所有可交互元素的问题。
**缺点**：范围稍大，但 `.vxm-bottomsheet__body` 本来就是内容区域，允许用户选择是合理的。

### 方案二（精确）：仅对输入元素重置

```css
.vxm-bottomsheet__body input,
.vxm-bottomsheet__body textarea {
  user-select: auto;
  -webkit-user-select: auto;
}
```

**优点**：精确，只影响输入元素。
**缺点**：如果未来有其他可交互元素（如 contenteditable），需要额外处理。

### 推荐方案

采用 **方案一**，因为：
1. BottomSheet 的 body 区域是内容展示区，允许用户选择文本是合理的
2. 修复更彻底，避免类似问题再次出现
3. 代码更简洁

## 实施步骤

1. 在 [`src/styles/base.css`](../src/styles/base.css) 的 `.vxm-bottomsheet__body` 样式中添加 `user-select: auto` 和 `-webkit-user-select: auto`
2. 验证：确保搜索输入框可以点击聚焦，同时 BottomSheet 的拖拽功能不受影响
