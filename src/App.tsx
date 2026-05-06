import { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Boxes,
  Check,
  ChevronRight,
  Compass,
  FileCode2,
  FileX2,
  House,
  LayoutDashboard,
  List,
  MoonStar,
  Package2,
  Palette,
  PanelsTopLeft,
  Sparkles,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import {
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from './lib';

type PageKey =
  | 'introduction'
  | 'quick-start'
  | 'shell-sidebar'
  | 'grid-page'
  | 'elements'
  | 'form-controls'
  | 'navigation'
  | 'data-list'
  | 'empty-states'
  | 'toasts';

interface PageDefinition {
  section: string;
  title: string;
  description: string;
  guidance: string[];
}

const pages: Record<PageKey, PageDefinition> = {
  introduction: {
    section: 'Getting Started',
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
    section: 'Getting Started',
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
    section: 'Layout',
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
    section: 'Layout',
    title: 'Grid & Page',
    description:
      'Use simple responsive grids for cards, tokens, and documentation blocks. The page surface should stay neutral and let content carry emphasis.',
    guidance: [
      'Prefer 12 to 16 pixel gaps for dense documentation surfaces.',
      'Reserve larger spacing for section boundaries, not every card.',
      'Keep max width constrained so long paragraphs remain readable.',
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
    section: 'Feedback',
    title: 'Toasts',
    description:
      'Toasts confirm short-lived events without interrupting task flow. Keep them brief, specific, and easy to dismiss.',
    guidance: [
      'Use success and info to confirm background actions.',
      'Escalate blocking or destructive states to dialogs instead of stacking toasts.',
      'Avoid repeating the same message on every page transition.',
    ],
  },
};

const glanceCards = [
  {
    label: 'Zero dependencies',
    value: '0',
    hint: 'Original shell runtime does not require a build pipeline.',
    icon: <Check size={18} />,
  },
  {
    label: 'Components',
    value: '30+',
    hint: 'Layout, form, feedback, and list primitives in one system.',
    icon: <Boxes size={18} />,
  },
  {
    label: 'Core CSS',
    value: '~24 KB',
    hint: 'Neutral tokens and structural styles stay compact.',
    icon: <FileCode2 size={18} />,
  },
  {
    label: 'Dark mode',
    value: 'Built-in',
    hint: 'Semantic variables keep the same components reusable.',
    icon: <MoonStar size={18} />,
  },
];

const tokenCards = [
  {
    name: 'Primary',
    variable: '--vx-primary',
    value: '#2563eb',
    description: 'Accent color for primary actions, active navigation, and emphasis.',
  },
  {
    name: 'Surface',
    variable: '--vx-surface',
    value: '#ffffff',
    description: 'Default panel and content background for documentation cards and shell regions.',
  },
  {
    name: 'Border',
    variable: '--vx-border',
    value: '#e2e8f0',
    description: 'Light separators that keep the UI structured without adding visual weight.',
  },
  {
    name: 'Text',
    variable: '--vx-text',
    value: '#0f172a',
    description: 'Primary foreground used for headings, dense data, and body copy.',
  },
];

const componentFamilies = [
  {
    title: 'Layout',
    description: 'App shell, sticky header, section rhythm, and responsive content framing.',
    page: 'shell-sidebar' as PageKey,
  },
  {
    title: 'Elements',
    description: 'Quiet primitives for actions, metadata, and structured content blocks.',
    page: 'elements' as PageKey,
  },
  {
    title: 'Forms',
    description: 'Inputs, switches, dialogs, and field composition patterns.',
    page: 'form-controls' as PageKey,
  },
  {
    title: 'Feedback',
    description: 'Transient toasts and interruptive confirmation flows.',
    page: 'toasts' as PageKey,
  },
];

const dataListRows = [
  { name: 'introduction.mdx', kind: 'Guide', updated: '2026-05-02' },
  { name: 'shell-sidebar.tsx', kind: 'Layout', updated: '2026-05-01' },
  { name: 'tokens.json', kind: 'Config', updated: '2026-04-28' },
];

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth < 960;
  });
  const [activePage, setActivePage] = useState<PageKey>('introduction');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [compactDensity, setCompactDensity] = useState(false);
  const { push } = useToast();

  const activeDocument = pages[activePage];

  const selectPage = (page: PageKey) => {
    setActivePage(page);

    if (typeof window !== 'undefined' && window.innerWidth < 960) {
      setSidebarCollapsed(true);
    }
  };

  const navSections = [
    {
      title: 'Getting Started',
      items: [
        {
          key: 'introduction',
          label: 'Introduction',
          icon: <House size={16} />,
          active: activePage === 'introduction',
          onSelect: () => selectPage('introduction'),
        },
        {
          key: 'quick-start',
          label: 'Quick Start',
          icon: <Zap size={16} />,
          active: activePage === 'quick-start',
          onSelect: () => selectPage('quick-start'),
        },
      ],
    },
    {
      title: 'Layout',
      items: [
        {
          key: 'shell-sidebar',
          label: 'Shell & Sidebar',
          icon: <PanelsTopLeft size={16} />,
          active: activePage === 'shell-sidebar',
          onSelect: () => selectPage('shell-sidebar'),
        },
        {
          key: 'grid-page',
          label: 'Grid & Page',
          icon: <LayoutDashboard size={16} />,
          active: activePage === 'grid-page',
          onSelect: () => selectPage('grid-page'),
        },
      ],
    },
    {
      title: 'Components',
      items: [
        {
          key: 'elements',
          label: 'Elements',
          icon: <Package2 size={16} />,
          trailing: <ChevronRight size={14} />,
          active: activePage === 'elements',
          onSelect: () => selectPage('elements'),
        },
        {
          key: 'form-controls',
          label: 'Form Controls',
          icon: <SlidersHorizontal size={16} />,
          trailing: <ChevronRight size={14} />,
          active: activePage === 'form-controls',
          onSelect: () => selectPage('form-controls'),
        },
        {
          key: 'navigation',
          label: 'Navigation',
          icon: <Compass size={16} />,
          trailing: <ChevronRight size={14} />,
          active: activePage === 'navigation',
          onSelect: () => selectPage('navigation'),
        },
        {
          key: 'data-list',
          label: 'Data List',
          icon: <List size={16} />,
          active: activePage === 'data-list',
          onSelect: () => selectPage('data-list'),
        },
        {
          key: 'empty-states',
          label: 'Empty States',
          icon: <FileX2 size={16} />,
          active: activePage === 'empty-states',
          onSelect: () => selectPage('empty-states'),
        },
      ],
    },
    {
      title: 'Feedback',
      items: [
        {
          key: 'toasts',
          label: 'Toasts',
          icon: <Bell size={16} />,
          active: activePage === 'toasts',
          onSelect: () => selectPage('toasts'),
        },
      ],
    },
  ];

  const renderPageSample = () => {
    switch (activePage) {
      case 'quick-start': {
        const quickStartCode = [
          "import { AppShell, ThemeProvider, ToastProvider } from 'vxui-react';",
          '',
          'export function App() {',
          '  return (',
          '    <ThemeProvider>',
          '      <ToastProvider>',
          '        <AppShell navSections={sections}>...</AppShell>',
          '      </ToastProvider>',
          '    </ThemeProvider>',
          '  );',
          '}',
        ].join('\n');

        return <pre className="vx-docs-code">{quickStartCode}</pre>;
      }
      case 'shell-sidebar':
        return (
          <div className="vx-preview-shell">
            <div className="vx-preview-shell__sidebar">
              <div className="vx-preview-shell__line vx-preview-shell__line--strong" />
              <div className="vx-preview-shell__line" />
              <div className="vx-preview-shell__line" />
              <div className="vx-preview-shell__line" />
            </div>
            <div className="vx-preview-shell__content">
              <div className="vx-preview-shell__line vx-preview-shell__line--header" />
              <div className="vx-preview-grid">
                <div className="vx-preview-grid__item" />
                <div className="vx-preview-grid__item" />
                <div className="vx-preview-grid__item" />
              </div>
            </div>
          </div>
        );
      case 'grid-page':
        return (
          <div className="vx-preview-grid vx-preview-grid--page">
            <div className="vx-preview-grid__item vx-preview-grid__item--wide" />
            <div className="vx-preview-grid__item" />
            <div className="vx-preview-grid__item" />
            <div className="vx-preview-grid__item" />
          </div>
        );
      case 'elements':
        return (
          <div className="vx-stack vx-stack--tight">
            <div className="vx-inline vx-inline--wrap">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="vx-inline vx-inline--wrap">
              <Badge>Neutral</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>
        );
      case 'form-controls':
        return (
          <div className="vx-stack">
            <Input
              label="Workspace name"
              hint="Use a short label that matches the visible page title."
              placeholder="vxui-docs"
            />
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
              label="Realtime alerts"
              description="Send a compact toast when documentation content ships."
            />
            <Dialog
              trigger={<Button variant="secondary">Open dialog sample</Button>}
              title="Publish documentation"
              description="Confirm before pushing a new release tag to the showcase site."
              footer={<Button>Confirm publish</Button>}
            >
              <div className="vx-stack">
                <Input label="Version" placeholder="v1.0" />
                <Input label="Release note" placeholder="Document shell and design tokens" />
              </div>
            </Dialog>
          </div>
        );
      case 'navigation':
        return (
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="vx-muted">Tabs separate sibling views without leaving the current page context.</p>
            </TabsContent>
            <TabsContent value="api">
              <p className="vx-muted">Expose structural props first, then visual overrides as needed.</p>
            </TabsContent>
            <TabsContent value="examples">
              <p className="vx-muted">Use tabs when the user compares nearby representations of the same entity.</p>
            </TabsContent>
          </Tabs>
        );
      case 'data-list':
        return (
          <div className="vx-preview-list">
            <div className="vx-preview-list__row vx-preview-list__row--header">
              <span>Name</span>
              <span>Kind</span>
              <span>Updated</span>
            </div>
            {dataListRows.map((row) => (
              <div key={row.name} className="vx-preview-list__row">
                <span>{row.name}</span>
                <span>{row.kind}</span>
                <span>{row.updated}</span>
              </div>
            ))}
          </div>
        );
      case 'empty-states':
        return (
          <div className="vx-empty-state">
            <div className="vx-empty-state__icon">
              <FileX2 size={20} />
            </div>
            <div className="vx-empty-state__title">No components found</div>
            <div className="vx-empty-state__copy">
              Create the first example or switch to another category to keep building the documentation surface.
            </div>
            <Button>Create example</Button>
          </div>
        );
      case 'toasts':
        return (
          <div className="vx-inline vx-inline--wrap">
            <Button
              onClick={() =>
                push({
                  tone: 'info',
                  title: 'Docs synced',
                  description: 'The showcase index is now aligned with the latest component exports.',
                })
              }
            >
              Info toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                push({
                  tone: 'success',
                  title: 'Build complete',
                  description: 'The style token bundle compiled successfully.',
                })
              }
            >
              Success toast
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderIntroduction = () => (
    <>
      <section className="vx-docs-hero">
        <h1>vxUI</h1>
        <p>
          A lightweight, dependency-free UI framework for building clean admin interfaces.
          Design tokens, components, and a minimal SPA runtime live behind one consistent
          visual language.
        </p>
        <div className="vx-docs-actions">
          <Button onClick={() => selectPage('quick-start')}>
            <Zap size={16} />
            Get Started
          </Button>
          <Button variant="secondary" onClick={() => selectPage('elements')}>
            Browse Components
          </Button>
        </div>
      </section>

      <section className="vx-docs-section">
        <h2>At a Glance</h2>
        <div className="vx-docs-stats">
          {glanceCards.map((card) => (
            <Card key={card.label} className="vx-doc-stat">
              <div className="vx-doc-stat__copy">
                <div className="vx-doc-stat__label">{card.label}</div>
                <div className="vx-doc-stat__value">{card.value}</div>
                <div className="vx-doc-stat__hint">{card.hint}</div>
              </div>
              <div className="vx-doc-stat__icon">{card.icon}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="vx-docs-section">
        <h2>Design Tokens</h2>
        <p className="vx-docs-lead">
          All colors, spacing, and typography values are exposed as CSS custom properties under
          the vx namespace. Override any token to theme the entire framework.
        </p>
        <div className="vx-docs-token-grid">
          {tokenCards.map((token) => (
            <Card key={token.variable} className="vx-doc-token-card">
              <div
                className="vx-doc-token-card__swatch"
                style={{ background: token.value }}
                aria-hidden="true"
              />
              <div className="vx-doc-token-card__row">
                <div>
                  <div className="vx-doc-token-card__name">{token.name}</div>
                  <div className="vx-doc-token-card__var">{token.variable}</div>
                </div>
                <span className="vx-version-pill vx-version-pill--token">{token.value}</span>
              </div>
              <div className="vx-doc-token-card__description">{token.description}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="vx-docs-section">
        <h2>Component Families</h2>
        <div className="vx-docs-component-grid">
          {componentFamilies.map((family) => (
            <Card key={family.title} className="vx-doc-family-card">
              <CardHeader>
                <CardTitle>{family.title}</CardTitle>
                <CardDescription>{family.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" onClick={() => selectPage(family.page)}>
                  Open section
                  <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );

  const renderGuidePage = () => (
    <article className="vx-docs-article">
      <div className="vx-docs-kicker">{activeDocument.section}</div>
      <h1>{activeDocument.title}</h1>
      <p className="vx-docs-lead">{activeDocument.description}</p>
      <div className="vx-docs-article-grid">
        <Card>
          <CardHeader>
            <CardTitle>Guidance</CardTitle>
            <CardDescription>
              Keep the implementation tight and let the design system do most of the visual work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="vx-docs-guidance">
              {activeDocument.guidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              A compact example of how this area should feel inside the system.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderPageSample()}</CardContent>
        </Card>
      </div>
      <section className="vx-docs-section">
        <h2>Notes</h2>
        <div className="vx-docs-token-grid">
          <Card>
            <CardHeader>
              <CardTitle>Primary Theme</CardTitle>
              <CardDescription>
                Blue-gray neutrals keep emphasis reserved for actions, not decoration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-inline vx-inline--wrap">
                <Badge variant="accent">Core</Badge>
                <Badge variant="success">Accessible</Badge>
                <Badge variant="warning">Documented</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Token Scale</CardTitle>
              <CardDescription>
                Reuse the shared surface, border, and text variables before introducing page-specific styles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="vx-inline vx-inline--wrap">
                <span className="vx-version-pill vx-version-pill--token">--vx-bg</span>
                <span className="vx-version-pill vx-version-pill--token">--vx-surface</span>
                <span className="vx-version-pill vx-version-pill--token">--vx-border</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </article>
  );

  return (
    <AppShell
      brand="vxUI"
      breadcrumb={(
        <div className="vx-topbar__breadcrumb">
          <span>VXUI</span>
          <span className="vx-topbar__separator">/</span>
          <strong>{activeDocument.title}</strong>
        </div>
      )}
      navSections={navSections}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed((value) => !value)}
      headerActions={<span className="vx-version-pill">v1.0</span>}
    >
      <div className="vx-page">
        {activePage === 'introduction' ? renderIntroduction() : renderGuidePage()}

        <section className="vx-docs-section">
          <h2>System Preview</h2>
          <div className="vx-docs-component-grid">
            <Card>
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
                <CardDescription>
                  Neutral surfaces, blue accents, and compact borders keep the frame close to the original vxui showcase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-inline vx-inline--wrap">
                  <span className="vx-version-pill vx-version-pill--token">
                    <Palette size={14} />
                    blue-gray
                  </span>
                  <span className="vx-version-pill vx-version-pill--token">
                    <Sparkles size={14} />
                    lightweight
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Live Controls</CardTitle>
                <CardDescription>
                  A few reusable primitives are still available inside the docs surface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="vx-stack vx-stack--tight">
                  <Input label="Search docs" placeholder="Buttons, tokens, layout..." />
                  <Switch
                    checked={compactDensity}
                    onCheckedChange={setCompactDensity}
                    label="Compact density"
                    description="Tighten the vertical rhythm for denser operator views."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
