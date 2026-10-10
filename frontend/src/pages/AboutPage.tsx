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
            <span>Tentang Belalah HSS • Disporapar HSS</span>
          </div>

          <h1 className="catalog-title">
            Harmoni Teknologi Cerdas &amp; Warisan Tradisi Pegunungan Meratus
          </h1>

          <p className="catalog-subtitle">
            Sistem Pendukung Keputusan dan Perencana Itinerari Pariwisata Hulu Sungai Selatan, memadukan metode
            Multi-Criteria Decision Making (SAW) dengan efisiensi rute shortest-path Dijkstra &amp; Haversine.
          </p>

          <div className="catalog-stats-row">
            <div className="catalog-stat-pill">
              <span style={{ color: 'var(--meratus-deep)' }}>🏛️</span>
              <span>Kabupaten Hulu Sungai Selatan, Kalsel</span>
            </div>
            <div className="catalog-stat-pill">
              <span style={{ color: 'var(--meratus-clay)' }}>⚙️</span>
              <span>SAW + Dijkstra Routing Engine</span>
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
                Metode Rekomendasi SAW
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Sistem merekomendasikan destinasi terbaik dengan metode <strong>Simple Additive Weighting (SAW)</strong> berdasarkan
                prioritas preferensi wisatawan: Kebersihan &amp; Keamanan (40%), Fasilitas (30%), Popularitas (20%), dan Biaya Kunjungan (10%).
              </p>
            </div>

            {/* Card 4 */}
            <div className="about-pillar-card">
              <div style={{ fontSize: 28, marginBottom: 12 }}>🔀</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
                Optimasi Rute Dijkstra &amp; Haversine
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Algoritma shortest-path menyusun urutan kunjungan multi-destinasi yang paling hemat jarak dan durasi tempuh,
                serta siap diekspor langsung ke Google Maps rute multi-stop.
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
