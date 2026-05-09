import { createContext, useContext, useState, type ReactNode } from 'react';

// ──────────────────────────────────────────────────────────
// Translation shape
// ──────────────────────────────────────────────────────────
export interface Translations {
  locale: string;
  label: string;           // display name, e.g. "English" / "中文"

  // CommandPalette
  searchPlaceholder: string;
  searchAriaLabel: string;
  searchEmpty: (query: string) => string;
  searchNavigate: string;
  searchGo: string;
  searchClose: string;

  // AppShell sidebar toggle
  sidebarCollapse: string;
  sidebarExpand: string;
  sidebarCloseLabel: string;

  // Topbar / header actions
  searchTrigger: string;
  versionLabel: string;
  mobilePreview: string;

  // Nav section titles
  nav: {
    gettingStarted: string;
    layout: string;
    components: string;
    feedback: string;
    navigation: string;
    mobile: string;
    templates: string;
  };

  // Nav item labels
  pages: {
    introduction: string;
    'quick-start': string;
    'shell-sidebar': string;
    'grid-page': string;
    button: string;
    elements: string;
    'form-controls': string;
    'form-inputs': string;
    overlays: string;
    'data-display': string;
    navigation: string;
    'data-list': string;
    'empty-states': string;
    toasts: string;
    feedback: string;
    'nav-layout': string;
    mobile: string;
    'home-page': string;
    'login-page': string;
    'register-page': string;
    'error-page': string;
    'privacy-policy': string;
    'terms-of-service': string;
  };

  // Page content
  docs: {
    guidance: string;
    guidanceDesc: string;
    preview: string;
    previewDesc: string;
    notes: string;
    primaryTheme: string;
    primaryThemeDesc: string;
    tokenScale: string;
    tokenScaleDesc: string;
    themeStudio: string;
    themeStudioDesc: string;
    liveControls: string;
    liveControlsDesc: string;
    searchDocs: string;
    searchDocsPlaceholder: string;
    compactDensity: string;
    compactDensityDesc: string;
    systemPreview: string;
    openSection: string;
  };

  // Introduction page
  intro: {
    tagline: string;
    getStarted: string;
    browseComponents: string;
    atAGlance: string;
    designTokens: string;
    designTokensLead: string;
    componentFamilies: string;
  };

  // Glance cards
  glance: {
    zeroDeps: string;
    zeroDepsHint: string;
    components: string;
    componentsHint: string;
    coreCSS: string;
    coreCSSHint: string;
    darkMode: string;
    darkModeHint: string;
  };

  // Token descriptions
  tokens: {
    primary: string;
    primaryDesc: string;
    surface: string;
    surfaceDesc: string;
    border: string;
    borderDesc: string;
    text: string;
    textDesc: string;
  };

  // Component families
  families: {
    layout: string;
    layoutDesc: string;
    elements: string;
    elementsDesc: string;
    forms: string;
    formsDesc: string;
    feedback: string;
    feedbackDesc: string;
  };

  // Data list
  dataList: {
    name: string;
    kind: string;
    updated: string;
  };

  // Mode label
  modeLabel: (mode: string) => string;

  // Public pages (home, login, register)
  publicPages: {
    navLogin: string;
    navSignup: string;
    navDocs: string;
    navLogout: string;
    heroTag: string;
    heroTitle: string;
    heroLead: string;
    heroCta: string;
    heroCtaAlt: string;
    previewLead: string;
    previewAccessTitle: string;
    previewAccessMember: string;
    previewAccessGuest: string;
    previewMobileTitle: string;
    previewMobileLead: string;
    featuresSectionTitle: string;
    feat1: string; feat1Desc: string;
    feat2: string; feat2Desc: string;
    feat3: string; feat3Desc: string;
    feat4: string; feat4Desc: string;
    footerCopy: string;
    footerPrivacy: string;
    loginTitle: string;
    loginSubtitle: string;
    loginEmail: string;
    loginEmailPlaceholder: string;
    loginPassword: string;
    loginPasswordPlaceholder: string;
    loginCta: string;
    loginNoAccount: string;
    loginRegister: string;
    loginGuest: string;
    rememberMe: string;
    showPassword: string;
    hidePassword: string;
    authInfoTitle: string;
    authInfoBody: string;
    registerTitle: string;
    registerSubtitle: string;
    registerName: string;
    registerNamePlaceholder: string;
    registerEmail: string;
    registerEmailPlaceholder: string;
    registerPassword: string;
    registerPasswordPlaceholder: string;
    registerTermsAgree: string;
    registerTermsLink: string;
    registerTermsAnd: string;
    registerPrivacyLink: string;
    registerCta: string;
    registerHasAccount: string;
    registerLogin: string;
    registerGuest: string;
    validationNameRequired: string;
    validationNameShort: string;
    validationEmailRequired: string;
    validationEmailInvalid: string;
    validationPasswordRequired: string;
    validationPasswordShort: string;
    validationTermsRequired: string;
    sessionLoginTitle: string;
    sessionLoginBody: string;
    sessionRegisterTitle: string;
    sessionRegisterBody: string;
    sessionGuestTitle: string;
    sessionGuestBody: string;
    sessionLogoutTitle: string;
    sessionLogoutBody: string;
    signedInAs: string;
    guestLabel: string;
    backHome: string;
    backToDocs: string;
  };

  // Page definitions (section + title + description + guidance)
  pageDefs: Record<string, {
    section: string;
    title: string;
    description: string;
    guidance: string[];
  }>;
}

// ──────────────────────────────────────────────────────────
// English
// ──────────────────────────────────────────────────────────
export const en: Translations = {
  locale: 'en',
  label: 'English',

  searchPlaceholder: 'Search components, pages, keywords…',
  searchAriaLabel: 'Search',
  searchEmpty: (q) => `No results for "${q}"`,
  searchNavigate: 'Navigate',
  searchGo: 'Go',
  searchClose: 'Close',

  sidebarCollapse: 'Collapse',
  sidebarExpand: 'Expand',
  sidebarCloseLabel: 'Close sidebar',

  searchTrigger: 'Search',
  versionLabel: 'v1.0',
  mobilePreview: 'Mobile Preview',

  nav: {
    gettingStarted: 'Getting Started',
    layout: 'Layout',
    components: 'Components',
    feedback: 'Feedback',
    navigation: 'Navigation',
    mobile: 'Responsive',
    templates: 'Templates',
  },

  pages: {
    introduction: 'Introduction',
    'quick-start': 'Quick Start',
    'shell-sidebar': 'Shell & Sidebar',
    'grid-page': 'Grid & Page',
    button: 'Button',
    elements: 'Elements',
    'form-controls': 'Form Controls',
    'form-inputs': 'Form Inputs',
    overlays: 'Overlays',
    'data-display': 'Data Display',
    navigation: 'Navigation',
    'data-list': 'Data List',
    'empty-states': 'Empty States',
    toasts: 'Toasts',
    feedback: 'Feedback Components',
    'nav-layout': 'Navigation & Layout',
    mobile: 'Mobile Components',
    'home-page': 'Home Page',
    'login-page': 'Login Page',
    'register-page': 'Register Page',
    'error-page': 'Error Page',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
  },

  docs: {
    guidance: 'Guidance',
    guidanceDesc: 'Keep the implementation tight and let the design system do most of the visual work.',
    preview: 'Preview',
    previewDesc: 'A compact example of how this area should feel inside the system.',
    notes: 'Notes',
    primaryTheme: 'Primary Theme',
    primaryThemeDesc: 'Blue-gray neutrals keep emphasis reserved for actions, not decoration.',
    tokenScale: 'Token Scale',
    tokenScaleDesc: 'Reuse the shared surface, border, and text variables before introducing page-specific styles.',
    themeStudio: 'Theme Studio',
    themeStudioDesc: 'Register named themes once, then switch every component with a single key.',
    liveControls: 'Live Controls',
    liveControlsDesc: 'A few reusable primitives are still available inside the docs surface.',
    searchDocs: 'Search docs',
    searchDocsPlaceholder: 'Buttons, tokens, layout...',
    compactDensity: 'Compact density',
    compactDensityDesc: 'Tighten the vertical rhythm for denser operator views.',
    systemPreview: 'System Preview',
    openSection: 'Open section',
  },

  intro: {
    tagline:
      'A lightweight, dependency-free UI framework for building clean admin interfaces. Design tokens, components, and a minimal SPA runtime live behind one consistent visual language.',
    getStarted: 'Get Started',
    browseComponents: 'Browse Components',
    atAGlance: 'At a Glance',
    designTokens: 'Design Tokens',
    designTokensLead:
      'All colors, spacing, and typography values are exposed as CSS custom properties under the vx namespace. Register named light and dark themes once, then swap the whole framework by theme key.',
    componentFamilies: 'Component Families',
  },

  glance: {
    zeroDeps: 'Zero dependencies',
    zeroDepsHint: 'Original shell runtime does not require a build pipeline.',
    components: 'Components',
    componentsHint: 'Layout, form, feedback, and list primitives in one system.',
    coreCSS: 'Core CSS',
    coreCSSHint: 'Neutral tokens and structural styles stay compact.',
    darkMode: 'Dark mode',
    darkModeHint: 'Semantic variables keep the same components reusable.',
  },

  tokens: {
    primary: 'Primary',
    primaryDesc: 'Accent color for primary actions, active navigation, and emphasis.',
    surface: 'Surface',
    surfaceDesc: 'Default panel and content background for documentation cards and shell regions.',
    border: 'Border',
    borderDesc: 'Light separators that keep the UI structured without adding visual weight.',
    text: 'Text',
    textDesc: 'Primary foreground used for headings, dense data, and body copy.',
  },

  families: {
    layout: 'Layout',
    layoutDesc: 'App shell, sticky header, section rhythm, and responsive content framing.',
    elements: 'Elements',
    elementsDesc: 'Quiet primitives for actions, metadata, and structured content blocks.',
    forms: 'Forms',
    formsDesc: 'Inputs, switches, dialogs, and field composition patterns.',
    feedback: 'Feedback',
    feedbackDesc: 'Transient toasts and interruptive confirmation flows.',
  },

  dataList: {
    name: 'Name',
    kind: 'Kind',
    updated: 'Updated',
  },

  modeLabel: (mode) => `${mode} mode`,

  publicPages: {
    navLogin: 'Log in',
    navSignup: 'Sign up',
    navDocs: 'Docs',
    navLogout: 'Log out',
    heroTag: 'New · v1.0',
    heroTitle: 'Build faster with vxUI',
    heroLead: 'A lightweight, dependency-free UI framework for building clean admin interfaces. Design tokens, components, and a minimal SPA runtime in one consistent visual language.',
    heroCta: 'Get started',
    heroCtaAlt: 'Browse docs',
    previewLead: 'A production-minded docs surface with direct guest access, persistent sign-in state, and mobile-ready layouts.',
    previewAccessTitle: 'Access modes',
    previewAccessMember: 'Sign in to keep a persisted session and return directly to your workspace.',
    previewAccessGuest: 'Open the docs immediately as a guest when you only need to inspect components.',
    previewMobileTitle: 'Mobile-ready',
    previewMobileLead: 'Navigation and auth layouts collapse cleanly for phones without losing hierarchy or call-to-action priority.',
    featuresSectionTitle: 'Why vxUI',
    feat1: 'Zero dependencies', feat1Desc: 'Ships as a pure CSS + TypeScript package with no peer-lib baggage.',
    feat2: '30+ components', feat2Desc: 'Layout, form, feedback, and list primitives in one cohesive system.',
    feat3: 'Themeable', feat3Desc: 'Swap the whole framework with a single theme key via CSS variables.',
    feat4: 'Dark mode', feat4Desc: 'Semantic tokens keep every component reusable across light and dark themes.',
    footerCopy: '© 2026 vxUI. All rights reserved.',
    footerPrivacy: 'Privacy Policy',
    loginTitle: 'Welcome back',
    loginSubtitle: 'Sign in to access the documentation.',
    loginEmail: 'Email',
    loginEmailPlaceholder: 'you@example.com',
    loginPassword: 'Password',
    loginPasswordPlaceholder: 'At least 8 characters',
    loginCta: 'Sign in',
    loginNoAccount: "Don't have an account?",
    loginRegister: 'Register',
    loginGuest: 'Continue without an account →',
    rememberMe: 'Remember this device',
    showPassword: 'Show',
    hidePassword: 'Hide',
    authInfoTitle: 'Guest access is available',
    authInfoBody: 'You can go straight to the docs without an account. Sign in only if you want a persisted session example.',
    registerTitle: 'Create account',
    registerSubtitle: 'Get started with vxUI today.',
    registerName: 'Full name',
    registerNamePlaceholder: 'Jane Smith',
    registerEmail: 'Email',
    registerEmailPlaceholder: 'jane@company.com',
    registerPassword: 'Password',
    registerPasswordPlaceholder: 'Create a strong password',
    registerTermsAgree: 'I agree to the',
    registerTermsLink: 'Terms of Service',
    registerTermsAnd: 'and',
    registerPrivacyLink: 'Privacy Policy',
    registerCta: 'Create account',
    registerHasAccount: 'Already have an account?',
    registerLogin: 'Sign in',
    registerGuest: 'Continue without an account →',
    validationNameRequired: 'Enter your full name.',
    validationNameShort: 'Use at least 2 characters for your name.',
    validationEmailRequired: 'Enter your email address.',
    validationEmailInvalid: 'Enter a valid email address.',
    validationPasswordRequired: 'Enter your password.',
    validationPasswordShort: 'Use at least 8 characters for the password.',
    validationTermsRequired: 'You must agree to the terms before creating an account.',
    sessionLoginTitle: 'Signed in',
    sessionLoginBody: 'Your session is active. You can now browse the docs as a signed-in user.',
    sessionRegisterTitle: 'Account created',
    sessionRegisterBody: 'Your sample account is ready and the docs are now unlocked.',
    sessionGuestTitle: 'Browsing as guest',
    sessionGuestBody: 'You entered the docs without a saved account session.',
    sessionLogoutTitle: 'Signed out',
    sessionLogoutBody: 'Your persisted session was cleared. You are back on the public site.',
    signedInAs: 'Signed in as',
    guestLabel: 'Guest',
    backHome: '← Back to home',
    backToDocs: 'Back to docs',
  },

  pageDefs: {
    introduction: {
      section: 'Introduction',
      title: 'Introduction',
      description:
        'A lightweight, dependency-free UI framework for building clean admin interfaces. Design tokens, components, and a minimal SPA runtime live behind one consistent visual language.',
      guidance: [
        'Start from the shell and navigation rhythm before styling isolated controls.',
        'Keep tokens semantic so a theme swap does not require page-specific overrides.',
        'Treat documentation, examples, and production surfaces as the same design system.',
      ],
    },
    'quick-start': {
      section: 'Installation',
      title: 'Quick Start',
      description:
        'Install the package, wrap your app with providers, and mount a page shell before composing business screens.',
      guidance: [
        'Import the shared stylesheet once near the application root.',
        'Use AppShell for product chrome and keep page content inside the main slot.',
        'Add ThemeProvider and ToastProvider only when the app needs them.',
      ],
    },
    'shell-sidebar': {
      section: 'Components',
      title: 'Shell & Sidebar',
      description:
        'The shell is responsible for sidebar hierarchy, sticky header spacing, and content width. Pages should inherit structure instead of rebuilding it.',
      guidance: [
        'Keep navigation labels short so collapsed mode stays scannable.',
        'Use section titles to separate page groups instead of visual noise.',
        'Let the content area own page-specific headings and actions.',
      ],
    },
    'grid-page': {
      section: 'Components',
      title: 'Grid & Page',
      description:
        'Use simple responsive grids for cards, tokens, and documentation blocks. The page surface should stay neutral and let content carry emphasis.',
      guidance: [
        'Prefer 12 to 16 pixel gaps for dense documentation surfaces.',
        'Reserve larger spacing for section boundaries, not every card.',
        'Keep max width constrained so long paragraphs remain readable.',
      ],
    },
    button: {
      section: 'Components',
      title: 'Button',
      description:
        'Buttons carry the primary action hierarchy for the system. Variants, sizes, and width should communicate intent without requiring extra styling.',
      guidance: [
        'Use the solid variant for the primary action in a given area.',
        'Use secondary or ghost variants for supporting actions that should stay visually quieter.',
        'Use fullWidth for stacked mobile actions or single-column forms.',
      ],
    },
    elements: {
      section: 'Components',
      title: 'Elements',
      description:
        'Buttons, badges, and cards should feel quiet by default. The primary action can be loud; everything else should support it.',
      guidance: [
        'One primary action per area is usually enough.',
        'Use badges for compact status or category metadata, not decoration.',
        'Cards should organize content without feeling like dashboards by default.',
      ],
    },
    'form-controls': {
      section: 'Components',
      title: 'Form Controls',
      description:
        'Inputs and switches need strong contrast, clear labels, and predictable vertical rhythm. Expose complexity through composition rather than one giant field component.',
      guidance: [
        'Always pair form controls with visible labels in admin surfaces.',
        'Short helper text is better than placeholder-only instruction.',
        'Confirm destructive or high-impact actions with dialog affordances.',
      ],
    },
    navigation: {
      section: 'Components',
      title: 'Navigation',
      description:
        'Navigation patterns should communicate location first, then available movement. Tabs work best for sibling views within a single page context.',
      guidance: [
        'Mirror information architecture in the control structure.',
        'Make the active state obvious without relying on color alone.',
        'Avoid mixing route navigation and local view state in one control.',
      ],
    },
    'data-list': {
      section: 'Components',
      title: 'Data List',
      description:
        'Lists and tables should prioritize scanning over ornament. Use generous alignment, light separators, and action density only where needed.',
      guidance: [
        'Align headers and row content precisely to reduce visual drift.',
        'Use subtle borders instead of heavy card chrome around every row.',
        'Reserve destructive affordances for row action groups, not inline text links.',
      ],
    },
    'empty-states': {
      section: 'Components',
      title: 'Empty States',
      description:
        'An empty state should explain what is missing, why it matters, and what the next action is. It should never feel like a dead end.',
      guidance: [
        'Name the object that is absent so users know what they are looking at.',
        'Offer one clear recovery action.',
        'Keep the visual weight lighter than success or alert feedback.',
      ],
    },
    toasts: {
      section: 'Components',
      title: 'Toasts',
      description:
        'Toasts confirm short-lived events without interrupting task flow. Keep them brief, specific, and easy to dismiss.',
      guidance: [
        'Use success and info to confirm background actions.',
        'Escalate blocking or destructive states to dialogs instead of stacking toasts.',
        'Avoid repeating the same message on every page transition.',
      ],
    },
    feedback: {
      section: 'Components',
      title: 'Feedback Components',
      description:
        'Spinner, Progress, Alert, and Skeleton give users clear signals about loading states, results, and missing content.',
      guidance: [
        'Use Spinner for short indeterminate waits; Progress for deterministic operations.',
        'Prefer Alert over toast for persistent or page-level status messages.',
        'Skeleton should match the shape of the content it replaces to reduce layout shift.',
      ],
    },
    overlays: {
      section: 'Components',
      title: 'Overlays',
      description:
        'Tooltip, Popover, and DropdownMenu layer transient content above the page without navigating away.',
      guidance: [
        'Tooltips are for supplementary text only — never interactive content.',
        'Popovers can contain forms and rich content; they require explicit close triggers.',
        'DropdownMenus should group related actions and support keyboard navigation.',
      ],
    },
    'nav-layout': {
      section: 'Components',
      title: 'Navigation & Layout',
      description:
        'Breadcrumb, Pagination, Accordion, and Separator handle location, paging, and structural rhythm.',
      guidance: [
        'Breadcrumb mirrors route depth — omit it on single-level pages.',
        'Pagination should show page count so users understand the data set size.',
        'Accordion works best for progressive disclosure, not primary navigation.',
      ],
    },
    'data-display': {
      section: 'Components',
      title: 'Data Display',
      description:
        'Avatar and Table present user identity and structured data with clear hierarchy.',
      guidance: [
        'Avatar should always have an accessible label, even when showing an image.',
        'Table supports sortable columns — delegate sort state up when the data is server-side.',
        'Use striped rows in dense tables to help eyes track across long rows.',
      ],
    },
    'form-inputs': {
      section: 'Components',
      title: 'Form Inputs',
      description:
        'Select, Checkbox, RadioGroup, Textarea, and Slider extend the form vocabulary beyond text inputs.',
      guidance: [
        'Group radio buttons with RadioGroup to share name and semantics.',
        'Slider is ideal for numeric ranges; pair it with showValue for immediate feedback.',
        'Textarea defaults to vertical resize — disable resize only in fixed-height containers.',
      ],
    },
    mobile: {
      section: 'Responsive',
      title: 'Responsive Patterns',
      description:
        'A single responsive system for phone, tablet, and desktop. One route tree, one content model, and one set of components adapt through layout instead of duplicate applications.',
      guidance: [
        'Keep the route tree identical across breakpoints; only the shell and density should change.',
        'Turn persistent side navigation into a drawer on narrow screens instead of forking the page implementation.',
        'Design cards, forms, and tables to reflow from three columns to one without changing component ownership.',
      ],
    },
    'home-page': {
      section: 'Templates',
      title: 'Home Page',
      description:
        'A landing-style home page with a hero section, key feature highlights, and primary call-to-action buttons. Suitable for product sites, internal portals, and marketing pages.',
      guidance: [
        'Keep the hero message to one compelling sentence — let the CTA do the work.',
        'Feature cards should each solve one problem, not list all capabilities.',
        'Balance a primary action with a softer secondary one to reduce decision fatigue.',
      ],
    },
    'login-page': {
      section: 'Templates',
      title: 'Login Page',
      description:
        'A minimal login form centered on the screen. Collect credentials with clear labels, visible error states, and a single primary action.',
      guidance: [
        'Never hide the password label — placeholder text alone fails accessibility.',
        'Show inline validation errors as soon as the field loses focus.',
        'Offer a password-visible toggle to reduce login friction.',
      ],
    },
    'register-page': {
      section: 'Templates',
      title: 'Register Page',
      description:
        'A registration form that collects the minimum fields needed to create an account. Reduce friction by asking only what is essential at sign-up.',
      guidance: [
        'Request only name, email, and password at registration — profile details can come later.',
        'Show password strength inline without blocking submission on minor issues.',
        'The terms-of-service checkbox must be explicit; do not pre-check it.',
      ],
    },
    'error-page': {
      section: 'Templates',
      title: 'Error Page',
      description:
        'A graceful fallback for 404, 500, and other error states. Give users a clear explanation and a direct path back to safety.',
      guidance: [
        'State the error code and a plain-language explanation — avoid technical jargon.',
        'Always provide a go-home action alongside a go-back option.',
        'Match the error page visual weight to the rest of the product, not a generic OS page.',
      ],
    },
    'privacy-policy': {
      section: 'Templates',
      title: 'Privacy Policy',
      description:
        'A structured legal document page with section headings, readable prose, and clear separators. Designed to remain accessible and scannable without sacrificing completeness.',
      guidance: [
        'Use headings to break long policy text into scannable sections.',
        'Link directly to the relevant section from any consent flow that references the policy.',
        'Version and date the policy at the top so users know when it was last updated.',
      ],
    },
    'terms-of-service': {
      section: 'Templates',
      title: 'Terms of Service',
      description:
        'A service terms page with clear headings, plain-language obligations, and a layout that stays readable from narrow phones to wide desktop viewports.',
      guidance: [
        'State the usage permission, limitations, and disclaimer in separate sections to reduce legal ambiguity.',
        'Keep the document scannable with short paragraphs and a compact summary rail.',
        'Link to the terms directly from registration and pricing flows so consent is contextual.',
      ],
    },
  },
};

// ──────────────────────────────────────────────────────────
// Chinese (Simplified)
// ──────────────────────────────────────────────────────────
export const zh: Translations = {
  locale: 'zh',
  label: '中文',

  searchPlaceholder: '搜索组件、页面、关键词…',
  searchAriaLabel: '搜索',
  searchEmpty: (q) => `未找到与"${q}"匹配的结果`,
  searchNavigate: '导航',
  searchGo: '跳转',
  searchClose: '关闭',

  sidebarCollapse: '收起',
  sidebarExpand: '展开',
  sidebarCloseLabel: '关闭侧边栏',

  searchTrigger: '搜索',
  versionLabel: 'v1.0',
  mobilePreview: '移动端预览',

  nav: {
    gettingStarted: '开始使用',
    layout: '布局',
    components: '组件',
    feedback: '反馈',
    navigation: '导航',
    mobile: '响应式',
    templates: '模板',
  },

  pages: {
    introduction: '简介',
    'quick-start': '快速开始',
    'shell-sidebar': '框架与侧边栏',
    'grid-page': '网格与页面',
    button: '按钮',
    elements: '基础元素',
    'form-controls': '表单控件',
    'form-inputs': '表单输入',
    overlays: '浮层',
    'data-display': '数据展示',
    navigation: '导航',
    'data-list': '数据列表',
    'empty-states': '空状态',
    toasts: '消息提示',
    feedback: '反馈组件',
    'nav-layout': '导航与布局',
    mobile: '移动端组件',
    'home-page': '主页',
    'login-page': '登录页',
    'register-page': '注册页',
    'error-page': '错误页',
    'privacy-policy': '隐私政策',
    'terms-of-service': '服务条款',
  },

  docs: {
    guidance: '使用指南',
    guidanceDesc: '保持实现简洁，让设计系统完成大部分视觉工作。',
    preview: '预览',
    previewDesc: '该区域在系统中呈现效果的精简示例。',
    notes: '备注',
    primaryTheme: '主色调',
    primaryThemeDesc: '蓝灰色中性调将视觉重点保留给操作，而非装饰。',
    tokenScale: 'Token 体系',
    tokenScaleDesc: '在引入页面特定样式之前，优先复用共享的 surface、border 和 text 变量。',
    themeStudio: '主题工作室',
    themeStudioDesc: '一次注册命名主题，用单个 key 即可切换所有组件。',
    liveControls: '交互控件',
    liveControlsDesc: '文档界面中仍有若干可复用的基础原语。',
    searchDocs: '搜索文档',
    searchDocsPlaceholder: '按钮、Token、布局…',
    compactDensity: '紧凑模式',
    compactDensityDesc: '收紧垂直间距，适合高密度操作界面。',
    systemPreview: '系统预览',
    openSection: '打开章节',
  },

  intro: {
    tagline:
      '一个轻量无依赖的 UI 框架，用于构建简洁的后台管理界面。设计 Token、组件和极简 SPA 运行时，统一在一套一致的视觉语言之下。',
    getStarted: '开始使用',
    browseComponents: '浏览组件',
    atAGlance: '概览',
    designTokens: '设计 Token',
    designTokensLead:
      '所有颜色、间距和字体值均以 vx 命名空间下的 CSS 自定义属性暴露。一次注册命名的亮色和暗色主题，之后通过主题 key 即可切换整个框架。',
    componentFamilies: '组件系列',
  },

  glance: {
    zeroDeps: '零依赖',
    zeroDepsHint: '原始 shell 运行时无需构建流水线。',
    components: '组件数',
    componentsHint: '布局、表单、反馈和列表原语，一套搞定。',
    coreCSS: '核心 CSS',
    coreCSSHint: '中性 Token 和结构样式保持精简。',
    darkMode: '深色模式',
    darkModeHint: '语义变量让相同组件可在多主题下复用。',
  },

  tokens: {
    primary: '主色',
    primaryDesc: '用于主要操作、活跃导航和强调的点缀色。',
    surface: '表面色',
    surfaceDesc: '文档卡片和框架区域的默认面板与内容背景色。',
    border: '边框色',
    borderDesc: '保持 UI 结构清晰且不增加视觉重量的轻量分隔色。',
    text: '文字色',
    textDesc: '用于标题、密集数据和正文的主前景色。',
  },

  families: {
    layout: '布局',
    layoutDesc: '应用框架、固定顶栏、章节节奏和响应式内容框架。',
    elements: '基础元素',
    elementsDesc: '用于操作、元数据和结构化内容块的低调原语。',
    forms: '表单',
    formsDesc: '输入框、开关、对话框和字段组合模式。',
    feedback: '反馈',
    feedbackDesc: '短暂的消息提示与打断性确认流程。',
  },

  dataList: {
    name: '名称',
    kind: '类型',
    updated: '更新时间',
  },

  modeLabel: (mode) => {
    const map: Record<string, string> = { light: '浅色', dark: '深色', black: '纯黑' };
    return `${map[mode] ?? mode}模式`;
  },

  publicPages: {
    navLogin: '登录',
    navSignup: '注册',
    navDocs: '文档',
    navLogout: '退出登录',
    heroTag: '最新 · v1.0',
    heroTitle: '用 vxUI 构建更快',
    heroLead: '一个轻量无依赖的 UI 框架，用于构建简洁的后台管理界面。设计 Token、组件和极简 SPA 运行时，统一在一套一致的视觉语言之下。',
    heroCta: '立即开始',
    heroCtaAlt: '浏览文档',
    previewLead: '一个面向生产场景的文档入口，支持直接访客访问、持久化登录状态，以及适配移动端的页面布局。',
    previewAccessTitle: '访问方式',
    previewAccessMember: '登录后可保留会话状态，下次返回时继续进入你的工作区。',
    previewAccessGuest: '如果只是查看组件，也可以直接以访客身份打开文档。',
    previewMobileTitle: '移动端可用',
    previewMobileLead: '导航和认证布局会在手机上自然折叠，不牺牲层级关系和关键行动按钮。',
    featuresSectionTitle: '为什么选择 vxUI',
    feat1: '零依赖', feat1Desc: '纯 CSS + TypeScript 包，无第三方依赖负担。',
    feat2: '30+ 组件', feat2Desc: '布局、表单、反馈和列表原语，一套搞定。',
    feat3: '可主题化', feat3Desc: '通过 CSS 变量，用单个主题 key 切换整个框架。',
    feat4: '深色模式', feat4Desc: '语义 Token 让每个组件在各主题下均可复用。',
    footerCopy: '© 2026 vxUI. 保留所有权利。',
    footerPrivacy: '隐私政策',
    loginTitle: '欢迎回来',
    loginSubtitle: '登录以访问文档。',
    loginEmail: '邮箱',
    loginEmailPlaceholder: 'you@example.com',
    loginPassword: '密码',
    loginPasswordPlaceholder: '至少 8 位字符',
    loginCta: '登录',
    loginNoAccount: '还没有账号？',
    loginRegister: '注册',
    loginGuest: '无需登录，直接继续 →',
    rememberMe: '记住这台设备',
    showPassword: '显示',
    hidePassword: '隐藏',
    authInfoTitle: '支持访客访问',
    authInfoBody: '如果你只是想查看文档，可以不登录直接进入。登录仅用于演示持久化会话的真实流程。',
    registerTitle: '创建账号',
    registerSubtitle: '立即开始使用 vxUI。',
    registerName: '姓名',
    registerNamePlaceholder: '张三',
    registerEmail: '邮箱',
    registerEmailPlaceholder: 'zhangsan@company.com',
    registerPassword: '密码',
    registerPasswordPlaceholder: '创建一个强密码',
    registerTermsAgree: '我同意',
    registerTermsLink: '服务条款',
    registerTermsAnd: '和',
    registerPrivacyLink: '隐私政策',
    registerCta: '创建账号',
    registerHasAccount: '已有账号？',
    registerLogin: '登录',
    registerGuest: '无需登录，直接继续 →',
    validationNameRequired: '请输入你的姓名。',
    validationNameShort: '姓名至少需要 2 个字符。',
    validationEmailRequired: '请输入邮箱地址。',
    validationEmailInvalid: '请输入有效的邮箱地址。',
    validationPasswordRequired: '请输入密码。',
    validationPasswordShort: '密码至少需要 8 位字符。',
    validationTermsRequired: '创建账号前必须同意条款。',
    sessionLoginTitle: '已登录',
    sessionLoginBody: '你的会话已生效，现在可以以登录用户身份查看文档。',
    sessionRegisterTitle: '账号已创建',
    sessionRegisterBody: '示例账号已创建完成，文档后台现已可用。',
    sessionGuestTitle: '当前为访客模式',
    sessionGuestBody: '你正在无账号状态下浏览文档。',
    sessionLogoutTitle: '已退出登录',
    sessionLogoutBody: '持久化会话已清除，你已返回公共首页。',
    signedInAs: '当前登录',
    guestLabel: '访客',
    backHome: '← 返回首页',
    backToDocs: '返回文档',
  },

  pageDefs: {
    introduction: {
      section: '介绍',
      title: '简介',
      description:
        '一个轻量无依赖的 UI 框架，用于构建简洁的后台管理界面。设计 Token、组件和极简 SPA 运行时，统一在一套一致的视觉语言之下。',
      guidance: [
        '先从框架和导航节奏开始，再对独立控件进行样式调整。',
        '保持 Token 语义化，主题切换时无需逐页覆盖样式。',
        '将文档、示例和生产界面视为同一套设计系统。',
      ],
    },
    'quick-start': {
      section: '安装',
      title: '快速开始',
      description: '安装包，用 Provider 包裹应用，在组合业务页面前先挂载页面框架。',
      guidance: [
        '在应用根组件附近统一引入共享样式表。',
        '使用 AppShell 承载产品外壳，页面内容保持在 main 插槽内。',
        '仅在应用需要时才添加 ThemeProvider 和 ToastProvider。',
      ],
    },
    'shell-sidebar': {
      section: '组件',
      title: '框架与侧边栏',
      description:
        'Shell 负责侧边栏层级、固定顶栏间距和内容宽度。页面应继承结构而非重新构建。',
      guidance: [
        '保持导航标签简短，以确保折叠模式下仍可快速扫读。',
        '使用章节标题分隔页面分组，而非添加视觉噪音。',
        '让内容区域自行管理页面特定的标题和操作。',
      ],
    },
    'grid-page': {
      section: '组件',
      title: '网格与页面',
      description:
        '为卡片、Token 和文档块使用简单的响应式网格。页面表面应保持中性，由内容承载视觉重点。',
      guidance: [
        '在密集文档界面中优先使用 12 至 16 像素的间距。',
        '较大间距应保留给章节边界，而非每张卡片。',
        '限制最大宽度，确保长段落保持可读性。',
      ],
    },
    button: {
      section: '组件',
      title: '按钮',
      description:
        '按钮承担系统中的主操作层级。变体、尺寸和宽度应该直接表达操作意图，而不需要额外拼样式。',
      guidance: [
        '在同一区域内，实心按钮通常只保留给一个主操作。',
        '次级和幽灵按钮更适合辅助动作，避免和主操作竞争视觉优先级。',
        '在移动端单列布局或堆叠表单中，优先使用 fullWidth 提升点击面积。',
      ],
    },
    elements: {
      section: '组件',
      title: '基础元素',
      description: '按钮、徽章和卡片默认应保持低调。主要操作可以突出，其余元素应配合支撑。',
      guidance: [
        '每个区域通常一个主操作就足够了。',
        '徽章用于紧凑的状态或分类元数据，而非纯装饰。',
        '卡片应组织内容，默认不应有仪表盘的感觉。',
      ],
    },
    'form-controls': {
      section: '组件',
      title: '表单控件',
      description:
        '输入框和开关需要强对比度、清晰标签和可预测的垂直节奏。通过组合而非一个巨型字段组件来暴露复杂性。',
      guidance: [
        '在管理界面中，表单控件始终应配有可见标签。',
        '简短的辅助文本优于仅依赖 placeholder 的说明。',
        '对破坏性或高影响操作使用对话框进行确认。',
      ],
    },
    navigation: {
      section: '组件',
      title: '导航',
      description:
        '导航模式应首先传达位置，其次才是可用的移动方向。Tabs 最适合在单个页面上下文中切换兄弟视图。',
      guidance: [
        '在控件结构中镜像信息架构。',
        '使活跃状态明显，而不仅依赖颜色。',
        '避免在一个控件中混用路由导航和本地视图状态。',
      ],
    },
    'data-list': {
      section: '组件',
      title: '数据列表',
      description:
        '列表和表格应优先考虑扫读效率而非装饰。使用宽松的对齐、轻量分隔线，仅在需要时增加操作密度。',
      guidance: [
        '精确对齐表头和行内容，减少视觉偏移。',
        '使用细微边框而非为每一行添加重型卡片外壳。',
        '将破坏性操作保留在行操作组中，而非内联文字链接。',
      ],
    },
    'empty-states': {
      section: '组件',
      title: '空状态',
      description:
        '空状态应解释缺少什么、为何重要以及下一步操作是什么。它不应让用户感到走投无路。',
      guidance: [
        '指明缺失的对象，让用户清楚自己在看什么。',
        '提供一个清晰的恢复操作。',
        '视觉重量应轻于成功或警告反馈。',
      ],
    },
    toasts: {
      section: '组件',
      title: '消息提示',
      description: 'Toast 在不打断任务流程的情况下确认短暂事件。保持简洁、具体且易于关闭。',
      guidance: [
        '使用 success 和 info 确认后台操作。',
        '将阻塞性或破坏性状态升级为对话框，而非堆叠 Toast。',
        '避免在每次页面切换时重复相同消息。',
      ],
    },
    feedback: {
      section: '组件',
      title: '反馈组件',
      description:
        'Spinner、Progress、Alert 和 Skeleton 为用户提供关于加载状态、结果和缺失内容的清晰信号。',
      guidance: [
        '对短暂的不确定等待使用 Spinner；对确定性操作使用 Progress。',
        '对持久性或页面级状态消息，优先使用 Alert 而非 Toast。',
        'Skeleton 应与其替代内容的形状匹配，以减少布局偏移。',
      ],
    },
    overlays: {
      section: '组件',
      title: '浮层',
      description: 'Tooltip、Popover 和 DropdownMenu 在页面上方叠加临时内容，无需跳转。',
      guidance: [
        'Tooltip 仅用于补充文本，绝不放置可交互内容。',
        'Popover 可包含表单和富内容；需要明确的关闭触发器。',
        'DropdownMenu 应对相关操作分组，并支持键盘导航。',
      ],
    },
    'nav-layout': {
      section: '组件',
      title: '导航与布局',
      description: 'Breadcrumb、Pagination、Accordion 和 Separator 处理位置、分页和结构节奏。',
      guidance: [
        'Breadcrumb 反映路由深度——单层页面可省略。',
        'Pagination 应显示总页数，让用户了解数据集大小。',
        'Accordion 最适合渐进式披露，而非主导航。',
      ],
    },
    'data-display': {
      section: '组件',
      title: '数据展示',
      description: 'Avatar 和 Table 以清晰的层级呈现用户身份和结构化数据。',
      guidance: [
        'Avatar 即使在显示图片时也应始终具有无障碍标签。',
        'Table 支持可排序列——数据来自服务端时应将排序状态提升。',
        '在密集表格中使用斑马纹，帮助视线跨列追踪。',
      ],
    },
    'form-inputs': {
      section: '组件',
      title: '表单输入',
      description:
        'Select、Checkbox、RadioGroup、Textarea 和 Slider 将表单词汇扩展到文本输入之外。',
      guidance: [
        '使用 RadioGroup 包裹单选按钮，共享 name 和语义。',
        'Slider 适合数值范围；配合 showValue 可获得即时反馈。',
        'Textarea 默认纵向可拖拽——仅在固定高度容器中禁用 resize。',
      ],
    },
    mobile: {
      section: '响应式',
      title: '响应式布局',
      description:
        '一套同时覆盖手机、平板与桌面的响应式系统。通过布局与密度变化适配不同设备，而不是维护两套应用与两套页面树。',
      guidance: [
        '保持所有断点上的路由树一致，只调整壳层结构和内容密度。',
        '在窄屏上把常驻侧边导航转成抽屉，而不是复制一套页面实现。',
        '让卡片、表单和表格从三列到单列平滑重排，不改变组件归属。',
      ],
    },
    'home-page': {
      section: '模板',
      title: '主页',
      description:
        '带有 Hero 区块、核心功能亮点和主要行动召唤按钮的落地式主页。适用于产品官网、内部门户和营销页面。',
      guidance: [
        'Hero 信息保持一句话——让行动召唤按钮来完成说服工作。',
        '功能卡片各自聚焦一个问题，而非罗列所有能力。',
        '主操作与次操作相配合，降低用户决策疲劳。',
      ],
    },
    'login-page': {
      section: '模板',
      title: '登录页',
      description:
        '居中的极简登录表单。清晰的标签、可见的错误状态和单一主操作，降低登录摩擦。',
      guidance: [
        '不要隐藏密码标签——仅靠 placeholder 无法满足无障碍要求。',
        '字段失去焦点后立即显示内联校验错误。',
        '提供密码可见切换，降低登录摩擦。',
      ],
    },
    'register-page': {
      section: '模板',
      title: '注册页',
      description:
        '只收集创建账号所需最少字段的注册表单。通过仅询问必要信息来降低注册阻力。',
      guidance: [
        '注册时只需姓名、邮箱和密码——个人资料可在之后完善。',
        '内联显示密码强度，但不因细微问题阻止提交。',
        '服务条款复选框必须明确，不得预先勾选。',
      ],
    },
    'error-page': {
      section: '模板',
      title: '错误页',
      description:
        '404、500 及其他错误状态的优雅降级页面。给用户清晰的解释和直接返回的路径。',
      guidance: [
        '说明错误码和通俗解释——避免技术术语。',
        '始终提供"返回首页"和"后退"两个操作。',
        '错误页的视觉风格应与产品保持一致，而非系统默认页。',
      ],
    },
    'privacy-policy': {
      section: '模板',
      title: '隐私政策',
      description:
        '带有章节标题、可读段落和清晰分隔线的结构化法律文档页面。在不牺牲完整性的前提下保持无障碍和可扫读性。',
      guidance: [
        '使用标题将长篇政策文本分成可扫读的章节。',
        '从任何引用政策的同意流程中直接链接到相关章节。',
        '在顶部注明政策版本和日期，让用户了解最近更新时间。',
      ],
    },
    'terms-of-service': {
      section: '模板',
      title: '服务条款',
      description:
        '具备清晰标题、通俗义务说明且在手机到桌面端都保持可读性的服务条款页面。',
      guidance: [
        '将许可范围、使用限制和免责声明拆成独立段落，降低法律歧义。',
        '正文使用短段落与摘要侧栏，保证长文档依旧可扫读。',
        '在注册和定价流程中直接链接条款页面，让同意动作具备上下文。',
      ],
    },
  },
};

// ──────────────────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────────────────
export const locales: Record<string, Translations> = { en, zh };

interface I18nContextValue {
  t: Translations;
  locale: string;
  setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextValue>({
  t: en,
  locale: 'en',
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const stored = typeof localStorage !== 'undefined' ? (localStorage.getItem('vxui-locale') ?? 'en') : 'en';
  const [locale, setLocaleState] = useState(stored);
  const t = locales[locale] ?? en;

  const setLocale = (next: string) => {
    setLocaleState(next);
    if (typeof localStorage !== 'undefined') localStorage.setItem('vxui-locale', next);
  };

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
