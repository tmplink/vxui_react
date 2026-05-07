import { Boxes, Check, FileCode2, MoonStar, Palette, Zap } from 'lucide-react';
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from '../../lib';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useI18n } from '../../i18n';

interface HomePageProps {
  onLogin: () => void;
  onRegister: () => void;
  onDocs: () => void;
  onPrivacy: () => void;
}

export function HomePage({ onLogin, onRegister, onDocs, onPrivacy }: HomePageProps) {
  const { t } = useI18n();
  const pp = t.publicPages;

  const features = [
    { icon: <Check size={20} />, title: pp.feat1, desc: pp.feat1Desc },
    { icon: <Boxes size={20} />, title: pp.feat2, desc: pp.feat2Desc },
    { icon: <Palette size={20} />, title: pp.feat3, desc: pp.feat3Desc },
    { icon: <MoonStar size={20} />, title: pp.feat4, desc: pp.feat4Desc },
  ];

  return (
    <div className="vx-public">
      {/* Top nav */}
      <header className="vx-public-nav">
        <div className="vx-public-nav__brand">vxUI</div>
        <div className="vx-public-nav__links">
          <LanguageSwitcher variant="inline" />
          <button type="button" className="vx-cmd-trigger" onClick={onDocs}>
            <FileCode2 size={14} />
            {pp.navDocs}
          </button>
          <button type="button" className="vx-cmd-trigger" onClick={onLogin}>
            {pp.navLogin}
          </button>
          <Button size="sm" onClick={onRegister}>{pp.navSignup}</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="vx-public-hero">
        <Badge variant="accent" style={{ marginBottom: 16 }}>{pp.heroTag}</Badge>
        <h1 className="vx-public-hero__title">{pp.heroTitle}</h1>
        <p className="vx-public-hero__lead">{pp.heroLead}</p>
        <div className="vx-public-hero__actions">
          <Button onClick={onLogin}>
            <Zap size={15} />
            {pp.heroCta}
          </Button>
          <Button variant="secondary" onClick={onDocs}>{pp.heroCtaAlt}</Button>
        </div>
      </section>

      {/* Features */}
      <section className="vx-public-features">
        <p className="vx-public-section-title">{pp.featuresSectionTitle}</p>
        <div className="vx-public-features__grid">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <div className="vx-public-feature-icon">{f.icon}</div>
                <CardTitle style={{ marginTop: 8 }}>{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="vx-public-footer">
        <span>{pp.footerCopy}</span>
        <button type="button" className="vx-link" onClick={onPrivacy}>{pp.footerPrivacy}</button>
      </footer>
    </div>
  );
}
