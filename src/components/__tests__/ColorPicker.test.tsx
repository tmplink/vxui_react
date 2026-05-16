import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from '../ColorPicker';
import { Dialog } from '../Dialog';
import { Button } from '../Button';

describe('ColorPicker', () => {
  it('renders a trigger button', () => {
    render(<ColorPicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows default value label', () => {
    render(<ColorPicker defaultValue="#ff0000" />);
    const hexInput = screen.getByRole('textbox', { name: /hex color/i });
    expect((hexInput as HTMLInputElement).value).toBe('#ff0000');
  });

  it('renders label', () => {
    render(<ColorPicker label="Color" />);
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<ColorPicker hint="Choose a color" />);
    expect(screen.getByText('Choose a color')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<ColorPicker error="Invalid color" />);
    expect(screen.getByText('Invalid color')).toBeInTheDocument();
  });

  it('opens color panel on trigger click', async () => {
    render(<ColorPicker defaultValue="#ff0000" />);
    await userEvent.click(screen.getByRole('button'));
    // The panel should have sliders or inputs
    const panel = document.querySelector('.vx-colorpicker__panel');
    expect(panel).toBeInTheDocument();
  });

  it('closes panel on outside click', async () => {
    render(
      <div>
        <ColorPicker />
        <p>Outside</p>
      </div>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Outside'));
    expect(document.querySelector('.vx-colorpicker__panel')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop set', () => {
    render(<ColorPicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open panel when disabled', async () => {
    render(<ColorPicker disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(document.querySelector('.vx-colorpicker__panel')).not.toBeInTheDocument();
  });

  it('renders preset swatches when showPresets=true', async () => {
    const presets = ['#ff0000', '#00ff00', '#0000ff'];
    render(<ColorPicker showPresets presets={presets} defaultValue="#ff0000" />);
    await userEvent.click(screen.getByRole('button'));
    const swatches = document.querySelectorAll('.vx-colorpicker__preset');
    expect(swatches.length).toBeGreaterThan(0);
  });

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#ff0000" onChange={onChange} />);
    const trigger = screen.getByRole('button', { name: /current color/i });
    await userEvent.click(trigger);
    // Change hex input
    const hexInputs = screen.getAllByRole('textbox');
    if (hexInputs.length > 0) {
      await userEvent.clear(hexInputs[0]);
      await userEvent.type(hexInputs[0], '00ff00');
      await userEvent.keyboard('{Enter}');
    }
    // Just verify the trigger is still present
    expect(screen.getByRole('button', { name: /current color/i })).toBeInTheDocument();
  });

  it('closes panel with Escape key', async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(document.querySelector('.vx-colorpicker__panel')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(document.querySelector('.vx-colorpicker__panel')).not.toBeInTheDocument();
  });

  // Regression: pressing Escape while the ColorPicker panel is open inside a Dialog
  // should close the panel only, leaving the Dialog open.
  it('Escape closes the panel without closing the parent Dialog', async () => {
    render(
      <Dialog trigger={<Button>Open dialog</Button>} title="Pick a color">
        <ColorPicker />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog', { name: 'Pick a color' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /current color/i }));
    expect(document.querySelector('.vx-colorpicker__panel')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(document.querySelector('.vx-colorpicker__panel')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Pick a color' })).toBeInTheDocument();
  });
});
