import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetProps
  extends Pick<DialogPrimitive.DialogProps, 'defaultOpen' | 'onOpenChange' | 'open'> {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  side?: SheetSide;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Sheet({
  trigger,
  title,
  description,
  side = 'right',
  children,
  footer,
  className,
  ...props
}: SheetProps) {
  return (
    <DialogPrimitive.Root {...props}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="vx-sheet__overlay" />
        <DialogPrimitive.Content className={cx('vx-sheet', `vx-sheet--${side}`, className)}>
          <div className="vx-sheet__header">
            <div>
              {title ? (
                <DialogPrimitive.Title className="vx-sheet__title">{title}</DialogPrimitive.Title>
              ) : null}
              {description ? (
                <DialogPrimitive.Description className="vx-sheet__description">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close className="vx-dialog__close" aria-label="Close">
              <X size={16} />
            </DialogPrimitive.Close>
          </div>
          <div className="vx-sheet__body">{children}</div>
          {footer ? <div className="vx-sheet__footer">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
