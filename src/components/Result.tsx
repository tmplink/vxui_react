import type { ReactNode, HTMLAttributes } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, Ban, SearchX, ServerCrash } from 'lucide-react';
import { cx } from '../lib/cx';

type ResultStatus = 'success' | 'error' | 'warning' | 'info' | 'forbidden' | 'not-found' | 'server-error';

export interface ResultProps extends HTMLAttributes<HTMLDivElement> {
  /** Pre-built status with default icon and color */
  status: ResultStatus;
  /** Title text */
  title: string;
  /** Description text below the title */
  description?: string;
  /** Custom icon (overrides the default status icon) */
  icon?: ReactNode;
  /** Action area: buttons, links, etc. */
  actions?: ReactNode;
  /** Extra content area below actions */
  extra?: ReactNode;
}

const STATUS_CONFIG: Record<ResultStatus, { icon: ReactNode; className: string }> = {
  success:      { icon: <CheckCircle2 size={56} />,  className: 'vx-result--success' },
  error:        { icon: <XCircle size={56} />,       className: 'vx-result--error' },
  warning:      { icon: <AlertTriangle size={56} />, className: 'vx-result--warning' },
  info:         { icon: <Info size={56} />,          className: 'vx-result--info' },
  forbidden:    { icon: <Ban size={56} />,           className: 'vx-result--forbidden' },
  'not-found':  { icon: <SearchX size={56} />,       className: 'vx-result--not-found' },
  'server-error': { icon: <ServerCrash size={56} />, className: 'vx-result--server-error' },
};

export function Result({
  status,
  title,
  description,
  icon,
  actions,
  extra,
  className,
  ...props
}: ResultProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cx('vx-result', config.className, className)}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div className="vx-result__icon" aria-hidden="true">
        {icon ?? config.icon}
      </div>
      <h2 className="vx-result__title">{title}</h2>
      {description && <p className="vx-result__description">{description}</p>}
      {actions && <div className="vx-result__actions">{actions}</div>}
      {extra && <div className="vx-result__extra">{extra}</div>}
    </div>
  );
}
