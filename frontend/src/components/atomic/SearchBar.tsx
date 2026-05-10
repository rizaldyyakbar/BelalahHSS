import React, { useState } from 'react';
import { Icon } from './Icons';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SearchBar — Clean input with glassmorphism support
 * Updated to match the capsule 'Go' style.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Cari destinasi...',
  onSearch = () => { },
  className = '',
  style,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      className={`bh-searchbar ${className}`}
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-1)',
        width: '100%',
        ...style
      }}
    >
      <Icon.Search size={18} style={{ color: 'var(--ink-2)', marginLeft: 8, flexShrink: 0 }} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          padding: '10px 16px',
          fontSize: 16,
          color: 'var(--ink)',
          fontWeight: 500,
        }}

      />
      <button
        type="submit"
        style={{
          background: 'var(--sage)',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          transition: 'transform var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Go
      </button>
    </form>
  );
};

export default SearchBar;
