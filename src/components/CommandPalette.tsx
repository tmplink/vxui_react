import type { KeyboardEvent, ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';

export interface SearchEntry {
  key: string;
  title: string;
  section: string;
  description: string;
  keywords?: string[];
  icon?: ReactNode;
}

export interface CommandPaletteProps {
  entries: SearchEntry[];
  open: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  emptyText?: (query: string) => string;
  labelNavigate?: string;
  labelGo?: string;
  labelClose?: string;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="vx-cmd__mark">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function score(entry: SearchEntry, q: string): number {
  const lq = q.toLowerCase();
  const lt = entry.title.toLowerCase();
  const ls = entry.section.toLowerCase();
  const ld = entry.description.toLowerCase();
  const lk = (entry.keywords ?? []).join(' ').toLowerCase();
  if (lt === lq) return 100;
  if (lt.startsWith(lq)) return 80;
  if (lt.includes(lq)) return 60;
  if (ls.includes(lq)) return 40;
  if (lk.includes(lq)) return 35;
  if (ld.includes(lq)) return 20;
  return 0;
}

export function CommandPalette({
  entries, open, onClose, onSelect,
  placeholder = 'Search components, pages, keywords…',
  ariaLabel = 'Search',
  emptyText = (q) => `No results for "${q}"`,
  labelNavigate = 'Navigate',
  labelGo = 'Go',
  labelClose = 'Close',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = query.trim()
    ? entries
        .map((e) => ({ entry: e, s: score(e, query.trim()) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.entry)
    : entries;

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const item = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    item?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIdx]);

  const commit = useCallback(
    (key: string) => {
      onSelect(key);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[activeIdx]) commit(results[activeIdx].key);
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [results, activeIdx, commit, onClose],
  );

  if (!open) return null;

  // Group results by section
  const grouped: { section: string; items: SearchEntry[] }[] = [];
  for (const entry of results) {
    const last = grouped[grouped.length - 1];
    if (last && last.section === entry.section) {
      last.items.push(entry);
    } else {
      grouped.push({ section: entry.section, items: [entry] });
    }
  }

  return (
    <div className="vx-cmd__backdrop" onMouseDown={onClose}>
      <div
        className="vx-cmd"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="vx-cmd__search">
          <svg className="vx-cmd__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="vx-cmd__input"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button className="vx-cmd__clear" onClick={() => setQuery('')} aria-label="清除">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <kbd className="vx-cmd__esc">esc</kbd>
          )}
        </div>

        {/* Results */}
        <ul className="vx-cmd__list" ref={listRef} role="listbox">
          {results.length === 0 ? (
            <li className="vx-cmd__empty">{emptyText(query)}</li>
          ) : (
            grouped.map((group) =>
              group.items.map((entry, localIdx) => {
                const globalIdx = results.indexOf(entry);
                const isActive = globalIdx === activeIdx;
                return (
                  <li
                    key={entry.key}
                    role="option"
                    aria-selected={isActive}
                    className={`vx-cmd__item${isActive ? ' vx-cmd__item--active' : ''}`}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                    onMouseDown={() => commit(entry.key)}
                  >
                    {entry.icon ? (
                      <span className="vx-cmd__item-icon">{entry.icon}</span>
                    ) : (
                      <span className="vx-cmd__item-icon vx-cmd__item-icon--section">
                        {entry.section.slice(0, 1)}
                      </span>
                    )}
                    <span className="vx-cmd__item-body">
                      <span className="vx-cmd__item-title">
                        {highlight(entry.title, query)}
                      </span>
                      <span className="vx-cmd__item-sub">
                        {highlight(entry.section, query)}
                      </span>
                    </span>
                    {isActive && (
                      <kbd className="vx-cmd__enter">↵</kbd>
                    )}
                  </li>
                );
              }),
            )
          )}
        </ul>

        <div className="vx-cmd__footer">
          <span><kbd>↑↓</kbd> {labelNavigate}</span>
          <span><kbd>↵</kbd> {labelGo}</span>
          <span><kbd>esc</kbd> {labelClose}</span>
        </div>
      </div>
    </div>
  );
}
