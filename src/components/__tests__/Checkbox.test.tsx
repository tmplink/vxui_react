import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Checkbox label="Accept" description="Read the terms carefully" />);
    expect(screen.getByText('Read the terms carefully')).toBeInTheDocument();
  });

  it('can be checked', async () => {
    render(<Checkbox />);
    const cb = screen.getByRole('checkbox');
    await userEvent.click(cb);
    expect(cb).toBeChecked();
  });

  it('is disabled when disabled prop set', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('calls onChange handler', async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders as controlled checked', () => {
    render(<Checkbox checked onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders as controlled unchecked', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('forwards className', () => {
    const { container } = render(<Checkbox className="extra" />);
    expect(container.querySelector('.vx-checkbox__input')).toHaveClass('vx-checkbox__input', 'extra');
  });
});
