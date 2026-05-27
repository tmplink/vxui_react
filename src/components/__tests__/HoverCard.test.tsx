import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const user = userEvent.setup();
    render(
      <HoverCard content={<p>Card</p>} delay={0}>
        <span>Hover</span>
      </HoverCard>,
    );
    await user.hover(screen.getByText('Hover'));
    expect(await screen.findByText('Card')).toBeInTheDocument();
  });

  it('hides card on mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <HoverCard content={<p>Card</p>} delay={0}>
        <span>Hover</span>
      </HoverCard>,
    );
    await user.hover(screen.getByText('Hover'));
    expect(await screen.findByText('Card')).toBeInTheDocument();
    await user.unhover(screen.getByText('Hover'));
    // After unhover, the card should be removed immediately (no hide delay)
    expect(screen.queryByText('Card')).not.toBeInTheDocument();
  });

  it('shows card on focus', async () => {
    const user = userEvent.setup();
    render(
      <HoverCard content={<p>Card</p>} delay={0}>
        <button>Focus</button>
      </HoverCard>,
    );
    await user.tab();
    expect(await screen.findByText('Card')).toBeInTheDocument();
  });
});
