import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from '../MultiSelect';
import { Dialog } from '../Dialog';
import { Button } from '../Button';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
];

const originalMatchMedia = window.matchMedia;

function mockMaxWidth640(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: query === '(max-width: 640px)' ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('MultiSelect', () => {
  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('renders with placeholder text', () => {
    render(<MultiSelect options={OPTIONS} placeholder="Pick frameworks" />);
    expect(screen.getByText('Pick frameworks')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<MultiSelect options={OPTIONS} label="Frameworks" />);
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
  });

  it('dropdown is closed on initial render', () => {
    render(<MultiSelect options={OPTIONS} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // Regression: vx-multiselect--open class must be added when dropdown is open
  it('adds vx-multiselect--open class when dropdown opens', async () => {
    render(<MultiSelect options={OPTIONS} />);
    const wrapper = document.querySelector('.vx-multiselect')!;
    expect(wrapper).not.toHaveClass('vx-multiselect--open');
    await userEvent.click(screen.getByRole('button'));
    expect(wrapper).toHaveClass('vx-multiselect--open');
  });

  it('shows all options after trigger click', async () => {
    render(<MultiSelect options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    OPTIONS.forEach((o) => expect(screen.getByText(o.label)).toBeInTheDocument());
  });

  it('removes vx-multiselect--open class after closing', async () => {
    render(<MultiSelect options={OPTIONS} />);
    const wrapper = document.querySelector('.vx-multiselect')!;
    await userEvent.click(screen.getByRole('button'));
    expect(wrapper).toHaveClass('vx-multiselect--open');
    await userEvent.keyboard('{Escape}');
    expect(wrapper).not.toHaveClass('vx-multiselect--open');
  });

  it('selects an option and calls onChange', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={OPTIONS} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('React'));
    expect(onChange).toHaveBeenCalledWith(['react']);
  });

  it('can select multiple options', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={OPTIONS} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('React'));
    await userEvent.click(screen.getByText('Vue'));
    expect(onChange).toHaveBeenLastCalledWith(['react', 'vue']);
  });

  it('deselects an already-selected option', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={OPTIONS} defaultValue={['react']} onChange={onChange} />);
    const trigger = document.querySelector<HTMLButtonElement>('.vx-multiselect__trigger')!;
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'React' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('shows selected option as a tag', () => {
    render(<MultiSelect options={OPTIONS} defaultValue={['react']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('shows "+N more" badge when maxDisplay is exceeded', () => {
    render(<MultiSelect options={OPTIONS} defaultValue={['react', 'vue', 'svelte']} maxDisplay={2} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('shows the clear button when clearable and values are selected', () => {
    render(<MultiSelect options={OPTIONS} defaultValue={['react']} clearable />);
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('clears all selections when clear button is clicked', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={OPTIONS} defaultValue={['react', 'vue']} clearable onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('filters options based on search input', async () => {
    render(<MultiSelect options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), 'sv');
    expect(screen.getByText('Svelte')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('shows empty text when search yields no results', async () => {
    render(<MultiSelect options={OPTIONS} emptyText="No match" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), 'zzz');
    expect(screen.getByText('No match')).toBeInTheDocument();
  });

  it('disables the trigger when disabled prop is true', () => {
    render(<MultiSelect options={OPTIONS} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not select disabled options', async () => {
    const onChange = vi.fn();
    const opts = [...OPTIONS, { value: 'ember', label: 'Ember', disabled: true }];
    render(<MultiSelect options={opts} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Ember'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows hint text when provided', () => {
    render(<MultiSelect options={OPTIONS} hint="Select all that apply" />);
    expect(screen.getByText('Select all that apply')).toBeInTheDocument();
  });

  it('shows error text when error is set', () => {
    render(<MultiSelect options={OPTIONS} error="At least one required" />);
    expect(screen.getByText('At least one required')).toBeInTheDocument();
  });

  it('closes when clicking outside', async () => {
    render(
      <div>
        <MultiSelect options={OPTIONS} />
        <button>Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: /select/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders as controlled component', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<MultiSelect options={OPTIONS} value={['react']} onChange={onChange} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    const trigger = document.querySelector<HTMLButtonElement>('.vx-multiselect__trigger')!;
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'Vue' }));
    expect(onChange).toHaveBeenCalledWith(['react', 'vue']);
    // Close dropdown before rerender to avoid duplicate text
    await userEvent.keyboard('{Escape}');
    // Value stays until parent updates it
    rerender(<MultiSelect options={OPTIONS} value={['react', 'vue']} onChange={onChange} />);
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('adds a dialog stacking class to a portaled dropdown opened inside Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open</Button>} title="Pick frameworks">
        <MultiSelect options={OPTIONS} placeholder="Pick frameworks" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Pick frameworks' }));

    const dropdown = document.body.querySelector('.vx-multiselect__dropdown');
    expect(dropdown).toHaveClass('vx-multiselect__dropdown--in-dialog');
  });

  it('renders inline (bottom sheet) instead of portal on narrow viewport', async () => {
    mockMaxWidth640(true);

    render(
      <Dialog trigger={<Button>Open</Button>} title="Pick frameworks">
        <MultiSelect options={OPTIONS} placeholder="Pick frameworks" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Pick frameworks' }));

    // On narrow viewports, the dropdown is rendered inline (not portaled)
    // so it does NOT get the --in-dialog class; CSS media queries handle
    // the bottom sheet styling instead.
    const dropdown = document.body.querySelector('.vx-multiselect__dropdown');
    expect(dropdown).not.toHaveClass('vx-multiselect__dropdown--in-dialog');
    expect(dropdown).toBeInTheDocument();
  });

  // Regression: pressing Escape while a MultiSelect dropdown is open inside a Dialog
  // should close the dropdown only, leaving the Dialog open.
  it('Escape closes the dropdown without closing the parent Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open dialog</Button>} title="Pick frameworks">
        <MultiSelect options={OPTIONS} placeholder="Pick frameworks" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Pick frameworks' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
