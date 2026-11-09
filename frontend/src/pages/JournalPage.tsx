import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { fetchArticles, ApiArticle, FALLBACK_ARTICLES } from '../services/api';

export const JournalPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStory, setActiveStory] = useState<{ title: string; author?: string; readTime?: string; content: string[] } | null>(null);

  const categories = ['Semua', 'Adat & Budaya', 'Tips Jalur', 'Kuliner & Tradisi'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchArticles(selectedCategory !== 'Semua' ? selectedCategory : undefined)
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(FALLBACK_ARTICLES);
        }
      })
      .catch(() => {
        if (isMounted) setArticles(FALLBACK_ARTICLES);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const featuredArticle = articles.length > 0 ? articles[0] : FALLBACK_ARTICLES[0];
  const listArticles = articles.length > 1 ? articles.slice(1) : (selectedCategory === 'Semua' ? articles : articles);

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, paddingBottom: 90 }}>
        {/* Header Section */}
        <section className="bh-container" style={{ paddingTop: 96, paddingBottom: 16 }}>
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
              Kearifan Tanah Banjar &amp; Rimba Meratus
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
            Wawasan kearifan lokal, etika bertamu di tanah adat Dayak Meratus, panduan pengarungan riam, dan tips keselamatan penjelajahan alam.
          </p>

          {/* Featured Hero Article Card (Desktop Split / Mobile Stacked) */}
          {featuredArticle && (
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
                  src={featuredArticle.image_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Balai_Adat_Malaris.jpg/1280px-Balai_Adat_Malaris.jpg'}
                  alt={featuredArticle.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                  <span>Panduan Pilihan</span>
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
                  {featuredArticle.category}
                </div>
              </div>

              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 11.5, color: '#6E7972', fontWeight: 600, marginBottom: 6 }}>
                  🕒 {featuredArticle.read_time || '4 mnt'} baca • {featuredArticle.author || 'Lembaga Adat HSS'}
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 18.5,
                    fontWeight: 800,
                    color: 'var(--meratus-deep)',
                    margin: '0 0 8px',
                    lineHeight: 1.3,
                  }}
                >
                  {featuredArticle.title}
                </h3>

                <p style={{ fontSize: 13, color: '#57534E', margin: '0 0 16px', lineHeight: 1.5 }}>
                  {featuredArticle.snippet}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F0F4F1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--meratus-deep)' }}>
                    <span>🏛️</span>
                    <span>{featuredArticle.author || 'Tim Peneliti Belalah'}</span>
                  </div>

                  <button
                    onClick={() =>
                      setActiveStory({
                        title: featuredArticle.title,
                        author: featuredArticle.author,
                        readTime: featuredArticle.read_time,
                        content: Array.isArray(featuredArticle.content)
                          ? featuredArticle.content
                          : [featuredArticle.snippet],
                      })
                    }
                    style={{
                      background: '#012D1D',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '8px 16px',
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
          )}

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
                    background: active ? '#012D1D' : '#ffffff',
                    color: active ? '#ffffff' : '#57534E',
                    border: '1px solid',
                    borderColor: active ? '#012D1D' : '#E2EAE4',
                    borderRadius: 9999,
                    padding: '7px 16px',
                    fontSize: 12.5,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 2px 8px rgba(1, 45, 29, 0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Section: Artikel Terpilih */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📖</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 800, color: 'var(--meratus-deep)', margin: 0 }}>
                Arsip Panduan &amp; Cerita Lapangan
              </h2>
            </div>
            <span style={{ fontSize: 12, color: '#6E7972', fontWeight: 600 }}>
              {articles.length} Artikel
            </span>
          </div>
        </section>

        {/* Grid Artikel */}
        <section className="bh-container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 16,
                    background: '#e8efe9',
                    height: 240,
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {listArticles.map((art) => (
                <div
                  key={art.id || art.title}
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #EBEFEA',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
                    <img
                      src={art.image_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Air_Terjun_Haratai%2C_Loksado%2C_Hulu_Sungai_Selatan.jpg/1280px-Air_Terjun_Haratai%2C_Loksado%2C_Hulu_Sungai_Selatan.jpg'}
                      alt={art.title}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: '#012D1D',
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}
                    >
                      {art.category}
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#6E7972', marginBottom: 4 }}>
                      🕒 {art.read_time || '4 mnt'} baca • {art.author || 'Belalah HSS'}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: 15.5,
                        fontWeight: 700,
                        color: 'var(--meratus-deep)',
                        margin: '0 0 6px',
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {art.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 12,
                        color: '#57534E',
                        margin: '0 0 14px',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {art.snippet}
                    </p>

                    <button
                      onClick={() =>
                        setActiveStory({
                          title: art.title,
                          author: art.author,
                          readTime: art.read_time,
                          content: Array.isArray(art.content) ? art.content : [art.snippet],
                        })
                      }
                      style={{
                        background: '#F1F5F2',
                        color: '#012D1D',
                        border: 'none',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                      }}
                    >
                      <span>Baca Cerita</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal Dialog Baca Cerita Penuh */}
      {activeStory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setActiveStory(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 620,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px 24px',
              position: 'relative',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#994700', textTransform: 'uppercase' }}>
                  JURNAL MERATUS
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#012D1D',
                    margin: '4px 0 6px',
                    lineHeight: 1.3,
                  }}
                >
                  {activeStory.title}
                </h3>
                <div style={{ fontSize: 11.5, color: '#6E7972' }}>
                  🕒 {activeStory.readTime || '4 mnt'} baca • Ditulis oleh {activeStory.author || 'Belalah HSS'}
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                style={{
                  background: '#EDF2EE',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                  color: '#012D1D',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ borderTop: '1px solid #EBEFEA', paddingTop: 16, marginTop: 12 }}>
              {activeStory.content.map((paragraph, idx) => (
                <p key={idx} style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.65, margin: '0 0 14px' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: 20, borderTop: '1px solid #EBEFEA', paddingTop: 14 }}>
              <button
                onClick={() => setActiveStory(null)}
                style={{
                  background: '#012D1D',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '9px 20px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tutup Cerita
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JournalPage;
