import React from 'react';
import SearchBar from '../atomic/SearchBar';

interface HeroSectionProps {
  imageClass?: string;
  location?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  onSearch?: (query: string) => void;
}

/**
 * HeroSection — Centered Immersive Design
 * Matches the 'Belalah ke Bumi Antaludin' centered preview.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  imageClass = 'langara',
  location = 'Hulu Sungai Selatan · Kalimantan Selatan',
  title = 'Belalah ke',
  titleHighlight = 'Bumi Antaludin',
  onSearch = () => { },
}) => {
  return (
    <div style={{ padding: '24px 24px 70px', marginTop: 10 }}>
      <div className="bh-hero" style={{
        height: 'calc(100vh - 48px)',
        minHeight: 500,
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <div className="bh-hero__bg">
          <img
            src={`/assets/${imageClass}.png`}
            alt={location}
            style={{ filter: 'brightness(0.95) saturate(1.1)' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `/assets/${imageClass}.jpg`;
            }}
          />
        </div>

        {/* Overlay - subtle vignette */}
        <div className="bh-hero__overlay" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
        }} />

        {/* Centered Content */}
        <div className="bh-hero__content" style={{
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}>
          <h1 className="bh-hero__title" style={{
            fontSize: 'clamp(48px, 8vw, 100px)',
            maxWidth: '12ch',
            margin: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            {title} <br />
            {titleHighlight}
          </h1>

          <div className="bh-hero__search" style={{
            width: '100%',
            maxWidth: 640,
            marginTop: 0,
          }}>
            <div className="liquid-glass" style={{
              padding: '8px 8px 8px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.45)',
            }}>
              <SearchBar
                placeholder="Explore your next mountain adventure..."
                onSearch={onSearch}
                style={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  backdropFilter: 'none',
                  padding: 0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom indicator or topo lines are visible via screen wrapper */}
      </div>
    </div>
  );
};

export default HeroSection;
