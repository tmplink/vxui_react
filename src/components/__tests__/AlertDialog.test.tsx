import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from '../AlertDialog';

describe('AlertDialog', () => {
  it('renders trigger', () => {
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Are you sure?"
        description="This cannot be undone."
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('dialog not visible initially', () => {
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Confirm"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('opens dialog on trigger click', async () => {
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Confirm"
        description="Are you sure?"
        onConfirm={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('shows title and description', async () => {
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Delete item"
        description="This will be permanent."
        onConfirm={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete item')).toBeInTheDocument();
    expect(screen.getByText('This will be permanent.')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', async () => {
    const onConfirm = vi.fn();
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Confirm"
        confirmLabel="Yes"
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', async () => {
    const onCancel = vi.fn();
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Confirm"
        cancelLabel="No"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('applies danger variant class', async () => {
    render(
      <AlertDialog
        trigger={<button>Delete</button>}
        title="Confirm"
        variant="danger"
        confirmLabel="Confirm"
        onConfirm={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmBtn).toHaveClass('vx-button--danger');
  });
});
