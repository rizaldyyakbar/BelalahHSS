import React, { useState } from 'react';
import { Icon } from './Icons';
import Button from './Button';

/**
 * SearchBar — Reusable search component
 * @param {string} placeholder - search placeholder
 * @param {function} onSearch - search handler
 */
export const SearchBar = ({ 
  placeholder = 'Cari destinasi...',
  onSearch = () => {},
  className = '',
  style = {},
}) => {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={`bh-searchbar ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 6,
        backgroundColor: 'var(--bg)',
        borderRadius: 999,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', flex: 1 }}>
        <Icon.Search size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'inherit',
            fontSize: 14,
            color: 'var(--ink)',
          }}
        />
      </div>
      <Button
        variant="sage"
        size="md"
        onClick={handleSearch}
        style={{ padding: '12px 22px' }}
      >
        Cari
      </Button>
    </div>
  );
};

export default SearchBar;
