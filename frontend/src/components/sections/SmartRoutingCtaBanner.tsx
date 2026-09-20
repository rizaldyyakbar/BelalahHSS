import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

export const SmartRoutingCtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bh-container" style={{ marginTop: 40 }}>
      <div className="smart-routing-banner">
        <div>
          <div className="smart-routing-badge">
            <Icon.Compass size={12} />
            <span>Smart Routing Engine</span>
          </div>

          <h2 className="smart-routing-title">
            Siap Menjelajah Pegunungan Meratus?
          </h2>

          <p className="smart-routing-desc">
            Rute Anda akan dihitung, dioptimalkan secara otomatis menggunakan algoritma Dijkstra &amp;
            Haversine, serta siap diekspor ke Google Maps multi-stop pada halaman perencana penuh.
          </p>
        </div>

        <button
          className="smart-routing-btn"
          onClick={() => navigate('/planner')}
        >
          <Icon.Compass size={18} />
          <span>Mulai Perjalanan &amp; Buka Planner</span>
        </button>
      </div>
    </section>
  );
};

export default SmartRoutingCtaBanner;
