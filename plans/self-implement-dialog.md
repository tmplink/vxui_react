# 自实现 Dialog / AlertDialog / Sheet 组件方案

## 背景

目前 [`Dialog`](src/components/Dialog.tsx)、[`AlertDialog`](src/components/AlertDialog.tsx)、[`Sheet`](src/components/Sheet.tsx) 三个组件都依赖 `@radix-ui/react-dialog` 实现。为了完全可控，需要移除该依赖，自行实现核心功能。

## Radix Dialog 提供的核心能力

| 能力 | 说明 |
|------|------|
| **Portal** | 将内容渲染到 `document.body` 或其他容器 |
| **Overlay** | 半透明遮罩层 |
| **焦点 trap (FocusScope)** | 打开时焦点锁定在 dialog 内，Tab 循环 |
| **Escape 关闭** | 按 Escape 键关闭 dialog |
| **点击外部关闭** | 点击 overlay 关闭 dialog |
| **ARIA 属性** | `role="dialog"`、`aria-modal="true"`、`aria-labelledby`、`aria-describedby` |
| **状态管理** | `open`/`defaultOpen`/`onOpenChange` 受控/非受控 |
| **body 滚动锁定** | 打开时禁止 body 滚动 |
| **动画** | 进入/离开动画（通过 CSS animation） |

## 方案概述

三个组件各自独立实现，不共享底层逻辑。每个组件自行实现 Portal、焦点管理、Escape 关闭、点击外部关闭、ARIA 属性等能力。

### 文件变更清单

#### 新增文件

1. **`src/hooks/useDialogState.ts`** — 通用 hook，管理 dialog 的 open/close 状态（受控/非受控）
2. **`src/hooks/usePortal.ts`** — 通用 hook，创建 portal 容器并渲染 children 到 `document.body`
3. **`src/hooks/useFocusTrap.ts`** — 通用 hook，焦点 trap 逻辑
4. **`src/hooks/useBodyScrollLock.ts`** — 通用 hook，锁定 body 滚动

> 注意：虽然组件各自独立实现，但底层 hook 可以复用，避免重复造轮子。这些 hook 是纯逻辑层，不包含 UI。

#### 修改文件

5. **`src/components/Dialog.tsx`** — 重写，移除 Radix 依赖
6. **`src/components/AlertDialog.tsx`** — 重写，移除 Radix 依赖
7. **`src/components/Sheet.tsx`** — 重写，移除 Radix 依赖
8. **`src/lib/dialogPopover.ts`** — 检查是否需要调整（目前依赖 `.vx-dialog__content` 选择器，逻辑不变）
9. **`package.json`** — 移除 `@radix-ui/react-dialog` 依赖

#### 无需修改

- **`src/styles/base.css`** — 所有 CSS class 名称不变，样式无需修改
- **`src/lib/index.ts`** — 导出接口不变
- **`src/App.tsx`** — 使用方式不变

## 详细实现方案

### 1. `useDialogState` hook

```typescript
interface UseDialogStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function useDialogState(props: UseDialogStateProps) {
  // 受控模式：直接使用 props.open
  // 非受控模式：内部 useState，初始值 defaultOpen
  // 返回 [isOpen, setIsOpen]
}
```

### 2. `usePortal` hook

```typescript
function usePortal(container?: HTMLElement | null) {
  // 创建 portal 到指定 container 或 document.body
  // 返回 { Portal: (props: { children }) => ReactPortal | null }
}
```

### 3. `useFocusTrap` hook

```typescript
function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean) {
  // 当 active 为 true 时：
  // 1. 自动聚焦到 container 内的第一个可聚焦元素
  // 2. Tab/Shift+Tab 循环焦点
  // 3. 阻止焦点逃逸到 container 外
}
```

### 4. `useBodyScrollLock` hook

```typescript
function useBodyScrollLock(active: boolean) {
  // 当 active 为 true 时：
  // 1. 设置 document.body.style.overflow = 'hidden'
  // 2. 记录并恢复原始 overflow 值
  // 3. 处理滚动条消失导致的布局偏移（padding-right）
}
```

### 5. Dialog 组件重写

```tsx
export function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md',
  padding,
  placement = 'center',
  scrollable = true,
  closable = true,
  fullscreen = false,
  className,
  ...props  // open, defaultOpen, onOpenChange
}: DialogProps) {
  const [isOpen, setIsOpen] = useDialogState(props);
  const contentRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);
  useFocusTrap(contentRef, isOpen);

  // Escape 关闭
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 检查是否有内联下拉菜单打开
        const el = contentRef.current;
        if (el) {
          const hasOpenInline = /* ... */;
          const hasOpenPortal = el.dataset.hasOpenPortal === '1';
          if (hasOpenInline || hasOpenPortal) return;
        }
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // 点击 overlay 关闭
  const handleOverlayClick = () => {
    const el = contentRef.current;
    if (el?.dataset.hasOpenPortal === '1' || el?.dataset.hasOpenBottomSheet === '1') return;
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <TriggerWrapper onClick={() => setIsOpen(true)}>{trigger}</TriggerWrapper>

      {/* Portal */}
      {isOpen && createPortal(
        <>
          <div className="vx-dialog__overlay" onClick={handleOverlayClick} />
          <div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vx-dialog-title"
            aria-describedby={description ? 'vx-dialog-desc' : undefined}
            className={cx(...)}
          >
            <div className="vx-dialog__header">
              <div>
                <h2 id="vx-dialog-title" className="vx-dialog__title">{title}</h2>
                {description && <p id="vx-dialog-desc" className="vx-dialog__description">{description}</p>}
              </div>
              {closable && (
                <button className="vx-dialog__close" onClick={() => setIsOpen(false)} aria-label="Close dialog">
                  <X size={16} />
                </button>
              )}
            </div>
            <DialogBody scrollable={scrollable}>{children}</DialogBody>
            {footer && <div className="vx-dialog__footer">{footer}</div>}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
```

### 6. AlertDialog 组件重写

AlertDialog 更简单，不需要 size/placement/scrollable 等复杂配置。核心逻辑与 Dialog 类似，但：
- 使用 `role="alertdialog"`
- 只有确认/取消两个按钮
- 没有 body 滚动条同步

### 7. Sheet 组件重写

Sheet 的动画是滑动式，但逻辑层与 Dialog 相同：
- Portal、Overlay、焦点 trap、Escape 关闭、点击外部关闭
- 不同的 CSS class（`vx-sheet`、`vx-sheet--${side}`）

### 8. DialogClose 组件

当前 `DialogClose` 是 `DialogPrimitive.Close` 的别名，用于在 dialog 内部关闭。自实现后需要提供一个独立的 `DialogClose` 组件，通过 context 获取关闭函数。

由于三个组件各自独立实现，`DialogClose` 只属于 `Dialog` 组件。`AlertDialog` 和 `Sheet` 不需要导出 `Close` 组件。

## 关键注意事项

1. **焦点管理** — 需要正确处理：
   - 打开时自动聚焦到第一个可聚焦元素或关闭按钮
   - Tab/Shift+Tab 循环
   - 关闭时焦点返回到 trigger 元素

2. **Escape 键冲突** — 当前 Dialog 有特殊逻辑：当内部有 Select/MultiSelect 等下拉菜单打开时，阻止 Escape 关闭 dialog。这个逻辑需要保留。

3. **点击外部关闭冲突** — 当内部有 portaled 下拉菜单或 BottomSheet 打开时，阻止点击外部关闭。这个逻辑需要保留。

4. **body 滚动锁定** — 需要处理：
   - 滚动条消失导致的布局偏移（padding-right 补偿）
   - 多个 dialog 嵌套时的滚动锁定计数

5. **Trigger 元素** — 需要正确处理 `asChild` 模式（将事件和 ref 传递给子元素），或者直接使用 button 包裹。

6. **DialogClose 的 asChild 支持** — 当前 `DialogClose` 支持 `asChild` prop，自实现时需要保持这个能力。

## 实施步骤

1. 创建 `src/hooks/useDialogState.ts`
2. 创建 `src/hooks/useFocusTrap.ts`
3. 创建 `src/hooks/useBodyScrollLock.ts`
4. 重写 `src/components/Dialog.tsx`
5. 重写 `src/components/AlertDialog.tsx`
6. 重写 `src/components/Sheet.tsx`
7. 从 `package.json` 移除 `@radix-ui/react-dialog`
8. 运行测试验证
9. 清理 `node_modules` 中不再需要的依赖
