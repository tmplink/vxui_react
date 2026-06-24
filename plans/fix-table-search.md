# Table 组件搜索功能修复计划

## 发现的缺陷

1. **accessor 返回 ReactNode 时搜索/列筛选失效** — `String(JSX)` → `"[object Object]"`
2. **行选择索引与筛选/排序后数据解耦** — `selectedRows` 存的索引是 displayData 索引而非原始 data 索引
3. `filterableColumns` 未关联 `searchable` 语义
4. **列筛选对 ReactNode 同样失效**

## 修复方案

### 1. TableColumn 增加 `searchValue` 属性
用于提供专门用于搜索/筛选的纯文本提取函数，解决 ReactNode 无法搜索的问题。

### 2. 行选择索引修复
构建 `dataIndexMap` 将 `displayData` 索引映射回原始 `data` 索引。

### 3. filterableColumns 增加 searchable 检查
确保 `searchable: false` 的列不参与任何形式的检索。

### 4. 搜索/筛选逻辑适配
- 优先使用 `col.searchValue` 提取文本
- 未提供时仅对 `string|number` 类型的值进行匹配