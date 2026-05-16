import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme, createTheme, themePresets } from '../ThemeProvider';

function ThemeConsumer() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-id">{theme}</span>
      <button onClick={() => setTheme('mint')}>Set Mint</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('renders children', () => {
    render(
      <ThemeProvider>
        <p>App</p>
      </ThemeProvider>,
    );
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('provides default theme name', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-id').textContent).toBeTruthy();
  });

  it('allows setting a different theme by name', async () => {
    render(
      <ThemeProvider themes={themePresets} storageKey="test-theme-key-1">
        <ThemeConsumer />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Set Mint' }));
    expect(screen.getByTestId('theme-id').textContent).toBe('mint');
  });

  it('uses initial defaultTheme from prop', () => {
    render(
      <ThemeProvider themes={themePresets} defaultTheme="sunset" storageKey="test-theme-key-2">
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-id').textContent).toBe('sunset');
  });

  it('throws useTheme outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bad() {
      useTheme();
      return null;
    }
    expect(() => render(<Bad />)).toThrow('useTheme must be used within ThemeProvider');
    consoleSpy.mockRestore();
  });
});

describe('createTheme', () => {
  it('creates a theme object with mode and tokens', () => {
    const t = createTheme('light', { tokens: { '--vx-primary': 'blue' } });
    expect(t.mode).toBe('light');
    expect(t.tokens?.['--vx-primary']).toBe('blue');
  });
});

describe('themePresets', () => {
  it('has multiple presets', () => {
    expect(Object.keys(themePresets).length).toBeGreaterThan(3);
  });

  it('each preset has a mode', () => {
    Object.values(themePresets).forEach((preset) => {
      expect(preset.mode).toBeTruthy();
    });
  });
});
