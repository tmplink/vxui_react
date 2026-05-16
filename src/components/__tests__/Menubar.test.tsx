import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menubar } from '../Menubar';

const menus = [
  {
    label: 'File',
    items: [
      { label: 'New', onClick: vi.fn() },
      { label: 'Open', onClick: vi.fn() },
      { label: 'Save', onClick: vi.fn(), disabled: true },
    ],
  },
  {
    label: 'Edit',
    groups: [
      { label: 'Clipboard', items: [{ label: 'Copy', onClick: vi.fn() }] },
      { items: [{ label: 'Paste', onClick: vi.fn(), danger: true }] },
    ],
  },
  { label: 'View', disabled: true, items: [] },
];

describe('Menubar', () => {
  it('renders all menu labels', () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByRole('menuitem', { name: 'File' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'View' })).toBeInTheDocument();
  });

  it('menu is closed by default', () => {
    render(<Menubar menus={menus} />);
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('opens a menu on click', async () => {
    render(<Menubar menus={menus} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.getByRole('menuitem', { name: 'New' })).toBeInTheDocument();
  });

  it('closes menu when same trigger clicked again', async () => {
    render(<Menubar menus={menus} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('calls onClick when menu item clicked', async () => {
    const onClick = vi.fn();
    render(
      <Menubar
        menus={[{ label: 'File', items: [{ label: 'Action', onClick }] }]}
      />,
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', async () => {
    render(<Menubar menus={menus} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    render(
      <div>
        <Menubar menus={menus} />
        <p>Outside</p>
      </div>,
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.click(screen.getByText('Outside'));
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('disabled menu trigger cannot open', async () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByRole('menuitem', { name: 'View' })).toBeDisabled();
  });

  it('opens next menu on mouseenter when another is already open', async () => {
    render(<Menubar menus={menus} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.hover(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.queryByText('New')).not.toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('renders group labels', async () => {
    render(<Menubar menus={menus} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.getByText('Clipboard')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Menubar menus={[]} className="extra" />);
    expect(screen.getByRole('menubar')).toHaveClass('vx-menubar', 'extra');
  });
});
