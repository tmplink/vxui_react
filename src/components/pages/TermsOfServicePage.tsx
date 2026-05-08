import { Badge } from '../../lib';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const { t, locale } = useI18n();
  const pp = t.publicPages;
  const sections = locale === 'zh'
    ? [
        {
          title: '1. 接受条款',
          paragraphs: [
            '通过访问和使用 vxUI 框架文档与组件库测试环境，您即同意受到本服务条款的约束。',
            '如果您不同意本条款的部分或全部内容，请停止使用。',
          ],
        },
        {
          title: '2. 使用许可',
          paragraphs: [
            '本框架及组件集代码基于 Apache License 2.0 协议进行开源授权，您可以自由使用、修改、分发并用于商业用途。',
            '分发副本时，请保留原始许可声明、版权声明以及必要的修改说明。',
          ],
        },
        {
          title: '3. 免责声明',
          paragraphs: [
            '本演示环境按原样提供，不附带任何明示或暗示的保证。',
            '平台不保证组件库始终无错误运行，也不对评估过程中造成的后果承担法律责任。',
          ],
        },
      ]
    : [
        {
          title: '1. Acceptance of Terms',
          paragraphs: [
            'By accessing and using the vxUI framework documentation and component library testing environment, you agree to be bound by these terms of service.',
            'If you disagree with any part of the terms, please discontinue use.',
          ],
        },
        {
          title: '2. License and Copyright',
          paragraphs: [
            'This framework and component set are open-sourced under Apache License 2.0, which allows usage, modification, distribution, and commercial use.',
            'When distributing copies, keep the original license notice, copyright notice, and any required modification statements.',
          ],
        },
        {
          title: '3. Disclaimer',
          paragraphs: [
            'This demonstration environment is provided as is, without warranty of any kind, express or implied.',
            'The platform does not guarantee uninterrupted or error-free operation, nor does it accept liability for consequences arising during evaluation.',
          ],
        },
      ];
  const railItems = locale === 'zh'
    ? ['允许使用与分发', '需保留原始许可声明', '演示环境按原样提供']
    : ['Use and distribution are allowed', 'Original license notices must remain', 'The demo environment is provided as is'];

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
          <Badge variant="accent">{locale === 'zh' ? '法律文档' : 'Legal document'}</Badge>
          <h1>{locale === 'zh' ? '服务条款' : 'Terms of Service'}</h1>
          <p>
            {locale === 'zh'
              ? '最后更新时间：2026 年 5 月 8 日。以下条款适用于当前响应式 UI 框架的组件演示与文档浏览环境。'
              : 'Last updated: May 8, 2026. The clauses below apply to the current responsive UI framework demo and documentation environment.'}
          </p>
          <div className="vx-legal-meta">
            <span>{locale === 'zh' ? '开源授权' : 'Open-source licensing'}</span>
            <span>{locale === 'zh' ? '适用于演示环境' : 'Applies to the demo environment'}</span>
          </div>
        </section>

        <div className="vx-legal-layout">
          <div className="vx-legal-main">
            {sections.map((section) => (
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
              <h3>{locale === 'zh' ? '快速摘要' : 'At a glance'}</h3>
              <ul>
                {railItems.map((item) => (
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
