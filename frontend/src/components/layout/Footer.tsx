import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

interface NavLink {
  label: string;
  path: string;
}

interface FooterProps {
  company?: string;
  year?: number;
}

/**
 * Footer — Footer component
 */
export const Footer: React.FC<FooterProps> = ({
  company = 'Belalah HSS',
  year = 2026,
}) => {
  const navigationLinks: NavLink[] = [
    { label: 'Beranda', path: '/' },
    { label: 'Destinasi', path: '/directory' },
    { label: 'Perencana Rute', path: '/planner' },
    { label: 'Tentang', path: '/about' },
  ];

  const resourceLinks: string[] = ['Blog', 'FAQ', 'Panduan', 'Kontak'];

  return (
    <footer className="bh-footer" style={{
      background: 'var(--ink)',
      color: '#fff',
      padding: '56px 56px 28px',
      marginTop: 56,
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginBottom: 56 }}>
          {/* Branding */}
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, fontFamily: 'var(--serif)' }}>
              {company}
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              Platform perencana rute wisata untuk Hulu Sungai Selatan, Kalimantan Selatan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, color: 'rgba(255, 255, 255, 0.6)' }}>
              Navigasi
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navigationLinks.map(item => (
                <li key={item.path} style={{ marginBottom: 8 }}>
                  <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none', fontSize: 14 }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, color: 'rgba(255, 255, 255, 0.6)' }}>
              Sumber Daya
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {resourceLinks.map(item => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <button 
                    onClick={(e) => e.preventDefault()}
                    style={{ color: 'inherit', background: 'none', border: 'none', textDecoration: 'none', fontSize: 14, cursor: 'pointer', padding: 0 }}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, color: 'rgba(255, 255, 255, 0.6)' }}>
              Hubungi Kami
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {/* Social icons */}
                  {i === 0 && <Icon.Mail size={20} style={{ color: 'white' }} />}
                  {i === 1 && <Icon.Phone size={20} style={{ color: 'white' }} />}
                  {i === 2 && <Icon.Instagram size={20} style={{ color: 'white' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          paddingTop: 28,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          <p style={{ margin: 0 }}>© {year} {company}. Semua hak dilindungi.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <button onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Privasi</button>
            <button onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Syarat Penggunaan</button>
            <button onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
