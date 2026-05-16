import { render, screen } from '@testing-library/react';
import { Progress } from '../Progress';

describe('Progress', () => {
  it('renders with role=progressbar', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow, aria-valuemin, aria-valuemax', () => {
    render(<Progress value={30} max={200} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '200');
  });

  it('renders label when provided', () => {
    render(<Progress value={50} label="Loading files" />);
    expect(screen.getByText('Loading files')).toBeInTheDocument();
  });

  it('shows percentage label when showLabel=true', () => {
    render(<Progress value={50} showLabel />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('does not show label by default', () => {
    render(<Progress value={50} />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size class %s', (size) => {
    const { container } = render(<Progress value={50} size={size} />);
    expect(container.querySelector('.vx-progress')).toHaveClass(`vx-progress--${size}`);
  });

  it.each(['default', 'success', 'warning', 'danger', 'rainbow'] as const)(
    'applies variant class %s',
    (variant) => {
      const { container } = render(<Progress value={50} variant={variant} />);
      expect(container.querySelector('[role="progressbar"]')).toHaveClass(
        `vx-progress--${variant}`,
      );
    },
  );

  it('applies indeterminate class', () => {
    const { container } = render(<Progress indeterminate />);
    expect(container.querySelector('[role="progressbar"]')).toHaveClass(
      'vx-progress--indeterminate',
    );
  });

  it('does not set aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('forwards className', () => {
    const { container } = render(<Progress value={50} className="extra" />);
    expect(container.querySelector('.vx-progress-wrap')).toHaveClass('extra');
  });
});
