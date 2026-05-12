import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';
import { useIsMobile } from '../hooks/useIsMobile';
import { Sheet } from './Sheet';

export interface DialogProps extends Pick<DialogPrimitive.DialogProps, 'defaultOpen' | 'onOpenChange' | 'open'> {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
  className,
  ...props
}: DialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet
        trigger={trigger}
        title={title}
        description={description}
        side="bottom"
        footer={footer}
        className={cx('vx-dialog--mobile-sheet', className)}
        {...props}
      >
        {children}
      </Sheet>
    );
  }

  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="vx-dialog__overlay" />
        <DialogPrimitive.Content className={cx('vx-dialog__content', className)}>
          <div className="vx-dialog__header">
            <div>
              <DialogPrimitive.Title className="vx-dialog__title">{title}</DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="vx-dialog__description">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close className="vx-dialog__close" aria-label="Close dialog">
              <X size={16} />
            </DialogPrimitive.Close>
          </div>
          <div className="vx-dialog__body">{children}</div>
          {footer ? <div className="vx-dialog__footer">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
