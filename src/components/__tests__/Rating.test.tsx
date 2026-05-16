import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from '../Rating';

describe('Rating', () => {
  it('renders star buttons', () => {
    render(<Rating />);
    const stars = screen.getAllByRole('button');
    expect(stars.length).toBe(5); // default max=5
  });

  it('renders custom max stars', () => {
    render(<Rating max={3} />);
    expect(screen.getAllByRole('button').length).toBe(3);
  });

  it('shows label as aria-label on group', () => {
    render(<Rating label="My Rating" />);
    expect(screen.getByRole('group', { name: 'My Rating' })).toBeInTheDocument();
  });

  it('calls onChange when star clicked', async () => {
    const onChange = vi.fn();
    render(<Rating onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '3 stars' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders controlled value', () => {
    render(<Rating value={4} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '4 stars' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('renders defaultValue', () => {
    render(<Rating defaultValue={2} />);
    const twoStar = screen.getByRole('button', { name: '2 stars' });
    expect(twoStar).toHaveAttribute('aria-pressed', 'true');
  });

  it('is readonly when readOnly=true - buttons have tabindex -1', () => {
    render(<Rating readOnly value={3} />);
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('tabindex', '-1');
    });
  });

  it('is disabled when disabled=true', () => {
    render(<Rating disabled />);
    screen.getAllByRole('button').forEach((btn) => expect(btn).toBeDisabled());
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size class %s', (size) => {
    const { container } = render(<Rating size={size} />);
    expect(container.firstChild).toHaveClass(`vx-rating--${size}`);
  });

  it('forwards className', () => {
    const { container } = render(<Rating className="extra" />);
    expect(container.firstChild).toHaveClass('vx-rating', 'extra');
  });
});
