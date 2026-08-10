import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { IconButton } from '../components/atomic/IconButton';
import { Stars } from '../components/atomic/Stars';
import { Chip } from '../components/atomic/Chip';
import Button from '../components/atomic/Button';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { getGoogleMapsRouteUrl } from '../services/api';

/**
 * DestinationDetailPage — Immersive detail with sticky sidebar
 */
export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const destination: Destination | undefined = DESTINATIONS.find(d => d.id === parseInt(id || ''));

  if (!destination) {
    return (
      <div className="bh-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <h1 className="bh-serif" style={{ fontSize: 32 }}>Destinasi tidak ditemukan</h1>
        <Button onClick={() => navigate('/')} variant="sage">Kembali ke Beranda</Button>
      </div>
    );
  }

  const getImageUrl = (img: string) => {
    if (img.includes('.')) return `/assets/${img}`;
    return `/assets/${img}.jpg`;
  };

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '100px 56px 40px' }}>
        {/* Hero Image */}
        <div className="bh-detail-hero">
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
            <img
              src={getImageUrl(destination.img)}
              alt={destination.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) parent.style.background = 'linear-gradient(135deg, #5B8C5A 0%, #2F5E3D 50%, #1F3D2B 100%)';
              }}
            />
          </div>

          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)',
            zIndex: 2, borderRadius: 'var(--radius-xl)',
          }} />

          {/* Action buttons */}
          <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: 10 }}>
            <IconButton variant="light" size={44} onClick={() => setIsFavorite(!isFavorite)}>
              <Icon.Heart size={20} filled={isFavorite} />
            </IconButton>
            <IconButton variant="light" size={44}>
              <Icon.Search size={20} />
            </IconButton>
          </div>

          {/* Title */}
          <div style={{ position: 'absolute', bottom: 28, left: 32, right: 32, zIndex: 5, color: '#fff' }}>
            <h1 className="bh-serif" style={{ fontSize: 52, fontWeight: 500, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {destination.name}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
          {/* Main Content */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <Chip variant="sage">{destination.category}</Chip>
              {destination.region && <Chip>{destination.region}</Chip>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', marginBottom: 10 }}>
                  <Icon.Pin size={16} /> {destination.distance}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Icon.Clock size={14} />
                  <span style={{ fontSize: 14 }}>{destination.hours || '08:00 - 17:00'}</span>
                </div>
              </div>
              <Stars rating={destination.rating} reviews={destination.reviews} size={16} />
            </div>

            {/* Description */}
            <div style={{ marginTop: 28 }}>
              <h2 className="bh-serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 12 }}>
                Tentang Destinasi
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-2)' }}>
                {destination.fullDescription || destination.description}
              </p>
            </div>

            {/* Facilities */}
            {destination.facilities && destination.facilities.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 className="bh-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>Fasilitas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {destination.facilities.map((facility, idx) => (
                    <div key={idx} className="bh-facility-card">
                      <div style={{ fontSize: 24, marginBottom: 8 }}>
                        {facility.icon === 'bed' ? '🛏️' : facility.icon === 'fork' ? '🍽️' : '🅿️'}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{facility.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery placeholder */}
            {destination.photos && destination.photos.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 className="bh-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>Galeri Foto</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {destination.photos.map((_, idx) => (
                    <div key={idx} style={{
                      aspectRatio: '1',
                      borderRadius: 'var(--radius-md)',
                      background: `linear-gradient(135deg, var(--bg-soft) 0%, var(--line) 100%)`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bh-detail-sidebar">
            <div className="price-card">
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-3)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Harga Tiket
              </h3>
              <div className="price">{destination.entrance || 'Rp 10.000'}</div>

              <a
                href={getGoogleMapsRouteUrl(destination)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', width: '100%', display: 'block', marginBottom: 10 }}
              >
                <Button variant="sage" size="lg" style={{ width: '100%', justifyContent: 'center' }}>
                  🗺️ Buka Rute Google Maps
                </Button>
              </a>
              <Button variant="secondary" size="lg" style={{ width: '100%', justifyContent: 'center' }}>
                Tambah ke Rencana
              </Button>

              <div style={{ marginTop: 20, fontSize: 12, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                ℹ️ Harga dapat berubah tanpa pemberitahuan
              </div>
            </div>

            {/* Related Destinations */}
            <div style={{ marginTop: 24 }}>
              <h3 className="bh-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Destinasi Terdekat</h3>
              {DESTINATIONS.filter(d => d.id !== destination.id).slice(0, 3).map(dest => (
                <div
                  key={dest.id}
                  className="bh-related-item"
                  onClick={() => navigate(`/destination/${dest.id}`)}
                >
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{dest.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{dest.distance}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default DestinationDetailPage;
