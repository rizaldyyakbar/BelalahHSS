import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StickyRouteSummaryBar from '../components/composite/StickyRouteSummaryBar';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { fetchRecommendations, fetchCategories, ApiCategory } from '../services/api';
import { calculateHaversineDistance, estimateRoadDistanceKm, formatDistanceKm, parseCoords } from '../utils/geo';
import { getImageUrl } from '../utils/imageUrl';

export const DirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'Semua';

  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortOption, setSortOption] = useState<string>('saw');
  const [itinerary, setItinerary] = useState<Destination[]>([]);

  // Load itinerary from localStorage on mount (clears out old hardcoded default on v2)
  useEffect(() => {
    const initialized = localStorage.getItem('belalah_itinerary_v2');
    if (!initialized) {
      localStorage.removeItem('belalah_itinerary');
      localStorage.setItem('belalah_itinerary_v2', 'true');
      setItinerary([]);
      return;
    }
    const saved = localStorage.getItem('belalah_itinerary');
    if (saved) {
      try {
        setItinerary(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Fetch dynamic categories from backend
  useEffect(() => {
    let isMounted = true;
    fetchCategories().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setCategories(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Category ID resolution for API querying
  const activeCategoryId = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'Semua') return undefined;
    const match = categories.find(
      (c) => c.name.toLowerCase() === selectedCategory.toLowerCase() ||
             selectedCategory.toLowerCase().includes(c.name.toLowerCase()) ||
             c.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    return match ? match.id : undefined;
  }, [selectedCategory, categories]);

  // Fetch live destinations from backend with live search and category query
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      const res = await fetchRecommendations({
        limit: 50,
        search: searchQuery.trim() || undefined,
        category_id: activeCategoryId,
      });
      if (isMounted && res.destinations && res.destinations.length > 0) {
        setDestinations(res.destinations);
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, activeCategoryId]);

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

  // Dynamic category pills list with real counts
  const categoriesList = useMemo(() => {
    const list = [{ label: 'Semua', count: destinations.length }];

    if (categories.length > 0) {
      categories.forEach((cat) => {
        const count = destinations.filter((d) => {
          if (!d.category) return false;
          return d.category.toLowerCase().includes(cat.name.toLowerCase()) ||
                 cat.name.toLowerCase().includes(d.category.toLowerCase());
        }).length;

        list.push({
          label: cat.name,
          count: count > 0 ? count : (cat.destinations_count || 0),
        });
      });
    } else {
      // Fallback categories if API is offline
      list.push(
        {
          label: 'Wisata Alam',
          count: destinations.filter((d) => d.category?.toLowerCase().includes('alam')).length,
        },
        {
          label: 'Wisata Budaya',
          count: destinations.filter((d) => d.category?.toLowerCase().includes('budaya') || d.name.toLowerCase().includes('adat') || d.name.toLowerCase().includes('museum')).length,
        },
        {
          label: 'Petualangan',
          count: destinations.filter((d) => d.category?.toLowerCase().includes('petualangan') || d.name.toLowerCase().includes('rafting') || d.name.toLowerCase().includes('sungai')).length,
        }
      );
    }

    return list;
  }, [categories, destinations]);

  // Filtering & Sorting
  const filtered = destinations.filter((dest) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      dest.name.toLowerCase().includes(q) ||
      (dest.description && dest.description.toLowerCase().includes(q)) ||
      (dest.region && dest.region.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedCategory === 'Semua') return true;

    const destCat = (dest.category || '').toLowerCase();
    const selCat = selectedCategory.toLowerCase();

    return (
      destCat.includes(selCat) ||
      selCat.includes(destCat) ||
      (selCat.includes('alam') && destCat.includes('alam')) ||
      (selCat.includes('budaya') && (destCat.includes('budaya') || dest.name.toLowerCase().includes('adat'))) ||
      (selCat.includes('terjun') && (dest.name.toLowerCase().includes('air') || dest.name.toLowerCase().includes('riam'))) ||
      (selCat.includes('sungai') && (dest.name.toLowerCase().includes('rafting') || dest.name.toLowerCase().includes('sungai')))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'saw') {
      return (b.popularitas || 0) - (a.popularitas || 0);
    }
    if (sortOption === 'price_asc') {
      const getVal = (d: Destination) => {
        if (d.price !== undefined) {
          return d.price < 1000 ? d.price * 1000 : d.price;
        }
        if (d.entrance) {
          const num = parseInt(d.entrance.replace(/\D/g, ''), 10);
          if (!isNaN(num)) return num;
        }
        return 10000;
      };
      return getVal(a) - getVal(b);
    }
    return 0;
  });

  // Dynamic Category Badge helper
  const getCategoryBadge = (dest: Destination) => {
    if (dest.category) {
      return dest.category.toUpperCase();
    }
    return 'WISATA MERATUS';
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

              // Image resolution
              let imgSrc = getImageUrl(dest.img);
              if (dest.img && (dest.img.startsWith('http://') || dest.img.startsWith('https://'))) {
                imgSrc = dest.img;
              }

              // Dynamic distance tag from Basecamp Kandangan
              let distKm = '25.0';
              const coords = parseCoords(dest);
              if (coords) {
                const calculatedKm = estimateRoadDistanceKm(
                  calculateHaversineDistance(-2.7758, 115.2635, coords.lat, coords.lng)
                );
                distKm = calculatedKm.toFixed(1);
              } else if (dest.distance) {
                const kmMatch = dest.distance.match(/(\d+(?:\.\d+)?)\s*km/i);
                if (kmMatch && kmMatch[1]) distKm = kmMatch[1];
              } else if ((dest as any).distance_km !== undefined) {
                distKm = Number((dest as any).distance_km).toFixed(1);
              }

              // Pricing label
              const isRafting = dest.name.toLowerCase().includes('rafting');
              const priceCategory = isRafting ? 'TARIF RAKIT' : 'TIKET / ORG';
              let priceText = 'Rp 10.000 / Org';
              if (isRafting) {
                priceText = 'Rp 300.000 / Rakit';
              } else if (dest.entrance) {
                const lower = dest.entrance.toLowerCase();
                if (lower.includes('rakit') || lower.includes('/ org') || lower.includes('gratis') || lower.includes('sukarela')) {
                  priceText = dest.entrance;
                } else {
                  priceText = `${dest.entrance} / Org`;
                }
              } else if (dest.price !== undefined) {
                const normalized = dest.price < 1000 ? dest.price * 1000 : dest.price;
                priceText = `Rp ${normalized.toLocaleString('id-ID')} / Org`;
              }

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
                      loading="lazy"
                      decoding="async"
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
                        background: 'rgba(0, 0, 0, 0.72)',
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
        onClear={() => saveItinerary([])}
      />

      <Footer />
    </div>
  );
};

export default DirectoryPage;
