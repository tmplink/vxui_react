/// <reference types="@testing-library/jest-dom" />

import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { Dialog } from '../Dialog';
import { MultiSelect } from '../MultiSelect';
import { Select } from '../Select';
import { TimePicker } from '../TimePicker';

const ENV_OPTIONS = [
  { value: 'prod', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'preview', label: 'Preview' },
];

const MODULE_OPTIONS = [
  { value: 'web', label: 'Web frontend' },
  { value: 'api', label: 'API service' },
  { value: 'worker', label: 'Background jobs' },
];

function renderDialog(children: ReactNode) {
  render(
    <Dialog
      trigger={<Button>Open dialog</Button>}
      title="Deploy form"
      description="Regression coverage for form controls rendered inside a modal dialog."
    >
      {children}
    </Dialog>,
  );
}

async function openDialog() {
  await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
  return screen.getByRole('dialog', { name: 'Deploy form' });
}

describe('Dialog form controls', () => {
  it('allows selecting a Select option inside Dialog', async () => {
    renderDialog(
      <Select options={ENV_OPTIONS} placeholder="Select environment" />,
    );

    const dialog = await openDialog();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Select environment' }));
    await userEvent.click(screen.getByRole('option', { name: 'Production' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Production' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Deploy form' })).toBeInTheDocument();
  });

  it('allows selecting a MultiSelect option inside Dialog', async () => {
    renderDialog(
      <MultiSelect options={MODULE_OPTIONS} placeholder="Select scope" />,
    );

    const dialog = await openDialog();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Select scope' }));
    await userEvent.click(screen.getByRole('option', { name: 'API service' }));

    const selectedTag = dialog.querySelector('.vx-multiselect__tag');
    expect(selectedTag).toHaveTextContent('API service');
    expect(screen.getByRole('dialog', { name: 'Deploy form' })).toBeInTheDocument();
  });

  it('allows selecting a DatePicker value inside Dialog', async () => {
    const onChange = vi.fn();

    renderDialog(
      <DatePicker placeholder="Select date" onChange={onChange} />,
    );

    const dialog = await openDialog();
    const trigger = within(dialog).getByRole('button', { name: 'Select date' });

    await userEvent.click(trigger);
    const day = screen.getAllByRole('gridcell').find(
      (cell) => /^\d+$/.test(cell.textContent ?? '') && !cell.hasAttribute('disabled'),
    );

    expect(day).toBeDefined();
    await userEvent.click(day!);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(trigger).not.toHaveTextContent('Select date');
    expect(screen.getByRole('dialog', { name: 'Deploy form' })).toBeInTheDocument();
  });

  it('commits the current default time when Done is clicked inside Dialog', async () => {
    const onChange = vi.fn();

    renderDialog(
      <TimePicker placeholder="Select time" onChange={onChange} />,
    );

    const dialog = await openDialog();
    const trigger = within(dialog).getByRole('button', { name: 'Select time' });

    await userEvent.click(trigger);
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(onChange).toHaveBeenCalledWith('12:00');
    expect(trigger).toHaveTextContent('12:00');
    expect(screen.queryByRole('spinbutton', { name: /hour/i })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Deploy form' })).toBeInTheDocument();
  });
});