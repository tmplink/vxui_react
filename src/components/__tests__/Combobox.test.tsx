import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from '../Combobox';
import { Dialog } from '../Dialog';
import { Button } from '../Button';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
];

describe('Combobox', () => {
  it('renders with placeholder text', () => {
    render(<Combobox options={OPTIONS} placeholder="Pick a framework" />);
    expect(screen.getByText('Pick a framework')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<Combobox options={OPTIONS} label="Framework" />);
    expect(screen.getByText('Framework')).toBeInTheDocument();
  });

  it('dropdown is closed on initial render', () => {
    render(<Combobox options={OPTIONS} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // Regression: vx-combobox--open class must be added when dropdown is open
  it('adds vx-combobox--open class when dropdown opens', async () => {
    render(<Combobox options={OPTIONS} />);
    const wrapper = screen.getByRole('button', { name: /select/i }).closest('.vx-combobox');
    expect(wrapper).not.toHaveClass('vx-combobox--open');
    await userEvent.click(screen.getByRole('button'));
    expect(wrapper).toHaveClass('vx-combobox--open');
  });

  it('shows the dropdown list after trigger click', async () => {
    render(<Combobox options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    OPTIONS.forEach((o) => expect(screen.getByText(o.label)).toBeInTheDocument());
  });

  it('removes vx-combobox--open class and closes dropdown after selecting an option', async () => {
    render(<Combobox options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    const wrapper = trigger.closest('.vx-combobox')!;
    await userEvent.click(trigger);
    expect(wrapper).toHaveClass('vx-combobox--open');
    await userEvent.click(screen.getByText('Vue'));
    expect(wrapper).not.toHaveClass('vx-combobox--open');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange with selected value', async () => {
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Svelte'));
    expect(onChange).toHaveBeenCalledWith('svelte');
  });

  it('displays selected option label in the trigger', async () => {
    render(<Combobox options={OPTIONS} defaultValue="solid" />);
    expect(screen.getByRole('button')).toHaveTextContent('Solid');
  });

  it('filters options based on search input', async () => {
    render(<Combobox options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    const search = screen.getByRole('textbox');
    await userEvent.type(search, 'sv');
    expect(screen.getByText('Svelte')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('shows empty text when search yields no results', async () => {
    render(<Combobox options={OPTIONS} emptyText="Nothing found" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), 'zzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('shows the clear button when clearable and a value is selected', async () => {
    render(<Combobox options={OPTIONS} defaultValue="react" clearable />);
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
  });

  it('clears the selection when the clear button is clicked', async () => {
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} defaultValue="react" clearable onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('disables the trigger when disabled prop is true', () => {
    render(<Combobox options={OPTIONS} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open dropdown when disabled', async () => {
    render(<Combobox options={OPTIONS} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('skips disabled options without selecting them', async () => {
    const onChange = vi.fn();
    const opts = [...OPTIONS, { value: 'angular', label: 'Angular', disabled: true }];
    render(<Combobox options={opts} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Angular'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows hint text when provided', () => {
    render(<Combobox options={OPTIONS} hint="Choose wisely" />);
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('shows error text and applies invalid class when error is set', () => {
    render(<Combobox options={OPTIONS} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('vx-combobox__trigger--invalid');
  });

  it('hides search input when searchable=false', async () => {
    render(<Combobox options={OPTIONS} searchable={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('hides search input when searchable threshold is not exceeded', async () => {
    // options.length (4) is not > 10
    render(<Combobox options={OPTIONS} searchable={10} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows search input when searchable threshold is exceeded', async () => {
    // options.length (4) > 2
    render(<Combobox options={OPTIONS} searchable={2} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('closes the dropdown when Escape is pressed', async () => {
    render(<Combobox options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders as controlled component', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Combobox options={OPTIONS} value="react" onChange={onChange} />);
    expect(screen.getByRole('button')).toHaveTextContent('React');
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Vue'));
    expect(onChange).toHaveBeenCalledWith('vue');
    // Controlled: value stays until parent updates it
    rerender(<Combobox options={OPTIONS} value="vue" onChange={onChange} />);
    expect(screen.getByRole('button')).toHaveTextContent('Vue');
  });

  it('closes the dropdown when clicking outside', async () => {
    render(
      <div>
        <Combobox options={OPTIONS} />
        <button>Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: /select/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('adds a dialog stacking class to a portaled dropdown opened inside Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open</Button>} title="Pick a framework">
        <Combobox options={OPTIONS} placeholder="Pick framework" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Pick framework' }));

    const dropdown = document.body.querySelector('.vx-combobox__dropdown');
    expect(dropdown).toHaveClass('vx-combobox__dropdown--in-dialog');
  });

  // Regression: pressing Escape while a Combobox dropdown is open inside a Dialog
  // should close the dropdown only, leaving the Dialog open.
  it('Escape closes the dropdown without closing the parent Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open dialog</Button>} title="Pick a framework">
        <Combobox options={OPTIONS} placeholder="Pick framework" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Pick framework' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
