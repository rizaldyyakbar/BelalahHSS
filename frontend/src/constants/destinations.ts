// Mock Destinations Data

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
}

export interface Facility {
  icon: string;
  name: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Loksado',
    category: 'Alam',
    region: 'Pegunungan Meratus',
    location: 'Loksado',
    distance: 'Kec. Loksado · 42 km dari Kandangan',
    img: 'forest',
    rating: 4.8,
    reviews: 324,
    description: 'Desa wisata di kaki Pegunungan Meratus dengan rumah adat Dayak, jembatan gantung, dan akses bambu rafting di Sungai Amandit. Sejuk sepanjang tahun.',
    fullDescription: 'Loksado adalah desa wisata yang terletak di kaki Pegunungan Meratus, Kalimantan Selatan. Dengan nuansa alam yang masih asri dan rumah adat Dayak yang khas, destinasi ini menawarkan pengalaman wisata yang autentik. Pengunjung dapat menikmati jembatan gantung tradisional, rafting di Sungai Amandit, dan berbagai aktivitas outdoor lainnya.',
    photos: [
      'photo1.jpg',
      'photo2.jpg',
      'photo3.jpg',
      'photo4.jpg',
    ],
    facilities: [
      { icon: 'bed', name: 'Penginapan' },
      { icon: 'fork', name: 'Restoran' },
      { icon: 'parking', name: 'Parkir' },
    ],
    hours: '08:00 - 17:00',
    entrance: 'Rp 10.000',
  },
  {
    id: 2,
    name: 'Haratai',
    category: 'Alam',
    region: undefined,
    location: 'Haratai',
    distance: 'Kec. Loksado · 38 km dari Kandangan',
    img: 'Air-Terjun-Haratai',
    rank: 2,
    rating: 4.6,
    reviews: 287,
    description: 'Air terjun tersembunyi dengan kolam yang jernih dan sangat cocok untuk berenang.',
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
  },
  {
    id: 4,
    name: 'Musem Rakyat',
    category: 'Budaya',
    location: 'Kandangan',
    distance: 'Kec. Kandangan · 1 km dari Kandangan',
    img: 'museum',
    rank: 4,
    rating: 4.7,
    reviews: 198,
    description: 'Museum rakyat dengan koleksi berbagai benda bersejarah dan budaya lokal.',
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
  },
];

export default DESTINATIONS;
