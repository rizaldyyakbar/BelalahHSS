import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../atomic/Icons';
import { fetchCategories, ApiCategory } from '../../services/api';

interface CategoryCardItem {
  id: string | number;
  name: string;
  icon: string;
  count: string;
  description: string;
  image: string;
  filterKey: string;
}

const CATEGORY_META: Record<string, { icon: string; description: string; image: string }> = {
  'wisata-alam': {
    icon: '🌿',
    description: 'Pegunungan Meratus, rimba lindung, dan panorama hijau asri khas Hulu Sungai Selatan.',
    image: '/assets/langara.jpg',
  },
  'wisata-budaya': {
    icon: '🏛️',
    description: 'Balai Adat Malaris, Rumah Adat Dayak Bukit, museum, dan warisan kearifan lokal.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Balai_Adat_Malaris.jpg/1280px-Balai_Adat_Malaris.jpg',
  },
  'petualangan': {
    icon: '🚣',
    description: 'Bamboo rafting Sungai Amandit, arung riam alami, dan ekspedisi rimba Meratus.',
    image: '/assets/balanting-paring.jpg',
  },
};

export const BrowseByCategory: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchCategories()
      .then((apiCats) => {
        if (!isMounted) return;

        if (Array.isArray(apiCats) && apiCats.length > 0) {
          // Only show authentic tourism destination categories (Wisata Alam, Budaya, Petualangan)
          const tourismCats = apiCats.filter((cat: ApiCategory) => {
            const lower = (cat.name || '').toLowerCase();
            return !lower.includes('kuliner') && !lower.includes('religi');
          });

          const dynamicCards: CategoryCardItem[] = tourismCats.map((cat: ApiCategory) => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
            const fallbackMeta = CATEGORY_META[slug] || {
              icon: '📍',
              description: `Jelajahi ragam destinasi ${cat.name} terbaik di Kabupaten Hulu Sungai Selatan.`,
              image: '/assets/balanting-paring.jpg',
            };

            const countNum = cat.destinations_count !== undefined ? cat.destinations_count : 0;
            const countLabel = `${countNum} DESTINASI`;

            return {
              id: cat.id,
              name: cat.name,
              icon: cat.icon || fallbackMeta.icon,
              count: countLabel,
              description: cat.description || fallbackMeta.description,
              image: fallbackMeta.image || cat.image_url || '/assets/balanting-paring.jpg',
              filterKey: cat.name,
            };
          });

          setCategories(dynamicCards);
        }
      })
      .catch((err) => {
        console.error('[BrowseByCategory] Error loading categories:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (cat: CategoryCardItem) => {
    navigate(`/directory?category=${encodeURIComponent(cat.filterKey)}`);
  };

  return (
    <section className="bh-container section-browse-category" style={{ marginTop: 52 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 28px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(42, 102, 80, 0.08)',
            border: '1px solid rgba(42, 102, 80, 0.2)',
            borderRadius: 9999,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--meratus-primary)',
            marginBottom: 10,
          }}
        >
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
          Kategori Destinasi ({categories.length} Kategori)
        </div>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(28px, 3.5vw, 36px)',
            fontWeight: 700,
            color: 'var(--meratus-deep)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}
        >
          Jelajahi Berdasarkan Kategori
        </h2>
        <p
          style={{
            fontSize: 15,
            color: 'var(--meratus-muted)',
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          Klasifikasi destinasi wisata di Kabupaten Hulu Sungai Selatan untuk membantu perencanaan perjalanan Anda.
        </p>
      </div>

      {/* Grid or Skeleton */}
      {loading ? (
        <div className="category-figma-grid">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 18,
                background: '#f1f5f3',
                height: 280,
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="category-figma-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-figma-card"
              onClick={() => handleCategoryClick(cat)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-figma-media">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                  }}
                />
                <span className="category-count-badge">{cat.count}</span>
                <span className="category-name-badge">
                  {cat.icon} {cat.name}
                </span>
              </div>

              <div className="category-figma-body">
                <p className="category-figma-desc">{cat.description}</p>
                <div className="category-figma-link">
                  <span>
                    {cat.name.toLowerCase().includes('kuliner')
                      ? 'Lihat rekomendasi titik singgah'
                      : 'Lihat destinasi kategori ini'}
                  </span>
                  <Icon.ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BrowseByCategory;
