import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '../atomic/Icons';
import { Destination } from '../../constants/destinations';

interface StickyRouteSummaryBarProps {
  selectedDestinations: Destination[];
  onContinue: () => void;
}

export const StickyRouteSummaryBar: React.FC<StickyRouteSummaryBarProps> = ({
  selectedDestinations,
  onContinue,
}) => {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!isHomePage);

  // Reset dismissed state whenever destination count changes
  useEffect(() => {
    setDismissed(false);
  }, [selectedDestinations.length]);

  // Scroll listener: On HomePage, hide while at Hero Section, show smoothly when scrolled past
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Past the Hero section (~300px)
      setIsScrolled(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  if (selectedDestinations.length === 0 || dismissed) return null;

  const count = selectedDestinations.length;
  const isDirectory = location.pathname.startsWith('/directory');

  const estimatedKm = count === 2 ? '68.4' : (30 + count * 18.5).toFixed(1);
  const durationText =
    count === 2
      ? '2 jam 15 mnt'
      : `${Math.floor((Number(estimatedKm) * 1.95) / 60)}j ${Math.round((Number(estimatedKm) * 1.95) % 60)}m`;
  const isOptimal = count >= 2 && count <= 3;

  return (
    <div className={`sticky-route-bar-wrapper ${isScrolled ? 'visible' : 'hidden'}`}>
      <div className="sticky-route-bar">
        {/* Desktop Content (>768px) */}
        <div className="sticky-route-desktop-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#EEF6F0',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--meratus-deep)',
                flexShrink: 0,
              }}
            >
              <Icon.Compass size={18} />
            </div>

            <div className="sticky-route-info">
              <div className="sticky-route-header-line">
                <span>{count} Destinasi Terpilih</span>
                {isOptimal && <span className="sticky-optimal-badge">✓ Optimal (2–3 destinasi)</span>}
                {count === 1 && (
                  <span
                    style={{
                      background: '#FFF5EE',
                      color: '#994700',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Pilih minimal 2 destinasi
                  </span>
                )}
                {count > 3 && (
                  <span
                    style={{
                      background: '#FFF0F0',
                      color: '#C23C3C',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Padat untuk 1 hari
                  </span>
                )}
                <span style={{ color: 'var(--meratus-subtle)', fontWeight: 500 }}>
                  • Estimasi {estimatedKm} km (~{durationText})
                </span>
              </div>
              <div className="sticky-route-subtext">
                <span>🔀 Urutan rute dioptimalkan otomatis (Dijkstra)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="sticky-route-btn" onClick={onContinue}>
              <span>Lanjutkan ke Rute Lengkap</span>
              <Icon.ArrowRight size={15} />
            </button>
            <button
              onClick={() => setDismissed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--meratus-subtle)',
                cursor: 'pointer',
                padding: '6px 8px',
                fontSize: 16,
                lineHeight: 1,
              }}
              title="Tutup ringkasan"
              aria-label="Tutup ringkasan"
            >
              ×
            </button>
          </div>
        </div>

        {/* Mobile Content (<=768px) */}
        <div className="sticky-route-mobile-content">
          <div className="sticky-route-mobile-left">
            <div className="sticky-route-mobile-icon">
              <Icon.Compass size={15} />
            </div>
            <div className="sticky-route-mobile-text">
              <div className="sticky-route-mobile-title">
                {count} Destinasi Terpilih <span style={{ color: '#2A6650', fontWeight: 700 }}>• Optimal</span>
              </div>
              <div className="sticky-route-mobile-sub">
                Est. {estimatedKm} km • ~{durationText}
              </div>
            </div>
          </div>

          <div className="sticky-route-mobile-actions">
            <button className="sticky-route-btn-mobile" onClick={onContinue}>
              <span>Lanjutkan</span>
              <Icon.ArrowRight size={13} />
            </button>
            <button
              onClick={() => setDismissed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--meratus-subtle)',
                cursor: 'pointer',
                padding: '4px 6px',
                fontSize: 16,
                lineHeight: 1,
              }}
              title="Tutup ringkasan"
              aria-label="Tutup ringkasan"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyRouteSummaryBar;
