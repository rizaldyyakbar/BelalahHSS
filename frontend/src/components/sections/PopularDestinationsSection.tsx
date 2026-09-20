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
  // Take top 4 destinations matching Figma (Bamboo Rafting, Haratai, Malutu, Tanuhi)
  const top4 = destinations.slice(0, 4);

  const isSelected = (id: number) => selectedDestinations.some((d) => d.id === id);

  return (
    <section className="bh-container section-popular-destinations" style={{ marginTop: 36 }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(22px, 5.5vw, 32px)',
            fontWeight: 800,
            color: 'var(--meratus-deep)',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}
        >
          Destinasi Populer untuk Titik Rutemu
        </h2>
        <p
          style={{
            fontSize: 13,
            color: 'var(--meratus-muted)',
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          Belum tahu mau kemana? Pilih destinasi favoritmu untuk langsung ditambahkan ke rutemu.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="popular-cards-grid">
        {top4.map((dest, idx) => {
          const selected = isSelected(dest.id);

          // Image fallback matching destination
          let imgSrc = '/assets/balanting-paring.jpg';
          if (dest.name.toLowerCase().includes('haratai') || dest.name.toLowerCase().includes('air')) {
            imgSrc = '/assets/Air-Terjun-Haratai.jpg';
          } else if (dest.name.toLowerCase().includes('malutu') || dest.name.toLowerCase().includes('bendungan')) {
            imgSrc = '/assets/malutu.jpg';
          } else if (dest.name.toLowerCase().includes('tanuhi') || dest.name.toLowerCase().includes('panas')) {
            imgSrc = '/assets/tanuhi.jpg';
          } else if (dest.name.toLowerCase().includes('langara') || dest.name.toLowerCase().includes('bukit')) {
            imgSrc = '/assets/langara.jpg';
          }

          // Exact distances from Figma Image 1
          const distMap: Record<number, string> = {
            0: '34.2 km dari Kandangan',
            1: '42.1 km dari Kandangan',
            2: '16.5 km dari Kandangan',
            3: '31.8 km dari Kandangan',
          };
          const distLabel = distMap[idx] || (dest.distance || '30 km dari Kandangan');

          return (
            <div
              key={dest.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #EBEFEA',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Media with Overlaid Distance Pill */}
              <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                <img
                  src={imgSrc}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                  }}
                />

                {/* Overlaid Distance Tag on Bottom Left */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 12,
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 9999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Icon.Compass size={12} style={{ color: '#C1ECD4' }} />
                  <span>{distLabel}</span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--meratus-deep)',
                    margin: '0 0 3px',
                    lineHeight: 1.25,
                  }}
                >
                  {dest.name}
                </h3>

                <div
                  style={{
                    fontSize: 12,
                    color: '#6E7972',
                    marginBottom: 12,
                  }}
                >
                  {dest.location || `${dest.region || 'Loksado'}, Hulu Sungai Selatan`}
                </div>

                {/* Actions: Side by Side */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onToggleDestination(dest)}
                    style={{
                      flex: 1,
                      height: 38,
                      borderRadius: 10,
                      border: selected ? '1px solid #C1ECD4' : 'none',
                      background: selected ? '#E8F5EE' : '#012D1D',
                      color: selected ? '#012D1D' : '#ffffff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {selected ? (
                      <>
                        <Icon.Check size={14} color="#012D1D" />
                        <span>Sudah Masuk Rute</span>
                      </>
                    ) : (
                      <span>+ Tambah ke Rute</span>
                    )}
                  </button>

                  <button
                    onClick={() => onViewDetail(dest.id)}
                    style={{
                      height: 38,
                      padding: '0 16px',
                      borderRadius: 10,
                      border: '1px solid #E2EAE4',
                      background: '#F1F4F1',
                      color: '#1A1611',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Detail</span>
                    <span style={{ fontSize: 13 }}>↗</span>
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
