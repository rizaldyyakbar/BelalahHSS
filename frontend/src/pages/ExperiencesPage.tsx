import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';

export const ExperiencesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [savedSpots, setSavedSpots] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleSpot = (name: string) => {
    if (savedSpots.includes(name)) {
      setSavedSpots(savedSpots.filter((s) => s !== name));
      showToast(`${name} dihapus dari titik singgah.`);
    } else {
      setSavedSpots([...savedSpots, name]);
      showToast(`${name} berhasil disisipkan ke rencana rute!`);
    }
  };

  const categories = ['Semua', 'Kuliner Khas', 'Homestay Warga'];

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#012D1D',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
            zIndex: 1100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {toastMsg}
        </div>
      )}

      <main style={{ flex: 1, paddingBottom: 90 }}>
        {/* Header Section (Figma Screen 6) */}
        <section className="bh-container" style={{ paddingTop: 96, paddingBottom: 16 }}>
          {/* Eyebrow Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFF3EB',
              border: '1px solid #FFE0CE',
              borderRadius: 9999,
              padding: '4px 12px',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13 }}>🛖</span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#994700',
                textTransform: 'uppercase',
              }}
            >
              Pemberhentian Terkurasi
            </span>
          </div>

          {/* Title & Subtitle */}
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 800,
              color: 'var(--meratus-deep)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Titik Singgah &amp; Kuliner Khas
          </h1>

          <p
            style={{
              fontSize: 14,
              color: '#57534E',
              margin: '0 0 20px',
              lineHeight: 1.55,
              maxWidth: 580,
            }}
          >
            Tempat istirahat nyaman, kuliner legendaris Ketupat Kandangan, dan homestay ramah warga di sepanjang koridor Loksado-Meratus.
          </p>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 20,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: active ? '#012D1D' : '#EDF2EE',
                    color: active ? '#ffffff' : '#57534E',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '6px 16px',
                    fontSize: 12.5,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Spot Cards Feed (Responsive 2-Columns on Desktop) */}
        <section className="bh-container">
          <div className="experiences-cards-grid">
            {/* Card 1: Warung Ketupat Kandangan Hj. Maryam */}
            {(selectedCategory === 'Semua' || selectedCategory === 'Kuliner Khas') && (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #EBEFEA',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg"
                    alt="Warung Ketupat Kandangan Hj. Maryam"
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 12,
                      background: '#FD934C',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 9999,
                    }}
                  >
                    Otentik Kuliner
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 12,
                      background: 'rgba(0, 0, 0, 0.72)',
                      color: '#ffffff',
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 9999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Icon.Compass size={11} style={{ color: '#C1ECD4' }} />
                    <span>1.5 km</span>
                  </div>
                </div>

                <div style={{ padding: '14px 14px 16px' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 16.5, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 4px' }}>
                    Warung Ketupat Kandangan Hj. Maryam
                  </h3>
                  <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 10px', lineHeight: 1.45 }}>
                    Ikan Haruan Asap kuah santan gurih berempah khas Banjar dipanggang dengan arang sabut kelapa tradisional.
                  </p>
                  <div style={{ fontSize: 11, color: '#6E7972', display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span>📍 Jl. Jend. Sudirman Kandangan</span>
                    <span>🕒 06:30 – 21:00 WITA</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #F0F4F1' }}>
                    <div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6E7972' }}>KISARAN HARGA</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#012D1D' }}>Rp 20.000 – 35.000</div>
                    </div>
                    <button
                      onClick={() => handleToggleSpot('Warung Ketupat Hj. Maryam')}
                      style={{
                        height: 36,
                        padding: '0 14px',
                        borderRadius: 10,
                        border: 'none',
                        background: savedSpots.includes('Warung Ketupat Hj. Maryam') ? '#09261B' : '#012D1D',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Icon.Route size={14} style={{ color: '#C1ECD4' }} />
                      <span>{savedSpots.includes('Warung Ketupat Hj. Maryam') ? '✓ Di Rute' : '+ Singgah di Rute'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: Sentra Dodol Asli Kandangan Berkat Bersama */}
            {(selectedCategory === 'Semua' || selectedCategory === 'Kuliner Khas') && (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #EBEFEA',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                  <img
                    src="/assets/museum-rakyat.jpg"
                    alt="Sentra Dodol Asli Kandangan Berkat Bersama"
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 12,
                      background: '#8C4A1E',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 9999,
                    }}
                  >
                    Oleh-oleh Khas
                  </div>
                </div>

                <div style={{ padding: '14px 14px 16px' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 16.5, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 4px' }}>
                    Sentra Dodol Asli Kandangan Berkat Bersama
                  </h3>
                  <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 10px', lineHeight: 1.45 }}>
                    Kudapan manis legit resep turun-temurun, tersedia varian original santan kelapa, ketan hitam, dan durian hutan Meratus.
                  </p>
                  <div style={{ fontSize: 11, color: '#6E7972', marginBottom: 12 }}>
                    📍 Kawasan Simpang 5 Kandangan
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #F0F4F1' }}>
                    <div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6E7972' }}>KOTAK KECIL</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#012D1D' }}>Mulai Rp 15.000</div>
                    </div>
                    <button
                      onClick={() => handleToggleSpot('Sentra Dodol Berkat Bersama')}
                      style={{
                        height: 36,
                        padding: '0 14px',
                        borderRadius: 10,
                        border: 'none',
                        background: savedSpots.includes('Sentra Dodol Berkat Bersama') ? '#09261B' : '#012D1D',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Icon.Route size={14} style={{ color: '#C1ECD4' }} />
                      <span>{savedSpots.includes('Sentra Dodol Berkat Bersama') ? '✓ Di Rute' : '+ Singgah di Rute'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: Meratus Riverside Homestay Loksado */}
            {(selectedCategory === 'Semua' || selectedCategory === 'Homestay Warga') && (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #EBEFEA',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Sungai_Amandit_Loksado.jpg/1280px-Sungai_Amandit_Loksado.jpg"
                    alt="Meratus Riverside Homestay Loksado"
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 12,
                      background: '#0A4433',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 9999,
                    }}
                  >
                    Tepi Sungai Amandit
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 12,
                      background: 'rgba(0, 0, 0, 0.72)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: 9999,
                    }}
                  >
                    Rp 250.000 / malam
                  </div>
                </div>

                <div style={{ padding: '14px 14px 16px' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 16.5, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 4px' }}>
                    Meratus Riverside Homestay Loksado
                  </h3>
                  <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 10px', lineHeight: 1.45 }}>
                    Penginapan kayu asri dengan suara gemericik air sungai alami. Dikelola keluarga Dayak Meratus dengan keramahan otentik.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    <span style={{ background: '#F1F4F1', padding: '3px 8px', borderRadius: 8, fontSize: 11, color: '#414844' }}>
                      🛏️ Kamar Mandi Bersih
                    </span>
                    <span style={{ background: '#F1F4F1', padding: '3px 8px', borderRadius: 8, fontSize: 11, color: '#414844' }}>
                      ☕ Sarapan Pagi
                    </span>
                    <span style={{ background: '#F1F4F1', padding: '3px 8px', borderRadius: 8, fontSize: 11, color: '#414844' }}>
                      🛶 Akses Lanting Bambu
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #F0F4F1' }}>
                    <div style={{ fontSize: 11.5, color: '#6E7972' }}>
                      📍 Desa Hulu Banyu, Loksado
                    </div>
                    <button
                      onClick={() => handleToggleSpot('Meratus Riverside Homestay')}
                      style={{
                        height: 36,
                        padding: '0 14px',
                        borderRadius: 10,
                        border: 'none',
                        background: savedSpots.includes('Meratus Riverside Homestay') ? '#09261B' : '#012D1D',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Icon.Route size={14} style={{ color: '#C1ECD4' }} />
                      <span>{savedSpots.includes('Meratus Riverside Homestay') ? '✓ Di Rute' : '+ Singgah di Rute'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 4: SPBU Gambah Luar (Pos BBM Terakhir) */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #EBEFEA',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#FFF0F0',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  ⛽
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      background: '#FFEAEA',
                      color: '#C23C3C',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      display: 'inline-block',
                      marginBottom: 4,
                    }}
                  >
                    ⚠️ Pos BBM Terakhir
                  </span>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 700, color: '#012D1D', margin: '0 0 4px' }}>
                    SPBU Gambah Luar
                  </h3>
                  <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 10px', lineHeight: 1.4 }}>
                    Titik pengisian bahan bakar resmi terakhir sebelum rute menanjak menuju kawasan pegunungan Meratus.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: 11, color: '#6E7972', display: 'flex', gap: 10 }}>
                      <span>ATM</span> • <span>Musholla</span> • <span>Toilet Bersih</span>
                    </div>
                    <button
                      onClick={() => window.open('https://maps.google.com/?q=SPBU+Gambah+Luar+Kandangan', '_blank')}
                      style={{
                        height: 32,
                        padding: '0 12px',
                        borderRadius: 8,
                        border: '1px solid #E2EAE4',
                        background: '#F1F4F1',
                        color: '#1A1611',
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Icon.Location size={13} style={{ color: '#FD934C' }} />
                      <span>Petunjuk Titik</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Balai Singgah Pokdarwis Malaris */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #EBEFEA',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Balai_Adat_Malaris.jpg/1280px-Balai_Adat_Malaris.jpg"
                  alt="Balai Singgah Pokdarwis Malaris"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 12,
                    background: '#012D1D',
                    color: '#C1ECD4',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: 9999,
                  }}
                >
                  Balai Pokdarwis
                </div>
              </div>

              <div style={{ padding: '14px 14px 16px' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 16.5, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 4px' }}>
                  Balai Singgah Pokdarwis Malaris
                </h3>
                <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 10px', lineHeight: 1.45 }}>
                  Pusat informasi pemandu lokal Loksado, seduhan kopi pasak bumi hangat tradisional, dan titik kumpul rehat pendaki Meratus.
                </p>
                <div style={{ fontSize: 11, color: '#6E7972', marginBottom: 12 }}>
                  📍 Dikelola Kelompok Sadar Wisata Desa Malaris
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #F0F4F1' }}>
                  <div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6E7972' }}>KOPI &amp; REHAT</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#012D1D' }}>Donasi Sukarela</div>
                  </div>
                  <button
                    onClick={() => handleToggleSpot('Balai Singgah Pokdarwis Malaris')}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 10,
                      border: 'none',
                      background: savedSpots.includes('Balai Singgah Pokdarwis Malaris') ? '#09261B' : '#012D1D',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Icon.Route size={14} style={{ color: '#C1ECD4' }} />
                    <span>{savedSpots.includes('Balai Singgah Pokdarwis Malaris') ? '✓ Di Rute' : '+ Singgah di Rute'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Callout Card: Dukung UMKM Warga Dayak & Banjar (Figma Screen 6) */}
            <div
              style={{
                background: '#012D1D',
                borderRadius: 18,
                padding: '18px 16px',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(1, 45, 29, 0.25)',
                marginTop: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>🍃</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: '#C1ECD4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Etika Singgah Bijak
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, margin: '0 0 8px' }}>
                Dukung UMKM Warga Dayak &amp; Banjar
              </h4>

              <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, margin: '0 0 14px' }}>
                Berbelanja langsung di warung warga memperkuat ekonomi akar rumput dan kelestarian alam Meratus. Bawalah tempat makan sendiri atau pilih kemasan daun pisang untuk mengurangi sampah plastik di pegunungan.
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: 'rgba(193, 236, 212, 0.15)', border: '1px solid rgba(193, 236, 212, 0.3)', color: '#C1ECD4', padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600 }}>
                  ✓ Bebas Sampah
                </span>
                <span style={{ background: 'rgba(193, 236, 212, 0.15)', border: '1px solid rgba(193, 236, 212, 0.3)', color: '#C1ECD4', padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600 }}>
                  ✓ Keadilan Ekonomi
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExperiencesPage;
