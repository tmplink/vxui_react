import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '../Slider';

describe('Slider', () => {
  it('renders a range input', () => {
    render(<Slider />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Slider label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Slider hint="Adjust the level" />);
    expect(screen.getByText('Adjust the level')).toBeInTheDocument();
  });

  it('shows current value when showValue=true', () => {
    render(<Slider showValue defaultValue={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('does not show value by default', () => {
    render(<Slider defaultValue={42} />);
    expect(screen.queryByText('42')).not.toBeInTheDocument();
  });

  it('renders with min/max/step', () => {
    render(<Slider min={10} max={90} step={5} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '90');
    expect(slider).toHaveAttribute('step', '5');
  });

  it('is disabled when disabled prop set', () => {
    render(<Slider disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('forwards className', () => {
    const { container } = render(<Slider className="extra" />);
    expect(container.querySelector('.vx-slider')).toHaveClass('vx-slider', 'extra');
  });
});
