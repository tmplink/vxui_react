import { render, screen } from '@testing-library/react';
import { Label } from '../Label';

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('applies vx-label class', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email').closest('label')).toHaveClass('vx-label');
  });

  it('renders required indicator when required=true', () => {
    const { container } = render(<Label required>Email</Label>);
    expect(container.querySelector('.vx-label__required')).toBeInTheDocument();
  });

  it('does not render required indicator when required is omitted', () => {
    const { container } = render(<Label>Email</Label>);
    expect(container.querySelector('.vx-label__required')).not.toBeInTheDocument();
  });

  it('forwards htmlFor', () => {
    render(<Label htmlFor="inp">Email</Label>);
    expect(screen.getByText('Email').closest('label')).toHaveAttribute('for', 'inp');
  });

  it('forwards className', () => {
    render(<Label className="extra">Email</Label>);
    expect(screen.getByText('Email').closest('label')).toHaveClass('vx-label', 'extra');
  });
});
