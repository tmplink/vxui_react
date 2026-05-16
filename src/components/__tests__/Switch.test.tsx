import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('renders a switch', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Switch description="You will receive alerts" />);
    expect(screen.getByText('You will receive alerts')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles on click', async () => {
    render(<Switch />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange when toggled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled prop set', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('forwards className', () => {
    const { container } = render(<Switch className="extra" />);
    expect(container.querySelector('.vx-switch__control')).toHaveClass('vx-switch__control', 'extra');
  });
});
