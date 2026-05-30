/**
 * Unified breakpoint constants shared between JS and CSS.
 *
 * ── 断点系统说明 ─────────────────────────────────────────────
 *
 * 本系统有两套断点，用途不同，请勿混淆：
 *
 * 1. CSS 布局断点 (CSS Media Query Breakpoints)
 *    ──────────────────────────────────────────
 *    用于控制页面布局在不同视口宽度下的表现。
 *    sm: 640px  — 手机布局断点
 *    md: 768px  — 平板布局断点
 *    lg: 1000px — 桌面布局断点
 *
 *    这些值必须与 CSS 变量保持一致：
 *      --vx-breakpoint-sm: 640px
 *      --vx-breakpoint-md: 768px
 *      --vx-breakpoint-lg: 1000px
 *
 * 2. 设备检测断点 (Device Detection Breakpoints)
 *    ──────────────────────────────────────────
 *    用于 JS 端判断设备类型（phone / tablet / desktop）。
 *    基于物理屏幕尺寸（window.screen.width），而非视口宽度。
 *    PHONE_MAX_WIDTH = 1000
 *
 *    为什么设备检测使用 1000px 而不是 640px？
 *    - 物理屏幕宽度 ≤ 1000px 的设备可能是手机或平板
 *    - 物理屏幕宽度 > 1000px 的肯定是桌面显示器
 *    - 手机和平板的区分通过宽高比（aspect ratio）实现
 *    - 这样可以避免桌面浏览器窗口缩小时被误判为手机
 *
 * 3. 为什么 CSS 布局断点用 640px 而设备检测用 1000px？
 *    ──────────────────────────────────────────
 *    CSS 媒体查询基于视口宽度（viewport width），
 *    而设备检测基于物理屏幕宽度（screen.width）。
 *    两者是不同的概念：
 *    - 一个 1024px 物理宽度的平板，在分屏模式下视口可能只有 512px
 *    - CSS 需要在视口 640px 时就切换到手机布局
 *    - 但设备检测仍应识别为平板（物理宽度 > 640px）
 *
 *    因此这两套断点值不同是合理的，不需要强行统一。
 *    关键是要在代码中明确区分它们的用途。
 *
 * ─────────────────────────────────────────────────────────────
 */

export const BREAKPOINTS = {
  /** CSS 布局断点 - 手机布局 (max-width: 640px) */
  sm: 640,
  /** CSS 布局断点 - 平板布局 (max-width: 768px) */
  md: 768,
  /** CSS 布局断点 - 桌面布局 (min-width: 1000px) */
  lg: 1000,
} as const;

/**
 * 设备检测 - 物理屏幕宽度阈值。
 * 物理宽度 ≤ PHONE_MAX_WIDTH 的设备可能是手机或平板，
 * 具体通过宽高比进一步区分。
 */
export const PHONE_MAX_WIDTH = BREAKPOINTS.lg;

/** 宽高比阈值：低于此值判定为手机（窄屏设备） */
export const PHONE_ASPECT_RATIO_THRESHOLD = 0.7;

/** 宽高比阈值：低于此值且宽度 ≤ PHONE_MAX_WIDTH 判定为手机 */
export const TABLET_ASPECT_RATIO_THRESHOLD = 0.75;
