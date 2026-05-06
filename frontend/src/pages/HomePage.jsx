import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import RecommendationSection from '../components/sections/RecommendationSection';
import { DESTINATIONS } from '../constants/destinations';

/**
 * HomePage — Home page menggunakan komponen yang sudah dipisah
 */
export const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    navigate(`/directory?search=${query}`);
  };

  const handleViewAllDestinations = () => {
    console.log('View all destinations');
    navigate('/directory');
  };

  const handleCardClick = (destinationId) => {
    console.log('Navigate to detail:', destinationId);
    navigate(`/destination/${destinationId}`);
  };

  const handleHeartClick = (destinationId) => {
    console.log('Toggle favorite:', destinationId);
    // TODO: Add to favorites logic
  };

  return (
    <div className="bh-screen scroll web" style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--ink)',
      fontFamily: 'var(--sans)',
      fontSize: 15,
      lineHeight: 1.5,
      position: 'relative',
    }}>
      <Header />

      <main style={{ marginBottom: 0 }}>
        <HeroSection
          location="Hulu Sungai Selatan · Kalimantan Selatan"
          title="Belalah ke"
          titleHighlight="Bumi Antaludin"
          description="Rencanakan perjalananmu yang pertama di Hulu Sungai Selatan — rekomendasi destinasi terbaik dan rute terpendek antar tempat, dalam beberapa langkah saja."
          onSearch={handleSearch}
        />

        <RecommendationSection
          destinations={DESTINATIONS}
          title="Destinasi paling cocok untukmu"
          subtitle="Rekomendasi sistem · SAW"
          onViewAll={handleViewAllDestinations}
          onCardClick={handleCardClick}
          onHeartClick={handleHeartClick}
        />
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default HomePage;
