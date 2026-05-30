/**
 * VXUIProvider — 组合多个 Provider 的便捷组件。
 * 
 * 将 ThemeProvider、ViewportProvider、ToastProvider 组合为一个，
 * 减少应用入口处的 Provider 嵌套。
 * 
 * 用法：
 * ```tsx
 * import { VXUIProvider } from 'vxui-react';
 * 
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <VXUIProvider>
 *     <App />
 *   </VXUIProvider>,
 * );
 * ```
 */

import type { ReactNode } from 'react';
import { ThemeProvider, type ThemeRegistry } from '../components/ThemeProvider';
import { ViewportProvider } from './viewport';
import { ToastProvider } from '../components/Toast';

export interface VXUIProviderProps {
  children: ReactNode;
  /**
   * 主题配置，传递给 ThemeProvider。
   * 包含预设主题和自定义主题。
   */
  themes?: ThemeRegistry;
  /** 默认主题名称 */
  defaultTheme?: string;
  /** localStorage 存储键名 */
  storageKey?: string;
}

/**
 * 组合 Provider，一次性挂载 ThemeProvider、ViewportProvider、ToastProvider。
 * 
 * 等价于：
 * ```tsx
 * <ThemeProvider themes={themes} defaultTheme={defaultTheme}>
 *   <ViewportProvider>
 *     <ToastProvider>
 *       {children}
 *     </ToastProvider>
 *   </ViewportProvider>
 * </ThemeProvider>
 * ```
 */
export function VXUIProvider({
  children,
  themes,
  defaultTheme,
  storageKey,
}: VXUIProviderProps) {
  return (
    <ThemeProvider themes={themes} defaultTheme={defaultTheme} storageKey={storageKey}>
      <ViewportProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ViewportProvider>
    </ThemeProvider>
  );
}
