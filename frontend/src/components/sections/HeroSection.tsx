import React from 'react';
import SearchBar from '../atomic/SearchBar';

interface HeroSectionProps {
  imageClass?: string;
  location?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  onSearch?: (query: string) => void;
  style?: React.CSSProperties;
}

/**
 * HeroSection — Hero banner section
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  imageClass = 'forest',
  location = 'Hulu Sungai Selatan · Kalimantan Selatan',
  title = 'Belalah ke Bumi Antaludin',
  titleHighlight = 'Bumi Antaludin',
  description = 'Rencanakan perjalananmu yang pertama di Hulu Sungai Selatan — rekomendasi destinasi terbaik dan rute terpendek antar tempat, dalam beberapa langkah saja.',
  onSearch = () => {},
  style = {},
}) => {
  return (
    <div style={{ padding: '0 56px 24px', ...style }}>
      <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 560 }}>
        {/* Background Image */}
        <div className={`bh-photo ${imageClass}`} style={{ position: 'absolute', inset: 0 }}>
          <span className="credit">FOTO · {(location?.split('·')?.[0] || 'HULU SUNGAI').trim().toUpperCase()}</span>
        </div>

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)',
          zIndex: 2,
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 48,
          color: '#fff',
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <span className="bh-chip" style={{
              background: 'rgba(255,255,255,0.16)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              fontSize: 13,
            }}>
              {location}
            </span>
          </div>

          <h1 className="bh-serif" style={{
            fontSize: 64,
            fontWeight: 500,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            margin: 0,
            maxWidth: '16ch',
            color: '#fff',
            textWrap: 'balance',
          }}>
            {title}{' '}
            <em style={{ fontStyle: 'italic', color: '#F4DCC4' }}>{titleHighlight}</em>
            , dari air terjun ke pegunungan Meratus.
          </h1>

          <p style={{
            fontSize: 16,
            marginTop: 18,
            maxWidth: '52ch',
            color: 'rgba(255,251,243,0.86)',
            lineHeight: 1.55,
          }}>
            {description}
          </p>

          <div style={{ marginTop: 26, maxWidth: 560 }}>
            <SearchBar
              placeholder="Cari Loksado, Haratai, Pasar Terapung…"
              onSearch={onSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
