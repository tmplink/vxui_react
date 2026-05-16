import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileList, MobileListSection, MobileListItem } from '../mobile/MobileList';

describe('MobileList', () => {
  it('renders as a list element', () => {
    render(<MobileList />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<MobileList className="custom" />);
    expect(screen.getByRole('list')).toHaveClass('vxm-list', 'custom');
  });

  it('renders children', () => {
    render(
      <MobileList>
        <li>Item</li>
      </MobileList>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});

describe('MobileListSection', () => {
  it('renders title', () => {
    render(<MobileListSection title="Section A" />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MobileListSection>
        <span>Content</span>
      </MobileListSection>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('MobileListItem', () => {
  it('renders label', () => {
    render(<MobileListItem label="Settings" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<MobileListItem label="Profile" description="View your profile" />);
    expect(screen.getByText('View your profile')).toBeInTheDocument();
  });

  it('renders leading content', () => {
    render(<MobileListItem label="A" leading={<span data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders trailing content', () => {
    render(<MobileListItem label="A" trailing={<span data-testid="trail" />} />);
    expect(screen.getByTestId('trail')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<MobileListItem label="Clickable" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<MobileListItem label="Disabled" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies destructive class when destructive=true', () => {
    const { container } = render(<MobileListItem label="Delete" destructive />);
    expect(container.querySelector('.vxm-list-item--destructive')).toBeInTheDocument();
  });

  it('renders chevron icon when chevron=true', () => {
    const { container } = render(<MobileListItem label="Next" chevron />);
    // ChevronRight is rendered as an svg
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
