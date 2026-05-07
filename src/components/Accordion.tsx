import type { ReactNode } from 'react';
import { useState } from 'react';
import { cx } from '../lib/cx';

export interface AccordionItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({ items, multiple = false, defaultOpen = [], className }: AccordionProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpen));

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className={cx('vx-accordion', className)}>
      {items.map((item) => {
        const open = openKeys.has(item.key);
        return (
          <div key={item.key} className={cx('vx-accordion__item', open && 'vx-accordion__item--open', item.disabled && 'vx-accordion__item--disabled')}>
            <button
              type="button"
              disabled={item.disabled}
              aria-expanded={open}
              className="vx-accordion__trigger"
              onClick={() => !item.disabled && toggle(item.key)}
            >
              <span className="vx-accordion__title">{item.title}</span>
              <span className="vx-accordion__chevron" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {open ? <div className="vx-accordion__content">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
