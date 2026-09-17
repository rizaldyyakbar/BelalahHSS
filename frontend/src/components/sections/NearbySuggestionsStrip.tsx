import React from 'react';
import { Icon } from '../atomic/Icons';
import { Destination } from '../../constants/destinations';

interface NearbySuggestionsStripProps {
  destinations: Destination[];
  selectedDestinations: Destination[];
  onAddDestination: (dest: Destination) => void;
}

export const NearbySuggestionsStrip: React.FC<NearbySuggestionsStripProps> = ({
  destinations,
  selectedDestinations,
  onAddDestination,
}) => {
  // Preset suggestions matching Figma design
  const suggestions = [
    {
      name: 'Bukit Langara Loksado',
      sub: '3.2 km dari titik rafting',
      img: '/assets/langara.jpg',
      targetName: 'Bukit Langara',
    },
    {
      name: 'Balai Adat Malaris',
      sub: '4.8 km dari Loksado',
      img: '/assets/museum-rakyat.jpg',
      targetName: 'Balai Adat Malaris',
    },
    {
      name: 'Air Terjun Riam Hanai',
      sub: '6.1 km dari Haratai',
      img: '/assets/Air-Terjun-Haratai.jpg',
      targetName: 'Riam Barajang dan Riam Hanai',
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '28px auto 0', padding: '0 32px' }}>
      <div className="nearby-strip-container">
        {/* Header */}
        <div className="nearby-strip-header">
          <div className="nearby-strip-title">
            <Icon.Pin size={16} style={{ color: '#994700' }} />
            <span>Destinasi Terdekat di Sekitar Titik Pilihanmu (Radius Haversine &lt; 12 km)</span>
          </div>
          <div className="nearby-strip-sub">
            Hemat waktu tanpa memutar arah
          </div>
        </div>

        {/* 3 Mini Cards */}
        <div className="nearby-strip-cards">
          {suggestions.map((item) => {
            const matched = destinations.find(
              (d) =>
                d.name.toLowerCase().includes(item.targetName.toLowerCase()) ||
                item.targetName.toLowerCase().includes(d.name.toLowerCase())
            );
            const isAlreadyAdded = matched && selectedDestinations.some((sd) => sd.id === matched.id);

            return (
              <div key={item.name} className="nearby-mini-card">
                <div className="nearby-mini-info">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="nearby-mini-thumb"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/langara.jpg';
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--meratus-subtle)' }}>
                      {item.sub}
                    </div>
                  </div>
                </div>

                <button
                  className="nearby-mini-btn"
                  onClick={() => {
                    if (matched && !isAlreadyAdded) {
                      onAddDestination(matched);
                    }
                  }}
                  disabled={isAlreadyAdded}
                  style={{
                    opacity: isAlreadyAdded ? 0.6 : 1,
                    cursor: isAlreadyAdded ? 'default' : 'pointer',
                    background: isAlreadyAdded ? 'var(--meratus-mint)' : 'transparent',
                    color: isAlreadyAdded ? 'var(--meratus-mint-text)' : 'var(--meratus-deep)',
                    borderColor: isAlreadyAdded ? 'var(--meratus-mint)' : 'var(--meratus-card-border)',
                  }}
                >
                  {isAlreadyAdded ? '✓ Di Rute' : '+ Rute'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NearbySuggestionsStrip;
