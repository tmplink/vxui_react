import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '../AppShell';

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'settings', label: 'Settings' },
];

const navSections = [
  {
    key: 'main',
    title: 'Main',
    items: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'reports', label: 'Reports' },
    ],
  },
  {
    key: 'admin',
    title: 'Admin',
    items: [{ key: 'users', label: 'Users' }],
  },
];

describe('AppShell', () => {
  it('renders children content', () => {
    render(<AppShell><p>Page content</p></AppShell>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders default brand name when brand is omitted', () => {
    render(<AppShell><span /></AppShell>);
    expect(screen.getByText('VXUI')).toBeInTheDocument();
  });

  it('renders custom brand name', () => {
    render(<AppShell brand="Acme"><span /></AppShell>);
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('renders brandCaption when provided', () => {
    render(<AppShell brand="Acme" brandCaption="Pro"><span /></AppShell>);
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('renders brandIcon when provided', () => {
    render(<AppShell brandIcon={<svg data-testid="brand-icon" />}><span /></AppShell>);
    expect(screen.getByTestId('brand-icon')).toBeInTheDocument();
  });

  it('renders page title in topbar', () => {
    render(<AppShell title="Dashboard"><span /></AppShell>);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders page description in topbar', () => {
    render(<AppShell description="Overview of your data"><span /></AppShell>);
    expect(screen.getByText('Overview of your data')).toBeInTheDocument();
  });

  it('renders navItems as nav buttons', () => {
    render(<AppShell navItems={navItems}><span /></AppShell>);
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders navSections with section titles', () => {
    render(<AppShell navSections={navSections}><span /></AppShell>);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders navSections items as nav buttons', () => {
    render(<AppShell navSections={navSections}><span /></AppShell>);
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Users' })).toBeInTheDocument();
  });

  it('renders headerActions in the topbar', () => {
    render(<AppShell headerActions={<button>Save</button>}><span /></AppShell>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders sidebarFooter content', () => {
    render(<AppShell sidebarFooter={<span>Footer</span>}><span /></AppShell>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders breadcrumb in the topbar when provided', () => {
    render(
      <AppShell breadcrumb={<nav aria-label="breadcrumb">Home / Docs</nav>}>
        <span />
      </AppShell>,
    );
    expect(screen.getByText('Home / Docs')).toBeInTheDocument();
  });

  it('renders collapse toggle button when onSidebarToggle is provided', () => {
    render(<AppShell onSidebarToggle={() => {}}><span /></AppShell>);
    expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument();
  });

  it('calls onSidebarToggle when toggle button is clicked', async () => {
    const onToggle = vi.fn();
    render(<AppShell onSidebarToggle={onToggle}><span /></AppShell>);
    await userEvent.click(screen.getByRole('button', { name: /collapse/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders mobile menu button when onMobileNavToggle is provided', () => {
    render(<AppShell onMobileNavToggle={() => {}}><span /></AppShell>);
    expect(screen.getByRole('button', { name: 'Open navigation' })).toBeInTheDocument();
  });

  it('calls onMobileNavToggle when mobile menu button is clicked', async () => {
    const onToggle = vi.fn();
    render(<AppShell onMobileNavToggle={onToggle}><span /></AppShell>);
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders overlay close button when mobileNavOpen=true and onMobileNavToggle is provided', () => {
    render(<AppShell mobileNavOpen onMobileNavToggle={() => {}}><span /></AppShell>);
    expect(screen.getByRole('button', { name: 'Close sidebar' })).toBeInTheDocument();
  });

  it('calls onMobileNavToggle via overlay close button', async () => {
    const onToggle = vi.fn();
    render(<AppShell mobileNavOpen onMobileNavToggle={onToggle}><span /></AppShell>);
    await userEvent.click(screen.getByRole('button', { name: 'Close sidebar' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('marks active nav item with active class', () => {
    render(
      <AppShell
        navItems={[
          { key: 'home', label: 'Home', active: true },
          { key: 'about', label: 'About' },
        ]}
      >
        <span />
      </AppShell>,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toHaveClass('vx-nav-item--active');
    expect(screen.getByRole('button', { name: 'About' })).not.toHaveClass('vx-nav-item--active');
  });

  it('calls navItem onSelect when nav item is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <AppShell navItems={[{ key: 'home', label: 'Home', onSelect }]}>
        <span />
      </AppShell>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
