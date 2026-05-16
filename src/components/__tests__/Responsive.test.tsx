import { render, screen, act } from '@testing-library/react';
import { Responsive } from '../Responsive';
import { ViewportProvider } from '../../lib/viewport';

function Wrap({ width, children }: { width: number; children: React.ReactNode }) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  return <ViewportProvider>{children}</ViewportProvider>;
}

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
});

describe('Responsive', () => {
  it('renders desktop content when innerWidth >= 1024', () => {
    render(
      <Wrap width={1280}>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </Wrap>,
    );
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.queryByText('Mobile')).not.toBeInTheDocument();
  });

  it('renders mobile content when innerWidth <= 767', () => {
    render(
      <Wrap width={375}>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </Wrap>,
    );
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument();
  });

  it('renders desktop content for tablet when tablet prop not provided', () => {
    render(
      <Wrap width={900}>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </Wrap>,
    );
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('renders tablet content when tablet prop provided and viewport is tablet', () => {
    render(
      <Wrap width={900}>
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
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 });
    render(
      <ViewportProvider>
        <Responsive desktop={<span>Desktop</span>} mobile={<span>Mobile</span>} />
      </ViewportProvider>,
    );
    expect(screen.getByText('Desktop')).toBeInTheDocument();

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });
});
