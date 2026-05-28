const DIALOG_CONTENT_SELECTOR = '.vx-dialog__content';

/**
 * Get the dialog content element for portal rendering.
 * Returns the closest .vx-dialog__content or null if not inside a dialog.
 */
export function getDialogContent(node: HTMLElement | null): HTMLElement | null {
  return node?.closest<HTMLElement>(DIALOG_CONTENT_SELECTOR) ?? null;
}

/**
 * Determine if a popover/dropdown should be rendered inline or portaled.
 * 
 * On mobile, dropdowns use BottomSheet component which always portals to body,
 * so shouldInline is always false. On desktop, dropdowns use fixed-position
 * popovers that should be portaled into the dialog content if inside a dialog
 * to avoid z-index clipping issues.
 */
export function getDialogPopoverContext(node: HTMLElement | null) {
  const dialogContent = getDialogContent(node);
  
  // Always portal on desktop; BottomSheet on mobile handles its own portal logic
  const shouldInline = false;

  return {
    dialogContent: shouldInline ? null : dialogContent,
    shouldInline,
  };
}
