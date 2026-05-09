import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cx } from '../lib/cx';

export type StepStatus = 'completed' | 'active' | 'pending' | 'error';

export interface StepItem {
  label: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperProps {
  steps: StepItem[];
  /** 0-based index of the current step (used when status is not set per step) */
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  return (
    <ol
      className={cx('vx-stepper', `vx-stepper--${orientation}`, className)}
      aria-label="Steps"
    >
      {steps.map((step, i) => {
        const status =
          step.status ??
          (i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending');
        return (
          <li key={i} className={cx('vx-stepper__step', `vx-stepper__step--${status}`)}>
            <div className="vx-stepper__indicator" aria-hidden="true">
              {status === 'completed' ? <Check size={14} /> : <span>{i + 1}</span>}
            </div>
            <div className="vx-stepper__content">
              <span className="vx-stepper__label">{step.label}</span>
              {step.description && (
                <span className="vx-stepper__description">{step.description}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="vx-stepper__connector" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
