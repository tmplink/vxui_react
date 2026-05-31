/**
 * MobileLegalContent — 移动端法律页面（隐私政策/服务条款）
 */
import { Badge } from '../../components/Badge';
import { Check } from 'lucide-react';
import { MobileList, MobileListSection, MobileListItem } from '../../components/mobile/MobileList';

interface LegalContent {
  badgeLabel: string;
  title: string;
  lead: string;
  meta: string[];
  summaryTitle: string;
  summaryItems: string[];
  sections: Array<{ title: string; paragraphs: string[] }>;
}

interface MobileLegalContentProps {
  content: LegalContent;
  footerCopy: string;
}

export function MobileLegalContent({ content, footerCopy }: MobileLegalContentProps) {
  return (
    <div className="vxm-legal-page">
      <div className="vxm-legal-page__hero">
        <Badge variant="accent">{content.badgeLabel}</Badge>
        <h1 className="vxm-legal-page__title">{content.title}</h1>
        <p className="vxm-legal-page__lead">{content.lead}</p>
        <div className="vxm-legal-page__meta">
          {content.meta.map((item) => (
            <span key={item} className="vx-version-pill vx-version-pill--token">{item}</span>
          ))}
        </div>
      </div>

      <MobileListSection title={content.summaryTitle}>
        <MobileList className="vxm-legal-page__list">
          {content.summaryItems.map((item) => (
            <MobileListItem
              key={item}
              leading={<span className="vxm-legal-page__summary-icon"><Check size={16} /></span>}
              label={item}
            />
          ))}
        </MobileList>
      </MobileListSection>

      {content.sections.map((section) => (
        <MobileListSection key={section.title} title={section.title}>
          <div className="vxm-legal-page__section-card">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="vxm-legal-page__paragraph">{paragraph}</p>
            ))}
          </div>
        </MobileListSection>
      ))}

      <div className="vxm-legal-page__footer">{footerCopy}</div>
    </div>
  );
}
