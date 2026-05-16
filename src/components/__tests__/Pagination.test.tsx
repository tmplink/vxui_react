import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders previous and next buttons', () => {
    render(<Pagination page={3} total={100} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '上一页' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '下一页' })).toBeInTheDocument();
  });

  it('disables prev button on first page', () => {
    render(<Pagination page={1} total={100} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination page={10} total={100} pageSize={10} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
  });

  it('calls onChange with page-1 when prev clicked', async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} total={100} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '上一页' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with page+1 when next clicked', async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} total={100} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with page number when page button clicked', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} total={50} pageSize={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('marks current page as active', () => {
    render(<Pagination page={2} total={50} pageSize={10} onChange={vi.fn()} />);
    const page2 = screen.getByRole('button', { name: '2' });
    expect(page2).toHaveClass('vx-pagination__btn--active');
  });

  it('shows ellipsis for large page counts', () => {
    render(<Pagination page={5} total={200} pageSize={10} onChange={vi.fn()} />);
    const ellipsis = screen.getAllByText('…');
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
  });

  it('forwards className', () => {
    const { container } = render(
      <Pagination page={1} total={100} onChange={vi.fn()} className="extra" />,
    );
    expect(container.firstChild).toHaveClass('vx-pagination', 'extra');
  });
});
