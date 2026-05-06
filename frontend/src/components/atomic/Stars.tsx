import React from 'react';
import { Icon } from './Icons';

interface StarsProps {
  rating?: number;
  reviews?: number;
  size?: number;
}

/**
 * Stars — Star rating component
 */
export const Stars: React.FC<StarsProps> = ({
  rating = 5,
  reviews = 0,
  size = 14,
}) => {
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Icon.Star
        key={i}
        size={size}
        filled={i < Math.floor(rating)}
      />
    ));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {renderStars()}
      </div>
      {reviews > 0 && (
        <span style={{ fontSize: size - 1, color: 'var(--ink-3)' }}>
          {rating} ({reviews})
        </span>
      )}
    </div>
  );
};

export default Stars;
