import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';

const items = [
  { title: 'Event A', description: 'First event', time: '2024-01-01', status: 'success' as const },
  { title: 'Event B', description: 'Second event', time: '2024-01-02', status: 'info' as const },
  { title: 'Event C', status: 'default' as const },
];

describe('Timeline', () => {
  it('renders an ordered list', () => {
    render(<Timeline items={items} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders all item titles', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Event A')).toBeInTheDocument();
    expect(screen.getByText('Event B')).toBeInTheDocument();
    expect(screen.getByText('Event C')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('First event')).toBeInTheDocument();
  });

  it('renders time when provided', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it.each(['default', 'success', 'warning', 'danger', 'info'] as const)(
    'applies status class %s',
    (status) => {
      const { container } = render(<Timeline items={[{ title: 'E', status }]} />);
      expect(container.querySelector(`.vx-timeline__item--${status}`)).toBeInTheDocument();
    },
  );

  it('renders custom icon', () => {
    render(<Timeline items={[{ title: 'E', icon: <span data-testid="icon" /> }]} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Timeline items={items} className="extra" />);
    expect(container.querySelector('.vx-timeline')).toHaveClass('vx-timeline', 'extra');
  });
});
