# VXUI React Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.3.9] — 2026-06

### Added

- Version bump to 1.3.9

## [v1.3.8] — 2026-06

### Added

- Version bump to 1.3.8

## [v1.3.7] — 2026-05

### Added
- **Dialog**: Add `onConfirm`, `onCancel`, `confirmLabel`, `cancelLabel`, `confirmVariant` props for built-in confirm/cancel button support ([`src/components/Dialog.tsx`](src/components/Dialog.tsx))
- **Typography Base**: New semantic article排版组件 (`Article`, `ArticleHeader`, `Section`, `Pager`, etc.) with corresponding CSS styles ([`src/components/Article.tsx`](src/components/Article.tsx), [`src/styles/components/typography-base.css`](src/styles/components/typography-base.css))
- **useIntersectionInView Hook**: Cached IntersectionObserver instances by rootMargin to avoid repeated creation on route changes ([`src/hooks/useIntersectionInView.ts`](src/hooks/useIntersectionInView.ts))
- **DesktopToolbar Component**: Extracted toolbar logic into a standalone component ([`src/app/components/DesktopToolbar.tsx`](src/app/components/DesktopToolbar.tsx))
- **docs-toolbar.css**: CSS flex layout with media queries for responsive toolbar button visibility ([`src/styles/components/docs-toolbar.css`](src/styles/components/docs-toolbar.css))
- **shared preview renderer**: Extracted 30+ component static previews into shared module ([`src/app/doc-previews/shared.tsx`](src/app/doc-previews/shared.tsx))

### Changed
- **AlertDialog → Dialog**: Merged AlertDialog functionality into Dialog with `confirmVariant="danger"` prop
- **Toolbar visibility**: Replaced hardcoded pixel width calculations with CSS flex layout and media queries
- **Build config**: Added `build:analyze` command with rollup-plugin-visualizer for bundle size analysis

### Removed
- **AlertDialog component**: No longer needed after Dialog merge ([`src/components/Dialog.tsx`](src/components/Dialog.tsx))
- **vite.demo.config.ts**: Demo build configuration removed ([`package.json`](package.json))

### Deprecated
- `AlertDialog` import — use `Dialog` with `confirmVariant="danger"` instead

---

## [v1.3.6] — 2025-05

### Changed
- Optimize `createPortal` calls in components to support `dialogContentRef` as target element
- Update test cases, optimize user interaction simulation, enhance component availability verification

---

## Version Comparison Matrix

| Feature | v1.3.6 | v1.3.7 | Breaking? |
|---------|--------|--------|-----------|
| Dialog basic props | ✅ | ✅ | No |
| Dialog confirm/cancel buttons | ❌ | ✅ | No |
| AlertDialog component | ✅ | ❌ | **Yes** |
| useIntersectionInView hook | ❌ | ✅ | No |
| DesktopToolbar component | ❌ | ✅ | No |
| docs-toolbar.css | ❌ | ✅ | No |
| shared preview renderer | ❌ | ✅ | No |
| build:analyze command | ❌ | ✅ | No |

---

## Migration Guide: v1.3.6 → v1.3.7

### 1. Replace AlertDialog with Dialog

**Before:**
```tsx
import { AlertDialog } from 'vxui-react';

<AlertDialog
  trigger={<Button variant="danger">Delete</Button>}
  title="Confirm Delete"
  onConfirm={() => handleDelete()}
/>
```

**After:**
```tsx
import { Dialog, Button } from 'vxui-react';

<Dialog
  trigger={<Button variant="danger">Delete</Button>}
  title="Confirm Delete"
  confirmVariant="danger"
  onConfirm={() => handleDelete()}
/>
```

### 2. Use new Dialog props for simpler forms

The new `onConfirm`/`onCancel` props eliminate the need for custom footer buttons:

```tsx
// Before: manual footer implementation
<Dialog
  trigger={<Button>Open</Button>}
  title="Form"
  footer={
    <>
      <Button onClick={() => close()}>Cancel</Button>
      <Button onClick={() => submit()}>Submit</Button>
    </>
  }
>
  {/* form content */}
</Dialog>

// After: built-in confirm/cancel
<Dialog
  trigger={<Button>Open</Button>}
  title="Form"
  onConfirm={submit}
  onCancel={() => close()}
  confirmLabel="Submit"
  cancelLabel="Cancel"
>
  {/* form content */}
</Dialog>
```

### 3. No changes required for other components

All other components remain backward compatible with v1.3.6.

---

[unreleased]: https://github.com/tmplink/vxui_react/compare/v1.3.9...HEAD
[v1.3.9]: https://github.com/tmplink/vxui_react/releases/tag/v1.3.9
[v1.3.8]: https://github.com/tmplink/vxui_react/releases/tag/v1.3.8
[v1.3.7]: https://github.com/tmplink/vxui_react/releases/tag/v1.3.7
[v1.3.6]: https://github.com/tmplink/vxui_react/releases/tag/v1.3.6