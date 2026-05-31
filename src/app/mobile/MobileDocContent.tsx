/**
 * MobileDocContent — 移动端文档详情页
 */
import type { ReactNode, RefObject } from 'react';
import { Badge } from '../../components/Badge';
import { Card, CardContent } from '../../components/Card';
import { MobileList, MobileListItem } from '../../components/mobile/MobileList';
import { Check } from 'lucide-react';

interface PageDefinition {
  section: string;
  title: string;
  description: string;
  guidance: string[];
}

interface MobileDocContentProps {
  activeDocument: PageDefinition;
  preview: ReactNode;
  hasPreview: boolean;
  docHeaderRef: RefObject<HTMLDivElement | null>;
}

export function MobileDocContent({ activeDocument, preview, hasPreview, docHeaderRef }: MobileDocContentProps) {
  return (
    <div className="vxm-docs-page">
      {/* Page header */}
      <div ref={docHeaderRef} className="vxm-docs-page__header">
        <span className="vxm-docs-page__kicker">{activeDocument.section}</span>
        <h1 className="vxm-docs-page__title">{activeDocument.title}</h1>
        <p className="vxm-docs-page__lead">{activeDocument.description}</p>
      </div>

      {/* Component preview */}
      {hasPreview && preview && (
        <div className="vxm-docs-page__section">
          <div className="vxm-docs-page__section-title">Preview</div>
          <Card>
            <CardContent style={{ paddingTop: '1rem' }}>
              {preview}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Guidance */}
      <div className="vxm-docs-page__section">
        <div className="vxm-docs-page__section-title">Guidance</div>
        <MobileList>
          {activeDocument.guidance.map((item, i) => (
            <MobileListItem key={i} label={item} leading={<Check size={16} style={{ color: 'var(--vx-primary)' }} />} />
          ))}
        </MobileList>
      </div>

      {/* Badges */}
      <div className="vxm-docs-page__section">
        <div className="vx-inline vx-inline--wrap">
          <Badge variant="accent">Core</Badge>
          <Badge variant="success">Accessible</Badge>
          <Badge variant="warning">Documented</Badge>
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: 32 }} />
    </div>
  );
}
