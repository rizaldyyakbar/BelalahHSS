import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const JournalPage: React.FC = () => {
  const articles = [
    {
      title: 'Panduan Lengkap Wisata Loksado: Dari Kandangan Hingga Haratai',
      date: '10 Agustus 2026',
      readTime: '5 menit baca',
      snippet: 'Tips transportasi, penginapan homestay lokal, hingga etika berkunjung ke pemukiman suku Dayak Meratus.',
    },
    {
      title: 'Menikmati Keindahan Sungai Amandit dengan Balanting Paring',
      date: '5 Agustus 2026',
      readTime: '4 menit baca',
      snippet: 'Pengalaman arung jeram tradisional yang menegangkan sekaligus menenangkan di jantung hutan pegunungan Meratus.',
    },
    {
      title: 'Kuliner Wajib Kandangan: Lebih dari Sekadar Ketupat',
      date: '1 Agustus 2026',
      readTime: '3 menit baca',
      snippet: 'Rekomendasi warung kuliner tradisional Kandangan terbaik yang patut Anda singgahi saat berkunjung ke HSS.',
    },
  ];

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '110px 32px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage-dark)' }}>
            Jurnal & Cerita Perjalanan
          </span>
          <h1 className="bh-serif" style={{ fontSize: 44, fontWeight: 500, margin: '8px 0 16px', color: 'var(--ink)' }}>
            Jurnal Petualangan HSS
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 600, margin: '0 auto' }}>
            Artikel, panduan wisata, dan rekomendasi pengalaman terbaik di Hulu Sungai Selatan.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {articles.map((art, idx) => (
            <article key={idx} style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              padding: 28,
              boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
                {art.date} · {art.readTime}
              </div>
              <h2 className="bh-serif" style={{ fontSize: 24, margin: '0 0 10px 0', color: 'var(--ink)' }}>
                {art.title}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
                {art.snippet}
              </p>
            </article>
          ))}
        </div>
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default JournalPage;
