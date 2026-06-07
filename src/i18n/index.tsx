import { createContext, useContext, useState, type ReactNode } from 'react';
import { APP_VERSION } from '../lib/version';

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
    content: string;
    forms: string;
    components: string;
    overlays: string;
    navigation: string;
    feedback: string;
    templates: string;
    mobile: string;
  };

  // Nav item labels
  pages: {
    introduction: string;
    'quick-start': string;
    'shell-sidebar': string;
    'grid-page': string;
    'nav-layout': string;
    'scroll-area': string;
    separator: string;
    resizable: string;
    typography: string;
    'typography-base': string;
    badge: string;
    avatar: string;
    skeleton: string;
    card: string;
    'code-block': string;
    'language-switcher': string;
    button: string;
    elements: string;
    'form-controls': string;
    'form-inputs': string;
    toggle: string;
    rating: string;
    label: string;
    'date-pickers': string;
    'file-upload': string;
    'color-picker': string;
    form: string;
    accordion: string;
    tabs: string;
    breadcrumb: string;
    pagination: string;
    stepper: string;
    progress: string;
    spinner: string;
    alert: string;
    toasts: string;
    table: string;
    'data-list': string;
    timeline: string;
    'tree-view': string;
    carousel: string;
    'empty-states': string;
    overlays: string;
    'data-display': string;
    navigation: string;
    feedback: string;
    dialog: string;

    sheet: string;
    popover: string;
    tooltip: string;
    'hover-card': string;
    'dropdown-menu': string;
    'context-menu': string;
    'command-palette': string;
    'navigation-menu': string;
    menubar: string;
    mobile: string;
    'mobile-list': string;
    'home-page': string;
    'login-page': string;
    'register-page': string;
    'error-page': string;
    'privacy-policy': string;
    'terms-of-service': string;
    'vxui-provider': string;
    viewport: string;
    constants: string;
    calendar: string;
    'bottom-nav': string;
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
    content: string;
    contentDesc: string;
    elements: string;
    elementsDesc: string;
    forms: string;
    formsDesc: string;
    inputs: string;
    inputsDesc: string;
    overlays: string;
    overlaysDesc: string;
    navigation: string;
    navigationDesc: string;
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
    footerGithub: string;
    footerWebsite: string;
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

  // Page definitions (section + title + description + guidance + optional props table)
  pageDefs: Record<string, {
    section: string;
    title: string;
    description: string;
    guidance: string[];
    props?: Array<{
      prop: string;      // prop name (always English)
      type: string;      // TypeScript type string
      default?: string;  // default value if any
      required?: boolean;
      description: string; // localized description
    }>;
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
  versionLabel: APP_VERSION,
  mobilePreview: 'Mobile Preview',

  nav: {
    gettingStarted: 'Getting Started',
    layout: 'Layout',
    content: 'Content',
    forms: 'Forms',
    components: 'Components',
    overlays: 'Overlays',
    navigation: 'Navigation',
    feedback: 'Feedback',
    templates: 'Templates',
    mobile: 'Responsive',
  },

  pages: {
    introduction: 'Introduction',
    'quick-start': 'Quick Start',
    'shell-sidebar': 'Shell & Sidebar',
    'grid-page': 'Grid & Page',
    'nav-layout': 'Navigation & Layout',
    'scroll-area': 'ScrollArea',
    separator: 'Separator',
    resizable: 'Resizable',
    typography: 'Typography',
    'typography-base': 'Typography Base',
    badge: 'Badge',
    avatar: 'Avatar',
    skeleton: 'Skeleton',
    card: 'Card',
    'code-block': 'Code Block',
    'language-switcher': 'Language Switcher',
    button: 'Button',
    elements: 'Elements',
    'form-controls': 'Form Controls',
    'form-inputs': 'Form Inputs',
    toggle: 'Toggle',
    rating: 'Rating',
    label: 'Label',
    'date-pickers': 'Date Pickers',
    'file-upload': 'File Upload',
    'color-picker': 'Color Picker',
    form: 'Form',
    accordion: 'Accordion',
    tabs: 'Tabs',
    breadcrumb: 'Breadcrumb',
    pagination: 'Pagination',
    stepper: 'Stepper',
    progress: 'Progress',
    spinner: 'Spinner',
    alert: 'Alert',
    toasts: 'Toasts',
    table: 'Table',
    'data-list': 'Data List',
    timeline: 'Timeline',
    'tree-view': 'Tree View',
    carousel: 'Carousel',
    'empty-states': 'Empty States',
    overlays: 'Overlays',
    'data-display': 'Data Display',
    navigation: 'Navigation',
    feedback: 'Feedback',
    dialog: 'Dialog',

    sheet: 'Sheet',
    popover: 'Popover',
    tooltip: 'Tooltip',
    'hover-card': 'Hover Card',
    'dropdown-menu': 'Dropdown Menu',
    'context-menu': 'Context Menu',
    'command-palette': 'Command Palette',
    'navigation-menu': 'Navigation Menu',
    menubar: 'Menubar',
    mobile: 'Mobile Components',
    'mobile-list': 'Mobile List',
    'home-page': 'Home Page',
    'login-page': 'Login Page',
    'register-page': 'Register Page',
    'error-page': 'Error Page',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'vxui-provider': 'VXUI Provider',
    viewport: 'Viewport',
    constants: 'Constants',
    calendar: 'Calendar',
    'bottom-nav': 'Bottom Nav',
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
    content: 'Content',
    contentDesc: 'Typography, badges, avatars, cards, and code blocks.',
    elements: 'Elements',
    elementsDesc: 'Quiet primitives for actions, metadata, and structured content blocks.',
    forms: 'Forms',
    formsDesc: 'Inputs, switches, dialogs, and field composition patterns.',
    inputs: 'Inputs',
    inputsDesc: 'Text inputs, selects, textareas, and number pickers.',
    overlays: 'Overlays',
    overlaysDesc: 'Modals, popovers, tooltips, and sheet panels.',
    navigation: 'Navigation',
    navigationDesc: 'Menus, nav bars, and breadcrumbs.',
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
    heroTag: `New · ${APP_VERSION}`,
    heroTitle: 'Lightweight React UI library',
    heroLead: 'Zero dependencies · 30+ components · Built-in theming & dark mode',
    heroCta: 'Get started',
    heroCtaAlt: 'Browse docs',
    previewLead: '',
    previewAccessTitle: 'Access modes',
    previewAccessMember: 'Sign in to keep a session and return to your workspace.',
    previewAccessGuest: 'Open the docs as a guest when you just need to browse.',
    previewMobileTitle: 'Mobile-ready',
    previewMobileLead: 'Navigation and auth layouts adapt naturally on mobile.',
    featuresSectionTitle: 'Why vxUI',
    feat1: 'Zero dependencies', feat1Desc: 'Pure CSS + TypeScript, no peer dependencies.',
    feat2: '30+ components', feat2Desc: 'Layout, form, feedback and list primitives in one system.',
    feat3: 'Themeable', feat3Desc: 'CSS variable-driven, swap the whole theme with one key.',
    feat4: 'Dark mode', feat4Desc: 'Semantic tokens work across light and dark themes.',
    footerCopy: '© 2026 vxUI. All rights reserved.',
    footerPrivacy: 'Privacy Policy',
    footerGithub: 'GitHub',
    footerWebsite: 'Website',
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
        'The shell is responsible for sidebar hierarchy, sticky header spacing, and content width. Navigation items support nested sub-menus via the `children` prop — click a parent to expand or collapse its sub-items.',
      guidance: [
        'Keep navigation labels short so collapsed mode stays scannable.',
        'Use section titles to separate page groups instead of visual noise.',
        'Add `children` to a nav item to make it expandable; set `defaultOpen: true` to start it expanded.',
        'If any child is active, AppShell auto-opens the parent group.',
        'Customize the sidebar width via the `sidebarWidth` prop (e.g. `sidebarWidth={280}` or `"18rem"`).',
      ],
      props: [
        { prop: 'brand', type: 'string', default: '"VXUI"', description: 'Brand / product name shown in the sidebar header.' },
        { prop: 'brandCaption', type: 'string', description: 'Secondary subtitle displayed below the brand name.' },
        { prop: 'brandIcon', type: 'ReactNode', description: 'Logo element (image or icon) rendered in the sidebar header.' },
        { prop: 'title', type: 'string', description: 'Page title shown in the topbar.' },
        { prop: 'description', type: 'string', description: 'Page subtitle / description shown below the topbar title.' },
        { prop: 'breadcrumb', type: 'ReactNode', description: 'Breadcrumb element rendered in the topbar.' },
        { prop: 'navSections', type: 'AppShellNavSection[]', description: 'Structured navigation tree grouped by sections. Preferred over navItems.' },
        { prop: 'navItems', type: 'AppShellNavItem[]', description: 'Flat navigation list. Automatically wrapped in a single unnamed section.' },
        { prop: 'sidebarCollapsed', type: 'boolean', default: 'false', description: 'Collapse sidebar to icon-only rail mode.' },
        { prop: 'sidebarWidth', type: 'number | string', default: '240px', description: 'Custom sidebar width. Pass a number for px (e.g. 280) or a CSS string (e.g. "18rem").' },
        { prop: 'density', type: '"comfortable" | "compact"', description: 'Layout density. "compact" tightens vertical rhythm for high-density operator UIs.' },
        { prop: 'headerActions', type: 'ReactNode', description: 'Slot for right-aligned topbar actions (buttons, dropdowns, user menu, etc.).' },
        { prop: 'sidebarFooter', type: 'ReactNode', description: 'Slot rendered at the bottom of the sidebar (user info, settings link, etc.).' },
        { prop: 'mobileNavOpen', type: 'boolean', default: 'false', description: 'Controls whether the mobile navigation overlay is visible.' },
        { prop: 'onSidebarToggle', type: '() => void', description: 'Called when the collapse / expand button is clicked.' },
        { prop: 'onMobileNavToggle', type: '() => void', description: 'Called when the mobile overlay toggle button is clicked. Required to enable mobile nav.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Main page content rendered inside ShellContent.' },
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
      props: [
        { prop: 'variant', type: '"solid" | "secondary" | "ghost" | "danger" | "outline" | "soft" | "danger-outline" | "primary-outline" | "gradient"', default: '"solid"', description: 'Visual style variant.' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Button size preset.' },
        { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to fill container width.' },
        { prop: 'shape', type: '"rect" | "square" | "pill" | "circle"', default: '"rect"', description: 'Button shape preset.' },
        { prop: 'loading', type: 'boolean', default: 'false', description: 'Show a spinner and disable the button.' },
        { prop: 'startIcon', type: 'ReactNode', description: 'Left-side icon slot.' },
        { prop: 'endIcon', type: 'ReactNode', description: 'Right-side icon slot.' },
      ],
    },
     elements: {
      section: 'Components',
      title: 'Elements',
      description:
        'Button forms the atomic foundation of actions. Other atomic components (Badge, Text, Heading, CodeBlock, LanguageSwitcher) each have their own dedicated pages under Content.',
      guidance: [
        'One primary action per area is usually enough.',
        'Use the solid variant for the primary action in a given area.',
        'Use secondary or ghost variants for supporting actions.',
      ],
    },
    'form-controls': {
      section: 'Components',
      title: 'Form Controls',
      description:
        'A complete set of form primitives: single-line inputs, multi-line textarea, searchable single-select (Select), multi-select with tag display (MultiSelect), and time selection (TimePicker). All share the same label / hint / error layout system.',
      guidance: [
        'Always pair form controls with visible labels in admin surfaces.',
        'Use Select for single-select with optional search; set `searchable={N}` to show the search input only when options exceed N.',
        'Use MultiSelect when users need to pick several values from a bounded list.',
        'TimePicker supports 24-hour format and an optional seconds column via the `seconds` prop.',
        'Short helper text is better than placeholder-only instruction.',
      ],
      props: [
        { prop: 'Select.options', type: 'SelectOption[]', required: true, description: 'Array of selectable options.' },
        { prop: 'Select.value', type: 'string', description: 'Controlled selected value.' },
        { prop: 'Select.defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
        { prop: 'Select.onChange', type: '(value: string | undefined) => void', description: 'Called when selection changes.' },
        { prop: 'Select.placeholder', type: 'string', default: '"Select..."', description: 'Placeholder when nothing selected.' },
        { prop: 'Select.label', type: 'string', description: 'Field label.' },
        { prop: 'Select.hint', type: 'string', description: 'Helper text.' },
        { prop: 'Select.error', type: 'string', description: 'Error message.' },
        { prop: 'Select.disabled', type: 'boolean', description: 'Disable the select.' },
        { prop: 'Select.clearable', type: 'boolean', default: 'false', description: 'Show clear button.' },
        { prop: 'Select.searchable', type: 'boolean | number', default: 'true', description: 'Enable search. Number enables search above that option count.' },
        { prop: 'MultiSelect.options', type: 'MultiSelectOption[]', required: true, description: 'Array of selectable options.' },
        { prop: 'MultiSelect.value', type: 'string[]', description: 'Controlled selected values.' },
        { prop: 'MultiSelect.defaultValue', type: 'string[]', default: '[]', description: 'Uncontrolled initial values.' },
        { prop: 'MultiSelect.onChange', type: '(value: string[]) => void', description: 'Called when selection changes.' },
        { prop: 'MultiSelect.placeholder', type: 'string', default: '"Select..."', description: 'Placeholder when nothing selected.' },
        { prop: 'MultiSelect.label', type: 'string', description: 'Field label.' },
        { prop: 'MultiSelect.hint', type: 'string', description: 'Helper text.' },
        { prop: 'MultiSelect.error', type: 'string', description: 'Error message.' },
        { prop: 'MultiSelect.disabled', type: 'boolean', description: 'Disable the multi-select.' },
        { prop: 'MultiSelect.clearable', type: 'boolean', default: 'false', description: 'Show clear-all button.' },
        { prop: 'MultiSelect.maxDisplay', type: 'number', description: 'Max visible tags before "+N more" badge.' },
        { prop: 'Textarea.label', type: 'string', description: 'Label above the textarea.' },
        { prop: 'Textarea.hint', type: 'string', description: 'Helper text below.' },
        { prop: 'Textarea.resize', type: '"none" | "vertical" | "horizontal" | "both"', default: '"vertical"', description: 'CSS resize direction.' },
        { prop: 'TimePicker.value', type: 'string', description: 'Controlled time value (HH:MM or HH:MM:SS).' },
        { prop: 'TimePicker.defaultValue', type: 'string', description: 'Uncontrolled initial time.' },
        { prop: 'TimePicker.onChange', type: '(value: string) => void', description: 'Called when time changes.' },
        { prop: 'TimePicker.label', type: 'string', description: 'Field label.' },
        { prop: 'TimePicker.seconds', type: 'boolean', default: 'false', description: 'Show seconds column.' },
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
    dialog: {
      section: 'Overlays',
      title: 'Dialog',
      description: 'A modal dialog that interrupts the user to confirm an action or show critical information. Supports multiple sizes, placement options, and a close button.',
      guidance: [
        'Use Dialog for confirmations that require a decision before continuing.',
        'Choose the appropriate size — "sm" for quick confirmations, "lg" for forms or details.',
        'Dialog traps focus and blocks interaction with the page behind it.',
      ],
      props: [
        { prop: 'trigger', type: 'ReactNode', required: true, description: 'Element that opens the dialog.' },
        { prop: 'title', type: 'string', required: true, description: 'Dialog title.' },
        { prop: 'description', type: 'string', description: 'Optional description text.' },
        { prop: 'children', type: 'ReactNode', description: 'Dialog body content.' },
        { prop: 'footer', type: 'ReactNode', description: 'Custom footer content.' },
        { prop: 'size', type: '"sm" | "md" | "lg" | "xl" | "full"', default: '"md"', description: 'Dialog width preset.' },
        { prop: 'placement', type: '"center" | "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-half" | "right-half" | "bottom-half" | "left-half"', default: '"center"', description: 'Dialog placement.' },
        { prop: 'scrollable', type: 'boolean', default: 'true', description: 'Allow body scrolling on overflow.' },
        { prop: 'closable', type: 'boolean', default: 'true', description: 'Show the close button.' },
        { prop: 'fullscreen', type: 'boolean', default: 'false', description: 'Display in fullscreen mode.' },
        { prop: 'open', type: 'boolean', description: 'Controlled open state.' },
        { prop: 'defaultOpen', type: 'boolean', description: 'Default open state (uncontrolled).' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback when open state changes.' },
        { prop: 'onConfirm', type: '() => void', description: 'Shows built-in confirm button.' },
        { prop: 'onCancel', type: '() => void', description: 'Shows built-in cancel button.' },
        { prop: 'confirmLabel', type: 'string', default: '"Confirm"', description: 'Confirm button label.' },
        { prop: 'cancelLabel', type: 'string', default: '"Cancel"', description: 'Cancel button label.' },
        { prop: 'confirmVariant', type: '"solid" | "danger"', default: '"solid"', description: 'Confirm button variant.' },
      ],
    },
     popover: {
      section: 'Overlays',
      title: 'Popover',
      description: 'A rich popup that can contain forms, buttons, and structured content. Unlike Tooltip, Popover can hold interactive elements and requires an explicit dismiss action.',
      guidance: [
        'Popover can contain interactive content — forms, buttons, links.',
        'Always provide a close mechanism (click outside or explicit close button).',
        'Use Tooltip for read-only labels and Popover for interactive content.',
      ],
      props: [
        { prop: 'content', type: 'ReactNode', required: true, description: 'Popover content (forms, buttons, links).' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Trigger element.' },
        { prop: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: 'Popover placement.' },
        { prop: 'trigger', type: '"click" | "hover"', default: '"click"', description: 'Open trigger method.' },
        { prop: 'open', type: 'boolean', description: 'Controlled open state.' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback when open state changes.' },
      ],
    },
     tooltip: {
      section: 'Overlays',
      title: 'Tooltip',
      description: 'A short, non-interactive label that appears on hover or focus to describe a UI element. Tooltips contain text only — no links, buttons, or forms.',
      guidance: [
        'Tooltips are for supplementary text only — never place interactive content inside.',
        'Tooltips appear on hover and focus; they do not require a close action.',
        'Keep tooltip text short — one to five words is ideal.',
      ],
      props: [
        { prop: 'content', type: 'ReactNode', required: true, description: 'Tooltip text content.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Trigger element.' },
        { prop: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Tooltip placement.' },
        { prop: 'delay', type: 'number', default: '600', description: 'Delay in ms before showing.' },
      ],
    },
     'hover-card': {
      section: 'Overlays',
      title: 'Hover Card',
      description: 'A card that appears on hover, showing a richer preview of a linked element. Useful for user profiles, document previews, or reference summaries.',
      guidance: [
        'Use HoverCard to preview related content without navigating away.',
        'HoverCard can contain richer content than Tooltip — images, metadata, links.',
        'Ensure the HoverCard trigger area is large enough to reach without the card disappearing.',
      ],
      props: [
        { prop: 'content', type: 'ReactNode', required: true, description: 'Card content (images, metadata, links).' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Trigger element.' },
        { prop: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: 'HoverCard placement.' },
        { prop: 'delay', type: 'number', default: '400', description: 'Delay in ms before showing.' },
      ],
    },
     'dropdown-menu': {
      section: 'Overlays',
      title: 'Dropdown Menu',
      description: 'A menu that opens on click, presenting a list of grouped actions or navigation items. Supports nested groups, keyboard navigation, and disabled items.',
      guidance: [
        'Group related actions under labeled menu groups.',
        'Use separators between unrelated action groups.',
        'DropdownMenu supports keyboard navigation — arrow keys, Enter, and Escape.',
      ],
      props: [
        { prop: 'trigger', type: 'ReactNode', required: true, description: 'Element that opens the menu.' },
        { prop: 'groups', type: 'DropdownMenuGroupProps[]', description: 'Grouped menu items (renders separators between groups).' },
        { prop: 'items', type: 'DropdownMenuItemProps[]', description: 'Flat list of menu items.' },
        { prop: 'align', type: '"left" | "right"', default: '"left"', description: 'Menu alignment relative to trigger.' },
        { prop: 'open', type: 'boolean', description: 'Controlled open state.' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback when open state changes.' },
        { prop: 'DropdownMenuItem.label', type: 'ReactNode', required: true, description: 'Item display content.' },
        { prop: 'DropdownMenuItem.icon', type: 'ReactNode', description: 'Item icon.' },
        { prop: 'DropdownMenuItem.shortcut', type: 'string', description: 'Keyboard shortcut hint.' },
        { prop: 'DropdownMenuItem.disabled', type: 'boolean', description: 'Disable the item.' },
        { prop: 'DropdownMenuItem.danger', type: 'boolean', description: 'Apply danger styling.' },
        { prop: 'DropdownMenuItem.onClick', type: '() => void', description: 'Click handler.' },
      ],
    },
     'context-menu': {
      section: 'Overlays',
      title: 'Context Menu',
      description: 'A right-click menu that provides actions relevant to the clicked element. Supports the same item and group API as DropdownMenu.',
      guidance: [
        'Use ContextMenu to expose secondary actions that users discover through right-click.',
        'Always provide an alternative way to access the same actions (toolbar, button).',
        'Keep the menu short — long context menus are hard to scan at a glance.',
      ],
      props: [
        { prop: 'groups', type: 'ContextMenuGroupProps[]', description: 'Grouped menu items.' },
        { prop: 'items', type: 'ContextMenuItemProps[]', description: 'Flat list of items.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Element that triggers on right-click.' },
        { prop: 'ContextMenuItem.label', type: 'ReactNode', required: true, description: 'Item display content.' },
        { prop: 'ContextMenuItem.icon', type: 'ReactNode', description: 'Item icon.' },
        { prop: 'ContextMenuItem.shortcut', type: 'string', description: 'Keyboard shortcut hint.' },
        { prop: 'ContextMenuItem.disabled', type: 'boolean', description: 'Disable the item.' },
        { prop: 'ContextMenuItem.danger', type: 'boolean', description: 'Apply danger styling.' },
        { prop: 'ContextMenuItem.onClick', type: '() => void', description: 'Click handler.' },
      ],
    },
     'command-palette': {
      section: 'Overlays',
      title: 'Command Palette',
      description:
        'A keyboard-driven search overlay that lets users jump to any page or action without leaving the keyboard. Render it globally, wire a hotkey, then pass a flat list of entries.',
      guidance: [
        'Keep the entries list flat and label-searchable — avoid nesting pages under hidden categories.',
        'Populate entries from the same nav data you use for the sidebar so the two surfaces stay in sync.',
        'Bind to ⌘K (Mac) or Ctrl+K (Windows) for a familiar shortcut.',
      ],
      props: [
        { prop: 'entries', type: 'SearchEntry[]', required: true, description: 'Flat list of searchable entries.' },
        { prop: 'open', type: 'boolean', required: true, description: 'Controlled open state.' },
        { prop: 'onClose', type: '() => void', required: true, description: 'Called when the palette is dismissed.' },
        { prop: 'onSelect', type: '(key: string) => void', required: true, description: 'Called when an entry is selected.' },
        { prop: 'placeholder', type: 'string', default: '"Search components, pages, keywords..."', description: 'Search input placeholder.' },
        { prop: 'emptyText', type: '(query: string) => string', description: 'Function returning empty results message.' },
      ],
    },
     'navigation-menu': {
      section: 'Navigation',
      title: 'Navigation Menu',
      description: 'A horizontal navigation bar that supports multi-level dropdown menus on hover. Suitable for top-level site navigation with nested sections.',
      guidance: [
        'Use NavigationMenu for site-level navigation with multiple tiers of content.',
        'Each item can have sub-items for second-level navigation.',
        'Keep the top-level items short — one or two words each.',
      ],
      props: [
        { prop: 'items', type: 'NavMenuItem[]', required: true, description: 'Top-level navigation items.' },
        { prop: 'NavMenuItem.label', type: 'string', required: true, description: 'Item display text.' },
        { prop: 'NavMenuItem.href', type: 'string', description: 'Link URL (for items without sub-items).' },
        { prop: 'NavMenuItem.onClick', type: '() => void', description: 'Click handler.' },
        { prop: 'NavMenuItem.items', type: 'NavMenuSubItem[]', description: 'Sub-menu items (triggers dropdown).' },
        { prop: 'NavMenuItem.active', type: 'boolean', description: 'Active state.' },
      ],
    },
     menubar: {
      section: 'Navigation',
      title: 'Menubar',
      description: 'A horizontal menu bar typically used for application-level actions (File, Edit, View). Supports keyboard-driven navigation between menus.',
      guidance: [
        'Menubar follows desktop application conventions — use it for app-level command menus.',
        'Each menu can contain items, groups, and separators.',
        'Arrow keys navigate between menus; Escape closes the current menu.',
      ],
      props: [
        { prop: 'menus', type: 'MenubarMenuProps[]', required: true, description: 'Top-level menu definitions.' },
        { prop: 'MenubarMenu.label', type: 'string', required: true, description: 'Menu trigger label.' },
        { prop: 'MenubarMenu.groups', type: 'MenubarGroupProps[]', description: 'Grouped items with separators.' },
        { prop: 'MenubarMenu.items', type: 'MenubarItemProps[]', description: 'Flat list of items.' },
        { prop: 'MenubarMenu.disabled', type: 'boolean', description: 'Disable the menu trigger.' },
        { prop: 'MenubarItem.label', type: 'ReactNode', required: true, description: 'Item display content.' },
        { prop: 'MenubarItem.icon', type: 'ReactNode', description: 'Item icon.' },
        { prop: 'MenubarItem.shortcut', type: 'string', description: 'Keyboard shortcut text.' },
        { prop: 'MenubarItem.disabled', type: 'boolean', description: 'Disable the item.' },
        { prop: 'MenubarItem.danger', type: 'boolean', description: 'Apply danger styling.' },
        { prop: 'MenubarItem.onClick', type: '() => void', description: 'Click handler.' },
      ],
    },
     resizable: {
      section: 'Layout',
      title: 'Resizable',
      description: 'A set of three components — ResizablePanelGroup, ResizablePanel, ResizableHandle — for building split-panel layouts with draggable dividers. Supports horizontal and vertical arrangements.',
      guidance: [
        'Use ResizablePanelGroup as the outer container, then nest ResizablePanel and ResizableHandle inside.',
        'Set direction to "horizontal" for side-by-side panels, "vertical" for stacked panels.',
        'Panels can be collapsed or resized by dragging the handle between them.',
      ],
      props: [
        { prop: 'ResizablePanelGroup.direction', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout axis.' },
        { prop: 'ResizablePanelGroup.disabled', type: 'boolean', default: 'false', description: 'Disable resize on all handles.' },
        { prop: 'ResizablePanel.defaultSize', type: 'number', default: '50', description: 'Initial size as percentage.' },
        { prop: 'ResizablePanel.minSize', type: 'number', default: '10', description: 'Minimum size percentage.' },
        { prop: 'ResizablePanel.maxSize', type: 'number', default: '90', description: 'Maximum size percentage.' },
        { prop: 'ResizableHandle.ariaLabel', type: 'string', description: 'Accessible label for the handle.' },
      ],
    },
     'file-upload': {
      section: 'Forms',
      title: 'File Upload',
      description: 'A drag-and-drop file upload area with click-to-browse fallback. Supports multiple files, previews, and removal.',
      guidance: [
        'Accept multiple files with the multiple prop — each file renders a preview card.',
        'Uploaded files are surfaced via the onChange callback with name, size, and file object.',
        'The component handles its own drag state and visual feedback.',
      ],
      props: [
        { prop: 'label', type: 'string', description: 'Field label text.' },
        { prop: 'hint', type: 'string', description: 'Helper text below the drop zone.' },
        { prop: 'error', type: 'string', description: 'Error message text.' },
        { prop: 'accept', type: 'string', description: 'File input accept attribute (e.g. ".png,.jpg").' },
        { prop: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple file selection.' },
        { prop: 'maxSize', type: 'number', description: 'Maximum file size in bytes.' },
        { prop: 'disabled', type: 'boolean', description: 'Disable the upload zone.' },
        { prop: 'onFiles', type: '(files: File[]) => void', description: 'Callback with selected files.' },
      ],
    },
     'color-picker': {
      section: 'Forms',
      title: 'Color Picker',
      description: 'A color selection control that opens a popup with hue, saturation, and brightness sliders. Supports predefined swatches and custom hex input.',
      guidance: [
        'Use ColorPicker for brand color configuration, tag colors, or theme customization.',
        'The component provides both a visual picker and a hex input for precision.',
        'Swatches can be customized via the swatches prop for brand-specific palettes.',
      ],
      props: [
        { prop: 'value', type: 'string', description: 'Controlled hex color value (e.g. "#ff0000").' },
        { prop: 'defaultValue', type: 'string', default: '"#3b82f6"', description: 'Uncontrolled initial color.' },
        { prop: 'onChange', type: '(color: string) => void', description: 'Change callback (receives hex string).' },
        { prop: 'label', type: 'string', description: 'Field label text.' },
        { prop: 'hint', type: 'string', description: 'Helper text below the picker.' },
        { prop: 'error', type: 'string', description: 'Error message text.' },
        { prop: 'disabled', type: 'boolean', description: 'Disable the picker.' },
        { prop: 'presets', type: 'string[]', description: 'Array of preset swatch hex colors.' },
        { prop: 'showPresets', type: 'boolean', default: 'true', description: 'Show/hide preset color swatches.' },
      ],
    },
     accordion: {
      section: 'Components',
      title: 'Accordion',
      description: 'A vertically stacked list of collapsible panels. Each panel has a header that toggles its content open or closed. Supports single and multiple open panels.',
      guidance: [
        'Accordion is ideal for FAQ sections, settings panels, and progressive disclosure patterns.',
        'By default, only one panel is open at a time (type="single").',
        'For accordions where multiple panels should stay open simultaneously, allowMultiple enables independent toggling.',
      ],
      props: [
        { prop: 'items', type: 'AccordionItem[]', required: true, description: 'Array of accordion panel definitions.' },
        { prop: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple panels open simultaneously.' },
        { prop: 'defaultOpen', type: 'string[]', default: '[]', description: 'Keys of initially open panels.' },
      ],
    },
     tabs: {
      section: 'Components',
      title: 'Tabs',
      description: 'A tabbed interface for switching between multiple content panels. Supports controlled and uncontrolled modes with keyboard navigation.',
      guidance: [
        'Use Tabs to organize related content into separate panels without navigating to a new page.',
        'TabsList holds the trigger buttons; TabsContent holds the panel content.',
        'Use the defaultValue prop for uncontrolled usage, or value/onValueChange for controlled mode.',
      ],
      props: [
        { prop: 'value', type: 'string', description: 'Controlled selected tab value.' },
        { prop: 'defaultValue', type: 'string', description: 'Uncontrolled initial tab.' },
        { prop: 'onValueChange', type: '(value: string) => void', description: 'Called when a new tab is selected.' },
        { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout orientation.' },
      ],
    },
     breadcrumb: {
      section: 'Components',
      title: 'Breadcrumb',
      description: 'A navigation aid that shows the user\'s location within the page hierarchy. Each segment is a link to the corresponding level.',
      guidance: [
        'Breadcrumb reflects URL depth — single-level pages may omit it entirely.',
        'Use the separator prop to customize the divider between segments.',
        'The last segment should be the current page (not a link) for accessibility.',
      ],
      props: [
        { prop: 'items', type: 'BreadcrumbItem[]', required: true, description: 'Ordered list of breadcrumb segments.' },
        { prop: 'separator', type: 'ReactNode', default: 'Chevron', description: 'Custom separator between items.' },
      ],
    },
     pagination: {
      section: 'Components',
      title: 'Pagination',
      description: 'A page navigation control that breaks large datasets into manageable pages. Shows page numbers with prev/next buttons and an optional page size selector.',
      guidance: [
        'Show the total page count so users know the dataset size.',
        'Use the siblings prop to control how many page numbers appear around the current page.',
        'The onPageChange callback receives the new page number for external data fetching.',
      ],
      props: [
        { prop: 'page', type: 'number', required: true, description: 'Current active page (1-indexed).' },
        { prop: 'total', type: 'number', required: true, description: 'Total number of items.' },
        { prop: 'pageSize', type: 'number', default: '10', description: 'Items per page.' },
        { prop: 'siblingCount', type: 'number', default: '1', description: 'Page buttons around current page.' },
        { prop: 'onChange', type: '(page: number) => void', required: true, description: 'Callback when a page is clicked.' },
      ],
    },
     stepper: {
      section: 'Components',
      title: 'Progress Steps',
      description: 'A multi-step progress indicator that visualizes the user\'s current position in a linear workflow. Supports completed, active, pending, and error states.',
      guidance: [
        'Use Stepper for multi-page forms, checkout flows, or setup wizards.',
        'Each step can be in "completed", "active", "pending", or "error" status.',
        'Steps with error status draw attention to the failed step so users can navigate back to fix it.',
      ],
      props: [
        { prop: 'steps', type: 'StepItem[]', required: true, description: 'Array of step definitions.' },
        { prop: 'currentStep', type: 'number', default: '0', description: '0-based index of the active step.' },
        { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction.' },
      ],
    },
     progress: {
      section: 'Components',
      title: 'Progress Bar',
      description: 'A horizontal progress bar that indicates the completion percentage of a deterministic operation. Supports labeled and unlabeled variants.',
      guidance: [
        'Use Progress for deterministic operations where the duration is known (e.g., file upload, data export).',
        'Use Spinner for indeterminate waits where the duration is unknown.',
        'The value prop accepts 0-100; set to 100 for completion.',
      ],
      props: [
        { prop: 'value', type: 'number', default: '0', description: 'Current progress value (0-100).' },
        { prop: 'label', type: 'string', description: 'Text label above the bar.' },
        { prop: 'showLabel', type: 'boolean', default: 'false', description: 'Show percentage text.' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Bar thickness preset.' },
        { prop: 'variant', type: '"default" | "success" | "warning" | "danger" | "rainbow"', default: '"default"', description: 'Bar color variant.' },
        { prop: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate (animated) mode.' },
      ],
    },
     spinner: {
      section: 'Components',
      title: 'Spinner',
      description: 'A rotating indicator for indeterminate loading states. Use it while content is being fetched or processed without a known duration.',
      guidance: [
        'Use Spinner for short, indeterminate waits where the remaining time is unknown.',
        'Use Progress for deterministic operations with a known duration.',
        'Spinner accepts size prop ("sm", "md", "lg") to match the surrounding context.',
      ],
      props: [
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Spinner dimension (16/24/36 px).' },
        { prop: 'label', type: 'string', default: '"Loading…"', description: 'Accessible aria-label text.' },
      ],
    },
     alert: {
      section: 'Components',
      title: 'Alert',
      description: 'A prominent status message that communicates success, warning, danger, or informational states. Can optionally be dismissed by the user.',
      guidance: [
        'Use Alert for persistent or page-level status messages — prefer it over Toasts for important information.',
        'Alert supports "info", "success", "warning", and "danger" variants.',
        'The dismissible prop adds a close button for user-dismissable alerts.',
      ],
      props: [
        { prop: 'variant', type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: 'Visual style variant.' },
        { prop: 'title', type: 'string', description: 'Alert title text.' },
        { prop: 'icon', type: 'ReactNode', description: 'Custom icon override.' },
        { prop: 'onClose', type: '() => void', description: 'Close button callback (hidden when omitted).' },
      ],
    },
     table: {
      section: 'Components',
      title: 'Table',
      description: 'A data table with sortable columns, optional row striping, and responsive overflow. Ideal for listing structured data with column-level sorting.',
      guidance: [
        'Table supports sortable columns — delegate sort state up when the data comes from a server.',
        'Use striped rows in dense tables to help eyes track across long rows.',
        'The columns prop defines headers; each column can have a sortKey for client-side sorting.',
      ],
      props: [
        { prop: 'columns', type: 'TableColumn[]', required: true, description: 'Column definitions.' },
        { prop: 'data', type: 'T[]', required: true, description: 'Row data.' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Row height preset.' },
        { prop: 'striped', type: 'boolean', default: 'false', description: 'Alternating row background.' },
        { prop: 'hoverable', type: 'boolean', default: 'true', description: 'Row hover highlight.' },
        { prop: 'bordered', type: 'boolean', default: 'false', description: 'Inner cell borders.' },
        { prop: 'stickyHeader', type: 'boolean', default: 'false', description: 'Sticky table header.' },
        { prop: 'headless', type: 'boolean', default: 'false', description: 'Hide the header row.' },
        { prop: 'loading', type: 'boolean', default: 'false', description: 'Show loading overlay.' },
        { prop: 'sortColumn', type: 'string', description: 'Controlled sort column key.' },
        { prop: 'sortDirection', type: '"asc" | "desc"', description: 'Controlled sort direction.' },
        { prop: 'onSortChange', type: '(column: string, direction) => void', description: 'Sort change callback.' },
        { prop: 'emptyText', type: 'ReactNode', default: '"No data"', description: 'Text when data is empty.' },
      ],
    },
     'empty-states': {
      section: 'Components',
      title: 'Empty States',
      description:
        'An empty state should explain what is missing, why it matters, and what the next action is. It should never feel like a dead end. The EmptyState component provides a consistent layout with icon, title, description, and an action slot.',
      guidance: [
        'Name the object that is absent so users know what they are looking at.',
        'Offer one clear recovery action via the action prop.',
        'Keep the visual weight lighter than success or alert feedback.',
      ],
      props: [
        { prop: 'icon', type: 'ReactNode', description: 'Illustration or icon displayed above the title.' },
        { prop: 'title', type: 'string', required: true, description: 'Main heading explaining what is missing.' },
        { prop: 'description', type: 'string', description: 'Optional explanatory text below the title.' },
        { prop: 'action', type: 'ReactNode', description: 'Call-to-action button or link for recovery.' },
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
      props: [
        { prop: 'push', type: '(toast: ToastInput) => void', description: 'Show a toast notification.' },
        { prop: 'ToastInput.title', type: 'string', required: true, description: 'Toast title text.' },
        { prop: 'ToastInput.description', type: 'string', description: 'Optional description text.' },
        { prop: 'ToastInput.tone', type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: 'Toast visual tone.' },
      ],
    },
     feedback: {
      section: 'Feedback',
      title: 'Feedback Components',
      description:
        'Alert, Progress, Spinner, Stepper, and Toast indicate application state without interrupting the layout.',
      guidance: [
        'Use Spinner for short, indeterminate waits; use Progress for deterministic operations.',
        'Prefer Alert over Toast for persistent or page-level status messages.',
      ],
    },
    overlays: {
      section: 'Components',
      title: 'Overlays',
      description:
        'Dialog, ContextMenu, HoverCard, Tooltip, Popover, and DropdownMenu layer transient content and actions above the page.',
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
        'Tabs, Accordion, Breadcrumb, Menubar, NavigationMenu, ScrollArea, Separator, Resizable, and Sheet structure content hierarchically.',
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
        'Table and EmptyState present structured data compactly. Other data components (Avatar, Badge, Card, Carousel, Timeline, TreeView) each have their own dedicated pages.',
      guidance: [
        'Table supports sortable columns — delegate sort state up when the data is server-side.',
        'Use striped rows in dense tables to help eyes track across long rows.',
        'EmptyState should include a clear recovery action whenever possible.',
      ],
    },
    'form-inputs': {
      section: 'Forms',
      title: 'Form Inputs',
      description:
        'Checkbox, Radio, Switch, Slider, NumberInput, TagInput, SegmentedControl, and Input extend the form vocabulary beyond text inputs. Other form components (Label, Toggle, Rating, DatePicker) each have their own dedicated pages.',
      guidance: [
        'Group radio buttons with RadioGroup to share name and semantics.',
        'Slider is ideal for numeric ranges; pair it with showValue for immediate feedback.',
        'Textarea defaults to vertical resize — disable resize only in fixed-height containers.',
        'Use Switch for immediate state toggles (like settings), and Checkbox for form submissions or multi-selections.',
      ],
      props: [
        { prop: 'Checkbox.label', type: 'ReactNode', description: 'Label next to the checkbox.' },
        { prop: 'Checkbox.description', type: 'string', description: 'Description under the label.' },
        { prop: 'Checkbox.indeterminate', type: 'boolean', description: 'Show indeterminate visual state.' },
        { prop: 'Radio.label', type: 'ReactNode', description: 'Label next to the radio circle.' },
        { prop: 'Radio.description', type: 'string', description: 'Description under the label.' },
        { prop: 'RadioGroup.label', type: 'string', description: 'Group label rendered as <legend>.' },
        { prop: 'RadioGroup.children', type: 'ReactNode', required: true, description: 'Radio components inside the group.' },
        { prop: 'Switch.label', type: 'string', required: true, description: 'Visible label text.' },
        { prop: 'Switch.description', type: 'string', description: 'Description below the label.' },
        { prop: 'Slider.label', type: 'string', description: 'Label above the slider.' },
        { prop: 'Slider.showValue', type: 'boolean', default: 'false', description: 'Show current value next to label.' },
        { prop: 'Slider.hint', type: 'string', description: 'Helper text below.' },
        { prop: 'NumberInput.label', type: 'string', description: 'Label above the input.' },
        { prop: 'NumberInput.hint', type: 'string', description: 'Helper text below.' },
        { prop: 'NumberInput.error', type: 'string', description: 'Error message.' },
        { prop: 'NumberInput.value', type: 'number', description: 'Controlled value.' },
        { prop: 'NumberInput.onChange', type: '(value: number) => void', description: 'Called when value changes.' },
        { prop: 'NumberInput.min', type: 'number', description: 'Minimum value.' },
        { prop: 'NumberInput.max', type: 'number', description: 'Maximum value.' },
        { prop: 'NumberInput.step', type: 'number', default: '1', description: 'Step increment.' },
        { prop: 'TagInput.value', type: 'string[]', description: 'Controlled tags.' },
        { prop: 'TagInput.defaultValue', type: 'string[]', default: '[]', description: 'Uncontrolled default tags.' },
        { prop: 'TagInput.onChange', type: '(tags: string[]) => void', description: 'Called when tags change.' },
        { prop: 'TagInput.label', type: 'string', description: 'Field label.' },
        { prop: 'TagInput.placeholder', type: 'string', default: '"Add tag..."', description: 'Placeholder.' },
        { prop: 'TagInput.maxTags', type: 'number', description: 'Maximum number of tags.' },
        { prop: 'SegmentedControl.options', type: 'SegmentedControlOption[]', required: true, description: 'Array of options.' },
        { prop: 'SegmentedControl.value', type: 'string', description: 'Controlled value.' },
        { prop: 'SegmentedControl.defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
        { prop: 'SegmentedControl.onChange', type: '(value: string) => void', description: 'Called when selection changes.' },
        { prop: 'SegmentedControl.fullWidth', type: 'boolean', description: 'Stretch to fill container width.' },
        { prop: 'SegmentedControl.size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Control size preset.' },
        { prop: 'Input.label', type: 'string', description: 'Label above the input.' },
        { prop: 'Input.hint', type: 'string', description: 'Helper text below.' },
        { prop: 'Input.error', type: 'string', description: 'Error message.' },
        { prop: 'Input.prefix', type: 'ReactNode', description: 'Ornament prepended inside the input.' },
        { prop: 'Input.suffix', type: 'ReactNode', description: 'Ornament appended inside the input.' },
        { prop: 'Input.variant', type: '"default" | "filled" | "underline" | "borderless"', default: '"default"', description: 'Visual style variant.' },
        { prop: 'Input.size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Size preset.' },
        { prop: 'Input.rounded', type: 'boolean', description: 'Pill-shaped input.' },
      ],
    },
     'mobile-list': {
      section: 'Responsive',
      title: 'Mobile List',
      description: 'MobileList, MobileListSection, and MobileListItem provide a native-feeling list suitable for mobile navigation, settings, and data display. Each item supports leading icons, trailing content, chevron indicators, and destructive or disabled states.',
      guidance: [
        'Use MobileListSection with a title prop to group related items under a section header.',
        'Set chevron on items that navigate to a detail view — omit it for static or toggle items.',
        'Use destructive for irreversible actions (delete, leave, remove) — the text turns red.',
        'Disabled items render visually muted and block click events.',
      ],
      props: [
        { prop: 'MobileList', type: '—', description: 'Root <ul> element with list styling.' },
        { prop: 'MobileListSection.title', type: 'string', description: 'Section header text.' },
        { prop: 'MobileListItem.leading', type: 'ReactNode', description: 'Icon or avatar on the left side.' },
        { prop: 'MobileListItem.trailing', type: 'ReactNode', description: 'Custom content on the right (badge, value, etc.).' },
        { prop: 'MobileListItem.label', type: 'ReactNode', required: true, description: 'Primary label text.' },
        { prop: 'MobileListItem.description', type: 'ReactNode', description: 'Secondary descriptive text.' },
        { prop: 'MobileListItem.chevron', type: 'boolean', default: 'false', description: 'Show a right chevron arrow.' },
        { prop: 'MobileListItem.destructive', type: 'boolean', default: 'false', description: 'Style as destructive action (red text).' },
        { prop: 'MobileListItem.disabled', type: 'boolean', default: 'false', description: 'Disable the item.' },
        { prop: 'MobileListItem.onClick', type: '() => void', description: 'Click handler.' },
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
    'code-block': {
      section: 'Components',
      title: 'Code Block',
      description:
        'A syntax-highlighted, read-only code display with optional filename label. Use it to render installation snippets, usage examples, or any formatted code string.',
      guidance: [
        'Set the language prop to the language of the code — tsx, bash, json, etc. — for correct highlighting.',
        'Pass a filename to give readers context on where the snippet belongs in a project.',
        'Keep code snippets minimal; show only the lines needed to illustrate the concept being documented.',
      ],
      props: [
        { prop: 'code', type: 'string', required: true, description: 'Source code string to highlight.' },
        { prop: 'language', type: '"tsx" | "typescript" | "javascript" | "jsx" | "bash" | "json" | "markup"', default: '"tsx"', description: 'Prism language identifier.' },
        { prop: 'filename', type: 'string', description: 'Filename label displayed above the code block.' },
      ],
    },
     'language-switcher': {
      section: 'Components',
      title: 'Language Switcher',
      description:
        'A locale toggle component that updates the entire UI copy when clicked. Drop it into any topbar or settings area — the i18n provider broadcasts the change automatically.',
      guidance: [
        'Place the switcher in a persistent surface (topbar or settings page) so users can find it from anywhere.',
        'The switcher reflects the current locale; no extra state wiring is needed beyond the i18n provider.',
        'Use the inline variant for topbars and the default variant for settings pages to match visual density.',
      ],
      props: [
        { prop: 'variant', type: '"inline" | "sidebar"', default: '"inline"', description: '"inline" for topbars; "sidebar" for sidebar footer.' },
      ],
    },
     'scroll-area': {
      section: 'Layout',
      title: 'ScrollArea',
      description: 'A scrollable container with custom-styled scrollbars. Use it to constrain overflowing content to a fixed viewport with maxHeight or maxWidth.',
      guidance: [
        'Set maxHeight to constrain vertical overflow — all content outside the viewport scrolls inside.',
        'Pass a number for pixels or a string like "50vh" for relative sizing.',
        'ScrollArea is purely presentational; it does not virtualize or lazy-render children.',
      ],
      props: [
        { prop: 'maxHeight', type: 'string | number', description: 'Maximum height before content scrolls. Numbers are treated as pixels.' },
        { prop: 'maxWidth', type: 'string | number', description: 'Maximum width before content scrolls. Numbers are treated as pixels.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Content inside the scrollable viewport.' },
      ],
    },
    separator: {
      section: 'Layout',
      title: 'Separator',
      description: 'A visual divider that separates content sections. Renders as an <hr> element with horizontal or vertical orientation.',
      guidance: [
        'Use horizontal separators between stacked sections; use vertical ones in toolbars or inline contexts.',
        'The decorative prop controls the role attribute — set to false when the separator conveys semantic meaning.',
        'Vertical separators need an explicit height to render visibly.',
      ],
      props: [
        { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'The axis of the separator line.' },
        { prop: 'decorative', type: 'boolean', default: 'true', description: 'When true, sets role="none"; when false, role="separator" with aria-orientation.' },
      ],
    },
    timeline: {
      section: 'Components',
      title: 'Timeline',
      description: 'A vertical list of chronologically ordered events. Each item shows a title, optional description, time, icon, and status indicator.',
      guidance: [
        'Use Timeline for activity feeds, order tracking, or deployment history.',
        'Set status to "success", "warning", "danger", or "info" to color the timeline dot.',
        'Pass an icon on individual items to replace the default dot icon.',
      ],
      props: [
        { prop: 'items', type: 'TimelineItem[]', required: true, description: 'Array of timeline entries.' },
        { prop: 'items[].title', type: 'string', required: true, description: 'Event title.' },
        { prop: 'items[].description', type: 'string', description: 'Optional event description.' },
        { prop: 'items[].time', type: 'string', description: 'Timestamp or date label.' },
        { prop: 'items[].icon', type: 'ReactNode', description: 'Custom icon replacing the default dot.' },
        { prop: 'items[].status', type: '"default" | "success" | "warning" | "danger" | "info"', description: 'Visual status color for the dot.' },
      ],
    },
    'tree-view': {
      section: 'Components',
      title: 'Tree View',
      description: 'A hierarchical tree control with expandable/collapsible nodes, keyboard navigation, and optional selection state. Suitable for file browsers, organization charts, or nested settings.',
      guidance: [
        'Use defaultExpanded to pre-expand certain nodes on initial render.',
        'Each node requires a unique id for selection and expansion tracking.',
        'TreeView supports controlled (selected/expanded) or uncontrolled modes via the corresponding props.',
        'Disabled nodes cannot be selected or expanded but remain visible.',
      ],
      props: [
        { prop: 'nodes', type: 'TreeNode[]', required: true, description: 'Root-level tree nodes.' },
        { prop: 'selected', type: 'string', description: 'Controlled selected node id.' },
        { prop: 'defaultSelected', type: 'string', description: 'Uncontrolled initial selected node id.' },
        { prop: 'onSelect', type: '(id: string, node: TreeNode) => void', description: 'Called when a node is selected.' },
        { prop: 'expanded', type: 'string[]', description: 'Controlled expanded node ids.' },
        { prop: 'defaultExpanded', type: 'string[]', description: 'Uncontrolled initial expanded node ids.' },
        { prop: 'onExpandedChange', type: '(ids: string[]) => void', description: 'Called when expansion state changes.' },
      ],
    },
    carousel: {
      section: 'Components',
      title: 'Carousel',
      description: 'A slide-based carousel with dot indicators, arrow navigation, optional auto-play, and loop support. Each slide accepts arbitrary React content.',
      guidance: [
        'Set autoPlay for unattended rotation — useful for hero banners or kiosks.',
        'Disable loop for linear walkthroughs where users should not wrap around.',
        'Carousel respects controlled index via the index prop for external pagination sync.',
        'Hide arrows or dots with showArrows / showDots when building minimal variants.',
      ],
      props: [
        { prop: 'items', type: 'ReactNode[]', required: true, description: 'Array of slide content.' },
        { prop: 'defaultIndex', type: 'number', default: '0', description: 'Initial slide index (uncontrolled).' },
        { prop: 'index', type: 'number', description: 'Controlled current slide index.' },
        { prop: 'onIndexChange', type: '(index: number) => void', description: 'Called when the active slide changes.' },
        { prop: 'autoPlay', type: 'boolean', default: 'false', description: 'Automatically advance slides on an interval.' },
        { prop: 'interval', type: 'number', default: '3000', description: 'Auto-play interval in milliseconds.' },
        { prop: 'loop', type: 'boolean', default: 'true', description: 'Wrap from last slide back to first.' },
        { prop: 'showDots', type: 'boolean', default: 'true', description: 'Show dot indicators.' },
        { prop: 'showArrows', type: 'boolean', default: 'true', description: 'Show prev/next arrow buttons.' },
      ],
    },
    toggle: {
      section: 'Forms',
      title: 'Toggle',
      description: 'A two-state button that toggles between pressed and unpressed. ToggleGroup extends this to single/multiple selection among a set of options.',
      guidance: [
        'Use Toggle for toolbar toggles (bold/italic, filter pills) and ToggleGroup for view mode switching.',
        'ToggleGroup type="single" behaves like a radio group; type="multiple" allows any combination.',
        'Both controlled (pressed/value) and uncontrolled (defaultPressed/defaultValue) modes are supported.',
      ],
      props: [
        { prop: 'Toggle.pressed', type: 'boolean', description: 'Controlled pressed state.' },
        { prop: 'Toggle.defaultPressed', type: 'boolean', default: 'false', description: 'Uncontrolled initial pressed state.' },
        { prop: 'Toggle.onPressedChange', type: '(pressed: boolean) => void', description: 'Called when pressed state changes.' },
        { prop: 'Toggle.size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Button size.' },
        { prop: 'ToggleGroup.items', type: 'ToggleGroupItem[]', required: true, description: 'Array of toggle options.' },
        { prop: 'ToggleGroup.value', type: 'string | string[]', description: 'Controlled selection value.' },
        { prop: 'ToggleGroup.defaultValue', type: 'string | string[]', description: 'Uncontrolled initial selection.' },
        { prop: 'ToggleGroup.onValueChange', type: '(value: string | string[]) => void', description: 'Called when selection changes.' },
        { prop: 'ToggleGroup.type', type: '"single" | "multiple"', default: '"single"', description: 'Selection mode.' },
      ],
    },
    rating: {
      section: 'Forms',
      title: 'Rating',
      description: 'A star-based rating input that supports whole and half-star precision, controlled/uncontrolled modes, and read-only or disabled states.',
      guidance: [
        'Set allowHalf to permit half-star precision for detailed feedback.',
        'Use readOnly for display-only ratings (historical averages) and disabled when interaction should be blocked entirely.',
        'The size prop adjusts star dimensions for different visual contexts.',
      ],
      props: [
        { prop: 'value', type: 'number', description: 'Controlled rating value.' },
        { prop: 'defaultValue', type: 'number', default: '0', description: 'Uncontrolled initial value.' },
        { prop: 'onChange', type: '(value: number) => void', description: 'Called when the rating changes.' },
        { prop: 'max', type: 'number', default: '5', description: 'Maximum number of stars.' },
        { prop: 'allowHalf', type: 'boolean', default: 'false', description: 'Allow half-star values.' },
        { prop: 'disabled', type: 'boolean', description: 'Disable interaction.' },
        { prop: 'readOnly', type: 'boolean', description: 'Display-only mode.' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Star size.' },
        { prop: 'label', type: 'string', description: 'Accessible label for the rating group.' },
      ],
    },
    label: {
      section: 'Forms',
      title: 'Label',
      description: 'A styled <label> element with an optional required indicator. Use it alongside any form control to provide accessible labelling.',
      guidance: [
        'Always associate a Label with its form control — either by wrapping the input or using htmlFor.',
        'Set required to automatically append a red asterisk after the label text.',
        'Label is a thin wrapper; it passes all standard label attributes to the underlying element.',
      ],
      props: [
        { prop: 'required', type: 'boolean', description: 'Show a required indicator (red asterisk) after the label text.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Label text content.' },
      ],
    },
    avatar: {
      section: 'Content',
      title: 'Avatar',
      description: 'Displays a user avatar with image, fallback initials, or a placeholder icon. Supports multiple sizes and shapes.',
      guidance: [
        'Always provide an accessible label via the name or alt prop.',
        'The src prop accepts an image URL; on load failure it falls back to initials or fallback text.',
        'Initials are generated from the name prop (up to 2 characters).',
        'The circle shape is the default; use square for data-dense layouts.',
      ],
      props: [
        { prop: 'src', type: 'string', description: 'Image URL for the avatar.' },
        { prop: 'name', type: 'string', description: 'User name used for initials and accessible label.' },
        { prop: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Avatar size.' },
        { prop: 'shape', type: '"circle" | "square"', default: '"circle"', description: 'Avatar shape.' },
        { prop: 'fallback', type: 'string', description: 'Custom fallback text when no image or name is provided.' },
      ],
    },
    badge: {
      section: 'Content',
      title: 'Badge',
      description: 'A compact label for status, category, or metadata. Use it inline with text or inside buttons, cards, and table cells.',
      guidance: [
        'Use badges for compact status or category metadata, not decoration.',
        'The accent variant is reserved for the primary brand color; success and warning convey semantic states.',
        'Badges are inline elements — they flow naturally alongside text and other inline content.',
      ],
      props: [
        { prop: 'variant', type: '"neutral" | "accent" | "success" | "warning"', default: '"neutral"', description: 'Visual style variant.' },
      ],
    },
    skeleton: {
      section: 'Content',
      title: 'Skeleton',
      description: 'A placeholder that mimics content shape while data loads. Supports text, rectangle, and circle variants, as well as multi-line text blocks.',
      guidance: [
        'Match the skeleton shape to the real content to reduce layout shift.',
        'Use variant="text" with lines > 1 to simulate a paragraph placeholder.',
        'The last line of a multi-line text skeleton is shorter (70% width) to look more natural.',
      ],
      props: [
        { prop: 'variant', type: '"text" | "rect" | "circle"', default: '"rect"', description: 'Shape variant.' },
        { prop: 'width', type: 'string | number', description: 'Width. Numbers are treated as pixels.' },
        { prop: 'height', type: 'string | number', description: 'Height. Numbers are treated as pixels.' },
        { prop: 'lines', type: 'number', default: '1', description: 'Number of lines for text variant.' },
      ],
    },
    typography: {
      section: 'Content',
      title: 'Typography',
      description: 'Heading and Text provide the core typography system. Heading renders <h1>-<h6> with level-based sizing; Text renders <p>, <span>, or <div> with variant, size, and weight options.',
      guidance: [
        'Use Heading for section titles and hierarchical content structure.',
        'Use Text with variant="secondary" or "muted" for lower-emphasis content.',
        'The truncate prop clips overflow with an ellipsis — useful for table cells and sidebars.',
        'Set the as prop on Heading to override the rendered HTML element without changing visual style.',
      ],
      props: [
        { prop: 'Heading.level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Heading level determines font size.' },
        { prop: 'Heading.as', type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"', description: 'Override the rendered HTML element.' },
        { prop: 'Heading.variant', type: '"default" | "secondary"', default: '"default"', description: 'Visual variant.' },
        { prop: 'Heading.weight', type: '"normal" | "medium" | "semibold" | "bold"', default: '"bold"', description: 'Font weight.' },
        { prop: 'Heading.truncate', type: 'boolean', default: 'false', description: 'Truncate with ellipsis on overflow.' },
        { prop: 'Text.as', type: '"p" | "span" | "div"', default: '"p"', description: 'Rendered HTML element.' },
        { prop: 'Text.variant', type: '"default" | "secondary" | "muted" | "danger" | "success"', default: '"default"', description: 'Color variant.' },
        { prop: 'Text.size', type: '"sm" | "base" | "lg" | "xl"', default: '"base"', description: 'Font size.' },
        { prop: 'Text.weight', type: '"normal" | "medium" | "semibold" | "bold"', default: '"normal"', description: 'Font weight.' },
        { prop: 'Text.truncate', type: 'boolean', default: 'false', description: 'Truncate with ellipsis on overflow.' },
      ],
    },
    'typography-base': {
      section: 'Content',
      title: 'Typography Base',
      description: 'Ready-to-use typography CSS utilities and React components inspired by Bootstrap naming conventions. Ideal for articles, documentation, and API reference pages.',
      guidance: [
        'Typography styles are loaded automatically when you import "vxui-react".',
        'Use className directly (e.g., vx-article, vx-section) or use React components (e.g., Article, Section).',
        'All colors use CSS variables and automatically adapt to light/dark themes.',
        'Built-in responsive breakpoints ensure a consistent experience on mobile and desktop.',
      ],
      props: [
        { prop: 'Article', type: 'Component', description: 'Article container with standard document layout.' },
        { prop: 'ArticleHeader', type: 'Component', description: 'Article header containing title and description.' },
        { prop: 'ArticleTitle', type: 'Component', description: 'Article title (h1).' },
        { prop: 'ArticleBody', type: 'Component', description: 'Article body container.' },
        { prop: 'Section', type: 'Component', description: 'Document section with anchor support.' },
        { prop: 'SectionHeading', type: 'Component', description: 'Section heading (h2) with optional anchor link.' },
        { prop: 'Pager', type: 'Component', description: 'Previous/next page navigation.' },
        { prop: 'PropsTable', type: 'Component', description: 'API props reference table.' },
        { prop: 'ArticleEmptyState', type: 'Component', description: 'Empty state display.' },
        { prop: 'StatsGrid', type: 'Component', description: 'Statistics metrics grid.' },
      ],
    },
    'date-pickers': {
      section: 'Forms',
      title: 'Date Pickers',
      description: 'DatePicker provides a text-input with a popup calendar for date selection. Calendar is the standalone month-grid component used internally by DatePicker.',
      guidance: [
        'Use DatePicker for form fields; use Calendar directly when embedding a date grid into a custom widget.',
        'Set min/max to constrain the selectable date range.',
        'The weekStartsOnMonday prop changes the first day of the week — default is Sunday.',
        'DatePicker falls back to a Sheet-based layout on mobile viewports automatically.',
      ],
      props: [
        { prop: 'DatePicker.value', type: 'Date', description: 'Controlled selected date.' },
        { prop: 'DatePicker.defaultValue', type: 'Date', description: 'Uncontrolled initial date.' },
        { prop: 'DatePicker.onChange', type: '(date: Date | undefined) => void', description: 'Called when the date changes.' },
        { prop: 'DatePicker.label', type: 'string', description: 'Input label.' },
        { prop: 'DatePicker.hint', type: 'string', description: 'Helper text below the input.' },
        { prop: 'DatePicker.error', type: 'string', description: 'Error message.' },
        { prop: 'DatePicker.min', type: 'Date', description: 'Minimum selectable date.' },
        { prop: 'DatePicker.max', type: 'Date', description: 'Maximum selectable date.' },
        { prop: 'DatePicker.disabled', type: 'boolean', description: 'Disable the date picker.' },
        { prop: 'DatePicker.weekStartsOnMonday', type: 'boolean', default: 'false', description: 'Start the week on Monday instead of Sunday.' },
        { prop: 'Calendar.value', type: 'Date', description: 'Controlled selected date.' },
        { prop: 'Calendar.defaultValue', type: 'Date', description: 'Uncontrolled initial date.' },
        { prop: 'Calendar.onChange', type: '(date: Date) => void', description: 'Called when a date is clicked.' },
        { prop: 'Calendar.min', type: 'Date', description: 'Minimum selectable date.' },
        { prop: 'Calendar.max', type: 'Date', description: 'Maximum selectable date.' },
        { prop: 'Calendar.weekStartsOnMonday', type: 'boolean', default: 'false', description: 'Start the week on Monday.' },
      ],
    },
    card: {
      section: 'Content',
      title: 'Card',
      description:
        'A flexible content container with multiple visual variants. Use Card as the outer wrapper, then compose CardHeader, CardTitle, CardDescription, and CardContent inside.',
      guidance: [
        'Use the elevated variant for interactive cards that invite clicks.',
        'Set hoverable to add a lift effect on hover — ideal for gallery or dashboard tiles.',
        'Padding defaults to the card’s internal spacing; use the padding prop to adjust for dense or spacious layouts.',
        'Card itself is a <section> — always include a heading (CardTitle) for accessibility.',
      ],
      props: [
        { prop: 'variant', type: '"default" | "flat" | "elevated" | "outlined" | "ghost" | "filled"', default: '"default"', description: 'Visual style preset.' },
        { prop: 'padding', type: '"none" | "sm" | "md" | "lg"', description: 'Inner padding size. Defaults to the card\'s internal spacing.' },
        { prop: 'hoverable', type: 'boolean', default: 'false', description: 'Add a hover lift effect — useful for clickable cards.' },
      ],
    },
    form: {
      section: 'Forms',
      title: 'Form',
      description:
        'A form composition system built from Form, FormField, FormLabel, FormDescription, FormMessage, and useFormField. Works with any input component to provide consistent label, hint, and error layout.',
      guidance: [
        'Wrap each logical field group in a FormField to share error state via context.',
        'Use FormLabel with required to show a required indicator automatically.',
        'FormMessage renders the error from FormField context — no manual prop drilling needed.',
        'Form sets noValidate by default; handle validation yourself or with a library.',
      ],
      props: [
        { prop: 'Form', type: '—', description: 'Standard <form> wrapper with noValidate and vx-form class.' },
        { prop: 'FormField', type: '—', description: 'Wraps a field group; provides error context to FormMessage.' },
        { prop: 'FormField.error', type: 'string', description: 'Error message shown by FormMessage in this field.' },
        { prop: 'FormLabel', type: '—', description: 'Renders a <label> with an optional required asterisk.' },
        { prop: 'FormLabel.required', type: 'boolean', description: 'Shows a red asterisk after the label text.' },
        { prop: 'FormDescription', type: '—', description: 'Helper text rendered below the label.' },
        { prop: 'FormMessage', type: '—', description: 'Error or helper message; auto-reads error from FormField context.' },
        { prop: 'useFormField', type: '() => { error?: string }', description: 'Hook to read the current field\'s error context.' },
      ],
    },
    sheet: {
      section: 'Overlays',
      title: 'Sheet',
      description:
        'A slide-out panel that enters from the left, right, top, or bottom edge. Supports title, description, optional confirm action, and controlled or uncontrolled open state.',
      guidance: [
        'Use Sheet for secondary content that does not require a full page navigation.',
        'Set side to "right" for detail panels, "bottom" for mobile-like action sheets.',
        'The variant="action" preset hides the close button and shows a confirm footer — suitable for destructive or confirm actions.',
        'Control open state with the open/onOpenChange props or use defaultOpen for uncontrolled usage.',
      ],
      props: [
        { prop: 'trigger', type: 'ReactNode', description: 'Element that opens the sheet on click.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Sheet body content.' },
        { prop: 'side', type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: 'Edge from which the sheet slides in.' },
        { prop: 'variant', type: '"default" | "action"', default: '"default"', description: '"action" hides close button and shows a confirm footer.' },
        { prop: 'title', type: 'ReactNode', description: 'Sheet header title.' },
        { prop: 'description', type: 'ReactNode', description: 'Sheet header description.' },
        { prop: 'header', type: 'ReactNode', description: 'Custom header content (replaces title/description).' },
        { prop: 'footer', type: 'ReactNode', description: 'Custom footer content.' },
        { prop: 'open', type: 'boolean', description: 'Controlled open state.' },
        { prop: 'defaultOpen', type: 'boolean', description: 'Uncontrolled initial open state.' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback when open state changes.' },
        { prop: 'showClose', type: 'boolean', default: 'true', description: 'Show the close button in the header.' },
        { prop: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: 'Close when clicking the backdrop.' },
        { prop: 'showConfirm', type: 'boolean', default: 'false', description: 'Show a confirm button in the footer.' },
        { prop: 'confirmText', type: 'string', default: '"Confirm"', description: 'Confirm button label.' },
        { prop: 'confirmDisabled', type: 'boolean', default: 'false', description: 'Disable the confirm button.' },
        { prop: 'onConfirm', type: '() => void', description: 'Callback when confirm is clicked.' },
        { prop: 'width', type: 'number', description: 'Custom panel width in pixels.' },
      ],
    },
    'vxui-provider': {
      section: 'Getting Started',
      title: 'VXUI Provider',
      description:
        'A combined provider that wraps ThemeProvider, ViewportProvider, and ToastProvider into a single component. Use it at the app root to reduce nesting.',
      guidance: [
        'VXUIProvider replaces the need to manually nest ThemeProvider + ViewportProvider + ToastProvider.',
        'Pass themes, defaultTheme, and storageKey exactly as you would to ThemeProvider.',
        'The component is fully optional — you can use the individual providers separately if you need more control.',
      ],
      props: [
        { prop: 'themes', type: 'ThemeRegistry', description: 'Theme configuration passed to ThemeProvider.' },
        { prop: 'defaultTheme', type: 'string', description: 'Default theme name.' },
        { prop: 'storageKey', type: 'string', default: '"vxui-theme"', description: 'localStorage key for persisting the theme choice.' },
        { prop: 'children', type: 'ReactNode', required: true, description: 'Application content.' },
      ],
    },
    viewport: {
      section: 'Getting Started',
      title: 'Viewport',
      description:
        'ViewportProvider monitors screen dimensions and exposes device type, orientation, and breakpoint information via the useViewport hook.',
      guidance: [
        'ViewportProvider uses physical screen size (window.screen.width) for device type classification.',
        'A screen width ≤ 1000px is classified as tablet or phone (distinguished by aspect ratio).',
        'useViewport() returns isPhone, isTablet, isDesktop, isTabletPortrait, and raw screenWidth/screenHeight.',
        'Unlike CSS breakpoints, device detection uses physical screen size so a split-screen tablet is still detected as "tablet".',
      ],
      props: [
        { prop: 'children', type: 'ReactNode', required: true, description: 'Application content.' },
        { prop: 'useViewport()', type: 'ViewportContextValue', description: 'Hook returning viewport state.' },
        { prop: 'useViewport().viewport', type: '"phone" | "tablet" | "desktop"', description: 'Current device type classification.' },
        { prop: 'useViewport().isPhone', type: 'boolean', description: 'True when device is a phone (narrow screen).' },
        { prop: 'useViewport().isTablet', type: 'boolean', description: 'True when device is a tablet.' },
        { prop: 'useViewport().isDesktop', type: 'boolean', description: 'True when device is a desktop (width > 1000px).' },
        { prop: 'useViewport().isTabletPortrait', type: 'boolean', description: 'True when tablet AND portrait orientation.' },
        { prop: 'useViewport().screenWidth', type: 'number', description: 'Physical screen width in CSS pixels.' },
        { prop: 'useViewport().screenHeight', type: 'number', description: 'Physical screen height in CSS pixels.' },
      ],
    },
    constants: {
      section: 'Getting Started',
      title: 'Constants',
      description:
        'Layout breakpoints and device detection thresholds used by the responsive system. These constants are available for custom responsive logic.',
      guidance: [
        'BREAKPOINTS.sm (640) is the phone-to-tablet CSS viewport breakpoint.',
        'BREAKPOINTS.md (768) is the tablet-to-desktop CSS viewport breakpoint.',
        'BREAKPOINTS.lg (1000) is used as PHONE_MAX_WIDTH for device type detection.',
        'PHONE_ASPECT_RATIO_THRESHOLD (0.7) and TABLET_ASPECT_RATIO_THRESHOLD (0.75) distinguish phone vs tablet by aspect ratio.',
        'CSS layout breakpoints and device detection thresholds serve different purposes and have different values.',
      ],
      props: [
        { prop: 'BREAKPOINTS.sm', type: '640', description: 'CSS layout breakpoint for phone-to-tablet (max-width: 640px).' },
        { prop: 'BREAKPOINTS.md', type: '768', description: 'CSS layout breakpoint for tablet (max-width: 768px).' },
        { prop: 'BREAKPOINTS.lg', type: '1000', description: 'CSS layout breakpoint for desktop (min-width: 1000px).' },
        { prop: 'PHONE_MAX_WIDTH', type: '1000', description: 'Physical screen width threshold for device detection.' },
        { prop: 'PHONE_ASPECT_RATIO_THRESHOLD', type: '0.7', description: 'Aspect ratio (w/h) threshold — below this value the device is classified as phone.' },
        { prop: 'TABLET_ASPECT_RATIO_THRESHOLD', type: '0.75', description: 'Aspect ratio threshold used as the upper bound for tablet classification.' },
      ],
    },
    calendar: {
      section: 'Forms',
      title: 'Calendar',
      description:
        'A month-based calendar view for selecting dates. Supports controlled and uncontrolled modes, min/max date constraints, and configurable start-of-week.',
      guidance: [
        'Use Calendar standalone or inside DatePicker for a date selection experience.',
        'Set value for controlled mode or defaultValue for uncontrolled mode.',
        'Use min and max to restrict the selectable date range.',
        'Set weekStartsOnMonday if your locale requires weeks to start on Monday.',
      ],
      props: [
        { prop: 'value', type: 'Date', description: 'Controlled selected date.' },
        { prop: 'defaultValue', type: 'Date', description: 'Uncontrolled initial selected date.' },
        { prop: 'onChange', type: '(date: Date) => void', description: 'Called when a day is selected.' },
        { prop: 'min', type: 'Date', description: 'Minimum selectable date.' },
        { prop: 'max', type: 'Date', description: 'Maximum selectable date.' },
        { prop: 'weekStartsOnMonday', type: 'boolean', default: 'false', description: 'Start the week on Monday instead of Sunday.' },
        { prop: 'className', type: 'string', description: 'Additional CSS class.' },
      ],
    },
    'bottom-nav': {
      section: 'Responsive',
      title: 'Bottom Nav',
      description:
        'A mobile-style bottom navigation bar with support for active states, badges, and submenu popups. Ideal for phone-sized viewports where sidebar navigation is impractical.',
      guidance: [
        'Use BottomNav inside MobileShell for a native mobile navigation experience.',
        'Each item requires an icon and label — icons are rendered above labels.',
        'Set the submenu prop on an item to show a popup menu instead of direct navigation.',
        'Badges support numeric values and string overflow (e.g., "99+").',
        'The active item is marked with aria-current="page" for accessibility.',
      ],
      props: [
        { prop: 'items', type: 'BottomNavItem[]', required: true, description: 'Array of navigation items.' },
        { prop: 'items[].key', type: 'string', required: true, description: 'Unique item key.' },
        { prop: 'items[].label', type: 'string', required: true, description: 'Display label below the icon.' },
        { prop: 'items[].icon', type: 'ReactNode', required: true, description: 'Icon rendered above the label.' },
        { prop: 'items[].badge', type: 'string | number', description: 'Badge value displayed on the icon corner.' },
        { prop: 'items[].active', type: 'boolean', description: 'Mark this item as the active/current page.' },
        { prop: 'items[].onSelect', type: '() => void', description: 'Click handler (ignored if submenu is set).' },
        { prop: 'items[].submenu', type: 'BottomNavSubMenuItem[]', description: 'Submenu items shown on click as a popup.' },
        { prop: 'className', type: 'string', description: 'Additional CSS class.' },
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
  versionLabel: APP_VERSION,
  mobilePreview: '移动端预览',

  nav: {
    gettingStarted: '开始使用',
    layout: '布局',
    content: '内容',
    forms: '表单',
    components: '组件',
    overlays: '浮层',
    navigation: '导航',
    feedback: '反馈',
    templates: '模板',
    mobile: '响应式',
  },

  pages: {
    introduction: '简介',
    'quick-start': '快速开始',
    'shell-sidebar': '框架与侧边栏',
    'grid-page': '网格与页面',
    'nav-layout': '导航与布局',
    'scroll-area': '滚动区域',
    separator: '分隔线',
    resizable: '可拖拽面板',
    typography: '排版',
    'typography-base': '排版基础',
    badge: '徽章',
    avatar: '头像',
    skeleton: '骨架屏',
    card: '卡片',
    'code-block': '代码块',
    'language-switcher': '语言切换器',
    button: '按钮',
    elements: '基础元素',
    'form-controls': '表单控件',
    'form-inputs': '表单输入',
    toggle: '开关按钮',
    rating: '评分',
    label: '标签',
    'date-pickers': '日期选择器',
    'file-upload': '文件上传',
    'color-picker': '颜色选择器',
    form: '表单组合',
    accordion: '折叠面板',
    tabs: '标签页',
    breadcrumb: '面包屑',
    pagination: '分页',
    stepper: '步骤条',
    progress: '进度条',
    spinner: '加载器',
    alert: '提示',
    toasts: '消息提示',
    table: '表格',
    'data-list': '数据列表',
    timeline: '时间线',
    'tree-view': '树形视图',
    carousel: '轮播',
    'empty-states': '空状态',
    overlays: '浮层',
    'data-display': '数据展示',
    navigation: '导航',
    feedback: '反馈组件',
    dialog: '弹窗',

    sheet: '侧滑面板',
    popover: '弹出框',
    tooltip: '工具提示',
    'hover-card': '悬停卡片',
    'dropdown-menu': '下拉菜单',
    'context-menu': '右键菜单',
    'command-palette': '命令面板',
    'navigation-menu': '导航菜单',
    menubar: '菜单栏',
    mobile: '移动端组件',
    'mobile-list': '移动端列表',
    'home-page': '主页',
    'login-page': '登录页',
    'register-page': '注册页',
    'error-page': '错误页',
    'privacy-policy': '隐私政策',
    'terms-of-service': '服务条款',
    'vxui-provider': 'VXUI Provider',
    viewport: '视口',
    constants: '常量',
    calendar: '日历',
    'bottom-nav': '底部导航',
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
    content: '内容展示',
    contentDesc: '排版、徽章、头像、卡片和代码块。',
    elements: '基础元素',
    elementsDesc: '用于操作、元数据和结构化内容块的低调原语。',
    forms: '表单',
    formsDesc: '输入框、开关、对话框和字段组合模式。',
    inputs: '输入类',
    inputsDesc: '文本输入框、下拉选择、文本域和数字选择器。',
    overlays: '浮层',
    overlaysDesc: '弹窗、弹出框、工具提示和侧滑面板。',
    navigation: '导航',
    navigationDesc: '菜单、导航栏和面包屑。',
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
    heroTag: `最新 · ${APP_VERSION}`,
    heroTitle: '轻量 React 组件库',
    heroLead: '零依赖 · 30+ 组件 · 内置主题与深色模式',
    heroCta: '立即开始',
    heroCtaAlt: '浏览文档',
    previewLead: '',
    previewAccessTitle: '访问方式',
    previewAccessMember: '登录后保留会话状态，随时回到你的工作区。',
    previewAccessGuest: '无需登录，直接以访客身份访问文档。',
    previewMobileTitle: '移动端适配',
    previewMobileLead: '导航与认证布局在移动端自然适配。',
    featuresSectionTitle: '为什么选择 vxUI',
    feat1: '零依赖', feat1Desc: '纯 CSS + TypeScript，无第三方依赖。',
    feat2: '30+ 组件', feat2Desc: '布局、表单、反馈和列表，一套搞定。',
    feat3: '可主题化', feat3Desc: 'CSS 变量驱动，一键切换整套主题。',
    feat4: '深色模式', feat4Desc: '语义化 Token，浅色与深色主题均适配。',
    footerCopy: '© 2026 vxUI. 保留所有权利。',
    footerPrivacy: '隐私政策',
    footerGithub: 'GitHub',
    footerWebsite: '官网',
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
        'Shell 负责侧边栏层级、固定顶栏间距和内容宽度。导航项支持通过 `children` 字段嵌套子菜单，点击父级项可展开或折叠子项。',
      guidance: [
        '保持导航标签简短，确保折叠模式下仍可快速扫读。',
        '使用章节标题分隔页面分组，而非添加视觉噪音。',
        '在导航项中添加 `children` 即可实现可展开子菜单；设置 `defaultOpen: true` 可默认展开。',
        '如果某子项为 active 状态，AppShell 会自动展开对应父级分组。',
        '你可以通过 `sidebarWidth` 属性轻松配置侧边栏的固定宽度（例如 `sidebarWidth={280}` 或 `"18rem"`）。',
      ],
      props: [
        { prop: 'brand', type: 'string', default: '"VXUI"', description: '侧边栏顶部显示的品牌/产品名称。' },
        { prop: 'brandCaption', type: 'string', description: '品牌名称下方显示的次级说明文字。' },
        { prop: 'brandIcon', type: 'ReactNode', description: '侧边栏顶部渲染的 Logo 元素（图片或图标）。' },
        { prop: 'title', type: 'string', description: '顶栏中显示的页面标题。' },
        { prop: 'description', type: 'string', description: '顶栏标题下方的页面副标题/描述。' },
        { prop: 'breadcrumb', type: 'ReactNode', description: '顶栏中渲染的面包屑元素。' },
        { prop: 'navSections', type: 'AppShellNavSection[]', description: '按章节分组的结构化导航树。推荐优先使用此属性。' },
        { prop: 'navItems', type: 'AppShellNavItem[]', description: '平铺导航列表，自动归入单个无标题章节。' },
        { prop: 'sidebarCollapsed', type: 'boolean', default: 'false', description: '将侧边栏折叠为仅显示图标的窄轨模式。' },
        { prop: 'sidebarWidth', type: 'number | string', default: '240px', description: '自定义侧边栏宽度，数字为 px 单位（如 280），也可传入 CSS 字符串（如 "18rem"）。' },
        { prop: 'density', type: '"comfortable" | "compact"', description: '布局密度。"compact" 收紧垂直间距，适合高密度操作界面。' },
        { prop: 'headerActions', type: 'ReactNode', description: '顶栏右侧操作区插槽（按钮、下拉菜单、用户菜单等）。' },
        { prop: 'sidebarFooter', type: 'ReactNode', description: '侧边栏底部内容插槽（用户信息、设置链接等）。' },
        { prop: 'mobileNavOpen', type: 'boolean', default: 'false', description: '控制移动端导航遮罩层是否显示。' },
        { prop: 'onSidebarToggle', type: '() => void', description: '点击折叠/展开按钮时的回调。' },
        { prop: 'onMobileNavToggle', type: '() => void', description: '移动端导航遮罩切换按钮的回调，提供后才会启用移动端导航。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '渲染在 ShellContent 内的主页面内容。' },
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
      props: [
        { prop: 'variant', type: '"solid" | "secondary" | "ghost" | "danger" | "outline" | "soft" | "danger-outline" | "primary-outline" | "gradient"', default: '"solid"', description: '按钮样式变体。' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: '按钮尺寸预设。' },
        { prop: 'fullWidth', type: 'boolean', default: 'false', description: '拉伸填满容器宽度。' },
        { prop: 'shape', type: '"rect" | "square" | "pill" | "circle"', default: '"rect"', description: '按钮形状预设。' },
        { prop: 'loading', type: 'boolean', default: 'false', description: '显示加载旋转器并禁用按钮。' },
        { prop: 'startIcon', type: 'ReactNode', description: '左侧图标插槽。' },
        { prop: 'endIcon', type: 'ReactNode', description: '右侧图标插槽。' },
      ],
    },
    elements: {
      section: '组件',
      title: '基础元素',
      description: 'Button 构成操作的原子基础。其他原子组件（Badge、Text、Heading、CodeBlock、LanguageSwitcher）各有独立文档页，位于"内容展示"分类下。',
      guidance: [
        '每个区域通常一个主操作就足够了。',
        '使用 solid 变体作为区域内的主操作。',
        '使用 secondary 或 ghost 变体作为辅助操作。',
      ],
    },
    'form-controls': {
      section: '组件',
      title: '表单控件',
      description:
        '完整的表单原语集：单行输入框、多行文本域、可搜索单选下拉（Select）、带标签显示的多选下拉（MultiSelect）和时间选择器（TimePicker）。所有组件共享统一的 label / hint / error 布局体系。',
      guidance: [
        '在管理界面中，表单控件始终应配有可见标签。',
        '使用 Select 实现单选下拉；通过 `searchable={N}` 可设为仅当选项超过 N 条时显示搜索框。',
        '当用户需要从有限列表中选择多个值时，使用 MultiSelect。',
        'TimePicker 支持 24 小时制，通过 `seconds` prop 可启用秒选择列。',
        '简短的辅助文本优于仅依赖 placeholder 的说明。',
      ],
      props: [
        { prop: 'Select.options', type: 'SelectOption[]', required: true, description: '可选项数组。' },
        { prop: 'Select.value', type: 'string', description: '受控选中值。' },
        { prop: 'Select.defaultValue', type: 'string', description: '非受控初始值。' },
        { prop: 'Select.onChange', type: '(value: string | undefined) => void', description: '选中项变化时回调。' },
        { prop: 'Select.placeholder', type: 'string', default: '"Select..."', description: '未选择时的占位文本。' },
        { prop: 'Select.label', type: 'string', description: '字段标签。' },
        { prop: 'Select.searchable', type: 'boolean | number', default: 'true', description: '启用搜索。设为数字时超过该数量才显示搜索。' },
        { prop: 'MultiSelect.options', type: 'MultiSelectOption[]', required: true, description: '可选项数组。' },
        { prop: 'MultiSelect.value', type: 'string[]', description: '受控选中值。' },
        { prop: 'MultiSelect.defaultValue', type: 'string[]', default: '[]', description: '非受控初始值。' },
        { prop: 'MultiSelect.onChange', type: '(value: string[]) => void', description: '选中项变化时回调。' },
        { prop: 'MultiSelect.label', type: 'string', description: '字段标签。' },
        { prop: 'MultiSelect.maxDisplay', type: 'number', description: '最多可见标签数，超出显示 "+N more"。' },
        { prop: 'Textarea.label', type: 'string', description: '文本域上方的标签。' },
        { prop: 'Textarea.resize', type: '"none" | "vertical" | "horizontal" | "both"', default: '"vertical"', description: 'CSS 缩放方向。' },
        { prop: 'TimePicker.value', type: 'string', description: '受控时间值（HH:MM 或 HH:MM:SS）。' },
        { prop: 'TimePicker.defaultValue', type: 'string', description: '非受控初始时间。' },
        { prop: 'TimePicker.onChange', type: '(value: string) => void', description: '时间变化时回调。' },
        { prop: 'TimePicker.label', type: 'string', description: '字段标签。' },
        { prop: 'TimePicker.seconds', type: 'boolean', default: 'false', description: '显示秒列。' },
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
    dialog: {
      section: '浮层',
      title: '弹窗',
      description: '中断用户操作以确认操作或展示关键信息的模态对话框。支持多种尺寸、放置选项和关闭按钮。',
      guidance: [
        '在需要用户做出决定才能继续时使用 Dialog。',
        '"sm" 适用于快速确认，"lg" 适用于表单或详细信息展示。',
        'Dialog 会捕获焦点并阻止与背景页面的交互。',
      ],
      props: [
        { prop: 'trigger', type: 'ReactNode', required: true, description: '打开弹窗的触发元素。' },
        { prop: 'title', type: 'string', required: true, description: '弹窗标题。' },
        { prop: 'description', type: 'string', description: '可选的描述文字。' },
        { prop: 'children', type: 'ReactNode', description: '弹窗主体内容。' },
        { prop: 'footer', type: 'ReactNode', description: '自定义页脚内容。' },
        { prop: 'size', type: '"sm" | "md" | "lg" | "xl" | "full"', default: '"md"', description: '弹窗宽度预设。' },
        { prop: 'placement', type: '"center" | "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-half" | "right-half" | "bottom-half" | "left-half"', default: '"center"', description: '弹窗放置位置。' },
        { prop: 'scrollable', type: 'boolean', default: 'true', description: '内容溢出时允许滚动。' },
        { prop: 'closable', type: 'boolean', default: 'true', description: '显示关闭按钮。' },
        { prop: 'open', type: 'boolean', description: '受控打开状态。' },
        { prop: 'defaultOpen', type: 'boolean', description: '非受控初始打开状态。' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: '打开状态变化时回调。' },
        { prop: 'onConfirm', type: '() => void', description: '显示内置确认按钮。' },
        { prop: 'confirmLabel', type: 'string', default: '"Confirm"', description: '确认按钮文本。' },
      ],
    },
    popover: {
      section: '浮层',
      title: '弹出框',
      description: '可包含表单、按钮和结构化内容的丰富弹出面板。与 Tooltip 不同，Popover 可包含交互元素，需要明确的关闭操作。',
      guidance: [
        'Popover 可包含交互内容——表单、按钮、链接。',
        '始终提供关闭机制（点击外部或显式关闭按钮）。',
        'Tooltip 用于只读标签，Popover 用于交互内容。',
      ],
      props: [
        { prop: 'content', type: 'ReactNode', required: true, description: '弹出内容（表单、按钮、链接）。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '触发元素。' },
        { prop: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: '弹出位置。' },
        { prop: 'trigger', type: '"click" | "hover"', default: '"click"', description: '触发方式。' },
        { prop: 'open', type: 'boolean', description: '受控打开状态。' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: '打开状态变化时回调。' },
      ],
    },
    tooltip: {
      section: '浮层',
      title: '工具提示',
      description: '悬停或聚焦时出现的简短非交互标签，用于描述 UI 元素。仅包含文本——无链接、按钮或表单。',
      guidance: [
        'Tooltip 仅用于补充文本——绝不可放入交互内容。',
        'Tooltip 在悬停和聚焦时出现，无需关闭操作。',
        '保持 Tooltip 文本简短——一到五个词为最佳。',
      ],
      props: [
        { prop: 'content', type: 'ReactNode', required: true, description: '工具提示文本内容。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '触发元素。' },
        { prop: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: '提示位置。' },
        { prop: 'delay', type: 'number', default: '600', description: '显示前延迟（毫秒）。' },
      ],
    },
    'hover-card': {
      section: '浮层',
      title: '悬停卡片',
      description: '悬停时出现的卡片，展示链接元素的更丰富预览。适用于用户资料、文档预览或引用摘要。',
      guidance: [
        '使用 HoverCard 预览相关内容，无需导航离开。',
        'HoverCard 可包含比 Tooltip 更丰富的内容——图片、元数据、链接。',
        '确保触发器区域足够大，避免卡片在到达前消失。',
      ],
      props: [
        { prop: 'content', type: 'ReactNode', required: true, description: '卡片内容（图片、元数据、链接）。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '触发元素。' },
        { prop: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: '卡片位置。' },
        { prop: 'delay', type: 'number', default: '400', description: '显示前延迟（毫秒）。' },
      ],
    },
    'dropdown-menu': {
      section: '浮层',
      title: '下拉菜单',
      description: '点击时打开的菜单，展示分组操作或导航项列表。支持嵌套分组、键盘导航和禁用项。',
      guidance: [
        '在带标签的菜单组中对相关操作分组。',
        '在无关操作组之间使用分隔线。',
        '支持键盘导航——方向键、Enter 和 Escape。',
      ],
      props: [
        { prop: 'trigger', type: 'ReactNode', required: true, description: '打开菜单的触发元素。' },
        { prop: 'groups', type: 'DropdownMenuGroupProps[]', description: '分组菜单项（组间显示分隔线）。' },
        { prop: 'items', type: 'DropdownMenuItemProps[]', description: '平铺菜单项列表。' },
        { prop: 'align', type: '"left" | "right"', default: '"left"', description: '菜单相对触发器的对齐方式。' },
        { prop: 'open', type: 'boolean', description: '受控打开状态。' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: '打开状态变化时回调。' },
      ],
    },
    'context-menu': {
      section: '浮层',
      title: '右键菜单',
      description: '右键点击时出现的菜单，提供与点击元素相关的操作列表。支持与 DropdownMenu 相同的项和分组 API。',
      guidance: [
        '使用 ContextMenu 公开用户通过右键发现的次要操作。',
        '始终提供访问相同操作的替代方式（工具栏、按钮）。',
        '保持菜单简短——长右键菜单难以快速扫读。',
      ],
      props: [
        { prop: 'groups', type: 'ContextMenuGroupProps[]', description: '分组菜单项。' },
        { prop: 'items', type: 'ContextMenuItemProps[]', description: '平铺菜单项列表。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '触发右键菜单的元素。' },
      ],
    },
    'command-palette': {
      section: '浮层',
      title: '命令面板',
      description:
        '键盘驱动的搜索浮层，让用户无需离开键盘即可跳转到任意页面或触发任意操作。全局挂载、绑定快捷键，传入扁平的条目列表即可使用。',
      guidance: [
        '保持条目列表扁平且按标签可搜索——避免隐藏分类嵌套。',
        '从与侧边栏相同的导航数据填充条目，保持两个入口同步。',
        '绑定 ⌘K（Mac）或 Ctrl+K（Windows）快捷键。',
      ],
      props: [
        { prop: 'entries', type: 'SearchEntry[]', required: true, description: '可搜索条目的扁平列表。' },
        { prop: 'open', type: 'boolean', required: true, description: '受控打开状态。' },
        { prop: 'onClose', type: '() => void', required: true, description: '面板关闭时回调。' },
        { prop: 'onSelect', type: '(key: string) => void', required: true, description: '条目被选中时回调。' },
        { prop: 'placeholder', type: 'string', default: '"Search components, pages, keywords..."', description: '搜索输入框占位符。' },
      ],
    },
    'navigation-menu': {
      section: '导航',
      title: '导航菜单',
      description: '支持悬停时多级下拉菜单的横向导航栏。适用于具有嵌套章节的顶级站点导航。',
      guidance: [
        '在具有多层内容的站点级导航中使用 NavigationMenu。',
        '每个项可包含子项用于次级导航。',
        '保持顶级项简短——每个一两个词即可。',
      ],
      props: [
        { prop: 'items', type: 'NavMenuItem[]', required: true, description: '顶级导航项。' },
        { prop: 'NavMenuItem.label', type: 'string', required: true, description: '项显示文本。' },
        { prop: 'NavMenuItem.href', type: 'string', description: '链接 URL（无子项时使用）。' },
        { prop: 'NavMenuItem.items', type: 'NavMenuSubItem[]', description: '子菜单项。' },
      ],
    },
    menubar: {
      section: '导航',
      title: '菜单栏',
      description: '通常用于应用级操作（文件、编辑、视图）的横向菜单栏。支持菜单间的键盘导航。',
      guidance: [
        'Menubar 遵循桌面应用惯例——用于应用级命令菜单。',
        '每个菜单可包含项、分组和分隔线。',
        '方向键在菜单间导航；Escape 关闭当前菜单。',
      ],
      props: [
        { prop: 'menus', type: 'MenubarMenuProps[]', required: true, description: '顶级菜单定义。' },
        { prop: 'MenubarMenu.label', type: 'string', required: true, description: '菜单触发标签。' },
        { prop: 'MenubarMenu.groups', type: 'MenubarGroupProps[]', description: '分组项（含分隔线）。' },
        { prop: 'MenubarMenu.items', type: 'MenubarItemProps[]', description: '平铺项列表。' },
        { prop: 'MenubarItem.label', type: 'ReactNode', required: true, description: '项显示内容。' },
        { prop: 'MenubarItem.icon', type: 'ReactNode', description: '项图标。' },
        { prop: 'MenubarItem.shortcut', type: 'string', description: '快捷键文本。' },
        { prop: 'MenubarItem.disabled', type: 'boolean', description: '禁用该项。' },
        { prop: 'MenubarItem.danger', type: 'boolean', description: '应用危险样式。' },
        { prop: 'MenubarItem.onClick', type: '() => void', description: '点击回调。' },
      ],
    },
    resizable: {
      section: '布局',
      title: '可拖拽面板',
      description: '由 ResizablePanelGroup、ResizablePanel 和 ResizableHandle 组成的分割面板布局组件，支持水平和垂直排列且分隔线可拖拽。',
      guidance: [
        '使用 ResizablePanelGroup 作为外层容器，内部嵌套 ResizablePanel 和 ResizableHandle。',
        'direction 设为 "horizontal" 实现左右布局，"vertical" 实现上下布局。',
        '面板之间的拖拽手柄可拖动调整各面板尺寸。',
      ],
      props: [
        { prop: 'ResizablePanelGroup.direction', type: '"horizontal" | "vertical"', default: '"horizontal"', description: '面板布局方向。' },
        { prop: 'ResizablePanelGroup.disabled', type: 'boolean', default: 'false', description: '禁用所有分隔线拖拽。' },
        { prop: 'ResizablePanel.defaultSize', type: 'number', default: '50', description: '初始大小百分比。' },
        { prop: 'ResizablePanel.minSize', type: 'number', default: '10', description: '最小大小百分比。' },
        { prop: 'ResizablePanel.maxSize', type: 'number', default: '90', description: '最大大小百分比。' },
      ],
    },
    'file-upload': {
      section: '表单',
      title: '文件上传',
      description: '支持拖拽上传和点击浏览的文件上传区域。支持多文件上传、预览和移除。',
      guidance: [
        '使用 multiple 属性接受多个文件——每个文件以预览卡片展示。',
        '通过 onChange 回调获取上传文件的信息（名称、大小和文件对象）。',
        '组件自带拖拽状态管理和视觉反馈。',
      ],
      props: [
        { prop: 'label', type: 'string', description: '字段标签文本。' },
        { prop: 'hint', type: 'string', description: '上传区域下方的辅助文本。' },
        { prop: 'error', type: 'string', description: '错误信息文本。' },
        { prop: 'accept', type: 'string', description: '文件输入 accept 属性（如 ".png,.jpg"）。' },
        { prop: 'multiple', type: 'boolean', default: 'false', description: '允许多文件选择。' },
        { prop: 'maxSize', type: 'number', description: '最大文件大小（字节）。' },
        { prop: 'disabled', type: 'boolean', description: '禁用上传区域。' },
        { prop: 'onFiles', type: '(files: File[]) => void', description: '选择文件后的回调。' },
      ],
    },
    'color-picker': {
      section: '表单',
      title: '颜色选择器',
      description: '弹出式颜色选择控件，包含色相、饱和度和亮度滑块。支持预设色板和自定义十六进制输入。',
      guidance: [
        '适用于品牌颜色配置、标签颜色或主题自定义。',
        '同时提供可视化选取器和精确十六进制输入。',
        '可通过 swatches 属性定制品牌专属色板。',
      ],
      props: [
        { prop: 'value', type: 'string', description: '受控十六进制颜色值。' },
        { prop: 'defaultValue', type: 'string', default: '"#3b82f6"', description: '非受控初始颜色。' },
        { prop: 'onChange', type: '(color: string) => void', description: '颜色变化时回调。' },
        { prop: 'label', type: 'string', description: '字段标签文本。' },
        { prop: 'hint', type: 'string', description: '选择器下方辅助文本。' },
        { prop: 'error', type: 'string', description: '错误信息文本。' },
        { prop: 'disabled', type: 'boolean', description: '禁用选择器。' },
        { prop: 'presets', type: 'string[]', description: '预设色块十六进制颜色数组。' },
        { prop: 'showPresets', type: 'boolean', default: 'true', description: '显示/隐藏预设色块。' },
      ],
    },
    accordion: {
      section: '组件',
      title: '折叠面板',
      description: '垂直堆叠的可折叠面板列表。每个面板有可切换展开/折叠的标题区域。支持单面板和双面板同时展开。',
      guidance: [
        '适用于 FAQ、设置面板和渐进式披露模式。',
        '默认每次只能展开一个面板（type="single"）。',
        '设置 allowMultiple 可允许多个面板同时保持展开状态。',
      ],
      props: [
        { prop: 'items', type: 'AccordionItem[]', required: true, description: '折叠面板定义数组。' },
        { prop: 'multiple', type: 'boolean', default: 'false', description: '允许多个面板同时展开。' },
        { prop: 'defaultOpen', type: 'string[]', default: '[]', description: '初始展开面板的键名数组。' },
      ],
    },
    tabs: {
      section: '组件',
      title: '标签页',
      description: '用于在多个内容面板间切换的标签页组件。支持受控和非受控模式及键盘导航。',
      guidance: [
        '使用 Tabs 将相关内容组织到独立面板中，无需跳转到新页面。',
        'TabsList 存放触发按钮，TabsContent 存放面板内容。',
        '非受控使用 defaultValue，受控模式使用 value/onValueChange。',
      ],
      props: [
        { prop: 'value', type: 'string', description: '受控选中标签值。' },
        { prop: 'defaultValue', type: 'string', description: '非受控初始标签。' },
        { prop: 'onValueChange', type: '(value: string) => void', description: '标签切换时回调。' },
        { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: '标签布局方向。' },
      ],
    },
    breadcrumb: {
      section: '组件',
      title: '面包屑',
      description: '显示用户在页面层级中当前位置的导航辅助。每个分段对应相应层级的链接。',
      guidance: [
        '面包屑反映 URL 深度——单层页面可完全省略。',
        '使用 separator 属性自定义分段之间的分隔符。',
        '最后一个分段应为当前页面（非链接），以确保无障碍。',
      ],
      props: [
        { prop: 'items', type: 'BreadcrumbItem[]', required: true, description: '面包屑分段的有序列表。' },
        { prop: 'separator', type: 'ReactNode', default: 'Chevron', description: '分段间的自定义分隔符。' },
      ],
    },
    pagination: {
      section: '组件',
      title: '分页',
      description: '将大数据集分页展示的导航控件。显示页码及上/下翻页按钮，可选页面大小选择器。',
      guidance: [
        '显示总页数，让用户了解数据集大小。',
        '使用 siblings 属性控制在当前页周围显示的页码数量。',
        'onPageChange 回调返回新页码，用于外部数据加载。',
      ],
      props: [
        { prop: 'page', type: 'number', required: true, description: '当前页码（从 1 开始）。' },
        { prop: 'total', type: 'number', required: true, description: '数据总条数。' },
        { prop: 'pageSize', type: 'number', default: '10', description: '每页条数。' },
        { prop: 'siblingCount', type: 'number', default: '1', description: '当前页两侧显示的页码按钮数。' },
        { prop: 'onChange', type: '(page: number) => void', required: true, description: '点击页码时回调。' },
      ],
    },
    stepper: {
      section: '组件',
      title: '步骤条',
      description: '在线性工作流中可视化用户当前位置的多步骤进度指示器。支持已完成、进行中、待处理和错误状态。',
      guidance: [
        '适用于多页表单、结账流程或设置向导。',
        '每一步可以是 "completed"、"active"、"pending" 或 "error" 状态。',
        '错误状态的步骤将吸引注意力，方便用户导航回去修复。',
      ],
      props: [
        { prop: 'steps', type: 'StepItem[]', required: true, description: '步骤定义数组。' },
        { prop: 'currentStep', type: 'number', default: '0', description: '当前激活步骤的索引（从 0 开始）。' },
        { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: '布局方向。' },
      ],
    },
    progress: {
      section: '组件',
      title: '进度条',
      description: '指示确定性操作完成百分比的横向进度条。支持带标签和不带标签的变体。',
      guidance: [
        '对已知持续时间的确定性操作使用 Progress（如文件上传、数据导出）。',
        '对未知持续时间的等待使用 Spinner。',
        'value 属性接受 0-100 范围的值，100 表示完成。',
      ],
      props: [
        { prop: 'value', type: 'number', default: '0', description: '当前进度值（0-100）。' },
        { prop: 'label', type: 'string', description: '进度条上方文本标签。' },
        { prop: 'showLabel', type: 'boolean', default: 'false', description: '显示百分比文字。' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: '进度条粗细预设。' },
        { prop: 'variant', type: '"default" | "success" | "warning" | "danger" | "rainbow"', default: '"default"', description: '进度条颜色变体。' },
        { prop: 'indeterminate', type: 'boolean', default: 'false', description: '不确定模式（动画）。' },
      ],
    },
    spinner: {
      section: '组件',
      title: '加载器',
      description: '用于不确定等待状态的旋转指示器。在内容正在加载或处理且时长未知时使用。',
      guidance: [
        '对短暂且剩余时间未知的等待使用 Spinner。',
        '对已知持续时间的确定性操作使用 Progress。',
        'Spinner 支持 size 属性（"sm"、"md"、"lg"）以匹配周围上下文。',
      ],
      props: [
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: '旋转器尺寸（16/24/36 px）。' },
        { prop: 'label', type: 'string', default: '"Loading…"', description: '无障碍 aria-label 文本。' },
      ],
    },
    alert: {
      section: '组件',
      title: '提示',
      description: '传达成功、警告、危险或信息状态的重要状态消息。用户可选择关闭。',
      guidance: [
        '对持久性或页面级状态消息使用 Alert——重要信息优先于 Toast。',
        '支持 "info"、"success"、"warning" 和 "danger" 变体。',
        'dismissible 属性可添加关闭按钮，用户可手动关闭提示。',
      ],
      props: [
        { prop: 'variant', type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: '样式变体。' },
        { prop: 'title', type: 'string', description: '提示标题文本。' },
        { prop: 'icon', type: 'ReactNode', description: '自定义图标覆盖。' },
        { prop: 'onClose', type: '() => void', description: '关闭按钮回调（省略时不显示关闭按钮）。' },
      ],
    },
    table: {
      section: '组件',
      title: '表格',
      description: '支持可排序列、可选斑马纹和响应式溢出的数据表格。适用于以列排序方式列示结构化数据。',
      guidance: [
        'Table 支持可排序列——后端数据时请将排序状态向上委托。',
        '在密集表格中使用斑马纹可帮助视线跟踪对齐。',
        'columns 属性定义表头；每列可设置 sortKey 实现客户端排序。',
      ],
      props: [
        { prop: 'columns', type: 'TableColumn[]', required: true, description: '列定义。' },
        { prop: 'data', type: 'T[]', required: true, description: '行数据。' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: '行高预设。' },
        { prop: 'striped', type: 'boolean', default: 'false', description: '斑马纹交替背景。' },
        { prop: 'hoverable', type: 'boolean', default: 'true', description: '行悬停高亮。' },
        { prop: 'stickyHeader', type: 'boolean', default: 'false', description: '固定表头。' },
        { prop: 'loading', type: 'boolean', default: 'false', description: '显示加载遮罩。' },
        { prop: 'sortColumn', type: 'string', description: '受控排序列键名。' },
        { prop: 'sortDirection', type: '"asc" | "desc"', description: '受控排序方向。' },
        { prop: 'onSortChange', type: '(column: string, direction) => void', description: '排序变化回调。' },
      ],
    },
    'empty-states': {
      section: '组件',
      title: '空状态',
      description:
        '空状态应解释缺少什么、为何重要以及下一步操作是什么。它不应让用户感到走投无路。EmptyState 组件提供了包含图标、标题、描述和操作插槽的一致布局。',
      guidance: [
        '指明缺失的对象，让用户清楚自己在看什么。',
        '通过 action 属性提供一个清晰的恢复操作。',
        '视觉重量应轻于成功或警告反馈。',
      ],
      props: [
        { prop: 'icon', type: 'ReactNode', description: '标题上方展示的插画或图标。' },
        { prop: 'title', type: 'string', required: true, description: '解释缺失对象的主标题。' },
        { prop: 'description', type: 'string', description: '标题下方的可选说明文字。' },
        { prop: 'action', type: 'ReactNode', description: '用于恢复的操作按钮或链接。' },
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
      props: [
        { prop: 'push', type: '(toast: ToastInput) => void', description: '显示 Toast 通知。' },
        { prop: 'ToastInput.title', type: 'string', required: true, description: 'Toast 标题文本。' },
        { prop: 'ToastInput.description', type: 'string', description: '可选的描述文本。' },
        { prop: 'ToastInput.tone', type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: 'Toast 视觉风格。' },
      ],
    },
    feedback: {
      section: '反馈',
      title: '反馈组件',
      description:
        'Alert、Progress、Spinner、Stepper 和 Toast 在不阻塞布局的情况下指示应用状态。',
      guidance: [
        '对短暂的不确定等待使用 Spinner；对确定性操作使用 Progress。',
        '对持久性或页面级状态消息，优先使用 Alert 而非 Toast。',
      ],
    },
    overlays: {
      section: '组件',
      title: '浮层',
      description:         'Dialog、ContextMenu、HoverCard、Tooltip、Popover 和 DropdownMenu 在页面上方将临时内容和操作置于上方。',
      guidance: [
        'Tooltip 仅用于补充文本，绝不放置可交互内容。',
        'Popover 可包含表单和富内容；需要明确的关闭触发器。',
        'DropdownMenu 应对相关操作分组，并支持键盘导航。',
      ],
    },
    'nav-layout': {
      section: '布局',
      title: '导航与布局',
      description: 'Tabs、Accordion、Breadcrumb 和 Resizable 帮助结构化展示内容。其他布局组件（ScrollArea、Separator）各有独立文档页。',
      guidance: [
        'Breadcrumb 反映路由深度——单层页面可省略。',
        'Pagination 应显示总页数，让用户了解数据集大小。',
        'Accordion 最适合渐进式披露，而非主导航。',
      ],
    },
    'data-display': {
      section: '组件',
      title: '数据展示',
      description: 'Table 和 EmptyState 以紧凑方式呈现结构化数据。其他数据组件（Avatar、Badge、Card、Carousel、Timeline、TreeView）各有独立文档页。',
      guidance: [
        'Table 支持可排序列——后端数据时请将排序状态向上委托。',
        '在密集表格中使用斑马纹可帮助视线在大段行间对齐追踪。',
        'EmptyState 应尽可能包含一个明确的恢复操作。',
      ],
    },
    'form-inputs': {
      section: '表单',
      title: '表单输入',
      description:
        'Checkbox、Radio、Switch、Slider、NumberInput、TagInput、SegmentedControl 和 Input 在文本输入框之外扩展了表单词汇。其他表单组件（Label、Toggle、Rating、DatePicker）各有独立文档页。',
      guidance: [
        '使用 RadioGroup 对单选按钮分组，共享 name 和语义。',
        'Slider 适合数值范围，配合 showValue 可提供即时反馈。',
        'Textarea 默认可垂直调整尺寸——仅在固定高度容器中禁用调整。',
        'Switch 用于即时状态切换（如设置开关），Checkbox 用于表单提交或多选。',
      ],
      props: [
        { prop: 'Checkbox.label', type: 'ReactNode', description: '复选框旁边的标签。' },
        { prop: 'Checkbox.indeterminate', type: 'boolean', description: '显示不确定状态。' },
        { prop: 'Radio.label', type: 'ReactNode', description: '单选按钮旁边的标签。' },
        { prop: 'RadioGroup.label', type: 'string', description: '作为 <legend> 渲染的分组标签。' },
        { prop: 'Switch.label', type: 'string', required: true, description: '可见标签文本。' },
        { prop: 'Switch.description', type: 'string', description: '标签下方的描述。' },
        { prop: 'Slider.label', type: 'string', description: '滑块上方标签。' },
        { prop: 'Slider.showValue', type: 'boolean', default: 'false', description: '显示当前值。' },
        { prop: 'NumberInput.label', type: 'string', description: '输入框上方标签。' },
        { prop: 'NumberInput.value', type: 'number', description: '受控值。' },
        { prop: 'NumberInput.onChange', type: '(value: number) => void', description: '值变化时回调。' },
        { prop: 'NumberInput.min', type: 'number', description: '最小值。' },
        { prop: 'NumberInput.max', type: 'number', description: '最大值。' },
        { prop: 'NumberInput.step', type: 'number', default: '1', description: '步进增量。' },
        { prop: 'TagInput.value', type: 'string[]', description: '受控标签值。' },
        { prop: 'TagInput.defaultValue', type: 'string[]', default: '[]', description: '非受控默认标签。' },
        { prop: 'TagInput.onChange', type: '(tags: string[]) => void', description: '标签变化时回调。' },
        { prop: 'TagInput.placeholder', type: 'string', default: '"Add tag..."', description: '占位符。' },
        { prop: 'TagInput.maxTags', type: 'number', description: '最大标签数量。' },
        { prop: 'SegmentedControl.options', type: 'SegmentedControlOption[]', required: true, description: '选项数组。' },
        { prop: 'SegmentedControl.value', type: 'string', description: '受控值。' },
        { prop: 'SegmentedControl.defaultValue', type: 'string', description: '非受控初始值。' },
        { prop: 'SegmentedControl.onChange', type: '(value: string) => void', description: '选择变化时回调。' },
        { prop: 'SegmentedControl.size', type: '"sm" | "md" | "lg"', default: '"md"', description: '控件尺寸预设。' },
        { prop: 'Input.label', type: 'string', description: '输入框上方标签。' },
        { prop: 'Input.hint', type: 'string', description: '输入框下方的辅助文本。' },
        { prop: 'Input.error', type: 'string', description: '错误信息。' },
        { prop: 'Input.prefix', type: 'ReactNode', description: '输入框内部前置装饰。' },
        { prop: 'Input.suffix', type: 'ReactNode', description: '输入框内部后置装饰。' },
        { prop: 'Input.variant', type: '"default" | "filled" | "underline" | "borderless"', default: '"default"', description: '样式变体。' },
        { prop: 'Input.size', type: '"sm" | "md" | "lg"', default: '"md"', description: '尺寸预设。' },
      ],
    },
    'mobile-list': {
      section: '响应式',
      title: '移动端列表',
      description: 'MobileList、MobileListSection 和 MobileListItem 提供原生感的列表，适用于移动端导航、设置和数据展示。每个条目支持前置图标、尾部内容、箭头指示器以及破坏性或禁用状态。',
      guidance: [
        '使用 MobileListSection 的 title 属性对相关条目分组。',
        '对于导航到详情页的条目设置 chevron 箭头——静态或切换条目省略。',
        '对于不可逆操作（删除、退出、移除）使用 destructive 样式，文字变红。',
        '禁用条目以低视觉权重渲染并阻止点击事件。',
      ],
      props: [
        { prop: 'MobileList', type: '—', description: '带列表样式的根 <ul> 元素。' },
        { prop: 'MobileListSection.title', type: 'string', description: '分组标题文字。' },
        { prop: 'MobileListItem.leading', type: 'ReactNode', description: '左侧图标或头像。' },
        { prop: 'MobileListItem.trailing', type: 'ReactNode', description: '右侧自定义内容（徽章、数值等）。' },
        { prop: 'MobileListItem.label', type: 'ReactNode', required: true, description: '主标签文字。' },
        { prop: 'MobileListItem.description', type: 'ReactNode', description: '次要描述文字。' },
        { prop: 'MobileListItem.chevron', type: 'boolean', default: 'false', description: '显示右侧箭头。' },
        { prop: 'MobileListItem.destructive', type: 'boolean', default: 'false', description: '破坏性操作样式（红色文字）。' },
        { prop: 'MobileListItem.disabled', type: 'boolean', default: 'false', description: '禁用条目。' },
        { prop: 'MobileListItem.onClick', type: '() => void', description: '点击回调。' },
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
    'code-block': {
      section: '组件',
      title: '代码块',
      description:
        '带语法高亮的只读代码展示组件，支持可选的文件名标签。用于渲染安装步骤、用法示例或任意格式化的代码字符串。',
      guidance: [
        '通过 language 属性指定代码语言（tsx、bash、json 等），以获得正确高亮。',
        '传入 filename 可为读者提供该代码片段在项目中所属位置的上下文。',
        '保持示例代码精简——只展示说明当前概念所需的最少行数。',
      ],
      props: [
        { prop: 'code', type: 'string', required: true, description: '要高亮显示的源代码字符串。' },
        { prop: 'language', type: '"tsx" | "typescript" | "javascript" | "jsx" | "bash" | "json" | "markup"', default: '"tsx"', description: 'Prism 语言标识符。' },
        { prop: 'filename', type: 'string', description: '代码块上方显示的文件名标签。' },
      ],
    },
    'language-switcher': {
      section: '组件',
      title: '语言切换器',
      description:
        '点击后即可更新整套 UI 文案的语言切换组件。放入任意顶栏或设置区域——i18n Provider 会自动广播变更，无需额外状态绑定。',
      guidance: [
        '将切换器放置在持久性界面（顶栏或设置页）中，方便用户在任何位置找到它。',
        '切换器自动反映当前语言，除 i18n Provider 外无需额外的状态绑定。',
        '顶栏中使用 inline 变体，设置页中使用默认变体，以匹配对应场景的视觉密度。',
      ],
      props: [
        { prop: 'variant', type: '"inline" | "sidebar"', default: '"inline"', description: '"inline" 用于顶栏；"sidebar" 用于侧边栏底部。' },
      ],
    },
    'scroll-area': {
      section: '布局',
      title: '滚动区域',
      description: '一个带有自定义滚动条的滚动容器。使用 maxHeight 或 maxWidth 将溢出内容限制在固定视口内。',
      guidance: [
        '设置 maxHeight 限制垂直溢出——超出视口的内容可在内部滚动。',
        '传入数字按像素计算，传入字符串如 "50vh" 按相对尺寸计算。',
        'ScrollArea 纯属展示性组件，不支持虚拟化或延迟渲染子元素。',
      ],
      props: [
        { prop: 'maxHeight', type: 'string | number', description: '内容滚动前的最大高度，数字按像素处理。' },
        { prop: 'maxWidth', type: 'string | number', description: '内容滚动前的最大宽度，数字按像素处理。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '滚动视口内的内容。' },
      ],
    },
    separator: {
      section: '布局',
      title: '分隔线',
      description: '用于分隔内容区域的视觉分割线。渲染为 <hr> 元素，支持水平或垂直方向。',
      guidance: [
        '水平分隔线用于堆叠的章节之间；垂直分隔线用于工具栏或行内上下文。',
        'decorative 属性控制 role 属性——当分隔线具有语义含义时应设为 false。',
        '垂直分隔线需要指定显式高度才能正确渲染。',
      ],
      props: [
        { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: '分隔线的方向。' },
        { prop: 'decorative', type: 'boolean', default: 'true', description: '为 true 时设置 role="none"，否则设置 role="separator"。' },
      ],
    },
    timeline: {
      section: '组件',
      title: '时间线',
      description: '按时间顺序排列的垂直事件列表。每个条目显示标题、可选描述、时间、图标和状态指示器。',
      guidance: [
        '适用于活动动态、订单跟踪或部署历史。',
        '将 status 设为 "success"、"warning"、"danger" 或 "info" 可设置时间点颜色。',
        '在条目中传入 icon 可替换默认的点图标。',
      ],
      props: [
        { prop: 'items', type: 'TimelineItem[]', required: true, description: '时间线条目数组。' },
        { prop: 'items[].title', type: 'string', required: true, description: '事件标题。' },
        { prop: 'items[].description', type: 'string', description: '事件描述。' },
        { prop: 'items[].time', type: 'string', description: '时间戳或日期标签。' },
        { prop: 'items[].icon', type: 'ReactNode', description: '替换默认点的自定义图标。' },
        { prop: 'items[].status', type: '"default" | "success" | "warning" | "danger" | "info"', description: '点的状态颜色。' },
      ],
    },
    'tree-view': {
      section: '组件',
      title: '树形视图',
      description: '支持展开/折叠节点、键盘导航和可选选中状态的层级树控件。适用于文件浏览器、组织架构或嵌套设置。',
      guidance: [
        '使用 defaultExpanded 在初始渲染时预展开某些节点。',
        '每个节点需要唯一的 id 用于选择和展开状态跟踪。',
        'TreeView 支持受控（selected/expanded）或非受控模式。',
        'disabled 的节点不可选中或展开，但仍可见。',
      ],
      props: [
        { prop: 'nodes', type: 'TreeNode[]', required: true, description: '根级树节点。' },
        { prop: 'selected', type: 'string', description: '受控选中的节点 id。' },
        { prop: 'defaultSelected', type: 'string', description: '非受控初始选中节点 id。' },
        { prop: 'onSelect', type: '(id: string, node: TreeNode) => void', description: '节点选中时调用。' },
        { prop: 'expanded', type: 'string[]', description: '受控展开的节点 id 数组。' },
        { prop: 'defaultExpanded', type: 'string[]', description: '非受控初始展开节点 id 数组。' },
        { prop: 'onExpandedChange', type: '(ids: string[]) => void', description: '展开状态变化时调用。' },
      ],
    },
    carousel: {
      section: '组件',
      title: '轮播',
      description: '基于滑块的轮播组件，支持圆点指示器、箭头导航、自动播放和循环。每个滑块可接受任意 React 内容。',
      guidance: [
        '设置 autoPlay 实现无人值守轮播——适用于横幅广告或信息亭。',
        '禁用 loop 用于线性引导流程，用户不应循环回到开头。',
        '通过 index 属性支持受控索引，便于外部分页同步。',
        '在构建极简变体时，使用 showArrows / showDots 隐藏箭头或圆点。',
      ],
      props: [
        { prop: 'items', type: 'ReactNode[]', required: true, description: '滑块内容数组。' },
        { prop: 'defaultIndex', type: 'number', default: '0', description: '初始滑块索引（非受控）。' },
        { prop: 'index', type: 'number', description: '受控的当前滑块索引。' },
        { prop: 'onIndexChange', type: '(index: number) => void', description: '活动滑块变化时调用。' },
        { prop: 'autoPlay', type: 'boolean', default: 'false', description: '按时间间隔自动前进滑块。' },
        { prop: 'interval', type: 'number', default: '3000', description: '自动播放间隔（毫秒）。' },
        { prop: 'loop', type: 'boolean', default: 'true', description: '从最后一张循环回到第一张。' },
        { prop: 'showDots', type: 'boolean', default: 'true', description: '显示圆点指示器。' },
        { prop: 'showArrows', type: 'boolean', default: 'true', description: '显示上一张/下一张箭头按钮。' },
      ],
    },
    toggle: {
      section: '表单',
      title: '开关按钮',
      description: '在按下和未按下状态之间切换的双状态按钮。ToggleGroup 将其扩展为一组选项间的单选/多选。',
      guidance: [
        'Toggle 适用于工具栏开关（加粗/斜体、筛选标签），ToggleGroup 适用于视图模式切换。',
        'ToggleGroup type="single" 类似单选按钮组，type="multiple" 允许多选。',
        '同时支持受控（pressed/value）和非受控（defaultPressed/defaultValue）模式。',
      ],
      props: [
        { prop: 'Toggle.pressed', type: 'boolean', description: '受控按下状态。' },
        { prop: 'Toggle.defaultPressed', type: 'boolean', default: 'false', description: '非受控初始按下状态。' },
        { prop: 'Toggle.onPressedChange', type: '(pressed: boolean) => void', description: '按下状态变化时调用。' },
        { prop: 'Toggle.size', type: '"sm" | "md" | "lg"', default: '"md"', description: '按钮尺寸。' },
        { prop: 'ToggleGroup.items', type: 'ToggleGroupItem[]', required: true, description: '开关选项数组。' },
        { prop: 'ToggleGroup.value', type: 'string | string[]', description: '受控选中值。' },
        { prop: 'ToggleGroup.defaultValue', type: 'string | string[]', description: '非受控初始选中值。' },
        { prop: 'ToggleGroup.onValueChange', type: '(value: string | string[]) => void', description: '选中值变化时调用。' },
        { prop: 'ToggleGroup.type', type: '"single" | "multiple"', default: '"single"', description: '选择模式。' },
      ],
    },
    rating: {
      section: '表单',
      title: '评分',
      description: '基于星形的评分输入组件，支持整星和半星精度、受控/非受控模式和只读/禁用状态。',
      guidance: [
        '设置 allowHalf 允许半星精度，用于需要精细反馈的场景。',
        '使用 readOnly 作为仅展示评分（如历史平均值），disabled 完全阻止交互。',
        'size 属性调整星形尺寸以适配不同的视觉语境。',
      ],
      props: [
        { prop: 'value', type: 'number', description: '受控评分值。' },
        { prop: 'defaultValue', type: 'number', default: '0', description: '非受控初始值。' },
        { prop: 'onChange', type: '(value: number) => void', description: '评分变化时调用。' },
        { prop: 'max', type: 'number', default: '5', description: '最大星数。' },
        { prop: 'allowHalf', type: 'boolean', default: 'false', description: '允许半星值。' },
        { prop: 'disabled', type: 'boolean', description: '禁用交互。' },
        { prop: 'readOnly', type: 'boolean', description: '只读展示模式。' },
        { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: '星形尺寸。' },
        { prop: 'label', type: 'string', description: '评分组的无障碍标签。' },
      ],
    },
    label: {
      section: '表单',
      title: '标签',
      description: '带可选必填标记的样式化 <label> 元素。与任意表单控件配合使用，提供无障碍标签。',
      guidance: [
        '始终将 Label 与其表单控件关联——可以包裹输入组件或使用 htmlFor。',
        '设置 required 可在标签文本后自动追加红色星号。',
        'Label 是轻量封装，透传所有标准 label 属性到底层元素。',
      ],
      props: [
        { prop: 'required', type: 'boolean', description: '在标签文本后显示必填标记（红色星号）。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '标签文本内容。' },
      ],
    },
    avatar: {
      section: '内容展示',
      title: '头像',
      description: '显示用户头像，支持图片、首字母回退或占位图标。支持多种尺寸和形状。',
      guidance: [
        '始终通过 name 或 alt 属性提供无障碍标签。',
        'src 属性接受图片 URL；加载失败时自动回退为首字母或 fallback 文本。',
        '首字母从 name 属性自动生成（最多 2 个字符）。',
        '圆形为默认形状，数据密集布局可使用方形。',
      ],
      props: [
        { prop: 'src', type: 'string', description: '头像图片 URL。' },
        { prop: 'name', type: 'string', description: '用户名，用于生成首字母和无障碍标签。' },
        { prop: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: '头像尺寸。' },
        { prop: 'shape', type: '"circle" | "square"', default: '"circle"', description: '头像形状。' },
        { prop: 'fallback', type: 'string', description: '当无图片和名称时的自定义回退文字。' },
      ],
    },
    badge: {
      section: '内容展示',
      title: '徽章',
      description: '用于状态、分类或元数据的紧凑标签。可内联于文本中，或放在按钮、卡片和表格单元格内。',
      guidance: [
        '徽章用于紧凑的状态或分类元数据，而非纯装饰。',
        'accent 变体保留给品牌的颜色；success 和 warning 传达语义状态。',
        '徽章是内联元素，与文本和其他内联内容自然排列。',
      ],
      props: [
        { prop: 'variant', type: '"neutral" | "accent" | "success" | "warning"', default: '"neutral"', description: '视觉样式变体。' },
      ],
    },
    skeleton: {
      section: '内容展示',
      title: '骨架屏',
      description: '在数据加载时模拟内容形状的占位组件。支持文本、矩形和圆形变体，以及多行文本块。',
      guidance: [
        '骨架屏形状与实际内容匹配，减少布局偏移。',
        '使用 variant="text" 配合 lines > 1 模拟段落占位。',
        '多行文本骨架屏的最后一行宽度为 70%，视觉效果更自然。',
      ],
      props: [
        { prop: 'variant', type: '"text" | "rect" | "circle"', default: '"rect"', description: '形状变体。' },
        { prop: 'width', type: 'string | number', description: '宽度，数字按像素计算。' },
        { prop: 'height', type: 'string | number', description: '高度，数字按像素计算。' },
        { prop: 'lines', type: 'number', default: '1', description: '文本变体的行数。' },
      ],
    },
    typography: {
      section: '内容展示',
      title: '排版',
      description: 'Heading 和 Text 提供核心排版系统。Heading 渲染 <h1>-<h6> 并基于级别调整字号；Text 渲染 <p>、<span> 或 <div>，支持变体、尺寸和字重选项。',
      guidance: [
        '使用 Heading 作为章节标题和层级内容结构。',
        '使用 variant="secondary" 或 "muted" 降低内容强调程度。',
        'truncate 属性超出时以省略号截断——适用于表格单元格和侧边栏。',
        'Heading 的 as 属性可覆盖渲染的 HTML 元素而不改变视觉样式。',
      ],
      props: [
        { prop: 'Heading.level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: '标题级别，决定字号大小。' },
        { prop: 'Heading.as', type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"', description: '覆盖渲染的 HTML 元素。' },
        { prop: 'Heading.variant', type: '"default" | "secondary"', default: '"default"', description: '视觉变体。' },
        { prop: 'Heading.weight', type: '"normal" | "medium" | "semibold" | "bold"', default: '"bold"', description: '字重。' },
        { prop: 'Heading.truncate', type: 'boolean', default: 'false', description: '超出时以省略号截断。' },
        { prop: 'Text.as', type: '"p" | "span" | "div"', default: '"p"', description: '渲染的 HTML 元素。' },
        { prop: 'Text.variant', type: '"default" | "secondary" | "muted" | "danger" | "success"', default: '"default"', description: '颜色变体。' },
        { prop: 'Text.size', type: '"sm" | "base" | "lg" | "xl"', default: '"base"', description: '字号。' },
        { prop: 'Text.weight', type: '"normal" | "medium" | "semibold" | "bold"', default: '"normal"', description: '字重。' },
        { prop: 'Text.truncate', type: 'boolean', default: 'false', description: '超出时以省略号截断。' },
      ],
    },
    'typography-base': {
      section: '内容展示',
      title: '排版基础',
      description: '开箱即用的排版 CSS 工具类和 React 组件，参考 Bootstrap 命名风格，适用于文章、文档、API 参考等页面。',
      guidance: [
        '排版样式通过 import "vxui-react" 自动加载，无需额外配置。',
        '可直接使用 className（如 vx-article、vx-section），也可使用 React 组件（如 Article、Section）。',
        '所有颜色使用 CSS 变量，自动适配亮/暗主题。',
        '内置响应式断点，移动端和桌面端体验统一。',
      ],
      props: [
        { prop: 'Article', type: 'Component', description: '文章容器，提供标准文档排版布局。' },
        { prop: 'ArticleHeader', type: 'Component', description: '文章头部，包含标题和描述。' },
        { prop: 'ArticleTitle', type: 'Component', description: '文章标题（h1）。' },
        { prop: 'ArticleBody', type: 'Component', description: '文章正文容器。' },
        { prop: 'Section', type: 'Component', description: '文档章节，支持锚点跳转。' },
        { prop: 'SectionHeading', type: 'Component', description: '章节标题（h2），可选锚点链接。' },
        { prop: 'Pager', type: 'Component', description: '上下页导航。' },
        { prop: 'PropsTable', type: 'Component', description: 'API 属性表格。' },
        { prop: 'ArticleEmptyState', type: 'Component', description: '空状态展示。' },
        { prop: 'StatsGrid', type: 'Component', description: '统计指标网格。' },
      ],
    },
    'date-pickers': {
      section: '表单',
      title: '日期选择器',
      description: 'DatePicker 提供带弹出日历的文本输入框用于日期选择。Calendar 是独立的月历网格组件，由 DatePicker 内部使用。',
      guidance: [
        '表单字段中使用 DatePicker；内嵌日历网格到自定义组件中使用 Calendar。',
        '设置 min/max 限制可选日期范围。',
        'weekStartsOnMonday 属性更改每周第一天——默认为周日。',
        'DatePicker 在移动端视口自动切换为基于 Sheet 的布局。',
      ],
      props: [
        { prop: 'DatePicker.value', type: 'Date', description: '受控选中日期。' },
        { prop: 'DatePicker.defaultValue', type: 'Date', description: '非受控初始日期。' },
        { prop: 'DatePicker.onChange', type: '(date: Date | undefined) => void', description: '日期变化时调用。' },
        { prop: 'DatePicker.label', type: 'string', description: '输入框标签。' },
        { prop: 'DatePicker.hint', type: 'string', description: '输入框下方的帮助文字。' },
        { prop: 'DatePicker.error', type: 'string', description: '错误信息。' },
        { prop: 'DatePicker.min', type: 'Date', description: '最小可选日期。' },
        { prop: 'DatePicker.max', type: 'Date', description: '最大可选日期。' },
        { prop: 'DatePicker.disabled', type: 'boolean', description: '禁用日期选择器。' },
        { prop: 'DatePicker.weekStartsOnMonday', type: 'boolean', default: 'false', description: '每周从周一开始而非周日。' },
        { prop: 'Calendar.value', type: 'Date', description: '受控选中日期。' },
        { prop: 'Calendar.defaultValue', type: 'Date', description: '非受控初始日期。' },
        { prop: 'Calendar.onChange', type: '(date: Date) => void', description: '点击日期时调用。' },
        { prop: 'Calendar.min', type: 'Date', description: '最小可选日期。' },
        { prop: 'Calendar.max', type: 'Date', description: '最大可选日期。' },
        { prop: 'Calendar.weekStartsOnMonday', type: 'boolean', default: 'false', description: '每周从周一开始。' },
      ],
    },
    card: {
      section: '内容展示',
      title: '卡片',
      description:
        '灵活的内容容器，支持多种视觉变体。使用 Card 作为外层容器，内部组合 CardHeader、CardTitle、CardDescription 和 CardContent。',
      guidance: [
        '对于可交互的卡片，使用 elevated 变体增强视觉层次。',
        '设置 hoverable 可以在悬停时添加浮起效果，适用于图库或仪表盘磁贴。',
        'padding 属性可调整内边距，适应密集或宽松的布局需求。',
        'Card 本身是 <section> 元素，为无障碍考虑，始终应包含 CardTitle。',
      ],
      props: [
        { prop: 'variant', type: '"default" | "flat" | "elevated" | "outlined" | "ghost" | "filled"', default: '"default"', description: '视觉样式预设。' },
        { prop: 'padding', type: '"none" | "sm" | "md" | "lg"', description: '内边距大小，默认为卡片的内部间距。' },
        { prop: 'hoverable', type: 'boolean', default: 'false', description: '悬停时添加浮起效果，适用于可点击的卡片。' },
      ],
    },
    form: {
      section: '表单',
      title: '表单组合',
      description:
        '由 Form、FormField、FormLabel、FormDescription、FormMessage 和 useFormField 构成的表单组合系统。可与任意输入组件配合，提供一致的标签、提示和错误布局。',
      guidance: [
        '将每个逻辑字段组包裹在 FormField 中，通过 context 共享错误状态。',
        '使用 FormLabel 的 required 属性可自动显示必填标记。',
        'FormMessage 自动读取 FormField context 中的错误信息，无需手动传参。',
        'Form 默认启用 noValidate，你需要自行处理验证逻辑或使用验证库。',
      ],
      props: [
        { prop: 'Form', type: '—', description: '表单根组件，携带 noValidate 和 vx-form 类名。' },
        { prop: 'FormField', type: '—', description: '包裹字段组，向 FormMessage 提供错误上下文。' },
        { prop: 'FormField.error', type: 'string', description: '当前字段的错误信息，会被 FormMessage 显示。' },
        { prop: 'FormLabel', type: '—', description: '渲染 <label>，支持可选的必填星号。' },
        { prop: 'FormLabel.required', type: 'boolean', description: '在标签文本后显示红色星号。' },
        { prop: 'FormDescription', type: '—', description: '标签下方渲染的帮助提示文字。' },
        { prop: 'FormMessage', type: '—', description: '错误或帮助提示消息，自动从 FormField context 读取错误。' },
        { prop: 'useFormField', type: '() => { error?: string }', description: 'Hook，用于读取当前字段的错误上下文。' },
      ],
    },
    sheet: {
      section: '浮层',
      title: '侧滑面板',
      description:
        '从左侧、右侧、顶部或底部边缘滑出的面板。支持标题、描述、可选的确认操作，以及受控或非受控的打开状态。',
      guidance: [
        '在需要展示次级内容但无需整页导航时使用 Sheet。',
        '将 side 设为 "right" 用于详情面板，"bottom" 用于类似移动端的操作面板。',
        'variant="action" 预设隐藏关闭按钮并显示确认底部栏，适用于删除等破坏性操作。',
        '通过 open/onOpenChange 控制打开状态，或使用 defaultOpen 实现非受控使用。',
      ],
      props: [
        { prop: 'trigger', type: 'ReactNode', description: '点击后打开面板的触发器元素。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '面板主体内容。' },
        { prop: 'side', type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: '面板滑入的起始边缘。' },
        { prop: 'variant', type: '"default" | "action"', default: '"default"', description: '"action" 隐藏关闭按钮并显示确认底部栏。' },
        { prop: 'title', type: 'ReactNode', description: '面板标题。' },
        { prop: 'description', type: 'ReactNode', description: '面板描述。' },
        { prop: 'header', type: 'ReactNode', description: '自定义顶部内容（替换 title/description）。' },
        { prop: 'footer', type: 'ReactNode', description: '自定义底部内容。' },
        { prop: 'open', type: 'boolean', description: '受控打开状态。' },
        { prop: 'defaultOpen', type: 'boolean', description: '非受控初始打开状态。' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: '打开状态变化时的回调。' },
        { prop: 'showClose', type: 'boolean', default: 'true', description: '是否显示关闭按钮。' },
        { prop: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: '点击遮罩层时是否关闭面板。' },
        { prop: 'showConfirm', type: 'boolean', default: 'false', description: '是否在底部显示确认按钮。' },
        { prop: 'confirmText', type: 'string', default: '"确认"', description: '确认按钮的文字。' },
        { prop: 'confirmDisabled', type: 'boolean', default: 'false', description: '是否禁用确认按钮。' },
        { prop: 'onConfirm', type: '() => void', description: '确认按钮回调。' },
        { prop: 'width', type: 'number', description: '自定义面板宽度（像素）。' },
      ],
    },
    'vxui-provider': {
      section: '开始使用',
      title: 'VXUI Provider',
      description:
        '组合 Provider，将 ThemeProvider、ViewportProvider 和 ToastProvider 合并为一个组件。在应用根节点使用以减少嵌套层级。',
      guidance: [
        'VXUIProvider 替代了手动嵌套 ThemeProvider + ViewportProvider + ToastProvider。',
        'themes、defaultTheme 和 storageKey 的用法与 ThemeProvider 完全相同。',
        '此组件完全可选——如果需要更精细的控制，可以分别使用独立的 Provider。',
      ],
      props: [
        { prop: 'themes', type: 'ThemeRegistry', description: '传递给 ThemeProvider 的主题配置。' },
        { prop: 'defaultTheme', type: 'string', description: '默认主题名称。' },
        { prop: 'storageKey', type: 'string', default: '"vxui-theme"', description: '用于持久化主题选择的 localStorage 键名。' },
        { prop: 'children', type: 'ReactNode', required: true, description: '应用内容。' },
      ],
    },
    viewport: {
      section: '开始使用',
      title: '视口',
      description:
        'ViewportProvider 监听屏幕尺寸，通过 useViewport hook 暴露设备类型、方向和断点信息。',
      guidance: [
        'ViewportProvider 使用物理屏幕尺寸 (window.screen.width) 进行设备类型分类。',
        '屏幕宽度 ≤ 1000px 时被归类为平板或手机（通过宽高比区分）。',
        'useViewport() 返回 isPhone、isTablet、isDesktop、isTabletPortrait 和原始 screenWidth/screenHeight。',
        '与 CSS 断点不同，设备检测使用物理屏幕尺寸，因此分屏平板仍被识别为"平板"。',
      ],
      props: [
        { prop: 'children', type: 'ReactNode', required: true, description: '应用内容。' },
        { prop: 'useViewport()', type: 'ViewportContextValue', description: '返回视口状态的 Hook。' },
        { prop: 'useViewport().viewport', type: '"phone" | "tablet" | "desktop"', description: '当前设备类型分类。' },
        { prop: 'useViewport().isPhone', type: 'boolean', description: '当前设备是否为手机（窄屏）。' },
        { prop: 'useViewport().isTablet', type: 'boolean', description: '当前设备是否为平板。' },
        { prop: 'useViewport().isDesktop', type: 'boolean', description: '当前设备是否为桌面端（宽度 > 1000px）。' },
        { prop: 'useViewport().isTabletPortrait', type: 'boolean', description: '平板且为竖屏时返回 true。' },
        { prop: 'useViewport().screenWidth', type: 'number', description: '物理屏幕宽度（CSS 像素）。' },
        { prop: 'useViewport().screenHeight', type: 'number', description: '物理屏幕高度（CSS 像素）。' },
      ],
    },
    constants: {
      section: '开始使用',
      title: '常量',
      description:
        '响应式系统使用的布局断点和设备检测阈值。这些常量可用于自定义响应式逻辑。',
      guidance: [
        'BREAKPOINTS.sm (640) 是手机到平板的 CSS 视口断点。',
        'BREAKPOINTS.md (768) 是平板到桌面的 CSS 视口断点。',
        'BREAKPOINTS.lg (1000) 同时作为 PHONE_MAX_WIDTH 用于设备类型检测。',
        'PHONE_ASPECT_RATIO_THRESHOLD (0.7) 和 TABLET_ASPECT_RATIO_THRESHOLD (0.75) 通过宽高比区分手机和平板。',
        'CSS 布局断点和设备检测阈值目的不同，值也不同。',
      ],
      props: [
        { prop: 'BREAKPOINTS.sm', type: '640', description: '手机到平板的 CSS 布局断点 (max-width: 640px)。' },
        { prop: 'BREAKPOINTS.md', type: '768', description: '平板的 CSS 布局断点 (max-width: 768px)。' },
        { prop: 'BREAKPOINTS.lg', type: '1000', description: '桌面端的 CSS 布局断点 (min-width: 1000px)。' },
        { prop: 'PHONE_MAX_WIDTH', type: '1000', description: '设备检测的物理屏幕宽度阈值。' },
        { prop: 'PHONE_ASPECT_RATIO_THRESHOLD', type: '0.7', description: '宽高比阈值——低于此值则归类为手机。' },
        { prop: 'TABLET_ASPECT_RATIO_THRESHOLD', type: '0.75', description: '平板分类的宽高比上限阈值。' },
      ],
    },
    calendar: {
      section: '表单',
      title: '日历',
      description:
        '基于月份的日历视图，用于选择日期。支持受控/非受控模式、日期范围限制和可配置的每周起始日。',
      guidance: [
        'Calendar 可独立使用，也可嵌入 DatePicker 提供日期选择体验。',
        '使用 value 进行受控模式，或 defaultValue 进行非受控模式。',
        '通过 min 和 max 限制可选日期范围。',
        '如果需要周一作为每周第一天，设置 weekStartsOnMonday。',
      ],
      props: [
        { prop: 'value', type: 'Date', description: '受控模式下当前选中的日期。' },
        { prop: 'defaultValue', type: 'Date', description: '非受控模式的初始日期。' },
        { prop: 'onChange', type: '(date: Date) => void', description: '选择日期时的回调。' },
        { prop: 'min', type: 'Date', description: '最小可选日期。' },
        { prop: 'max', type: 'Date', description: '最大可选日期。' },
        { prop: 'weekStartsOnMonday', type: 'boolean', default: 'false', description: '设置周一为一周的第一天。' },
        { prop: 'className', type: 'string', description: '自定义 CSS 类名。' },
      ],
    },
    'bottom-nav': {
      section: '响应式',
      title: '底部导航',
      description:
        '移动端风格的底部导航栏，支持激活状态、角标和子菜单弹出。适用于侧边栏不实用的手机尺寸视口。',
      guidance: [
        '在 MobileShell 中使用 BottomNav 获得原生移动端导航体验。',
        '每个导航项需要 icon 和 label——图标显示在标签上方。',
        '在导航项上设置 submenu 属性可显示弹出子菜单而非直接导航。',
        '角标支持数值和字符串溢出（如 "99+"）。',
        '激活的导航项会设置 aria-current="page" 以满足无障碍需求。',
      ],
      props: [
        { prop: 'items', type: 'BottomNavItem[]', required: true, description: '导航项数组。' },
        { prop: 'items[].key', type: 'string', required: true, description: '唯一标识。' },
        { prop: 'items[].label', type: 'string', required: true, description: '图标下方的显示标签。' },
        { prop: 'items[].icon', type: 'ReactNode', required: true, description: '显示在标签上方的图标。' },
        { prop: 'items[].badge', type: 'string | number', description: '图标角落显示的角标值。' },
        { prop: 'items[].active', type: 'boolean', description: '标记此项为当前激活页面。' },
        { prop: 'items[].onSelect', type: '() => void', description: '点击处理函数（有 submenu 时忽略）。' },
        { prop: 'items[].submenu', type: 'BottomNavSubMenuItem[]', description: '点击时以弹出菜单显示的子菜单项。' },
        { prop: 'className', type: 'string', description: '自定义 CSS 类名。' },
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

/** Resolve the best supported locale from the browser's language list. */
function detectLocale(): string {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('vxui-locale') : null;
  if (stored && locales[stored]) return stored;

  // Walk navigator.languages in preference order and pick the first match.
  const langs =
    typeof navigator !== 'undefined'
      ? (navigator.languages?.length ? navigator.languages : [navigator.language])
      : [];

  for (const lang of langs) {
    // Exact match first (e.g. "zh" or "en")
    const exact = lang.toLowerCase().split('-')[0];
    if (locales[lang]) return lang;
    if (locales[exact]) return exact;
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(() => detectLocale());
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
