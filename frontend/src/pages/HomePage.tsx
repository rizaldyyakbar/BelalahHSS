import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import RecommendationSection from '../components/sections/RecommendationSection';
import { HowToCreateRoute } from '../components/sections/HowToCreateRoute';
import { BrowseByCategory } from '../components/sections/BrowseByCategory';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { fetchRecommendations } from '../services/api';

/**
 * HomePage — Premium 'Expedition' Design
 * Dynamically fetches recommendations from backend API with fallback
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async (lat?: number, lng?: number) => {
      setLoading(true);
      const res = await fetchRecommendations({ lat, lng, limit: 6 });
      if (isMounted) {
        setDestinations(res.destinations);
        setIsLiveApi(res.isFromApi);
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadRecommendations(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          loadRecommendations();
        },
        { timeout: 5000 }
      );
    } else {
      loadRecommendations();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (query: string): void => {
    navigate(`/directory?search=${query}`);
  };

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main>
        <HeroSection
          imageClass="langara"
          onSearch={handleSearch}
        />

        <div style={{ position: 'relative', zIndex: 10, marginTop: -60 }}>
          <RecommendationSection
            destinations={destinations}
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
