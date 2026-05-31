/**
 * doc-helpers — 文档辅助函数
 * 从 DesktopApp.tsx 提取
 */
import type { ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Button } from '../components/Button';
import { ArrowRight } from 'lucide-react';
import { pageIcons } from './nav-config';
import type { PageKey, AppRoute, PageDefinition } from './routes';

export interface DocHelpers {
  renderCodeBlock: (code: string, language?: 'tsx' | 'bash') => ReactNode;
  renderTemplateLauncher: (pageKey: Extract<PageKey, 'home-page' | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service'>) => ReactNode;
}

export function createDocHelpers(
  isZh: boolean,
  pages: Record<string, PageDefinition>,
  copy: { openPage: string },
  onNavigate: (route: AppRoute) => void,
  push: (toast: any) => void,
): DocHelpers {
  async function handleCopyCode(code: string) {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        throw new Error('Clipboard is unavailable.');
      }
      push({ tone: 'success', title: isZh ? '代码已复制' : 'Code copied', description: isZh ? '示例代码已复制到剪贴板。' : 'The example code was copied to your clipboard.' });
      return true;
    } catch {
      push({ tone: 'warning', title: isZh ? '复制失败' : 'Copy failed', description: isZh ? '当前环境不支持自动复制，请手动选择代码。' : 'Automatic copy is unavailable here. Please select and copy the code manually.' });
      return false;
    }
  }

  function renderCodeBlock(code: string, language: 'tsx' | 'bash' = 'tsx') {
    return (
      <CodeBlock
        code={code}
        language={language}
        copyLabel={isZh ? '复制代码' : 'Copy code'}
        copiedLabel={isZh ? '已复制' : 'Copied'}
        onCopy={handleCopyCode}
      />
    );
  }

  function renderTemplateLauncher(
    pageKey: Extract<PageKey, 'home-page' | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service'>,
  ) {
    const actionMap: Record<typeof pageKey, () => void> = {
      'home-page': () => onNavigate({ view: 'home' }),
      'login-page': () => onNavigate({ view: 'login' }),
      'register-page': () => onNavigate({ view: 'register' }),
      'error-page': () => onNavigate({ view: 'error' }),
      'privacy-policy': () => onNavigate({ view: 'privacy-policy' }),
      'terms-of-service': () => onNavigate({ view: 'terms-of-service' }),
    };
    return (
      <div className="vx-template-launch">
        <div className="vx-template-launch__head">
          <span className="vx-template-launch__icon">{pageIcons[pageKey]}</span>
          <div>
            <strong>{pages[pageKey].title}</strong>
            <p>{pages[pageKey].description}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={actionMap[pageKey]}>
          <ArrowRight size={16} /> {copy.openPage}
        </Button>
      </div>
    );
  }

  return { renderCodeBlock, renderTemplateLauncher };
}
