/**
 * MobileHomeContent — 移动端首页内容
 */
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

interface MobileHomeContentProps {
  pp: Record<string, any>;
  features: Array<{ key: string; title: string; description: string; icon: any }>;
  onLogin: () => void;
  onDocs: () => void;
  onPrivacy: () => void;
}

export function MobileHomeContent({ pp, features, onLogin, onDocs, onPrivacy }: MobileHomeContentProps) {
  return (
    <div className="vxm-docs-home">
      <div className="vxm-docs-home__hero">
        <div className="vxm-docs-home__hero-badge">
          <Badge variant="accent">{pp.heroTag}</Badge>
        </div>
        <h1 className="vxm-docs-home__title">{pp.heroTitle}</h1>
        <p className="vxm-docs-home__lead">{pp.heroLead}</p>
        <div className="vxm-docs-home__actions">
          <Button shape="pill" onClick={onLogin} style={{ flex: 1, minHeight: 48 }}>
            {pp.heroCta}
          </Button>
          <Button variant="secondary" shape="pill" onClick={onDocs} style={{ flex: 1, minHeight: 48 }}>
            {pp.heroCtaAlt}
          </Button>
        </div>
      </div>
      <div className="vxm-docs-home__bottom">
        <div className="vxm-docs-home__chips">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.key} className="vxm-docs-home__chip">
                <div className="vxm-docs-home__chip-icon"><Icon size={16} /></div>
                <div className="vxm-docs-home__chip-body">
                  <span className="vxm-docs-home__chip-label">{feature.title}</span>
                  <span className="vxm-docs-home__chip-desc">{feature.description}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="vxm-docs-home__footer">
          <span className="vxm-docs-home__footer-copy">{pp.footerCopy}</span>
          <button type="button" className="vxm-docs-home__footer-link" onClick={onPrivacy}>
            {pp.footerPrivacy}
          </button>
        </div>
      </div>
    </div>
  );
}
