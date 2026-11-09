import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { fetchNearbyFacilities, ApiFacility, FALLBACK_FACILITIES } from '../services/api';

const TYPE_CONFIG: Record<string, { label: string; icon: string; badgeBg: string; badgeColor: string; defaultImg: string }> = {
  kuliner: {
    label: 'Kuliner Khas',
    icon: '🍲',
    badgeBg: '#FFF3EB',
    badgeColor: '#994700',
    defaultImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg',
  },
  penginapan: {
    label: 'Homestay & Penginapan',
    icon: '🛖',
    badgeBg: '#EAF4EE',
    badgeColor: '#012D1D',
    defaultImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg/1280px-Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg',
  },
  spbu: {
    label: 'SPBU & Rest Area',
    icon: '⛽',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    defaultImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kolam_Wisata_Air_Panas_Tanuhi.jpg/1280px-Kolam_Wisata_Air_Panas_Tanuhi.jpg',
  },
  masjid: {
    label: 'Tempat Ibadah',
    icon: '🕌',
    badgeBg: '#E0E7FF',
    badgeColor: '#3730A3',
    defaultImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Masjid_Ba%27angkat_2.jpg/1280px-Masjid_Ba%27angkat_2.jpg',
  },
};

export const ExperiencesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [facilities, setFacilities] = useState<ApiFacility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedSpots, setSavedSpots] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('belalah_saved_spots');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchNearbyFacilities(-2.7758, 115.2635, 60)
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setFacilities(data);
        } else {
          setFacilities(FALLBACK_FACILITIES);
        }
      })
      .catch(() => {
        if (isMounted) setFacilities(FALLBACK_FACILITIES);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleSpot = (spotName: string) => {
    let updated: string[];
    if (savedSpots.includes(spotName)) {
      updated = savedSpots.filter((s) => s !== spotName);
      showToast(`${spotName} dihapus dari titik singgah.`);
    } else {
      updated = [...savedSpots, spotName];
      showToast(`${spotName} berhasil disisipkan ke rencana rute!`);
    }
    setSavedSpots(updated);
    try {
      localStorage.setItem('belalah_saved_spots', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const categories = [
    { key: 'Semua', label: 'Semua Singgah' },
    { key: 'kuliner', label: 'Kuliner Khas' },
    { key: 'penginapan', label: 'Homestay & Penginapan' },
    { key: 'spbu', label: 'SPBU & Rest Area' },
    { key: 'masjid', label: 'Tempat Ibadah' },
  ];

  const filteredFacilities = facilities.filter((fac) => {
    if (selectedCategory === 'Semua') return true;
    return fac.type?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 76,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#012D1D',
            color: '#ffffff',
            padding: '9px 20px',
            borderRadius: 9999,
            fontSize: 12.5,
            fontWeight: 600,
            zIndex: 1100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {toastMsg}
        </div>
      )}

      <main style={{ flex: 1, paddingBottom: 90 }}>
        {/* Header Section */}
        <section className="bh-container" style={{ paddingTop: 96, paddingBottom: 16 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFF3EB',
              border: '1px solid #FFE0CE',
              borderRadius: 9999,
              padding: '4px 12px',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13 }}>🛖</span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#994700',
                textTransform: 'uppercase',
              }}
            >
              Pemberhentian Terkurasi Google Maps
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 800,
              color: 'var(--meratus-deep)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Titik Singgah &amp; Kuliner Khas HSS
          </h1>

          <p
            style={{
              fontSize: 14,
              color: '#57534E',
              margin: '0 0 20px',
              lineHeight: 1.55,
              maxWidth: 620,
            }}
          >
            Tempat istirahat nyaman, kuliner legendaris Ketupat Kandangan, homestay ramah warga, dan pos BBM di sepanjang koridor Hulu Sungai Selatan menuju Geopark Meratus.
          </p>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 20,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              const count = cat.key === 'Semua'
                ? facilities.length
                : facilities.filter((f) => f.type?.toLowerCase() === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    background: active ? '#012D1D' : '#ffffff',
                    color: active ? '#ffffff' : '#57534E',
                    border: '1px solid',
                    borderColor: active ? '#012D1D' : '#E2EAE4',
                    borderRadius: 9999,
                    padding: '7px 16px',
                    fontSize: 12.5,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 2px 8px rgba(1, 45, 29, 0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Spot Cards Feed (Responsive 2-3 Columns Grid) */}
        <section className="bh-container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 16,
                    background: '#e8efe9',
                    height: 280,
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {filteredFacilities.map((fac) => {
                const defaultConf = {
                  label: 'Titik Singgah',
                  icon: '📍',
                  badgeBg: '#FFF3EB',
                  badgeColor: '#994700',
                  defaultImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg',
                };
                const conf = (fac.type && TYPE_CONFIG[fac.type]) || TYPE_CONFIG.kuliner || defaultConf;
                const isSaved = savedSpots.includes(fac.name);
                const gmapsUrl = fac.google_maps_url || (fac.latitude && fac.longitude
                  ? `https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.name + ', Hulu Sungai Selatan')}`);

                return (
                  <div
                    key={fac.id || fac.name}
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
                    {/* Media Preview */}
                    <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                      <img
                        src={fac.image_url || conf.defaultImg}
                        alt={fac.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = conf.defaultImg;
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 12,
                          background: conf.badgeBg,
                          color: conf.badgeColor,
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 9999,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        }}
                      >
                        {conf.icon} {conf.label}
                      </div>

                      {fac.distance_km !== undefined && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 12,
                            background: 'rgba(0, 0, 0, 0.75)',
                            color: '#ffffff',
                            fontSize: 10.5,
                            fontWeight: 600,
                            padding: '3px 9px',
                            borderRadius: 9999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Icon.Compass size={11} style={{ color: '#C1ECD4' }} />
                          <span>~{fac.distance_km} km dari Kandangan</span>
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <h3
                          style={{
                            fontFamily: 'var(--serif)',
                            fontSize: 17,
                            fontWeight: 700,
                            color: 'var(--meratus-deep)',
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {fac.name}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            background: '#FFF9E6',
                            color: '#B45309',
                            padding: '2px 7px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 800,
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          <span>★</span>
                          <span>{fac.rating || 4.7}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: 12, color: '#6E7972', margin: '0 0 16px', lineHeight: 1.45, flex: 1 }}>
                        📍 {fac.address || 'Kabupaten Hulu Sungai Selatan, Kalimantan Selatan'}
                      </p>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          paddingTop: 12,
                          borderTop: '1px solid #F0F4F1',
                        }}
                      >
                        <a
                          href={gmapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: 'none',
                            color: '#012D1D',
                            background: '#F1F5F2',
                            borderRadius: 10,
                            padding: '8px 12px',
                            fontSize: 11.5,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <span>Buka Google Maps</span>
                          <span style={{ fontSize: 11 }}>↗</span>
                        </a>

                        <button
                          onClick={() => handleToggleSpot(fac.name)}
                          style={{
                            background: isSaved ? '#012D1D' : '#FD934C',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 10,
                            padding: '8px 14px',
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          {isSaved ? (
                            <>
                              <Icon.Check size={12} color="#C1ECD4" />
                              <span>Tersimpan</span>
                            </>
                          ) : (
                            <span>+ Titik Singgah</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExperiencesPage;
