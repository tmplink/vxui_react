import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cx } from '../lib/cx';

type NotificationTone = 'info' | 'success' | 'warning' | 'danger';
type NotificationPlacement =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

interface NotificationInput {
  title: string;
  description?: string;
  tone?: NotificationTone;
  /** Auto-dismiss duration in ms. 0 = persistent (manual dismiss). Default: 0 */
  duration?: number;
  /** Custom action node rendered at the bottom-right of the notification */
  action?: ReactNode;
}

interface NotificationItem extends NotificationInput {
  id: number;
}

interface NotificationContextValue {
  /** Push a new notification. Returns the notification id for programmatic dismiss. */
  push: (notification: NotificationInput) => number;
  /** Dismiss a notification by id. */
  dismiss: (id: number) => void;
  /** Dismiss all notifications. */
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

let nextId = 1;

const TONE_ICONS: Record<NotificationTone, ReactNode> = {
  info: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  warning: <AlertTriangle size={16} />,
  danger: <AlertCircle size={16} />,
};

export interface NotificationProviderProps {
  children: ReactNode;
  /** Placement of the notification stack. Default: 'top-right' */
  placement?: NotificationPlacement;
  /** Maximum number of visible notifications. Default: 5 */
  maxCount?: number;
}

export function NotificationProvider({
  children,
  placement = 'top-right',
  maxCount = 5,
}: NotificationProviderProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const push = useCallback(
    (notification: NotificationInput): number => {
      const id = (nextId += 1);
      const item: NotificationItem = {
        tone: 'info',
        duration: 0,
        ...notification,
        id,
      };

      setItems((prev) => {
        const next = [...prev, item];
        // Trim oldest if exceeds max
        return next.length > maxCount ? next.slice(next.length - maxCount) : next;
      });

      // Auto-dismiss if duration > 0
      if (item.duration && item.duration > 0) {
        setTimeout(() => dismiss(id), item.duration);
      }

      return id;
    },
    [maxCount, dismiss],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({ push, dismiss, clear }),
    [push, dismiss, clear],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {items.length > 0 &&
        createPortal(
          <div
            className={cx('vx-notification-stack', `vx-notification-stack--${placement}`)}
            role="region"
            aria-label="通知"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={cx(
                  'vx-notification',
                  `vx-notification--${item.tone ?? 'info'}`,
                )}
                role="alert"
                aria-live="polite"
              >
                <div className="vx-notification__icon" aria-hidden="true">
                  {TONE_ICONS[item.tone ?? 'info']}
                </div>
                <div className="vx-notification__body">
                  <p className="vx-notification__title">{item.title}</p>
                  {item.description && (
                    <p className="vx-notification__description">{item.description}</p>
                  )}
                  {item.action && (
                    <div className="vx-notification__action">{item.action}</div>
                  )}
                </div>
                <button
                  type="button"
                  className="vx-notification__close"
                  aria-label="关闭通知"
                  onClick={() => dismiss(item.id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider.');
  }
  return context;
}
