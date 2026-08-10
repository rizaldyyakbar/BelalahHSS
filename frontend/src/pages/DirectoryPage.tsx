import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import DestinationCard from '../components/composite/DestinationCard';
import Chip from '../components/atomic/Chip';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { fetchRecommendations } from '../services/api';

export const DirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      setLoading(true);
      const res = await fetchRecommendations({ limit: 50 });
      if (isMounted) {
        setDestinations(res.destinations);
        setLoading(false);
      }
    };
    loadAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['Semua', 'Alam', 'Budaya', 'Kuliner', 'Penginapan'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' ||
      dest.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 32px 60px' }}>
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sage-dark)',
          }}>
            Direktori Pariwisata HSS
          </span>
          <h1 className="bh-serif" style={{ fontSize: 44, fontWeight: 500, margin: '8px 0 16px', color: 'var(--ink)' }}>
            Eksplorasi Seluruh Destinasi
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 600, margin: '0 auto' }}>
            Temukan tempat wisata alam, kebudayaan khas Dayak Loksado, hingga kuliner autentik Kandangan.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 24px',
          marginBottom: 40,
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--sage)' : 'rgba(255, 255, 255, 0.6)',
                  color: selectedCategory === cat ? '#fff' : 'var(--ink-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  padding: '8px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '6px 16px',
            width: 300,
          }}>
            <Icon.Search size={18} style={{ color: 'var(--ink-3)', marginRight: 8 }} />
            <input
              type="text"
              placeholder="Cari destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: 14,
                color: 'var(--ink)',
              }}
            />
          </div>
        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onViewDetail={() => navigate(`/destination/${dest.id}`)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)' }}>
            <h3 className="bh-serif" style={{ fontSize: 24 }}>Tidak ada destinasi ditemukan</h3>
            <p>Coba kata kunci pencarian lain atau ganti kategori filter.</p>
          </div>
        )}
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default DirectoryPage;
