import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { getGoogleMapsRouteUrl } from '../services/api';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const destination: Destination | undefined =
    DESTINATIONS.find((d) => d.id === Number(id));

  const [itinerary, setItinerary] = useState<Destination[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const facilityIcon: Record<string, string> = {
  bed: '🛏️',
  fork: '🍽️',
  parking: '🅿️',
};

  useEffect(() => {
    const saved = localStorage.getItem('belalah_itinerary');
    if (saved) {
      try {
        setItinerary(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isInRoute = destination ? itinerary.some((d) => d.id === destination.id) : false;

  const handleToggleRoute = () => {
    if (!destination) return;
    let updated: Destination[];
    if (isInRoute) {
      updated = itinerary.filter((d) => d.id !== destination.id);
      showToast(`${destination.name} dihapus dari rute.`);
    } else {
      updated = [...itinerary, destination];
      showToast(`${destination.name} berhasil ditambahkan ke rute!`);
    }
    setItinerary(updated);
    localStorage.setItem('belalah_itinerary', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  if (!destination) {
    return (
      <div style={{ padding: 120, textAlign: 'center', background: 'var(--meratus-bg)', minHeight: '100vh' }}>
        <h2>Destinasi tidak ditemukan</h2>
        <button
          onClick={() => navigate('/directory')}
          style={{
            marginTop: 16,
            padding: '10px 20px',
            background: 'var(--meratus-deep)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // Fallback images
  let mainImg = '/assets/balanting-paring.jpg';
  let subImg1 = '/assets/Air-Terjun-Haratai.jpg';
  let subImg2 = '/assets/langara.jpg';

  const lowerName = destination.name.toLowerCase();
  if (lowerName.includes('haratai') || lowerName.includes('air')) {
    mainImg = '/assets/Air-Terjun-Haratai.jpg';
    subImg1 = '/assets/balanting-paring.jpg';
    subImg2 = '/assets/tanuhi.jpg';
  } else if (lowerName.includes('langara') || lowerName.includes('bukit')) {
    mainImg = '/assets/langara.jpg';
    subImg1 = '/assets/balanting-paring.jpg';
    subImg2 = '/assets/Air-Terjun-Haratai.jpg';
  } else if (lowerName.includes('malutu') || lowerName.includes('bendungan')) {
    mainImg = '/assets/malutu.jpg';
    subImg1 = '/assets/balanting-paring.jpg';
    subImg2 = '/assets/museum-rakyat.jpg';
  } else if (lowerName.includes('tanuhi') || lowerName.includes('panas')) {
    mainImg = '/assets/tanuhi.jpg';
    subImg1 = '/assets/balanting-paring.jpg';
    subImg2 = '/assets/langara.jpg';
  } else if (lowerName.includes('museum') || lowerName.includes('budaya') || lowerName.includes('malaris')) {
    mainImg = '/assets/museum-rakyat.jpg';
    subImg1 = '/assets/balanting-paring.jpg';
    subImg2 = '/assets/Air-Terjun-Haratai.jpg';
  }

  const isRafting = lowerName.includes('rafting');
  const priceDisplay = destination.entrance || 'Hubungi pengelola';
  const durationDisplay = isRafting ? '2–3 Jam' : (destination.hours || 'Menyesuaikan kondisi lapangan');

  // Nearby waypoint recommendations matching corridor
  const nearbyPlaces = DESTINATIONS
    .filter((d) => d.id !== destination.id && d.region === destination.region).slice(0, 3)

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#012D1D',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 1100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {notification}
        </div>
      )}

      <main style={{ flex: 1, paddingBottom: 80 }}>
        {/* 1. Breadcrumbs Bar */}
        <div className="detail-nav-breadcrumbs">
          <Link to="/" style={{ color: 'var(--meratus-muted)', textDecoration: 'none' }}>Beranda</Link>
          <span>/</span>
          <Link to="/directory" style={{ color: 'var(--meratus-muted)', textDecoration: 'none' }}>Katalog Destinasi</Link>
          <span>/</span>
          <span style={{ color: 'var(--meratus-subtle)' }}>Loksado</span>
          <span>/</span>
          <span style={{ color: 'var(--meratus-deep)', fontWeight: 700 }}>{destination.name}</span>
        </div>

        {/* 2. Destination Header (Title, Badges, Rating) */}
        <section className="detail-hero-header">
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="detail-badges-row">
              {destination.rank && (
                <span className="detail-pill-rank" style={{ background: '#F5EFE6', color: '#6A432D' }}>
                  ★ Peringkat #{destination.rank} Wisata HSS
                </span>
              )}
              <span className="detail-pill-score"> 
                ★ {destination.rating.toFixed(1)} Rating ({destination.reviews} ulasan)
              </span>
              <span className="detail-pill-fav">
                {destination.category}
              </span>
              {destination.region && (
                <span className="detail-pill-fav">
                  {destination.region}
                </span>
              )}
            </div>

            <h1 className="detail-main-title">{destination.name}</h1>

            <div className="detail-location-sub">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FD934C' }}>
                <Icon.Pin size={16} />
                <strong style={{ color: '#1A1611' }}>{destination.location || 'Loksado, Hulu Sungai Selatan'}</strong>
              </span>
              <span>•</span>
              <span style={{ color: '#994700', fontWeight: 700 }}>
                {destination.distance ? `${destination.distance} km dari Lokasi Anda` : 'Jarak tidak tersedia'}
              </span>
            </div>
          </div>

          {/* Desktop Header Actions */}
          <div className="detail-header-actions desktop-only">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: destination.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Tautan destinasi disalin ke clipboard!');
                }
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #E2EAE4',
                borderRadius: 10,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--meratus-deep)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>🔗</span>
              <span>Bagikan</span>
            </button>

            <button
              onClick={handleToggleRoute}
              style={{
                background: isInRoute ? '#09261B' : '#012D1D',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(1, 45, 29, 0.2)',
              }}
            >
              <Icon.Compass size={16} style={{ color: '#C1ECD4' }} />
              <span>{isInRoute ? '✓ Sudah Masuk Rute' : '+ Tambah ke Rute'}</span>
            </button>
          </div>
        </section>

        {/* 3. Media Gallery (2-Column Desktop Grid) */}
        <section className="detail-gallery-grid">
          {/* Main Hero Photo */}
          <div className="detail-main-photo-box">
            <img
              src={mainImg}
              alt={destination.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
              }}
            />
            <div className="detail-main-photo-caption">
              <div>
                <strong style={{ fontSize: 14 }}>{destination.name}</strong>
                <div style={{ fontSize: 11.5, opacity: 0.85 }}>Lanskap Warisan Geopark Meratus Loksado</div>
              </div>
              <span
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Foto Lapangan
              </span>
            </div>
          </div>

          {/* Sub Photos (Side Column on Desktop, hidden on small screens) */}
          <div className="detail-sub-photos-col">
            <div className="detail-sub-photo-item">
              <img
                src={subImg1}
                alt="Riam Sungai Amandit"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/Air-Terjun-Haratai.jpg';
                }}
              />
              <div className="detail-sub-photo-caption">Riam Alami &amp; Hutan Ulin</div>
            </div>

            <div className="detail-sub-photo-item">
              <img
                src={subImg2}
                alt="Karst Meratus"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/langara.jpg';
                }}
              />
              <div className="detail-sub-photo-caption">Siluet Tebing Karst Meratus</div>
            </div>
          </div>
        </section>

        {/* 4. Main 2-Column Content Grid */}
        <section className="detail-content-grid">
          {/* Left Column: Narrative, Features, Facilities, Waypoints */}
          <div>
            {/* Quick Specs Attribute Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              <span style={{ background: '#F5EFE6', color: '#6A432D', padding: '8px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>🕒 Durasi: {durationDisplay}</span>
              </span>
              <span style={{ background: '#F5EFE6', color: '#6A432D', padding: '8px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>🏷️ Tarif: {priceDisplay}</span>
              </span>
              <span style={{ background: '#F5EFE6', color: '#6A432D', padding: '8px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>👥 {isRafting ? 'Maks 3 Orang / Rakit' : 'Semua Usia'}</span>
              </span>
              <span style={{ background: '#F5EFE6', color: '#6A432D', padding: '8px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>👨‍👩‍👧 Ramah Keluarga &amp; Pemula</span>
              </span>
            </div>

            {/* Editorial Story Article */}
            <div className="detail-article-card">
              <h2 className="detail-section-title">
                {`Kisah & Daya Tarik ${destination.name}`}
              </h2>

              <p className="detail-article-text">
                {destination.fullDescription || destination.description || 'Deskripsi destinasi belum tersedia.'}
              </p>

              {/* 3 Highlight Feature Cards */}
              <div className="detail-features-grid">
                <div className="detail-feature-card">
                  {(destination.facilities || []).slice(0,3).map((f) => (
                    <div className="detail-feature-item" key={f.name}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>
                        {facilityIcon[f.icon] || '📍'}
                      </div>
                      <h4 className="detail-feature-title">{f.name}</h4>
                      <p className="detail-feature-desc">
                        Fasilitas pendukung yang tersedia di area {destination.name}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Facilities & Field Services */}
            <div className="detail-article-card">
              <h3 className="detail-section-title">Fasilitas &amp; Layanan Lapangan</h3>
              <p style={{ fontSize: 13, color: 'var(--meratus-muted)', marginBottom: 16 }}>
                Kenyamanan sarana dan akomodasi pendukung yang tersedia di sekitar lokasi destinasi:
              </p>

              <div className="detail-facilities-grid">
                {(destination.facilities || []).map((f) => (
                  <div className="detail-facility-pill" key={f.name}>
                    <span> {f.icon} </span>
                    <span> {f.name} </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Singgah Terdekat / Waypoints */}
            <div className="detail-article-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 className="detail-section-title" style={{ margin: 0 }}>
                  ⇲ Titik Singgah Sekitar Koridor
                </h3>
                <span style={{ fontSize: 12, color: 'var(--meratus-muted)', fontWeight: 600 }}>
                  Rute Berurutan
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {nearbyPlaces.map((place) => {
                  const matched = DESTINATIONS.find((d) => d.name.toLowerCase().includes(place.name.toLowerCase()));
                  const inItin = matched && itinerary.some((d) => d.id === matched.id);

                  return (
                    <div
                      key={place.name}
                      style={{
                        background: '#F8FAF8',
                        border: '1px solid #E2EAE4',
                        borderRadius: 14,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 3px' }}>
                          {place.name}
                        </h4>
                        <p style={{ fontSize: 12, color: 'var(--meratus-muted)', margin: 0 }}>
                          {place.distance}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (matched && !inItin) {
                            const updated = [...itinerary, matched];
                            setItinerary(updated);
                            localStorage.setItem('belalah_itinerary', JSON.stringify(updated));
                            window.dispatchEvent(new Event('storage'));
                            showToast(`${matched.name} ditambahkan ke rute!`);
                          }
                        }}
                        disabled={inItin}
                        style={{
                          height: 36,
                          padding: '0 14px',
                          borderRadius: 10,
                          border: '1px solid #E2EAE4',
                          background: inItin ? '#012D1D' : '#ffffff',
                          color: inItin ? '#ffffff' : 'var(--meratus-deep)',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: inItin ? 'default' : 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {inItin ? '✓ Di Rute' : '+ Tambah'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ekosistem Lestari Alert Card */}
            <div
              style={{
                background: '#F9F5EE',
                border: '1px solid #EDE3D4',
                borderRadius: 16,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>🍃</span>
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#8C4A1E', margin: '0 0 4px' }}>
                  Ekosistem Lestari &amp; Etika Adat Meratus
                </h4>
                <p style={{ fontSize: 12.5, color: '#6A432D', margin: 0, lineHeight: 1.5 }}>
                  Bawa pulang kembali seluruh sampah plastik Anda. Hormati batas-batas sakral Balai Adat Dayak Meratus dan dengarkan selalu instruksi joki selama pengarungan demi keselamatan bersama.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar Card */}
          <aside>
            <div className="detail-sidebar-card">
              {/* Price Highlight */}
              <div className="detail-price-headline">
                <div className="detail-price-label">Tarif Kunjungan / Paket</div>
                <div className="detail-price-value">{priceDisplay}</div>
                <div style={{ fontSize: 11.5, color: '#6A432D', marginTop: 4 }}>
                  {isRafting ? 'Termasuk rakit, joki berpengalaman & shuttle' : 'Tiket masuk retribusi Geopark Meratus'}
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#EDF5F0',
                  border: '1px solid #D7E5DC',
                  borderRadius: 10,
                  padding: '8px 12px',
                  marginBottom: 18,
                  fontSize: 12,
                  color: 'var(--meratus-deep)',
                  fontWeight: 600,
                }}
              >
                <span>🛡️</span>
                <span>Terverifikasi Disporapar Hulu Sungai Selatan</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <button
                  onClick={handleToggleRoute}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    border: 'none',
                    background: isInRoute ? '#09261B' : '#012D1D',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(1, 45, 29, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon.Compass size={18} style={{ color: '#C1ECD4' }} />
                  <span>{isInRoute ? '✓ Sudah Ada di Rute Anda' : '+ Tambahkan ke Rute Perjalanan'}</span>
                </button>

                <button
                  onClick={() => {
                    const mapsUrl = getGoogleMapsRouteUrl(destination);
                    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                  }}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    border: '1.5px solid #D1DDD4',
                    background: '#ffffff',
                    color: 'var(--meratus-deep)',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon.Location size={16} style={{ color: '#994700' }} />
                  <span>Petunjuk Arah Google Maps</span>
                </button>
              </div>

              {/* Quick Specs Table */}
              <div className="detail-info-list">
                <div className="detail-info-row">
                  <span className="detail-info-key">Jarak dari Basecamp</span>
                  <span className="detail-info-val"> {destination.distance} </span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-key">Estimasi Berkendara</span>
                  <span className="detail-info-val">{durationDisplay}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-key">Jam Operasional</span>
                  <span className="detail-info-val">{destination.hours || 'Informasi belum tersedia'}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-key">Kondisi Jalan</span>
                  <span className="detail-info-val">Aspal Halus &amp; Cor Beton</span>
                </div>
                <div className="detail-info-row" style={{ borderBottom: 'none' }}>
                  <span className="detail-info-key">Waktu Terbaik</span>
                  <span className="detail-info-val">Pagi (08.00 – 11.00)</span>
                </div>
              </div>

              {/* Route Planner Direct Link */}
              <div
                style={{
                  background: '#F6FBF5',
                  border: '1px solid #DCEADE',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--meratus-deep)' }}>
                    Rencanakan Bersama Rute
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--meratus-muted)' }}>
                    {itinerary.length} destinasi dalam rute Anda saat ini.
                  </div>
                </div>

                <button
                  onClick={() => navigate('/planner')}
                  style={{
                    background: 'var(--meratus-deep)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '7px 12px',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Lihat Rute ›
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* 5. Mobile Floating Action Bar (Only visible on screens <=768px) */}
      <div
        className="mobile-only"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(193, 200, 194, 0.45)',
          padding: '12px 16px env(safe-area-inset-bottom, 12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div>
          <div style={{ fontSize: 10, color: '#6E7972', fontWeight: 600 }}>Mulai dari</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#012D1D' }}>{priceDisplay}</div>
        </div>

        <button
          onClick={handleToggleRoute}
          style={{
            background: isInRoute ? '#09261B' : '#012D1D',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 8px rgba(1, 45, 29, 0.25)',
          }}
        >
          <Icon.Compass size={14} style={{ color: '#C1ECD4' }} />
          <span>{isInRoute ? '✓ Di Rute Anda' : '+ Tambah ke Rute'}</span>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
