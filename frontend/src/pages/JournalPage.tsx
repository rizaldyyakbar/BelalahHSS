import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';

interface ArticleItem {
  id: string;
  category: string;
  readTime: string;
  title: string;
  snippet: string;
  image: string;
  actionText: string;
  fullStory?: string[];
}

export const JournalPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeStory, setActiveStory] = useState<{ title: string; content: string[] } | null>(null);

  const categories = ['Semua', 'Adat & Budaya', 'Tips Jalur', 'Kuliner & Tradisi'];

  const articles: ArticleItem[] = [
    {
      id: 'rafting-guide',
      category: 'Tips Jalur',
      readTime: '3 mnt',
      title: 'Panduan Musim Terbaik Menjajal Bamboo Rafting Sungai',
      snippet: 'Tips debit air ramah pemula dan persiapan pakaian ganti selama pengarungan Amandit.',
      image: '/assets/balanting-paring.jpg',
      actionText: 'Pelajari Rute Air ›',
      fullStory: [
        'Waktu terbaik mengarungi Sungai Amandit adalah saat musim peralihan atau kemarau basah, di mana debit air stabil dan jeram tidak terlalu ganas.',
        'Selalu gunakan jaket pelampung dan percayakan kemudi sepenuhnya kepada joki lanting berlisensi lokal Loksado.',
      ],
    },
    {
      id: 'ketupat-tangan',
      category: 'Kuliner & Tradisi',
      readTime: '5 mnt',
      title: 'Mengapa Ketupat Kandangan Dimakan Menggunakan Tangan',
      snippet: 'Tradisi kuliner otentik ikan haruan asap berkuah santan kental yang disantap tanpa sendok.',
      image: '/assets/museum-rakyat-sungai-hulu-selatan.webp',
      actionText: 'Kisah Rasa ›',
      fullStory: [
        'Masyarakat Banjar Hulu memiliki tradisi menyantap Ketupat Kandangan langsung dengan tangan. Tekstur ketupat yang mudah hancur berpadu sempurna dengan kuah santan berempah saat diremas lembut dengan jari tangan.',
        'Ikan haruan yang diasap menggunakan arang sabut kelapa memberikan aroma smoky yang khas dan otentik.',
      ],
    },
    {
      id: 'bawa-pulang-sampah',
      category: 'Tips Jalur',
      readTime: '6 mnt',
      title: "Prinsip 'Bawa Pulang Sampah' di Hutan Lindung Gunung Halau-Halau",
      snippet: 'Menjaga kebersihan hulu mata air dan kelestarian vegetasi rimba karst Meratus.',
      image: '/assets/Air-Terjun-Haratai.jpg',
      actionText: 'Etika Rimba ›',
      fullStory: [
        'Kawasan Pegunungan Meratus dan hutan lindung Haratai tidak memiliki fasilitas pembuangan sampah terpusat. Setiap pendaki dan wisatawan wajib membawa kembali seluruh kemasan plastik dan puntung rokok hingga tiba di kota Kandangan.',
        'Mata air Meratus adalah sumber penghidupan jutaan warga Kalimantan Selatan di hilir sungai.',
      ],
    },
    {
      id: 'pasak-bumi',
      category: 'Adat & Budaya',
      readTime: '4 mnt',
      title: 'Mengenal Tanaman Obat Pasak Bumi & Madu Hutan Asli Meratus',
      snippet: 'Hasil hutan bukan kayu yang dikelola secara arif dan lestari oleh masyarakat Dayak.',
      image: '/assets/museum-rakyat.jpg',
      actionText: 'Etnobotani ›',
      fullStory: [
        'Masyarakat adat Dayak Meratus memiliki pengetahuan etnobotani yang kaya, merawat tanaman obat herbal seperti pasak bumi, akar kuning, dan madu hutan lebah liar yang dipanen secara lestari tanpa membakar sarang.',
      ],
    },
  ];

  const filtered = articles.filter((a) => {
    if (selectedCategory === 'Semua') return true;
    return a.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, paddingBottom: 90 }}>
        {/* Header Section (Figma Screen 7) */}
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
            <span style={{ fontSize: 13 }}>🌾</span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#994700',
                textTransform: 'uppercase',
              }}
            >
              Kearifan Tanah Banjar
            </span>
          </div>

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
            Jurnal Wisata &amp; Panduan Meratus
          </h1>

          <p
            style={{
              fontSize: 14,
              color: '#57534E',
              margin: '0 0 24px',
              lineHeight: 1.55,
              maxWidth: 580,
            }}
          >
            Wawasan kearifan lokal, etika bertamu di tanah adat Dayak Meratus, dan tips keselamatan penjelajahan alam.
          </p>

          {/* Featured Hero Article Card (Responsive Split Layout) */}
          <div
            className="journal-featured-split"
            style={{
              background: '#ffffff',
              borderRadius: 18,
              border: '1px solid #EBEFEA',
              overflow: 'hidden',
              boxShadow: '0 3px 14px rgba(0, 0, 0, 0.05)',
              marginBottom: 28,
            }}
          >
            <div style={{ position: 'relative', width: '100%', minHeight: 240, overflow: 'hidden' }}>
              <img
                src="/assets/museum-rakyat.jpg"
                alt="Tata Krama & Etika Bertamu di Balai Adat Dayak Meratus"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 14,
                  background: '#F7EFE4',
                  color: '#8C4A1E',
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>⏰</span>
                <span>Panduan Wajib</span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 14,
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  background: 'rgba(0, 0, 0, 0.65)',
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                Wawasan Adat &amp; Budaya
              </div>
            </div>

            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 11.5, color: '#6E7972', fontWeight: 600, marginBottom: 6 }}>
                🕒 4 mnt baca • Lembaga Adat HSS
              </div>

              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--meratus-deep)',
                  margin: '0 0 6px',
                  lineHeight: 1.25,
                }}
              >
                Tata Krama &amp; Etika Bertamu di Balai Adat Dayak Meratus
              </h3>

              <p style={{ fontSize: 12.5, color: '#57534E', margin: '0 0 14px', lineHeight: 1.5 }}>
                Memahami makna ruang sakral Balai Adat, tata cara menyapa tetua adat dengan santun, serta etika memotret ritual upacara Aruh Bawanang.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F0F4F1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--meratus-deep)' }}>
                  <span>🏛️</span>
                  <span>Lembaga Adat HSS</span>
                </div>

                <button
                  onClick={() =>
                    setActiveStory({
                      title: 'Tata Krama & Etika Bertamu di Balai Adat Dayak Meratus',
                      content: [
                        'Pegunungan Meratus di Hulu Sungai Selatan bukan sekadar bentang alam karst yang elok, melainkan ruang sakral bagi masyarakat adat Dayak Bukit (Dayak Meratus). Selama ratusan tahun, keseimbangan alam dan kehidupan sosial diatur oleh hukum adat serta kearifan leluhur yang diwariskan turun-temurun.',
                        'Ketika memasuki kawasan Balai Adat seperti di Malaris atau Haratai, wisatawan wajib mengenakan pakaian yang sopan dan tidak menginjak bagian ritual tertentu tanpa izin Tetua Adat (Damang). Saat ritual seperti Aruh Bawanang berlangsung, keheningan dan penghormatan penuh sangat diharapkan.',
                        'Suku Dayak Meratus memegang teguh filosofi bahwa sungai, hutan, dan bebatuan karst memiliki penunggu yang menjaga harmoni alam. Larangan merusak pohon, membuang sampah di aliran sungai Amandit, atau berbicara pongah di hutan adalah aturan adat tertinggi.',
                      ],
                    })
                  }
                  style={{
                    background: '#012D1D',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>Baca Selengkapnya</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 16,
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
                    padding: '6px 14px',
                    fontSize: 12,
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

          {/* Section: Artikel Terpilih */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📖</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: 'var(--meratus-deep)', margin: 0 }}>
                Artikel Terpilih
              </h2>
            </div>
            <span style={{ fontSize: 11.5, color: '#6E7972', fontWeight: 600 }}>
              {filtered.length} Tulisan
            </span>
          </div>

          {/* Article Cards Grid (2-Columns on Desktop) */}
          <div className="journal-articles-grid" style={{ marginBottom: 32 }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setActiveStory({
                    title: item.title,
                    content: item.fullStory || [item.snippet],
                  })
                }
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #EBEFEA',
                  padding: '12px',
                  display: 'flex',
                  gap: 12,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 10,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#994700', marginBottom: 2 }}>
                      {item.category} • {item.readTime}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--meratus-deep)',
                        margin: '0 0 2px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 11,
                        color: '#57534E',
                        margin: 0,
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.snippet}
                    </p>
                  </div>

                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#012D1D', marginTop: 4 }}>
                    {item.actionText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Callout Card: Nilai Komunitas & Adat (Figma Screen 7) */}
          <div
            style={{
              background: '#012D1D',
              borderRadius: 18,
              padding: '18px 16px',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(1, 45, 29, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>🍃</span>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#C1ECD4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Nilai Komunitas &amp; Adat
              </span>
            </div>

            <h4 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, margin: '0 0 6px' }}>
              Pariwisata Berkelanjutan Meratus
            </h4>

            <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, margin: '0 0 12px' }}>
              Menjaga napas hijau alam dan memuliakan hak masyarakat adat demi masa depan bumi Antaludin.
            </p>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(193, 236, 212, 0.15)',
                border: '1px solid rgba(193, 236, 212, 0.3)',
                color: '#C1ECD4',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <span>💎</span>
              <span>Bersama Warga Balai Adat Malaris &amp; Haratai</span>
            </span>
          </div>
        </section>
      </main>

      {/* Story Reader Modal */}
      {activeStory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1200,
            padding: 16,
          }}
          onClick={() => setActiveStory(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              maxWidth: 480,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 20,
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#994700', textTransform: 'uppercase' }}>
                Jurnal Belalah HSS
              </span>
              <button
                onClick={() => setActiveStory(null)}
                style={{ background: 'none', border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#012D1D', margin: '0 0 14px' }}>
              {activeStory.title}
            </h2>

            {activeStory.content.map((p, idx) => (
              <p key={idx} style={{ fontSize: 13, lineHeight: 1.6, color: '#414844', marginBottom: 12 }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JournalPage;
