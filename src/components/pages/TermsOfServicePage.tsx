import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const { t, locale } = useI18n();
  const pp = t.publicPages;

  return (
    <div className="vx-public">
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

      <main className="vx-public-main" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
          {locale === 'zh' ? '服务条款' : 'Terms of Service'}
        </h1>
        <p className="vx-muted" style={{ marginBottom: '40px' }}>
          {locale === 'zh'
            ? '最后更新时间：2026 年 5 月 8 日。'
            : 'Last updated: May 8, 2026.'}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '1. 接受条款' : '1. Acceptance of Terms'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '通过访问和使用 vxUI 框架文档与组件库测试环境，您即同意受到本服务条款的约束。如果您不同意本条款的部分或全部内容，请停止使用。'
              : 'By accessing and using the vxUI framework documentation and component library testing environment, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, please discontinue use.'}
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '2. 使用许可' : '2. License and Copyright'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '本框架及组件集代码受版权保护，并基于 Apache License 2.0 协议进行开源授权。这意味着您可以自由地使用、修改、分发甚至将其用于商业用途。相应的，您必须在分发副本中包含原始的许可声明、版权声明以及相关修改说明（如适用）。详细法律条款请直接参阅项目根目录下的 LICENSE 文件。'
              : 'The code of this framework and component set is copyrighted and open-sourced under the Apache License 2.0. This means you are free to use, modify, distribute, and even use it for commercial purposes. Accordingly, you must include the original license notice, copyright notice, and state any changes made (if applicable) in your distributions. For full legal terms, please refer directly to the LICENSE file in the root directory.'}
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '3. 免责声明' : '3. Disclaimer'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '本演示环境“按原样”提供，且不附带任何明示或暗示的保证。平台不保证组件库始终无错误地运行，亦不对您在此次体验过程中可能导致的任何后果承担法律责任。'
              : 'This demonstration environment is provided "as is", without warranty of any kind, express or implied. The platform does not guarantee that the component library will operate error-free at all times, nor shall it be liable for any consequences arising from your usage during this evaluation.'}
          </p>
        </section>
      </main>
      
      <footer className="vx-public-footer" style={{ marginTop: 'auto' }}>
        <span>{pp.footerCopy}</span>
      </footer>
    </div>
  );
}
