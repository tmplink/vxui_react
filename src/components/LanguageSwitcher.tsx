import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useI18n, locales } from '../i18n';
import { cx } from '../lib/cx';

export interface LanguageSwitcherProps {
  /**
   * `"inline"` — compact dropdown for the topbar / public nav
   * `"sidebar"` — full-width dropdown for the sidebar footer
   */
  variant?: 'inline' | 'sidebar';
  className?: string;
}

export function LanguageSwitcher({ variant = 'inline', className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const entries = Object.entries(locales);
  const current = locales[locale];

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const isSidebar = variant === 'sidebar';

  return (
    <div
      ref={ref}
      className={cx(
        'vx-lang-drop',
        isSidebar && 'vx-lang-drop--sidebar',
        open && 'vx-lang-drop--open',
        className,
      )}
    >
      <button
        type="button"
        className="vx-lang-drop__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
      >
        <Globe size={13} aria-hidden="true" />
        <span>{current?.label ?? locale}</span>
        <ChevronDown size={12} className="vx-lang-drop__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul className="vx-lang-drop__menu" role="listbox" aria-label="Language">
          {entries.map(([key, loc]) => (
            <li key={key} role="option" aria-selected={locale === key}>
              <button
                type="button"
                className={cx('vx-lang-drop__item', locale === key && 'vx-lang-drop__item--active')}
                onClick={() => { setLocale(key); setOpen(false); }}
              >
                {loc.label}
                {locale === key && <span className="vx-lang-drop__check" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
