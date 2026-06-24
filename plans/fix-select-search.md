# Select/MultiSelect 搜索功能适配自定义 UI 计划

## 目标

支持 `option.label` 传入 ReactNode 自定义渲染，同时保留搜索过滤能力。

## 方案

1. **SelectOption / MultiSelectOption 接口变更**
   - `label`: `string` → `ReactNode`
   - 新增 `searchLabel?: string` — 当 label 为 ReactNode 时用于搜索过滤的纯文本
   
2. **搜索逻辑变更**
   - 优先使用 `option.searchLabel`
   - 未提供时，若 `label` 是字符串则直接用
   - 若 `label` 是 ReactNode 且无 `searchLabel`，跳过该选项的搜索匹配

3. **向后兼容**
   - 现有代码：`{ value: 'a', label: 'Option A' }` → `typeof label === 'string'` 依然生效
   - 自定义 UI：`{ value: 'a', label: <Badge>Active</Badge>, searchLabel: 'Active' }` → 搜索正常

## 受影响文件

- `src/components/Select.tsx` — 接口 + 搜索逻辑
- `src/components/MultiSelect.tsx` — 接口 + 搜索逻辑