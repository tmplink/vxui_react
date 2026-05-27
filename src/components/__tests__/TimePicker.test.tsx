import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimePicker } from '../TimePicker';
import { Dialog } from '../Dialog';
import { Button } from '../Button';

const originalMatchMedia = window.matchMedia;

function mockMaxWidth640(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: query === '(max-width: 640px)' ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('TimePicker', () => {
  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

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
    const user = userEvent.setup();
    render(<TimePicker defaultValue="10:00" onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    const increaseHour = screen.getByRole('button', { name: /increase hour/i });
    await user.click(increaseHour);
    expect(onChange).toHaveBeenCalledWith('11:00');
  });

  it('is disabled when disabled prop set', () => {
    render(<TimePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('closes panel with Escape key', async () => {
    render(<TimePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('spinbutton', { name: /hour/i })).not.toBeInTheDocument();
  });

  it('renders inline (bottom sheet) instead of portal on narrow viewport', async () => {
    mockMaxWidth640(true);

    render(
      <Dialog trigger={<Button>Open dialog</Button>} title="Pick a time">
        <TimePicker placeholder="Select time" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    await userEvent.click(screen.getByRole('button', { name: 'Select time' }));

    // On narrow viewports, the popover is rendered inline (not portaled)
    // so it does NOT get the --in-dialog class; CSS media queries handle
    // the bottom sheet styling instead.
    const popover = document.body.querySelector('.vx-timepicker__popover');
    expect(popover).not.toHaveClass('vx-timepicker__popover--in-dialog');
    expect(popover).toBeInTheDocument();
  });

  // Regression: pressing Escape while the TimePicker panel is open inside a Dialog
  // should close the panel only, leaving the Dialog open.
  it('Escape closes the panel without closing the parent Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open dialog</Button>} title="Pick a time">
        <TimePicker placeholder="Select time" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog', { name: 'Pick a time' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Select time' }));
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('spinbutton', { name: /hour/i })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Pick a time' })).toBeInTheDocument();
  });
});;
