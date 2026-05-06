import React from 'react';

/**
 * IconButton — Icon-only button component
 * @param {ReactNode} children - icon content
 * @param {string} variant - 'default' | 'light' | 'dark'
 * @param {number} size - button size in px
 */
export const IconButton = ({
  children,
  variant = 'default',
  size = 40,
  onClick = () => {},
  className = '',
  style = {},
  ...props
}) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: getBackgroundColor(variant),
    color: 'inherit',
    ...style,
  };

  return (
    <button
      className={`bh-iconbtn ${variant} ${className}`.trim()}
      style={baseStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

function getBackgroundColor(variant) {
  const colors = {
    default: 'var(--bg-soft)',
    light: 'rgba(255, 251, 243, 0.95)',
    dark: 'rgba(26, 22, 17, 0.1)',
  };
  return colors[variant] || colors.default;
}

export default IconButton;
