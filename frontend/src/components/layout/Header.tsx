import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDrawer } from '../../context/DrawerContext';
import { Icon } from '../atomic/Icons';

/**
 * Header — Figma Belalah HSS Navigation Bar
 * Matches Node 44:3 in Figma
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen: isDrawerOpen, toggleDrawer } = useDrawer();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`bh-header ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(246, 251, 245, 0.95)' : 'rgba(246, 251, 245, 0.90)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(193, 200, 194, 0.35)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
        transition: 'all var(--transition-base)',
      }}
    >
      <div
        className="bh-header-inner"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          height: 76,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--meratus-deep)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Belalah HSS
          </span>
          <span
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: 'var(--meratus-muted)',
              textTransform: 'uppercase',
            }}
          >
            Hulu Sungai Selatan
          </span>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
          className="bh-webnav-links"
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive('/') ? 700 : 500,
              color: isActive('/') ? 'var(--meratus-deep)' : 'var(--meratus-muted)',
              borderBottom: isActive('/') ? '2.5px solid var(--meratus-deep)' : '2.5px solid transparent',
              paddingBottom: 6,
              transition: 'all var(--transition-fast)',
            }}
          >
            Beranda
          </Link>

          <Link
            to="/directory"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive('/directory') ? 700 : 500,
              color: isActive('/directory') ? 'var(--meratus-deep)' : 'var(--meratus-muted)',
              borderBottom: isActive('/directory') ? '2.5px solid var(--meratus-deep)' : '2.5px solid transparent',
              paddingBottom: 6,
              transition: 'all var(--transition-fast)',
            }}
          >
            Destinasi Wisata
          </Link>

          <Link
            to="/planner"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive('/planner') ? 700 : 500,
              color: isActive('/planner') ? 'var(--meratus-deep)' : 'var(--meratus-muted)',
              borderBottom: isActive('/planner') ? '2.5px solid var(--meratus-deep)' : '2.5px solid transparent',
              paddingBottom: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all var(--transition-fast)',
            }}
          >
            <span>Perencana Rute</span>
            <span
              style={{
                background: 'var(--meratus-clay-soft)',
                color: 'var(--meratus-clay-dark)',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 9999,
                lineHeight: 1.3,
              }}
            >
              Fitur Utama
            </span>
          </Link>

          <Link
            to="/journal"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive('/journal') ? 700 : 500,
              color: isActive('/journal') ? 'var(--meratus-deep)' : 'var(--meratus-muted)',
              borderBottom: isActive('/journal') ? '2.5px solid var(--meratus-deep)' : '2.5px solid transparent',
              paddingBottom: 6,
              transition: 'all var(--transition-fast)',
            }}
          >
            Jurnal Wisata
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="bh-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Language Toggle */}
          <div
            className="meratus-lang-toggle bh-header-lang"
            style={{ cursor: 'pointer' }}
            onClick={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
            title="Ganti Bahasa"
          >
            <span style={{ color: lang === 'ID' ? 'var(--meratus-deep)' : 'var(--meratus-subtle)', fontWeight: lang === 'ID' ? 700 : 500, padding: '0 4px' }}>
              ID
            </span>
            <span style={{ color: 'var(--meratus-card-border)' }}>|</span>
            <span style={{ color: lang === 'EN' ? 'var(--meratus-deep)' : 'var(--meratus-subtle)', fontWeight: lang === 'EN' ? 700 : 500, padding: '0 4px' }}>
              EN
            </span>
          </div>

          {/* Mulai Rute CTA Button (Desktop) */}
          <button
            className="meratus-nav-btn bh-header-cta"
            onClick={() => navigate('/planner')}
          >
            <Icon.Compass size={16} />
            <span>Mulai Rute</span>
          </button>

          {/* User Profile Avatar (Desktop) */}
          <button
            className="bh-header-avatar"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--meratus-deep)',
              border: 'none',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)',
            }}
            title="Tentang Belalah HSS"
            onClick={() => navigate('/about')}
          >
            <Icon.User size={16} />
          </button>

          {/* Mobile Menu Toggle Button (Mobile only) */}
          <button
            className="bh-mobile-menu-btn"
            onClick={toggleDrawer}
            aria-label={isDrawerOpen ? "Tutup menu" : "Buka menu navigasi"}
            aria-expanded={isDrawerOpen}
          >
            {isDrawerOpen ? <Icon.Close size={20} /> : <Icon.Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
