import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomNav } from '../mobile/BottomNav';

const items = [
  { key: 'home', label: 'Home', icon: <span>🏠</span>, active: true, onSelect: vi.fn() },
  { key: 'search', label: 'Search', icon: <span>🔍</span>, onSelect: vi.fn() },
  {
    key: 'more',
    label: 'More',
    icon: <span>☰</span>,
    submenu: [
      { key: 'settings', label: 'Settings', onSelect: vi.fn() },
      { key: 'help', label: 'Help', onSelect: vi.fn() },
    ],
  },
];

describe('BottomNav', () => {
  it('renders a navigation element', () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all nav items', () => {
    render(<BottomNav items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('marks active item with aria-current', () => {
    render(<BottomNav items={items} />);
    const homeBtn = screen.getByText('Home').closest('button')!;
    expect(homeBtn).toHaveAttribute('aria-current', 'page');
  });

  it('calls onSelect when item clicked', async () => {
    const onSelect = vi.fn();
    render(
      <BottomNav
        items={[{ key: 'search', label: 'Search', icon: <span />, onSelect }]}
      />,
    );
    await userEvent.click(screen.getByText('Search').closest('button')!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('opens submenu when item with submenu is clicked', async () => {
    render(<BottomNav items={items} />);
    await userEvent.click(screen.getByText('More').closest('button')!);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
  });

  it('closes submenu when same item clicked again', async () => {
    render(<BottomNav items={items} />);
    await userEvent.click(screen.getByText('More').closest('button')!);
    await userEvent.click(screen.getByText('More').closest('button')!);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls sub-item onSelect when sub-menu item clicked', async () => {
    const onSelect = vi.fn();
    render(
      <BottomNav
        items={[
          {
            key: 'more',
            label: 'More',
            icon: <span />,
            submenu: [{ key: 'settings', label: 'Settings', onSelect }],
          },
        ]}
      />,
    );
    await userEvent.click(screen.getByText('More').closest('button')!);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('shows badge when provided', () => {
    render(
      <BottomNav
        items={[{ key: 'n', label: 'Notifs', icon: <span />, badge: '5' }]}
      />,
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<BottomNav items={[]} className="extra" />);
    expect(screen.getByRole('navigation')).toHaveClass('vxm-bottomnav', 'extra');
  });
});
