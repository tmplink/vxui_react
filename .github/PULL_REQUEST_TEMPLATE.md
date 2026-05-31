# Pull Request

## 概述 / Overview

<!-- 简要描述此 PR 的目的和变更内容 -->
<!-- Brief description of this PR's purpose and changes -->

Fixes #(issue number)

## 变更类型 / Type of Change

<!-- 选择适用的选项 -->

- [ ] Bug fix (非破坏性变更)
- [ ] New feature (非破坏性新功能)
- [ ] Breaking change (修复或功能变更会导致现有行为改变)
- [ ] Documentation update (文档更新)
- [ ] Refactor (代码重构)
- [ ] Style changes (样式变更，不涉及功能变化)
- [ ] Build/CI changes (构建/CI 配置变更)
- [ ] Tests (测试相关变更)

## 变更说明 / Changes

### Added
<!-- 新增的功能或组件 -->

- 

### Changed
<!-- 现有功能的修改 -->

- 

### Deprecated
<!-- 即将移除的功能 -->

- 

### Removed
<!-- 已移除的功能 -->

- 

### Fixed
<!-- 修复的问题 -->

- 

### Security
<!-- 安全相关修复 -->

- 

## 测试 / Testing

<!-- 描述如何验证变更的有效性 -->

### How Has This Been Tested?

<!-- 请描述测试方法 -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] Cross-browser testing (如适用)
- [ ] Mobile responsiveness testing (如适用)

### Test Configuration

| Environment | Version | Browser/Node | Result |
|-------------|---------|--------------|--------|
| Development | v1.3.7  | Chrome 120+  | ✅      |
| Production  | v1.3.7  | Firefox 121+ | ✅      |

## 截图 / Screenshots (如适用)

<!-- 添加变更前后的对比截图 -->

| Before | After |
|--------|-------|
|        |       |

## 兼容性 / Compatibility

### Breaking Changes Migration Guide

<!-- 如有破坏性变更，请提供迁移指南 -->

```diff
// Before (v1.3.6)
- import { AlertDialog } from 'vxui-react';

// After (v1.3.7)
+ import { Dialog } from 'vxui-react';
```

### Dependencies

<!-- 是否有依赖项变更 -->

| Dependency | Previous Version | New Version | Required |
|------------|-----------------|-------------|----------|
| react      | ^18.0.0         | ^18.0.0     | No       |
| react-dom  | ^18.0.0         | ^18.0.0     | No       |

## 检查清单 / Checklist

- [ ] 代码遵循项目编码规范
- [ ] 已进行自我审查
- [ ] 已更新相关文档（README、CHANGELOG 等）
- [ ] 变更处添加了注释
- [ ] 无新的编译器警告
- [ ] 所有测试通过

## 额外说明 / Additional Notes

<!-- 其他需要关注的信息 -->


---

## 提交者签名 / Sign-off

By submitting this PR, I confirm that my contribution meets the project's guidelines.
