import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';

/**
 * AboutPage — Figma Belalah HSS Tentang Kami & Visi Pariwisata (Node 44:3068)
 * Official institutional and methodological background for Belalah HSS.
 */
export const AboutPage: React.FC = () => {
  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* 1. Hero Ambient Header */}
        <section className="catalog-hero-backdrop" style={{ paddingBottom: 48 }}>
          <div className="catalog-tag-badge">
            <Icon.Compass size={13} />
            <span>Tentang Belalah HSS • Prototype Penelitian Tugas Akhir</span>
          </div>

          <h1 className="catalog-title">
            Perancangan Desain Interaktif Rute Wisata Hulu Sungai Selatan
          </h1>

          <p className="catalog-subtitle">
            Functional interactive prototype aplikasi route planner pariwisata Kabupaten Hulu Sungai Selatan,
            dikembangkan dalam siklus Human-Centered Design untuk pengujian skenario tugas dan evaluasi UEQ.
          </p>

          <div className="catalog-stats-row">
            <div className="catalog-stat-pill">
              <span style={{ color: 'var(--meratus-deep)' }}>🏛️</span>
              <span>Kabupaten Hulu Sungai Selatan, Kalsel</span>
            </div>
            <div className="catalog-stat-pill">
              <span style={{ color: 'var(--meratus-clay)' }}>⚙️</span>
              <span>Simulasi SAW &amp; Model Jarak Dijkstra/Haversine</span>
            </div>
          </div>
        </section>

        {/* 2. 4 Vision Pillars Grid */}
        <section className="bh-container" style={{ marginTop: 36 }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 28px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
              Pilar Pengembangan &amp; Visi Pariwisata
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', margin: 0 }}>
              Komitmen kami menghadirkan pengalaman berwisata yang bermakna, bertanggung jawab, dan mudah diakses oleh semua penjelajah.
            </p>
          </div>

          <div className="about-pillars-grid">
            {/* Card 1 */}
            <div className="about-pillar-card">
              <div style={{ fontSize: 28, marginBottom: 12 }}>🌿</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
                Konservasi Rimba Meratus
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Menjaga kelestarian Geopark Pegunungan Meratus yang berumur ratusan juta tahun dengan mengedepankan prinsip
                pariwisata berkelanjutan (ecotourism) dan kampanye kebersihan zero-waste bagi seluruh wisatawan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="about-pillar-card">
              <div style={{ fontSize: 28, marginBottom: 12 }}>🛶</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
                Pemberdayaan Komunitas Adat
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Mendukung perekonomian joki tradisional balanting paring, pemandu trekking lokal, pengelola homestay, dan pengrajin
                di permukiman Dayak Loksado agar pariwisata membawa manfaat nyata bagi warga setempat.
              </p>
            </div>

            {/* Card 3 */}
            <div className="about-pillar-card">
              <div style={{ fontSize: 28, marginBottom: 12 }}>📊</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
                Simulasi Rekomendasi SAW
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Sistem memberikan skor rekomendasi menggunakan simulasi <strong>Simple Additive Weighting (SAW)</strong> dengan konfigurasi kriteria: Kebersihan &amp; Keamanan (40%), Fasilitas (30%), Popularitas (20%), dan Biaya Kunjungan (10%). Skor ini merupakan konfigurasi simulasi prototype, bukan sertifikasi kualitas resmi.
              </p>
            </div>

            {/* Card 4 */}
            <div className="about-pillar-card">
              <div style={{ fontSize: 28, marginBottom: 12 }}>🧭</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
                Model Jarak Geografis &amp; Saran Urutan
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Matriks jarak geografis dihitung antartitik untuk menyusun saran urutan kunjungan multi-destinasi (pemeriksaan seluruh permutasi untuk ≤ 7 destinasi dan pendekatan greedy untuk &gt; 7 destinasi). Rute aktual dan navigasi jalan riil dibuka langsung ke Google Maps.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
