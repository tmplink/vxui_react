import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from '../Radio';

describe('Radio', () => {
  it('renders a radio input', () => {
    render(<Radio label="Option A" value="a" />);
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Radio label="A" value="a" description="Sub-text" />);
    expect(screen.getByText('Sub-text')).toBeInTheDocument();
  });

  it('calls onChange handler', async () => {
    const onChange = vi.fn();
    render(<Radio label="A" value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop set', () => {
    render(<Radio label="A" value="a" disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });
});

describe('RadioGroup', () => {
  it('renders fieldset with legend', () => {
    render(
      <RadioGroup label="Choose">
        <Radio label="A" value="a" name="g" />
        <Radio label="B" value="b" name="g" />
      </RadioGroup>,
    );
    expect(screen.getByRole('group', { name: 'Choose' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <RadioGroup label="Choose">
        <Radio label="A" value="a" name="g" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'A' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(
      <RadioGroup label="G" className="extra">
        <Radio label="A" value="a" name="g" />
      </RadioGroup>,
    );
    expect(container.querySelector('.vx-radio-group')).toHaveClass('vx-radio-group', 'extra');
  });
});
