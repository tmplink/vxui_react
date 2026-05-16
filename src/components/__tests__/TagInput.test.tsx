import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from '../TagInput';

describe('TagInput', () => {
  it('renders an input', () => {
    render(<TagInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<TagInput label="Tags" />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('renders initial tags from defaultValue', () => {
    render(<TagInput defaultValue={['react', 'typescript']} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('adds a tag on Enter', async () => {
    render(<TagInput />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'newtag');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('newtag')).toBeInTheDocument();
  });

  it('adds a tag on comma', async () => {
    render(<TagInput confirmKeys={['Enter', ',']} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'hello,');
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('removes tag when remove button clicked', async () => {
    render(<TagInput defaultValue={['react']} />);
    const removeBtn = screen.getByRole('button', { name: /remove tag react/i });
    await userEvent.click(removeBtn);
    expect(screen.queryByText('react')).not.toBeInTheDocument();
  });

  it('removes last tag on Backspace when input empty', async () => {
    render(<TagInput defaultValue={['react', 'vue']} />);
    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    expect(screen.queryByText('vue')).not.toBeInTheDocument();
  });

  it('respects maxTags limit', async () => {
    render(<TagInput maxTags={2} defaultValue={['a', 'b']} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'c');
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByText('c')).not.toBeInTheDocument();
  });

  it('does not add duplicate tags', async () => {
    render(<TagInput defaultValue={['react']} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'react');
    await userEvent.keyboard('{Enter}');
    const tags = screen.getAllByText('react');
    expect(tags).toHaveLength(1);
  });

  it('calls onChange when tags change', async () => {
    const onChange = vi.fn();
    render(<TagInput onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'mytag');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(['mytag']);
  });

  it('renders error text', () => {
    render(<TagInput error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('is disabled when disabled prop set', () => {
    render(<TagInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
