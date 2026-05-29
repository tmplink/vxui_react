import { useEffect, useRef, useState, useCallback, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';

type Phase = 'hidden' | 'entering' | 'visible' | 'exiting';

export interface BottomSheetProps {
  /** 是否打开（上层只能设为 true 来打开，关闭由 BottomSheet 自主控制） */
  open: boolean;
  /** 当 BottomSheet 完成关闭动画后的回调（用于上层清理 open 状态） */
  onClose?: () => void;
  /** 标题 */
  title?: ReactNode;
  /** 描述 */
  description?: ReactNode;
  /** 是否显示拖动把手，默认 true */
  draggable?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 内容区域 */
  children: ReactNode;
  /** 是否在 Dialog 内渲染到 dialogContent 中，默认 false */
  inlineInDialog?: boolean;
  /** 是否显示确认按钮，默认 false */
  showConfirm?: boolean;
  /** 确认按钮文字，默认 "确认" */
  confirmText?: string;
  /** 确认按钮是否禁用 */
  confirmDisabled?: boolean;
  /** 用户点击确认按钮的回调 */
  onConfirm?: () => void;
}

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  draggable = true,
  className,
  children,
  inlineInDialog = false,
  showConfirm = false,
  confirmText = '确认',
  confirmDisabled = false,
  onConfirm,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const [dragging, setDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const draggedRef = useRef<number>(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // ─── 状态机：自主管理动画生命周期 ────────────────────────────────
  const [phase, setPhase] = useState<Phase>('hidden');
  // 标记 entering 阶段是否已经渲染了初始状态（translateY(100%)）
  const initialRenderRef = useRef(false);

  // open 从 false → true：启动进入动画
  useEffect(() => {
    if (open && phase === 'hidden') {
      initialRenderRef.current = false;
      setPhase('entering');
    }
  }, [open, phase]);

  // 当 phase 变为 entering 时，先用 layout effect 确保 DOM 已渲染 translateY(100%)
  // 然后再切换到 visible 触发 transition
  useLayoutEffect(() => {
    if (phase === 'entering' && !initialRenderRef.current) {
      // 标记初始渲染已完成，下一帧切换到 visible
      initialRenderRef.current = true;
      requestAnimationFrame(() => {
        setPhase('visible');
      });
    }
  }, [phase]);

  // 关闭流程：启动退出动画 → 动画结束后回调
  // 允许从 entering 或 visible 阶段启动退出（用户在进入动画中点击关闭按钮）
  const startExiting = useCallback(() => {
    if (phase !== 'visible' && phase !== 'entering') return;
    setPhase('exiting');
    setDragging(false);
  }, [phase]);

  // 退出动画完成后通知上层
  useEffect(() => {
    if (phase === 'exiting') {
      const timer = setTimeout(() => {
        setPhase('hidden');
        onCloseRef.current?.();
      }, 280); // 与 CSS 动画时长一致
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 关闭时重置拖拽状态
  useEffect(() => {
    if (phase === 'hidden') {
      setTranslateY(0);
      draggedRef.current = 0;
      setDragging(false);
    }
  }, [phase]);

  // 锁定 body 滚动
  useEffect(() => {
    if (phase === 'entering' || phase === 'visible') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // 标记 Dialog 内容区域
  useEffect(() => {
    if (phase === 'entering' || phase === 'visible') {
      const dialogContent = document.querySelector<HTMLElement>('.vx-dialog__content');
      if (dialogContent) {
        dialogContent.dataset.hasOpenBottomSheet = '1';
        return () => { delete dialogContent.dataset.hasOpenBottomSheet; };
      }
    }
  }, [phase]);

  // ─── 拖拽手势 ──────────────────────────────────────────────────
  const handleRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!draggable) return;
    // 只在 visible 阶段允许拖拽
    if (phase !== 'visible') return;
    // 仅当触摸起点在拖拽手柄上时才启动拖拽
    const handleEl = handleRef.current;
    if (!handleEl) return;
    const touch = e.touches[0];
    // 使用 e.target 替代 elementFromPoint，更可靠
    const target = e.target as Node;
    if (!handleEl.contains(target)) return;
    startYRef.current = touch.clientY;
    draggedRef.current = 0;
    setDragging(true);
  }, [draggable, phase]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggable || !dragging) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta < 0) return; // 不允许向上拖超出原始位置
    draggedRef.current = delta;
    setTranslateY(delta);
  }, [draggable, dragging]);

  const handleTouchEnd = useCallback(() => {
    if (!draggable) return;
    setDragging(false);
    const sheet = sheetRef.current;
    if (!sheet) return;
    const threshold = sheet.offsetHeight * 0.32;
    if (draggedRef.current > threshold) {
      // 拖拽超过阈值 → 关闭
      startExiting();
    } else {
      setTranslateY(0);
    }
  }, [draggable, startExiting]);

  // ─── 确认 / 关闭 ────────────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    onConfirm?.();
    startExiting();
  }, [onConfirm, startExiting]);

  const handleClose = useCallback(() => {
    startExiting();
  }, [startExiting]);

  // ─── 渲染 ───────────────────────────────────────────────────────
  if (phase === 'hidden') return null;

  const showFooter = showConfirm;

  // 计算 sheet 的 translateY：
  // - entering: translateY(100%) — 初始状态，等待 useLayoutEffect 切换到 visible
  // - visible: translateY(0) + 拖拽偏移 — transition 从 100% 过渡到 0
  // - exiting: translateY(100%) — transition 从当前位置过渡到 100%
  const sheetTranslateY =
    phase === 'entering'
      ? '100%'
      : phase === 'exiting'
        ? '100%'
        : `${translateY}px`;

  // entering 阶段：transition 设为 none，因为初始状态就是 translateY(100%)
  // 当 useLayoutEffect 切换到 visible 时，transition 生效从 100% → 0
  // visible 阶段：拖拽时 transition 为 none，否则为 280ms
  // exiting 阶段：transition 从当前位置过渡到 100%
  const sheetTransition =
    phase === 'entering'
      ? 'none'
      : dragging
        ? 'none'
        : 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1)';

  const sheetContent = (
    <div
      className={cx(
        'vxm-bottomsheet__overlay',
        phase === 'entering' && 'vxm-bottomsheet__overlay--entering',
        phase === 'exiting' && 'vxm-bottomsheet__overlay--exiting',
      )}
      // 遮罩层仅做屏蔽，不响应点击关闭
      role="presentation"
    >
      <div
        ref={sheetRef}
        className={cx('vxm-bottomsheet', className)}
        style={{
          transform: `translateY(${sheetTranslateY})`,
          transition: sheetTransition,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal
      >
        {/* 拖动把手 */}
        {draggable && (
          <div ref={handleRef} className="vxm-bottomsheet__handle" aria-hidden="true" />
        )}
        {/* 右上角关闭按钮（始终可见） */}
        <button
          type="button"
          className="vxm-bottomsheet__close"
          onClick={handleClose}
          aria-label="关闭"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {(title || description) && (
          <div className="vxm-bottomsheet__header">
            {title && <h3 className="vxm-bottomsheet__title">{title}</h3>}
            {description && <p className="vxm-bottomsheet__description">{description}</p>}
          </div>
        )}
        <div className="vxm-bottomsheet__body">{children}</div>
        {showFooter && (
          <div className="vxm-bottomsheet__footer">
            {showConfirm && (
              <button
                type="button"
                className="vxm-bottomsheet__confirm"
                disabled={confirmDisabled}
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 移动设备检测：屏幕宽度 ≤ 1000px 且为竖屏
  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 1000 && window.innerHeight > window.innerWidth;
  };

  // 在移动设备上，BottomSheet 应该始终从屏幕最下方全屏弹出
  // 忽略 inlineInDialog 设置，直接渲染到 document.body
  if (inlineInDialog && !isMobileDevice()) {
    const dialogContent = document.querySelector('.vx-dialog__content');
    if (dialogContent) {
      return createPortal(sheetContent, dialogContent);
    }
  }

  return createPortal(sheetContent, document.body);
}
