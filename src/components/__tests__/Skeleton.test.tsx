import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders a single rect skeleton by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.vx-skeleton--rect')).toBeInTheDocument();
  });

  it('renders circle variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.querySelector('.vx-skeleton--circle')).toBeInTheDocument();
  });

  it('renders text variant single line', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.querySelector('.vx-skeleton--text')).toBeInTheDocument();
  });

  it('renders text variant multi-line', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const spans = container.querySelectorAll('.vx-skeleton--text');
    expect(spans.length).toBe(3);
  });

  it('last line in multi-text has 70% width', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const spans = Array.from(container.querySelectorAll('.vx-skeleton--text')) as HTMLElement[];
    expect(spans[2].style.width).toBe('70%');
  });

  it('applies numeric width and height as px', () => {
    const { container } = render(<Skeleton width={100} height={50} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('50px');
  });

  it('applies string width and height', () => {
    const { container } = render(<Skeleton width="2rem" height="1rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('2rem');
    expect(el.style.height).toBe('1rem');
  });

  it('forwards className', () => {
    const { container } = render(<Skeleton className="extra" />);
    expect(container.firstChild).toHaveClass('vx-skeleton', 'extra');
  });
});
