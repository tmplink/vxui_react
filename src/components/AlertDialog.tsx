import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cx } from '../lib/cx';
import { Button } from './Button';
import { useIsMobile } from '../hooks/useIsMobile';
import { Sheet } from './Sheet';

export interface AlertDialogProps
  extends Pick<DialogPrimitive.DialogProps, 'defaultOpen' | 'onOpenChange' | 'open'> {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'danger';
  className?: string;
}

export function AlertDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  className,
  ...props
}: AlertDialogProps) {
  const isMobile = useIsMobile();

  const footer = (
    <div className="vx-alert-dialog__footer">
      <DialogPrimitive.Close asChild>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </DialogPrimitive.Close>
      <DialogPrimitive.Close asChild>
        <Button variant={variant === 'danger' ? 'danger' : 'solid'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogPrimitive.Close>
    </div>
  );

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
        {null}
      </Sheet>
    );
  }

  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="vx-dialog__overlay" />
        <DialogPrimitive.Content
          className={cx('vx-alert-dialog__content', className)}
          role="alertdialog"
          aria-modal="true"
        >
          <DialogPrimitive.Title className="vx-alert-dialog__title">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="vx-alert-dialog__description">
              {description}
            </DialogPrimitive.Description>
          ) : null}
          {footer}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
