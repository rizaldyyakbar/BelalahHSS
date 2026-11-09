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
          <span className="planner-summary-label">JARAK MODEL PROTOTYPE</span>
          <span className="planner-summary-main">
            {destinationsCount} Destinasi • {totalDistanceKm.toFixed(1)} km
          </span>
          <span className="planner-summary-sub">
            Estimasi waktu: {tripHours} jam {tripMinutes} menit (asumsi rata-rata perjalanan)
          </span>
        </div>

        {/* Right: Actions */}
        <div className="planner-bottom-actions">
          <button
            className="btn-planner-ghost"
            onClick={onRecalculate}
            disabled={isRecalculating}
            title="Hitung ulang saran urutan kunjungan berdasarkan model jarak"
          >
            <Icon.Compass size={14} />
            <span>{isRecalculating ? 'Menghitung...' : 'Perbarui Urutan'}</span>
          </button>

          <button
            className="btn-planner-ghost"
            onClick={onDownload}
            title="Unduh rute dalam format GPS (.GPX) untuk aplikasi navigasi"
          >
            <Icon.Save size={14} />
            <span>Unduh GPX</span>
          </button>

          <button
            className="btn-planner-primary"
            onClick={onOpenGoogleMaps}
            title="Buka seluruh rute di Google Maps untuk navigasi jalan riil"
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
