import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it.each(['solid', 'secondary', 'ghost', 'danger', 'outline'] as const)(
    'applies variant class %s',
    (variant) => {
      render(<Button variant={variant}>B</Button>);
      expect(screen.getByRole('button')).toHaveClass(`vx-button--${variant}`);
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('applies size class %s', (size) => {
    render(<Button size={size}>B</Button>);
    expect(screen.getByRole('button')).toHaveClass(`vx-button--${size}`);
  });

  it.each(['pill', 'square', 'circle'] as const)('applies shape class %s', (shape) => {
    render(<Button shape={shape}>B</Button>);
    expect(screen.getByRole('button')).toHaveClass(`vx-button--${shape}`);
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>B</Button>);
    expect(screen.getByRole('button')).toHaveClass('vx-button--full-width');
  });

  it('shows loading state', () => {
    render(<Button loading>B</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('vx-button--loading');
    expect(btn).toBeDisabled();
  });

  it('renders startIcon', () => {
    render(<Button startIcon={<span data-testid="si" />}>B</Button>);
    expect(screen.getByTestId('si')).toBeInTheDocument();
  });

  it('renders endIcon', () => {
    render(<Button endIcon={<span data-testid="ei" />}>B</Button>);
    expect(screen.getByTestId('ei')).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>B</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop set', () => {
    render(<Button disabled>B</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>B</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports type=submit', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Button ref={ref}>B</Button>);
    expect(ref.current).not.toBeNull();
  });

  it('forwards className', () => {
    render(<Button className="extra">B</Button>);
    expect(screen.getByRole('button')).toHaveClass('vx-button', 'extra');
  });
});
