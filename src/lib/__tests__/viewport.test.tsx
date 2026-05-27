import { render, act } from '@testing-library/react';
import { ViewportProvider, useViewport } from '../../lib/viewport';

function ViewportConsumer({ onValue }: { onValue: (v: ReturnType<typeof useViewport>) => void }) {
  onValue(useViewport());
  return null;
}

describe('ViewportProvider & useViewport', () => {
  const originalScreen = window.screen;

  beforeEach(() => {
    // Mock window.screen with default desktop dimensions
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 1920, height: 1080 },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: originalScreen,
    });
  });

  it('provides desktop by default (physical screen 1920x1080)', () => {
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

  it('detects phone when physical screen is narrow (aspect ratio < 0.7)', () => {
    // iPhone-like dimensions: 390x844 → aspect ratio ~0.46
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 390, height: 844 },
    });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.isPhone).toBe(true);
    expect(value!.viewport).toBe('phone');
  });

  it('detects tablet when physical screen is wider (aspect ratio >= 0.7)', () => {
    // iPad-like dimensions: 768x1024 → aspect ratio ~0.75
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 768, height: 1024 },
    });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.isTablet).toBe(true);
    expect(value!.viewport).toBe('tablet');
  });

  it('provides screenWidth, screenHeight, and aspectRatio', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 390, height: 844 },
    });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.screenWidth).toBe(390);
    expect(value!.screenHeight).toBe(844);
    expect(value!.aspectRatio).toBeCloseTo(390 / 844, 4);
  });

  it('does NOT detect phone when desktop browser is resized (physical screen is large)', () => {
    // Physical screen is desktop-sized, even if innerWidth is small
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 2560, height: 1440 },
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    // Should still be desktop because physical screen is large
    expect(value!.isDesktop).toBe(true);
    expect(value!.isPhone).toBe(false);
  });

  it('updates viewport when screen dimensions change', () => {
    // Start with desktop
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 1920, height: 1080 },
    });

    let value: ReturnType<typeof useViewport> | undefined;
    render(
      <ViewportProvider>
        <ViewportConsumer onValue={(v) => { value = v; }} />
      </ViewportProvider>,
    );
    expect(value!.isDesktop).toBe(true);

    // Simulate screen dimension change (e.g., device connection)
    act(() => {
      Object.defineProperty(window, 'screen', {
        writable: true,
        configurable: true,
        value: { width: 390, height: 844 },
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(value!.isPhone).toBe(true);
  });

  it('throws when useViewport used outside ViewportProvider', () => {
    let value: ReturnType<typeof useViewport> | undefined;
    render(<ViewportConsumer onValue={(v) => { value = v; }} />);
    // context default is desktop
    expect(value!.viewport).toBe('desktop');
  });
});
