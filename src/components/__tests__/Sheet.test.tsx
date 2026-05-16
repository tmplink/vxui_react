import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sheet } from '../Sheet';

describe('Sheet', () => {
  it('renders trigger', () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} title="Settings">
        <p>Sheet content</p>
      </Sheet>,
    );
    expect(screen.getByRole('button', { name: 'Open sheet' })).toBeInTheDocument();
  });

  it('sheet not visible initially', () => {
    render(
      <Sheet trigger={<button>Open</button>} title="Settings">
        <p>Content</p>
      </Sheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    render(
      <Sheet trigger={<button>Open</button>} title="Settings">
        <p>Content</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows title', async () => {
    render(
      <Sheet trigger={<button>Open</button>} title="Settings Panel">
        <p>Content</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Settings Panel')).toBeInTheDocument();
  });

  it('shows description when provided', async () => {
    render(
      <Sheet
        trigger={<button>Open</button>}
        title="Settings"
        description="Configure your preferences"
      >
        <p>Content</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Configure your preferences')).toBeInTheDocument();
  });

  it('shows children content', async () => {
    render(
      <Sheet trigger={<button>Open</button>} title="Settings">
        <p>Sheet body</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
  });

  it('shows footer when provided', async () => {
    render(
      <Sheet
        trigger={<button>Open</button>}
        title="Settings"
        footer={<button>Save</button>}
      >
        <p>Content</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('closes on X button click', async () => {
    render(
      <Sheet trigger={<button>Open</button>} title="Settings">
        <p>Content</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)('applies side %s', async (side) => {
    render(
      <Sheet trigger={<button>Open</button>} title="T" side={side}>
        <p>C</p>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveClass(`vx-sheet--${side}`);
  });
});
