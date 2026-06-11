import type { ReactNode, HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type DescriptionsLayout = 'horizontal' | 'vertical';
type DescriptionsSize = 'sm' | 'md' | 'lg';

export interface DescriptionsItem {
  /** Label (left column or top row) */
  label: ReactNode;
  /** Content (right column or bottom row) */
  children: ReactNode;
  /** Span across multiple columns. Default: 1 */
  span?: number;
}

export interface DescriptionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** List of description items */
  items: DescriptionsItem[];
  /** Layout direction. Default: 'horizontal' */
  layout?: DescriptionsLayout;
  /** Number of columns per row. Default: 3 (horizontal) / 1 (vertical) */
  column?: number;
  /** Size preset controlling spacing and font-size. Default: 'md' */
  size?: DescriptionsSize;
  /** Show border around the descriptions. Default: true */
  bordered?: boolean;
  /** Title shown above the descriptions */
  title?: ReactNode;
  /** Extra content rendered next to the title */
  extra?: ReactNode;
}

const SIZE_TOKENS: Record<DescriptionsSize, { py: string; px: string; fs: string }> = {
  sm: { py: '6px', px: '10px', fs: '12px' },
  md: { py: '10px', px: '14px', fs: '13px' },
  lg: { py: '14px', px: '18px', fs: '14px' },
};

export function Descriptions({
  items,
  layout = 'horizontal',
  column,
  size = 'md',
  bordered = true,
  title,
  extra,
  className,
  ...props
}: DescriptionsProps) {
  const cols = column ?? (layout === 'vertical' ? 1 : 3);
  const tokens = SIZE_TOKENS[size];

  // Split items into rows based on column count
  const rows: DescriptionsItem[][] = [];
  let currentRow: DescriptionsItem[] = [];
  let currentSpan = 0;

  for (const item of items) {
    const span = Math.min(item.span ?? 1, cols);
    if (currentSpan + span > cols) {
      if (currentRow.length > 0) rows.push(currentRow);
      currentRow = [item];
      currentSpan = span;
    } else {
      currentRow.push(item);
      currentSpan += span;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  const cellStyle: React.CSSProperties = {
    padding: `${tokens.py} ${tokens.px}`,
    fontSize: tokens.fs,
  };

  const renderHorizontal = () => (
    <table className="vx-descriptions__table">
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="vx-descriptions__row">
            {row.map((item, ci) => {
              const span = item.span ?? 1;
              return (
                <td key={ci} colSpan={span} className="vx-descriptions__cell">
                  <dt className="vx-descriptions__label" style={cellStyle}>
                    {item.label}
                  </dt>
                  <dd className="vx-descriptions__value" style={cellStyle}>
                    {item.children}
                  </dd>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderVertical = () => (
    <div className="vx-descriptions__vertical">
      {rows.map((row, ri) => (
        <div key={ri} className="vx-descriptions__vrow">
          {row.map((item, ci) => {
            const span = item.span ?? 1;
            return (
              <div
                key={ci}
                className="vx-descriptions__vcell"
                style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
              >
                <dt className="vx-descriptions__label" style={cellStyle}>
                  {item.label}
                </dt>
                <dd className="vx-descriptions__value" style={cellStyle}>
                  {item.children}
                </dd>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cx(
        'vx-descriptions',
        `vx-descriptions--${layout}`,
        `vx-descriptions--${size}`,
        bordered && 'vx-descriptions--bordered',
        className,
      )}
      style={{ '--vx-desc-cols': cols } as React.CSSProperties}
      {...props}
    >
      {(title || extra) && (
        <div className="vx-descriptions__header">
          {title && <h3 className="vx-descriptions__title">{title}</h3>}
          {extra && <div className="vx-descriptions__extra">{extra}</div>}
        </div>
      )}
      {layout === 'horizontal' ? renderHorizontal() : renderVertical()}
    </div>
  );
}
