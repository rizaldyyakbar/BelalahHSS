import React from 'react';
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
  if (selectedDestinations.length === 0) return null;

  const count = selectedDestinations.length;

  // Approximate distance calculation from Kandangan + sequential stops
  // Each destination has distance roughly 30-45 km
  const estimatedKm = Math.round(30 + count * 18.5);
  const totalMinutes = Math.round(estimatedKm * 1.95);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const isOptimal = count >= 2 && count <= 3;

  return (
    <div className="sticky-route-bar-wrapper">
      <div className="sticky-route-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Icon Badge */}
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

          {/* Details */}
          <div className="sticky-route-info">
            <div className="sticky-route-header-line">
              <span>{count} Destinasi Terpilih</span>

              {isOptimal && (
                <span className="sticky-optimal-badge">
                  ✓ Optimal (2–3 destinasi)
                </span>
              )}

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
                • Estimasi {estimatedKm} km (~{hours} jam {minutes} mnt)
              </span>
            </div>

            <div className="sticky-route-subtext">
              <span>🔀 Urutan rute dioptimalkan otomatis (Dijkstra)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="sticky-route-btn" onClick={onContinue}>
          <span>Lanjutkan ke Rute Lengkap</span>
          <Icon.ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default StickyRouteSummaryBar;
