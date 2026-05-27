import { render, screen, act } from '@testing-library/react';
import { Responsive } from '../Responsive';
import { ViewportProvider } from '../../lib/viewport';

function Wrap({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  // Mock physical screen dimensions
  Object.defineProperty(window, 'screen', {
    writable: true,
    configurable: true,
    value: { width, height },
  });
  return <ViewportProvider>{children}</ViewportProvider>;
}

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  Object.defineProperty(window, 'screen', {
    writable: true,
    configurable: true,
    value: { width: 1920, height: 1080 },
  });
});

describe('Responsive', () => {
  it('renders desktop content when physical screen is large', () => {
    render(
      <Wrap width={1920} height={1080}>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </Wrap>,
    );
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.queryByText('Mobile')).not.toBeInTheDocument();
  });

  it('renders mobile content when physical screen is narrow (phone aspect ratio)', () => {
    // 390x844 → aspect ratio ~0.46 (phone-like)
    render(
      <Wrap width={390} height={844}>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </Wrap>,
    );
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument();
  });

  it('renders desktop content for tablet when tablet prop not provided', () => {
    // 768x1024 → aspect ratio ~0.75 (tablet-like, not phone)
    render(
      <Wrap width={768} height={1024}>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </Wrap>,
    );
    // Tablet is treated as desktop when tablet prop is not provided
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('renders tablet content when tablet prop provided and viewport is tablet', () => {
    render(
      <Wrap width={768} height={1024}>
        <Responsive
          desktop={<span>Desktop</span>}
          tablet={<span>Tablet</span>}
          mobile={<span>Mobile</span>}
        />
      </Wrap>,
    );
    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument();
  });

  it('updates when viewport changes via resize event', () => {
    // Start with desktop
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 1920, height: 1080 },
    });
    render(
      <ViewportProvider>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </ViewportProvider>,
    );
    expect(screen.getByText('Desktop')).toBeInTheDocument();

    // Simulate connecting a phone-like device
    act(() => {
      Object.defineProperty(window, 'screen', {
        writable: true,
        configurable: true,
        value: { width: 390, height: 844 },
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });
});
