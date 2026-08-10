import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/atomic/Button';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';

export const PlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<Destination[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('belalah_itinerary');
    if (saved) {
      try {
        setItinerary(JSON.parse(saved));
      } catch (e) {
        setItinerary(DESTINATIONS.slice(0, 3));
      }
    } else {
      // Default initial itinerary recommendations
      setItinerary(DESTINATIONS.slice(0, 3));
    }
  }, []);

  const saveItinerary = (updated: Destination[]) => {
    setItinerary(updated);
    localStorage.setItem('belalah_itinerary', JSON.stringify(updated));
  };

  const removeFromItinerary = (id: number) => {
    const updated = itinerary.filter((item) => item.id !== id);
    saveItinerary(updated);
  };

  const addToItinerary = (dest: Destination) => {
    if (!itinerary.some((item) => item.id === dest.id)) {
      const updated = [...itinerary, dest];
      saveItinerary(updated);
    }
  };

  // Generate multi-stop Google Maps Route URL
  const getMultiStopGoogleMapsUrl = (): string => {
    if (itinerary.length === 0) return 'https://www.google.com/maps';

    const waypoints = itinerary.map((item) => {
      if (item.latitude && item.longitude) {
        return `${item.latitude},${item.longitude}`;
      }
      return encodeURIComponent(`${item.name}, Hulu Sungai Selatan`);
    });

    if (waypoints.length === 1) {
      return `https://www.google.com/maps/dir/?api=1&destination=${waypoints[0]}`;
    }

    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const waypointsParam = waypoints.slice(1, waypoints.length - 1).join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypointsParam) {
      url += `&waypoints=${waypointsParam}`;
    }
    return url;
  };

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 32px 60px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sage-dark)',
          }}>
            Trip Planner & Route Export
          </span>
          <h1 className="bh-serif" style={{ fontSize: 44, fontWeight: 500, margin: '8px 0 16px', color: 'var(--ink)' }}>
            Perencana Rencana Perjalanan
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 650, margin: '0 auto' }}>
            Susun urutan destinasi wisata yang ingin Anda kunjungi dan ekspor langsung menjadi rute jalan di Google Maps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 36 }}>
          {/* Active Itinerary List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="bh-serif" style={{ fontSize: 24, margin: 0 }}>
                Rencana Kunjungan ({itinerary.length} Destinasi)
              </h2>
              {itinerary.length > 0 && (
                <a
                  href={getMultiStopGoogleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="sage" size="md">
                    🗺️ Ekspor Rute Lengkap ke Google Maps
                  </Button>
                </a>
              )}
            </div>

            {itinerary.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {itinerary.map((dest, index) => (
                  <div
                    key={dest.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      background: '#fff',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-md)',
                      padding: 16,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      background: 'var(--sage)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 16,
                      flexShrink: 0,
                    }}>
                      {index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px 0' }}>{dest.name}</h3>
                      <div style={{ fontSize: 13, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon.Pin size={13} /> {dest.location} · {dest.distance}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={() => navigate(`/destination/${dest.id}`)}
                        style={{
                          background: 'var(--bg-soft)',
                          border: '1px solid var(--line)',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => removeFromItinerary(dest.id)}
                        style={{
                          background: '#fff0f0',
                          color: '#d32f2f',
                          border: '1px solid #ffcdd2',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--line)',
              }}>
                <h3 className="bh-serif" style={{ fontSize: 22, marginBottom: 8 }}>Belum Ada Destinasi di Rencana Anda</h3>
                <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Pilih destinasi dari daftar di samping untuk mulai menyusun rute perjalanan.</p>
              </div>
            )}
          </div>

          {/* Add Available Destinations Sidebar */}
          <div>
            <h3 className="bh-serif" style={{ fontSize: 20, marginBottom: 16 }}>Tambahkan Destinasi Lain</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DESTINATIONS.filter((d) => !itinerary.some((item) => item.id === d.id)).map((dest) => (
                <div
                  key={dest.id}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{dest.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{dest.category} · {dest.location}</div>
                  </div>
                  <button
                    onClick={() => addToItinerary(dest)}
                    style={{
                      background: 'var(--sage)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default PlannerPage;
