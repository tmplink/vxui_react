import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { ViewportProvider } from '../../lib/viewport';
import React from 'react';

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(ViewportProvider, null, children);
}

describe('useIsMobile', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  it('returns false on desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);
  });

  it('returns true on phone viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(true);
  });

  it('updates when viewport changes to phone', () => {
    const { result } = renderHook(() => useIsMobile(), { wrapper });
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true);
  });
});
