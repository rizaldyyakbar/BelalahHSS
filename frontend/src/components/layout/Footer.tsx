import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

interface FooterProps {
  company?: string;
  year?: number;
}

export const Footer: React.FC<FooterProps> = ({
  company = 'Belalah HSS',
  year = 2025,
}) => {
  return (
    <footer className="figma-footer">
      <div className="figma-footer-grid">
        {/* Col 1: Belalah HSS */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14 }}>
            <span
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--meratus-deep)',
                letterSpacing: '-0.02em',
              }}
            >
              Belalah HSS
            </span>
            <span
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'var(--meratus-muted)',
                textTransform: 'uppercase',
              }}
            >
              Hulu Sungai Selatan
            </span>
          </div>

          <p
            style={{
              fontSize: 13.5,
              color: 'var(--meratus-muted)',
              lineHeight: 1.6,
              margin: '0 0 16px',
            }}
          >
            Sistem Pendukung Keputusan dan Perencana Itinerari Cerdas Wisata Hulu Sungai Selatan.
            Memadukan metode Simple Additive Weighting (SAW) dan kalkulasi jarak Haversine untuk
            eksplorasi Meratus yang autentik.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: 'var(--meratus-subtle)',
            }}
          >
            <Icon.Pin size={14} style={{ color: 'var(--meratus-clay)' }} />
            <span>Kandangan, Kabupaten Hulu Sungai Selatan, Kalimantan Selatan</span>
          </div>
        </div>

        {/* Col 2: Eksplorasi */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--meratus-deep)',
              margin: '0 0 16px',
            }}
          >
            Eksplorasi
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>
              <Link to="/directory" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Destinasi Loksado
              </Link>
            </li>
            <li>
              <Link to="/directory?category=Budaya" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Wisata Budaya Dayak
              </Link>
            </li>
            <li>
              <Link to="/experiences" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Kuliner Kandangan
              </Link>
            </li>
            <li>
              <Link to="/journal" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Panduan Navigasi &amp; Rute Offline
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Informasi */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--meratus-deep)',
              margin: '0 0 16px',
            }}
          >
            Informasi
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>
              <Link to="/directory" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Kategori Wisata
              </Link>
            </li>
            <li>
              <Link to="/journal" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Jurnal Perjalanan
              </Link>
            </li>
            <li>
              <Link to="/about" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Panduan Navigasi
              </Link>
            </li>
            <li>
              <Link to="/about" style={{ textDecoration: 'none', fontSize: 13.5, color: 'var(--meratus-muted)' }}>
                Kontak Pemkab HSS
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Koneksi Cerdas */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--meratus-deep)',
              margin: '0 0 16px',
            }}
          >
            Koneksi Cerdas
          </h4>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--meratus-card-border)',
              borderRadius: 14,
              padding: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--meratus-clay-dark)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              <span>🔀 Integrasi Multi-Stop</span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: 'var(--meratus-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Optimalkan urutan perjalanan Anda secara otomatis dan buka langsung rute ke Google Maps.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="figma-footer-bottom">
        <div>
          © 2025 Belalah HSS • Dinas Pemuda, Olahraga, dan Pariwisata Hulu Sungai Selatan.
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--meratus-muted)' }}>
          v1.2 • Meratus Geographical Engine
        </div>
      </div>
    </footer>
  );
};

export default Footer;
