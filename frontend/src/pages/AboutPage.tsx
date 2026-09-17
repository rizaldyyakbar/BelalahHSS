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
        <section style={{ maxWidth: 1280, margin: '48px auto 0', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
              Pilar Pengembangan &amp; Visi Pariwisata
            </h2>
            <p style={{ fontSize: 15, color: 'var(--meratus-muted)', margin: 0 }}>
              Komitmen kami menghadirkan pengalaman berwisata yang bermakna, bertanggung jawab, dan mudah diakses oleh semua penjelajah.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--meratus-card-border)',
                borderRadius: 18,
                padding: 32,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
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
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--meratus-card-border)',
                borderRadius: 18,
                padding: 32,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
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
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--meratus-card-border)',
                borderRadius: 18,
                padding: 32,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>📊</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--meratus-deep)', margin: '0 0 10px' }}>
                Metode Rekomendasi SAW
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--meratus-muted)', lineHeight: 1.65, margin: 0 }}>
                Sistem merekomendasikan destinasi terbaik dengan metode <strong>Simple Additive Weighting</strong> berdasarkan
                4 kriteria ilmiah: Fasilitas (40%), Kebersihan &amp; Keamanan (25%), Biaya Kunjungan (20%), dan Popularitas (15%).
              </p>
            </div>

            {/* Card 4 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--meratus-card-border)',
                borderRadius: 18,
                padding: 32,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
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

        {/* 3. Official Institutional Contacts Box */}
        <section style={{ maxWidth: 1280, margin: '48px auto 100px', padding: '0 32px' }}>
          <div
            style={{
              background: '#012D1D',
              borderRadius: 20,
              padding: '40px 48px',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c1ecd4' }}>
                Pusat Informasi Pariwisata Resmi
              </span>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, margin: '6px 0 10px' }}>
                Dinas Pemuda, Olahraga, dan Pariwisata HSS
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
                Jl. Jenderal Sudirman No. 1, Kandangan Kota, Kabupaten Hulu Sungai Selatan, Kalimantan Selatan 71213.
                Layanan informasi tiket, reservasi homestay, dan panduan perizinan adat.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="mailto:disporapar@hulusungaiselatankab.go.id"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px 20px',
                  borderRadius: 9999,
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon.Mail size={16} />
                <span>Kirim Email</span>
              </a>

              <a
                href="tel:051721001"
                style={{
                  background: '#FD934C',
                  color: '#2b1400',
                  padding: '12px 22px',
                  borderRadius: 9999,
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon.Phone size={16} />
                <span>Hubungi Kantor</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
