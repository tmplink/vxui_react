import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Textarea label="Comment" />);
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Textarea hint="Max 500 characters" />);
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('applies resize via inline style', () => {
    render(<Textarea resize="none" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.style.resize).toBe('none');
  });

  it('accepts user input', async () => {
    render(<Textarea />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('forwards className', () => {
    const { container } = render(<Textarea className="extra" />);
    expect(container.querySelector('textarea')).toHaveClass('vx-textarea', 'extra');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
