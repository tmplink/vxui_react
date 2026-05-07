import { Globe } from 'lucide-react';
import { useI18n, locales } from '../i18n';
import { cx } from '../lib/cx';

export interface LanguageSwitcherProps {
  /**
   * `"inline"` — compact segmented pill for the topbar
   * `"sidebar"` — full-width row for the sidebar footer
   */
  variant?: 'inline' | 'sidebar';
  className?: string;
}

export function LanguageSwitcher({ variant = 'inline', className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const entries = Object.entries(locales);

  if (variant === 'sidebar') {
    return (
      <div className={cx('vx-lang-sidebar', className)}>
        <Globe size={15} className="vx-lang-sidebar__icon" />
        <div className="vx-lang-sidebar__options">
          {entries.map(([key, loc]) => (
            <button
              key={key}
              type="button"
              className={cx(
                'vx-lang-sidebar__btn',
                locale === key && 'vx-lang-sidebar__btn--active',
              )}
              onClick={() => setLocale(key)}
              aria-pressed={locale === key}
              aria-label={`Switch to ${loc.label}`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // inline (topbar) variant
  return (
    <div className={cx('vx-lang-inline', className)} role="group" aria-label="Language">
      {entries.map(([key, loc]) => (
        <button
          key={key}
          type="button"
          className={cx(
            'vx-lang-inline__btn',
            locale === key && 'vx-lang-inline__btn--active',
          )}
          onClick={() => setLocale(key)}
          aria-pressed={locale === key}
          aria-label={`Switch to ${loc.label}`}
        >
          {key === entries[0][0] && <Globe size={13} aria-hidden="true" />}
          {loc.label}
        </button>
      ))}
    </div>
  );
}
