import React from 'react';

/**
 * RankBadge — Badge showing rank/position
 * @param {number} rank - rank number or text
 * @param {string} variant - 'default' | 'featured'
 */
export const RankBadge = ({ 
  rank, 
  variant = 'default',
  style = {},
  ...props
}) => {
  const baseStyle = {
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
      className="bh-rank-badge"
      style={baseStyle}
      {...props}
    >
      {displayRank}
    </span>
  );
};

export default RankBadge;
