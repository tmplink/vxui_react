import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  it('renders a trigger button', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder when no value', () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<DatePicker label="Start date" />);
    expect(screen.getByText('Start date')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<DatePicker hint="YYYY-MM-DD" />);
    expect(screen.getByText('YYYY-MM-DD')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<DatePicker error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('opens calendar on trigger click', async () => {
    render(<DatePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('closes calendar on outside click', async () => {
    render(
      <div>
        <DatePicker />
        <p>Outside</p>
      </div>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Outside'));
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('shows formatted value when defaultValue set', () => {
    render(<DatePicker defaultValue={new Date(2024, 0, 15)} />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('calls onChange when date selected', async () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    const days = screen.getAllByRole('gridcell').filter((btn) => /^\d+$/.test(btn.textContent ?? ''));
    await userEvent.click(days[0]);
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop set', () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open calendar when disabled', async () => {
    render(<DatePicker disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});
