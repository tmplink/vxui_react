import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimePicker } from '../TimePicker';

describe('TimePicker', () => {
  it('renders an input-like trigger', () => {
    render(<TimePicker />);
    // TimePicker renders a button/input as trigger
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('shows placeholder when no value', () => {
    render(<TimePicker placeholder="Select time" />);
    expect(screen.getByText('Select time')).toBeInTheDocument();
  });

  it('opens time picker panel on click', async () => {
    render(<TimePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<TimePicker label="Start time" />);
    expect(screen.getByText('Start time')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<TimePicker hint="HH:MM format" />);
    expect(screen.getByText('HH:MM format')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(<TimePicker error="Invalid time" />);
    expect(screen.getByText('Invalid time')).toBeInTheDocument();
  });

  it('shows initial value', () => {
    render(<TimePicker defaultValue="14:30" />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  it('increments hour via up button', async () => {
    render(<TimePicker defaultValue="05:00" />);
    await userEvent.click(screen.getByRole('button'));
    const increaseHour = screen.getByRole('button', { name: /increase hour/i });
    await userEvent.click(increaseHour);
    // Value should change
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toHaveAttribute('aria-valuenow', '6');
  });

  it('decrements hour via down button', async () => {
    render(<TimePicker defaultValue="05:00" />);
    await userEvent.click(screen.getByRole('button'));
    const decreaseHour = screen.getByRole('button', { name: /decrease hour/i });
    await userEvent.click(decreaseHour);
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toHaveAttribute('aria-valuenow', '4');
  });

  it('wraps hour from 23 to 0', async () => {
    render(<TimePicker defaultValue="23:00" />);
    await userEvent.click(screen.getByRole('button'));
    const increaseHour = screen.getByRole('button', { name: /increase hour/i });
    await userEvent.click(increaseHour);
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toHaveAttribute('aria-valuenow', '0');
  });

  it('wraps hour from 0 to 23', async () => {
    render(<TimePicker defaultValue="00:00" />);
    await userEvent.click(screen.getByRole('button'));
    const decreaseHour = screen.getByRole('button', { name: /decrease hour/i });
    await userEvent.click(decreaseHour);
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toHaveAttribute('aria-valuenow', '23');
  });

  it('calls onChange when time is confirmed', async () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="10:00" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    const increaseHour = screen.getByRole('button', { name: /increase hour/i });
    await userEvent.click(increaseHour);
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop set', () => {
    render(<TimePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
