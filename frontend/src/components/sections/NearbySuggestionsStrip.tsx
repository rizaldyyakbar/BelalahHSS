import React, { useMemo } from 'react';
import { Destination } from '../../constants/destinations';
import { calculateHaversineDistance, estimateRoadDistanceKm, formatDistanceKm, parseCoords } from '../../utils/geo';

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
  // Reference point: last selected destination or Basecamp Kandangan
  const referencePoint = useMemo(() => {
    if (selectedDestinations.length > 0) {
      const last = selectedDestinations[selectedDestinations.length - 1];
      const coords = parseCoords(last);
      if (coords) return coords;
    }
    return { lat: -2.7758, lng: 115.2635 };
  }, [selectedDestinations]);

  // Compute nearby unselected suggestions dynamically via Haversine
  const dynamicSuggestions = useMemo(() => {
    const unselected = destinations.filter(
      (d) => !selectedDestinations.some((sd) => sd.id === d.id)
    );

    const scored = unselected.map((item) => {
      const coords = parseCoords(item);
      let distKm = 10;
      if (coords) {
        distKm = estimateRoadDistanceKm(
          calculateHaversineDistance(referencePoint.lat, referencePoint.lng, coords.lat, coords.lng)
        );
      }
      const extraMinutes = Math.max(4, Math.round((distKm / 35) * 60));

      return {
        item,
        distanceStr: formatDistanceKm(distKm),
        extraTimeStr: `+ ${extraMinutes} mnt perjalanan`,
        distKm,
      };
    });

    // Sort by shortest distance
    scored.sort((a, b) => a.distKm - b.distKm);
    return scored.slice(0, 4);
  }, [destinations, selectedDestinations, referencePoint]);

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
            Optimal untuk disinggahi searah koridor perjalanan
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
          <span>↗ Haversine ({dynamicSuggestions.length} Pilihan)</span>
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
        {dynamicSuggestions.map(({ item, distanceStr, extraTimeStr }) => {
          const isAlreadyAdded = selectedDestinations.some((sd) => sd.id === item.id);

          return (
            <div
              key={item.id}
              style={{
                background: '#EDF5F0',
                border: '1px solid #D7E5DC',
                borderRadius: 16,
                padding: '12px 14px',
                minWidth: 200,
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
                      maxWidth: 130,
                    }}
                    title={item.name}
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
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {distanceStr}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: '#57534E', marginBottom: 12 }}>
                  {item.category || item.region || 'Wisata HSS'}
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
                  {extraTimeStr}
                </span>

                <button
                  onClick={() => {
                    if (!isAlreadyAdded) {
                      onAddDestination(item);
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
