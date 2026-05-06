import React, { ReactNode, HTMLAttributes } from 'react';

type ChipVariant = 'default' | 'sage' | 'clay' | 'gold';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  className?: string;
  children?: ReactNode;
}

/**
 * Chip — Small badge/tag component
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(({
  variant = 'default',
  className = '',
  style = {},
  children,
  ...props
}, ref) => {
  const chipClasses = `bh-chip ${variant} ${className}`.trim();

  const baseStyle: React.CSSProperties = {
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
      ref={ref}
      className={chipClasses}
      style={baseStyle}
      {...props}
    >
      {children}
    </span>
  );
});

Chip.displayName = 'Chip';

export default Chip;
