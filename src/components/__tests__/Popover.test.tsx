import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from '../Popover';

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('content not visible by default', () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>,
    );
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('shows content on trigger click', async () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('hides content on second trigger click', async () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    render(
      <div>
        <Popover content={<p>Content</p>}>
          <button>Open</button>
        </Popover>
        <p>Outside</p>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Content')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Outside'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders with role=dialog when open', async () => {
    render(
      <Popover content={<p>Content</p>}>
        <button>Open</button>
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'accepts placement prop %s',
    (placement) => {
      const { container } = render(
        <Popover content={<p>C</p>} placement={placement}>
          <button>O</button>
        </Popover>,
      );
      expect(container).toBeInTheDocument();
    },
  );
});
