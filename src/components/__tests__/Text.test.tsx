import { render, screen } from '@testing-library/react';
import { Text } from '../Text';

describe('Text', () => {
  it('renders as p by default', () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it.each(['p', 'span', 'div'] as const)('renders as %s', (as) => {
    const { container } = render(<Text as={as}>Hello</Text>);
    expect(container.querySelector(as)).toBeInTheDocument();
  });

  it.each(['default', 'secondary', 'muted', 'danger', 'success'] as const)(
    'applies variant class %s',
    (variant) => {
      render(<Text variant={variant}>x</Text>);
      expect(screen.getByText('x')).toHaveClass(`vx-text--${variant}`);
    },
  );

  it.each(['sm', 'base', 'lg', 'xl'] as const)('applies size class %s', (size) => {
    render(<Text size={size}>x</Text>);
    expect(screen.getByText('x')).toHaveClass(`vx-text-size--${size}`);
  });

  it.each(['normal', 'medium', 'semibold', 'bold'] as const)('applies weight class %s', (weight) => {
    render(<Text weight={weight}>x</Text>);
    expect(screen.getByText('x')).toHaveClass(`vx-text-weight--${weight}`);
  });

  it('applies truncate class', () => {
    render(<Text truncate>x</Text>);
    expect(screen.getByText('x')).toHaveClass('vx-text--truncate');
  });

  it('forwards className', () => {
    render(<Text className="extra">x</Text>);
    expect(screen.getByText('x')).toHaveClass('vx-text-component', 'extra');
  });
});
