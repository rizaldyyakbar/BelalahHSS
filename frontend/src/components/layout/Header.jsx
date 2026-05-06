import React from 'react';
import { Icon } from '../atomic/Icons';

/**
 * Header/Navigation — Web header component
 * @param {string} active - active page ('home' | 'planner' | 'directory' | 'about')
 * @param {object} logo - logo configuration
 */
export const Header = ({ 
  active = 'home',
  logo = { text: 'Belalah', sub: 'HSS' },
  onNavClick = () => {},
  solid = false,
}) => {
  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'planner', label: 'Perencana Rute' },
    { id: 'directory', label: 'Direktori Destinasi' },
    { id: 'about', label: 'Tentang' },
  ];

  return (
    <nav className={`bh-webnav ${solid ? 'solid' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 56px' }}>
      <div className="bh-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, backgroundColor: 'var(--sage)', borderRadius: 'var(--radius-sm)' }} />
        <div>
          <div className="word" style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1, margin: 0 }}>
            {logo.text}
          </div>
          <div className="sub" style={{ fontFamily: 'var(--sans)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--ink-3)' }}>
            {logo.sub}
          </div>
        </div>
      </div>

      <div className="bh-webnav-links" style={{ display: 'flex', gap: 30, fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>
        {navItems.map(item => (
          <a
            key={item.id}
            onClick={() => onNavClick(item.id)}
            style={{
              color: active === item.id ? 'var(--ink)' : 'var(--ink-2)',
              textDecoration: 'none',
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: 4,
            }}
          >
            {item.label}
            {active === item.id && (
              <div style={{
                content: '""',
                display: 'block',
                width: 18,
                height: 2,
                background: 'var(--clay)',
                borderRadius: 2,
                margin: '4px auto 0',
              }} />
            )}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--ink-2)' }}>
          <Icon.Search size={20} />
        </button>
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--ink-2)' }}>
          <Icon.User size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Header;
