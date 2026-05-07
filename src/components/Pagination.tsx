import { cx } from '../lib/cx';

export interface PaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  siblingCount?: number;
  onChange: (page: number) => void;
  className?: string;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({ page, total, pageSize = 10, siblingCount = 1, onChange, className }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const pages = (() => {
    const totalShown = siblingCount * 2 + 5; // siblings + current + 2 boundaries + 2 ellipses
    if (pageCount <= totalShown) return range(1, pageCount);

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, pageCount);

    const showLeftEllipsis = leftSibling > 3;
    const showRightEllipsis = rightSibling < pageCount - 2;

    if (!showLeftEllipsis && showRightEllipsis) {
      return [...range(1, 3 + siblingCount * 2), '…', pageCount];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
      return [1, '…', ...range(pageCount - (2 + siblingCount * 2), pageCount)];
    }
    return [1, '…', ...range(leftSibling, rightSibling), '…', pageCount];
  })();

  return (
    <nav role="navigation" aria-label="Pagination" className={cx('vx-pagination', className)}>
      <button
        type="button"
        className="vx-pagination__btn vx-pagination__btn--prev"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="上一页"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="vx-pagination__ellipsis" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            className={cx('vx-pagination__btn', p === page && 'vx-pagination__btn--active')}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className="vx-pagination__btn vx-pagination__btn--next"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        aria-label="下一页"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 11l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
