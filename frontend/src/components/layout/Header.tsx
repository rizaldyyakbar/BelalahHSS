import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

interface LogoConfig {
  text: string;
  sub: string;
}

interface HeaderProps {
  logo?: LogoConfig;
  solid?: boolean;
}

/**
 * Header/Navigation — Web header component
 */
export const Header: React.FC<HeaderProps> = ({
  logo = { text: 'Belalah', sub: 'HSS' },
  solid = false,
}) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Beranda', path: '/' },
    { id: 'planner', label: 'Perencana Rute', path: '/planner' },
    { id: 'directory', label: 'Direktori Destinasi', path: '/directory' },
    { id: 'about', label: 'Tentang', path: '/about' },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav className={`bh-webnav ${solid ? 'solid' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 56px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>

      <div className="bh-webnav-links" style={{ display: 'flex', gap: 30, fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>
        {navItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              color: isActive(item.path) ? 'var(--ink)' : 'var(--ink-2)',
              textDecoration: 'none',
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: 4,
              transition: 'color 0.2s ease',
            }}
          >
            {item.label}
            {isActive(item.path) && (
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
          </Link>
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
