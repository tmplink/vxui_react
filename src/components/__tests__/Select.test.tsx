/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../Select';
import { Dialog } from '../Dialog';
import { Button } from '../Button';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
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

describe('Select', () => {
  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('renders with placeholder text', () => {
    render(<Select options={OPTIONS} placeholder="Pick a framework" />);
    expect(screen.getByText('Pick a framework')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<Select options={OPTIONS} label="Framework" />);
    expect(screen.getByText('Framework')).toBeInTheDocument();
  });

  it('dropdown is closed on initial render', () => {
    render(<Select options={OPTIONS} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('adds vx-select--open class when dropdown opens', async () => {
    render(<Select options={OPTIONS} />);
    const wrapper = screen.getByRole('button', { name: /select/i }).closest('.vx-select');
    expect(wrapper).not.toHaveClass('vx-select--open');
    await userEvent.click(screen.getByRole('button'));
    expect(wrapper).toHaveClass('vx-select--open');
  });

  it('shows the dropdown list after trigger click', async () => {
    render(<Select options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    OPTIONS.forEach((option) => expect(screen.getByText(option.label)).toBeInTheDocument());
  });

  it('removes vx-select--open class and closes dropdown after selecting an option', async () => {
    render(<Select options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    const wrapper = trigger.closest('.vx-select')!;
    await userEvent.click(trigger);
    expect(wrapper).toHaveClass('vx-select--open');
    await userEvent.click(screen.getByText('Vue'));
    expect(wrapper).not.toHaveClass('vx-select--open');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange with selected value', async () => {
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Svelte'));
    expect(onChange).toHaveBeenCalledWith('svelte');
  });

  it('displays selected option label in the trigger', () => {
    render(<Select options={OPTIONS} defaultValue="solid" />);
    expect(screen.getByRole('button')).toHaveTextContent('Solid');
  });

  it('filters options based on search input', async () => {
    render(<Select options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    const search = screen.getByRole('textbox');
    await userEvent.type(search, 'sv');
    expect(screen.getByText('Svelte')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('shows empty text when search yields no results', async () => {
    render(<Select options={OPTIONS} emptyText="Nothing found" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), 'zzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('shows the clear button when clearable and a value is selected', () => {
    render(<Select options={OPTIONS} defaultValue="react" clearable />);
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
  });

  it('clears the selection when the clear button is clicked', async () => {
    const onChange = vi.fn();
    render(<Select options={OPTIONS} defaultValue="react" clearable onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('disables the trigger when disabled prop is true', () => {
    render(<Select options={OPTIONS} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open dropdown when disabled', async () => {
    render(<Select options={OPTIONS} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('skips disabled options without selecting them', async () => {
    const onChange = vi.fn();
    const options = [...OPTIONS, { value: 'angular', label: 'Angular', disabled: true }];
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Angular'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows hint text when provided', () => {
    render(<Select options={OPTIONS} hint="Choose wisely" />);
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('shows error text and applies invalid class when error is set', () => {
    render(<Select options={OPTIONS} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('vx-select__trigger--invalid');
  });

  it('hides search input when searchable=false', async () => {
    render(<Select options={OPTIONS} searchable={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('hides search input when searchable threshold is not exceeded', async () => {
    render(<Select options={OPTIONS} searchable={10} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows search input when searchable threshold is exceeded', async () => {
    render(<Select options={OPTIONS} searchable={2} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('closes the dropdown when Escape is pressed', async () => {
    render(<Select options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders as controlled component', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Select options={OPTIONS} value="react" onChange={onChange} />);
    expect(screen.getByRole('button')).toHaveTextContent('React');
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Vue'));
    expect(onChange).toHaveBeenCalledWith('vue');
    rerender(<Select options={OPTIONS} value="vue" onChange={onChange} />);
    expect(screen.getByRole('button')).toHaveTextContent('Vue');
  });

  it('closes the dropdown when clicking outside', async () => {
    render(
      <div>
        <Select options={OPTIONS} />
        <button>Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: /select/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('adds a dialog stacking class to a dropdown opened inside Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open</Button>} title="Pick a framework" description="Choose a framework from the list.">
        <Select options={OPTIONS} placeholder="Pick framework" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Pick framework' }));

    const dropdown = document.body.querySelector('.vx-select__dropdown');
    expect(dropdown).toHaveClass('vx-select__dropdown--in-dialog');
  });

  it('portals the dropdown above Dialog even in a narrow viewport', async () => {
    mockMaxWidth640(true);

    render(
      <Dialog trigger={<Button>Open</Button>} title="Pick a framework">
        <Select options={OPTIONS} placeholder="Pick framework" />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Pick framework' }));

    const dropdown = document.body.querySelector('.vx-select__dropdown');
    expect(dropdown).toHaveClass('vx-select__dropdown--in-dialog');
    // The dropdown is portaled into the dialog content so it renders on top;
    // verify it exists in the DOM (class check above already does).
    expect(dropdown).toBeInTheDocument();
  });

  it('Escape closes the dropdown without closing the parent Dialog', async () => {
    render(
      <Dialog
        trigger={<Button>Open dialog</Button>}
        title="Pick a framework"
        description="Verify the select closes without dismissing the dialog."
      >
        <Select options={OPTIONS} placeholder="Pick framework" />
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

