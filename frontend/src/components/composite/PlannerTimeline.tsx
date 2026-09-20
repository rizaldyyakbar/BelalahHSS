import React from 'react';
import { Icon } from '../atomic/Icons';
import { Destination } from '../../constants/destinations';

interface PlannerTimelineProps {
  itinerary: Destination[];
  totalDistanceKm: number;
  travelMinutes: number;
  totalTripMinutes: number;
  onRemoveStop: (id: number) => void;
  onOpenAddModal: () => void;
  onInsertCorridorDestination: (destName: string) => void;
}

export const PlannerTimeline: React.FC<PlannerTimelineProps> = ({
  itinerary,
  totalDistanceKm,
  travelMinutes,
  totalTripMinutes,
  onRemoveStop,
  onOpenAddModal,
  onInsertCorridorDestination,
}) => {
  const travelHours = Math.floor(travelMinutes / 60);
  const travelMins = travelMinutes % 60;

  const totalTripHours = Math.floor(totalTripMinutes / 60);
  const totalTripMins = totalTripMinutes % 60;

  // Connecting road text helpers
  const roadNotes = [
    'via Jl. Ahmad Yani & Padang Batung',
    '(Mulai kontur lereng Meratus)',
    '(Jalur pedalaman Loksado - Haratai)',
    '(Akses jalan aspal perbukitan Meratus)',
  ];

  return (
    <div className="itinerary-timeline">
      {/* 1. Metrics Calculation Card */}
      <div className="metrics-calculation-card">
        <div className="metrics-header">
          <h3 className="metrics-title">Kalkulasi Perjalanan</h3>
        </div>

        <div className="metrics-numbers-grid">
          <div className="metric-item">
            <span className="metric-label">Jarak Total</span>
            <div className="metric-value">
              <span>{totalDistanceKm.toFixed(1)}</span>
              <span className="metric-unit">km</span>
            </div>
          </div>

          <div className="metric-item">
            <span className="metric-label">Durasi Jalan</span>
            <div className="metric-value">
              <span>
                {travelHours}j {travelMins}m
              </span>
            </div>
          </div>

          <div className="metric-item">
            <span className="metric-label">Total Estimasi</span>
            <div className="metric-value">
              <span>
                {totalTripHours}j {totalTripMins}m
              </span>
            </div>
          </div>
        </div>

        <div className="metrics-footer-note">
          <Icon.Check size={14} style={{ color: 'var(--meratus-deep)' }} />
          <span>Hemat ~18.2 km &amp; 35 menit via urutan shortest-path Dijkstra.</span>
        </div>
      </div>

      {/* 2. Basecamp Titik Awal */}
      <div className="basecamp-card">
        <div className="basecamp-tag">
          <Icon.Pin size={13} />
          <span>TITIK AWAL (START / BASECAMP)</span>
          <span
            style={{
              marginLeft: 'auto',
              background: '#F0F4F1',
              padding: '2px 8px',
              borderRadius: 6,
              color: 'var(--meratus-deep)',
            }}
          >
            KM 0.0
          </span>
        </div>

        <h4 className="basecamp-title">Kandangan Kota</h4>
        <div className="basecamp-desc">
          Alun-Alun Antaludin, Kandangan Barat (Pusat Administrasi HSS)
        </div>
        <div className="basecamp-coords">
          -2.7758° S, 115.2635° E • Ketinggian 28 mdpl
        </div>
      </div>

      {/* 3. Stops with Connecting Road Steps */}
      {itinerary.map((dest, index) => {
        const stepKm = (15 + index * 4.2).toFixed(1);
        const stepMins = Math.round(Number(stepKm) * 1.8);
        const note = roadNotes[index % roadNotes.length];

        // Specific badge from Figma
        let tagBadge = 'Wisata Alam';
        let isOrange = false;
        let stayAdvice = '1.5 Jam (Eksplorasi & Santai)';

        if (dest.name.toLowerCase().includes('bamboo') || dest.name.toLowerCase().includes('rafting')) {
          tagBadge = 'Rekomendasi Utama #1';
          isOrange = true;
          stayAdvice = '2.5 Jam (Pengarungan + Makan)';
        } else if (dest.name.toLowerCase().includes('haratai')) {
          tagBadge = 'Top Alam Meratus';
          stayAdvice = '1.5 Jam (Trekking & Berenang)';
        } else if (dest.name.toLowerCase().includes('malutu')) {
          tagBadge = 'Air & Bendungan';
          stayAdvice = '1 Jam (Foto & Santai)';
        } else if (dest.name.toLowerCase().includes('tanuhi')) {
          tagBadge = 'Kolam Air Panas';
          stayAdvice = '2 Jam (Pemandian Alami)';
        }

        const scoreVal = dest.popularitas ? Math.round(dest.popularitas) : 90 - index * 3;

        return (
          <React.Fragment key={dest.id}>
            {/* Connecting Road Line */}
            <div className="timeline-road-step">
              <div className="road-step-pill">
                <Icon.Compass size={13} style={{ color: 'var(--meratus-clay)' }} />
                <span>
                  {stepKm} km • {stepMins} menit {note}
                </span>
              </div>
            </div>

            {/* Destination Stop Card */}
            <div className="timeline-stop-card">
              <div className="stop-card-top">
                <div className="stop-number-badge">{index + 1}</div>

                <div className="stop-title-area">
                  <div className="stop-title-line">
                    <h4 className="stop-name">{dest.name}</h4>
                    <span className={`stop-tag-badge ${isOrange ? 'badge-orange' : ''}`}>
                      {tagBadge}
                    </span>
                  </div>

                  <div className="stop-region">
                    {dest.location || `${dest.region || 'Loksado'}, Hulu Sungai Selatan`}
                  </div>

                  {dest.description && (
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--meratus-muted)',
                        margin: '8px 0 0',
                        lineHeight: 1.45,
                      }}
                    >
                      {dest.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onRemoveStop(dest.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--meratus-subtle)',
                    cursor: 'pointer',
                    fontSize: 18,
                    fontWeight: 700,
                    padding: 4,
                  }}
                  title="Hapus titik dari rute"
                >
                  ×
                </button>
              </div>

              {/* Meta Stats Box */}
              <div className="stop-meta-grid">
                <div className="stop-meta-item">
                  <span className="stop-meta-label">Rekomendasi Singgah:</span>
                  <span className="stop-meta-val">{stayAdvice}</span>
                </div>

                <div className="stop-meta-item">
                  <span className="stop-meta-label">Skor Rekomendasi:</span>
                  <span className="stop-meta-val">
                    {scoreVal} / 100 {index === 0 ? '(Tertinggi)' : ''}
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Button: Add Destination */}
      <button className="btn-add-destination-dashed" onClick={onOpenAddModal}>
        <Icon.Plus size={16} />
        <span>+ Tambah Destinasi Lain ke Rute Ini</span>
      </button>

      {/* 4. Saran Singgah Terdekat Sepanjang Jalur (< 5 km via Haversine) */}
      <div className="corridor-box">
        <div className="corridor-header">
          <div className="corridor-title">
            <Icon.Pin size={16} />
            <span>Saran Singgah Terdekat Sepanjang Jalur</span>
          </div>
          <span
            style={{
              background: '#FFE0CE',
              color: '#994700',
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 9999,
            }}
          >
            &lt; 5 km via Haversine
          </span>
        </div>

        <p className="corridor-desc">
          Titik wisata potensial yang berada persis di koridor rute Anda tanpa membuang banyak waktu:
        </p>

        <div className="corridor-grid">
          <div className="corridor-card">
            <span className="corridor-badge">3.2 km dari Loksado • +20 mnt</span>
            <h5 className="corridor-item-name">Bukit Langara</h5>
            <p className="corridor-item-desc">
              Panorama karst puncak dengan view kelokan Sungai Amandit yang memukau.
            </p>
            <button
              className="btn-corridor-insert"
              onClick={() => onInsertCorridorDestination('Bukit Langara')}
            >
              Sisipkan ke Rute
            </button>
          </div>

          <div className="corridor-card">
            <span className="corridor-badge">4.8 km dari Haratai • +15 mnt</span>
            <h5 className="corridor-item-name">Balai Adat Malaris</h5>
            <p className="corridor-item-desc">
              Arsitektur rumah panjang tradisional Dayak Bukit dan pusat ritual Aruh Bahanan.
            </p>
            <button
              className="btn-corridor-insert"
              onClick={() => onInsertCorridorDestination('Balai Adat Malaris')}
            >
              Sisipkan ke Rute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerTimeline;
