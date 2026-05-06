import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';

type ToastTone = 'info' | 'success' | 'warning' | 'danger';

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  push: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextToastId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      push: (toast) => {
        setItems((current) => [...current, { id: nextToastId += 1, tone: 'info', ...toast }]);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {items.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            className={cx('vx-toast', `vx-toast--${item.tone ?? 'info'}`)}
            duration={4500}
            open
            onOpenChange={(open) => {
              if (!open) {
                setItems((current) => current.filter((candidate) => candidate.id !== item.id));
              }
            }}
          >
            <div className="vx-toast__content">
              <ToastPrimitive.Title className="vx-toast__title">{item.title}</ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="vx-toast__description">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close className="vx-toast__close" aria-label="Dismiss notification">
              <X size={16} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="vx-toast__viewport" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
}
