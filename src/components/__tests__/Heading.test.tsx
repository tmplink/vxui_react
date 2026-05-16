import { render, screen } from '@testing-library/react';
import { Heading } from '../Heading';

describe('Heading', () => {
  it('renders h2 by default', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders custom level via level prop', () => {
    render(<Heading level={3}>Title</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders custom element via as prop', () => {
    render(<Heading as="h1">Title</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('applies level-specific class', () => {
    render(<Heading level={4}>Title</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('vx-heading--h4');
  });

  it.each(['default', 'secondary'] as const)('applies variant class %s', (variant) => {
    render(<Heading variant={variant}>Title</Heading>);
    expect(screen.getByRole('heading')).toHaveClass(`vx-heading--${variant}`);
  });

  it.each(['normal', 'medium', 'semibold', 'bold'] as const)('applies weight class %s', (weight) => {
    render(<Heading weight={weight}>Title</Heading>);
    expect(screen.getByRole('heading')).toHaveClass(`vx-heading-weight--${weight}`);
  });

  it('applies truncate class', () => {
    render(<Heading truncate>Title</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('vx-text--truncate');
  });

  it('forwards className', () => {
    render(<Heading className="my-class">Title</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('vx-heading', 'my-class');
  });
});
