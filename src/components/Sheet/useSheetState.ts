import { useState, useCallback, useEffect, useRef } from 'react';
import { useDialogState } from '../../hooks/useDialogState';

export type SheetPhase = 'hidden' | 'visible' | 'exiting';

export interface UseSheetStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseSheetStateReturn {
  /** 当前是否在视觉上可见 */
  isVisible: boolean;
  /** 当前动画阶段 */
  phase: SheetPhase;
  /** 打开 */
  open: () => void;
  /** 关闭（启动退出动画） */
  close: () => void;
  /** dialog 状态：是否逻辑上已打开 */
  isOpen: boolean;
}

/**
 * Sheet 状态管理 hook
 *
 * 三阶段：hidden → visible → exiting → hidden
 *
 * - visible: 组件可见，入场 animation 已在挂载时自动播放完毕
 * - exiting: 用户触发关闭，CSS animation 播放退场动画
 * - hidden: 退场动画完成，组件卸载
 *
 * 关闭流程统一由 isOpen 驱动：
 *   close() → dialogClose() → isOpen=false → useEffect → setPhase('exiting')
 *   → setTimeout → setPhase('hidden')
 *
 * 避免重复触发：使用 ref 标记是否正在退出，防止 isOpen 变化重复触发。
 */
export function useSheetState(props: UseSheetStateProps): UseSheetStateReturn {
  const { isOpen, open: dialogOpen, close: dialogClose } = useDialogState(props);
  const [phase, setPhase] = useState<SheetPhase>('hidden');
  const exitingRef = useRef(false);

  // isOpen 变化驱动阶段转换
  useEffect(() => {
    if (isOpen) {
      // 打开：设为 visible，CSS animation 在挂载时自动播放
      exitingRef.current = false;
      setPhase('visible');
    } else if (!exitingRef.current) {
      // 关闭：启动退出动画（仅执行一次）
      exitingRef.current = true;
      setPhase('exiting');
    }
  }, [isOpen]);

  // 退出动画完成后清理
  useEffect(() => {
    if (phase === 'exiting') {
      const timer = setTimeout(() => {
        setPhase('hidden');
        exitingRef.current = false;
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const isVisible = phase !== 'hidden';

  const close = useCallback(() => {
    dialogClose();
  }, [dialogClose]);

  return {
    isVisible,
    phase,
    open: dialogOpen,
    close,
    isOpen,
  };
}
