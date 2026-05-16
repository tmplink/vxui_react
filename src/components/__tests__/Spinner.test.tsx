import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('renders with role=status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "Loading…"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…');
  });

  it('uses custom label', () => {
    render(<Spinner label="Please wait" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Please wait');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size class %s', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole('status')).toHaveClass(`vx-spinner--${size}`);
  });

  it('forwards className', () => {
    render(<Spinner className="my-spinner" />);
    expect(screen.getByRole('status')).toHaveClass('vx-spinner', 'my-spinner');
  });
});
