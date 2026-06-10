# 修复浮层/面板类组件的毛玻璃背景计划

## 问题概述

项目中部分浮层/面板类组件使用了 `var(--vx-surface)` 作为背景色，而非毛玻璃效果（`var(--vx-glass-bg)` / `var(--vx-glass-bg-strong)` + `backdrop-filter`）。根据需求，所有浮层/面板类组件都应使用毛玻璃效果。

## 需要修复的组件清单

### 1. `--in-dialog` 变体（4处）

这些组件在 dialog 内部时使用了 `var(--vx-surface)` + `backdrop-filter: none`，应改为毛玻璃效果。

| 文件 | 行号 | 当前代码 |
|------|------|----------|
| [`src/styles/components/select.css`](../src/styles/components/select.css:83) | 83-90 | `.vx-select__dropdown--in-dialog` — `background: var(--vx-surface); backdrop-filter: none;` |
| [`src/styles/components/multiselect.css`](../src/styles/components/multiselect.css:130) | 130-136 | `.vx-multiselect__dropdown--in-dialog` — `background: var(--vx-surface); backdrop-filter: none;` |
| [`src/styles/components/dropdown-menu.css`](../src/styles/components/dropdown-menu.css:43) | 43-50 | `.vx-dropdown__menu--in-dialog` — `background: var(--vx-surface); backdrop-filter: none;` |
| [`src/styles/components/timepicker.css`](../src/styles/components/timepicker.css:63) | 63-69 | `.vx-timepicker__popover--in-dialog` — `background: var(--vx-surface); backdrop-filter: none;` |

**修复方案：** 将 `background` 改为 `var(--vx-glass-bg)`，添加 `backdrop-filter: var(--vx-glass-filter)`，使用 `var(--vx-glass-border)` 和 `var(--vx-glass-shadow)`。移除 `--in-dialog` 变体，因为毛玻璃效果在 dialog 内部也能正常工作。

### 2. 浮层面板（3处）

这些浮层组件使用了 `var(--vx-surface)` 而非毛玻璃。

| 文件 | 行号 | 当前代码 |
|------|------|----------|
| [`src/styles/layout.css`](../src/styles/layout.css:263) | 263-268 | `.vx-nav-sublist-flyout` — `background: var(--vx-surface); border: 1px solid var(--vx-border); box-shadow: var(--vx-shadow);` |
| [`src/styles/mobile.css`](../src/styles/mobile.css:193) | 193-201 | `.vxm-bottomnav__submenu` — `background: var(--vx-surface); border: 1px solid var(--vx-border); box-shadow: var(--vx-shadow-lg);` |
| [`src/styles/components/color-picker.css`](../src/styles/components/color-picker.css:34) | 34-41 | `.vx-colorpicker__panel` — `background: var(--vx-surface); border: 1px solid var(--vx-border); box-shadow: var(--vx-shadow);` |

**修复方案：** 将 `background` 改为 `var(--vx-glass-bg)`，添加 `backdrop-filter: var(--vx-glass-filter)`，使用 `var(--vx-glass-border)` 和 `var(--vx-glass-highlight), var(--vx-glass-shadow)`。

### 3. 语言切换器下拉菜单（1处）

| 文件 | 行号 | 当前代码 |
|------|------|----------|
| [`src/styles/components/language-switcher.css`](../src/styles/components/language-switcher.css:28) | 28-36 | `.vx-lang-switcher .vx-select__dropdown` — `background: var(--vx-surface); border-color: var(--vx-border); box-shadow: var(--vx-shadow-lg);` |

**修复方案：** 将 `background` 改为 `var(--vx-glass-bg)`，添加 `backdrop-filter: var(--vx-glass-filter)`，使用 `var(--vx-glass-border)` 和 `var(--vx-glass-highlight), var(--vx-glass-shadow)`。

### 4. Topbar（1处）- 可选

| 文件 | 行号 | 当前代码 |
|------|------|----------|
| [`src/styles/layout.css`](../src/styles/layout.css:384) | 384-388 | `.vx-topbar` — `background: var(--vx-surface); backdrop-filter: none;` |

**说明：** Topbar 是布局组件而非浮层，当前使用 `var(--vx-surface)` 且有 `backdrop-filter: none`。如果也需要毛玻璃效果，应改为 `var(--vx-glass-bg-strong)` + `backdrop-filter: var(--vx-glass-filter)`。但 topbar 是粘性定位的布局元素，可能不需要毛玻璃效果。**建议保留现状或单独讨论。**

## 不修改的组件

以下组件虽然使用了 `var(--vx-surface)`，但它们是**表单控件/内容卡片/列表**等非浮层组件，不属于浮层/面板类，因此不需要修改：

- `vx-select__trigger`, `vx-input`, `vx-textarea`, `vx-card`, `vx-calendar`, `vx-file-upload`, `vx-menubar`, `vx-tag-input`, `vx-toggle`, `vx-button--secondary`, `vx-multiselect__trigger`, `vx-checkbox`, `vx-number-input`, `vx-colorpicker__trigger`, `vx-table`, `vx-datepicker__trigger`, `vx-timepicker__trigger`, `vx-tabs`, `vx-carousel`, `vx-radio`, `vxm-list`, `vxm-docs-home__chip`, `vxm-legal-page__section-card`, `vxm-fullscreen-preview__exit`, `vxm-topbar`

## 执行步骤

1. 修复 `select.css` 中的 `--in-dialog` 变体
2. 修复 `multiselect.css` 中的 `--in-dialog` 变体
3. 修复 `dropdown-menu.css` 中的 `--in-dialog` 变体
4. 修复 `timepicker.css` 中的 `--in-dialog` 变体
5. 修复 `layout.css` 中的 `vx-nav-sublist-flyout`
6. 修复 `mobile.css` 中的 `vxm-bottomnav__submenu`
7. 修复 `color-picker.css` 中的 `vx-colorpicker__panel`
8. 修复 `language-switcher.css` 中的 `.vx-lang-switcher .vx-select__dropdown`
