import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumb } from '../Breadcrumb';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Current', href: '/products/1' },
];

describe('Breadcrumb', () => {
  it('renders nav with aria-label breadcrumb', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('renders all labels', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('marks last item as aria-current="page"', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Current').closest('[aria-current]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders anchor links for items with href', () => {
    render(<Breadcrumb items={items} />);
    const link = screen.getByText('Home').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll('.vx-breadcrumb__sep');
    expect(separators.length).toBe(items.length - 1);
  });

  it('uses custom separator', () => {
    render(<Breadcrumb items={items} separator=">" />);
    const seps = screen.getAllByText('>');
    expect(seps.length).toBe(items.length - 1);
  });

  it('calls onClick handler for items with onClick', async () => {
    const onClick = vi.fn();
    render(
      <Breadcrumb
        items={[
          { label: 'Home', onClick },
          { label: 'Current' },
        ]}
      />,
    );
    await userEvent.click(screen.getByText('Home'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders button for items with onClick but no href', () => {
    render(
      <Breadcrumb
        items={[{ label: 'Home', onClick: vi.fn() }, { label: 'Cur' }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Breadcrumb items={items} className="extra" />);
    expect(screen.getByRole('navigation')).toHaveClass('vx-breadcrumb', 'extra');
  });
});
