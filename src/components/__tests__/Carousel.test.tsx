import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from '../Carousel';

const items = [
  <div key="a">Slide 1</div>,
  <div key="b">Slide 2</div>,
  <div key="c">Slide 3</div>,
];

describe('Carousel', () => {
  it('renders carousel container', () => {
    const { container } = render(<Carousel items={items} />);
    expect(container.querySelector('.vx-carousel')).toBeInTheDocument();
  });

  it('renders prev and next arrow buttons when showArrows=true', () => {
    render(<Carousel items={items} showArrows />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('does not render arrows when showArrows=false', () => {
    render(<Carousel items={items} showArrows={false} />);
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  });

  it('renders dot indicators when showDots=true', () => {
    render(<Carousel items={items} showDots />);
    const dots = screen.getAllByRole('tab');
    expect(dots.length).toBe(items.length);
  });

  it('starts at defaultIndex', () => {
    render(<Carousel items={items} showDots defaultIndex={1} />);
    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to next slide on next arrow click', async () => {
    render(<Carousel items={items} showArrows showDots defaultIndex={0} />);
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to prev slide on prev arrow click', async () => {
    render(<Carousel items={items} showArrows showDots defaultIndex={2} />);
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps around with loop=true', async () => {
    render(<Carousel items={items} showArrows showDots defaultIndex={0} loop />);
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    const dots = screen.getAllByRole('tab');
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates via dot click', async () => {
    render(<Carousel items={items} showDots defaultIndex={0} />);
    const dots = screen.getAllByRole('tab');
    await userEvent.click(dots[2]);
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });
});
