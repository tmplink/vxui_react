import { render, screen, act, fireEvent } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('tooltip not visible initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    act(() => { fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover me' })); });
    act(() => { vi.runAllTimers(); });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('hides tooltip on mouse leave', async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    act(() => { fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover me' })); });
    act(() => { vi.runAllTimers(); });
    act(() => { fireEvent.mouseLeave(screen.getByRole('button', { name: 'Hover me' })); });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('shows tooltip on focus', async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Focus tip" delay={0}>
        <button>Focus me</button>
      </Tooltip>,
    );
    act(() => { screen.getByRole('button', { name: 'Focus me' }).focus(); });
    act(() => { vi.runAllTimers(); });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('forwards className', () => {
    const { container } = render(
      <Tooltip content="tip" className="extra">
        <button>B</button>
      </Tooltip>,
    );
    expect(container.querySelector('.vx-tooltip-wrap')).toHaveClass('vx-tooltip-wrap', 'extra');
  });
});
