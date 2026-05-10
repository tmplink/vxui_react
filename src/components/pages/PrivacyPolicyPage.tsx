import { Badge } from '../../lib';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { getPrivacyPolicyContent } from './legalPageContent';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const { t, locale } = useI18n();
  const pp = t.publicPages;
  const content = getPrivacyPolicyContent(locale);

  return (
    <div className="vx-public vx-legal-page">
      <header className="vx-public-nav">
        <div className="vx-public-nav__brand">
          <span className="vx-public-nav__brand-mark">vx<span>UI</span></span>
        </div>
        <div className="vx-public-nav__links">
          <LanguageSwitcher variant="inline" />
          <button type="button" className="vx-cmd-trigger" onClick={onBack}>
            {pp.backHome}
          </button>
        </div>
      </header>

      <main className="vx-legal-shell">
        <section className="vx-legal-hero">
          <Badge variant="accent">{content.badgeLabel}</Badge>
          <h1>{content.title}</h1>
          <p>{content.lead}</p>
          <div className="vx-legal-meta">
            {content.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <div className="vx-legal-layout">
          <div className="vx-legal-main">
            {content.sections.map((section) => (
              <section key={section.title} className="vx-legal-section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <aside className="vx-legal-rail">
            <div className="vx-legal-rail__card">
              <h3>{content.summaryTitle}</h3>
              <ul>
                {content.summaryItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <footer className="vx-public-footer">
        <span>{pp.footerCopy}</span>
      </footer>
    </div>
  );
}
