import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../Select';

describe('Select', () => {
  it('renders a combobox', () => {
    render(
      <Select>
        <option value="a">Option A</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <Select label="Pick one">
        <option value="a">Option A</option>
      </Select>,
    );
    expect(screen.getByLabelText('Pick one')).toBeInTheDocument();
  });

  it('renders options as children', () => {
    render(
      <Select>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
        <option value="c">Option C</option>
      </Select>,
    );
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
  });

  it('renders placeholder as disabled option', () => {
    render(
      <Select placeholder="Select...">
        <option value="a">A</option>
      </Select>,
    );
    const ph = screen.getByRole('option', { name: 'Select...' });
    expect(ph).toBeDisabled();
  });

  it('renders hint text', () => {
    render(
      <Select hint="Choose wisely">
        <option value="a">A</option>
      </Select>,
    );
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('calls onChange when option selected', async () => {
    const onChange = vi.fn();
    render(
      <Select onChange={onChange}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>,
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards className to wrapper span', () => {
    const { container } = render(
      <Select className="extra">
        <option value="a">A</option>
      </Select>,
    );
    expect(container.querySelector('.vx-select')).toHaveClass('vx-select', 'extra');
  });
});

