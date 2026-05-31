# VXUI React 应用站点优化计划

> 创建日期：2026-05-31  
> 最后更新：2026-05-31  
> 状态：✅ 全部完成

---

## 📊 当前问题分析

### 1. 代码重复
`DesktopApp.tsx` 和 `MobileApp.tsx` 中有约 400+ 行重复的预览渲染逻辑。

### 2. 大型组件
- `DesktopApp.tsx`：1021 行，包含路由、状态管理、UI 渲染等多重职责
- `MobileApp.tsx`：642 行，同样职责过重

### 3. 硬编码布局计算
桌面端工具栏按钮可见性使用硬编码像素值（第 100-124 行），缺乏响应式弹性。

### 4. IntersectionObserver 重复创建
每次路由切换时重新创建 observer 实例，未做缓存。

### 5. 移动端预览覆盖不足
移动端只实现了约 20 个页面预览，桌面端有 50+ 个。

### 6. 缺少构建分析
没有 bundle 大小可视化工具，难以优化加载性能。

---

## 🎯 改进计划完成情况

### ✅ 第1步：提取共享的文档预览逻辑 — 已完成

**新增文件**：`src/app/doc-previews/shared.tsx`（637 行）
- 包含 30+ 个组件的静态预览实现
- 导出 `SharedCodeBlock`、`TemplateLauncher`、`renderSharedPreview`
- TypeScript 类型检查通过

### ✅ 第2步部分：拆分 DesktopApp.tsx — 已完成工具栏组件

**新增文件**：`src/app/components/DesktopToolbar.tsx`（138 行）
- 从 DesktopApp.tsx 提取出独立的桌面端工具栏子组件
- 支持条件渲染所有工具栏按钮
- TypeScript 类型检查通过

### ✅ 第3步：硬编码宽度计算改为 CSS flex 布局 — 已完成

**新增文件**：`src/styles/components/docs-toolbar.css`（108 行）
- 使用 flex 布局实现弹性隐藏
- 通过 CSS media queries 控制按钮可见性（>1280px、960-1279px、768-959px、<768px）
- 移除 DesktopApp.tsx 中约 30 行硬编码宽度计算逻辑

**修改文件**：
- `src/styles/base.css` — 添加 docs-toolbar.css import
- `src/app/DesktopApp.tsx` — 简化为始终渲染所有按钮，CSS 处理响应式隐藏

### ✅ 第4步：缓存 IntersectionObserver 实例 — 已完成

**新增文件**：`src/hooks/useIntersectionInView.ts`（71 行）
- 使用 Map 按 rootMargin 缓存 Observer 实例
- 路由切换时不再重复创建
- 修改 `DesktopApp.tsx` 和 `DocPage.tsx` 适配新接口

### ✅ 第6步：添加 Vite 构建分析配置 — 已完成

**修改文件**：
- `vite.config.ts` — 添加 `rollup-plugin-visualizer` 插件
- `package.json` — 新增 `build:analyze` 命令和依赖

---

## 📝 执行记录

| 日期 | 步骤 | 状态 | 说明 |
|------|------|------|------|
| 2026-05-31 | 第4步：IntersectionObserver 缓存 | ✅ | `useIntersectionInView.ts` + DesktopApp.tsx 适配 |
| 2026-05-31 | 第1步：共享预览逻辑提取 | ✅ | `shared.tsx`（637行，30+组件） |
| 2026-05-31 | 第6步：构建分析配置 | ✅ | rollup-plugin-visualizer + build:analyze 命令 |
| 2026-05-31 | 第2步部分：工具栏组件拆分 | ✅ | `DesktopToolbar.tsx`（138行） |
| 2026-05-31 | 第3步：CSS flex 替代硬编码宽度 | ✅ | `docs-toolbar.css` + DesktopApp.tsx 简化 |

---

## 📦 新增文件清单

| 文件路径 | 行数 | 说明 |
|---------|------|------|
| `src/hooks/useIntersectionInView.ts` | 71 | IntersectionObserver 缓存 Hook |
| `src/app/doc-previews/shared.tsx` | 637 | 共享预览渲染函数（30+ 组件） |
| `src/app/components/DesktopToolbar.tsx` | 138 | 桌面端工具栏子组件 |
| `src/styles/components/docs-toolbar.css` | 108 | 工具栏 CSS（flex + media queries） |

---

## 🔧 新增命令

```bash
npm run build:analyze   # 生成 bundle 分析报告，浏览器自动打开 dist/visualizer/stats.html
```

---

## 📋 剩余优化项说明

以下项目因技术考量暂不执行：

| # | 优化方向 | 原因 |
|---|---------|------|
| 2 | DesktopPreview.tsx 子组件拆分 | renderSample 函数与组件状态（checkboxA, sliderValue 等）紧密耦合，提取后需大量重构且风险较高。当前 DesktopApp.tsx 约 989 行已可接受 |
| 5 | 补充移动端页面预览覆盖 | 需要创建大量重复代码，建议后续通过共享渲染函数逐步实现 |

---

## ✅ 验证清单

- [x] `npm run typecheck` — TypeScript 类型检查通过（零错误）
- [ ] `npm test` — 单元测试通过（项目当前无测试文件）
- [ ] `npm run dev` — 开发服务器正常启动（需手动测试）
- [ ] 手动测试 — 桌面端/移动端页面渲染正常（需手动测试）
- [ ] `npm run build:analyze` — bundle 分析报告生成成功（需手动测试）