import React from 'react';

/**
 * Button — Reusable button component
 * @param {string} variant - 'primary' | 'secondary' | 'sage' | 'ghost'
 * @param {boolean} disabled - disabled state
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {ReactNode} children - button content
 * @param {function} onClick - click handler
 */
export const Button = ({ 
  variant = 'primary', 
  disabled = false, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 500,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    opacity: disabled ? 0.6 : 1,
    ...getSizeStyles(size),
  };

  const variantClass = `bh-btn ${variant}`;

  return (
    <button 
      className={`${variantClass} ${className}`}
      style={baseStyle}
      disabled={disabled}
      {...props}
    />
  );
};

function getSizeStyles(size) {
  const sizes = {
    sm: { padding: '8px 12px', fontSize: '12px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '15px' },
  };
  return sizes[size] || sizes.md;
}

export default Button;
