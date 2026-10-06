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
    image: '/assets/museum-rakyat.jpg',
  },
  'petualangan': {
    icon: '🚣',
    description: 'Bamboo rafting Sungai Amandit, arung riam alami, dan ekspedisi rimba Meratus.',
    image: '/assets/balanting-paring.jpg',
  },
  'religi': {
    icon: '🕌',
    description: 'Ziarah makam ulama kharismatik dan situs spiritual bersejarah di bumi Antaludin.',
    image: '/assets/museum-rakyat.jpg',
  },
  'kuliner': {
    icon: '🍲',
    description: 'Ketupat Kandangan otentik, dodol HSS, dan ragam kuliner khas Banjar Pahuluan.',
    image: '/assets/balanting-paring.jpg',
  },
};

export const BrowseByCategory: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryCardItem[]>([
    {
      id: 'wisata-alam',
      name: 'Wisata Alam',
      icon: '🌿',
      count: '16 DESTINASI',
      description: 'Pegunungan Meratus, rimba lindung, dan panorama hijau asri khas Hulu Sungai Selatan.',
      image: '/assets/langara.jpg',
      filterKey: 'Wisata Alam',
    },
    {
      id: 'wisata-budaya',
      name: 'Wisata Budaya',
      icon: '🏛️',
      count: '1 DESTINASI',
      description: 'Balai Adat Malaris, Rumah Adat Dayak Bukit, museum, dan warisan kearifan lokal.',
      image: '/assets/museum-rakyat.jpg',
      filterKey: 'Wisata Budaya',
    },
    {
      id: 'petualangan',
      name: 'Petualangan',
      icon: '🚣',
      count: '2 DESTINASI',
      description: 'Bamboo rafting Sungai Amandit, arung jeram alami, dan ekspedisi rimba Meratus.',
      image: '/assets/balanting-paring.jpg',
      filterKey: 'Petualangan',
    },
    {
      id: 'religi',
      name: 'Wisata Religi',
      icon: '🕌',
      count: '2 DESTINASI',
      description: 'Ziarah makam ulama kharismatik dan situs spiritual bersejarah di bumi Antaludin.',
      image: '/assets/museum-rakyat.jpg',
      filterKey: 'Religi',
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    fetchCategories().then((apiCats) => {
      if (!isMounted || !apiCats || apiCats.length === 0) return;

      const dynamicCards: CategoryCardItem[] = apiCats.map((cat: ApiCategory) => {
        const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
        const meta = CATEGORY_META[slug] || {
          icon: '📍',
          description: `Jelajahi ragam destinasi ${cat.name} terbaik di Kabupaten Hulu Sungai Selatan.`,
          image: '/assets/balanting-paring.jpg',
        };

        const countNum = cat.destinations_count !== undefined ? cat.destinations_count : 0;

        return {
          id: cat.id,
          name: cat.name,
          icon: meta.icon,
          count: `${countNum} DESTINASI`,
          description: meta.description,
          image: meta.image,
          filterKey: cat.name,
        };
      });

      setCategories(dynamicCards);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bh-container section-browse-category" style={{ marginTop: 52 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 28px' }}>
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
          Filter destinasi favorit untuk mempermudah penyusunan rute liburan Anda di Hulu Sungai Selatan.
        </p>
      </div>

      {/* Grid */}
      <div className="category-figma-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-figma-card"
            onClick={() => navigate(`/directory?category=${encodeURIComponent(cat.filterKey)}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-figma-media">
              <img
                src={cat.image}
                alt={cat.name}
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
                <span>Lihat destinasi kategori ini</span>
                <Icon.ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrowseByCategory;
