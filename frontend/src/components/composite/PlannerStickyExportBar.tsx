import React from 'react';
import { Icon } from '../atomic/Icons';

interface PlannerStickyExportBarProps {
  destinationsCount: number;
  totalDistanceKm: number;
  totalTripMinutes: number;
  onRecalculate: () => void;
  onDownload: () => void;
  onOpenGoogleMaps: () => void;
  isRecalculating?: boolean;
}

export const PlannerStickyExportBar: React.FC<PlannerStickyExportBarProps> = ({
  destinationsCount,
  totalDistanceKm,
  totalTripMinutes,
  onRecalculate,
  onDownload,
  onOpenGoogleMaps,
  isRecalculating = false,
}) => {
  const tripHours = Math.floor(totalTripMinutes / 60);
  const tripMinutes = totalTripMinutes % 60;

  return (
    <div className="sticky-planner-bottom-bar-wrapper">
      <div className="sticky-planner-bar-content">
        {/* Left: Summary Stats */}
        <div className="planner-summary-stats">
          <span className="planner-summary-label">TOTAL PERJALANAN</span>
          <span className="planner-summary-main">
            {destinationsCount} Destinasi • {totalDistanceKm.toFixed(1)} km
          </span>
          <span className="planner-summary-sub">
            Estimasi trip: {tripHours} jam {tripMinutes} menit (termasuk istirahat)
          </span>
        </div>

        {/* Right: Actions */}
        <div className="planner-bottom-actions">
          <button
            className="btn-planner-ghost"
            onClick={onRecalculate}
            disabled={isRecalculating}
            title="Kalkulasi ulang rute terpendek dengan Dijkstra"
          >
            <Icon.Compass size={14} />
            <span>{isRecalculating ? 'Menghitung...' : 'Kalkulasi Ulang'}</span>
          </button>

          <button
            className="btn-planner-ghost"
            onClick={onDownload}
            title="Unduh file rute GPX / Ringkasan PDF"
          >
            <Icon.Save size={14} />
            <span>Unduh GPX / PDF</span>
          </button>

          <button
            className="btn-planner-primary"
            onClick={onOpenGoogleMaps}
            title="Buka seluruh rute di Google Maps"
          >
            <Icon.Pin size={16} />
            <span>Buka di Google Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerStickyExportBar;
