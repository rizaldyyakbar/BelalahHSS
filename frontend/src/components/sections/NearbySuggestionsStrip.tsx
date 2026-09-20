import React from 'react';
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
  const suggestions = [
    {
      name: 'Bukit Langara',
      category: 'Karst Panorama',
      distance: '3.2 km',
      extraTime: '+ 6 mnt perjalanan',
      targetName: 'Bukit Langara',
    },
    {
      name: 'Balai Adat Malaris',
      category: 'Budaya Dayak Meratus',
      distance: '0.8 km',
      extraTime: '+ 12 mnt perjalanan',
      targetName: 'Balai Adat Malaris',
    },
    {
      name: 'Air Terjun Riam Hanai',
      category: 'Wisata Air Terjun',
      distance: '2.1 km',
      extraTime: '+ 8 mnt perjalanan',
      targetName: 'Riam Barajang dan Riam Hanai',
    },
  ];

  return (
    <div className="bh-container" style={{ marginTop: 32, marginBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(20px, 5vw, 26px)',
              fontWeight: 800,
              color: 'var(--meratus-deep)',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}
          >
            Destinasi Terdekat Sekitarmu
          </h2>
          <p style={{ fontSize: 12.5, color: '#57534E', margin: 0 }}>
            Optimal untuk disinggahi searah alur utama
          </p>
        </div>

        {/* Right Haversine Chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: '#FD934C',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span>↗ Haversine 0/2</span>
        </div>
      </div>

      {/* Horizontal Swipeable Cards */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 6,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {suggestions.map((item) => {
          const matched = destinations.find(
            (d) =>
              d.name.toLowerCase().includes(item.targetName.toLowerCase()) ||
              item.targetName.toLowerCase().includes(d.name.toLowerCase())
          );
          const isAlreadyAdded = matched && selectedDestinations.some((sd) => sd.id === matched.id);

          return (
            <div
              key={item.name}
              style={{
                background: '#EDF5F0',
                border: '1px solid #D7E5DC',
                borderRadius: 16,
                padding: '12px 14px',
                minWidth: 190,
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* Top Row: Title + Distance Pill */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: 'var(--meratus-deep)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      background: '#D9EBE0',
                      color: '#012D1D',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 9999,
                      marginLeft: 6,
                    }}
                  >
                    {item.distance}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: '#57534E', marginBottom: 12 }}>
                  {item.category}
                </div>
              </div>

              {/* Bottom Row: Extra Time + Green + Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 11, color: '#6E7972', fontWeight: 500 }}>
                  {item.extraTime}
                </span>

                <button
                  onClick={() => {
                    if (matched && !isAlreadyAdded) {
                      onAddDestination(matched);
                    }
                  }}
                  disabled={isAlreadyAdded}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: isAlreadyAdded ? '#012D1D' : '#C1ECD4',
                    color: isAlreadyAdded ? '#ffffff' : '#012D1D',
                    border: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: isAlreadyAdded ? 'default' : 'pointer',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.15s ease',
                  }}
                  title={isAlreadyAdded ? 'Sudah ada di rute' : 'Sisipkan ke rute'}
                >
                  {isAlreadyAdded ? '✓' : '+'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbySuggestionsStrip;
