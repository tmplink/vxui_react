import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '../Accordion';

const items = [
  { key: 'a', title: 'Section A', content: 'Content A' },
  { key: 'b', title: 'Section B', content: 'Content B' },
  { key: 'c', title: 'Section C', content: 'Content C', disabled: true },
];

describe('Accordion', () => {
  it('renders all section titles', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
    expect(screen.getByText('Section C')).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('reveals content when item clicked', async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole('button', { name: /Section A/i }));
    expect(screen.getByText('Content A')).toBeVisible();
  });

  it('closes open item when same header clicked', async () => {
    render(<Accordion items={items} defaultOpen={['a']} />);
    const btn = screen.getByRole('button', { name: /Section A/i });
    await userEvent.click(btn);
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('opens an item by default via defaultOpen', () => {
    render(<Accordion items={items} defaultOpen={['b']} />);
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('in single-open mode, opening one closes another', async () => {
    render(<Accordion items={items} defaultOpen={['a']} />);
    await userEvent.click(screen.getByRole('button', { name: /Section B/i }));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('in multiple mode, multiple sections can be open', async () => {
    render(<Accordion items={items} multiple />);
    await userEvent.click(screen.getByRole('button', { name: /Section A/i }));
    await userEvent.click(screen.getByRole('button', { name: /Section B/i }));
    expect(screen.getByText('Content A')).toBeVisible();
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('disabled item cannot be opened', async () => {
    render(<Accordion items={items} />);
    const btn = screen.getByRole('button', { name: /Section C/i });
    expect(btn).toBeDisabled();
  });

  it('forwards className', () => {
    const { container } = render(<Accordion items={items} className="extra" />);
    expect(container.firstChild).toHaveClass('vx-accordion', 'extra');
  });
});
