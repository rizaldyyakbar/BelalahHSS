import React from 'react';
import { Icon } from '../atomic/Icons';

/**
 * Footer — Footer component
 */
export const Footer = ({ 
  company = 'Belalah HSS',
  year = 2026,
}) => {
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
              {['Beranda', 'Destinasi', 'Perencana Rute', 'Tentang'].map(item => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: 14 }}>
                    {item}
                  </a>
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
              {['Blog', 'FAQ', 'Panduan', 'Kontak'].map(item => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: 14 }}>
                    {item}
                  </a>
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
              {[
                { icon: 'Search', href: '#' },
                { icon: 'Pin', href: '#' },
                { icon: 'Route', href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                >
                  {/* Social icons */}
                </a>
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
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privasi</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Syarat Penggunaan</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
