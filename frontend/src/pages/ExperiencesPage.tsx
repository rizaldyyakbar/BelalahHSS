import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const ExperiencesPage: React.FC = () => {
  const experiences = [
    {
      title: 'Bamboo Rafting Loksado',
      category: 'Petualangan',
      image: 'balanting-paring.jpg',
      desc: 'Mengarungi Sungai Amandit di atas rakit bambu tradisional sepanjang 12 km dengan panorama hutan hujan Meratus yang memukau.',
    },
    {
      title: 'Trekking Bukit Langara',
      category: 'Pemandangan',
      image: 'langara.jpg',
      desc: 'Mendaki tebing batu kapur purba Bukit Langara dan menikmati panorama sungai berliku di bawah kabut pagi.',
    },
    {
      title: 'Wisata Kuliner Ketupat Kandangan',
      category: 'Kuliner',
      image: 'museum-rakyat.jpg',
      desc: 'Menikmati sajian khas Ketupat Kandangan berkuah santan gurih dengan lauk Ikan Haruan panggang asap yang autentik.',
    },
  ];

  return (
    <div className="bh-screen scroll web bh-topo-bg">
      <Header />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '110px 32px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage-dark)' }}>
            Pengalaman Khas HSS
          </span>
          <h1 className="bh-serif" style={{ fontSize: 44, fontWeight: 500, margin: '8px 0 16px', color: 'var(--ink)' }}>
            Aktivitas & Pengalaman Tak Terlupakan
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 600, margin: '0 auto' }}>
            Nikmati sensasi petualangan outdoor dan kearifan lokal di Hulu Sungai Selatan.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {experiences.map((exp, idx) => (
            <div key={idx} style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}>
              <div style={{ height: 200, background: 'var(--bg-soft)', position: 'relative' }}>
                <img
                  src={`/assets/${exp.image}`}
                  alt={exp.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div style={{ padding: 24 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sage-dark)', background: 'rgba(91,140,90,0.12)', padding: '4px 10px', borderRadius: 999 }}>
                  {exp.category}
                </span>
                <h3 className="bh-serif" style={{ fontSize: 22, margin: '12px 0 8px 0' }}>{exp.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer company="Belalah HSS" year={2026} />
    </div>
  );
};

export default ExperiencesPage;
