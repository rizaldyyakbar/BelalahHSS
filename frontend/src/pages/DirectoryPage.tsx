import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StickyRouteSummaryBar from '../components/composite/StickyRouteSummaryBar';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { fetchRecommendations } from '../services/api';

export const DirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'Semua';

  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortOption, setSortOption] = useState<string>('saw');
  const [itinerary, setItinerary] = useState<Destination[]>([]);

  // Load itinerary from localStorage on mount
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

  const categoryMapToId: Record<string, number | undefined> = {
    'Semua': undefined,
    'Wisata Alam': 1,
    'Wisata Budaya': 2,
    'Petualangan': 3,
    'Petualangan Sungai': 3,
  };

  // Fetch live destinations from backend with live search and category query
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      const catId = categoryMapToId[selectedCategory];
      const res = await fetchRecommendations({
        limit: 50,
        search: searchQuery.trim() || undefined,
        category_id: catId,
      });
      if (isMounted && res.destinations && res.destinations.length > 0) {
        setDestinations(res.destinations);
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory]);

  const saveItinerary = (updated: Destination[]) => {
    setItinerary(updated);
    localStorage.setItem('belalah_itinerary', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleToggleRoute = (dest: Destination) => {
    if (itinerary.some((d) => d.id === dest.id)) {
      saveItinerary(itinerary.filter((d) => d.id !== dest.id));
    } else {
      saveItinerary([...itinerary, dest]);
    }
  };

  // Category counts
  const categoriesList = [
    { label: 'Semua', count: destinations.length },
    {
      label: 'Wisata Alam',
      count: destinations.filter((d) => d.category === 'Alam').length,
    },
    {
      label: 'Wisata Budaya',
      count: destinations.filter((d) => d.category === 'Budaya' || d.name.toLowerCase().includes('adat') || d.name.toLowerCase().includes('museum')).length,
    },
    {
      label: 'Air Terjun',
      count: destinations.filter((d) => d.name.toLowerCase().includes('air') || d.name.toLowerCase().includes('riam')).length,
    },
    {
      label: 'Petualangan Sungai',
      count: destinations.filter((d) => d.name.toLowerCase().includes('rafting') || d.name.toLowerCase().includes('sungai') || d.name.toLowerCase().includes('panas')).length,
    },
  ];

  // Filtering & Sorting
  const filtered = destinations.filter((dest) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      dest.name.toLowerCase().includes(q) ||
      (dest.description && dest.description.toLowerCase().includes(q)) ||
      (dest.region && dest.region.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedCategory === 'Semua') return true;
    if (selectedCategory === 'Wisata Alam') return dest.category === 'Alam';
    if (selectedCategory === 'Wisata Budaya') return dest.category === 'Budaya' || dest.name.toLowerCase().includes('adat');
    if (selectedCategory === 'Air Terjun') return dest.name.toLowerCase().includes('air') || dest.name.toLowerCase().includes('riam');
    if (selectedCategory === 'Petualangan Sungai') return dest.name.toLowerCase().includes('rafting') || dest.name.toLowerCase().includes('sungai');
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'saw') {
      return (b.popularitas || 0) - (a.popularitas || 0);
    }
    if (sortOption === 'price_asc') {
      return (a.price || 0) - (b.price || 0);
    }
    return 0;
  });

  // Category tag label helper
  const getCategoryBadge = (dest: Destination) => {
    const n = dest.name.toLowerCase();
    if (n.includes('bamboo') || n.includes('rafting')) return 'WISATA PETUALANGAN';
    if (n.includes('haratai')) return 'WISATA ALAM LINDUNG';
    if (n.includes('malutu')) return 'WISATA TIRTA KELUARGA';
    if (n.includes('langara')) return 'TREKKING KARST MERATUS';
    if (n.includes('tanuhi')) return 'PEMANDIAN AIR PANAS';
    if (n.includes('malaris') || n.includes('adat') || n.includes('museum')) return 'BUDAYA ADAT DAYAK';
    return `${(dest.category || 'Wisata').toUpperCase()} MERATUS`;
  };

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, paddingBottom: 90 }}>
        {/* Top Header & Search Bar */}
        <section className="bh-container" style={{ paddingTop: 96, paddingBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#994700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: 4,
                }}
              >
                HULU SUNGAI SELATAN • MERATUS
              </span>
              <h1
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px, 4vw, 38px)',
                  fontWeight: 800,
                  color: 'var(--meratus-deep)',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                }}
              >
                Katalog Destinasi Wisata
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--meratus-muted)' }}>
                Jelajahi {destinations.length} destinasi alam, budaya, riam, dan air terjun dengan rekomendasi cerdas.
              </p>
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-end' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#57534E', textTransform: 'uppercase' }}>
                Urutkan:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #E2EAE4',
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--meratus-deep)',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <option value="saw">Skor Rekomendasi (SAW) ▾</option>
                <option value="price_asc">Biaya Terjangkau ▾</option>
              </select>
            </div>
          </div>

          {/* Search Input Box */}
          <div
            style={{
              position: 'relative',
              background: '#ffffff',
              border: '1.5px solid #E2EAE4',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              marginBottom: 16,
            }}
          >
            <Icon.Search size={18} style={{ color: '#012D1D', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Cari air terjun, bukit, sungai, gua, balai adat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: 14,
                color: '#1A1611',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#6E7972', cursor: 'pointer', fontSize: 18 }}
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter Pills (Responsive Wrap on Desktop, Scroll on Mobile) */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 20,
            }}
          >
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
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
                    flex: '0 0 auto',
                    boxShadow: active ? '0 2px 8px rgba(1, 45, 29, 0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Destination Cards Grid (3 Columns on Desktop, Responsive) */}
        <section className="bh-container">
          <div className="directory-cards-grid">
            {sorted.map((dest, index) => {
              const isInRoute = itinerary.some((d) => d.id === dest.id);

              // Fallback image
              let imgSrc = '/assets/balanting-paring.jpg';
              if (dest.name.toLowerCase().includes('haratai') || dest.name.toLowerCase().includes('air')) {
                imgSrc = '/assets/Air-Terjun-Haratai.jpg';
              } else if (dest.name.toLowerCase().includes('malutu') || dest.name.toLowerCase().includes('bendungan')) {
                imgSrc = '/assets/malutu.jpg';
              } else if (dest.name.toLowerCase().includes('tanuhi') || dest.name.toLowerCase().includes('panas')) {
                imgSrc = '/assets/tanuhi.jpg';
              } else if (dest.name.toLowerCase().includes('langara') || dest.name.toLowerCase().includes('bukit')) {
                imgSrc = '/assets/langara.jpg';
              } else if (dest.name.toLowerCase().includes('malaris') || dest.name.toLowerCase().includes('adat')) {
                imgSrc = '/assets/museum-rakyat.jpg';
              }

              // Distance tag
              const kmMatch = dest.distance?.match(/(\d+(?:\.\d+)?)\s*km/i);
              const distKm = kmMatch
                ? kmMatch[1]
                : (dest as any).distance_km !== undefined
                  ? Number((dest as any).distance_km).toFixed(1)
                  : `${30 + index * 4}`;

              // Pricing label
              const isRafting = dest.name.toLowerCase().includes('rafting');
              const priceCategory = isRafting ? 'TARIF RAKIT' : 'TIKET / ORG';
              const priceText = isRafting
                ? 'Rp 300.000 / Rakit'
                : dest.price
                  ? `Rp ${dest.price.toLocaleString('id-ID')} / Org`
                  : (dest.entrance || 'Rp 10.000 / Org');

              return (
                <div
                  key={dest.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #EBEFEA',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Media with Category & Distance Pills */}
                  <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' }}>
                    <img
                      src={imgSrc}
                      alt={dest.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                      }}
                    />

                    {/* Category Pill (Bottom Left) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 10,
                        background: '#FD934C',
                        color: '#ffffff',
                        fontSize: 9.5,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        padding: '3px 8px',
                        borderRadius: 9999,
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {getCategoryBadge(dest)}
                    </div>

                    {/* Distance Pill (Bottom Right) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 10,
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 9999,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Icon.Compass size={11} style={{ color: '#C1ECD4' }} />
                      <span>{distKm} km</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: 16.5,
                        fontWeight: 700,
                        color: 'var(--meratus-deep)',
                        margin: '0 0 4px',
                        lineHeight: 1.25,
                      }}
                    >
                      {dest.name}
                    </h3>

                    <p
                      style={{
                        fontSize: 12,
                        color: '#57534E',
                        margin: '0 0 12px',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {dest.description || 'Destinasi wisata unggulan di kawasan Pegunungan Meratus, Hulu Sungai Selatan.'}
                    </p>

                    {/* Price & Actions Row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 8,
                        borderTop: '1px solid #F0F4F1',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#6E7972', letterSpacing: '0.04em' }}>
                          {priceCategory}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#012D1D', marginTop: 1 }}>
                          {priceText}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => navigate(`/destination/${dest.id}`)}
                          style={{
                            height: 34,
                            padding: '0 12px',
                            borderRadius: 10,
                            border: '1px solid #E2EAE4',
                            background: '#F1F4F1',
                            color: '#1A1611',
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Detail
                        </button>

                        <button
                          onClick={() => handleToggleRoute(dest)}
                          style={{
                            height: 34,
                            padding: '0 12px',
                            borderRadius: 10,
                            border: 'none',
                            background: isInRoute ? '#012D1D' : '#012D1D',
                            color: '#ffffff',
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {isInRoute ? (
                            <>
                              <Icon.Check size={13} color="#C1ECD4" />
                              <span>Ditambah</span>
                            </>
                          ) : (
                            <span>+ Rute</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Tips Rute Berkelanjutan Card (Figma Image 5) */}
            <div
              style={{
                background: '#EDF5F0',
                border: '1px solid #D7E5DC',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#FFF3EB',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FD934C',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                💡
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#012D1D', margin: '0 0 3px' }}>
                  Tips Rute Berkelanjutan
                </h4>
                <p style={{ fontSize: 11.5, color: '#57534E', margin: 0, lineHeight: 1.45 }}>
                  Rekomendasi ideal 2–3 destinasi per hari untuk rute yang nyaman dan aman saat menyusuri topografi pegunungan Meratus.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Route Summary Bar */}
      <StickyRouteSummaryBar
        selectedDestinations={itinerary}
        onContinue={() => navigate('/planner')}
      />

      <Footer />
    </div>
  );
};

export default DirectoryPage;
