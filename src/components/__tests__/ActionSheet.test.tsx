import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionSheet, ActionSheetItem } from '../mobile/ActionSheet';

describe('ActionSheet', () => {
  it('does not render when open=false', () => {
    render(
      <ActionSheet open={false} onClose={vi.fn()}>
        <ActionSheetItem>Option A</ActionSheetItem>
      </ActionSheet>,
    );
    expect(screen.queryByText('Option A')).not.toBeInTheDocument();
  });

  it('renders when open=true', () => {
    render(
      <ActionSheet open={true} onClose={vi.fn()}>
        <ActionSheetItem>Option A</ActionSheetItem>
      </ActionSheet>,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <ActionSheet open={true} onClose={vi.fn()} title="Choose action">
        <ActionSheetItem>A</ActionSheetItem>
      </ActionSheet>,
    );
    expect(screen.getByText('Choose action')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ActionSheet open={true} onClose={vi.fn()} description="Select one of the following">
        <ActionSheetItem>A</ActionSheetItem>
      </ActionSheet>,
    );
    expect(screen.getByText('Select one of the following')).toBeInTheDocument();
  });

  it('calls onClose when Escape pressed', async () => {
    const onClose = vi.fn();
    render(
      <ActionSheet open={true} onClose={onClose}>
        <ActionSheetItem>A</ActionSheetItem>
      </ActionSheet>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders destructive item with danger style', () => {
    const { container } = render(
      <ActionSheet open={true} onClose={vi.fn()}>
        <ActionSheetItem destructive>Delete</ActionSheetItem>
      </ActionSheet>,
    );
    expect(container.querySelector('.vxm-actionsheet-item--destructive')).toBeInTheDocument();
  });

  it('calls onClick when item is clicked', async () => {
    const onClick = vi.fn();
    render(
      <ActionSheet open={true} onClose={vi.fn()}>
        <ActionSheetItem onClick={onClick}>Action</ActionSheetItem>
      </ActionSheet>,
    );
    await userEvent.click(screen.getByText('Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders item icon when provided', () => {
    render(
      <ActionSheet open={true} onClose={vi.fn()}>
        <ActionSheetItem icon={<span data-testid="ico" />}>Action</ActionSheetItem>
      </ActionSheet>,
    );
    expect(screen.getByTestId('ico')).toBeInTheDocument();
  });
});
