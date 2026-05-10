import {
  Boxes,
  MoonStar,
  Package,
  Palette,
  ShieldCheck,
  Smartphone,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Translations } from '../../i18n';

export interface PublicHomeFeature {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface PublicHomePreviewSection {
  id: string;
  icon: LucideIcon;
  label: string;
  meta: string;
}

export interface PublicHomeMetaItem {
  key: string;
  icon: LucideIcon;
  title: string;
  lines: string[];
}

export function getPublicHomeContent(t: Translations) {
  const pp = t.publicPages;

  const features: PublicHomeFeature[] = [
    { key: 'zero-deps', icon: Package, title: pp.feat1, description: pp.feat1Desc },
    { key: 'components', icon: Boxes, title: pp.feat2, description: pp.feat2Desc },
    { key: 'themeable', icon: Palette, title: pp.feat3, description: pp.feat3Desc },
    { key: 'dark-mode', icon: MoonStar, title: pp.feat4, description: pp.feat4Desc },
  ];

  const previewSections: PublicHomePreviewSection[] = [
    { id: 'quick-start', icon: Zap, label: t.pages['quick-start'], meta: t.nav.gettingStarted },
    { id: 'button', icon: Palette, label: t.pages.button, meta: t.nav.components },
    { id: 'mobile', icon: Smartphone, label: t.pages.mobile, meta: t.nav.mobile },
  ];

  const metaItems: PublicHomeMetaItem[] = [
    {
      key: 'access-modes',
      icon: ShieldCheck,
      title: pp.previewAccessTitle,
      lines: [pp.previewAccessMember, pp.previewAccessGuest],
    },
    {
      key: 'mobile-ready',
      icon: Smartphone,
      title: pp.previewMobileTitle,
      lines: [pp.previewMobileLead],
    },
  ];

  return {
    features,
    previewSections,
    metaItems,
  };
}
