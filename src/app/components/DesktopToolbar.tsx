/**
 * DesktopToolbar — 桌面端文档页面顶部工具栏
 * 从 DesktopApp.tsx 提取
 */
import type { ReactNode } from 'react';
import { House, Search, SlidersHorizontal, Palette, User, MoreHorizontal, Globe } from 'lucide-react';
import { Button } from '../../components/Button';
import { DropdownMenu } from '../../components/DropdownMenu';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { locales } from '../../i18n';
import type { ReleaseTrack } from '../routes';

interface ToolbarAction {
  key: string;
  visible: boolean;
  render: () => ReactNode;
}

interface DesktopToolbarProps {
  showBack: boolean;
  showSearch: boolean;
  showDensity: boolean;
  showThemeBtn: boolean;
  showAccountBtn: boolean;
  showLanguageBtn: boolean;
  showMoreMenu: boolean;
  isZh: boolean;
  locale: string;
  theme: string;
  themes: Record<string, any>;
  densityLabel: string;
  compactDensity: boolean;
  viewerSession: { name: string; mode: 'member' | 'guest' } | null;
  guestLabel: string;
  accountMenu: string;
  releaseTrack: ReleaseTrack;
  onReleaseTrackChange: (track: ReleaseTrack) => void;
  releaseLabel: string;
  releaseOptions: { stable: string; preview: string; internal: string };
  onNavigate: (route: any) => void;
  onSearchOpenChange: (open: boolean) => void;
  onCompactDensityChange: (dense: boolean) => void;
  setTheme: (theme: string) => void;
  setLocale: (locale: string) => void;
  onLogout: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function DesktopToolbar({
  showBack, showSearch, showDensity, showThemeBtn, showAccountBtn, showLanguageBtn, showMoreMenu,
  isZh, locale, theme, themes, densityLabel, compactDensity, viewerSession, guestLabel, accountMenu,
  releaseTrack, onReleaseTrackChange, releaseLabel, releaseOptions,
  onNavigate, onSearchOpenChange, onCompactDensityChange, setTheme, setLocale,
  onLogout, onLogin, onRegister,
}: DesktopToolbarProps) {
  const themeMenuItems = Object.entries(themes).map(([themeName, definition]) => ({
    label: `${(definition as any).label ?? themeName}${theme === themeName ? (isZh ? ' (当前)' : ' (current)') : ''}`,
    icon: <Palette size={14} />,
    onClick: () => setTheme(themeName),
  }));

  const accountMenuItems = viewerSession
    ? [{ label: isZh ? '退出登录' : 'Logout', icon: <User size={14} />, onClick: onLogout }]
    : [
        { label: isZh ? '登录' : 'Login', icon: <User size={14} />, onClick: onLogin },
        { label: isZh ? '注册' : 'Signup', icon: <User size={14} />, onClick: onRegister },
      ];

  const releaseTrackItems = [
    { label: releaseOptions.stable, value: 'stable' as ReleaseTrack },
    { label: releaseOptions.preview, value: 'preview' as ReleaseTrack },
    { label: releaseOptions.internal, value: 'internal' as ReleaseTrack },
  ];

  return (
    <div className="vx-docs-toolbar">
      {/* 返回主页 */}
      {showBack && (
        <Button variant="outline" size="sm" onClick={() => onNavigate({ view: 'home' })}>
          <House size={14} />{isZh ? '返回首页' : 'Go home'}
        </Button>
      )}

      {/* 搜索 */}
      {showSearch && (
        <Button variant="outline" size="sm" onClick={() => onSearchOpenChange(true)}>
          <Search size={14} />{isZh ? '搜索' : 'Search'}<kbd className="vx-search-kbd">⌘K</kbd>
        </Button>
      )}

      {/* 密度切换 */}
      {showDensity && (
        <Button variant={compactDensity ? 'soft' : 'outline'} size="sm" onClick={() => onCompactDensityChange(!compactDensity)}>
          <SlidersHorizontal size={14} />{densityLabel}
        </Button>
      )}

      {/* 主题选择 */}
      {showThemeBtn && (
        <DropdownMenu trigger={<Button variant="outline" size="sm"><Palette size={14} />{(themes as any)[theme]?.label ?? theme}</Button>}
          items={themeMenuItems} align="right" />
      )}

      {/* 账户菜单 */}
      {showAccountBtn && (
        <DropdownMenu trigger={<Button variant="outline" size="sm"><User size={14} />{viewerSession?.name ?? guestLabel}</Button>}
          groups={[{ label: accountMenu, items: accountMenuItems }]} align="right" />
      )}

      {/* 语言切换 */}
      {showLanguageBtn && <LanguageSwitcher variant="inline" />}

      {/* 更多菜单 */}
      {showMoreMenu && (
        <DropdownMenu key="docs-toolbar-more"
          trigger={<Button variant="outline" size="sm"><MoreHorizontal size={14} />{isZh ? '更多' : 'More'}</Button>}
          groups={[
            // 导航组
            ...(!showBack || !showSearch ? [{
              label: isZh ? '导航' : 'Navigation',
              items: [
                ...(!showBack ? [{ label: isZh ? '返回首页' : 'Go home', icon: <House size={14} />, onClick: () => onNavigate({ view: 'home' }) }] : []),
                ...(!showSearch ? [{ label: isZh ? '搜索' : 'Search', icon: <Search size={14} />, shortcut: '⌘K', onClick: () => onSearchOpenChange(true) }] : []),
              ],
            }] : []),
            // 视图组
            ...(!showDensity ? [{ label: isZh ? '视图' : 'View', items: [{ label: densityLabel, onClick: () => onCompactDensityChange(!compactDensity) }] }] : []),
            // 主题组
            ...(!showThemeBtn ? [{ label: isZh ? '主题' : 'Theme', items: themeMenuItems }] : []),
            // 账户组
            ...(!showAccountBtn ? [{ label: accountMenu, items: accountMenuItems }] : []),
            // 语言组
            ...(!showLanguageBtn ? [{
              label: isZh ? '语言' : 'Language',
              items: Object.entries(locales).map(([k, d]) => ({
                label: `${(d as any).label}${locale === k ? (isZh ? ' (当前)' : ' (current)') : ''}`,
                icon: <Globe size={14} />,
                onClick: () => setLocale(k),
              }))
            }] : []),
          ]}
          align="right" />
      )}
    </div>
  );
}