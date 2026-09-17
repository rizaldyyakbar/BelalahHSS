import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';

interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  fullStory?: string[];
  featured?: boolean;
}

/**
 * JournalPage — Figma Belalah HSS Jurnal Wisata & Panduan Meratus (Node 44:2226 & 44:2599)
 * Rich editorial layout with featured lead story, category filters, and modal reader.
 */
export const JournalPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  const categories = ['Semua', 'Adat & Budaya', 'Panduan Lapangan', 'Kuliner HSS', 'Konservasi'];

  const articles: JournalArticle[] = [
    {
      id: 'etika-adat',
      title: 'Etika Adat & Kearifan Lokal Dayak Meratus: Panduan Lengkap Wisatawan',
      category: 'Adat & Budaya',
      readTime: '8 menit baca',
      date: '14 September 2026',
      image: '/assets/museum-rakyat.jpg',
      featured: true,
      excerpt:
        'Memahami tata krama saat melintasi balai adat, menghormati ritual Aruh Bahanan, serta menjaga kesucian alam rimba Pegunungan Meratus selama ekspedisi Anda.',
      fullStory: [
        'Pegunungan Meratus di Hulu Sungai Selatan bukan sekadar bentang alam karst yang elok, melainkan ruang sakral bagi masyarakat adat Dayak Bukit (Dayak Meratus). Selama ratusan tahun, keseimbangan alam dan kehidupan sosial diatur oleh hukum adat serta kearifan leluhur yang diwariskan turun-temurun.',
        'Ketika memasuki kawasan Balai Adat seperti di Malaris atau Haratai, wisatawan wajib mengenakan pakaian yang sopan dan tidak menginjak bagian ritual tertentu tanpa izin Tetua Adat (Kepala Adat / Damang). Saat ritual seperti Aruh Bahanan (pesta panen) berlangsung, keheningan dan penghormatan penuh sangat diharapkan.',
        'Suku Dayak Meratus memegang teguh filosofi bahwa sungai, hutan, dan bebatuan karst memiliki penunggu yang menjaga harmoni alam. Oleh karena itu, larangan merusak pohon, membuang sampah di aliran sungai Amandit, atau berbicara pongah di hutan rimba adalah aturan adat tertinggi yang harus ditaati setiap pengunjung.',
      ],
    },
    {
      id: 'navigasi-offline',
      title: 'Panduan Navigasi Lapangan & Rute Offline di Kawasan Blank Spot Loksado',
      category: 'Panduan Lapangan',
      readTime: '5 menit baca',
      date: '11 September 2026',
      image: '/assets/langara.jpg',
      excerpt:
        'Kiat aman menjelajah perbukitan Meratus saat sinyal seluler terbatas. Manfaatkan fitur unduh rute GPX Belalah HSS dan peta topografi offline.',
      fullStory: [
        'Kawasan pedalaman Loksado dan lereng Gunung Meratus masih memiliki area tanpa jangkauan sinyal seluler (blank spot). Mempersiapkan navigasi sebelum bertolak dari Kandangan adalah kunci keselamatan.',
        'Aplikasi Belalah HSS menyediakan fitur ekspor rute multi-stop ke Google Maps dan unduhan berkas koordinat GPX. Pastikan Anda mengunduh peta wilayah HSS di Google Maps sebelum melewati Padang Batung.',
      ],
    },
    {
      id: 'balanting-paring',
      title: 'Kisah di Balik Balanting Paring: Dari Jalur Dagang Bambu Menjadi Ikon Dunia',
      category: 'Adat & Budaya',
      readTime: '6 menit baca',
      date: '8 September 2026',
      image: '/assets/balanting-paring.jpg',
      excerpt:
        'Menelusuri sejarah rakit bambu Loksado yang dahulu menjadi urat nadi perdagangan bambu paring menuju pelabuhan sungai Kandangan.',
      fullStory: [
        'Sebelum jalan darat beraspal menembus pegunungan Meratus, aliran Sungai Amandit adalah jalan raya utama. Warga Loksado merakit puluhan batang bambu paring dan menghanyutkannya hingga ke hilir kota Kandangan untuk dijual.',
        'Kini, tradisi arung jeram rakit bambu tersebut menjadi atraksi petualangan internasional yang memikat wisatawan dari seluruh dunia.',
      ],
    },
    {
      id: 'kuliner-kandangan',
      title: 'Menikmati Keaslian Ketupat Kandangan: Ikan Haruan Asap & Kuah Santan Pekat',
      category: 'Kuliner HSS',
      readTime: '4 menit baca',
      date: '5 September 2026',
      image: '/assets/museum-rakyat-sungai-hulu-selatan.webp',
      excerpt:
        'Sensasi menyantap ketupat bertekstur legit dengan kuah santan kaya rempah dan ikan gabus (haruan) bakar asap khas Hulu Sungai Selatan.',
      fullStory: [
        'Berkunjung ke Hulu Sungai Selatan belum lengkap tanpa menikmati Ketupat Kandangan langsung di kota asalnya. Cita rasa khasnya terletak pada kuah santan kuning kental dengan aroma asap dari ikan haruan panggang.',
      ],
    },
    {
      id: 'riam-meratus',
      title: 'Jejak Air Terjun Tersembunyi: Menembus Lembah Haratai & Riam Hanai',
      category: 'Panduan Lapangan',
      readTime: '7 menit baca',
      date: '2 September 2026',
      image: '/assets/Air-Terjun-Haratai.jpg',
      excerpt:
        'Panduan jalur trekking menembus kebun kayu manis, jembatan gantung Meratus, hingga kolam alami berair jernih sedingin es.',
      fullStory: [
        'Air Terjun Haratai dan Riam Hanai menawarkan kesejukan mata air alami dari ketinggian rimba Meratus. Akses jalan kini semakin tertata dengan tersedianya jembatan gantung dan warung warga lokal di sepanjang rute.',
      ],
    },
    {
      id: 'zero-waste',
      title: 'Menjaga Geopark Pegunungan Meratus: Prinsip Zero-Waste di Alam Bebas',
      category: 'Konservasi',
      readTime: '5 menit baca',
      date: '28 Agustus 2026',
      image: '/assets/langara.jpg',
      excerpt:
        'Langkah sederhana yang berdampak besar: membawa tumbler, membawa pulang sampah kemasan, dan menjaga kemurnian mata air Loksado.',
      fullStory: [
        'Geopark Meratus adalah warisan geologi dunia berumur ratusan juta tahun. Mari bersama-sama menjadi penjelajah yang bertanggung jawab dengan tidak meninggalkan apa pun selain jejak kaki.',
      ],
    },
  ];

  const filtered = articles.filter(
    (art) => selectedCategory === 'Semua' || art.category === selectedCategory
  );

  const featured = articles.find((a) => a.featured) || articles[0];

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* 1. Hero Ambient Header */}
        <section className="catalog-hero-backdrop" style={{ paddingBottom: 36 }}>
          <div className="catalog-tag-badge">
            <Icon.Compass size={13} />
            <span>Jurnal Wisata &amp; Panduan Meratus</span>
          </div>

          <h1 className="catalog-title">
            Wawasan Lapangan, Budaya Adat, &amp; Panduan Eksplorasi HSS
          </h1>

          <p className="catalog-subtitle">
            Kumpulan artikel kurasi, etika berkunjung ke permukiman Dayak Meratus, tips navigasi offline, hingga
            rekomendasi kuliner autentik Bumi Antaludin.
          </p>

          {/* Category Filter Pills */}
          <div className="catalog-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`catalog-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 2. Featured Lead Article Card */}
        {selectedCategory === 'Semua' && featured && (
          <section style={{ maxWidth: 1280, margin: '40px auto 0', padding: '0 32px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--meratus-card-border)',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveArticle(featured)}
            >
              <div style={{ position: 'relative', minHeight: 320, background: '#eaf0ec' }}>
                <img
                  src={featured.image}
                  alt={featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/museum-rakyat.jpg';
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: '#FFE8D6',
                    color: '#994700',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  SOROTAN UTAMA • {featured.category.toUpperCase()}
                </span>
              </div>

              <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--meratus-subtle)', marginBottom: 10, fontWeight: 600 }}>
                  {featured.date} • {featured.readTime}
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 'clamp(22px, 2.5vw, 30px)',
                    fontWeight: 700,
                    color: 'var(--meratus-deep)',
                    lineHeight: 1.25,
                    margin: '0 0 14px',
                  }}
                >
                  {featured.title}
                </h2>

                <p
                  style={{
                    fontSize: 14.5,
                    color: 'var(--meratus-muted)',
                    lineHeight: 1.6,
                    margin: '0 0 24px',
                  }}
                >
                  {featured.excerpt}
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#C26B3C', fontWeight: 700, fontSize: 13.5 }}>
                  <span>Baca Panduan Lengkap</span>
                  <Icon.ArrowRight size={15} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Articles Grid */}
        <section style={{ maxWidth: 1280, margin: '48px auto 100px', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--meratus-deep)', margin: 0 }}>
              Semua Artikel &amp; Panduan ({filtered.length})
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
          >
            {filtered.map((art) => (
              <div
                key={art.id}
                className="catalog-card-figma"
                onClick={() => setActiveArticle(art)}
                style={{ cursor: 'pointer' }}
              >
                <div className="catalog-card-media">
                  <img
                    src={art.image}
                    alt={art.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/langara.jpg';
                    }}
                  />
                  <div className="catalog-badge-category">{art.category}</div>
                </div>

                <div className="catalog-card-body">
                  <div style={{ fontSize: 11.5, color: 'var(--meratus-subtle)', marginBottom: 8, fontWeight: 600 }}>
                    {art.date} • {art.readTime}
                  </div>

                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      margin: '0 0 10px',
                      lineHeight: 1.35,
                      minHeight: 44,
                    }}
                  >
                    {art.title}
                  </h4>

                  <p className="catalog-card-desc">{art.excerpt}</p>

                  <div className="category-figma-link" style={{ marginTop: 'auto' }}>
                    <span>Baca Selengkapnya</span>
                    <Icon.ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 4. Article Reader Modal */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1200,
            padding: 20,
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 720,
              width: '100%',
              padding: 36,
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
              maxHeight: '85vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    background: 'var(--meratus-mint)',
                    color: 'var(--meratus-mint-text)',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 9999,
                  }}
                >
                  {activeArticle.category}
                </span>
                <div style={{ fontSize: 12, color: 'var(--meratus-subtle)', marginTop: 6 }}>
                  {activeArticle.date} • {activeArticle.readTime}
                </div>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--meratus-subtle)' }}
              >
                ×
              </button>
            </div>

            <h2
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--meratus-deep)',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {activeArticle.title}
            </h2>

            <div style={{ height: 260, borderRadius: 14, overflow: 'hidden', background: '#eaf0ec' }}>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(activeArticle.fullStory || [activeArticle.excerpt]).map((para, i) => (
                <p key={i} style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.75, margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>

            <button
              onClick={() => setActiveArticle(null)}
              className="btn-planner-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            >
              Selesai Membaca
            </button>
          </div>
        </div>
      )}

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default JournalPage;
