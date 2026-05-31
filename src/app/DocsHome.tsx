/**
 * DocsHome — 文档首页组件
 * 从 App.tsx 的 renderDocsHome 提取
 */
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Alert } from '../components/Alert';
import { Select } from '../components/Select';
import { Accordion } from '../components/Accordion';
import { ChevronRight, Compass, Zap } from 'lucide-react';
import { pageIcons } from './nav-config';
import type { PageKey, AppRoute, ReleaseTrack } from './routes';

interface DocsHomeProps {
  isZh: boolean;
  docsHomeCopy: Record<string, any>;
  copy: Record<string, any>;
  docsHomeGroups: Array<{
    key: string;
    label: string;
    description: string;
    pages: PageKey[];
  }>;
  pages: Record<string, { title: string }>;
  metricCards: Array<{ label: string; value: string; hint: string }>;
  releaseTrack: ReleaseTrack;
  setReleaseTrack: (track: ReleaseTrack) => void;
  navigate: (route: AppRoute) => void;
}

export function DocsHome({
  isZh, docsHomeCopy, copy, docsHomeGroups, metricCards,
  releaseTrack, setReleaseTrack, navigate, pages,
}: DocsHomeProps) {
  return (
    <div className="vx-docs-workspace__home">
      <section className="vx-docs-home__hero">
        <div className="vx-docs-home__copy">
          <Badge variant="accent">{docsHomeCopy.badge}</Badge>
          <h1>{docsHomeCopy.title}</h1>
          <p>{docsHomeCopy.lead}</p>
          <div className="vx-docs-home__actions">
            <Button size="lg" onClick={() => navigate({ view: 'docs', page: 'introduction' })}>
              <Compass size={16} />{docsHomeCopy.primary}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate({ view: 'docs', page: 'quick-start' })}>
              <Zap size={16} />{docsHomeCopy.secondary}
            </Button>
          </div>
          <Alert title={docsHomeCopy.pathTitle} variant="info">{docsHomeCopy.pathBody}</Alert>
        </div>
      </section>

      <section className="vx-docs-home__section">
        <div className="vx-docs-home__section-head">
          <h2>{docsHomeCopy.indexTitle}</h2>
          <p>{docsHomeCopy.indexLead}</p>
        </div>
        <div className="vx-doc-architecture-grid">
          <Card className="vx-docs-home__panel">
            <CardHeader>
              <CardTitle>{isZh ? '文档总览' : 'Docs Overview'}</CardTitle>
              <CardDescription>{isZh ? '从页面规模、断点层级和发布轨道快速判断当前文档范围。' : 'Review the scope of the docs through page count, breakpoints, and release track.'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-doc-metric-grid">
                {metricCards.map((metric) => (
                  <div key={metric.label} className="vx-doc-metric-grid__item">
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small>{metric.hint}</small>
                  </div>
                ))}
              </div>
              <div className="vx-doc-control-grid vx-doc-control-grid--single">
                <Select
                  label={copy.releaseLabel}
                  value={releaseTrack}
                  onChange={(value) => { if (value) setReleaseTrack(value as ReleaseTrack); }}
                  options={[
                    { value: 'stable', label: copy.releaseOptions.stable },
                    { value: 'preview', label: copy.releaseOptions.preview },
                    { value: 'internal', label: copy.releaseOptions.internal },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="vx-docs-home__panel">
            <CardHeader>
              <CardTitle>{copy.contentMapTitle}</CardTitle>
              <CardDescription>{copy.libraryLead}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-doc-content-map">
                {docsHomeGroups.map((group) => (
                  <button key={group.key} type="button" className="vx-doc-content-map__row"
                    onClick={() => navigate({ view: 'docs', page: group.pages[0] })}>
                    <div>
                      <strong>{group.label}</strong>
                      <span>{group.description}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="vx-docs-home__section">
        <div className="vx-docs-home__section-head">
          <h2>{docsHomeCopy.sectionsTitle}</h2>
          <p>{docsHomeCopy.sectionsLead}</p>
        </div>
        <div className="vx-doc-library-grid">
          {docsHomeGroups.map((group) => (
            <Card key={group.key} className="vx-doc-library-card">
              <CardHeader>
                <CardTitle>{group.label}</CardTitle>
                <CardDescription>{group.pages.length} {docsHomeCopy.entryCount}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-doc-library-card__links">
                  {group.pages.slice(0, 5).map((pageKey) => (
                    <button key={pageKey} type="button" className="vx-doc-library-card__link"
                      onClick={() => navigate({ view: 'docs', page: pageKey })}>
                      <span>{pageIcons[pageKey]}</span>
                      <span>{(pages as any)?.[pageKey]?.title ?? pageKey}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <Button size="sm" variant="secondary" onClick={() => navigate({ view: 'docs', page: group.pages[0] })}>
                    {docsHomeCopy.openSection}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="vx-docs-home__section">
        <div className="vx-docs-home__section-head">
          <h2>{docsHomeCopy.pathsTitle}</h2>
          <p>{docsHomeCopy.pathsLead}</p>
        </div>
        <div className="vx-doc-architecture-grid">
          <Card>
            <CardHeader>
              <CardTitle>{docsHomeCopy.walkthroughTitle}</CardTitle>
              <CardDescription>{docsHomeCopy.pathBody}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="vx-list">
                {docsHomeCopy.walkthroughItems.map((item: string) => (<li key={item}>{item}</li>))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{docsHomeCopy.adoptionTitle}</CardTitle>
              <CardDescription>{docsHomeCopy.sectionsLead}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion items={docsHomeCopy.adoptionItems} defaultOpen={['product']} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="vx-docs-home__section">
        <div className="vx-docs-home__section-head">
          <h2>{docsHomeCopy.rulesTitle}</h2>
          <p>{docsHomeCopy.rulesLead}</p>
        </div>
        <div className="vx-doc-architecture-grid">
          <Card>
            <CardHeader>
              <CardTitle>{docsHomeCopy.rulesTitle}</CardTitle>
              <CardDescription>{docsHomeCopy.rulesLead}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="vx-list">
                {docsHomeCopy.rulesItems.map((item: string) => (<li key={item}>{item}</li>))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{docsHomeCopy.toolsTitle}</CardTitle>
              <CardDescription>{docsHomeCopy.toolsLead}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="vx-list">
                {docsHomeCopy.toolsItems.map((item: string) => (<li key={item}>{item}</li>))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
