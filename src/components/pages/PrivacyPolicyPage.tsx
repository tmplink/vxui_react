import { Badge } from '../../lib';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const { t, locale } = useI18n();
  const pp = t.publicPages;
  const sections = locale === 'zh'
    ? [
        {
          title: '1. 信息收集',
          paragraphs: [
            '为了向您提供框架文档的交互演示及保存您的最终偏好设置，我们会收集必要的最小范围数据，例如您的注册邮箱、基本访问记录以及设备的屏幕尺寸，用于响应式页面适配呈现。',
            '这些信息仅在您自愿完成注册或主动使用特定交互功能时被提取与暂存。',
          ],
        },
        {
          title: '2. 信息用途',
          paragraphs: [
            '您的数据仅用于验证会话状态、管理路由权限以及优化测试用例环境中的操作体验。',
            '我们不会向任何外部或第三方机构出售、透露您的数据，也不会将其用于分析型商业广告投放。',
          ],
        },
        {
          title: '3. 存储与安全',
          paragraphs: [
            '登录凭证和会话将以本地化的安全方式被存放于您的浏览器，例如 LocalStorage。退出登录后，相应的临时记录会立即被移除。',
            '请不要在此类交互评估环境中使用您在真实涉密业务系统中的常用密码。',
          ],
        },
        {
          title: '4. 更新机制',
          paragraphs: [
            '如果本隐私政策发生实质性修订，我们会在框架系统主页或访问入口处展示明显的更新提示。',
          ],
        },
      ]
    : [
        {
          title: '1. Data Collection',
          paragraphs: [
            'To provide interactive framework demos and preserve your final preferences, we collect the minimum necessary data such as your registration email, basic access logs, and device screen sizes for responsive presentation.',
            'This information is only captured or cached when you voluntarily register or actively use specific interactive features.',
          ],
        },
        {
          title: '2. Data Usage',
          paragraphs: [
            'Your data is only used to validate session state, manage route access, and improve the workflow inside the testing environment.',
            'We do not sell or disclose your data to any external party, and we do not use it for targeted advertising.',
          ],
        },
        {
          title: '3. Storage and Security',
          paragraphs: [
            'Credentials and sessions are stored using localized browser mechanisms such as LocalStorage. Once you log out, the temporary records are removed immediately.',
            'Do not reuse passwords that you rely on for real confidential business systems inside this evaluation environment.',
          ],
        },
        {
          title: '4. Policy Updates',
          paragraphs: [
            'If this privacy policy is materially updated, the framework homepage and entry points will show a clear update notice.',
          ],
        },
      ];
  const railItems = locale === 'zh'
    ? ['仅收集必要数据', '本地化保存会话', '更新会在入口显著提示']
    : ['Only minimum data is collected', 'Sessions are stored locally', 'Updates are announced at the entry points'];

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
          <h1>{locale === 'zh' ? '隐私政策' : 'Privacy Policy'}</h1>
          <p>
            {locale === 'zh'
              ? '最后更新时间：2026 年 5 月 8 日。请阅读以下内容，了解该响应式 UI 框架演示环境如何处理您的数据。'
              : 'Last updated: May 8, 2026. Review the sections below to understand how this responsive UI framework demo handles your data.'}
          </p>
          <div className="vx-legal-meta">
            <span>{locale === 'zh' ? '适用于演示环境' : 'Applies to the demo environment'}</span>
            <span>{locale === 'zh' ? '覆盖桌面 / 平板 / 手机' : 'Covers desktop / tablet / phone'}</span>
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
