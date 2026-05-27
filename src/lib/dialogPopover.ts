const DIALOG_CONTENT_SELECTOR = '.vx-dialog__content';
const MOBILE_INLINE_QUERY = '(max-width: 640px)';

export function getDialogPopoverContext(node: HTMLElement | null) {
  const dialogContent = node?.closest<HTMLElement>(DIALOG_CONTENT_SELECTOR) ?? null;
  const isMobile = window.matchMedia(MOBILE_INLINE_QUERY).matches;
  // On mobile, always inline so the dropdown can use bottom sheet styles without
  // conflicting inline position styles. The bottom sheet CSS handles positioning.
  const shouldInline = isMobile;

  return {
    dialogContent: shouldInline ? null : dialogContent,
    shouldInline,
  };
}