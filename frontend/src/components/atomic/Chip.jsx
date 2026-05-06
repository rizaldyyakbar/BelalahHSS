import React from 'react';

/**
 * Chip — Small badge/tag component
 * @param {string} variant - 'default' | 'sage' | 'clay' | 'gold'
 * @param {ReactNode} children - chip content
 */
export const Chip = ({ 
  variant = 'default', 
  className = '',
  style = {},
  ...props 
}) => {
  const chipClasses = `bh-chip ${variant} ${className}`.trim();
  
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
    ...style,
  };

  return (
    <span 
      className={chipClasses}
      style={baseStyle}
      {...props}
    />
  );
};

export default Chip;
