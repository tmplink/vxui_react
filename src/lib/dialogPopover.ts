const DIALOG_CONTENT_SELECTOR = '.vx-dialog__content';
const MOBILE_INLINE_QUERY = '(max-width: 640px)';

export function getDialogPopoverContext(node: HTMLElement | null) {
  const dialogContent = node?.closest<HTMLElement>(DIALOG_CONTENT_SELECTOR) ?? null;
  const shouldInline = window.matchMedia(MOBILE_INLINE_QUERY).matches && !dialogContent;

  return {
    dialogContent,
    shouldInline,
  };
}