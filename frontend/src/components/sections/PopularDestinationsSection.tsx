import React from 'react';
import { Icon } from '../atomic/Icons';
import { Destination } from '../../constants/destinations';

interface PopularDestinationsSectionProps {
  destinations: Destination[];
  selectedDestinations: Destination[];
  onToggleDestination: (destination: Destination) => void;
  onViewDetail: (id: number) => void;
}

export const PopularDestinationsSection: React.FC<PopularDestinationsSectionProps> = ({
  destinations,
  selectedDestinations,
  onToggleDestination,
  onViewDetail,
}) => {
  // Take top 4 destinations ranked by SAW score
  const top4 = destinations.slice(0, 4);

  const isSelected = (id: number) => selectedDestinations.some((d) => d.id === id);

  return (
    <section style={{ maxWidth: 1280, margin: '64px auto 0', padding: '0 32px' }}>
      {/* Header Line */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--meratus-clay-soft)',
              color: 'var(--meratus-clay-dark)',
              padding: '4px 12px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            🏅 Rekomendasi Destinasi Terbaik
          </div>
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(28px, 3.5vw, 36px)',
              fontWeight: 700,
              color: 'var(--meratus-deep)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Destinasi Populer untuk Titik Rutemu
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--meratus-muted)',
              margin: 0,
              maxWidth: 680,
              lineHeight: 1.5,
            }}
          >
            Belum tahu mau ke mana? Pilih destinasi dengan skor rekomendasi tertinggi ini untuk langsung
            ditambahkan ke rutemu.
          </p>
        </div>

        {/* Right Info Factor Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#ffffff',
            border: '1px solid var(--meratus-card-border)',
            padding: '7px 14px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--meratus-subtle)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <span>⚙️ Faktor: Aksesibilitas, Biaya, Fasilitas, & Jarak</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="popular-cards-grid">
        {top4.map((dest, idx) => {
          const selected = isSelected(dest.id);
          const score = 96 - idx * 2.5; // fallback scores matching Figma: 96, 94, 89, 88
          const displayScore = dest.popularitas ? Math.round(dest.popularitas) : Math.round(score);

          // Image fallback matching destination
          let imgSrc = '/assets/balanting-paring.jpg';
          if (dest.name.toLowerCase().includes('haratai') || dest.name.toLowerCase().includes('air')) {
            imgSrc = '/assets/Air-Terjun-Haratai.jpg';
          } else if (dest.name.toLowerCase().includes('langara') || dest.name.toLowerCase().includes('bukit')) {
            imgSrc = '/assets/langara.jpg';
          } else if (dest.name.toLowerCase().includes('museum') || dest.name.toLowerCase().includes('budaya')) {
            imgSrc = '/assets/museum-rakyat.jpg';
          }

          return (
            <div key={dest.id} className="popular-card-figma">
              {/* Media Container */}
              <div className="popular-card-media">
                <img
                  src={imgSrc}
                  alt={dest.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                  }}
                />

                {/* Rank Badge */}
                <div
                  className={`popular-badge-rank ${idx === 1 ? 'rank-forest' : ''}`}
                >
                  Peringkat #{idx + 1}
                </div>

                {/* Score Badge */}
                <div className="popular-badge-score">
                  <Icon.Compass size={12} style={{ color: 'var(--meratus-clay)' }} />
                  <span>Skor Rekomendasi {displayScore}</span>
                </div>
              </div>

              {/* Body */}
              <div className="popular-card-body">
                <div className="popular-card-subtitle">
                  {dest.category || 'Wisata Alam'} • {dest.region || 'Loksado'}
                </div>
                <h3 className="popular-card-title">{dest.name}</h3>

                <div className="popular-card-distance">
                  <Icon.Location size={14} style={{ color: 'var(--meratus-clay)' }} />
                  <span>{dest.distance || `${30 + idx * 6} km dari Kandangan`}</span>
                </div>

                {/* Actions */}
                <div className="popular-card-actions">
                  <button
                    className={`btn-add-route ${selected ? 'added' : 'not-added'}`}
                    onClick={() => onToggleDestination(dest)}
                  >
                    {selected ? (
                      <>
                        <Icon.Check size={14} />
                        <span>Sudah Masuk Rute</span>
                      </>
                    ) : (
                      <>
                        <span>+ Tambah ke Rute</span>
                      </>
                    )}
                  </button>

                  <button
                    className="btn-detail-outline"
                    onClick={() => onViewDetail(dest.id)}
                  >
                    Detail Wisata
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularDestinationsSection;
