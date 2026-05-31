/**
 * MobileSearchContent — 移动端搜索内容
 */
import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { MobileList, MobileListSection, MobileListItem } from '../../components/mobile/MobileList';

interface SearchItem {
  key: string;
  label: string;
  section: string;
  icon?: React.ReactNode;
}

interface MobileSearchContentProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredItems: SearchItem[];
  onSelect: (key: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

function SearchBox({ value, onChange, placeholder, ariaLabel }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 14px', height: 44,
      borderRadius: 'var(--vx-radius)',
      background: 'var(--vx-bg-accent)',
    }}>
      <Search size={16} style={{ color: 'var(--vx-text-muted)', flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontSize: 15, color: 'var(--vx-text)', minWidth: 0,
        }}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} style={{
          border: 'none', background: 'none', padding: 0, cursor: 'pointer',
          color: 'var(--vx-text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0,
        }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function MobileSearchContent({
  searchQuery, setSearchQuery, filteredItems, onSelect,
  placeholder, ariaLabel,
}: MobileSearchContentProps) {
  const q = searchQuery.trim().toLowerCase();

  return (
    <div>
      <div style={{ padding: '12px 16px 0' }}>
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={placeholder}
          ariaLabel={ariaLabel}
        />
      </div>
      <MobileListSection
        title={q ? `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''}` : 'All pages'}
        style={{ padding: '16px 16px 0' }}
      >
        {filteredItems.length > 0 ? (
          <MobileList>
            {filteredItems.map(item => (
              <MobileListItem
                key={item.key}
                leading={item.icon}
                label={item.label}
                description={item.section}
                chevron
                onClick={() => { onSelect(item.key); setSearchQuery(''); }}
              />
            ))}
          </MobileList>
        ) : (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--vx-text-muted)', fontSize: 14 }}>
            No results for "{searchQuery}"
          </div>
        )}
      </MobileListSection>
    </div>
  );
}
