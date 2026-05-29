import {
  useRef,
  useCallback,
  type ReactNode,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useSheetState } from './useSheetState';
import { SheetPanel, SheetActionItem, type SheetSide } from './SheetPanel';

export type { SheetSide } from './SheetPanel';
export type { SheetActionItemProps } from './SheetPanel';

export type SheetVariant = 'default' | 'action';

export interface SheetProps {
  // ─── 基础 ───
  trigger?: ReactNode;
  children: ReactNode;
  side?: SheetSide;
  variant?: SheetVariant;

  // ─── 标题/描述 ───
  title?: ReactNode;
  description?: ReactNode;

  // ─── 插槽 ───
  header?: ReactNode;
  footer?: ReactNode;

  // ─── 控制 ───
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // ─── 行为 ───
  showClose?: boolean;
  showConfirm?: boolean;
  confirmText?: string;
  confirmDisabled?: boolean;
  onConfirm?: () => void;

  // ─── 样式 ───
  className?: string;
  width?: number;
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
  variant = 'default',
  children,
  header,
  footer,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  showClose = true,
  showConfirm = false,
  confirmText = '确认',
  confirmDisabled = false,
  onConfirm,
  width,
}: SheetProps) {
  const { isOpen, phase, open, close } = useSheetState({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  return (
    <>
      {trigger ? <TriggerWrapper trigger={trigger} onOpen={open} /> : null}

      <SheetPanel
        side={side}
        phase={phase}
        title={title}
        description={description}
        header={header}
        footer={footer}
        className={className}
        showClose={variant === 'action' ? false : showClose}
        showConfirm={showConfirm}
        confirmText={confirmText}
        confirmDisabled={confirmDisabled}
        onConfirm={onConfirm}
        onClose={close}
        action={variant === 'action'}
        width={width}
      >
        {children}
      </SheetPanel>
    </>
  );
}

// ── 命名导出子组件 ─────────────────────────────────────────────────────────

Sheet.Item = SheetActionItem;
