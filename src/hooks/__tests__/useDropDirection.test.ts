import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useDropDirection } from '../../hooks/useDropDirection';

describe('useDropDirection', () => {
  it('returns "down" by default when not open', () => {
    const ref = { current: null as HTMLElement | null };
    const { result } = renderHook(() => useDropDirection(ref as any, false));
    expect(result.current).toBe('down');
  });

  it('returns "down" when open and there is plenty of space below', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ bottom: 100, top: 50 }),
    });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });

    const ref = { current: el };
    const { result } = renderHook(() => useDropDirection(ref as any, true));
    expect(result.current).toBe('down');
  });

  it('returns "up" when there is not enough space below but enough above', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ bottom: 750, top: 500 }),
    });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });

    const ref = { current: el };
    const { result } = renderHook(() => useDropDirection(ref as any, true, 260));
    expect(result.current).toBe('up');
  });

  it('resets to "down" when dropdown closes', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ bottom: 750, top: 500 }),
    });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });

    const ref = { current: el };
    let open = true;
    const { result, rerender } = renderHook(() => useDropDirection(ref as any, open, 260));
    expect(result.current).toBe('up');

    open = false;
    rerender();
    expect(result.current).toBe('down');
  });
});
