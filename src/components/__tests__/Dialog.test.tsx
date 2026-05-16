import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../Dialog';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';

const defaultProps = {
  trigger: <Button>Open</Button>,
  title: 'Test dialog',
  children: <p>Dialog body content</p>,
};

describe('Dialog', () => {
  it('renders the trigger without opening the dialog', () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens when the trigger is clicked', async () => {
    render(<Dialog {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays title and children when open', async () => {
    render(<Dialog {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Test dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog body content')).toBeInTheDocument();
  });

  it('displays the description when provided', async () => {
    render(<Dialog {...defaultProps} description="A helpful description" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('A helpful description')).toBeInTheDocument();
  });

  it('renders the footer when provided', async () => {
    render(<Dialog {...defaultProps} footer={<Button>Confirm</Button>} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    render(<Dialog {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render close button when closable=false', async () => {
    render(<Dialog {...defaultProps} closable={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
  });

  it('applies scrollable class when scrollable=true', async () => {
    render(<Dialog {...defaultProps} scrollable />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveClass('vx-dialog__content--scrollable');
  });

  it('does not apply scrollable class by default', async () => {
    render(<Dialog {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).not.toHaveClass('vx-dialog__content--scrollable');
  });

  it.each([
    ['sm', 'vx-dialog__content--sm'],
    ['lg', 'vx-dialog__content--lg'],
    ['xl', 'vx-dialog__content--xl'],
    ['full', 'vx-dialog__content--full'],
  ] as const)('applies size class for size="%s"', async (size, expectedClass) => {
    render(<Dialog {...defaultProps} size={size} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveClass(expectedClass);
  });

  it('does not apply a size modifier class for the default md size', async () => {
    render(<Dialog {...defaultProps} size="md" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).not.toHaveClass('vx-dialog__content--md');
  });

  it('applies padding variant classes', async () => {
    render(<Dialog {...defaultProps} padding="lg" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveClass('vx-dialog__content--pad-lg');
  });

  it('applies a custom className', async () => {
    render(<Dialog {...defaultProps} className="my-custom" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveClass('my-custom');
  });

  it('closes on Escape key when no child overlay is open', async () => {
    render(<Dialog {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // Regression: Dialog must NOT close on Escape when an inline child panel is open.
  it('does not close on Escape when a child DatePicker calendar is open', async () => {
    render(
      <Dialog trigger={<Button>Open</Button>} title="Pick a date">
        <DatePicker />
      </Dialog>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog', { name: 'Pick a date' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /select date/i }));
    expect(screen.getByRole('grid')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Pick a date' })).toBeInTheDocument();
  });
});
