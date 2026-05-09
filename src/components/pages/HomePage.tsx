import {
  ArrowRight,
  Boxes,
  FileCode2,
  MoonStar,
  Package,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
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

  const features = [
    { icon: <Package size={24} />, title: pp.feat1, desc: pp.feat1Desc },
    { icon: <Boxes size={24} />, title: pp.feat2, desc: pp.feat2Desc },
    { icon: <Palette size={24} />, title: pp.feat3, desc: pp.feat3Desc },
    { icon: <MoonStar size={24} />, title: pp.feat4, desc: pp.feat4Desc },
  ];

  const previewSections = [
    { id: 'quick-start', icon: <Zap size={18} />, label: t.pages['quick-start'], meta: t.nav.gettingStarted },
    { id: 'button', icon: <Palette size={18} />, label: t.pages.button, meta: t.nav.components },
    { id: 'mobile', icon: <Smartphone size={18} />, label: t.pages.mobile, meta: t.nav.mobile },
  ];

  return (
    <div className="vx-public">
      <header className="vx-public-nav">
        <div className="vx-public-nav__brand">
          <span className="vx-public-nav__brand-mark">vx<span>UI</span></span>
        </div>
        <div className="vx-public-nav__links">
          {isSignedIn ? (
            <span className="vx-public-nav__user">
              {pp.signedInAs}: {viewerName}
            </span>
          ) : null}
          <LanguageSwitcher variant="inline" />
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
                  <div key={section.id} className="vx-public-preview__section" onClick={() => onDocs(section.id)} style={{ cursor: 'pointer' }}>
                    <span className="vx-public-preview__section-icon">{section.icon}</span>
                    <div>
                      <div className="vx-public-preview__section-label">{section.label}</div>
                      <div className="vx-public-preview__section-meta">{section.meta}</div>
                    </div>
                    <ArrowRight size={16} className="vx-public-preview__section-arrow" />
                  </div>
                ))}
              </div>
            </div>
            <div className="vx-public-preview__meta-grid">
              <div className="vx-public-preview__meta-card">
                <div className="vx-public-preview__meta-title">
                  <ShieldCheck size={18} className="vx-text-primary" />
                  {pp.previewAccessTitle}
                </div>
                <p>{pp.previewAccessMember}</p>
                <p>{pp.previewAccessGuest}</p>
              </div>
              <div className="vx-public-preview__meta-card">
                <div className="vx-public-preview__meta-title">
                  <Smartphone size={18} className="vx-text-primary" />
                  {pp.previewMobileTitle}
                </div>
                <p>{pp.previewMobileLead}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="vx-public-features">
          <p className="vx-public-section-title">{pp.featuresSectionTitle}</p>
          <div className="vx-public-features__grid">
            {features.map((feature) => (
              <Card key={feature.title} className="vx-public-feature-card">
                <CardHeader>
                  <div className="vx-public-feature-icon">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="vx-public-footer">
        <span>{pp.footerCopy}</span>
        <button type="button" className="vx-link" onClick={onPrivacy}>
          {pp.footerPrivacy}
        </button>
      </footer>
    </div>
  );
}
