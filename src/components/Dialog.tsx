import {
  useRef,
  useEffect,
  useCallback,
  useId,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useScrollbarSync } from '../hooks/useScrollbarSync';
import { useDialogState } from '../hooks/useDialogState';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { cx } from '../lib/cx';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogPadding = 'none' | 'sm' | 'md' | 'lg';
export type DialogPlacement =
  | 'center'
  | 'top' | 'right' | 'bottom' | 'left'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  | 'top-half' | 'right-half' | 'bottom-half' | 'left-half';

export interface DialogProps {
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
  /** When true, the dialog will be displayed in fullscreen mode. Default: false */
  fullscreen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

// ── Dialog Context ──────────────────────────────────────────────────────────

interface DialogContextValue {
  close: () => void;
  contentRef: RefObject<HTMLDivElement | null>;
}

import { createContext, useContext } from 'react';

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('DialogClose must be used within a Dialog component');
  }
  return ctx;
}

// ── DialogBody ──────────────────────────────────────────────────────────────

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

// ── DialogClose ─────────────────────────────────────────────────────────────

export interface DialogCloseProps {
  asChild?: boolean;
  children: ReactNode;
  onClick?: (e: ReactMouseEvent | ReactKeyboardEvent) => void;
  className?: string;
  [key: string]: unknown;
}

/**
 * Wraps any child element so that clicking it closes the parent Dialog.
 * Usage: <DialogClose asChild><Button>Cancel</Button></DialogClose>
 */
export function DialogClose({ asChild, children, onClick, className, ...rest }: DialogCloseProps) {
  const { close } = useDialogContext();

  const handleClick = useCallback(
    (e: ReactMouseEvent | ReactKeyboardEvent) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        close();
      }
    },
    [close, onClick],
  );

  if (asChild) {
    const child = Children.only(children) as ReactElement<Record<string, unknown>>;
    const mergedProps: Record<string, unknown> = {
      ...rest,
      onClick: (e: ReactMouseEvent | ReactKeyboardEvent) => {
        const existingOnClick = child.props.onClick as ((e: unknown) => void) | undefined;
        existingOnClick?.(e);
        if (!e.defaultPrevented) {
          handleClick(e);
        }
      },
    };
    return cloneElement(child, mergedProps);
  }

  return (
    <button type="button" className={className} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

// ── Trigger helper ──────────────────────────────────────────────────────────

function TriggerWrapper({
  trigger,
  onOpen,
}: {
  trigger: ReactNode;
  onOpen: () => void;
}) {
  if (isValidElement(trigger)) {
    const el = trigger as ReactElement<Record<string, unknown>>;
    return cloneElement(el, {
      onClick: (e: ReactMouseEvent) => {
        const existingOnClick = el.props.onClick as ((e: unknown) => void) | undefined;
        existingOnClick?.(e);
        if (!e.defaultPrevented) {
          onOpen();
        }
      },
    } as Record<string, unknown>);
  }
  return (
    <button type="button" onClick={onOpen}>
      {trigger}
    </button>
  );
}

// ── Main Dialog component ───────────────────────────────────────────────────

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
  fullscreen = false,
  open: openProp,
  defaultOpen,
  onOpenChange,
}: DialogProps) {
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

  // Escape key handling with dropdown conflict detection
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      const el = contentRef.current;
      if (!el) return;

      const hasOpenInline = Boolean(el.querySelector(
        '.vx-select__dropdown, .vx-multiselect__dropdown, .vx-datepicker__popover, .vx-timepicker__popover, .vx-colorpicker__panel',
      ));
      const hasOpenPortal = el.dataset.hasOpenPortal === '1';
      if (hasOpenInline || hasOpenPortal) {
        e.preventDefault();
        return;
      }

      close();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Click outside handling
  const handleOverlayClick = useCallback(
    (e: ReactMouseEvent) => {
      // Only close if the click is directly on the overlay, not on the content
      if (e.target !== e.currentTarget) return;

      const el = contentRef.current;
      if (el?.dataset.hasOpenPortal === '1' || el?.dataset.hasOpenBottomSheet === '1') {
        return;
      }

      close();
    },
    [close],
  );

  const contextValue: DialogContextValue = { close, contentRef };

  return (
    <>
      <TriggerWrapper trigger={trigger} onOpen={open} />

      {isOpen &&
        createPortal(
          <DialogContext.Provider value={contextValue}>
            <div
              className="vx-dialog__overlay"
              onClick={handleOverlayClick}
              onPointerDown={(e) => {
                // Prevent pointer-down outside when portaled dropdown or BottomSheet is open
                const el = contentRef.current;
                if (el?.dataset.hasOpenPortal === '1' || el?.dataset.hasOpenBottomSheet === '1') {
                  e.preventDefault();
                }
              }}
            />
            <div
              ref={contentRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descId : undefined}
              tabIndex={-1}
              className={cx(
                'vx-dialog__content',
                fullscreen && 'vx-dialog__content--fullscreen',
                size !== 'md' && `vx-dialog__content--${size}`,
                placement !== 'center' && `vx-dialog__content--${placement}`,
                padding && `vx-dialog__content--pad-${padding}`,
                scrollable && 'vx-dialog__content--scrollable',
                className,
              )}
            >
              <div className="vx-dialog__header">
                <div>
                  <h2 id={titleId} className="vx-dialog__title">
                    {title}
                  </h2>
                  {description ? (
                    <p id={descId} className="vx-dialog__description">
                      {description}
                    </p>
                  ) : null}
                </div>
                {closable ? (
                  <button
                    type="button"
                    className="vx-dialog__close"
                    aria-label="Close dialog"
                    onClick={close}
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>
              <DialogBody scrollable={scrollable}>{children}</DialogBody>
              {footer ? <div className="vx-dialog__footer">{footer}</div> : null}
            </div>
          </DialogContext.Provider>,
          document.body,
        )}
    </>
  );
}
