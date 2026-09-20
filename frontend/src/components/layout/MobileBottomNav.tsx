import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeCount, setRouteCount] = useState<number>(0);

  // Read saved itinerary count from localStorage on mount & route change
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('belalah_itinerary');
        if (saved) {
          const parsed = JSON.parse(saved);
          setRouteCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setRouteCount(0);
        }
      } catch {
        setRouteCount(0);
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, [location.pathname]);

  const isJelajahActive = location.pathname === '/' || location.pathname.startsWith('/directory');
  const isRuteActive = location.pathname.startsWith('/planner');
  const isSinggahActive = location.pathname.startsWith('/experiences');
  const isJurnalActive = location.pathname.startsWith('/journal');

  return (
    <nav className="bh-mobile-bottom-nav" aria-label="Navigasi Bawah Ponsel">
      {/* 1. Jelajah */}
      <button
        className={`bh-mobile-nav-item ${isJelajahActive ? 'active' : ''}`}
        onClick={() => navigate('/directory')}
        aria-label="Jelajah Katalog Destinasi"
      >
        <div className="bh-mobile-nav-pill">
          <Icon.Compass size={18} color={isJelajahActive ? 'var(--meratus-deep)' : 'var(--meratus-muted)'} />
        </div>
        <span className="bh-mobile-nav-text">Jelajah</span>
      </button>

      {/* 2. Rute */}
      <button
        className={`bh-mobile-nav-item ${isRuteActive ? 'active' : ''}`}
        onClick={() => navigate('/planner')}
        aria-label="Perencana Rute Wisata"
      >
        <div className="bh-mobile-nav-pill" style={{ position: 'relative' }}>
          <Icon.Route size={18} color={isRuteActive ? 'var(--meratus-deep)' : 'var(--meratus-muted)'} />
          {routeCount > 0 && (
            <span className="bh-mobile-route-badge">{routeCount}</span>
          )}
        </div>
        <span className="bh-mobile-nav-text">Rute</span>
      </button>

      {/* 3. Singgah */}
      <button
        className={`bh-mobile-nav-item ${isSinggahActive ? 'active' : ''}`}
        onClick={() => navigate('/experiences')}
        aria-label="Titik Singgah & Kuliner Khas"
      >
        <div className="bh-mobile-nav-pill">
          <Icon.Home size={18} color={isSinggahActive ? 'var(--meratus-deep)' : 'var(--meratus-muted)'} />
        </div>
        <span className="bh-mobile-nav-text">Singgah</span>
      </button>

      {/* 4. Jurnal */}
      <button
        className={`bh-mobile-nav-item ${isJurnalActive ? 'active' : ''}`}
        onClick={() => navigate('/journal')}
        aria-label="Jurnal Wisata & Panduan Meratus"
      >
        <div className="bh-mobile-nav-pill">
          <Icon.BookOpen size={18} color={isJurnalActive ? 'var(--meratus-deep)' : 'var(--meratus-muted)'} />
        </div>
        <span className="bh-mobile-nav-text">Jurnal</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;
