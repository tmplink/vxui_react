import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders image when src provided', () => {
    render(<Avatar src="https://example.com/avatar.png" name="John" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('alt attribute matches name', () => {
    render(<Avatar src="https://example.com/avatar.png" name="John Doe" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'John Doe');
  });

  it('renders initials from name when no src', () => {
    render(<Avatar name="Alice Bob" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders two-char initials for single-word name', () => {
    render(<Avatar name="Alice" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('renders custom fallback', () => {
    render(<Avatar fallback="?" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies size class %s', (size) => {
    const { container } = render(<Avatar size={size} name="X" />);
    expect(container.firstChild).toHaveClass(`vx-avatar--${size}`);
  });

  it.each(['circle', 'square'] as const)('applies shape class %s', (shape) => {
    const { container } = render(<Avatar shape={shape} name="X" />);
    expect(container.firstChild).toHaveClass(`vx-avatar--${shape}`);
  });

  it('falls back to initials on image error', () => {
    const { container } = render(<Avatar src="bad.png" name="John Doe" />);
    const img = container.querySelector('img')!;
    // Trigger React's synthetic error event
    Object.defineProperty(img, 'src', { value: 'bad.png', configurable: true });
    fireEvent.error(img);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Avatar className="extra" name="X" />);
    expect(container.firstChild).toHaveClass('vx-avatar', 'extra');
  });
});
