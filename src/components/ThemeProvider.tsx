import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export type ThemeTokens = Partial<Record<`--vx-${string}`, string>>;

export interface ThemeDefinition {
  label?: string;
  mode: ThemeMode;
  tokens?: ThemeTokens;
}

export type ThemeRegistry = Record<string, ThemeDefinition>;

interface CreateThemeOptions {
  label?: string;
  tokens?: ThemeTokens;
}

const coreThemes = {
  light: {
    label: 'Light',
    mode: 'light',
  },
  dark: {
    label: 'Dark',
    mode: 'dark',
  },
} satisfies ThemeRegistry;

export function createTheme(mode: ThemeMode, options: CreateThemeOptions = {}): ThemeDefinition {
  return {
    label: options.label,
    mode,
    tokens: options.tokens,
  };
}

export const themePresets = {
  ...coreThemes,
  sunset: createTheme('light', {
    label: 'Sunset',
    tokens: {
      '--vx-primary': '#c2410c',
      '--vx-primary-strong': '#9a3412',
      '--vx-primary-soft': 'rgba(194, 65, 12, 0.12)',
      '--vx-secondary': '#9a3412',
      '--vx-bg': '#fff7ed',
      '--vx-bg-accent': '#ffedd5',
      '--vx-surface-hover': '#fffaf5',
      '--vx-border': '#fed7aa',
      '--vx-border-strong': '#fdba74',
      '--vx-text': '#431407',
      '--vx-text-secondary': '#9a3412',
      '--vx-text-muted': '#b45309',
      '--vx-shadow-sm': '0 1px 2px rgba(124, 45, 18, 0.08)',
      '--vx-shadow': '0 14px 32px rgba(124, 45, 18, 0.08)',
      '--vx-shadow-lg': '0 28px 64px rgba(124, 45, 18, 0.12)',
    },
  }),
  mint: createTheme('light', {
    label: 'Mint',
    tokens: {
      '--vx-primary': '#0f766e',
      '--vx-primary-strong': '#115e59',
      '--vx-primary-soft': 'rgba(15, 118, 110, 0.12)',
      '--vx-secondary': '#0f766e',
      '--vx-bg': '#f0fdfa',
      '--vx-bg-accent': '#ccfbf1',
      '--vx-surface-hover': '#f6fffd',
      '--vx-border': '#99f6e4',
      '--vx-border-strong': '#5eead4',
      '--vx-text': '#042f2e',
      '--vx-text-secondary': '#115e59',
      '--vx-text-muted': '#0f766e',
      '--vx-shadow-sm': '0 1px 2px rgba(4, 47, 46, 0.08)',
      '--vx-shadow': '0 14px 32px rgba(4, 47, 46, 0.08)',
      '--vx-shadow-lg': '0 28px 64px rgba(4, 47, 46, 0.12)',
    },
  }),
  graphite: createTheme('dark', {
    label: 'Graphite',
    tokens: {
      '--vx-primary': '#f59e0b',
      '--vx-primary-strong': '#d97706',
      '--vx-primary-soft': 'rgba(245, 158, 11, 0.16)',
      '--vx-bg': '#111111',
      '--vx-bg-accent': '#191919',
      '--vx-surface': '#18181b',
      '--vx-surface-strong': '#111111',
      '--vx-surface-hover': '#222225',
      '--vx-border': 'rgba(244, 244, 245, 0.10)',
      '--vx-border-strong': 'rgba(244, 244, 245, 0.18)',
      '--vx-text': '#fafafa',
      '--vx-text-secondary': '#d4d4d8',
      '--vx-text-muted': '#a1a1aa',
      '--vx-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.34)',
      '--vx-shadow': '0 20px 44px rgba(0, 0, 0, 0.28)',
      '--vx-shadow-lg': '0 30px 72px rgba(0, 0, 0, 0.38)',
    },
  }),
  'ivory-gold': createTheme('light', {
    label: 'Ivory Gold',
    tokens: {
      '--vx-primary': '#a0742a',
      '--vx-primary-strong': '#7d5a1e',
      '--vx-primary-soft': 'rgba(160, 116, 42, 0.12)',
      '--vx-bg': '#faf6ee',
      '--vx-bg-accent': '#f2ead8',
      '--vx-surface': '#ffffff',
      '--vx-surface-strong': '#faf6ee',
      '--vx-surface-hover': '#f6f0e4',
      '--vx-border': 'rgba(160, 116, 42, 0.18)',
      '--vx-border-strong': 'rgba(160, 116, 42, 0.38)',
      '--vx-text': '#1c1409',
      '--vx-text-secondary': '#5a4320',
      '--vx-text-muted': '#9a7c4a',
      '--vx-shadow-sm': '0 1px 2px rgba(90, 67, 32, 0.08)',
      '--vx-shadow': '0 12px 32px rgba(90, 67, 32, 0.10)',
      '--vx-shadow-lg': '0 28px 64px rgba(90, 67, 32, 0.14)',
      '--vx-success': '#1a9e6e',
      '--vx-warning': '#c4820a',
      '--vx-danger': '#d63b3b',
    },
  }),
  'black-gold': createTheme('dark', {
    label: 'Black Gold',
    tokens: {
      '--vx-primary': '#c8a97c',
      '--vx-primary-strong': '#9a7545',
      '--vx-primary-soft': 'rgba(200, 169, 124, 0.16)',
      '--vx-bg': '#05070b',
      '--vx-bg-accent': '#0a0d14',
      '--vx-surface': 'rgba(15, 18, 25, 0.76)',
      '--vx-surface-strong': 'rgba(18, 21, 29, 0.9)',
      '--vx-surface-hover': 'rgba(245, 233, 215, 0.1)',
      '--vx-border': 'rgba(245, 233, 215, 0.12)',
      '--vx-border-strong': 'rgba(200, 169, 124, 0.42)',
      '--vx-text': '#f5e9d7',
      '--vx-text-secondary': '#d7c8b2',
      '--vx-text-muted': '#928a81',
      '--vx-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
      '--vx-shadow': '0 0 42px rgba(200, 169, 124, 0.16)',
      '--vx-shadow-lg': '0 34px 120px rgba(0, 0, 0, 0.62)',
      '--vx-success': '#32d49a',
      '--vx-warning': '#e6ad64',
      '--vx-danger': '#ef6a64',
    },
  }),
  ocean: createTheme('dark', {
    label: 'Ocean',
    tokens: {
      '--vx-primary': '#38bdf8',
      '--vx-primary-strong': '#0ea5e9',
      '--vx-primary-soft': 'rgba(56, 189, 248, 0.16)',
      '--vx-bg': '#06131f',
      '--vx-bg-accent': '#0b1a2b',
      '--vx-surface': '#0d2236',
      '--vx-surface-strong': '#06131f',
      '--vx-surface-hover': '#13314d',
      '--vx-border': 'rgba(125, 211, 252, 0.16)',
      '--vx-border-strong': 'rgba(56, 189, 248, 0.24)',
      '--vx-text': '#e0f2fe',
      '--vx-text-secondary': '#bae6fd',
      '--vx-text-muted': '#7dd3fc',
      '--vx-shadow-sm': '0 1px 2px rgba(2, 6, 23, 0.34)',
      '--vx-shadow': '0 20px 44px rgba(2, 6, 23, 0.28)',
      '--vx-shadow-lg': '0 30px 72px rgba(2, 6, 23, 0.4)',
    },
  }),
  indigo: createTheme('light', {
    label: 'Indigo',
    tokens: {
      '--vx-primary': '#5c5fe8',
      '--vx-primary-strong': '#4f52d4',
      '--vx-primary-soft': 'rgba(92, 95, 232, 0.10)',
      '--vx-secondary': '#818cf8',
      '--vx-success': '#059669',
      '--vx-warning': '#d97706',
      '--vx-danger': '#dc2626',
      '--vx-info': '#5c5fe8',
      '--vx-bg': '#e8ecf6',
      '--vx-bg-accent': '#dde3f0',
      '--vx-surface': '#ffffff',
      '--vx-surface-strong': '#f8f9ff',
      '--vx-surface-hover': '#f4f5ff',
      '--vx-border': '#d4daf0',
      '--vx-border-strong': '#bfc8e8',
      '--vx-text': '#1a2336',
      '--vx-text-secondary': '#4a5572',
      '--vx-text-muted': '#8b96b4',
      '--vx-shadow-sm': '0 1px 3px rgba(28, 40, 80, 0.08)',
      '--vx-shadow': '0 8px 28px rgba(28, 40, 80, 0.10)',
      '--vx-shadow-lg': '0 24px 60px rgba(28, 40, 80, 0.14)',
      '--vx-glass-bg': 'color-mix(in srgb, #ffffff 86%, transparent)',
      '--vx-glass-bg-strong': 'color-mix(in srgb, #f8f9ff 93%, transparent)',
      '--vx-glass-border': 'rgba(92, 95, 232, 0.18)',
      '--vx-glass-shadow': '0 16px 44px rgba(28, 40, 80, 0.12)',
      '--vx-glass-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.70)',
      '--vx-radius-sm': '10px',
      '--vx-radius': '12px',
      '--vx-radius-lg': '16px',
      '--vx-radius-xl': '22px',
    },
  }),
  violet: createTheme('light', {
    label: 'Violet',
    tokens: {
      '--vx-primary': '#7c3aed',
      '--vx-primary-strong': '#6d28d9',
      '--vx-primary-soft': 'rgba(124, 58, 237, 0.10)',
      '--vx-secondary': '#8b5cf6',
      '--vx-success': '#059669',
      '--vx-warning': '#d97706',
      '--vx-danger': '#dc2626',
      '--vx-info': '#6d28d9',
      '--vx-bg': '#f8f7ff',
      '--vx-bg-accent': '#ede9fe',
      '--vx-surface': '#ffffff',
      '--vx-surface-strong': '#faf9ff',
      '--vx-surface-hover': '#f5f3ff',
      '--vx-border': '#e4dfff',
      '--vx-border-strong': '#c9bffd',
      '--vx-text': '#1e1b2e',
      '--vx-text-secondary': '#6e6a8a',
      '--vx-text-muted': '#a89fc8',
      '--vx-shadow-sm': '0 1px 3px rgba(109, 40, 217, 0.07)',
      '--vx-shadow': '0 12px 32px rgba(109, 40, 217, 0.10)',
      '--vx-shadow-lg': '0 28px 64px rgba(109, 40, 217, 0.14)',
      '--vx-glass-bg': 'color-mix(in srgb, #ffffff 84%, transparent)',
      '--vx-glass-bg-strong': 'color-mix(in srgb, #faf9ff 92%, transparent)',
      '--vx-glass-border': 'rgba(196, 181, 253, 0.55)',
      '--vx-glass-shadow': '0 18px 48px rgba(109, 40, 217, 0.12)',
      '--vx-glass-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.60)',
      '--vx-radius-sm': '10px',
      '--vx-radius': '12px',
      '--vx-radius-lg': '16px',
      '--vx-radius-xl': '24px',
    },
  }),
  'violet-dark': createTheme('dark', {
    label: 'Violet Dark',
    tokens: {
      '--vx-primary': '#a78bfa',
      '--vx-primary-strong': '#8b5cf6',
      '--vx-primary-soft': 'rgba(167, 139, 250, 0.16)',
      '--vx-secondary': '#c4b5fd',
      '--vx-success': '#34d399',
      '--vx-warning': '#fbbf24',
      '--vx-danger': '#f87171',
      '--vx-info': '#c4b5fd',
      '--vx-bg': '#0d0b1a',
      '--vx-bg-accent': '#13102a',
      '--vx-surface': '#1a1735',
      '--vx-surface-strong': '#0d0b1a',
      '--vx-surface-hover': '#1e1b3a',
      '--vx-border': 'rgba(167, 139, 250, 0.16)',
      '--vx-border-strong': 'rgba(167, 139, 250, 0.30)',
      '--vx-text': '#f0eeff',
      '--vx-text-secondary': '#c4b5fd',
      '--vx-text-muted': '#8b7fc8',
      '--vx-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.40)',
      '--vx-shadow': '0 18px 44px rgba(0, 0, 0, 0.30)',
      '--vx-shadow-lg': '0 30px 72px rgba(0, 0, 0, 0.44)',
      '--vx-glass-bg': 'color-mix(in srgb, #1a1735 86%, transparent)',
      '--vx-glass-bg-strong': 'color-mix(in srgb, #0d0b1a 94%, transparent)',
      '--vx-glass-border': 'rgba(167, 139, 250, 0.22)',
      '--vx-glass-shadow': '0 22px 54px rgba(0, 0, 0, 0.50)',
      '--vx-glass-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.07)',
      '--vx-glass-scrim': 'color-mix(in srgb, #04030d 62%, transparent)',
      '--vx-radius-sm': '10px',
      '--vx-radius': '12px',
      '--vx-radius-lg': '16px',
      '--vx-radius-xl': '24px',
    },
  }),
} satisfies ThemeRegistry;

function normalizeThemes(themes?: ThemeRegistry): ThemeRegistry {
  return {
    ...coreThemes,
    ...themes,
  };
}

function resolveThemeName(defaultTheme: string | undefined, themes: ThemeRegistry) {
  if (defaultTheme && themes[defaultTheme]) {
    return defaultTheme;
  }

  if (themes.light) {
    return 'light';
  }

  const [firstThemeName] = Object.keys(themes);
  return firstThemeName ?? 'light';
}

function getStoredTheme(storageKey: string, themes: ThemeRegistry) {
  const storedTheme = window.localStorage.getItem(storageKey);
  return storedTheme && themes[storedTheme] ? storedTheme : null;
}

function getThemeByMode(themes: ThemeRegistry, mode: ThemeMode, preferredName: string) {
  if (themes[preferredName]?.mode === mode) {
    return preferredName;
  }

  const entry = Object.entries(themes).find(([, definition]) => definition.mode === mode);
  return entry?.[0];
}

interface ThemeContextValue {
  theme: string;
  mode: ThemeMode;
  themes: ThemeRegistry;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  themes?: ThemeRegistry;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vxui-react-theme',
  themes,
}: ThemeProviderProps) {
  const registry = useMemo(() => normalizeThemes(themes), [themes]);
  const fallbackTheme = useMemo(() => resolveThemeName(defaultTheme, registry), [defaultTheme, registry]);
  const appliedTokenKeysRef = useRef<string[]>([]);

  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return fallbackTheme;
    }

    return getStoredTheme(storageKey, registry) ?? fallbackTheme;
  });

  const resolvedThemeName = registry[theme] ? theme : fallbackTheme;
  const activeTheme = registry[resolvedThemeName];

  useEffect(() => {
    if (theme !== resolvedThemeName) {
      setThemeState(resolvedThemeName);
    }
  }, [resolvedThemeName, theme]);

  useEffect(() => {
    const root = document.documentElement;

    for (const tokenKey of appliedTokenKeysRef.current) {
      root.style.removeProperty(tokenKey);
    }

    root.dataset.theme = activeTheme.mode;
    root.dataset.themeName = resolvedThemeName;

    const nextTokenEntries = Object.entries(activeTheme.tokens ?? {}).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
    );

    for (const [tokenKey, tokenValue] of nextTokenEntries) {
      root.style.setProperty(tokenKey, tokenValue);
    }

    appliedTokenKeysRef.current = nextTokenEntries.map(([tokenKey]) => tokenKey);
    window.localStorage.setItem(storageKey, resolvedThemeName);
  }, [activeTheme, resolvedThemeName, storageKey]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: resolvedThemeName,
      mode: activeTheme.mode,
      themes: registry,
      setTheme: (nextTheme) => {
        setThemeState(registry[nextTheme] ? nextTheme : fallbackTheme);
      },
      toggleTheme: () => {
        setThemeState((currentTheme) => {
          const currentMode = (registry[currentTheme] ?? activeTheme).mode;
          const nextMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';
          return getThemeByMode(registry, nextMode, nextMode) ?? currentTheme;
        });
      },
    }),
    [activeTheme, fallbackTheme, registry, resolvedThemeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return context;
}
