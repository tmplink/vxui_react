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
import { X } from 'lucide-react';
import { useDialogState } from '../hooks/useDialogState';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { cx } from '../lib/cx';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetProps {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  side?: SheetSide;
  children: ReactNode;
  footer?: ReactNode;
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

// ── Main Sheet component ────────────────────────────────────────────────────

export function Sheet({
  trigger,
  title,
  description,
  side = 'right',
  children,
  footer,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
}: SheetProps) {
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

  // Escape key closes the sheet
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

  return (
    <>
      {trigger ? <TriggerWrapper trigger={trigger} onOpen={open} /> : null}

      {isOpen &&
        createPortal(
          <>
            <div className="vx-sheet__overlay" onClick={handleOverlayClick} />
            <div
              ref={contentRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descId : undefined}
              tabIndex={-1}
              className={cx('vx-sheet', `vx-sheet--${side}`, className)}
            >
              <div className="vx-sheet__header">
                <div>
                  {title ? (
                    <h2 id={titleId} className="vx-sheet__title">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id={descId} className="vx-sheet__description">
                      {description}
                    </p>
                  ) : null}
                </div>
                <button type="button" className="vx-dialog__close" aria-label="Close" onClick={close}>
                  <X size={16} />
                </button>
              </div>
              <div className="vx-sheet__body">{children}</div>
              {footer ? <div className="vx-sheet__footer">{footer}</div> : null}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
