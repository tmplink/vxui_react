import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from '../Table';
import type { TableColumn } from '../Table';

interface Row {
  id: number;
  name: string;
  age: number;
}

const columns: TableColumn<Row>[] = [
  { key: 'id', header: 'ID', accessor: (r) => r.id },
  { key: 'name', header: 'Name', accessor: (r) => r.name, sortable: true },
  { key: 'age', header: 'Age', accessor: (r) => r.age, align: 'right' },
];

const data: Row[] = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 28 },
];

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders empty text when data is empty', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('renders custom emptyText', () => {
    render(<Table columns={columns} data={[]} emptyText="No records" />);
    expect(screen.getByText('No records')).toBeInTheDocument();
  });

  it('renders caption', () => {
    render(<Table columns={columns} data={data} caption="User table" />);
    expect(screen.getByText('User table')).toBeInTheDocument();
  });

  it('applies striped class', () => {
    const { container } = render(<Table columns={columns} data={data} striped />);
    expect(container.querySelector('.vx-table')).toHaveClass('vx-table--striped');
  });

  it('applies hoverable class by default', () => {
    const { container } = render(<Table columns={columns} data={data} />);
    expect(container.querySelector('.vx-table')).toHaveClass('vx-table--hoverable');
  });

  it('applies bordered class', () => {
    const { container } = render(<Table columns={columns} data={data} bordered />);
    expect(container.querySelector('.vx-table')).toHaveClass('vx-table--bordered');
  });

  it('applies size sm class', () => {
    const { container } = render(<Table columns={columns} data={data} size="sm" />);
    expect(container.querySelector('.vx-table')).toHaveClass('vx-table--sm');
  });

  it('compact prop maps to size sm', () => {
    const { container } = render(<Table columns={columns} data={data} compact />);
    expect(container.querySelector('.vx-table')).toHaveClass('vx-table--sm');
  });

  it('shows loading state', () => {
    const { container } = render(<Table columns={columns} data={data} loading />);
    expect(container.querySelector('.vx-table__body--loading')).toBeInTheDocument();
  });

  it('sorts column on header click (uncontrolled)', async () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByText('Name').closest('th')!;
    await userEvent.click(nameHeader);
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorts desc on second click', async () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByText('Name').closest('th')!;
    await userEvent.click(nameHeader);
    await userEvent.click(nameHeader);
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('clears sort on third click', async () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByText('Name').closest('th')!;
    await userEvent.click(nameHeader);
    await userEvent.click(nameHeader);
    await userEvent.click(nameHeader);
    expect(nameHeader).not.toHaveAttribute('aria-sort');
  });

  it('calls onSortChange in controlled mode', async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        sortColumn={null}
        sortDirection={null}
        onSortChange={onSortChange}
      />,
    );
    const nameHeader = screen.getByText('Name').closest('th')!;
    await userEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });

  it('hides header when headless=true', () => {
    const { container } = render(<Table columns={columns} data={data} headless />);
    expect(container.querySelector('thead')).not.toBeInTheDocument();
  });
});
