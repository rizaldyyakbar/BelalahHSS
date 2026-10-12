import React, { useState, useEffect, useMemo } from 'react';
import { Destination } from '../../constants/destinations';
import { calculateHaversineDistance, estimateRoadDistanceKm, formatDistanceKm, parseCoords } from '../../utils/geo';
import { fetchNearbyFacilities, ApiFacility } from '../../services/api';

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
  const [activeTab, setActiveTab] = useState<'destinations' | 'facilities'>('destinations');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>('all');
  const [facilities, setFacilities] = useState<ApiFacility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState<boolean>(false);

  // Reference point: last selected destination or Basecamp Kandangan
  const referencePoint = useMemo(() => {
    if (selectedDestinations.length > 0) {
      const last = selectedDestinations[selectedDestinations.length - 1];
      const coords = parseCoords(last);
      if (coords) return coords;
    }
    return { lat: -2.7758, lng: 115.2635 };
  }, [selectedDestinations]);

  // Compute nearby unselected destinations dynamically via Haversine
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
    return scored.slice(0, 6);
  }, [destinations, selectedDestinations, referencePoint]);

  // Fetch nearby facilities from backend database
  useEffect(() => {
    let isMounted = true;
    setLoadingFacilities(true);

    fetchNearbyFacilities(referencePoint.lat, referencePoint.lng, 35)
      .then((data) => {
        if (!isMounted) return;
        setFacilities(data);
      })
      .catch((err) => {
        console.error('[NearbySuggestionsStrip] Failed loading facilities:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingFacilities(false);
      });

    return () => {
      isMounted = false;
    };
  }, [referencePoint]);

  // Filter facilities by category
  const filteredFacilities = useMemo(() => {
    if (facilityTypeFilter === 'all') return facilities;
    return facilities.filter((f) => {
      const type = (f.type || '').toLowerCase();
      if (facilityTypeFilter === 'penginapan') return type === 'penginapan' || type === 'lodging';
      if (facilityTypeFilter === 'kuliner') return type === 'kuliner' || type === 'dining';
      if (facilityTypeFilter === 'spbu') return type === 'spbu' || type === 'fuel';
      if (facilityTypeFilter === 'masjid') return type === 'masjid' || type === 'worship';
      return true;
    });
  }, [facilities, facilityTypeFilter]);

  // Facility badge helpers
  const getFacilityMeta = (type?: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('penginapan') || t.includes('lodging')) {
      return { label: 'Penginapan', icon: '🛏️', bg: '#E0F2FE', color: '#0369A1' };
    }
    if (t.includes('kuliner') || t.includes('dining')) {
      return { label: 'Kuliner', icon: '🍽️', bg: '#FEF3C7', color: '#B45309' };
    }
    if (t.includes('spbu') || t.includes('fuel')) {
      return { label: 'SPBU', icon: '⛽', bg: '#FEE2E2', color: '#B91C1C' };
    }
    if (t.includes('masjid') || t.includes('worship')) {
      return { label: 'Masjid', icon: '🕌', bg: '#DCFCE7', color: '#15803D' };
    }
    return { label: 'Fasilitas', icon: '📍', bg: '#F3F4F6', color: '#4B5563' };
  };

  return (
    <div className="bh-container" style={{ marginTop: 36, marginBottom: 80 }}>
      {/* Header Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 12,
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
              Rekomendasi Sekitar ({selectedDestinations.length > 0 ? (selectedDestinations[selectedDestinations.length - 1]?.name ?? 'Kandangan Basecamp') : 'Kandangan Basecamp'})
            </h2>
            <p style={{ fontSize: 13, color: '#57534E', margin: 0 }}>
              {activeTab === 'destinations'
                ? 'Optimal untuk disinggahi searah koridor perjalanan rute wisata Anda'
                : 'Fasilitas penunjang resmi dari database (Penginapan, Kuliner, SPBU, Masjid)'}
            </p>
          </div>

          {/* Tab Selector Button Pills */}
          <div
            style={{
              display: 'inline-flex',
              background: '#E9EFEA',
              padding: 4,
              borderRadius: 12,
              gap: 4,
            }}
          >
            <button
              onClick={() => setActiveTab('destinations')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'destinations' ? '#012D1D' : 'transparent',
                color: activeTab === 'destinations' ? '#ffffff' : '#4A5568',
                transition: 'all 0.2s ease',
              }}
            >
              📍 Destinasi Terdekat ({dynamicSuggestions.length})
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'facilities' ? '#012D1D' : 'transparent',
                color: activeTab === 'facilities' ? '#ffffff' : '#4A5568',
                transition: 'all 0.2s ease',
              }}
            >
              🏪 Fasilitas Sekitar DB ({facilities.length})
            </button>
          </div>
        </div>

        {/* Sub-Filters for Facilities */}
        {activeTab === 'facilities' && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {[
              { id: 'all', label: `Semua (${facilities.length})` },
              { id: 'penginapan', label: '🛏️ Penginapan' },
              { id: 'kuliner', label: '🍽️ Kuliner' },
              { id: 'spbu', label: '⛽ SPBU' },
              { id: 'masjid', label: '🕌 Masjid' },
            ].map((pill) => {
              const active = facilityTypeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setFacilityTypeFilter(pill.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 700,
                    border: active ? '1.5px solid var(--meratus-primary)' : '1px solid #D1D5DB',
                    background: active ? '#EDF7F1' : '#FFFFFF',
                    color: active ? 'var(--meratus-primary)' : '#4B5563',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTENT: TAB 1 (DESTINASI TERDEKAT) */}
      {activeTab === 'destinations' && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 8,
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
                  padding: '14px 16px',
                  minWidth: 220,
                  maxWidth: 240,
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--meratus-deep)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 140,
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        background: '#D9EBE0',
                        color: '#012D1D',
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        marginLeft: 6,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {distanceStr}
                    </span>
                  </div>

                  <div style={{ fontSize: 11.5, color: '#57534E', marginBottom: 14 }}>
                    {item.category || item.region || 'Wisata HSS'}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#6E7972', fontWeight: 600 }}>
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
                      width: 28,
                      height: 28,
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
      )}

      {/* CONTENT: TAB 2 (FASILITAS SEKITAR DATABASE) */}
      {activeTab === 'facilities' && (
        <>
          {loadingFacilities ? (
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    minWidth: 240,
                    height: 140,
                    borderRadius: 16,
                    background: '#F3F4F6',
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
              ))}
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                background: '#FAFAFA',
                borderRadius: 14,
                border: '1px dashed #D1D5DB',
                color: '#6B7280',
                fontSize: 13,
              }}
            >
              Belum ada fasilitas kategori ini dalam radius 35 km dari lokasi acuan.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 8,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {filteredFacilities.map((fac) => {
                const meta = getFacilityMeta(fac.type);
                const mapsUrl =
                  fac.google_maps_url ||
                  `https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`;

                return (
                  <div
                    key={fac.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 16,
                      padding: '14px 16px',
                      minWidth: 240,
                      maxWidth: 260,
                      flex: '0 0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div>
                      {/* Top Row: Type Pill + Distance */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            background: meta.bg,
                            color: meta.color,
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 9999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span>{meta.icon}</span> {meta.label}
                        </span>

                        <span
                          style={{
                            background: '#F1F5F9',
                            color: '#334155',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 6,
                          }}
                        >
                          {fac.distance_km !== undefined ? `${fac.distance_km} km` : 'Dekat'}
                        </span>
                      </div>

                      {/* Name */}
                      <h4
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#0F172A',
                          margin: '0 0 4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={fac.name}
                      >
                        {fac.name}
                      </h4>

                      {/* Address */}
                      <p
                        style={{
                          fontSize: 11.5,
                          color: '#64748B',
                          margin: '0 0 10px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.35,
                          minHeight: 31,
                        }}
                        title={fac.address}
                      >
                        {fac.address || 'Kawasan Hulu Sungai Selatan'}
                      </p>
                    </div>

                    {/* Bottom Row: Rating + Maps Link */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 8,
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#D97706',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        ★ {fac.rating || '4.5'}
                      </span>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: 'var(--meratus-primary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: '#ECFDF5',
                        }}
                      >
                        Rute Maps ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NearbySuggestionsStrip;
