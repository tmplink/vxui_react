import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle, ToggleGroup } from '../Toggle';

describe('Toggle', () => {
  it('renders a toggle button', () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
  });

  it('is not pressed by default', () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles pressed state on click', async () => {
    render(<Toggle>Bold</Toggle>);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onPressedChange on click', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>B</Toggle>);
    await userEvent.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('renders as controlled pressed', () => {
    render(<Toggle pressed onPressedChange={vi.fn()}>B</Toggle>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('is disabled when disabled prop set', () => {
    render(<Toggle disabled>B</Toggle>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('ToggleGroup', () => {
  const items = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];

  it('renders all items', () => {
    render(<ToggleGroup items={items} />);
    expect(screen.getByRole('button', { name: 'Left' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Center' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Right' })).toBeInTheDocument();
  });

  it('in single mode, clicking an item selects it', async () => {
    const onValueChange = vi.fn();
    render(<ToggleGroup items={items} type="single" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Left' }));
    expect(onValueChange).toHaveBeenCalledWith('left');
  });

  it('in multiple mode, clicking selects additively', async () => {
    const onValueChange = vi.fn();
    render(<ToggleGroup items={items} type="multiple" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Left' }));
    await userEvent.click(screen.getByRole('button', { name: 'Center' }));
    // Both should be toggled
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('renders with defaultValue selected', () => {
    render(<ToggleGroup items={items} type="single" defaultValue="center" />);
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true');
  });
});
