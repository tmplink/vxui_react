import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card';

describe('Card', () => {
  it('renders as section', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('applies vx-card class', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.querySelector('section')).toHaveClass('vx-card');
  });

  it.each(['flat', 'elevated', 'outlined', 'ghost', 'filled'] as const)(
    'applies variant class %s',
    (variant) => {
      const { container } = render(<Card variant={variant}>x</Card>);
      expect(container.querySelector('section')).toHaveClass(`vx-card--${variant}`);
    },
  );

  it('default variant adds no extra class', () => {
    const { container } = render(<Card variant="default">x</Card>);
    expect(container.querySelector('section')).not.toHaveClass('vx-card--default');
  });

  it.each(['none', 'sm', 'md', 'lg'] as const)('applies padding class %s', (padding) => {
    const { container } = render(<Card padding={padding}>x</Card>);
    expect(container.querySelector('section')).toHaveClass(`vx-card--pad-${padding}`);
  });

  it('does not apply padding class when omitted', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.querySelector('section')!.className).not.toContain('vx-card--pad-');
  });

  it('applies hoverable class', () => {
    const { container } = render(<Card hoverable>x</Card>);
    expect(container.querySelector('section')).toHaveClass('vx-card--hoverable');
  });

  it('forwards className', () => {
    const { container } = render(<Card className="extra">x</Card>);
    expect(container.querySelector('section')).toHaveClass('vx-card', 'extra');
  });

  it('renders CardHeader', () => {
    const { container } = render(<CardHeader>header</CardHeader>);
    expect(container.querySelector('header')).toHaveClass('vx-card__header');
  });

  it('renders CardTitle', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toHaveClass('vx-card__title');
  });

  it('renders CardDescription', () => {
    render(<CardDescription>Desc</CardDescription>);
    expect(screen.getByText('Desc')).toHaveClass('vx-card__description');
  });

  it('renders CardContent', () => {
    const { container } = render(<CardContent>body</CardContent>);
    expect(container.querySelector('.vx-card__content')).toBeInTheDocument();
  });
});
