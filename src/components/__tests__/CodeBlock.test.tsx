import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from '../CodeBlock';

const defaultProps = {
  copyLabel: 'Copy',
  copiedLabel: 'Copied!',
  onCopy: vi.fn().mockResolvedValue(true),
};

describe('CodeBlock', () => {
  it('renders code content', () => {
    const { container } = render(<CodeBlock {...defaultProps} code="const x = 1;" language="javascript" />);
    const pre = container.querySelector('pre')!;
    expect(pre.textContent).toContain('const x');
  });

  it('renders copy button', () => {
    render(<CodeBlock {...defaultProps} code="hello" />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('shows copyLabel text', () => {
    render(<CodeBlock {...defaultProps} code="hello" copyLabel="Copy code" />);
    expect(screen.getByText('Copy code')).toBeInTheDocument();
  });

  it('calls onCopy when copy button clicked', async () => {
    const onCopy = vi.fn().mockResolvedValue(true);
    render(<CodeBlock code="hello world" copyLabel="Copy" copiedLabel="Copied!" onCopy={onCopy} />);
    await userEvent.click(screen.getByRole('button', { name: /copy/i }));
    expect(onCopy).toHaveBeenCalledWith('hello world');
  });

  it('shows copiedLabel after copying', async () => {
    const onCopy = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    render(<CodeBlock code="hello" copyLabel="Copy" copiedLabel="Copied!" onCopy={onCopy} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  it('renders without language prop', () => {
    const { container } = render(<CodeBlock {...defaultProps} code="plain text" />);
    const pre = container.querySelector('pre')!;
    expect(pre.textContent).toContain('plain text');
  });

  it('renders in a container', () => {
    const { container } = render(<CodeBlock {...defaultProps} code="x" />);
    expect(container.querySelector('.vx-code-block-wrap')).toBeInTheDocument();
  });
});

