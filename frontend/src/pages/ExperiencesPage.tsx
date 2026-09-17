import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';

interface SpotItem {
  id: string;
  name: string;
  category: 'Homestay' | 'Rest Area' | 'Kuliner';
  location: string;
  priceOrTarif: string;
  image: string;
  desc: string;
  facilities: string[];
}

/**
 * ExperiencesPage — Figma Belalah HSS Titik Singgah, Homestay & Kuliner Lapangan (Node 44:3528)
 * Curated local homestays, river rest areas, and authentic Kandangan culinary spots.
 */
export const ExperiencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Homestay & Pondok', 'Rest Area Rute', 'Kuliner Tradisional'];

  const spots: SpotItem[] = [
    {
      id: 'homestay-loksado',
      name: 'Meratus Riverside Homestay Loksado',
      category: 'Homestay',
      location: 'Desa Loksado, Kec. Loksado (Tepi Sungai Amandit)',
      priceOrTarif: 'Rp 180.000 – 250.000 / malam',
      image: '/assets/balanting-paring.jpg',
      desc: 'Penginapan kayu ramah pelancong persis di bibir Sungai Amandit dengan pemandangan langsung tebing karst dan gemericik air riam.',
      facilities: ['Kipas Angin / AC', 'Sarapan Khas Banjar', 'Pemandu Lokal', 'Teras Tepi Sungai'],
    },
    {
      id: 'cottage-tanuhi',
      name: 'Cottage Pemandian Air Panas Tanuhi',
      category: 'Homestay',
      location: 'Desa Hulu Banyu, Kec. Loksado',
      priceOrTarif: 'Rp 200.000 – 350.000 / malam',
      image: '/assets/langara.jpg',
      desc: 'Cottage nyaman berkonsep nature park dengan akses langsung ke kolam renang air panas belerang alami dan taman bermain keluarga.',
      facilities: ['Kamar Mandi Privat', 'Akses Kolam Panas', 'Rest Area Gazebo', 'Parkir Luas'],
    },
    {
      id: 'pondok-malaris',
      name: 'Pondok Wisata Adat Malaris',
      category: 'Homestay',
      location: 'Desa Loklahung, Kec. Loksado',
      priceOrTarif: 'Rp 150.000 / malam',
      image: '/assets/museum-rakyat.jpg',
      desc: 'Penginapan tradisional berarsitektur Dayak Bukit dekat Balai Adat Malaris untuk wisatawan yang ingin mendalami budaya dan ritual adat.',
      facilities: ['Suasana Asri Hutan', 'Pemandu Budaya', 'Kopi Pagi Meratus', 'Area Teduh'],
    },
    {
      id: 'dermaga-hulu',
      name: 'Dermaga Tambat Hulu Loksado',
      category: 'Rest Area',
      location: 'Pusat Kecamatan Loksado',
      priceOrTarif: 'Fasilitas Terbuka',
      image: '/assets/balanting-paring.jpg',
      desc: 'Titik kumpul utama persiapan arung jeram rakit bambu, dilengkapi dermaga tambat, toilet bilas, dan warung perlengkapan outdoor.',
      facilities: ['Dermaga Rakit', 'Kamar Bilas', 'Penyewaan Pelampung', 'Warung Logistik'],
    },
    {
      id: 'rest-muara-hatip',
      name: 'Rest Area & Dermaga Jemput Muara Hatip',
      category: 'Rest Area',
      location: 'Muara Hatip / Tanuhi, Kec. Loksado',
      priceOrTarif: 'Fasilitas Terbuka',
      image: '/assets/Air-Terjun-Haratai.jpg',
      desc: 'Titik akhir finish pengarungan bamboo rafting dengan deretan warung kelapa muda segar, pondok istirahat, dan area penjemputan kendaraan.',
      facilities: ['Kantin Kelapa Muda', 'Gazebo Bambu', 'Kamar Mandi Bilas', 'Akses Mobil Penjemput'],
    },
    {
      id: 'kuliner-ketupat',
      name: 'Warung Ketupat Kandangan Asli',
      category: 'Kuliner',
      location: 'Jl. Jenderal Sudirman, Kandangan Kota',
      priceOrTarif: 'Rp 20.000 – 30.000 / porsi',
      image: '/assets/museum-rakyat-sungai-hulu-selatan.webp',
      desc: 'Sajian legendaris ketupat pulen berkuah santan kental gurih disajikan bersama ikan haruan (gabus) panggang asap dan sambal acan khas HSS.',
      facilities: ['Ikan Haruan Asap', 'Kuah Santan Pekat', 'Parkir Kendaraan', 'Es Kelapa Muda'],
    },
    {
      id: 'dodol-kandangan',
      name: 'Sentra Dodol Asli Kandangan',
      category: 'Kuliner',
      location: 'Kandangan Barat, HSS',
      priceOrTarif: 'Rp 15.000 – 50.000 / kotak',
      image: '/assets/museum-rakyat.jpg',
      desc: 'Pusat oleh-oleh penganan manis khas Hulu Sungai Selatan yang diolah dari ketan pilihan dan gula aren murni dengan resep turun-temurun.',
      facilities: ['Oleh-oleh Khas HSS', 'Berbagai Varian Rasa', 'Kemasan Higienis', 'Kemasan Hadiah'],
    },
  ];

  const filtered = spots.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    if (selectedCategory === 'Homestay & Pondok') return item.category === 'Homestay';
    if (selectedCategory === 'Rest Area Rute') return item.category === 'Rest Area';
    if (selectedCategory === 'Kuliner Tradisional') return item.category === 'Kuliner';
    return true;
  });

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* 1. Hero Ambient Header */}
        <section className="catalog-hero-backdrop" style={{ paddingBottom: 36 }}>
          <div className="catalog-tag-badge">
            <Icon.Compass size={13} />
            <span>Titik Singgah, Homestay &amp; Kuliner Lapangan</span>
          </div>

          <h1 className="catalog-title">
            Tempat Menginap, Rest Area Alami, &amp; Cita Rasa Autentik HSS
          </h1>

          <p className="catalog-subtitle">
            Temukan homestay ramah pelancong di tepi sungai Loksado, pondok santai bernuansa pedesaan Dayak,
            hingga warung ketupat legendaris di Kandangan untuk melengkapi perjalanan rute Anda.
          </p>

          {/* Filter Tabs */}
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

        {/* 2. Spots Grid */}
        <section style={{ maxWidth: 1280, margin: '48px auto 100px', padding: '0 32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
          >
            {filtered.map((item) => (
              <div key={item.id} className="catalog-card-figma">
                <div className="catalog-card-media">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                    }}
                  />
                  <span className="catalog-badge-category">{item.category}</span>
                </div>

                <div className="catalog-card-body">
                  <h3 className="catalog-card-title" style={{ fontSize: 16 }}>
                    {item.name}
                  </h3>

                  <div style={{ fontSize: 12, color: 'var(--meratus-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon.Pin size={13} style={{ color: 'var(--meratus-clay)' }} />
                    <span>{item.location}</span>
                  </div>

                  <p className="catalog-card-desc">{item.desc}</p>

                  <div className="catalog-ticket-line" style={{ marginTop: 'auto', marginBottom: 12 }}>
                    <span>TARIF / HARGA:</span>
                    <span className="catalog-ticket-price">{item.priceOrTarif}</span>
                  </div>

                  {/* Facilities list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {item.facilities.map((fac, fIdx) => (
                      <span
                        key={fIdx}
                        style={{
                          background: '#F4F8F5',
                          border: '1px solid var(--meratus-card-border)',
                          borderRadius: 9999,
                          padding: '2px 8px',
                          fontSize: 11,
                          color: 'var(--meratus-deep)',
                          fontWeight: 600,
                        }}
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn-planner-ghost"
                    onClick={() => navigate('/planner')}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Icon.Compass size={14} />
                    <span>Sisipkan ke Perencana Rute</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExperiencesPage;
