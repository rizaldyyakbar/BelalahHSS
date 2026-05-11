import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../atomic/Icons';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

/**
 * Header — Floating Glass Capsule Navigation
 * Matches the premium centered design preview.
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { id: 'destinations', label: 'Destinations', path: '/directory' },
    { id: 'experiences', label: 'Experiences', path: '/experiences' },
    { id: 'journal', label: 'Journal', path: '/journal' },
    { id: 'plan', label: 'Plan Trip', path: '/planner' },
    { id: 'about', label: 'About Us', path: '/about' },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <div className="bh-nav-wrapper" style={{
      position: 'fixed',
      top: 24,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '0 24px',
    }}>
      <nav className="liquid-glass" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px 8px 24px',
        width: '100%',
        maxWidth: 1200,
        gap: 32,
        borderRadius: 'var(--radius-pill)',
        transition: 'all var(--transition-base)',
        transform: scrolled ? 'scale(0.98)' : 'scale(1)',
        background: scrolled ? 'rgba(255, 251, 243, 0.6)' : 'rgba(255, 251, 243, 0.3)',
      }}>
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--serif)',
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}>
            Belalah HSS
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: 24,
          marginLeft: 'auto',
          alignItems: 'center',
        }}>
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: isActive(item.path) ? 'var(--sage)' : 'var(--ink-2)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Search Action */}
        <div style={{ marginLeft: 12 }}>
          <button className="bh-iconbtn glass-dark" style={{
            width: 42,
            height: 42,
            background: 'transparent',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
          }}>
            <Icon.Search size={18} style={{ color: 'var(--ink)' }} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
