import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileDrawer, DrawerNavItem, DrawerNavSection } from '../mobile/MobileDrawer';

describe('MobileDrawer', () => {
  it('does not render when open=false', () => {
    render(
      <MobileDrawer open={false} onClose={vi.fn()}>
        <span>Content</span>
      </MobileDrawer>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders dialog when open=true', () => {
    render(
      <MobileDrawer open={true} onClose={vi.fn()}>
        <span>Content</span>
      </MobileDrawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders header content when provided', () => {
    render(
      <MobileDrawer open={true} onClose={vi.fn()} header={<span>My App</span>}>
        <span />
      </MobileDrawer>,
    );
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('renders footer content when provided', () => {
    render(
      <MobileDrawer open={true} onClose={vi.fn()} footer={<span>Footer</span>}>
        <span />
      </MobileDrawer>,
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(
      <MobileDrawer open={true} onClose={onClose}>
        <span />
      </MobileDrawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('DrawerNavItem', () => {
  it('renders label text', () => {
    render(<DrawerNavItem label="Home" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<DrawerNavItem label="Home" icon={<span data-testid="ico" />} />);
    expect(screen.getByTestId('ico')).toBeInTheDocument();
  });

  it('marks active with aria-current', () => {
    render(<DrawerNavItem label="Home" active />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<DrawerNavItem label="Settings" onClick={onClick} />);
    await userEvent.click(screen.getByText('Settings'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders badge when provided', () => {
    render(<DrawerNavItem label="Notifs" badge={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

describe('DrawerNavSection', () => {
  it('renders children', () => {
    render(
      <DrawerNavSection>
        <span>Item A</span>
      </DrawerNavSection>,
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('renders title text', () => {
    render(
      <DrawerNavSection title="Navigation">
        <span />
      </DrawerNavSection>,
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('collapsible section can be toggled', async () => {
    render(
      <DrawerNavSection title="Tools" collapsible>
        <span>Tool Item</span>
      </DrawerNavSection>,
    );
    const btn = screen.getByRole('button', { name: /Tools/i });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});
