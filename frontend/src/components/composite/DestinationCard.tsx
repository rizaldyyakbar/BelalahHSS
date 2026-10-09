import React from 'react';
import { Icon } from '../atomic/Icons';
import IconButton from '../atomic/IconButton';
import Stars from '../atomic/Stars';
import Chip from '../atomic/Chip';
import RankBadge from '../atomic/RankBadge';
import Button from '../atomic/Button';
import { Destination } from '../../constants/destinations';
import { getGoogleMapsRouteUrl } from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';

interface DestinationCardProps {
  destination: Destination;
  featured?: boolean;
  onHeartClick?: () => void;
  onViewDetail?: () => void;
  imageClass?: string;
}

/**
 * DestinationCard — Premium card with hover lift + image zoom
 */
export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  featured = false,
  onHeartClick = () => { },
  onViewDetail = () => { },
  imageClass = 'forest',
}) => {

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    if (target.parentElement) {
      target.parentElement.style.background = 'linear-gradient(135deg, #3F8C6E, #2A6650)';
    }
  };

  if (featured) {
    return (
      <div
        className="bh-card hover-lift"
        style={{ position: 'relative', height: '100%', overflow: 'hidden', cursor: 'pointer', borderRadius: 'var(--radius-lg)' }}
        onClick={onViewDetail}
      >
        {/* Full-bleed image */}
        <div className="bh-img-zoom" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)' }}>
          <img
            src={getImageUrl(destination.img)}
            alt={destination.name}
            loading="lazy"
            decoding="async"
            onError={handleImgError}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Gradient scrim for readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.55) 100%)',
          borderRadius: 'var(--radius-lg)',
          zIndex: 1,
        }} />

        {/* Top badges */}
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 3 }}>
          <RankBadge rank={1} variant="featured" />
        </div>
        <IconButton
          variant="light"
          size={38}
          onClick={(e) => { e.stopPropagation(); onHeartClick(); }}
          style={{ position: 'absolute', top: 14, right: 14, zIndex: 3 }}
        >
          <Icon.Heart size={16} />
        </IconButton>

        {/* Glass info panel at bottom */}
        <div
          className="bh-card-glass-panel"
          style={{
            position: 'absolute',
            bottom: 16, left: 16, right: 16,
            zIndex: 2,
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[destination.category, destination.region].filter(Boolean).map((label) => (
              <span
                key={label}
                className="bh-card-glass-pill"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 999,
                  color: 'rgba(255, 255, 255, 0.95)',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <h3 className="bh-serif" style={{ fontSize: 26, fontWeight: 500, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}>
            {destination.name}
          </h3>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon.Pin size={11} /> {destination.distance}
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Stars rating={destination.rating} reviews={destination.reviews} size={13} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <a
                href={getGoogleMapsRouteUrl(destination)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none' }}
                title="Buka Navigasi Rute di Google Maps"
              >
                <Button variant="secondary" size="md" style={{ padding: '6px 12px', fontSize: 12 }}>
                  🗺️ Rute
                </Button>
              </a>
              <Button variant="primary" size="md" onClick={(e) => { e.stopPropagation(); onViewDetail(); }}>
                Lihat detail <Icon.ArrowRight size={13} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard card — full-bleed photo with glass info overlay
  return (
    <div
      className="bh-card hover-lift"
      onClick={onViewDetail}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: 'var(--radius-lg)', minHeight: 220 }}
    >
      {/* Full-bleed image */}
      <div className="bh-img-zoom" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)' }}>
        <img
          src={getImageUrl(destination.img)}
          alt={destination.name}
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Gradient scrim */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.5) 100%)',
        borderRadius: 'var(--radius-lg)',
        zIndex: 1,
      }} />

      {/* Top badges */}
      <RankBadge rank={destination.rank || 1} style={{ position: 'absolute', top: 10, left: 10, zIndex: 3 }} />
      <IconButton
        variant="light"
        size={32}
        onClick={(e) => { e.stopPropagation(); onHeartClick(); }}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}
      >
        <Icon.Heart size={13} />
      </IconButton>

      {/* Glass info panel at bottom */}
      <div
        className="bh-card-glass-panel"
        style={{
          position: 'absolute',
          bottom: 10, left: 10, right: 10,
          zIndex: 2,
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
        }}
      >
        <span
          className="bh-card-glass-pill"
          style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 999,
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: '0.02em',
            marginBottom: 4,
          }}
        >
          {destination.category}
        </span>
        <div className="bh-serif" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2, color: '#fff' }}>
          {destination.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Icon.Pin size={10} /> {destination.distance}
        </div>
        <div style={{ marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stars rating={destination.rating} reviews={destination.reviews} size={10} />
          <a
            href={getGoogleMapsRouteUrl(destination)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: 'none' }}
            title="Buka Navigasi Rute di Google Maps"
          >
            <span
              className="bh-card-glass-pill"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#fff',
                padding: '3px 10px',
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              🗺️ Rute
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
