import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Shell,
  ShellSidebar,
  ShellNav,
  ShellNavSection,
  ShellNavItem,
  ShellOverlay,
  ShellMain,
  ShellTopbar,
  ShellContent,
} from '../Shell';

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------
describe('Shell', () => {
  it('renders children', () => {
    render(<Shell><div>content</div></Shell>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies vx-shell class', () => {
    const { container } = render(<Shell><span /></Shell>);
    expect(container.firstChild).toHaveClass('vx-shell');
  });

  it('sets data-collapsed attribute', () => {
    const { container } = render(<Shell collapsed><span /></Shell>);
    expect(container.firstChild).toHaveAttribute('data-collapsed', 'true');
  });

  it('sets data-nav-open attribute', () => {
    const { container } = render(<Shell mobileNavOpen><span /></Shell>);
    expect(container.firstChild).toHaveAttribute('data-nav-open', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(<Shell className="my-shell"><span /></Shell>);
    expect(container.firstChild).toHaveClass('my-shell');
  });
});

// ---------------------------------------------------------------------------
// ShellSidebar
// ---------------------------------------------------------------------------
describe('ShellSidebar', () => {
  it('renders brand text', () => {
    render(<ShellSidebar brand="MyApp" />);
    expect(screen.getByText('MyApp')).toBeInTheDocument();
  });

  it('renders brandCaption when provided', () => {
    render(<ShellSidebar brand="MyApp" brandCaption="v2" />);
    expect(screen.getByText('v2')).toBeInTheDocument();
  });

  it('does not render brandCaption when omitted', () => {
    render(<ShellSidebar brand="MyApp" />);
    expect(screen.queryByText('v2')).not.toBeInTheDocument();
  });

  it('renders brandIcon when provided', () => {
    render(<ShellSidebar brandIcon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders footer content when provided', () => {
    render(<ShellSidebar footer={<span>Footer</span>} />);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('does not render toggle button when onToggle is omitted', () => {
    render(<ShellSidebar brand="App" />);
    expect(screen.queryByRole('button', { name: /collapse|expand/i })).not.toBeInTheDocument();
  });

  it('renders Collapse button when onToggle is provided and collapsed=false', () => {
    render(<ShellSidebar onToggle={() => {}} collapsed={false} />);
    expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();
  });

  it('renders Expand button when onToggle is provided and collapsed=true', () => {
    render(<ShellSidebar onToggle={() => {}} collapsed />);
    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', async () => {
    const onToggle = vi.fn();
    render(<ShellSidebar onToggle={onToggle} collapsed={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders children inside the sidebar', () => {
    render(<ShellSidebar><div>Nav content</div></ShellSidebar>);
    expect(screen.getByText('Nav content')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ShellNav
// ---------------------------------------------------------------------------
describe('ShellNav', () => {
  it('renders a nav element with default aria-label', () => {
    render(<ShellNav />);
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
  });

  it('accepts custom aria label', () => {
    render(<ShellNav label="Secondary navigation" />);
    expect(screen.getByRole('navigation', { name: 'Secondary navigation' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<ShellNav><li>Item</li></ShellNav>);
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ShellNavSection
// ---------------------------------------------------------------------------
describe('ShellNavSection', () => {
  it('renders children', () => {
    render(<ShellNavSection><div>item</div></ShellNavSection>);
    expect(screen.getByText('item')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<ShellNavSection title="Settings" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('does not render title element when title is omitted', () => {
    const { container } = render(<ShellNavSection />);
    expect(container.querySelector('.vx-nav-section-block__title')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ShellNavItem
// ---------------------------------------------------------------------------
describe('ShellNavItem', () => {
  it('renders label', () => {
    render(<ShellNavItem label="Dashboard" />);
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('applies active class when active=true', () => {
    render(<ShellNavItem label="Home" active />);
    expect(screen.getByRole('button', { name: 'Home' })).toHaveClass('vx-nav-item--active');
  });

  it('does not apply active class by default', () => {
    render(<ShellNavItem label="Home" />);
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveClass('vx-nav-item--active');
  });

  it('renders badge when provided', () => {
    render(<ShellNavItem label="Inbox" badge="5" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onSelect when clicked (leaf item)', async () => {
    const onSelect = vi.fn();
    render(<ShellNavItem label="Settings" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders icon when provided', () => {
    render(<ShellNavItem label="Home" icon={<svg data-testid="home-icon" />} />);
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('applies parent class when it has children', () => {
    render(
      <ShellNavItem label="Group">
        <ShellNavItem label="Child" />
      </ShellNavItem>,
    );
    expect(screen.getByRole('button', { name: 'Group' })).toHaveClass('vx-nav-item--parent');
  });

  it('toggles sub-menu open/closed on click', async () => {
    render(
      <ShellNavItem label="Group">
        <ShellNavItem label="Child" />
      </ShellNavItem>,
    );
    expect(screen.queryByRole('button', { name: 'Child' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Group' }));
    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Group' }));
    expect(screen.queryByRole('button', { name: 'Child' })).not.toBeInTheDocument();
  });

  it('opens sub-menu by default when defaultOpen=true', () => {
    render(
      <ShellNavItem label="Group" defaultOpen>
        <ShellNavItem label="Child" />
      </ShellNavItem>,
    );
    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ShellOverlay
// ---------------------------------------------------------------------------
describe('ShellOverlay', () => {
  it('renders a button with default aria-label', () => {
    render(<ShellOverlay />);
    expect(screen.getByRole('button', { name: 'Close sidebar' })).toBeInTheDocument();
  });

  it('uses custom closeLabel', () => {
    render(<ShellOverlay closeLabel="Dismiss" />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('calls onClose when clicked', async () => {
    const onClose = vi.fn();
    render(<ShellOverlay onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close sidebar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// ShellMain
// ---------------------------------------------------------------------------
describe('ShellMain', () => {
  it('renders children inside vx-shell__main', () => {
    const { container } = render(<ShellMain><p>Content</p></ShellMain>);
    expect(container.querySelector('.vx-shell__main')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ShellTopbar
// ---------------------------------------------------------------------------
describe('ShellTopbar', () => {
  it('renders title when provided', () => {
    render(<ShellTopbar title="My App" />);
    expect(screen.getByRole('heading', { name: 'My App' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ShellTopbar description="Welcome back" />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('does not render menu button when onMenuToggle is omitted', () => {
    render(<ShellTopbar title="App" />);
    expect(screen.queryByRole('button', { name: /navigation/i })).not.toBeInTheDocument();
  });

  it('renders menu button when onMenuToggle is provided', () => {
    render(<ShellTopbar onMenuToggle={() => {}} menuButtonLabel="Open navigation" />);
    expect(screen.getByRole('button', { name: 'Open navigation' })).toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button is clicked', async () => {
    const onMenuToggle = vi.fn();
    render(<ShellTopbar onMenuToggle={onMenuToggle} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('renders breadcrumb instead of title when both are provided', () => {
    render(<ShellTopbar title="App" breadcrumb={<nav aria-label="breadcrumb">Breadcrumb</nav>} />);
    expect(screen.getByText('Breadcrumb')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'App' })).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<ShellTopbar actions={<button>Save</button>} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ShellContent
// ---------------------------------------------------------------------------
describe('ShellContent', () => {
  it('renders children', () => {
    render(<ShellContent><p>Page body</p></ShellContent>);
    expect(screen.getByText('Page body')).toBeInTheDocument();
  });
});
