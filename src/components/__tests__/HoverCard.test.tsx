import { render, screen, act, fireEvent } from '@testing-library/react';
import { HoverCard } from '../HoverCard';

describe('HoverCard', () => {
  it('renders children', () => {
    render(
      <HoverCard content={<p>Card content</p>}>
        <span>Hover over me</span>
      </HoverCard>,
    );
    expect(screen.getByText('Hover over me')).toBeInTheDocument();
  });

  it('card not visible initially', () => {
    render(
      <HoverCard content={<p>Card</p>}>
        <span>Hover</span>
      </HoverCard>,
    );
    expect(screen.queryByText('Card')).not.toBeInTheDocument();
  });

  it('shows card on hover', async () => {
    vi.useFakeTimers();
    render(
      <HoverCard content={<p>Card</p>} delay={0}>
        <span>Hover</span>
      </HoverCard>,
    );
    act(() => { fireEvent.mouseEnter(screen.getByText('Hover')); });
    act(() => { vi.runAllTimers(); });
    expect(screen.getByText('Card')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('hides card on mouse leave', async () => {
    vi.useFakeTimers();
    render(
      <HoverCard content={<p>Card</p>} delay={0}>
        <span>Hover</span>
      </HoverCard>,
    );
    act(() => { fireEvent.mouseEnter(screen.getByText('Hover')); });
    act(() => { vi.runAllTimers(); });
    act(() => { fireEvent.mouseLeave(screen.getByText('Hover')); });
    expect(screen.queryByText('Card')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('shows card on focus', async () => {
    vi.useFakeTimers();
    render(
      <HoverCard content={<p>Card</p>} delay={0}>
        <button>Focus</button>
      </HoverCard>,
    );
    act(() => { screen.getByRole('button', { name: 'Focus' }).focus(); });
    act(() => { vi.runAllTimers(); });
    expect(screen.getByText('Card')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
