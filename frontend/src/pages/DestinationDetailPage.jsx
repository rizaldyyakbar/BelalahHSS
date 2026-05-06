import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { IconButton } from '../components/atomic/IconButton';
import { Stars } from '../components/atomic/Stars';
import { Chip } from '../components/atomic/Chip';
import Button from '../components/atomic/Button';
import { DESTINATIONS } from '../constants/destinations';

/**
 * DestinationDetailPage — Halaman detail destinasi
 */
export const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const destination = DESTINATIONS.find(d => d.id === parseInt(id));

  if (!destination) {
    return (
      <div className="bh-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>Destinasi tidak ditemukan</h1>
        <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="bh-screen scroll web" style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--ink)',
      fontFamily: 'var(--sans)',
      fontSize: 15,
      lineHeight: 1.5,
    }}>
      <Header active="directory" />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 56px' }}>
        {/* Hero Section */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          height: 400,
          marginBottom: 40,
          backgroundColor: 'var(--bg-soft)',
        }}>
          <div className={`bh-photo ${destination.img}`} style={{ position: 'absolute', inset: 0 }}>
            <span className="credit">FOTO · {destination.location?.toUpperCase()}</span>
          </div>
          
          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 2,
          }} />

          {/* Header overlay */}
          <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 10,
            display: 'flex',
            gap: 12,
          }}>
            <IconButton
              variant="light"
              size={44}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Icon.Heart size={20} filled={isFavorite} />
            </IconButton>
            <IconButton variant="light" size={44}>
              <Icon.Search size={20} />
            </IconButton>
          </div>

          {/* Title overlay */}
          <div style={{
            position: 'absolute',
            bottom: 28,
            left: 28,
            right: 28,
            zIndex: 5,
            color: '#fff',
          }}>
            <h1 className="bh-serif" style={{
              fontSize: 48,
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              {destination.name}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
          {/* Main Content */}
          <div>
            {/* Info Header */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <Chip variant="sage">{destination.category}</Chip>
              {destination.region && <Chip>{destination.region}</Chip>}
            </div>

            {/* Location & Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', marginBottom: 10 }}>
                  <Icon.Pin size={16} /> {destination.distance}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Icon.Clock size={14} />
                  <span style={{ fontSize: 14 }}>{destination.hours || '08:00 - 17:00'}</span>
                </div>
              </div>
              <div>
                <Stars rating={destination.rating} reviews={destination.reviews} size={16} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: 28 }}>
              <h2 className="bh-serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 12 }}>
                Tentang Destinasi
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
                {destination.fullDescription || destination.description}
              </p>
            </div>

            {/* Facilities */}
            {destination.facilities && destination.facilities.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 className="bh-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
                  Fasilitas
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {destination.facilities.map((facility, idx) => (
                    <div key={idx} style={{
                      padding: 16,
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>
                        🏨 {/* Icon placeholder */}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {facility.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {destination.photos && destination.photos.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 className="bh-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
                  Galeri Foto
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {destination.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-soft)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div style={{
              padding: 24,
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-3)', margin: '0 0 12px 0' }}>
                HARGA TIKET
              </h3>
              <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 20, color: 'var(--clay)' }}>
                {destination.entrance || 'Rp 10.000'}
              </div>
              
              <Button
                variant="sage"
                size="lg"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
              >
                Pesan Sekarang
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Tambah ke Rencana
              </Button>

              {/* Info */}
              <div style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)' }}>
                <div style={{ marginBottom: 8 }}>
                  ℹ️ Harga dapat berubah tanpa pemberitahuan
                </div>
              </div>
            </div>

            {/* Related Destinations */}
            <div style={{ marginTop: 24 }}>
              <h3 className="bh-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>
                Destinasi Terdekat
              </h3>
              {DESTINATIONS.slice(0, 3).map(dest => (
                <div
                  key={dest.id}
                  onClick={() => navigate(`/destination/${dest.id}`)}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: '1px solid var(--line)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                    {dest.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    {dest.distance}
                  </div>
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
