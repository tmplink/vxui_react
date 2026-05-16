import { render, screen } from '@testing-library/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../Resizable';

describe('ResizablePanelGroup', () => {
  it('renders with default horizontal direction', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel>A</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(container.firstChild).toHaveClass('vx-resizable-group--horizontal');
  });

  it('renders with vertical direction', () => {
    const { container } = render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>A</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(container.firstChild).toHaveClass('vx-resizable-group--vertical');
  });

  it('forwards className', () => {
    const { container } = render(
      <ResizablePanelGroup className="custom">
        <span />
      </ResizablePanelGroup>,
    );
    expect(container.firstChild).toHaveClass('vx-resizable-group', 'custom');
  });
});

describe('ResizablePanel', () => {
  it('renders children', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel>Panel Content</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('sets data-min and data-max attributes', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={30} minSize={20} maxSize={80}>A</ResizablePanel>
      </ResizablePanelGroup>,
    );
    const panel = container.querySelector('.vx-resizable-panel');
    expect(panel).toHaveAttribute('data-min', '20');
    expect(panel).toHaveAttribute('data-max', '80');
  });

  it('applies default size as CSS custom property', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={40}>A</ResizablePanel>
      </ResizablePanelGroup>,
    );
    const panel = container.querySelector('.vx-resizable-panel') as HTMLElement;
    expect(panel.style.getPropertyValue('--vx-panel-size')).toBe('40%');
  });
});

describe('ResizableHandle', () => {
  it('renders with correct direction class', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel>A</ResizablePanel>
        <ResizableHandle direction="horizontal" />
        <ResizablePanel>B</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(container.querySelector('.vx-resizable-handle--horizontal')).toBeInTheDocument();
  });

  it('renders vertical handle', () => {
    const { container } = render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>A</ResizablePanel>
        <ResizableHandle direction="vertical" />
        <ResizablePanel>B</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(container.querySelector('.vx-resizable-handle--vertical')).toBeInTheDocument();
  });
});
