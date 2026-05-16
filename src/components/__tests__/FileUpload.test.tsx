import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../FileUpload';

describe('FileUpload', () => {
  it('renders a file input zone', () => {
    render(<FileUpload onFiles={vi.fn()} />);
    expect(screen.getByRole('button', { name: /upload files/i })).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<FileUpload onFiles={vi.fn()} label="Upload files" />);
    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<FileUpload onFiles={vi.fn()} hint="Max 5MB per file" />);
    expect(screen.getByText('Max 5MB per file')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(<FileUpload onFiles={vi.fn()} error="Upload failed" />);
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('is disabled when disabled prop set', () => {
    const { container } = render(<FileUpload onFiles={vi.fn()} disabled />);
    const zone = container.querySelector('.vx-file-upload__zone');
    expect(zone).toHaveClass('vx-file-upload__zone--disabled');
  });

  it('shows file list after selecting files', async () => {
    render(<FileUpload onFiles={vi.fn()} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  it('calls onFiles callback with selected files', async () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('shows error for files exceeding maxSize', async () => {
    render(<FileUpload onFiles={vi.fn()} maxSize={1} />); // 1 byte max
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'big.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(screen.getByText(/too large/i)).toBeInTheDocument();
  });

  it('allows removing a file from the list', async () => {
    render(<FileUpload onFiles={vi.fn()} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'remove-me.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    const removeBtn = screen.getByRole('button', { name: /remove remove-me.txt/i });
    await userEvent.click(removeBtn);
    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
  });

  it('accepts multiple files when multiple=true', async () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const f1 = new File(['a'], 'a.txt', { type: 'text/plain' });
    const f2 = new File(['b'], 'b.txt', { type: 'text/plain' });
    await userEvent.upload(input, [f1, f2]);
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('b.txt')).toBeInTheDocument();
  });
});
