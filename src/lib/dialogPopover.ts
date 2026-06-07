import { createContext, useContext } from 'react';

/**
 * DialogContentContext — 允许 Dialog 组件将 content ref 传递给子组件，
 * 替代通过 CSS 类名选择器查找 DOM 节点的脆弱方式。
 * 
 * Select、MultiSelect、DatePicker 等组件通过此 context 获取 dialog content
 * 元素，将 dropdown 面板 portal 到 dialog 内部以避免 z-index 裁剪问题。
 */
export const DialogContentContext = createContext<HTMLElement | null>(null);

/**
 * 获取 dialog content 元素引用。
 * 优先使用 React Context，回退到 DOM 选择器方式以保持向后兼容。
 */
export function getDialogContent(node: HTMLElement | null): HTMLElement | null {
  // 优先通过 React Context 获取
  if (node) {
    // 尝试从最近的 Provider 获取
    const providerEl = node.closest<HTMLElement>('[data-dialog-content-ref]');
    if (providerEl) {
      return providerEl;
    }
  }
  // 回退：通过 CSS 类名选择器
  return node?.closest<HTMLElement>('.vx-dialog__content') ?? null;
}

/**
 * Determine if a popover/dropdown should be rendered inline or portaled.
 * 
 * On mobile, dropdowns use Sheet component which always portals to body,
 * so shouldInline is always false. On desktop, dropdowns use fixed-position
 * popovers that should be portaled into the dialog content if inside a dialog
 * to avoid z-index clipping issues.
 */
export function getDialogPopoverContext(node: HTMLElement | null) {
  const dialogContent = getDialogContent(node);
  
  // Always portal on desktop; Sheet on mobile handles its own portal logic
  const shouldInline = false;

  return {
    dialogContent: shouldInline ? null : dialogContent,
    shouldInline,
  };
}

/**
 * Hook for components that need to portal their dropdown into a dialog.
 * Prefer this over getDialogPopoverContext for new code.
 */
export function useDialogContentRef(): HTMLElement | null {
  return useContext(DialogContentContext);
}
