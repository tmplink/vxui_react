export interface LegalPageSection {
  title: string;
  paragraphs: string[];
}

export interface LegalPageContent {
  badgeLabel: string;
  title: string;
  lead: string;
  meta: string[];
  summaryTitle: string;
  summaryItems: string[];
  sections: LegalPageSection[];
}

export function getPrivacyPolicyContent(locale: string): LegalPageContent {
  const isZh = locale === 'zh';

  return {
    badgeLabel: isZh ? '法律文档' : 'Legal document',
    title: isZh ? '隐私政策' : 'Privacy Policy',
    lead: isZh
      ? '最后更新时间：2026 年 5 月 8 日。请阅读以下内容，了解该响应式 UI 框架演示环境如何处理您的数据。'
      : 'Last updated: May 8, 2026. Review the sections below to understand how this responsive UI framework demo handles your data.',
    meta: isZh
      ? ['适用于演示环境', '覆盖桌面 / 平板 / 手机']
      : ['Applies to the demo environment', 'Covers desktop / tablet / phone'],
    summaryTitle: isZh ? '快速摘要' : 'At a glance',
    summaryItems: isZh
      ? ['仅收集必要数据', '本地化保存会话', '更新会在入口显著提示']
      : ['Only minimum data is collected', 'Sessions are stored locally', 'Updates are announced at the entry points'],
    sections: isZh
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
            paragraphs: ['如果本隐私政策发生实质性修订，我们会在框架系统主页或访问入口处展示明显的更新提示。'],
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
            paragraphs: ['If this privacy policy is materially updated, the framework homepage and entry points will show a clear update notice.'],
          },
        ],
  };
}

export function getTermsOfServiceContent(locale: string): LegalPageContent {
  const isZh = locale === 'zh';

  return {
    badgeLabel: isZh ? '法律文档' : 'Legal document',
    title: isZh ? '服务条款' : 'Terms of Service',
    lead: isZh
      ? '最后更新时间：2026 年 5 月 8 日。以下条款适用于当前响应式 UI 框架的组件演示与文档浏览环境。'
      : 'Last updated: May 8, 2026. The clauses below apply to the current responsive UI framework demo and documentation environment.',
    meta: isZh
      ? ['开源授权', '适用于演示环境']
      : ['Open-source licensing', 'Applies to the demo environment'],
    summaryTitle: isZh ? '快速摘要' : 'At a glance',
    summaryItems: isZh
      ? ['允许使用与分发', '需保留原始许可声明', '演示环境按原样提供']
      : ['Use and distribution are allowed', 'Original license notices must remain', 'The demo environment is provided as is'],
    sections: isZh
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
        ],
  };
}
