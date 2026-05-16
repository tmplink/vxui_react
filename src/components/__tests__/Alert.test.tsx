import { render, screen } from '@testing-library/react';
import { Alert } from '../Alert';
import userEvent from '@testing-library/user-event';

describe('Alert', () => {
  it('renders with role=alert', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'applies variant class %s',
    (variant) => {
      render(<Alert variant={variant}>x</Alert>);
      expect(screen.getByRole('alert')).toHaveClass(`vx-alert--${variant}`);
    },
  );

  it('renders title when provided', () => {
    render(<Alert title="Heads up">body</Alert>);
    expect(screen.getByText('Heads up')).toHaveClass('vx-alert__title');
  });

  it('does not render title when omitted', () => {
    const { container } = render(<Alert>body</Alert>);
    expect(container.querySelector('.vx-alert__title')).not.toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Alert>Important message</Alert>);
    expect(screen.getByText('Important message')).toBeInTheDocument();
  });

  it('renders close button when onClose provided', () => {
    render(<Alert onClose={vi.fn()}>x</Alert>);
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>x</Alert>);
    await userEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose omitted', () => {
    render(<Alert>x</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<Alert icon={<span data-testid="icon" />}>x</Alert>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not render children content div when children omitted', () => {
    const { container } = render(<Alert title="T" />);
    expect(container.querySelector('.vx-alert__content')).not.toBeInTheDocument();
  });

  it('forwards className and HTML props', () => {
    render(<Alert className="extra" data-testid="al">x</Alert>);
    expect(screen.getByTestId('al')).toHaveClass('vx-alert', 'extra');
  });
});
