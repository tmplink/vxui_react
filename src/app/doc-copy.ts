/**
 * doc-copy — 文档应用文案
 * 从 DesktopApp.tsx 提取，包含中英文双语文案对象
 */

export interface DocsCopy {
  docsBadge: string;
  docsTitle: string;
  docsLead: string;
  docsPrimary: string;
  docsSecondary: string;
  splitTitle: string;
  splitBody: string;
  libraryTitle: string;
  libraryLead: string;
  supportTitle: string;
  supportCards: Array<{ label: string; accent: string; description: string }>;
  architectureTitle: string;
  architectureLead: string;
  architectureBullets: string[];
  rolloutTitle: string;
  rolloutItems: Array<{ key: string; title: string; content: string }>;
  releaseLabel: string;
  releaseOptions: { stable: string; preview: string; internal: string };
  contentMapTitle: string;
  metrics: { templates: string; templatesDesc: string; docs: string; docsDesc: string; breakpoints: string; breakpointsDesc: string; themes: string; themesDesc: string };
  livePreview: string;
  openPage: string;
  deliveryTitle: string;
  responsiveTitle: string;
  responsiveChecklist: string[];
  runtimeTitle: string;
  runtimeDesc: string;
  sessionMember: string;
  sessionGuest: string;
  accountMenu: string;
}

export interface DocsHomeCopy {
  badge: string;
  title: string;
  lead: string;
  primary: string;
  secondary: string;
  pathTitle: string;
  pathBody: string;
  indexTitle: string;
  indexLead: string;
  sectionsTitle: string;
  sectionsLead: string;
  pathsTitle: string;
  pathsLead: string;
  rulesTitle: string;
  rulesLead: string;
  rulesItems: string[];
  toolsTitle: string;
  toolsLead: string;
  toolsItems: string[];
  openSection: string;
  entryCount: string;
  walkthroughTitle: string;
  walkthroughItems: string[];
  adoptionTitle: string;
  adoptionItems: Array<{ key: string; title: string; content: string }>;
}

export function getDocsCopy(isZh: boolean): DocsCopy {
  return isZh ? {
    docsBadge: '统一响应式 UI 框架',
    docsTitle: '一套资源，覆盖手机、平板与桌面',
    docsLead: '首页、登录页、注册页、错误页、隐私政策、服务条款和文档内容库全部运行在同一套路由、同一套布局壳层与同一套设计 Token 上。',
    docsPrimary: '查看快速开始',
    docsSecondary: '返回首页',
    splitTitle: '不再维护独立移动端应用',
    splitBody: '手机端通过抽屉导航、一列排版和内容重排适配，而不是切换到另一套 /m 路由和另一套页面组件。',
    libraryTitle: '文档内容库',
    libraryLead: '每个章节都可搜索、可预览、可直接打开真实页面。',
    supportTitle: '响应式支撑',
    supportCards: [
      { label: '手机', accent: '单列', description: '关键操作保持在拇指可达区域，侧边导航收拢为抽屉，内容卡片自然堆叠。' },
      { label: '平板', accent: '双列', description: '保留文档上下文与工具区，同时把表单、统计卡和内容区平衡到双列结构。' },
      { label: '桌面', accent: '三轨', description: '支持长文档、实时预览和控制面板并行出现，无需复制组件与状态管理。' },
    ],
    architectureTitle: '统一信息架构',
    architectureLead: '搜索、导航、预览和页面跳转绑定到同一个内容模型，不再分裂成两套应用。',
    architectureBullets: [
      '桌面端保留常驻导航和工具栏，适合长文档浏览。',
      '平板端压缩密度与栅格，不改动页面层级和数据源。',
      '手机端将侧边栏转成抽屉，仍然使用同一套路由和组件。',
    ],
    rolloutTitle: '落地方式',
    rolloutItems: [
      { key: 'shell', title: '统一入口', content: '入口只渲染一个 App，所有设备共享同一套路由解析和状态管理。' },
      { key: 'pages', title: '统一页面树', content: '首页、认证页、错误页、法务页和文档页全部保留在同一个页面树中。' },
      { key: 'shell-responsive', title: '统一壳层响应式', content: '侧边栏在窄屏收为抽屉，顶部工具区自动换行，内容从多列过渡为单列。' },
    ],
    releaseLabel: '发布轨道',
    releaseOptions: { stable: '稳定版', preview: '预览版', internal: '内部版' },
    contentMapTitle: '内容地图',
    metrics: {
      templates: '模板页面', templatesDesc: '首页、认证、错误与法务',
      docs: '文档条目', docsDesc: '单一内容树驱动导航与搜索',
      breakpoints: '断点层级', breakpointsDesc: '手机 / 平板 / 桌面',
      themes: '主题预设', themesDesc: '统一作用于全站',
    },
    livePreview: '实时预览',
    openPage: '打开完整页面',
    deliveryTitle: '交付清单',
    responsiveTitle: '响应式检查',
    responsiveChecklist: [
      '主操作是否在 390px 宽度下仍位于首屏可见区域。',
      '文档导航是否从常驻侧栏平滑转为抽屉，不复制状态。',
      '卡片、表格和表单是否可从三列过渡为单列而不溢出。',
    ],
    runtimeTitle: '控制台',
    runtimeDesc: '把主题、密度和会话状态视为全局能力，而不是页面特例。',
    sessionMember: '成员视图',
    sessionGuest: '访客视图',
    accountMenu: '账户',
  } : {
    docsBadge: 'Unified Responsive UI Framework',
    docsTitle: 'One resource system for phone, tablet, and desktop',
    docsLead: 'The home page, login, register, error, privacy policy, terms of service, and documentation library now run on one route tree, one layout shell, and one token system.',
    docsPrimary: 'Open Quick Start',
    docsSecondary: 'Back to Home',
    splitTitle: 'No separate mobile application anymore',
    splitBody: 'Phone layouts now adapt through drawer navigation, single-column composition, and content reflow instead of switching to a second /m route tree.',
    libraryTitle: 'Documentation Library',
    libraryLead: 'Every section is searchable, previewable, and linked to the full live page.',
    supportTitle: 'Responsive Support',
    supportCards: [
      { label: 'Phone', accent: 'Single column', description: 'Primary actions stay thumb-reachable, the sidebar becomes a drawer, and cards stack without losing hierarchy.' },
      { label: 'Tablet', accent: 'Two columns', description: 'The shell keeps context visible while forms, stats, and content rebalance into comfortable two-column compositions.' },
      { label: 'Desktop', accent: 'Three tracks', description: 'Long-form docs, live previews, and controls can sit side by side without duplicating components or state.' },
    ],
    architectureTitle: 'Unified Information Architecture',
    architectureLead: 'Search, navigation, previews, and route changes are all driven by the same content model instead of two different apps.',
    architectureBullets: [
      'Desktop keeps persistent navigation and a utility-rich header for long-form browsing.',
      'Tablet compresses density and grid structure without changing routes or data sources.',
      'Phone turns the sidebar into a drawer while keeping the same components and route ownership.',
    ],
    rolloutTitle: 'How It Lands',
    rolloutItems: [
      { key: 'shell', title: 'Single entry point', content: 'The entry now renders one App, so every device shares the same route parsing and state model.' },
      { key: 'pages', title: 'Single page tree', content: 'Home, auth, error, and legal docs remain in one page tree instead of being copied for mobile.' },
      { key: 'shell-responsive', title: 'Responsive shell', content: 'The sidebar collapses into a drawer on narrow screens, the top bar wraps, and content shifts from multi-column to single-column layouts.' },
    ],
    releaseLabel: 'Release Track',
    releaseOptions: { stable: 'Stable', preview: 'Preview', internal: 'Internal' },
    contentMapTitle: 'Content Map',
    metrics: {
      templates: 'Template screens', templatesDesc: 'Home, auth, error, and legal',
      docs: 'Doc entries', docsDesc: 'One content tree drives nav and search',
      breakpoints: 'Breakpoints', breakpointsDesc: 'Phone / tablet / desktop',
      themes: 'Theme presets', themesDesc: 'Applied across the whole app',
    },
    livePreview: 'Live preview',
    openPage: 'Open full page',
    deliveryTitle: 'Delivery Checklist',
    responsiveTitle: 'Responsive Checklist',
    responsiveChecklist: [
      'Keep the primary action visible within a 390px viewport.',
      'Turn docs navigation into a drawer instead of duplicating route state.',
      'Let cards, forms, and tables reflow from three columns to one without overflow.',
    ],
    runtimeTitle: 'Control Panel',
    runtimeDesc: 'Treat theme, density, and session state as app-wide capabilities instead of page-specific exceptions.',
    sessionMember: 'Member view',
    sessionGuest: 'Guest view',
    accountMenu: 'Account',
  };
}

export function getDocsHomeCopy(isZh: boolean): DocsHomeCopy {
  return isZh ? {
    badge: 'Documentation',
    title: 'VXUI React 文档',
    lead: '文档入口按标准组件库目录组织：先看介绍，再完成安装，然后进入组件、模板和响应式模式。',
    primary: '阅读简介',
    secondary: '开始安装',
    pathTitle: '推荐顺序',
    pathBody: '首次接入建议按照 介绍 -> 安装 -> 组件 -> 模板 -> 响应式 的顺序浏览。',
    indexTitle: 'Documentation Index',
    indexLead: '五个标准入口覆盖整个文档库，避免把概念、接入方式和页面模板混在一起。',
    sectionsTitle: '按章节浏览',
    sectionsLead: '使用更标准的文档分层，让用户先找到"看什么"，再决定"怎么用"。',
    pathsTitle: '推荐阅读路径',
    pathsLead: '不同任务从不同入口进入，但都落在同一套文档结构里。',
    rulesTitle: '全局约定',
    rulesLead: '规则性的说明适合集中放在首页，避免在每个组件页和模板页重复出现。',
    rulesItems: [
      '保持所有断点上的路由树一致，只调整壳层结构和内容密度。',
      '在窄屏上把常驻侧边导航转成抽屉，而不是复制另一套页面实现。',
      '让卡片、表单和表格从多列到单列平滑重排，不改变组件归属。',
    ],
    toolsTitle: '文档级控制',
    toolsLead: '主题、密度和搜索属于全局工具，应放在文档工具栏统一控制，而不是在每个章节底部重复渲染。',
    toolsItems: [
      '主题切换统一放在顶部工具栏的 Theme 菜单中。',
      '紧凑模式通过顶部工具栏的密度切换按钮统一开关。',
      '详情页默认只保留 Guidance、Preview 和 Code Example 三个核心区块。',
    ],
    openSection: '打开章节',
    entryCount: '个条目',
    walkthroughTitle: '首次接入',
    walkthroughItems: [
      '先看简介，明确这套组件库的边界和目标。',
      '进入安装章节，完成样式引入、Provider 挂载和第一个页面。',
      '再浏览组件章节，按布局、表单、反馈和数据展示逐步接入。',
    ],
    adoptionTitle: '常见使用路径',
    adoptionItems: [
      { key: 'product', title: '搭业务页面', content: '从安装开始，然后进入 Components，优先看 Shell、Form Controls、Data Display。' },
      { key: 'marketing', title: '搭公共页面', content: '先看 Templates，再回到 Components 补充按钮、表单和反馈细节。' },
      { key: 'responsive', title: '做多端适配', content: '最后看 Responsive，确认同一套路由和内容在窄屏下如何重排。' },
    ],
  } : {
    badge: 'Documentation',
    title: 'VXUI React Documentation',
    lead: 'The docs entry is now organized like a standard UI library: introduction first, installation next, then components, templates, and responsive patterns.',
    primary: 'Read introduction',
    secondary: 'Start installation',
    pathTitle: 'Recommended order',
    pathBody: 'For a first pass, follow Introduction -> Installation -> Components -> Templates -> Responsive.',
    indexTitle: 'Documentation Index',
    indexLead: 'Five standard entry points cover the whole library so concepts, setup, and page examples no longer compete on the same screen.',
    sectionsTitle: 'Browse by Section',
    sectionsLead: 'Use a more standard information architecture so people can find what to read before deciding how to apply it.',
    pathsTitle: 'Recommended Paths',
    pathsLead: 'Different tasks start from different entry points, but they all land in the same documentation structure.',
    rulesTitle: 'Global Conventions',
    rulesLead: 'Rule-oriented guidance belongs on the docs entry page so it does not repeat across every component or template page.',
    rulesItems: [
      'Keep one route tree across breakpoints and only adapt shell structure and density.',
      'Turn persistent side navigation into a drawer on narrow screens instead of duplicating page implementations.',
      'Let cards, forms, and tables reflow from multiple columns to one without changing component ownership.',
    ],
    toolsTitle: 'Documentation Controls',
    toolsLead: 'Theme, density, and search are global documentation tools, so they belong in the toolbar instead of being repeated at the bottom of every page.',
    toolsItems: [
      'Theme switching lives in the top toolbar Theme menu.',
      'Compact density is controlled through the toolbar density toggle.',
      'Detail pages now keep only Guidance, Preview, and Code Example as the core content blocks.',
    ],
    openSection: 'Open section',
    entryCount: 'entries',
    walkthroughTitle: 'First integration',
    walkthroughItems: [
      'Read the introduction to understand the goals and boundaries of the library.',
      'Move to installation to import styles, mount providers, and ship the first page.',
      'Browse components next, starting with shell, form controls, feedback, and data display.',
    ],
    adoptionTitle: 'Common reading paths',
    adoptionItems: [
      { key: 'product', title: 'Build product screens', content: 'Start with Installation, then move into Components, especially Shell, Form Controls, and Data Display.' },
      { key: 'marketing', title: 'Build public pages', content: 'Start from Templates, then return to Components to refine actions, forms, and feedback.' },
      { key: 'responsive', title: 'Ship across devices', content: 'Finish with Responsive to verify how the same route tree and content reflow at smaller widths.' },
    ],
  };
}
