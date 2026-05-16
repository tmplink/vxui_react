import { render, screen } from '@testing-library/react';
import { ScrollArea } from '../ScrollArea';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(
      <ScrollArea>
        <p>Scroll content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scroll content')).toBeInTheDocument();
  });

  it('applies maxHeight style', () => {
    const { container } = render(
      <ScrollArea maxHeight="200px">
        <p>content</p>
      </ScrollArea>,
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: '200px' });
  });

  it('applies maxWidth style', () => {
    const { container } = render(
      <ScrollArea maxWidth="300px">
        <p>content</p>
      </ScrollArea>,
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: '300px' });
  });

  it('applies vx-scroll-area class', () => {
    const { container } = render(<ScrollArea><p>x</p></ScrollArea>);
    expect(container.firstChild).toHaveClass('vx-scroll-area');
  });

  it('forwards className', () => {
    const { container } = render(<ScrollArea className="extra"><p>x</p></ScrollArea>);
    expect(container.firstChild).toHaveClass('vx-scroll-area', 'extra');
  });
});
