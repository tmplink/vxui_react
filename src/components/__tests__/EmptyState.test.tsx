import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';
import userEvent from '@testing-library/user-event';

describe('EmptyState', () => {
  it('renders with role=status', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="T" description="Try again later" />);
    expect(screen.getByText('Try again later')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    const { container } = render(<EmptyState title="T" />);
    expect(container.querySelector('.vx-empty-state__description')).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<EmptyState title="T" icon={<span data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<EmptyState title="T" action={<button>Retry</button>} />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('does not render action when omitted', () => {
    const { container } = render(<EmptyState title="T" />);
    expect(container.querySelector('.vx-empty-state__action')).not.toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<EmptyState title="T" className="extra" />);
    expect(screen.getByRole('status')).toHaveClass('vx-empty-state', 'extra');
  });
});
