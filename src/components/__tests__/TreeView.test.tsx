import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeView } from '../TreeView';
import type { TreeNode } from '../TreeView';

const nodes: TreeNode[] = [
  {
    id: 'root',
    label: 'Root',
    children: [
      { id: 'child1', label: 'Child 1' },
      { id: 'child2', label: 'Child 2', children: [{ id: 'grandchild', label: 'Grandchild' }] },
      { id: 'disabled', label: 'Disabled', disabled: true },
    ],
  },
  { id: 'leaf', label: 'Leaf' },
];

describe('TreeView', () => {
  it('renders top-level nodes', () => {
    render(<TreeView nodes={nodes} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Leaf')).toBeInTheDocument();
  });

  it('children not visible by default', () => {
    render(<TreeView nodes={nodes} />);
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('expands on click', async () => {
    render(<TreeView nodes={nodes} />);
    await userEvent.click(screen.getByRole('button', { name: 'Root' }));
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('collapses on second click', async () => {
    render(<TreeView nodes={nodes} />);
    await userEvent.click(screen.getByRole('button', { name: 'Root' }));
    await userEvent.click(screen.getByRole('button', { name: 'Root' }));
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('calls onSelect when node clicked', async () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={[{ id: 'leaf', label: 'Leaf' }]} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Leaf' }));
    expect(onSelect).toHaveBeenCalledWith('leaf', expect.objectContaining({ id: 'leaf' }));
  });

  it('does not call onSelect for disabled nodes', async () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={nodes} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Root' }));
    await userEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onSelect).not.toHaveBeenCalledWith('disabled', expect.anything());
  });

  it('expands node with defaultExpanded', () => {
    render(<TreeView nodes={nodes} defaultExpanded={['root']} />);
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('marks selected node via defaultSelected', () => {
    render(<TreeView nodes={[{ id: 'leaf', label: 'Leaf' }]} defaultSelected="leaf" />);
    const item = screen.getByRole('treeitem', { name: 'Leaf' });
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('handles keyboard Enter to select', async () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={[{ id: 'n', label: 'N' }]} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: 'N' });
    btn.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('n', expect.anything());
  });

  it('handles ArrowRight to expand', async () => {
    render(<TreeView nodes={nodes} />);
    const rootBtn = screen.getByRole('button', { name: 'Root' });
    rootBtn.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('handles ArrowLeft to collapse', async () => {
    render(<TreeView nodes={nodes} defaultExpanded={['root']} />);
    const rootBtn = screen.getByRole('button', { name: 'Root' });
    rootBtn.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('renders node icons', () => {
    render(<TreeView nodes={[{ id: 'n', label: 'N', icon: <span data-testid="ico" /> }]} />);
    expect(screen.getByTestId('ico')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<TreeView nodes={[]} className="extra" />);
    expect(screen.getByRole('tree')).toHaveClass('vx-tree', 'extra');
  });

  it('supports controlled expanded', () => {
    const onExpandedChange = vi.fn();
    render(
      <TreeView
        nodes={nodes}
        expanded={['root']}
        onExpandedChange={onExpandedChange}
      />,
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });
});
