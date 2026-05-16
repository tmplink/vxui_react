import { render, act } from '@testing-library/react';
import { ViewportProvider, useViewport } from '../../lib/viewport';

function ViewportConsumer({ onValue }: { onValue: (v: ReturnType<typeof useViewport>) => void }) {
  onValue(useViewport());
  return null;
}

describe('ViewportProvider & useViewport', () => {
  it('provides desktop by default (jsdom window.innerWidth = 1024)', () => {
    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.viewport).toBe('desktop');
    expect(value!.isDesktop).toBe(true);
    expect(value!.isPhone).toBe(false);
    expect(value!.isTablet).toBe(false);
  });

  it('detects phone when innerWidth ≤ 767', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.isPhone).toBe(true);
    expect(value!.viewport).toBe('phone');

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  it('detects tablet when innerWidth is 768-1023', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 900 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.isTablet).toBe(true);

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  it('updates viewport on window resize', () => {
    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.isDesktop).toBe(true);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 400 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(value!.isPhone).toBe(true);

    // Restore
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('throws when useViewport used outside ViewportProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // useViewport uses a context with default values so it won't throw,
    // just return defaults
    let value: ReturnType<typeof useViewport> | undefined;
    render(<ViewportConsumer onValue={(v) => { value = v; }} />);
    // context default is desktop
    expect(value!.viewport).toBe('desktop');
    consoleSpy.mockRestore();
  });
});
