import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from '../Calendar';

describe('Calendar', () => {
  it('renders a calendar grid', () => {
    render(<Calendar />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders day buttons', () => {
    render(<Calendar />);
    const dayButtons = screen.getAllByRole('gridcell');
    expect(dayButtons.length).toBeGreaterThan(0);
  });

  it('shows current month', () => {
    const date = new Date(2024, 0, 15); // Jan 15 2024
    render(<Calendar value={date} onChange={vi.fn()} />);
    // The grid's aria-label contains the month and year; check for the year
    // because the month name is locale-dependent (January vs 一月 etc.)
    expect(screen.getByRole('grid', { name: /2024/ })).toBeInTheDocument();
  });

  it('calls onChange when a day is selected', async () => {
    const onChange = vi.fn();
    render(<Calendar onChange={onChange} />);
    const days = screen.getAllByRole('gridcell').filter((btn) => /^\d+$/.test(btn.textContent ?? ''));
    await userEvent.click(days[0]);
    expect(onChange).toHaveBeenCalled();
  });

  it('navigates to previous month', async () => {
    render(<Calendar />);
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevBtn);
    // Just verify no crash and still renders a grid
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('navigates to next month', async () => {
    render(<Calendar />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextBtn);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders with defaultValue selected date', () => {
    const date = new Date(2024, 0, 10);
    render(<Calendar defaultValue={date} />);
    const selected = document.querySelector('[aria-selected="true"]') || document.querySelector('[aria-pressed="true"]');
    expect(selected).toBeInTheDocument();
  });

  it('disables days outside min/max range', () => {
    const min = new Date(2024, 0, 10);
    const max = new Date(2024, 0, 20);
    render(<Calendar value={new Date(2024, 0, 15)} min={min} max={max} onChange={vi.fn()} />);
    const disabledDays = screen.getAllByRole('gridcell').filter(
      (btn) => btn.hasAttribute('disabled') && /^\d+$/.test(btn.textContent ?? ''),
    );
    expect(disabledDays.length).toBeGreaterThan(0);
  });

  it('weekStartsOnMonday shows Monday header', () => {
    render(<Calendar weekStartsOnMonday />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0].textContent).toMatch(/mo/i);
  });

  it('forwards className', () => {
    const { container } = render(<Calendar className="extra" />);
    expect(container.querySelector('.vx-calendar')).toHaveClass('vx-calendar', 'extra');
  });
});
