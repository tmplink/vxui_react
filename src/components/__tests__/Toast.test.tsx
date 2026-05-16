import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../Toast';

function ToastTrigger({ title, tone }: { title: string; tone?: 'info' | 'success' | 'warning' | 'danger' }) {
  const { push } = useToast();
  return (
    <button onClick={() => push({ title, tone: tone ?? 'info' })}>Show toast</button>
  );
}

function TestApp({ title = 'Hello', tone }: { title?: string; tone?: 'info' | 'success' | 'warning' | 'danger' }) {
  return (
    <ToastProvider>
      <ToastTrigger title={title} tone={tone} />
    </ToastProvider>
  );
}

describe('ToastProvider & useToast', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <p>Content</p>
      </ToastProvider>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('pushes a toast on button click', async () => {
    render(<TestApp title="File saved" />);
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    expect(screen.getByText('File saved')).toBeInTheDocument();
  });

  it('renders with description', async () => {
    function App() {
      const { push } = useToast();
      return (
        <button
          onClick={() => push({ title: 'Done', description: 'Your file was saved.' })}
        >
          go
        </button>
      );
    }
    render(
      <ToastProvider>
        <App />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(screen.getByText('Your file was saved.')).toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'renders toast with tone %s',
    async (tone) => {
      render(<TestApp title="T" tone={tone} />);
      await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
      const toast = screen.getByText('T').closest('.vx-toast');
      expect(toast).toHaveClass(`vx-toast--${tone}`);
    },
  );

  it('removes toast when dismiss button clicked', async () => {
    render(<TestApp title="Dismiss me" />);
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('throws when useToast used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow('useToast must be used within ToastProvider');
    consoleSpy.mockRestore();
  });
});
