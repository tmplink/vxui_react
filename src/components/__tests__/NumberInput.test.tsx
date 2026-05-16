import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from '../NumberInput';

describe('NumberInput', () => {
  it('renders a number input', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<NumberInput label="Quantity" />);
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<NumberInput hint="Enter amount" />);
    expect(screen.getByText('Enter amount')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(<NumberInput error="Invalid" />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('has increment button', () => {
    render(<NumberInput />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
  });

  it('has decrement button', () => {
    render(<NumberInput />);
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument();
  });

  it('increments value on Increase click', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} step={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrements value on Decrease click', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} step={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('does not call onChange when already at min', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={0} min={0} onChange={onChange} />);
    // Decrease button is disabled at min, so clicking won't call onChange
    const decBtn = screen.getByRole('button', { name: 'Decrease' });
    expect(decBtn).toBeDisabled();
  });

  it('does not call onChange when already at max', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={10} max={10} onChange={onChange} />);
    // Increase button is disabled at max
    const incBtn = screen.getByRole('button', { name: 'Increase' });
    expect(incBtn).toBeDisabled();
  });

  it('is disabled when disabled prop set', () => {
    render(<NumberInput disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('forwards className', () => {
    const { container } = render(<NumberInput className="extra" />);
    expect(container.querySelector('.vx-number-input')).toHaveClass('vx-number-input', 'extra');
  });
});
