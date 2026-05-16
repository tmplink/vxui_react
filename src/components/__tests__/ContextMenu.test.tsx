import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from '../ContextMenu';

describe('ContextMenu', () => {
  const groups = [
    {
      items: [
        { key: 'copy', label: 'Copy', onClick: vi.fn() },
        { key: 'paste', label: 'Paste', onClick: vi.fn() },
        { key: 'delete', label: 'Delete', onClick: vi.fn(), danger: true },
        { key: 'disabled', label: 'Disabled', onClick: vi.fn(), disabled: true },
      ],
    },
  ];

  it('renders trigger element', () => {
    render(
      <ContextMenu groups={groups}>
        <div>Right click me</div>
      </ContextMenu>,
    );
    expect(screen.getByText('Right click me')).toBeInTheDocument();
  });

  it('menu not visible initially', () => {
    render(
      <ContextMenu groups={groups}>
        <div>Right click</div>
      </ContextMenu>,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('shows menu on context menu event', async () => {
    render(
      <ContextMenu groups={groups}>
        <div>Right click</div>
      </ContextMenu>,
    );
    await userEvent.pointer({
      target: screen.getByText('Right click'),
      keys: '[MouseRight]',
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('shows all menu items', async () => {
    render(
      <ContextMenu groups={groups}>
        <div>Right click</div>
      </ContextMenu>,
    );
    await userEvent.pointer({
      target: screen.getByText('Right click'),
      keys: '[MouseRight]',
    });
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
  });

  it('calls onClick when menu item clicked', async () => {
    const onClick = vi.fn();
    render(
      <ContextMenu groups={[{ items: [{ key: 'a', label: 'Action', onClick }] }]}>
        <div>Right click</div>
      </ContextMenu>,
    );
    await userEvent.pointer({
      target: screen.getByText('Right click'),
      keys: '[MouseRight]',
    });
    await userEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('closes menu on Escape', async () => {
    render(
      <ContextMenu groups={groups}>
        <div>Right click</div>
      </ContextMenu>,
    );
    await userEvent.pointer({
      target: screen.getByText('Right click'),
      keys: '[MouseRight]',
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});
