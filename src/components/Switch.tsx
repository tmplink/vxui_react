import type { ComponentPropsWithoutRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cx } from '../lib/cx';

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label: string;
  description?: string;
}

export function Switch({ className, label, description, ...props }: SwitchProps) {
  return (
    <label className="vx-switch">
      <span className="vx-switch__copy">
        <span className="vx-switch__label">{label}</span>
        {description ? <span className="vx-switch__description">{description}</span> : null}
      </span>
      <SwitchPrimitive.Root className={cx('vx-switch__control', className)} {...props}>
        <SwitchPrimitive.Thumb className="vx-switch__thumb" />
      </SwitchPrimitive.Root>
    </label>
  );
}
