import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

export const BrowseByCategory: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'alam',
      name: 'Wisata Alam',
      icon: '🌿',
      count: '45 DESTINASI',
      description: 'Pegunungan Meratus, rimba lindung, dan panorama hijau asri khas Hulu Sungai Selatan.',
      image: '/assets/langara.jpg',
      filterKey: 'Alam',
    },
    {
      id: 'air-terjun',
      name: 'Air Terjun',
      icon: '💧',
      count: '28 DESTINASI',
      description: 'Haratai, Riam Hanai, Kilat Api, Rampah Menjangan, dan gemericik air pegunungan alami.',
      image: '/assets/Air-Terjun-Haratai.jpg',
      filterKey: 'Air Terjun',
    },
    {
      id: 'hiking',
      name: 'Perbukitan & Hiking',
      icon: '⛰️',
      count: '18 DESTINASI',
      description: 'Bukit Langara, Bukit Buan, tebing karst Meratus, dan spot sunrise di atas awan.',
      image: '/assets/langara.jpg',
      filterKey: 'Hiking',
    },
    {
      id: 'sungai',
      name: 'Petualangan Sungai',
      icon: '🚣',
      count: '14 DESTINASI',
      description: 'Bamboo rafting Sungai Amandit, pemandian air panas Tanuhi, dan arung riam alami.',
      image: '/assets/balanting-paring.jpg',
      filterKey: 'Sungai',
    },
  ];

  return (
    <section style={{ maxWidth: 1280, margin: '64px auto 0', padding: '0 32px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
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
