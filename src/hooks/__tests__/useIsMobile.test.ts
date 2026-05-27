import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { ViewportProvider } from '../../lib/viewport';
import React from 'react';

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(ViewportProvider, null, children);
}

describe('useIsMobile', () => {
  // Mock physical screen dimensions
  const originalScreen = window.screen;

  beforeEach(() => {
    // Mock window.screen
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: {
        width: 1024,
        height: 768,
      },
    });
  });

  afterEach(() => {
    // Restore original screen
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: originalScreen,
    });
  });

  it('returns false on desktop (physical width > 1000px)', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 1920, height: 1080 },
    });
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);
  });

  it('returns true on phone (narrow aspect ratio)', () => {
    // iPhone-like dimensions: 390x844 → aspect ratio ~0.46
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 390, height: 844 },
    });
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(true);
  });

  it('returns false on tablet (wider aspect ratio)', () => {
    // iPad-like dimensions: 768x1024 → aspect ratio ~0.75
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 768, height: 1024 },
    });
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);
  });

  it('returns false when desktop browser is resized to small viewport', () => {
    // Physical screen is large (desktop), even if innerWidth is small
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
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);
  });

  it('updates when screen dimensions change', () => {
    // Start with desktop
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 1920, height: 1080 },
    });
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);

    // Simulate connecting a phone via USB (screen dimensions don't actually change,
    // but this tests the re-render logic)
    act(() => {
      Object.defineProperty(window, 'screen', {
        writable: true,
        configurable: true,
        value: { width: 390, height: 844 },
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true);
  });
});
