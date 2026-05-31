/**
 * DocPage — 文档详情页组件
 * 从 App.tsx 的 renderDocPage 提取
 */
import type { ReactNode, RefObject } from 'react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { CodeBlock } from '../components/CodeBlock';
import { ArrowRight } from 'lucide-react';
import { pageIcons } from './nav-config';
import { DOC_NAV_GROUPS, MOBILE_PREVIEW_PAGES } from './nav-config';
import { DOC_USAGE_SNIPPETS } from './doc-snippets';
import { buildMobilePreviewPath } from './routes';
import type { PageKey, AppRoute, PageDefinition } from './routes';

interface DocPageProps {
  isZh: boolean;
  activePage: PageKey;
  activeDocument: PageDefinition;
  pages: Record<string, PageDefinition>;
  copy: Record<string, any>;
  renderSample: (pageKey: PageKey) => ReactNode;
  renderCodeBlock: (code: string, language?: 'tsx' | 'bash') => ReactNode;
  renderTemplateLauncher: (pageKey: Extract<PageKey, 'home-page' | 'login-page' | 'register-page' | 'error-page' | 'privacy-policy' | 'terms-of-service'>) => ReactNode;
  navigate: (route: AppRoute) => void;
  docHeaderRef: RefObject<HTMLElement | null>;
}

export function DocPage({
  isZh, activePage, activeDocument, pages, copy,
  renderSample, renderCodeBlock, renderTemplateLauncher,
  navigate, docHeaderRef,
}: DocPageProps) {
  const usageSnippet = DOC_USAGE_SNIPPETS[activePage];
  const sample = renderSample(activePage);
  const hasSample = sample !== null;
  const mobilePreviewPath = MOBILE_PREVIEW_PAGES.has(activePage)
    ? buildMobilePreviewPath(activePage)
    : null;

  // Flat ordered page list for prev/next navigation
  const flatPages = DOC_NAV_GROUPS.flatMap((g) =>
    g.items.flatMap((item) => (typeof item === 'string' ? item : item.pages)),
  );
  const currentIndex = flatPages.indexOf(activePage);
  const prevPage = currentIndex > 0 ? flatPages[currentIndex - 1] : null;
  const nextPage = currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

  return (
    <article className="vx-bs-doc-page">
      {/* Page header */}
      <header ref={docHeaderRef as React.Ref<HTMLElement>} className="vx-bs-doc-header">
        <span className="vx-bs-doc-kicker">{activeDocument.section}</span>
        <h1>{activeDocument.title}</h1>
        <p className="vx-bs-doc-lead">{activeDocument.description}</p>
        <div className="vx-bs-doc-header-badges">
          <span className="vx-version-pill">{copy.livePreview}</span>
        </div>
      </header>

      {/* Content body */}
      <div className="vx-bs-doc-body">
        <div className="vx-bs-doc-content">
          {/* Overview / Guidance */}
          <section id="overview" className="vx-bs-doc-section">
            <h2 className="vx-bs-section-heading">
              {isZh ? '使用指南' : 'Overview'}
              <a href="#overview" className="vx-bs-anchor" aria-label={isZh ? '链接到使用指南' : 'Link to Overview'}>#</a>
            </h2>
            <ul className="vx-doc-list">
              {activeDocument.guidance.map((item) => (<li key={item}>{item}</li>))}
            </ul>
          </section>

          {/* Live example */}
          {hasSample && (
            <section id="example" className="vx-bs-doc-section">
              <h2 className="vx-bs-section-heading">
                {isZh ? '示例' : 'Example'}
                <a href="#example" className="vx-bs-anchor" aria-label={isZh ? '链接到示例' : 'Link to Example'}>#</a>
              </h2>
              <div className="vx-bs-example-grid">
                <div className="vx-bs-example-panel">
                  <div className="vx-bs-example-panel__meta">
                    <span className="vx-bs-example-panel__eyebrow">{isZh ? '桌面端' : 'Desktop'}</span>
                    <strong>{copy.livePreview}</strong>
                  </div>
                  <div className="vx-bs-example">{sample}</div>
                </div>

                {mobilePreviewPath && (
                  <div className="vx-bs-example-panel vx-bs-example-panel--mobile">
                    <div className="vx-bs-example-panel__meta">
                      <span className="vx-bs-example-panel__eyebrow">{isZh ? '移动端' : 'Mobile'}</span>
                      <strong>{isZh ? '同步预览' : 'Synced preview'}</strong>
                    </div>
                    <div className="vx-bs-mobile-preview">
                      <div className="vxm-phone-frame vx-bs-mobile-preview__frame">
                        <iframe className="vx-bs-mobile-preview__iframe" loading="lazy"
                          src={mobilePreviewPath}
                          title={`${activeDocument.title} ${isZh ? '移动端预览' : 'mobile preview'}`} />
                      </div>
                      <p className="vx-bs-mobile-preview__hint">
                        {isZh ? '这里加载真实的移动端文档页，便于同时对比桌面与手机呈现。' : 'This loads the real mobile docs page so desktop and phone presentations stay in sync.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Code usage */}
          {usageSnippet && (
            <section id="usage" className="vx-bs-doc-section">
              <h2 className="vx-bs-section-heading">
                {isZh ? '用法' : 'Usage'}
                <a href="#usage" className="vx-bs-anchor" aria-label={isZh ? '链接到用法' : 'Link to Usage'}>#</a>
              </h2>
              {renderCodeBlock(usageSnippet)}
            </section>
          )}

          {/* API Reference (props table) */}
          {activeDocument.props && activeDocument.props.length > 0 && (
            <section id="api" className="vx-bs-doc-section">
              <h2 className="vx-bs-section-heading">
                {isZh ? 'API 参考' : 'API Reference'}
                <a href="#api" className="vx-bs-anchor" aria-label={isZh ? '链接到 API 参考' : 'Link to API Reference'}>#</a>
              </h2>
              <div className="vx-bs-props-table-wrapper">
                <table className="vx-bs-props-table">
                  <thead>
                    <tr>
                      <th>{isZh ? '属性' : 'Prop'}</th>
                      <th>{isZh ? '类型' : 'Type'}</th>
                      <th>{isZh ? '默认值' : 'Default'}</th>
                      <th>{isZh ? '说明' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDocument.props.map((row) => (
                      <tr key={row.prop}>
                        <td><code>{row.prop}</code>{row.required && <span className="vx-bs-prop-required" title={isZh ? '必填' : 'Required'}>*</span>}</td>
                        <td><code className="vx-bs-prop-type">{row.type}</code></td>
                        <td>{row.default ? <code>{row.default}</code> : <span className="vx-bs-prop-dash">—</span>}</td>
                        <td>{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Prev / Next page navigation */}
      {(prevPage ?? nextPage) && (
        <nav className="vx-bs-doc-pager" aria-label={isZh ? '分页导航' : 'Page navigation'}>
          {prevPage ? (
            <button type="button" className="vx-bs-doc-pager__btn"
              onClick={() => navigate({ view: 'docs', page: prevPage })}>
              <span className="vx-bs-doc-pager__dir">← {isZh ? '上一页' : 'Previous'}</span>
              <span className="vx-bs-doc-pager__label">{pages[prevPage].title}</span>
            </button>
          ) : <div />}
          {nextPage && (
            <button type="button" className="vx-bs-doc-pager__btn vx-bs-doc-pager__btn--next"
              onClick={() => navigate({ view: 'docs', page: nextPage })}>
              <span className="vx-bs-doc-pager__dir">{isZh ? '下一页' : 'Next'} →</span>
              <span className="vx-bs-doc-pager__label">{pages[nextPage].title}</span>
            </button>
          )}
        </nav>
      )}
    </article>
  );
}
