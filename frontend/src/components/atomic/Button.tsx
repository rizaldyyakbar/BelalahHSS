import React, { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'sage' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Button — Reusable button component
 * @param variant - 'primary' | 'secondary' | 'sage' | 'ghost'
 * @param disabled - disabled state
 * @param size - 'sm' | 'md' | 'lg'
 * @param children - button content
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  disabled = false,
  size = 'md',
  className = '',
  children,
  ...props
}, ref) => {
  const baseStyle: React.CSSProperties = {
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
      ref={ref}
      className={`${variantClass} ${className}`}
      style={baseStyle}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

function getSizeStyles(size: ButtonSize): React.CSSProperties {
  const sizes: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '8px 12px', fontSize: '12px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '15px' },
  };
  return sizes[size];
}

export default Button;
