import '@testing-library/jest-dom';

// ResizeObserver mock
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// hasPointerCapture mock for Radix UI components
if (typeof Element.prototype.hasPointerCapture !== 'function') {
  Object.defineProperty(Element.prototype, 'hasPointerCapture', { value: () => false, writable: true, configurable: true });
}
if (typeof Element.prototype.setPointerCapture !== 'function') {
  Object.defineProperty(Element.prototype, 'setPointerCapture', { value: () => undefined, writable: true, configurable: true });
}
if (typeof Element.prototype.releasePointerCapture !== 'function') {
  Object.defineProperty(Element.prototype, 'releasePointerCapture', { value: () => undefined, writable: true, configurable: true });
}

// scrollIntoView mock for jsdom — use defineProperty to avoid issues
// with non-writable properties in newer jsdom versions.
if (typeof Element.prototype.scrollIntoView !== 'function') {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: () => undefined,
    writable: true,
    configurable: true,
  });
}

// crypto.randomUUID mock
if (!crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => Math.random().toString(36).slice(2) + Date.now().toString(36),
  });
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
