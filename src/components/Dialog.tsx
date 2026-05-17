import { useRef, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useScrollbarSync } from '../hooks/useScrollbarSync';
import { cx } from '../lib/cx';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogPadding = 'none' | 'sm' | 'md' | 'lg';
export type DialogPlacement =
  | 'center'
  | 'top' | 'right' | 'bottom' | 'left'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  | 'top-half' | 'right-half' | 'bottom-half' | 'left-half';

export interface DialogProps extends Pick<DialogPrimitive.DialogProps, 'defaultOpen' | 'onOpenChange' | 'open'> {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Dialog width preset. Default: 'md' */
  size?: DialogSize;
  /** Inner padding preset. Default: 'md' */
  padding?: DialogPadding;
  /** Dialog placement preset. Default: 'center' */
  placement?: DialogPlacement;
  /** Allow the body to scroll when content overflows. Default: true */
  scrollable?: boolean;
  /** Show the close (×) button. Default: true */
  closable?: boolean;
}

function DialogBody({ children, scrollable }: { children: ReactNode; scrollable: boolean }) {
  const scrollHostRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useScrollbarSync(scrollHostRef, scrollRef, scrollable);

  return (
    <div
      ref={scrollHostRef}
      className="vx-dialog__body-wrap vx-scroll-host"
      data-scrollable="false"
      data-scrollbar-state="hidden"
    >
      <div ref={scrollRef} className={cx('vx-dialog__body', scrollable && 'vx-scroll-hide-native')}>
        {children}
      </div>
      {scrollable ? (
        <span className="vx-overlay-scrollbar" aria-hidden="true">
          <span className="vx-overlay-scrollbar__thumb" />
        </span>
      ) : null}
    </div>
  );
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
  padding,
  placement = 'center',
  scrollable = true,
  closable = true,
  ...props
}: DialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="vx-dialog__overlay" />
        <DialogPrimitive.Content
          ref={contentRef}
          className={cx(
            'vx-dialog__content',
            size !== 'md' && `vx-dialog__content--${size}`,
            placement !== 'center' && `vx-dialog__content--${placement}`,
            padding && `vx-dialog__content--pad-${padding}`,
            scrollable && 'vx-dialog__content--scrollable',
            className,
          )}
          onEscapeKeyDown={(e) => {
            // Radix registers at document-level; use our ref to query the actual content element.
            const el = contentRef.current;
            if (!el) return;
            const hasOpenInline = Boolean(el.querySelector(
              '.vx-select__dropdown, .vx-multiselect__dropdown, .vx-datepicker__popover, .vx-timepicker__popover, .vx-colorpicker__panel',
            ));
            const hasOpenPortal = el.dataset.hasOpenPortal === '1';
            if (hasOpenInline || hasOpenPortal) {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            // Prevent the dialog from closing when a pointer-down event happens inside
            // a portaled dropdown (Select / MultiSelect) that belongs to this dialog.
            const el = contentRef.current;
            if (el?.dataset.hasOpenPortal === '1') {
              e.preventDefault();
            }
          }}
        >
          <div className="vx-dialog__header">
            <div>
              <DialogPrimitive.Title className="vx-dialog__title">{title}</DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="vx-dialog__description">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            {closable ? (
              <DialogPrimitive.Close className="vx-dialog__close" aria-label="Close dialog">
                <X size={16} />
              </DialogPrimitive.Close>
            ) : null}
          </div>
          <DialogBody scrollable={scrollable}>{children}</DialogBody>
          {footer ? <div className="vx-dialog__footer">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * Wraps any child element so that clicking it closes the parent Dialog.
 * Usage: <DialogClose asChild><Button>Cancel</Button></DialogClose>
 */
export const DialogClose = DialogPrimitive.Close;
