import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import {
  fetchDestinationById,
  fetchRecommendations,
  getGoogleMapsRouteUrl,
  fetchNearbyFacilities,
  getGoogleMapsSearchUrl,
  ApiFacility,
} from '../services/api';
import { calculateHaversineDistance, estimateRoadDistanceKm, formatDistanceKm, parseCoords } from '../utils/geo';
import { getImageUrl } from '../utils/imageUrl';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<Destination | null>(() => {
    return DESTINATIONS.find((d) => d.id === Number(id)) || null;
  });
  const [loading, setLoading] = useState<boolean>(!destination);
  const [allDestinations, setAllDestinations] = useState<Destination[]>(DESTINATIONS);
  const [nearbyFacilities, setNearbyFacilities] = useState<ApiFacility[]>([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('all');

  const filteredFacilities = useMemo(() => {
    if (selectedFacilityType === 'all') return nearbyFacilities;
    return nearbyFacilities.filter((f) => f.type === selectedFacilityType);
  }, [nearbyFacilities, selectedFacilityType]);

  const [itinerary, setItinerary] = useState<Destination[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDetail = async () => {
      if (!id) return;
      const data = await fetchDestinationById(Number(id));
      if (isMounted) {
        if (data) {
          setDestination(data);
          const lat = typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude;
          const lng = typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude;
          if (lat && lng) {
            fetchNearbyFacilities(lat, lng).then((facs) => {
              if (isMounted) setNearbyFacilities(facs);
            });
          }
        }
        setLoading(false);
      }
    };
    loadDetail();

    fetchRecommendations({ limit: 50 }).then((res) => {
      if (isMounted && res.destinations.length > 0) {
        setAllDestinations(res.destinations);
      }
    });

    if (destination?.latitude && destination?.longitude) {
      const lat = typeof destination.latitude === 'string' ? parseFloat(destination.latitude) : destination.latitude;
      const lng = typeof destination.longitude === 'string' ? parseFloat(destination.longitude) : destination.longitude;
      if (lat && lng) {
        fetchNearbyFacilities(lat, lng).then((facs) => {
          if (isMounted) setNearbyFacilities(facs);
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (loading && !destination) {
    return (
      <div style={{ padding: 120, textAlign: 'center', background: 'var(--meratus-bg)', minHeight: '100vh' }}>
        <Header />
        <h2 style={{ color: 'var(--meratus-deep)' }}>Memuat informasi destinasi...</h2>
      </div>
    );
  }

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

  // Photos resolution dynamically from backend data
  const mainImg = getImageUrl(destination.img);
  const rawPhotos = (destination.photos || []).filter(
    (p) => typeof p === 'string' && (p.startsWith('http://') || p.startsWith('https://'))
  );
  const hasSubPhotos = rawPhotos.length >= 2;
  const subImg1 = hasSubPhotos ? getImageUrl(rawPhotos[0]) : null;
  const subImg2 = hasSubPhotos ? getImageUrl(rawPhotos[1]) : null;

  const isAdventure = (destination.category || '').toLowerCase().includes('petualang');
  const isRafting = destination.name.toLowerCase().includes('rafting') || isAdventure;
  const priceDisplay = destination.entrance || 'Hubungi pengelola';
  const durationDisplay = isAdventure ? '2–3 Jam' : (destination.hours || '08.00 – 17.00 WITA');

  // Dynamic nearby waypoint recommendations calculated via Haversine distance
  const currentCoords = parseCoords(destination);
  const nearbyPlaces = allDestinations
    .filter((d) => d.id !== destination.id)
    .map((d) => {
      const dCoords = parseCoords(d);
      let distKm = 10;
      if (currentCoords && dCoords) {
        distKm = estimateRoadDistanceKm(
          calculateHaversineDistance(currentCoords.lat, currentCoords.lng, dCoords.lat, dCoords.lng)
        );
      }
      return {
        ...d,
        calculatedDistKm: distKm,
        calculatedDistStr: formatDistanceKm(distKm),
      };
    })
    .sort((a, b) => a.calculatedDistKm - b.calculatedDistKm)
    .slice(0, 3);

  const getFacilityIcon = (icon?: string, name?: string) => {
    const text = `${icon || ''} ${name || ''}`.toLowerCase();
    if (text.includes('parkir') || text.includes('parking')) return '🅿️';
    if (text.includes('makan') || text.includes('kuliner') || text.includes('kantin') || text.includes('fork') || text.includes('warung')) return '🍽️';
    if (text.includes('inap') || text.includes('bed') || text.includes('lodge') || text.includes('gazebo')) return '🛏️';
    if (text.includes('foto') || text.includes('camera') || text.includes('selfie')) return '📷';
    if (text.includes('sholat') || text.includes('musholla') || text.includes('masjid')) return '🕌';
    if (text.includes('toilet') || text.includes('wc') || text.includes('bilas')) return '🚿';
    if (text.includes('pelampung') || text.includes('life') || text.includes('shield') || text.includes('retribusi')) return '🛡️';
    if (text.includes('rakit') || text.includes('boat') || text.includes('tubing')) return '🚣';
    return '📍';
  };

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
          <span style={{ color: 'var(--meratus-subtle)' }}>{destination.region || destination.category || 'HSS'}</span>
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
                {destination.distance || 'Hulu Sungai Selatan'}
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

        {/* 3. Media Gallery (2-Column Desktop Grid or Full Hero) */}
        <section
          className="detail-gallery-grid"
          style={hasSubPhotos ? undefined : { gridTemplateColumns: '1fr' }}
        >
          {/* Main Hero Photo */}
          <div className="detail-main-photo-box">
            <img
              src={mainImg}
              alt={destination.name}
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="detail-main-photo-caption">
              <div>
                <strong style={{ fontSize: 14 }}>{destination.name}</strong>
                <div style={{ fontSize: 11.5, opacity: 0.85 }}>{destination.location || 'Kabupaten Hulu Sungai Selatan'}</div>
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

          {/* Sub Photos (Side Column on Desktop, only shown when authentic extra photos exist) */}
          {hasSubPhotos && subImg1 && subImg2 && (
            <div className="detail-sub-photos-col">
              <div className="detail-sub-photo-item">
                <img
                  src={subImg1}
                  alt={`${destination.name} 1`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="detail-sub-photo-caption">Sudut Wisata {destination.name}</div>
              </div>

              <div className="detail-sub-photo-item">
                <img
                  src={subImg2}
                  alt={`${destination.name} 2`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="detail-sub-photo-caption">Suasana {destination.name}</div>
              </div>
            </div>
          )}
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
                <span>👥 {isAdventure ? 'Didampingi Pemandu Lokal' : 'Semua Usia & Wisatawan'}</span>
              </span>
              <span style={{ background: '#F5EFE6', color: '#6A432D', padding: '8px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>👨‍👩‍👧 Ramah Keluarga &amp; Pengunjung</span>
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

              {/* Highlight Feature Cards */}
              <div className="detail-features-grid">
                <div className="detail-feature-card">
                  {(destination.facilities || []).slice(0,3).map((f) => (
                    <div className="detail-feature-item" key={f.name}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>
                        {getFacilityIcon(f.icon, f.name)}
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
                Kenyamanan sarana dan sarana pendukung yang tersedia di sekitar lokasi destinasi:
              </p>

              <div className="detail-facilities-grid">
                {(destination.facilities || []).map((f) => (
                  <div className="detail-facility-pill" key={f.name}>
                    <span>{getFacilityIcon(f.icon, f.name)}</span>
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fasilitas Terdekat (Akomodasi, Kuliner, SPBU, Ibadah) dengan integrasi Google Maps */}
            <div className="detail-article-card" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                <h3 className="detail-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📍 Fasilitas &amp; Layanan Sekitar</span>
                </h3>
                <span style={{ fontSize: 11.5, background: '#EAF4EE', color: '#012D1D', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                  Basis Data Terpadu HSS
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--meratus-muted)', marginBottom: 18, lineHeight: 1.5 }}>
                Penginapan, sentra kuliner khas, SPBU/pertashop, dan sarana ibadah terdekat di sekitar {destination.name} yang terdata dalam sistem:
              </p>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
                {[
                  { key: 'all', label: `Semua (${nearbyFacilities.length})` },
                  { key: 'penginapan', label: '🛏️ Penginapan' },
                  { key: 'kuliner', label: '🍽️ Kuliner' },
                  { key: 'spbu', label: '⛽ SPBU' },
                  { key: 'masjid', label: '🕌 Masjid' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedFacilityType(cat.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 9999,
                      border: selectedFacilityType === cat.key ? '1px solid #012D1D' : '1px solid #D7E5DC',
                      background: selectedFacilityType === cat.key ? '#012D1D' : '#F4F8F5',
                      color: selectedFacilityType === cat.key ? '#ffffff' : '#012D1D',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* List of nearby facilities */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.slice(0, 8).map((fac: ApiFacility) => {
                    const typeLabel =
                      fac.type === 'penginapan' ? '🛏️ Penginapan' :
                      fac.type === 'kuliner' ? '🍽️ Kuliner' :
                      fac.type === 'spbu' ? '⛽ SPBU' :
                      fac.type === 'masjid' ? '🕌 Masjid' : '📍 Fasilitas';

                    const mapsUrl = fac.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`;

                    return (
                      <div
                        key={fac.id}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #E2EAE4',
                          borderRadius: 14,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 14,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                background: '#F1F5F2',
                                color: '#012D1D',
                                padding: '2px 8px',
                                borderRadius: 6,
                              }}
                            >
                              {typeLabel}
                            </span>
                            {fac.rating && (
                              <span style={{ fontSize: 11, color: '#C26B3C', fontWeight: 700 }}>
                                ★ {Number(fac.rating).toFixed(1)}
                              </span>
                            )}
                            {fac.distance_km !== undefined && fac.distance_km !== null && (
                              <span style={{ fontSize: 11, color: '#6E7972' }}>
                                • ~{fac.distance_km} km dari sini
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 14.5,
                              fontWeight: 700,
                              color: 'var(--meratus-deep)',
                              marginBottom: 2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {fac.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--meratus-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {fac.address || 'Hulu Sungai Selatan'}
                          </div>
                        </div>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#012D1D',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '8px 14px',
                            borderRadius: 10,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            flexShrink: 0,
                            boxShadow: '0 2px 6px rgba(1, 45, 29, 0.2)',
                            transition: 'all 0.15s ease',
                          }}
                          title={`Buka ${fac.name} di Google Maps`}
                        >
                          <span>🗺️ Buka Rute</span>
                          <span style={{ fontSize: 11 }}>↗</span>
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: 12.5, color: '#6E7972', fontStyle: 'italic', padding: '16px 0', textAlign: 'center', background: '#F8FAF8', borderRadius: 12 }}>
                    {nearbyFacilities.length === 0
                      ? 'Memuat daftar fasilitas pendukung dari basis data...'
                      : `Tidak ada fasilitas kategori "${selectedFacilityType}" dalam radius 30 km.`}
                  </div>
                )}
              </div>

              {/* Quick Intent Buttons to Google Maps */}
              <div
                style={{
                  background: '#F8FAF8',
                  border: '1px dashed #C1DBC9',
                  borderRadius: 12,
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--meratus-deep)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🔍 Pencarian Cepat di Sekitar via Google Maps</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { label: '🛏️ Penginapan Terdekat', query: 'Penginapan Homestay Hotel' },
                    { label: '🍽️ Warung Makan & Kuliner', query: 'Warung Makan Rumah Makan Ketupat Kandangan' },
                    { label: '⛽ SPBU & Pertashop', query: 'SPBU Pertashop Pom Bensin' },
                    { label: '🕌 Masjid & Musholla', query: 'Masjid Musholla' },
                    { label: '🏧 Minimarket & ATM', query: 'Minimarket ATM Indomaret Alfamart' },
                  ].map((item) => {
                    const destLat = typeof destination.latitude === 'string' ? parseFloat(destination.latitude) : destination.latitude;
                    const destLng = typeof destination.longitude === 'string' ? parseFloat(destination.longitude) : destination.longitude;
                    const searchUrl = getGoogleMapsSearchUrl(item.query, destLat, destLng);

                    return (
                      <a
                        key={item.label}
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#ffffff',
                          border: '1px solid #D7E5DC',
                          color: '#012D1D',
                          textDecoration: 'none',
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          transition: 'all 0.15s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                      >
                        <span>{item.label}</span>
                        <span style={{ fontSize: 10, color: '#C26B3C' }}>↗</span>
                      </a>
                    );
                  })}
                </div>
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
                  const inItin = itinerary.some((d) => d.id === place.id);

                  return (
                    <div
                      key={place.id}
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
                          {place.calculatedDistStr} dari sini • {place.category || 'Wisata HSS'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (!inItin) {
                            const updated = [...itinerary, place];
                            setItinerary(updated);
                            localStorage.setItem('belalah_itinerary', JSON.stringify(updated));
                            window.dispatchEvent(new Event('storage'));
                            showToast(`${place.name} ditambahkan ke rute!`);
                          }
                        }}
                        disabled={inItin}
                        style={{
                          background: inItin ? '#012D1D' : '#EDF5F0',
                          border: 'none',
                          color: inItin ? '#ffffff' : '#012D1D',
                          borderRadius: 8,
                          padding: '7px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: inItin ? 'default' : 'pointer',
                          transition: 'all 0.15s ease',
                          flexShrink: 0,
                        }}
                      >
                        {inItin ? '✓ Ada di Rute' : '+ Sisipkan'}
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
          background: '#ffffff',
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
