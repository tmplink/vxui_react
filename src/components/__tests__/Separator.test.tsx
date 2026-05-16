import { render, screen } from '@testing-library/react';
import { Separator } from '../Separator';

describe('Separator', () => {
  it('renders an hr element', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('is decorative by default (role=none)', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toHaveAttribute('role', 'none');
  });

  it('sets role=separator when decorative=false', () => {
    const { container } = render(<Separator decorative={false} />);
    expect(container.querySelector('hr')).toHaveAttribute('role', 'separator');
  });

  it('applies aria-orientation for semantic separator', () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />);
    const el = container.querySelector('hr')!;
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies horizontal class by default', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toHaveClass('vx-separator--horizontal');
  });

  it('applies vertical class', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.querySelector('hr')).toHaveClass('vx-separator--vertical');
  });

  it('forwards custom className', () => {
    const { container } = render(<Separator className="my-sep" />);
    expect(container.querySelector('hr')).toHaveClass('vx-separator', 'my-sep');
  });
});
