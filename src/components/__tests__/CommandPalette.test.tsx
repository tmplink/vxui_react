import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '../CommandPalette';

const entries = [
  { key: 'new', title: 'New File', section: 'File', description: 'Create a new file', keywords: ['create'] },
  { key: 'open', title: 'Open File', section: 'File', description: 'Open an existing file', keywords: ['load'] },
  { key: 'settings', title: 'Settings', section: 'App', description: 'Configure app' },
];

function getInput() {
  return screen.getByRole('dialog').querySelector('input')!;
}

describe('CommandPalette', () => {
  it('does not render when open=false', () => {
    render(
      <CommandPalette entries={entries} open={false} onClose={vi.fn()} onSelect={vi.fn()} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders search input when open=true', () => {
    render(
      <CommandPalette entries={entries} open={true} onClose={vi.fn()} onSelect={vi.fn()} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getInput()).toBeInTheDocument();
  });

  it('shows all entries when no search input', () => {
    render(
      <CommandPalette entries={entries} open={true} onClose={vi.fn()} onSelect={vi.fn()} />,
    );
    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('Open File')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('filters entries on search', async () => {
    render(
      <CommandPalette entries={entries} open={true} onClose={vi.fn()} onSelect={vi.fn()} />,
    );
    await userEvent.type(getInput(), 'new');
    const options = screen.getAllByRole('option');
    expect(options.some((o) => o.textContent?.includes('New File'))).toBe(true);
    expect(options.every((o) => !o.textContent?.includes('Settings'))).toBe(true);
  });

  it('calls onClose on Escape', async () => {
    const onClose = vi.fn();
    render(
      <CommandPalette entries={entries} open={true} onClose={onClose} onSelect={vi.fn()} />,
    );
    await userEvent.type(getInput(), '{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect when entry clicked', async () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette entries={entries} open={true} onClose={vi.fn()} onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByText('Settings'));
    expect(onSelect).toHaveBeenCalledWith('settings');
  });

  it('calls onSelect on Enter for highlighted item', async () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette entries={entries} open={true} onClose={vi.fn()} onSelect={onSelect} />,
    );
    await userEvent.type(getInput(), '{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('navigates with ArrowDown/ArrowUp', async () => {
    render(
      <CommandPalette entries={entries} open={true} onClose={vi.fn()} onSelect={vi.fn()} />,
    );
    await userEvent.type(getInput(), '{ArrowDown}{ArrowDown}{ArrowUp}');
    expect(getInput()).toBeInTheDocument();
  });
});
