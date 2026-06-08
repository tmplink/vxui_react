import { Check } from 'lucide-react';
import { Fragment } from 'react';
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

function getStatus(step: StepItem, i: number, currentStep: number): StepStatus {
  if (step.status) return step.status;
  if (i < currentStep) return 'completed';
  if (i === currentStep) return 'active';
  return 'pending';
}

export function Stepper({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  const activeIndex = Math.min(Math.max(currentStep, 0), steps.length - 1);
  const active = steps[activeIndex];

  return (
    <div className={cx('vx-stepper', `vx-stepper--${orientation}`, className)}>
      <ol className="vx-stepper__track" aria-label="Steps">
        {steps.map((step, i) => {
          const status = getStatus(step, i, currentStep);
          const isLast = i === steps.length - 1;
          return (
            <Fragment key={i}>
              <li
                className={cx('vx-stepper__step', `vx-stepper__step--${status}`)}
                aria-current={status === 'active' ? 'step' : undefined}
              >
                <div className="vx-stepper__indicator" aria-hidden="true">
                  {status === 'completed' ? <Check size={14} /> : <span>{i + 1}</span>}
                </div>
              </li>
              {!isLast && (
                <div
                  className="vx-stepper__connector"
                  data-prev-status={status}
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </ol>
      <div className="vx-stepper__active-panel" aria-live="polite">
        {active && (
          <div className="vx-stepper__content">
            <span className="vx-stepper__label">{active.label}</span>
            {active.description && (
              <span className="vx-stepper__description">{active.description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
