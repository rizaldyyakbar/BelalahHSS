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
            <span>Perencana Rute Wisata</span>
          </div>

          <h2 className="smart-routing-title">
            Siap Menjelajah Pegunungan Meratus?
          </h2>

          <p className="smart-routing-desc">
            Pilih destinasi yang ingin Anda kunjungi, tinjau saran urutan perjalanan berdasarkan model jarak prototype,
            dan buka langsung rute ke Google Maps untuk navigasi jalan riil.
          </p>
        </div>

        <button
          className="smart-routing-btn"
          onClick={() => navigate('/planner')}
        >
          <Icon.Compass size={18} />
          <span>Buka Perencana Rute</span>
        </button>
      </div>
    </section>
  );
};

export default SmartRoutingCtaBanner;
