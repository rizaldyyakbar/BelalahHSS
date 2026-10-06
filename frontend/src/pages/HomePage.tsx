import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import PopularDestinationsSection from '../components/sections/PopularDestinationsSection';
import NearbySuggestionsStrip from '../components/sections/NearbySuggestionsStrip';
import SmartRoutingCtaBanner from '../components/sections/SmartRoutingCtaBanner';
import BrowseByCategory from '../components/sections/BrowseByCategory';
import StickyRouteSummaryBar from '../components/composite/StickyRouteSummaryBar';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { fetchRecommendations } from '../services/api';

/**
 * HomePage — Figma Belalah HSS Redesign (Node 44:3)
 * Full interactive 3-step route planner, SAW ranking cards,
 * Haversine nearby suggestions strip, and sticky route summary bar.
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [startPoint, setStartPoint] = useState<string>('kandangan');

  // Initial selected destinations matching saved itinerary or default
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>(() => {
    try {
      const saved = localStorage.getItem('belalah_itinerary');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    const default1 = DESTINATIONS.find((d) => d.name.toLowerCase().includes('bamboo')) || DESTINATIONS[1];
    const default2 = DESTINATIONS.find((d) => d.name.toLowerCase().includes('haratai')) || DESTINATIONS[0];
    return [default1, default2].filter(Boolean) as Destination[];
  });

  // Keep localStorage and other components in sync
  useEffect(() => {
    localStorage.setItem('belalah_itinerary', JSON.stringify(selectedDestinations));
    window.dispatchEvent(new Event('storage'));
  }, [selectedDestinations]);

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async (lat?: number, lng?: number) => {
      setLoading(true);
      const res = await fetchRecommendations({ lat, lng, limit: 12 });
      if (isMounted) {
        if (res.destinations && res.destinations.length > 0) {
          setDestinations(res.destinations);
        }
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadRecommendations(pos.coords.latitude, pos.coords.longitude),
        () => loadRecommendations(),
        { timeout: 5000 }
      );
    } else {
      loadRecommendations();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered destinations for the popular section based on category selection
  const filteredDestinations = destinations.filter((d) => {
    if (selectedCategory === 'Semua') return true;
    const destCat = (d.category || '').toLowerCase();
    const selCat = selectedCategory.toLowerCase();

    return (
      destCat.includes(selCat) ||
      selCat.includes(destCat) ||
      (selCat.includes('alam') && destCat.includes('alam')) ||
      (selCat.includes('budaya') && (destCat.includes('budaya') || d.name.toLowerCase().includes('adat'))) ||
      (selCat.includes('terjun') && (d.name.toLowerCase().includes('air') || d.name.toLowerCase().includes('riam'))) ||
      (selCat.includes('sungai') && (d.name.toLowerCase().includes('rafting') || d.name.toLowerCase().includes('sungai') || d.name.toLowerCase().includes('panas')))
    );
  });

  const handleAddDestination = (dest: Destination) => {
    if (!selectedDestinations.some((d) => d.id === dest.id)) {
      setSelectedDestinations([...selectedDestinations, dest]);
    }
  };

  const handleRemoveDestination = (id: number) => {
    setSelectedDestinations(selectedDestinations.filter((d) => d.id !== id));
  };

  const handleToggleDestination = (dest: Destination) => {
    if (selectedDestinations.some((d) => d.id === dest.id)) {
      handleRemoveDestination(dest.id);
    } else {
      handleAddDestination(dest);
    }
  };

  const handleBuildRoute = () => {
    // Navigate to planner passing selected destination IDs
    const ids = selectedDestinations.map((d) => d.id).join(',');
    navigate(`/planner?destinations=${ids}&start=${startPoint}`);
  };

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, paddingBottom: 48 }}>
        {/* 1. Hero Section with 3-Step Interactive Trip Builder */}
        <HeroSection
          selectedDestinations={selectedDestinations}
          onRemoveDestination={handleRemoveDestination}
          onAddDestination={handleAddDestination}
          availableDestinations={destinations}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          startPoint={startPoint}
          onStartPointChange={setStartPoint}
          onBuildRoute={handleBuildRoute}
        />

        {/* 2. Popular Destinations Section (SAW & Haversine Ranked) */}
        <PopularDestinationsSection
          destinations={filteredDestinations.length > 0 ? filteredDestinations : destinations}
          selectedDestinations={selectedDestinations}
          onToggleDestination={handleToggleDestination}
          onViewDetail={(id) => navigate(`/destination/${id}`)}
        />

        {/* 3. Nearby Suggestions Strip (Radius Haversine < 12 km) */}
        <NearbySuggestionsStrip
          destinations={destinations}
          selectedDestinations={selectedDestinations}
          onAddDestination={handleAddDestination}
        />

        {/* 4. Smart Routing Engine Callout Banner */}
        <SmartRoutingCtaBanner />

        {/* 5. Explore by Category Section */}
        <BrowseByCategory />
      </main>

      {/* 6. Sticky Floating Route Summary Bar */}
      <StickyRouteSummaryBar
        selectedDestinations={selectedDestinations}
        onContinue={handleBuildRoute}
      />

      {/* 7. Comprehensive 4-Column Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
