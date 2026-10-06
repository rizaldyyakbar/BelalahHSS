import React, { useState, useMemo } from 'react';
import { Icon } from '../atomic/Icons';
import { Destination } from '../../constants/destinations';

interface HeroSectionProps {
  selectedDestinations: Destination[];
  onRemoveDestination: (id: number) => void;
  onAddDestination: (dest: Destination) => void;
  availableDestinations: Destination[];
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  startPoint: string;
  onStartPointChange: (point: string) => void;
  onBuildRoute: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedDestinations,
  onRemoveDestination,
  onAddDestination,
  availableDestinations,
  selectedCategory,
  onCategorySelect,
  startPoint,
  onStartPointChange,
  onBuildRoute,
}) => {
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Dynamic categories derived from live destinations
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    availableDestinations.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    if (set.size > 0) {
      return ['Semua', ...Array.from(set)];
    }
    return ['Semua', 'Wisata Alam', 'Wisata Budaya', 'Petualangan', 'Religi'];
  }, [availableDestinations]);

  // Filter unselected destinations for the dropdown
  const unselectedDestinations = availableDestinations.filter(
    (d) => !selectedDestinations.some((sd) => sd.id === d.id)
  );

  return (
    <div style={{ padding: '0 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="hero-meratus-container">
        {/* Eyebrow Tag */}
        <div className="hero-meratus-tag">
          <Icon.Compass size={13} style={{ color: '#c1ecd4' }} />
          <span>Sistem Cerdas Rute Meratus • Hulu Sungai Selatan</span>
        </div>

        {/* Title */}
        <h1 className="hero-meratus-title">
          Rencanakan rute wisata HSS dalam <br />3 langkah
        </h1>

        {/* Description */}
        <p className="hero-meratus-desc">
          Pilih titik mulai, tentukan destinasi favoritmu di Pegunungan Meratus & sekitarnya,
          dan dapatkan urutan rute paling efisien otomatis dengan kalkulasi presisi.
        </p>

        {/* Trip Builder Card */}
        <div className="trip-builder-card">
          <div className="trip-builder-grid">
            {/* Kolom 1: Titik Keberangkatan */}
            <div className="trip-builder-field">
              <div className="trip-builder-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Pin size={14} style={{ color: 'var(--meratus-clay)' }} />
                  Titik Keberangkatan
                </span>
                <span
                  style={{
                    background: 'var(--meratus-mint)',
                    color: 'var(--meratus-mint-text)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--meratus-deep)' }} />
                  GPS Siap
                </span>
              </div>
              <div className="trip-builder-input-box">
                <Icon.Location size={18} style={{ color: 'var(--meratus-deep)' }} />
                <select
                  value={startPoint}
                  onChange={(e) => onStartPointChange(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    width: '100%',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Pilih Titik Keberangkatan"
                >
                  <option value="kandangan">Kota Kandangan (Pusat Kota / Alun-alun)</option>
                  <option value="current">Titik Lokasi Saya Sekarang (GPS)</option>
                  <option value="loksado">Pintu Masuk Wisata Loksado</option>
                  <option value="nagari">Daha Utara / Nagara</option>
                </select>
              </div>
            </div>

            {/* Kolom 2: Tujuan Wisata (Multi-destinasi) */}
            <div className="trip-builder-field" style={{ position: 'relative' }}>
              <div className="trip-builder-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Compass size={14} style={{ color: 'var(--meratus-deep)' }} />
                  Tujuan Wisata (Multi-destinasi)
                </span>
                <span style={{ color: 'var(--meratus-clay)', fontSize: 12, fontWeight: 700 }}>
                  {selectedDestinations.length} Destinasi Dipilih
                </span>
              </div>

              {/* Chips + Add trigger */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                  minHeight: 48,
                  padding: '6px 12px',
                  background: '#fafcfa',
                  border: '1.5px solid var(--meratus-card-border)',
                  borderRadius: 12,
                }}
              >
                {selectedDestinations.map((dest) => (
                  <span
                    key={dest.id}
                    style={{
                      background: 'var(--meratus-mint)',
                      borderRadius: 9999,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--meratus-deep)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{dest.name.length > 20 ? `${dest.name.slice(0, 19)}...` : dest.name}</span>
                    <button
                      onClick={() => onRemoveDestination(dest.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--meratus-subtle)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                      title="Hapus destinasi"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {/* Dropdown trigger */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--meratus-card-border)',
                      borderRadius: 9999,
                      padding: '4px 10px',
                      fontSize: 12,
                      color: 'var(--meratus-deep)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>+ Tambah destinasi...</span>
                  </button>

                  {/* Dropdown List */}
                  {showAddDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 8,
                        background: '#ffffff',
                        border: '1px solid var(--meratus-card-border)',
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        zIndex: 200,
                        minWidth: 260,
                        maxHeight: 240,
                        overflowY: 'auto',
                        padding: '6px 0',
                      }}
                    >
                      {unselectedDestinations.length === 0 ? (
                        <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--meratus-subtle)' }}>
                          Semua destinasi sudah ditambahkan
                        </div>
                      ) : (
                        unselectedDestinations.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              onAddDestination(item);
                              setShowAddDropdown(false);
                            }}
                            style={{
                              padding: '8px 16px',
                              fontSize: 13,
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F6FBF5')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                          >
                            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{item.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--meratus-subtle)' }}>{item.region}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kolom 3: Buat Rute Button */}
            <div>
              <button
                className="trip-builder-btn"
                onClick={onBuildRoute}
                title="Buka planner dengan destinasi terpilih"
              >
                <Icon.Compass size={18} />
                <span>Buat Rute Perjalanan</span>
              </button>
            </div>
          </div>

          {/* Bottom Alert & Filter Bar */}
          <div className="trip-builder-tip-bar">
            <div className="trip-builder-tip">
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#F4ECD8',
                  color: 'var(--meratus-clay-dark)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                i
              </span>
              <span>Rekomendasi ideal: 2–3 destinasi untuk perjalanan 1 hari yang nyaman.</span>
            </div>

            <div className="trip-builder-categories">
              <span style={{ fontWeight: 700, color: 'var(--meratus-muted)', marginRight: 4, letterSpacing: '0.05em' }}>
                KATEGORI:
              </span>
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onCategorySelect(cat)}
                    style={{
                      background: isSelected ? 'var(--meratus-deep)' : '#F6F8F6',
                      color: isSelected ? '#ffffff' : 'var(--meratus-muted)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--meratus-deep)' : 'var(--meratus-card-border)',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3-Step Process Card */}
        <div className="three-steps-card">
          <div className="step-item">
            <div className="step-number-badge">1</div>
            <div>
              <div className="step-title">Pilih Titik Mulai</div>
              <div className="step-desc">Dari Kandangan kota atau koordinat GPS Anda</div>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number-badge">2</div>
            <div>
              <div className="step-title">Tentukan Destinasi Pilihan</div>
              <div className="step-desc">Pilih dari skor rekomendasi tertinggi atau kategori</div>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number-badge">3</div>
            <div>
              <div className="step-title">Optimasi Otomatis</div>
              <div className="step-desc">Kalkulasi rute terpendek siap dibuka di Maps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
