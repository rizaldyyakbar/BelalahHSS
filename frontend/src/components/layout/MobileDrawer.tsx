import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDrawer } from '../../context/DrawerContext';
import { Icon } from '../atomic/Icons';

export const MobileDrawer: React.FC = () => {
  const { isOpen, closeDrawer } = useDrawer();
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');

  if (!isOpen) return null;

  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <div className="mobile-drawer-portal" role="dialog" aria-modal="true" aria-label="Menu Navigasi Mobile">
      {/* Backdrop */}
      <div 
        className="mobile-drawer-backdrop" 
        onClick={closeDrawer}
        tabIndex={-1}
      />

      {/* Slide-in Panel */}
      <aside className="mobile-drawer-panel">
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <span className="mobile-drawer-title">Belalah HSS</span>
            <span className="mobile-drawer-tagline">FIELD GUIDE HULU SUNGAI SELATAN</span>
          </div>
          <button 
            className="mobile-drawer-close-btn"
            onClick={closeDrawer}
            aria-label="Tutup Menu"
          >
            <Icon.Close size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="mobile-drawer-content">
          {/* Section: Navigasi Utama */}
          <div className="mobile-drawer-group">
            <span className="mobile-drawer-group-label">NAVIGASI UTAMA</span>
            
            <button 
              className={`mobile-drawer-nav-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              <div className="mobile-drawer-nav-icon">
                <Icon.Compass size={18} />
              </div>
              <span className="mobile-drawer-nav-text">Beranda</span>
              {isActive('/') && <span className="mobile-nav-dot" />}
            </button>

            <button 
              className={`mobile-drawer-nav-item ${isActive('/directory') ? 'active' : ''}`}
              onClick={() => handleNavClick('/directory')}
            >
              <div className="mobile-drawer-nav-icon">
                <Icon.Grid size={18} />
              </div>
              <span className="mobile-drawer-nav-text">Destinasi Wisata</span>
              {isActive('/directory') && <span className="mobile-nav-dot" />}
            </button>

            <button 
              className={`mobile-drawer-nav-item ${isActive('/planner') ? 'active' : ''}`}
              onClick={() => handleNavClick('/planner')}
            >
              <div className="mobile-drawer-nav-icon">
                <Icon.Route size={18} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <span className="mobile-drawer-nav-text">Perencana Rute</span>
                <span className="mobile-badge-clay">Fitur Utama</span>
              </div>
              {isActive('/planner') && <span className="mobile-nav-dot" />}
            </button>

            <button 
              className={`mobile-drawer-nav-item ${isActive('/journal') ? 'active' : ''}`}
              onClick={() => handleNavClick('/journal')}
            >
              <div className="mobile-drawer-nav-icon">
                <Icon.BookOpen size={18} />
              </div>
              <span className="mobile-drawer-nav-text">Jurnal Wisata</span>
              {isActive('/journal') && <span className="mobile-nav-dot" />}
            </button>
          </div>

          {/* Section: Eksplorasi & Cerita Lapangan */}
          <div className="mobile-drawer-group">
            <span className="mobile-drawer-group-label">EKSPLORASI & EDUKASI</span>

            <button 
              className={`mobile-drawer-nav-item ${isActive('/about') ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              <div className="mobile-drawer-nav-icon">
                <Icon.Info size={18} />
              </div>
              <span className="mobile-drawer-nav-text">Tentang & Visi Geopark</span>
              {isActive('/about') && <span className="mobile-nav-dot" />}
            </button>

            <button 
              className={`mobile-drawer-nav-item ${isActive('/experiences') ? 'active' : ''}`}
              onClick={() => handleNavClick('/experiences')}
            >
              <div className="mobile-drawer-nav-icon">
                <Icon.Layers size={18} />
              </div>
              <span className="mobile-drawer-nav-text">Pengalaman Budaya & Alam</span>
              {isActive('/experiences') && <span className="mobile-nav-dot" />}
            </button>
          </div>

          {/* Section: Call Center & Bantuan Lapangan */}
          <div className="mobile-drawer-group">
            <span className="mobile-drawer-group-label">POS INFORMASI & BANTUAN</span>
            
            <div className="mobile-drawer-emergency-card">
              <div className="mobile-emergency-header">
                <Icon.PhoneCall size={16} />
                <span>Call Center Disporapar HSS</span>
              </div>
              <a href="tel:051721010" className="mobile-emergency-phone">
                (0517) 21010
              </a>
              <p className="mobile-emergency-desc">
                Posko Informasi Kandangan & Kawasan Wisata Loksado. Siap sedia membantu koordinasi lapangan.
              </p>
              <div className="mobile-status-pill">
                <span className="mobile-status-dot" />
                <span>Jalur Meratus Pantau Normal</span>
              </div>
            </div>
          </div>

          {/* Section: Language Switcher */}
          <div className="mobile-drawer-group">
            <span className="mobile-drawer-group-label">PILIHAN BAHASA / LANGUAGE</span>
            <div className="mobile-lang-switcher-row">
              <button 
                className={`mobile-lang-btn ${lang === 'ID' ? 'active' : ''}`}
                onClick={() => setLang('ID')}
              >
                Bahasa Indonesia (ID)
              </button>
              <button 
                className={`mobile-lang-btn ${lang === 'EN' ? 'active' : ''}`}
                onClick={() => setLang('EN')}
              >
                English (EN)
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <span>Dinas Pemuda, Olahraga & Pariwisata Kab. HSS</span>
          <span className="mobile-drawer-version">Geopark Meratus Rute v2.0</span>
        </div>
      </aside>
    </div>
  );
};

export default MobileDrawer;
