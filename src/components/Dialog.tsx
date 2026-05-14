import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogPadding = 'none' | 'sm' | 'md' | 'lg';

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
  /** Allow the body to scroll when content overflows. Default: false */
  scrollable?: boolean;
  /** Show the close (×) button. Default: true */
  closable?: boolean;
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
  scrollable = false,
  closable = true,
  ...props
}: DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="vx-dialog__overlay" />
        <DialogPrimitive.Content
          className={cx(
            'vx-dialog__content',
            size !== 'md' && `vx-dialog__content--${size}`,
            padding && `vx-dialog__content--pad-${padding}`,
            scrollable && 'vx-dialog__content--scrollable',
            className,
          )}
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
          <div className="vx-dialog__body">{children}</div>
          {footer ? <div className="vx-dialog__footer">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
