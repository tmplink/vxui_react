import {
  useRef,
  useEffect,
  useCallback,
  useId,
  type ReactNode,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useDialogState } from '../hooks/useDialogState';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { cx } from '../lib/cx';
import { Button } from './Button';

export interface AlertDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'danger';
  className?: string;
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

// ── Element helpers ─────────────────────────────────────────────────────────

function isValidElementWithRef(node: unknown): node is ReactElement & { ref?: unknown } {
  return (
    node !== null &&
    node !== undefined &&
    typeof node === 'object' &&
    'type' in node &&
    'props' in node
  );
}

function cloneElementWithProps(
  element: ReactElement,
  extraProps: Record<string, unknown>,
): ReactElement {
  const { onClick: existingOnClick, ...existingProps } = element.props as Record<string, unknown>;

  const mergedOnClick = (e: ReactMouseEvent) => {
    if (typeof existingOnClick === 'function') {
      existingOnClick(e);
    }
    if (typeof extraProps.onClick === 'function') {
      (extraProps.onClick as (e: ReactMouseEvent) => void)(e);
    }
  };

  return {
    ...element,
    props: {
      ...existingProps,
      ...extraProps,
      onClick: mergedOnClick,
    },
  };
}

function TriggerWrapper({
  trigger,
  onOpen,
}: {
  trigger: ReactNode;
  onOpen: () => void;
}) {
  if (isValidElementWithRef(trigger)) {
    return cloneElementWithProps(trigger, { onClick: onOpen });
  }
  return (
    <button type="button" onClick={onOpen}>
      {trigger}
    </button>
  );
}

// ── Main AlertDialog component ──────────────────────────────────────────────

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
  open: openProp,
  defaultOpen,
  onOpenChange,
}: AlertDialogProps) {
  const { isOpen, open, close } = useDialogState({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useBodyScrollLock(isOpen);
  useFocusTrap(contentRef, { active: isOpen });

  // Escape key closes the alert dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Click overlay to close
  const handleOverlayClick = useCallback(
    (e: ReactMouseEvent) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close],
  );

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    close();
  }, [onConfirm, close]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    close();
  }, [onCancel, close]);

  return (
    <>
      <TriggerWrapper trigger={trigger} onOpen={open} />

      {isOpen &&
        createPortal(
          <>
            <div className="vx-dialog__overlay" onClick={handleOverlayClick} />
            <div
              ref={contentRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descId : undefined}
              tabIndex={-1}
              className={cx('vx-alert-dialog__content', className)}
            >
              <h2 id={titleId} className="vx-alert-dialog__title">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="vx-alert-dialog__description">
                  {description}
                </p>
              ) : null}
              <div className="vx-alert-dialog__footer">
                <Button variant="secondary" onClick={handleCancel}>
                  {cancelLabel}
                </Button>
                <Button variant={variant === 'danger' ? 'danger' : 'solid'} onClick={handleConfirm}>
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
