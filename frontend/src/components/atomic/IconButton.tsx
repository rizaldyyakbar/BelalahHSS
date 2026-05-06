import React, { ReactNode, ButtonHTMLAttributes } from 'react';

type IconButtonVariant = 'default' | 'light' | 'dark';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: IconButtonVariant;
  size?: number;
  className?: string;
}

/**
 * IconButton — Icon-only button component
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  children,
  variant = 'default',
  size = 40,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseStyle: React.CSSProperties = {
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
      ref={ref}
      className={`bh-iconbtn ${variant} ${className}`.trim()}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';

function getBackgroundColor(variant: IconButtonVariant): string {
  const colors: Record<IconButtonVariant, string> = {
    default: 'var(--bg-soft)',
    light: 'rgba(255, 251, 243, 0.95)',
    dark: 'rgba(26, 22, 17, 0.1)',
  };
  return colors[variant];
}

export default IconButton;
