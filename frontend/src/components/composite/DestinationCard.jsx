import React from 'react';
import { Icon } from '../atomic/Icons';
import IconButton from '../atomic/IconButton';
import Stars from '../atomic/Stars';
import Chip from '../atomic/Chip';
import RankBadge from '../atomic/RankBadge';
import Button from '../atomic/Button';

/**
 * DestinationCard — Card component untuk destination item
 * @param {object} destination - destination data
 * @param {boolean} featured - show as featured/large card
 * @param {function} onHeartClick - heart button handler
 * @param {function} onViewDetail - view detail handler
 */
export const DestinationCard = ({
  destination,
  featured = false,
  onHeartClick = () => {},
  onViewDetail = () => {},
  imageClass = 'forest',
}) => {
  if (featured) {
    return (
      <div className="bh-card featured" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div className={`bh-photo ${imageClass}`} style={{ height: 360, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
            <RankBadge rank={1} variant="featured" />
          </div>
          <IconButton
            variant="light"
            size={40}
            onClick={onHeartClick}
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            <Icon.Heart size={18} />
          </IconButton>
          <span className="credit">FOTO · {destination.location?.toUpperCase()}</span>
        </div>
        
        <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <Chip variant="sage">{destination.category}</Chip>
            <Chip>{destination.region}</Chip>
          </div>
          
          <h3 className="bh-serif" style={{ fontSize: 30, fontWeight: 500, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {destination.name}
          </h3>
          
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon.Pin size={12} /> {destination.distance}
          </div>
          
          <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 14, textWrap: 'pretty', flex: 1 }}>
            {destination.description}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
            <Stars rating={destination.rating} reviews={destination.reviews} size={14} />
            <Button variant="primary" size="md" onClick={onViewDetail}>
              Lihat detail <Icon.ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Standard card
  return (
    <div className="bh-card" style={{ position: 'relative' }}>
      <div className={`bh-photo ${imageClass}`} style={{ height: 170, position: 'relative' }}>
        <RankBadge rank={destination.rank} style={{ position: 'absolute', top: 12, left: 12, zIndex: 3 }} />
        <IconButton
          variant="light"
          size={34}
          onClick={onHeartClick}
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}
        >
          <Icon.Heart size={14} />
        </IconButton>
      </div>
      
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <Chip style={{ fontSize: 11, padding: '3px 9px' }}>{destination.category}</Chip>
        </div>
        
        <div className="bh-serif" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>
          {destination.name}
        </div>
        
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon.Pin size={11} /> {destination.distance}
        </div>
        
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <Stars rating={destination.rating} reviews={destination.reviews} size={11} />
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
