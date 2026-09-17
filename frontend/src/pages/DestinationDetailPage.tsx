import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { getGoogleMapsRouteUrl } from '../services/api';

/**
 * DestinationDetailPage — Figma Belalah HSS Detail Destinasi (Node 44:1701)
 * High-fidelity editorial layout with breadcrumbs, photo multi-grid,
 * historical cultural background, facility specs, and practical route sidebar.
 */
export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const destination: Destination | undefined =
    DESTINATIONS.find((d) => d.id === parseInt(id || '', 10)) || DESTINATIONS[1]; // default Bamboo Rafting

  const [itinerary, setItinerary] = useState<Destination[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

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
  };

  if (!destination) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <h2>Destinasi tidak ditemukan</h2>
        <Link to="/directory">Kembali ke Katalog</Link>
      </div>
    );
  }

  // Fallback images
  let mainImg = '/assets/balanting-paring.jpg';
  if (destination.name.toLowerCase().includes('haratai') || destination.name.toLowerCase().includes('air')) {
    mainImg = '/assets/Air-Terjun-Haratai.jpg';
  } else if (destination.name.toLowerCase().includes('langara') || destination.name.toLowerCase().includes('bukit')) {
    mainImg = '/assets/langara.jpg';
  } else if (destination.name.toLowerCase().includes('museum') || destination.name.toLowerCase().includes('budaya')) {
    mainImg = '/assets/museum-rakyat.jpg';
  }

  const scoreVal = destination.popularitas ? Math.round(destination.popularitas) : 96;
  const rankVal = destination.rank || 1;

  // Nearby destinations in < 10 km
  const nearbyPlaces = DESTINATIONS.filter((d) => d.id !== destination.id).slice(0, 3);

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* 1. Breadcrumbs Nav */}
        <div className="detail-nav-breadcrumbs">
          <Link to="/">Beranda</Link>
          <span>/</span>
          <Link to="/directory">Destinasi Wisata</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{destination.name}</span>
        </div>

        {/* 2. Hero Header Destinasi */}
        <div className="detail-hero-header">
          <div>
            <div className="detail-badges-row">
              <span className="detail-pill-rank">Peringkat #{rankVal} Wisata Air Hulu Sungai Selatan</span>
              <span className="detail-pill-score">
                <Icon.Compass size={13} />
                Skor Rekomendasi: {scoreVal} / 100
              </span>
              <span className="detail-pill-fav">Favorit Wisatawan Pegunungan Meratus</span>
            </div>

            <h1 className="detail-main-title">{destination.name}</h1>

            <div className="detail-location-sub">
              <Icon.Pin size={15} style={{ color: 'var(--meratus-clay)' }} />
              <span>{destination.location}</span>
              <span>•</span>
              <span>{destination.distance}</span>
            </div>
          </div>

          <div className="detail-header-actions">
            <button
              className={`btn-add-route ${isInRoute ? 'added' : 'not-added'}`}
              onClick={handleToggleRoute}
              style={{ width: 'auto', padding: '10px 20px', borderRadius: 9999 }}
            >
              {isInRoute ? (
                <>
                  <Icon.Check size={16} />
                  <span>Destinasi Ada di Rute Anda</span>
                </>
              ) : (
                <>
                  <Icon.Plus size={16} />
                  <span>+ Tambah ke Rute</span>
                </>
              )}
            </button>

            <a
              href={getGoogleMapsRouteUrl(destination)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-planner-ghost"
              style={{ padding: '9px 18px', borderRadius: 9999, textDecoration: 'none' }}
            >
              <Icon.Pin size={15} />
              <span>Google Maps</span>
            </a>
          </div>
        </div>

        {/* 3. Galeri Foto Multi-Grid */}
        <div className="detail-gallery-grid">
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
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Daya Tarik Utama
                </span>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Menembus Riam Amandit di Pangkuan Meratus</div>
              </div>
              <span style={{ fontSize: 12, opacity: 0.8 }}>1 / 4</span>
            </div>
          </div>

          <div className="detail-sub-photos-col">
            <div className="detail-sub-photo-item">
              <img src="/assets/balanting-paring.jpg" alt="Rakit Bambu" />
              <span className="detail-sub-photo-caption">Struktur Bambu Paring &amp; Rotan</span>
            </div>
            <div className="detail-sub-photo-item">
              <img src="/assets/Air-Terjun-Haratai.jpg" alt="Rest Area" />
              <span className="detail-sub-photo-caption">Rest Area Pasir Putih &amp; Batu Hitam</span>
            </div>
            <div className="detail-sub-photo-item">
              <img src="/assets/langara.jpg" alt="Panorama Meratus" />
              <span className="detail-sub-photo-caption">Panorama Lembah Karst Meratus</span>
            </div>
          </div>
        </div>

        {/* 4. Konten Dua Kolom (Grid 8 col & 4 col) */}
        <div className="detail-content-grid">
          {/* Left Column: Editorial Description & Features */}
          <div>
            <div className="detail-article-card">
              <h2 className="detail-section-title">Daya Tarik &amp; Eksplorasi Alam</h2>

              <p className="detail-article-text">
                Menyusuri jernihnya aliran Sungai Amandit di atas rakit bambu (<em>balanting paring</em>) adalah salah satu
                atraksi petualangan air paling ikonis di Kalimantan Selatan. Lahir dari kearifan leluhur suku Dayak Meratus
                yang dahulu memanfaatkan rakit guna mendistribusikan bambu paring ke pasar kota Kandangan, tradisi ini kini
                menjadi perjalanan magis menyusuri jantung Pegunungan Meratus.
              </p>

              <p className="detail-article-text">
                Selama sekitar 2 hingga 2,5 jam pengarungan dari dermaga hulu Loksado menuju dermaga penjemputan di Tanuhi atau
                Muara Hatip, Anda akan dipandu oleh seorang joki Dayak berpengalaman. Dengan sebatang galah bambu panjang, ia
                membaca kontur air, meliuk lincah di sela bebatuan karst, melintasi jeram riam yang berbusa menyegarkan,
                diselingi segmen air tenang berlatar tebing kapur dan kanopi rimbun rimba Kalimantan.
              </p>

              {/* 3 Feature Cards */}
              <div className="detail-features-grid">
                <div className="detail-feature-card">
                  <div className="detail-feature-title">🎋 Galah Bambu Dayak</div>
                  <p className="detail-feature-desc">
                    Kemahiran navigasi joki tradisional tanpa mesin mengendalikan rakit di arus deras.
                  </p>
                </div>

                <div className="detail-feature-card">
                  <div className="detail-feature-title">🌊 14 Riam Alami</div>
                  <p className="detail-feature-desc">
                    Sensasi jeram sedang yang mendebarkan namun tetap aman untuk keluarga dan pemula.
                  </p>
                </div>

                <div className="detail-feature-card">
                  <div className="detail-feature-title">🌿 Hutan Lindung Meratus</div>
                  <p className="detail-feature-desc">
                    Udara sejuk kaya oksigen di lembah bukit karst dengan pemandangan alami yang asri.
                  </p>
                </div>
              </div>

              {/* Facilities */}
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '32px 0 8px' }}>
                Fasilitas &amp; Kelengkapan Standar
              </h3>
              <p style={{ fontSize: 13, color: 'var(--meratus-subtle)', margin: '0 0 16px' }}>
                Terverifikasi Dinas Pemuda, Olahraga, dan Pariwisata Kabupaten Hulu Sungai Selatan
              </p>

              <div className="detail-facilities-grid">
                <div className="detail-facility-pill">
                  <span>🦺</span>
                  <span>Rompi Pelampung Berstandar</span>
                </div>
                <div className="detail-facility-pill">
                  <span>🛶</span>
                  <span>Dermaga Tambat &amp; Titik Jemput</span>
                </div>
                <div className="detail-facility-pill">
                  <span>🚿</span>
                  <span>Toilet &amp; Kamar Bilas Bersih</span>
                </div>
                <div className="detail-facility-pill">
                  <span>🏕️</span>
                  <span>Gazebo Istirahat Tepi Sungai</span>
                </div>
                <div className="detail-facility-pill">
                  <span>🍜</span>
                  <span>Kantin &amp; Kuliner Tradisional</span>
                </div>
                <div className="detail-facility-pill">
                  <span>🅿️</span>
                  <span>Area Parkir Kendaraan Luas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Practical Info Sidebar */}
          <div>
            <div className="detail-sidebar-card">
              {/* Price Headline */}
              <div className="detail-price-headline">
                <div className="detail-price-label">Biaya / Tarif Resmi</div>
                <div className="detail-price-value">{destination.entrance || 'Rp 300.000 / Rakit'}</div>
                <div style={{ fontSize: 11.5, color: '#8E4520', marginTop: 4 }}>
                  Kapasitas 2–3 penumpang + 1 Joki Dayak
                </div>
              </div>

              {/* Info Rows */}
              <div className="detail-info-list">
                <div className="detail-info-row">
                  <span className="detail-info-key">Durasi Trip:</span>
                  <span className="detail-info-val">~2 hingga 2.5 Jam</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-key">Jam Operasional:</span>
                  <span className="detail-info-val">{destination.hours || '07:30 – 16:30 WITA'}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-key">Titik Kumpul:</span>
                  <span className="detail-info-val">Dermaga Hulu Loksado</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-key">Tingkat Kesulitan:</span>
                  <span className="detail-info-val">Sedang (Family Friendly)</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn-planner-primary"
                  onClick={handleToggleRoute}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                  <Icon.Compass size={16} />
                  <span>{isInRoute ? '✓ Sudah Ada di Rute' : '+ Masukkan ke Perencana Rute'}</span>
                </button>

                <button
                  className="btn-planner-ghost"
                  onClick={() => navigate('/planner')}
                  style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                >
                  <span>Buka Perencana Perjalanan</span>
                  <Icon.ArrowRight size={14} />
                </button>
              </div>

              {/* Nearby Places in same corridor */}
              <div className="detail-nearby-box">
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--meratus-deep)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Pin size={14} style={{ color: 'var(--meratus-clay)' }} />
                  <span>Destinasi Terdekat (&lt; 10 km)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {nearbyPlaces.map((near) => (
                    <div
                      key={near.id}
                      onClick={() => navigate(`/destination/${near.id}`)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 12.5,
                        cursor: 'pointer',
                        padding: '6px 0',
                        borderBottom: '1px dashed var(--meratus-card-border)',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{near.name}</span>
                      <span style={{ color: 'var(--meratus-subtle)', fontSize: 11.5 }}>
                        {near.distance.split('·')[1]?.trim() || 'Dekat'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 96,
            right: 24,
            background: 'var(--meratus-deep)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 600,
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            zIndex: 1200,
          }}
        >
          {notification}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
