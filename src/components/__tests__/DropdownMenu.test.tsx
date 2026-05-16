import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu } from '../DropdownMenu';

const ITEMS = [
  { label: 'Edit', onClick: vi.fn() },
  { label: 'Duplicate', onClick: vi.fn() },
  { label: 'Delete', danger: true, onClick: vi.fn() },
  { label: 'Disabled action', disabled: true, onClick: vi.fn() },
];

const GROUPS = [
  { label: 'File', items: [{ label: 'Open' }, { label: 'Save' }] },
  { label: 'Edit', items: [{ label: 'Copy' }, { label: 'Paste' }] },
];

describe('DropdownMenu', () => {
  it('renders the trigger without showing the menu', () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />);
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // Regression: vx-dropdown--open class must be added when menu is open
  it('adds vx-dropdown--open class when menu opens', async () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />);
    const wrapper = screen.getByRole('button', { name: 'Actions' }).closest('.vx-dropdown')!;
    expect(wrapper).not.toHaveClass('vx-dropdown--open');
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(wrapper).toHaveClass('vx-dropdown--open');
  });

  it('shows menu items after trigger click', async () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('toggles the menu closed on second trigger click', async () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls item onClick and closes menu when an item is clicked', async () => {
    const onClick = vi.fn();
    render(<DropdownMenu trigger={<span>Actions</span>} items={[{ label: 'Edit', onClick }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not call onClick for disabled items', async () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu
        trigger={<span>Actions</span>}
        items={[{ label: 'Disabled', disabled: true, onClick }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Disabled' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies danger styling to danger items', async () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('vx-dropdown__item--danger');
  });

  it('renders item groups with labels', async () => {
    render(<DropdownMenu trigger={<span>Menu</span>} groups={GROUPS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
  });

  it('closes the menu when Escape is pressed', async () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside', async () => {
    render(
      <div>
        <DropdownMenu trigger={<span>Actions</span>} items={ITEMS} />
        <button>Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports controlled open state', async () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        trigger={<span>Actions</span>}
        items={ITEMS}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Menu stays closed because we control the state
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('applies align-right class when align="right"', async () => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={ITEMS} align="right" />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toHaveClass('vx-dropdown__menu--right');
  });
});
