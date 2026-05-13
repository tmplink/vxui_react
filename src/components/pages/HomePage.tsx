import {
  ArrowRight,
  FileCode2,
  Github,
  Search,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useI18n } from '../../i18n';
import { getPublicHomeContent } from './homePageContent';

interface HomePageProps {
  viewerName?: string | null;
  onLogin: () => void;
  onRegister: () => void;
  onDocs: (pageKey?: string) => void;
  onPrivacy: () => void;
  onLogout?: () => void;
}

export function HomePage({
  viewerName,
  onLogin,
  onRegister,
  onDocs,
  onPrivacy,
  onLogout,
}: HomePageProps) {
  const { t } = useI18n();
  const pp = t.publicPages;
  const isSignedIn = Boolean(viewerName);
  const { features, previewSections, metaItems } = getPublicHomeContent(t);

  return (
    <div className="vx-public">
      <header className="vx-public-nav">
        <div className="vx-public-nav__brand">
          <img src="/colorful_flat_icon.svg" alt="vxUI" height={32} style={{ display: 'block' }} />
        </div>
        <div className="vx-public-nav__links">
          {isSignedIn ? (
            <span className="vx-public-nav__user">
              {pp.signedInAs}: {viewerName}
            </span>
          ) : null}
          <LanguageSwitcher variant="inline" />
          <a
            href="https://github.com/tmplink/vxui_react"
            target="_blank"
            rel="noopener noreferrer"
            className="vx-cmd-trigger"
            aria-label="GitHub"
          >
            <Github size={14} />
            GitHub
          </a>
          <button type="button" className="vx-cmd-trigger" onClick={() => onDocs()}>
            <FileCode2 size={14} />
            {pp.navDocs}
          </button>
          {!isSignedIn ? (
            <button type="button" className="vx-cmd-trigger" onClick={onLogin}>
              {pp.navLogin}
            </button>
          ) : null}
          {isSignedIn ? (
            <Button size="sm" variant="secondary" onClick={onLogout ?? (() => onDocs())}>
              {pp.navLogout}
            </Button>
          ) : (
            <Button size="sm" onClick={onRegister}>
              {pp.navSignup}
            </Button>
          )}
        </div>
      </header>

      <main className="vx-public-main">
        <section className="vx-public-hero">
          <div className="vx-public-hero-badge">
            <Badge variant="accent">{pp.heroTag}</Badge>
          </div>
          <h1 className="vx-public-hero__title">{pp.heroTitle}</h1>
          <p className="vx-public-hero__lead">{pp.heroLead}</p>
          <div className="vx-public-hero__actions">
            <Button size="lg" onClick={isSignedIn ? (() => onDocs()) : onLogin}>
              <Zap size={18} />
              {isSignedIn ? pp.backToDocs : pp.heroCta}
            </Button>
            {isSignedIn ? (
              <Button size="lg" variant="secondary" onClick={onLogout ?? (() => onDocs())}>
                {pp.navLogout}
              </Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => onDocs()}>
                {pp.heroCtaAlt}
              </Button>
            )}
          </div>
          <p className="vx-public-hero__status">
            {isSignedIn ? `${pp.signedInAs}: ${viewerName}` : pp.previewLead}
          </p>
        </section>

        <section className="vx-public-preview">
          <div className="vx-public-preview__header">
            <div className="vx-public-preview__dots">
              <span className="vx-public-preview__dot" />
              <span className="vx-public-preview__dot" />
              <span className="vx-public-preview__dot" />
            </div>
            <div className="vx-public-preview__eyebrow">{pp.navDocs}</div>
          </div>
          
          <div className="vx-public-preview__body">
            <div>
              <div className="vx-public-preview__search">
                <Search size={16} />
                <span>{t.searchPlaceholder}</span>
              </div>
              <div className="vx-public-preview__sections">
                {previewSections.map((section) => (
                  (() => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id} className="vx-public-preview__section" onClick={() => onDocs(section.id)} style={{ cursor: 'pointer' }}>
                        <span className="vx-public-preview__section-icon"><Icon size={18} /></span>
                        <div>
                          <div className="vx-public-preview__section-label">{section.label}</div>
                          <div className="vx-public-preview__section-meta">{section.meta}</div>
                        </div>
                        <ArrowRight size={16} className="vx-public-preview__section-arrow" />
                      </div>
                    );
                  })()
                ))}
              </div>
            </div>
            <div className="vx-public-preview__meta-grid">
              {metaItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="vx-public-preview__meta-card">
                    <div className="vx-public-preview__meta-title">
                      <Icon size={18} className="vx-text-primary" />
                      {item.title}
                    </div>
                    {item.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="vx-public-features">
          <p className="vx-public-section-title">{pp.featuresSectionTitle}</p>
          <div className="vx-public-features__grid">
            {features.map((feature) => (
              (() => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.key} className="vx-public-feature-card">
                    <CardHeader>
                      <div className="vx-public-feature-icon"><Icon size={24} /></div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })()
            ))}
          </div>
        </section>
      </main>

      <footer className="vx-public-footer">
        <span>{pp.footerCopy}</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://ui.vx.link"
            target="_blank"
            rel="noopener noreferrer"
            className="vx-link"
          >
            {pp.footerWebsite}
          </a>
          <a
            href="https://github.com/tmplink/vxui_react"
            target="_blank"
            rel="noopener noreferrer"
            className="vx-link"
          >
            {pp.footerGithub}
          </a>
          <button type="button" className="vx-link" onClick={onPrivacy}>
            {pp.footerPrivacy}
          </button>
        </div>
      </footer>
    </div>
  );
}
