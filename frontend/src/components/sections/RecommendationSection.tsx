import React from 'react';
import { Icon } from '../atomic/Icons';
import DestinationCard from '../composite/DestinationCard';
import { Destination } from '../../constants/destinations';

interface RecommendationSectionProps {
  destinations?: Destination[];
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
  onCardClick?: (destinationId: number) => void;
  onHeartClick?: (destinationId: number) => void;
}

/**
 * RecommendationSection — Section menampilkan rekomendasi destinasi
 */
export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  destinations = [],
  title = 'Destinasi paling cocok untukmu',
  subtitle = 'Rekomendasi Utama',
  onViewAll = () => {},
  onCardClick = () => {},
  onHeartClick = () => {},
}) => {
  if (!destinations || destinations.length === 0) {
    return null;
  }

  const featured = destinations[0];
  const others = destinations.slice(1, 5);

  return (
    <div style={{ padding: '56px 56px 0' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
      }}>
        <div>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--clay-deep)',
            marginBottom: 8,
            fontFamily: 'var(--sans)',
          }}>
            {subtitle}
          </div>
          <h2 className="bh-serif" style={{
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--ink)',
            fontFamily: 'var(--serif)',
          }}>
            {title}
          </h2>
        </div>
        <button
          onClick={onViewAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--sage)',
            textDecoration: 'none',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: 'var(--sans)',
          }}
        >
          Lihat semua {destinations.length} destinasi <Icon.ArrowRight size={16} />
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        gap: 22,
        marginBottom: 22,
      }}>
        {/* Featured Card - span 2 rows */}
        {featured && (
          <div style={{ gridRow: 'span 2' }}>
            <DestinationCard
              destination={featured}
              featured
              onHeartClick={() => onHeartClick(featured.id)}
              onViewDetail={() => onCardClick(featured.id)}
              imageClass={featured.img || 'forest'}
            />
          </div>
        )}

        {/* Other Cards - 4 small cards */}
        {others.map((dest, idx) => (
          <DestinationCard
            key={dest.id}
            destination={{ ...dest, rank: idx + 2 }}
            onHeartClick={() => onHeartClick(dest.id)}
            onViewDetail={() => onCardClick(dest.id)}
            imageClass={dest.img || 'forest'}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
