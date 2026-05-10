import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

interface FooterProps {
  company?: string;
  year?: number;
}

/**
 * Footer — Premium dark footer with hover effects
 */
export const Footer: React.FC<FooterProps> = ({
  company = 'Belalah HSS',
  year = 2026,
}) => {
  const navigationLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Destinasi', path: '/directory' },
    { label: 'Perencana Rute', path: '/planner' },
    { label: 'Tentang', path: '/about' },
  ];

  const resourceLinks = ['Blog', 'FAQ', 'Panduan', 'Kontak'];

  return (
    <footer className="bh-footer">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="bh-footer-grid">
          {/* Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="bh-logomark" style={{ background: 'rgba(63, 140, 110, 0.3)', color: '#fff' }}>B</div>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {company}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255, 251, 243, 0.6)', lineHeight: 1.7, maxWidth: '30ch', margin: 0 }}>
              Platform perencana rute wisata untuk Hulu Sungai Selatan, Kalimantan Selatan.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="bh-footer-heading">Navigasi</h4>
            <ul className="bh-footer-links">
              {navigationLinks.map(item => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="bh-footer-heading">Sumber Daya</h4>
            <ul className="bh-footer-links">
              {resourceLinks.map(item => (
                <li key={item}>
                  <button onClick={(e) => e.preventDefault()}>{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="bh-footer-heading">Hubungi Kami</h4>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="social-btn" aria-label="Email">
                <Icon.Mail size={18} />
              </button>
              <button className="social-btn" aria-label="Phone">
                <Icon.Phone size={18} />
              </button>
              <button className="social-btn" aria-label="Instagram">
                <Icon.Instagram size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bh-footer-bottom">
          <p style={{ margin: 0 }}>© {year} {company}. Semua hak dilindungi.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <button onClick={(e) => e.preventDefault()} style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Privasi</button>
            <button onClick={(e) => e.preventDefault()} style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Syarat Penggunaan</button>
            <button onClick={(e) => e.preventDefault()} style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
