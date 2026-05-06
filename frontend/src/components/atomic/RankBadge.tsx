import React, { HTMLAttributes } from 'react';

interface RankBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  rank: number | string;
  variant?: 'default' | 'featured';
}

/**
 * RankBadge — Badge showing rank/position
 */
export const RankBadge = React.forwardRef<HTMLSpanElement, RankBadgeProps>(({
  rank,
  variant = 'default',
  style = {},
  ...props
}, ref) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '13px',
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: variant === 'featured' ? 'var(--gold)' : 'var(--bg)',
    color: variant === 'featured' ? 'var(--ink)' : 'var(--clay-deep)',
    ...style,
  };

  const displayRank = typeof rank === 'number' ? `★ Peringkat ${rank}` : `#${rank}`;

  return (
    <span
      ref={ref}
      className="bh-rank-badge"
      style={baseStyle}
      {...props}
    >
      {displayRank}
    </span>
  );
});

RankBadge.displayName = 'RankBadge';

export default RankBadge;
