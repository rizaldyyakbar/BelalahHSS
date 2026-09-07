import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '110px 32px 60px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sage-dark)',
          }}>
            Tentang Sistem & Pariwisata
          </span>
          <h1 className="bh-serif" style={{ fontSize: 44, fontWeight: 500, margin: '8px 0 16px', color: 'var(--ink)' }}>
            Belalah HSS — Jelajahi Bumi Antaludin
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 650, margin: '0 auto' }}>
            Platform rekomendasi destinasi wisata berbasis kecerdasan keputusan di Kabupaten Hulu Sungai Selatan, Kalimantan Selatan.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 50 }}>
          <div style={{
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}>
            <h2 className="bh-serif" style={{ fontSize: 24, marginBottom: 12, color: 'var(--ink)' }}>
              🏛️ Kekayaan Pariwisata HSS
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
              Kabupaten Hulu Sungai Selatan menyimpan pesona alam yang luar biasa mulai dari kawasan pegunungan Meratus di Loksado, pesona arung jeram bambu tradisional (*Bamboo Rafting*), air terjun alami, hingga kekayaan budaya masyarakat Dayak Meratus dan kuliner khas Ketupat Kandangan.
            </p>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}>
            <h2 className="bh-serif" style={{ fontSize: 24, marginBottom: 12, color: 'var(--ink)' }}>
              📊 Metode Rekomendasi SAW
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
              Sistem menggunakan metode **Simple Additive Weighting (SAW)** yang mengkombinasikan 4 kriteria utama: **Popularitas (15%)**, **Estimasi Biaya/Harga (20%)**, **Fasilitas (40%)**, dan **Kebersihan & Keamanan (25%)**, serta dipadukan dengan formula kalkulasi jarak **Haversine**.
            </p>
          </div>
        </div>

        {/* Kriteria Matrix */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
        }}>
          <h2 className="bh-serif" style={{ fontSize: 24, marginBottom: 16, textAlign: 'center' }}>
            Bobot Kriteria Penilaian
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--sage)' }}>15%</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Popularitas</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Benefit</div>
            </div>
            <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--sage)' }}>20%</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Estimasi Biaya</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Cost</div>
            </div>
            <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--sage)' }}>40%</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Kelengkapan Fasilitas</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Benefit</div>
            </div>
            <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--sage)' }}>25%</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Kebersihan & Keamanan</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Benefit</div>
            </div>
          </div>
        </div>
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default AboutPage;
