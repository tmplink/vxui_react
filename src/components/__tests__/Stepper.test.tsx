import { render, screen } from '@testing-library/react';
import { Stepper } from '../Stepper';

const steps = [
  { label: 'Step 1', description: 'Desc 1', status: 'completed' as const },
  { label: 'Step 2', description: 'Desc 2', status: 'active' as const },
  { label: 'Step 3', status: 'pending' as const },
  { label: 'Step 4', status: 'error' as const },
];

describe('Stepper', () => {
  it('renders all step labels', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    steps.forEach((s) => expect(screen.getByText(s.label)).toBeInTheDocument());
  });

  it('renders descriptions', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 2')).toBeInTheDocument();
  });

  it('renders step numbers for non-completed steps', () => {
    render(<Stepper steps={[{ label: 'S', status: 'pending' }]} currentStep={0} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('applies horizontal orientation by default', () => {
    const { container } = render(<Stepper steps={steps} currentStep={1} />);
    expect(container.firstChild).toHaveClass('vx-stepper--horizontal');
  });

  it('applies vertical orientation', () => {
    const { container } = render(
      <Stepper steps={steps} currentStep={1} orientation="vertical" />,
    );
    expect(container.firstChild).toHaveClass('vx-stepper--vertical');
  });

  it.each(['completed', 'active', 'pending', 'error'] as const)(
    'applies status data attribute %s',
    (status) => {
      const { container } = render(
        <Stepper steps={[{ label: 'S', status }]} currentStep={0} />,
      );
      expect(container.querySelector(`.vx-stepper__step--${status}`)).toBeInTheDocument();
    },
  );

  it('forwards className', () => {
    const { container } = render(<Stepper steps={steps} currentStep={0} className="extra" />);
    expect(container.firstChild).toHaveClass('vx-stepper', 'extra');
  });
});
