import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import RecommendationSection from './components/sections/RecommendationSection';
import { DESTINATIONS } from './constants/destinations';

/**
 * HomePage — Home page menggunakan komponen yang sudah dipisah
 */
export const HomePage = () => {
  const [favorites, setFavorites] = useState([]);

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implementasi search logic di sini
  };

  const handleViewAllDestinations = () => {
    console.log('View all destinations');
    // Navigate ke directory page
  };

  const handleCardClick = (destinationId) => {
    console.log('Navigate to detail:', destinationId);
    // Navigate ke detail page
  };

  const handleHeartClick = (destinationId) => {
    setFavorites(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const handleNavigation = (page) => {
    console.log('Navigate to:', page);
    // Implementasi routing logic
  };

  return (
    <div className="bh-screen scroll web" style={{
      width: '100%',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--ink)',
      fontFamily: 'var(--sans)',
      fontSize: 15,
      lineHeight: 1.5,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Header
        active="home"
        onNavClick={handleNavigation}
      />

      <main style={{ marginBottom: 0 }}>
        {/* Hero Section */}
        <HeroSection
          location="Hulu Sungai Selatan · Kalimantan Selatan"
          title="Belalah ke"
          titleHighlight="Bumi Antaludin"
          description="Rencanakan perjalananmu yang pertama di Hulu Sungai Selatan — rekomendasi destinasi terbaik dan rute terpendek antar tempat, dalam beberapa langkah saja."
          onSearch={handleSearch}
        />

        {/* Recommendation Section */}
        <RecommendationSection
          destinations={DESTINATIONS}
          title="Destinasi paling cocok untukmu"
          subtitle="Rekomendasi sistem · SAW"
          onViewAll={handleViewAllDestinations}
          onCardClick={handleCardClick}
          onHeartClick={handleHeartClick}
        />

        {/* How It Works Section (Empty placeholder) */}
        <div style={{ padding: '56px 56px' }}>
          {/* Tambahkan section How It Works di sini */}
        </div>
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default HomePage;
