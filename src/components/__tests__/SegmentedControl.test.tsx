import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../SegmentedControl';

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Disabled', value: 'dis', disabled: true },
];

describe('SegmentedControl', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all option labels', () => {
    render(<SegmentedControl options={options} defaultValue="day" />);
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
  });

  it('marks default value as selected', () => {
    render(<SegmentedControl options={options} defaultValue="week" />);
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('calls onChange when option clicked', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={options} defaultValue="day" onChange={onChange} />);
    await userEvent.click(screen.getByText('Week'));
    expect(onChange).toHaveBeenCalledWith('week');
  });

  it('disabled option cannot be selected', () => {
    render(<SegmentedControl options={options} defaultValue="day" />);
    const disabledRadio = screen.getByRole('radio', { name: 'Disabled' });
    expect(disabledRadio).toBeDisabled();
  });

  it('supports controlled value', () => {
    render(
      <SegmentedControl options={options} value="month" onChange={vi.fn()} />,
    );
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
  });

  it('forwards className', () => {
    const { container } = render(
      <SegmentedControl options={options} defaultValue="day" className="extra" />,
    );
    expect(container.firstChild).toHaveClass('vx-segmented-control', 'extra');
  });
});
