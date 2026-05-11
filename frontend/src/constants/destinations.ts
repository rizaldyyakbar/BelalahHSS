// Mock Destinations Data
// Kriteria SAW (sesuai admin panel):
//   1. Popularitas  — benefit, bobot 0.15
//   2. Price        — cost,    bobot 0.20
//   3. Fasilitas    — benefit, bobot 0.40
//   4. Kebersihan dan Keamanan — benefit, bobot 0.25

export interface Destination {
  id: number;
  name: string;
  category: string;
  region?: string;
  location: string;
  distance: string;
  img: string;
  rating: number;
  reviews: number;
  description: string;
  fullDescription?: string;
  photos?: string[];
  facilities?: Facility[];
  hours?: string;
  entrance?: string;
  rank?: number;

  // ── Nilai kriteria SAW ────────────────────────────────────────────────────
  /** Skor popularitas destinasi (0–100), kriteria benefit bobot 0.15 */
  popularitas?: number;
  /** Estimasi biaya kunjungan dalam ribuan rupiah, kriteria cost bobot 0.20 */
  price?: number;
  /** Skor kelengkapan fasilitas (0–100), kriteria benefit bobot 0.40 */
  fasilitasScore?: number;
  /** Skor kebersihan & keamanan (0–100), kriteria benefit bobot 0.25 */
  kebersihanKeamanan?: number;
  // ─────────────────────────────────────────────────────────────────────────
}

export interface Facility {
  icon: string;
  name: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Balanting',
    category: 'Alam',
    region: 'Loksado',
    location: 'Loksado',
    distance: 'Kec. Loksado · 42 km dari Kandangan',
    img: 'balanting-paring',
    rating: 4.8,
    reviews: 324,
    description: 'Balanting Paring adalah destinasi wisata yang terletak di Kecamatan Loksado, Hulu Sungai Selatan, Kalimantan Selatan. Dikenal dengan keindahan alamnya yang masih alami, tempat ini menawarkan suasana pedesaan yang sejuk dan damai, dengan panorama perbukitan dan sungai yang menawan.',
    fullDescription: 'Balanting Paring menawarkan pengalaman wisata yang autentik dengan nuansa alam pedesaan Kalimantan Selatan. Pengunjung dapat menikmati keindahan sungai dengan air yang jernih, menjelajahi hutan dengan flora dan fauna yang beragam, serta merasakan keramahan masyarakat lokal. Berbagai aktivitas tersedia seperti arung jeram, susur sungai dengan perahu tradisional, dan kunjungan ke rumah adat Dayak.',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
    facilities: [
      { icon: 'bed', name: 'Penginapan' },
      { icon: 'fork', name: 'Restoran' },
      { icon: 'parking', name: 'Parkir' },
    ],
    hours: '08:00 - 17:00',
    entrance: '-',
    // Nilai kriteria SAW
    popularitas: 85,          // benefit  0.15
    price: 20,                // cost     0.20 (dalam ribuan Rp)
    fasilitasScore: 75,       // benefit  0.40
    kebersihanKeamanan: 88,   // benefit  0.25
  },
  {
    id: 2,
    name: 'Air Terjun Haratai',
    category: 'Alam',
    region: 'Loksado',
    location: 'Haratai',
    distance: 'Kec. Loksado · 38 km dari Kandangan',
    img: 'Air-Terjun-Haratai',
    rank: 2,
    rating: 4.6,
    reviews: 287,
    description: 'Air terjun tersembunyi dengan kolam yang jernih dan sangat cocok untuk berenang.',
    // Nilai kriteria SAW
    popularitas: 78,
    price: 15,
    fasilitasScore: 60,
    kebersihanKeamanan: 80,
  },
  {
    id: 3,
    name: 'Bukit Langara',
    category: 'Alam',
    location: 'Loksado',
    distance: 'Kota Kandangan · 45 km dari pusat kota',
    img: 'langara.jpg',
    rank: 3,
    rating: 4.5,
    reviews: 412,
    description: 'Bukit yang menawarkan pemandangan indah dan udara sejuk.',
    // Nilai kriteria SAW
    popularitas: 90,
    price: 10,
    fasilitasScore: 55,
    kebersihanKeamanan: 85,
  },
  {
    id: 4,
    name: 'Museum Rakyat',
    category: 'Budaya',
    location: 'Kandangan',
    distance: 'Kec. Kandangan · 1 km dari Kandangan',
    img: 'museum-rakyat',
    rank: 4,
    rating: 4.7,
    reviews: 198,
    description: 'Museum rakyat dengan koleksi berbagai benda bersejarah dan budaya lokal.',
    // Nilai kriteria SAW
    popularitas: 70,
    price: 5,
    fasilitasScore: 80,
    kebersihanKeamanan: 92,
  },
  {
    id: 5,
    name: 'Cafe Mangala',
    category: 'Kuliner',
    location: 'Loksado',
    distance: 'Kec. Loksado · 50 km dari Kandangan',
    img: 'mangala',
    rank: 5,
    rating: 4.9,
    reviews: 156,
    description: 'Cafe yang menyajikan makanan dan minuman beserta suasana pegunungan.',
    // Nilai kriteria SAW
    popularitas: 72,
    price: 35,
    fasilitasScore: 88,
    kebersihanKeamanan: 90,
  },
];

export default DESTINATIONS;
