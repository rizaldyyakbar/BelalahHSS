import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

interface PlannerSubNavProps {
  destinationsCount: number;
  routeId?: string;
  onSaveRoute: () => void;
  onShareRoute: () => void;
  onOpenGoogleMaps: () => void;
}

export const PlannerSubNav: React.FC<PlannerSubNavProps> = ({
  destinationsCount,
  routeId = 'HSS-EXP-202505',
  onSaveRoute,
  onShareRoute,
  onOpenGoogleMaps,
}) => {
  return (
    <div className="planner-subnav">
      {/* Left: Breadcrumbs & Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="planner-breadcrumbs">
          <Link to="/">Beranda</Link>
          <span>/</span>
          <Link to="/planner">Perencana Rute</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 700 }}>
            Rute Ekspedisi Meratus (Draft Aktif)
          </span>
        </div>

        <div className="planner-subnav-badges">
          <span className="planner-pill-badge">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--meratus-deep)',
              }}
            />
            {destinationsCount} Destinasi Terpilih
          </span>

          <span className="planner-pill-badge active-opt">
            <Icon.Compass size={12} />
            Optimasi Dijkstra &amp; Haversine Aktif
          </span>

          <span className="planner-pill-badge" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
            ID: {routeId}
          </span>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="planner-subnav-actions">
        <button className="btn-planner-ghost" onClick={onSaveRoute} title="Simpan Rute ke Perangkat">
          <Icon.Save size={15} />
          <span>Simpan Rute</span>
        </button>

        <button className="btn-planner-ghost" onClick={onShareRoute} title="Bagikan Tautan Rute">
          <Icon.Instagram size={15} />
          <span>Bagikan</span>
        </button>

        <button
          className="btn-planner-primary"
          onClick={onOpenGoogleMaps}
          title="Buka rute multi-stop di Google Maps"
        >
          <Icon.Pin size={16} />
          <span>Buka di Google Maps (Multi-Stop)</span>
        </button>
      </div>
    </div>
  );
};

export default PlannerSubNav;
