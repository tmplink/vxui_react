import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { I18nProvider } from '../../i18n';

function WrappedSwitcher(props: React.ComponentProps<typeof LanguageSwitcher>) {
  return (
    <I18nProvider>
      <LanguageSwitcher {...props} />
    </I18nProvider>
  );
}

describe('LanguageSwitcher', () => {
  it('renders a trigger button', () => {
    render(<WrappedSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('dropdown not visible initially', () => {
    render(<WrappedSwitcher />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    render(<WrappedSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows available locales in dropdown', async () => {
    render(<WrappedSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('closes on Escape', async () => {
    render(<WrappedSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    render(
      <div>
        <WrappedSwitcher />
        <p>Outside</p>
      </div>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('switches locale on option click', async () => {
    render(<WrappedSwitcher />);
    await userEvent.click(screen.getByRole('button', { name: /switch language/i }));
    const options = screen.getAllByRole('option');
    // Click the button inside the first option
    const btn = options[0].querySelector('button')!;
    await userEvent.click(btn);
    // Dropdown should close
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('applies sidebar variant class', () => {
    const { container } = render(<WrappedSwitcher variant="sidebar" />);
    expect(container.querySelector('.vx-lang-drop')).toHaveClass('vx-lang-drop--sidebar');
  });

  it('forwards className', () => {
    const { container } = render(<WrappedSwitcher className="extra" />);
    expect(container.querySelector('.vx-lang-drop')).toHaveClass('vx-lang-drop', 'extra');
  });
});
