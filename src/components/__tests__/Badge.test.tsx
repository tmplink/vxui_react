import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies default neutral variant', () => {
    const { container } = render(<Badge>x</Badge>);
    expect(container.firstChild).toHaveClass('vx-badge--neutral');
  });

  it.each(['neutral', 'accent', 'success', 'warning'] as const)(
    'applies variant class %s',
    (variant) => {
      const { container } = render(<Badge variant={variant}>v</Badge>);
      expect(container.firstChild).toHaveClass(`vx-badge--${variant}`);
    },
  );

  it('forwards extra className', () => {
    const { container } = render(<Badge className="extra">x</Badge>);
    expect(container.firstChild).toHaveClass('vx-badge', 'extra');
  });

  it('passes through HTML attributes', () => {
    render(<Badge data-testid="b" aria-label="badge">x</Badge>);
    expect(screen.getByTestId('b')).toHaveAttribute('aria-label', 'badge');
  });
});
