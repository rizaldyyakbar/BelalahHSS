import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import RecommendationSection from '../components/sections/RecommendationSection';
import { HowToCreateRoute } from '../components/sections/HowToCreateRoute';
import { BrowseByCategory } from '../components/sections/BrowseByCategory';
import { DESTINATIONS } from '../constants/destinations';

/**
 * HomePage — Premium 'Expedition' Design
 * Matches the capsule centered preview exactly.
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string): void => {
    navigate(`/directory?search=${query}`);
  };

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      {/* Topo lines are now background fixed via bh-topo-bg::before */}
      
      <Header />

      <main>
        <HeroSection
          imageClass="langara"
          onSearch={handleSearch}
        />

        <div style={{ position: 'relative', zIndex: 10, marginTop: -60 }}>
          <RecommendationSection
            destinations={DESTINATIONS}
            onCardClick={(id) => navigate(`/destination/${id}`)}
          />

          <HowToCreateRoute />

          <BrowseByCategory />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
