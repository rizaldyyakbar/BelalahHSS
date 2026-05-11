import React, { useRef, useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  image: string;
  fallbackGradient: string;
  count?: number;
}

interface BrowseByCategoryProps {
  categories?: Category[];
}

/**
 * BrowseByCategory — Category cards with hover zoom & gradient fallbacks
 */
export const BrowseByCategory: React.FC<BrowseByCategoryProps> = ({
  categories = [
    { id: '1', name: 'Alam', image: '/assets/category-nature.jpg', fallbackGradient: 'linear-gradient(135deg, #5B8C5A 0%, #2F5E3D 50%, #1F3D2B 100%)', count: 45 },
    { id: '2', name: 'Air Terjun', image: '/assets/category-waterfall.jpg', fallbackGradient: 'linear-gradient(135deg, #4A7866 0%, #2F5C5C 60%, #1A3B3F 100%)', count: 28 },
    { id: '3', name: 'Bendungan', image: '/assets/category-dam.jpg', fallbackGradient: 'linear-gradient(135deg, #4F86A8 0%, #2A5B7C 60%, #1A3554 100%)', count: 15 },
    { id: '4', name: 'Kolam', image: '/assets/category-pool.jpg', fallbackGradient: 'linear-gradient(135deg, #6B9080 0%, #3F7062 50%, #2A5B4E 100%)', count: 12 },
  ],
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, gradient: string) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.style.background = gradient;
    }
  };

  return (
    <section ref={sectionRef} style={{ padding: '56px 56px 100px' }}>
      {/* Header */}
      <div className={`animate-on-scroll ${isVisible ? 'visible' : ''}`} style={{ marginBottom: 32, marginTop: 32 }}>
        <div className="eyebrow" style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--clay-deep)',
          marginBottom: 8,
        }}>
          Jelajahi
        </div>
        <h2 className="bh-serif" style={{
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: '-0.025em',
          margin: 0,
        }}>
          Jelajahi sesuai minatmu
        </h2>
      </div>

      {/* Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}>
        {categories.map((category, idx) => (
          <div
            key={category.id}
            className={`bh-category-card glass-liquid-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
            style={{ 
              transitionDelay: `${0.1 + idx * 0.1}s`,
              height: 180,
            }}
            onClick={() => console.log(`View ${category.name}`)}
          >
            <img
              src={category.image}
              alt={category.name}
              onError={(e) => handleImageError(e, category.fallbackGradient)}
            />
            <div className="bh-category-card__overlay">
              <h3 className="bh-category-card__name">{category.name}</h3>
              {category.count && (
                <p className="bh-category-card__count">{category.count} destinasi</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
