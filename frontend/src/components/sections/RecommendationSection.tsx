import React, { useRef, useEffect, useState } from 'react';
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
 * RecommendationSection — Staggered card grid with scroll animations
 */
export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  destinations = [],
  title = 'Destinasi paling cocok untukmu',
  subtitle = 'Rekomendasi Utama',
  onViewAll = () => { },
  onCardClick = () => { },
  onHeartClick = () => { },
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!destinations || destinations.length === 0) return null;

  const featured = destinations[0];
  const others = destinations.slice(1, 5);

  return (
    <div ref={sectionRef} style={{ padding: '56px 56px 0', }}>
      {/* Section Header */}
      <div className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
        <div className="bh-section-h">
          <div>
            <div className="eyebrow">{subtitle}</div>
            <h2 className="bh-serif">{title}</h2>
          </div>
          <button onClick={onViewAll} className="more" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            Lihat semua {destinations.length} destinasi <Icon.ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="bh-rec-grid liquid-glass-light">
        {/* Featured Card */}
        {featured && (
          <div className={`featured-col animate-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
            <DestinationCard
              destination={featured}
              featured
              onHeartClick={() => onHeartClick(featured.id)}
              onViewDetail={() => onCardClick(featured.id)}
              imageClass={featured.img || 'forest'}
            />
          </div>
        )}

        {/* Other Cards */}
        {others.map((dest, idx) => (
          <div
            key={dest.id}
            className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
          >
            <DestinationCard
              destination={{ ...dest, rank: idx + 2 }}
              onHeartClick={() => onHeartClick(dest.id)}
              onViewDetail={() => onCardClick(dest.id)}
              imageClass={dest.img || 'forest'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
