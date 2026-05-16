import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationMenu } from '../NavigationMenu';

const items = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    items: [
      { label: 'Widget A', href: '/products/a' },
      { label: 'Widget B', href: '/products/b' },
    ],
  },
  { label: 'About', href: '/about', active: true },
];

describe('NavigationMenu', () => {
  it('renders all top-level labels', () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('sub-menu not visible by default', () => {
    render(<NavigationMenu items={items} />);
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
  });

  it('shows sub-menu on parent click', async () => {
    render(<NavigationMenu items={items} />);
    await userEvent.click(screen.getByText('Products'));
    expect(screen.getByText('Widget A')).toBeInTheDocument();
  });

  it('closes sub-menu on second click', async () => {
    render(<NavigationMenu items={items} />);
    await userEvent.click(screen.getByText('Products'));
    await userEvent.click(screen.getByText('Products'));
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
  });

  it('closes sub-menu on Escape', async () => {
    render(<NavigationMenu items={items} />);
    await userEvent.click(screen.getByText('Products'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
  });

  it('marks active item', () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText('About').closest('.vx-nav-menu__link')).toHaveClass(
      'vx-nav-menu__link--active',
    );
  });

  it('forwards className', () => {
    render(<NavigationMenu items={items} className="extra" />);
    expect(screen.getByRole('navigation')).toHaveClass('vx-nav-menu', 'extra');
  });
});
