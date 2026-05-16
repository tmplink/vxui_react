import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Input hint="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error class when error provided', () => {
    const { container } = render(<Input error="err" />);
    expect(container.querySelector('.vx-input')).toHaveClass('vx-input--invalid');
  });

  it('renders prefix', () => {
    render(<Input prefix={<span>@</span>} />);
    expect(screen.getByText('@')).toBeInTheDocument();
  });

  it('renders suffix', () => {
    render(<Input suffix={<span>px</span>} />);
    expect(screen.getByText('px')).toBeInTheDocument();
  });

  it.each(['filled', 'underline', 'borderless'] as const)(
    'applies variant class %s',
    (variant) => {
      const { container } = render(<Input variant={variant} />);
      expect(container.querySelector('.vx-input')).toHaveClass(`vx-input--${variant}`);
    },
  );

  it('does not add class for default variant', () => {
    const { container } = render(<Input variant="default" />);
    expect(container.querySelector('.vx-input')).not.toHaveClass('vx-input--default');
  });

  it.each(['sm', 'lg'] as const)('applies size class %s', (size) => {
    const { container } = render(<Input size={size} />);
    expect(container.querySelector('.vx-input')).toHaveClass(`vx-input--${size}`);
  });

  it('does not add class for md size', () => {
    const { container } = render(<Input size="md" />);
    expect(container.querySelector('.vx-input')).not.toHaveClass('vx-input--md');
  });

  it('applies rounded class', () => {
    const { container } = render(<Input rounded />);
    expect(container.querySelector('.vx-input')).toHaveClass('vx-input--rounded');
  });

  it('accepts user input', async () => {
    render(<Input defaultValue="" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('forwards className', () => {
    const { container } = render(<Input className="extra" />);
    expect(container.querySelector('.vx-input')).toHaveClass('vx-input', 'extra');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
