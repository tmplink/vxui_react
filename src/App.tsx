/**
 * App — 应用入口
 * 根据路由选择桌面端或移动端渲染
 */
import { Responsive } from './components/Responsive';
import { MobileApp } from './components/mobile/MobileApp';
import { DesktopAppShell } from './app/DesktopAppShell';

export default function App() {
  const isMobilePreview = typeof window !== 'undefined' && window.location.pathname.startsWith('/m');

  if (isMobilePreview) {
    return <MobileApp />;
  }

  return (
    <Responsive
      desktop={<DesktopAppShell />}
      mobile={<MobileApp />}
    />
  );
}
