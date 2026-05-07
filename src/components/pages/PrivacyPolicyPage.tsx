import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
          {locale === 'zh' ? '隐私政策' : 'Privacy Policy'}
        </h1>
        <p className="vx-muted" style={{ marginBottom: '40px' }}>
          {locale === 'zh'
            ? '最后更新时间：2026 年 5 月 8 日。请仔细阅读以下内容，了解我们将如何处理您的数据。'
            : 'Last updated: May 8, 2026. Please read the following carefully to understand how your data is handled.'}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '1. 信息收集' : '1. Data Collection'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '为了向您提供框架文档的交互演示及保存您的最终偏好设置，我们会收集必要的最小范围数据，例如您的注册邮箱、基本访问记录以及设备的屏幕尺寸（用于响应式页面适配呈现）。'
              : 'To provide you with interactive demonstrations of the framework documentation and to save your user preferences, we collect the minimum necessary data, such as your registration email, access logs, and your device screen sizes (for responsive UI adaptation).'}
          </p>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '这些信息仅在您自愿完成注册或主动使用特定交互功能时被提取与暂存。'
              : 'This information is only collected or cached when you voluntarily complete registration or actively use specific features.'}
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '2. 信息的用途' : '2. Data Usage'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '您的数据仅用于验证会话状态、管理路由权限以及为您优化在测试用例环境中的操作体验。我们不会向任何外部或第三方机构出售、透露您的数据，更不会将其用于分析型商业广告的投放。'
              : 'Your data is solely used to verify session states, manage route permissions, and to optimize the operational experience within our test case environments. We do not sell or provide your data to any external third party, nor do we use it for targeted advertising placements.'}
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '3. 存储与安全' : '3. Data Security'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '考虑到这本身是一个主要用于演示与开发套件校验的轻量级前端环境，有关登录凭证和会话将会以本地化的安全方式被存放于您的客户端浏览器（比如 LocalStorage）。为了保障绝对的安全，当您主动采取“退出登录”后，相应的临时记录将被随即移除。我们同时在此强烈建议：尽管如此，请不要在此类用于交互评估的环境中使用您日常用于其他真实涉密业务系统中的真实密码。'
              : 'Given that this is fundamentally a lightweight front-end environment intended for demonstrations and UI validation, login credentials and sessions are stored using localized mechanisms in your client browser (e.g., LocalStorage). To ensure absolute security, corresponding temporary records will be actively removed once you "log out". We strongly advise against entering passwords here that you conventionally use in other real-world, confidential business systems.'}
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {locale === 'zh' ? '4. 隐私政策的更新调整' : '4. Policy Updates and Adjustments'}
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '12px', fontSize: '1.05rem', color: 'var(--vx-text)' }}>
            {locale === 'zh'
              ? '随着项目设计与能力迭代，如果本隐私政策发生了部分实质性修订，我们不会主动向您逐一发送系统邮件，但会在框架系统的主页或访问根目录下的醒目位置向您展示更新与调整相关的提示。'
              : 'As part of our project design and capability iterations, should there be any substantive amendments to this Privacy Policy, we will not proactively email individual users but will instead prominently display update notices and notifications on our framework\'s homepage or root directory location.'}
          </p>
        </section>
      </main>

      <footer className="vx-public-footer" style={{ marginTop: 'auto' }}>
        <span>{pp.footerCopy}</span>
      </footer>
    </div>
  );
}
