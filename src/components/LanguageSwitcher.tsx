import { Globe } from 'lucide-react';
import { useI18n, locales } from '../i18n';
import { Select } from './Select';
import type { SelectOption } from './Select';

export interface LanguageSwitcherProps {
  /**
   * `"inline"` — compact dropdown for the topbar / public nav
   * `"sidebar"` — full-width dropdown for the sidebar footer
   */
  variant?: 'inline' | 'sidebar';
  className?: string;
}

const languageOptions: SelectOption[] = Object.entries(locales).map(([key, loc]) => ({
  value: key,
  label: loc.label,
}));

export function LanguageSwitcher({ variant = 'inline', className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <Select
      options={languageOptions}
      value={locale}
      onChange={(value) => { if (value) setLocale(value); }}
      placeholder="Language"
      searchable={false}
      clearable={false}
      className={[
        'vx-lang-switcher',
        variant === 'sidebar' && 'vx-lang-switcher--sidebar',
        className,
      ].filter(Boolean).join(' ').trim()}
      mobileSheet={null}
    />
  );
}
