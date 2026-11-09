import { DESTINATIONS, Destination, getDestinationSourceStatus } from '../constants/destinations';
import { optimizeRouteClientSide, parseCoords, calculateHaversineDistance } from '../utils/geo';
import { API_BASE_URL } from '../utils/imageUrl';

export interface RecommendationParams {
  lat?: number;
  lng?: number;
  limit?: number;
  radius_meters?: number;
  sort?: 'rank' | 'distance' | 'popularitas' | 'price' | 'fasilitasScore';
  category_id?: number;
  search?: string;
}

export interface ApiDestination {
  id: number;
  name: string;
  category_id?: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  description?: string;
  latitude: number | string;
  longitude: number | string;
  address?: string;
  image?: string;
  image_url?: string;
  image_thumb_url?: string;
  distance_km?: number;
  saw_score?: number;
  score?: number;
  rank?: number;
  values?: Record<string, number>;
}

export interface RecommendationApiResponse {
  success: boolean;
  data: ApiDestination[];
  meta?: {
    total: number;
    user_location?: {
      lat: number;
      lng: number;
    };
  };
}

export interface OptimizedRouteItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance_from_previous_km: number;
}

/**
 * Helper to build Google Maps Direction URL for route navigation
 */
export function getGoogleMapsRouteUrl(destination: Partial<Destination>): string {
  if (destination.latitude && destination.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
  }
  const searchQuery = destination.name
    ? `${destination.name}, ${destination.location || 'Hulu Sungai Selatan'}`
    : destination.location || 'Hulu Sungai Selatan';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchQuery)}`;
}

/**
 * Fetch dynamic recommendations from Laravel Backend API with fallback to mock constants
 */
export async function fetchRecommendations(params: RecommendationParams = {}): Promise<{
  destinations: Destination[];
  isFromApi: boolean;
}> {
  try {
    const query = new URLSearchParams();
    // Default coordinates: Kandangan center (-2.7758, 115.2635)
    const lat = params.lat !== undefined ? params.lat : -2.7758;
    const lng = params.lng !== undefined ? params.lng : 115.2635;
    query.append('lat', lat.toString());
    query.append('lng', lng.toString());

    if (params.limit !== undefined) query.append('limit', params.limit.toString());
    query.append('radius_meters', (params.radius_meters || 50000).toString());
    if (params.sort !== undefined) query.append('sort', params.sort);
    if (params.category_id !== undefined) query.append('category_id', params.category_id.toString());
    if (params.search !== undefined && params.search.trim() !== '') query.append('search', params.search.trim());

    const response = await fetch(`${API_BASE_URL}/recommendations?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const responseItems: ApiDestination[] = Array.isArray(responseData) ? responseData : (responseData.data || []);

    if (Array.isArray(responseItems) && responseItems.length > 0) {
      const formatted: Destination[] = responseItems.map((item, index) => {
        const itemLat = typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
        const itemLng = typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;

        // Match local enriched metadata (facilities, photo assets, reviews)
        const localMatch = DESTINATIONS.find(
          (d) => d.id === item.id || d.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        const distanceStr = item.distance_km !== undefined
          ? `${item.distance_km.toFixed(1)} km dari Kandangan`
          : localMatch?.distance || 'Hulu Sungai Selatan';

        const regionStr = localMatch?.region ||
          (item.address ? (item.address.replace(/^Kecamatan\s+/i, '').split(',')[0] || 'HSS').trim() : 'HSS');

        const sawScoreNumber = item.score !== undefined
          ? Math.round(item.score * 100)
          : (item.saw_score !== undefined ? Math.round(item.saw_score * 100) : localMatch?.popularitas || (96 - index * 2));

        const rawTicketPrice = item.values?.['3'] ?? item.values?.['Harga Tiket'];
        const ticketPrice = rawTicketPrice !== undefined
          ? `Rp ${Number(rawTicketPrice).toLocaleString('id-ID')}`
          : localMatch?.entrance || 'Rp 10.000';

        const resolvedImg = (localMatch?.img && localMatch.img.startsWith('/assets/'))
          ? localMatch.img
          : (item.image || item.image_url || localMatch?.img || '/assets/balanting-paring.jpg');

        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || localMatch?.category || 'Wisata Alam',
          region: regionStr,
          location: item.address || localMatch?.location || `Kecamatan ${regionStr}, Hulu Sungai Selatan`,
          distance: distanceStr,
          img: resolvedImg,
          rating: localMatch?.rating || 4.8,
          reviews: localMatch?.reviews || (120 + item.id * 15),
          description: item.description || localMatch?.description || 'Destinasi wisata unggulan di Kabupaten Hulu Sungai Selatan.',
          fullDescription: localMatch?.fullDescription || item.description,
          photos: localMatch?.photos || ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
          facilities: localMatch?.facilities || [
            { icon: 'map-pin', name: 'Area Parkir' },
            { icon: 'camera', name: 'Spot Foto Alami' },
            { icon: 'shield', name: 'Pos Informasi & Tiket' },
          ],
          rank: item.rank || index + 1,
          latitude: itemLat,
          longitude: itemLng,
          entrance: ticketPrice,
          popularitas: sawScoreNumber,
          sourceStatus: getDestinationSourceStatus(item.id),
          price: rawTicketPrice !== undefined
            ? Number(rawTicketPrice)
            : (localMatch?.price ? (localMatch.price < 1000 ? localMatch.price * 1000 : localMatch.price) : 10000),
        };
      });

      console.info(`[Belalah API] Successfully live-fetched ${formatted.length} destinations with PostGIS & SAW scores from ${API_BASE_URL}`);
      return { destinations: formatted, isFromApi: true };
    }
  } catch (error) {
    console.warn(`[Belalah API] Backend API unavailable at ${API_BASE_URL}, using fallback constants:`, error);
  }

  return { destinations: DESTINATIONS, isFromApi: false };
}

export interface OptimizedRouteResult {
  route: OptimizedRouteItem[];
  total_distance_km: number;
  initial_distance_km?: number;
  distance_saved_km?: number;
  percentage_saved?: number;
  permutations_checked?: number;
  method?: string;
  isFallback?: boolean;
}

export async function optimizeRoute(
  lat: number,
  lng: number,
  destinationIds: number[],
  destinationsFallback?: Destination[],
): Promise<OptimizedRouteResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/optimized`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lng,
        destination_ids: destinationIds,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.route) && data.route.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.warn('[Belalah API] Backend route optimization unavailable, using client-side Brute Force Dijkstra fallback:', error);
  }

  // Instant client-side Brute Force Dijkstra fallback
  const pool = destinationsFallback && destinationsFallback.length > 0 ? destinationsFallback : DESTINATIONS;
  const poolMap = new Map(pool.map((d) => [d.id, d]));
  const targetDests = destinationIds
    .map((id) => poolMap.get(id))
    .filter((d): d is Destination => Boolean(d));

  const clientResult = optimizeRouteClientSide({ lat, lng }, targetDests);

  return {
    route: clientResult.route.map((item) => {
      const coords = parseCoords(item) || { lat: -2.77, lng: 115.31 };
      return {
        id: item.id,
        name: item.name,
        latitude: coords.lat,
        longitude: coords.lng,
        distance_from_previous_km: item.distance_from_previous_km,
      };
    }),
    total_distance_km: clientResult.total_distance_km,
    initial_distance_km: clientResult.initial_distance_km,
    distance_saved_km: clientResult.distance_saved_km,
    percentage_saved: clientResult.percentage_saved,
    permutations_checked: clientResult.permutations_checked,
    method: clientResult.method,
    isFallback: true,
  };
}

/**
 * Fetch single destination detail dynamically from backend API with fallback
 */
export async function fetchDestinationById(
  id: number,
  lat?: number,
  lng?: number,
): Promise<Destination | null> {
  try {
    const query = new URLSearchParams();
    if (lat !== undefined) query.append('lat', lat.toString());
    if (lng !== undefined) query.append('lng', lng.toString());

    const url = `${API_BASE_URL}/destinations/${id}${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const res = await response.json();
      const item = res.data;
      if (item) {
        const localMatch = DESTINATIONS.find(
          (d) => d.id === item.id || d.name.toLowerCase().trim() === item.name.toLowerCase().trim(),
        );

        const distanceStr =
          item.distance_km !== null && item.distance_km !== undefined
            ? `${item.distance_km} km dari Lokasi Anda`
            : localMatch?.distance || 'Hulu Sungai Selatan';

        const regionStr =
          localMatch?.region ||
          (item.address ? (item.address.replace(/^Kecamatan\s+/i, '').split(',')[0] || 'HSS').trim() : 'HSS');

        const ticketPrice =
          item.values && item.values['Harga Tiket']
            ? `Rp ${Number(item.values['Harga Tiket']).toLocaleString('id-ID')}`
            : localMatch?.entrance || 'Rp 10.000';

        const itemLat = typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
        const itemLng = typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;

        const resolvedImg = (localMatch?.img && localMatch.img.startsWith('/assets/'))
          ? localMatch.img
          : (item.image || localMatch?.img || '/assets/balanting-paring.jpg');

        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || localMatch?.category || 'Wisata Alam',
          region: regionStr,
          location: item.address || localMatch?.location || `Kecamatan ${regionStr}, Hulu Sungai Selatan`,
          distance: distanceStr,
          img: resolvedImg,
          rating: localMatch?.rating || 4.8,
          reviews: localMatch?.reviews || 240,
          description: item.description || localMatch?.description || 'Destinasi wisata unggulan di Kabupaten Hulu Sungai Selatan.',
          fullDescription: item.description || localMatch?.fullDescription,
          photos: localMatch?.photos || ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
          facilities: localMatch?.facilities || [
            { icon: 'parking', name: 'Area Parkir' },
            { icon: 'camera', name: 'Spot Foto Alami' },
            { icon: 'bed', name: 'Gazebo & Rest Area' },
          ],
          latitude: itemLat,
          longitude: itemLng,
          entrance: ticketPrice,
          sourceStatus: getDestinationSourceStatus(item.id),
          popularitas:
            item.values && item.values['Popularitas']
              ? Number(item.values['Popularitas'])
              : localMatch?.popularitas || 90,
          price:
            item.values && item.values['Harga Tiket']
              ? Number(item.values['Harga Tiket'])
              : (localMatch?.price ? (localMatch.price < 1000 ? localMatch.price * 1000 : localMatch.price) : 10000),
        };
      }
    }
  } catch (error) {
    console.warn(`[Belalah API] Failed fetching destination ${id}, using local fallback:`, error);
  }

  return DESTINATIONS.find((d) => d.id === id) || null;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  image_url?: string;
  destinations_count?: number;
}

/**
 * Fetch list of tourism categories with destination count and metadata from backend
 */
export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const res = await response.json();
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    }
  } catch (error) {
    console.warn('[Belalah API] Failed fetching categories, using fallback:', error);
  }

  return [
    {
      id: 1,
      name: 'Wisata Alam',
      slug: 'wisata-alam',
      icon: '🌿',
      description: 'Pegunungan Meratus, rimba lindung, dan panorama hijau asri khas Hulu Sungai Selatan.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Panorama_Bukit_Batu_Lengara_Loksado_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg',
      destinations_count: 10,
    },
    {
      id: 2,
      name: 'Wisata Budaya',
      slug: 'wisata-budaya',
      icon: '🏛️',
      description: 'Balai Adat Malaris, Rumah Adat Dayak Bukit, museum, dan warisan kearifan lokal Meratus.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Balai_Adat_Malaris.jpg/1280px-Balai_Adat_Malaris.jpg',
      destinations_count: 1,
    },
    {
      id: 3,
      name: 'Petualangan',
      slug: 'petualangan',
      icon: '🚣',
      description: 'Bamboo rafting Sungai Amandit, river tubing alami, dan ekspedisi rimba Meratus.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg/1280px-Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg',
      destinations_count: 1,
    },
    {
      id: 4,
      name: 'Wisata Religi',
      slug: 'religi',
      icon: '🕌',
      description: 'Ziarah cagar budaya spiritual bersejarah dan masjid kuno di bumi Antaludin.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Masjid_Ba%27angkat_2.jpg/1280px-Masjid_Ba%27angkat_2.jpg',
      destinations_count: 0,
    },
    {
      id: 5,
      name: 'Kuliner',
      slug: 'kuliner',
      icon: '🍲',
      description: 'Ketupat Kandangan otentik, dodol HSS legit, dan ragam kuliner khas Banjar Pahuluan.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg',
      destinations_count: 0,
    },
  ];
}

export interface ApiFacility {
  id: number;
  name: string;
  type?: string;
  latitude: number | string;
  longitude: number | string;
  rating?: number | string;
  address?: string;
  image_url?: string;
  distance_km?: number;
  google_maps_url?: string;
}

export interface ApiArticle {
  id: number;
  title: string;
  slug: string;
  category: string;
  read_time: string;
  snippet: string;
  content: string[];
  image_url?: string;
  author?: string;
  created_at?: string;
}

export const FALLBACK_FACILITIES: ApiFacility[] = [
  { id: 1, name: 'Warung Ketupat Kandangan Hj. Maryam', type: 'kuliner', latitude: -2.7745, longitude: 115.2640, rating: 4.8, address: 'Jl. Jenderal Sudirman No. 45, Kandangan Kota', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg' },
  { id: 2, name: 'Sentra Dodol Asli Kandangan Berkat Bersama', type: 'kuliner', latitude: -2.7712, longitude: 115.2618, rating: 4.7, address: 'Jl. Ahmad Yani KM 1.5, Kandangan Barat', image_url: '/assets/dodol-kandangan.jpg' },
  { id: 3, name: 'Meratus Riverside Homestay Loksado', type: 'penginapan', latitude: -2.7932, longitude: 115.4418, rating: 4.7, address: 'Bantaran Sungai Amandit, Desa Loksado', image_url: '/assets/riverside-meratus.jpg' },
  { id: 4, name: 'Wisma Pemandian Air Panas Tanuhi', type: 'penginapan', latitude: -2.7789, longitude: 115.4265, rating: 4.6, address: 'Kompleks Wisata Air Panas, Desa Hulu Banyu, Kec. Loksado', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kolam_Wisata_Air_Panas_Tanuhi.jpg/1280px-Kolam_Wisata_Air_Panas_Tanuhi.jpg' },
  { id: 5, name: 'Balai Singgah Pokdarwis Malaris', type: 'penginapan', latitude: -2.7950, longitude: 115.4480, rating: 4.6, address: 'Kompleks Balai Adat Malaris, Desa Loklahung, Kec. Loksado', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Balai_adat_Urui_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg/1280px-Balai_adat_Urui_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg' },
  { id: 6, name: 'SPBU Gambah Luar (Pos BBM Jalur Meratus)', type: 'spbu', latitude: -2.7790, longitude: 115.2670, rating: 4.5, address: 'Jl. A. Yani, Gambah Luar, Kandangan', image_url: '/assets/spbu-pertamina.jpg' },
  { id: 7, name: 'Warung Selera Meratus Loksado', type: 'kuliner', latitude: -2.7928, longitude: 115.4415, rating: 4.5, address: 'Dekat Jembatan Gantung Loksado, Kec. Loksado', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg' },
  { id: 8, name: 'Rest Area & Warung Sungai Pariangan', type: 'kuliner', latitude: -2.7410, longitude: 115.3692, rating: 4.6, address: 'Bantaran Sungai Amandit, Desa Batu Bini, Kec. Padang Batung', image_url: '/assets/wisata-pariangan.jpg' },
  { id: 9, name: 'Masjid Agung As-Syuhada Kandangan', type: 'masjid', latitude: -2.7745, longitude: 115.2630, rating: 4.9, address: 'Alun-Alun Antaludin, Pusat Kota Kandangan', image_url: '/assets/masjid-agung.jpg' },
  { id: 10, name: 'Pertashop & Mini Fuel Loksado', type: 'spbu', latitude: -2.7905, longitude: 115.4380, rating: 4.3, address: 'Jl. Laksamana Udara Suryadarma, Loksado', image_url: '/assets/spbu-pertamina.jpg' },
  { id: 11, name: 'Cafe Mangala (Mangala Coffee Loksado)', type: 'kuliner', latitude: -2.7728, longitude: 115.4245, rating: 4.7, address: 'RT. 02, Desa Hulu Banyu, Kec. Loksado (Panorama Gunung Kantawan)', image_url: '/assets/cafe-mangala.jpg' },
  { id: 12, name: 'Masjid Kuno As-Suada (Masjid Baangkat)', type: 'masjid', latitude: -2.7151, longitude: 115.2289, rating: 4.9, address: 'Desa Wasah Hilir, Kec. Simpur (Cagar Budaya Tertua)', image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Masjid_Ba%27angkat_2.jpg' },
  { id: 13, name: 'Wisata Sungai Pariangan (Spot Pemandian & Gazebo)', type: 'wisata', latitude: -2.741201, longitude: 115.368912, rating: 4.6, address: 'Bantaran Sungai Amandit, Desa Batu Bini, Kec. Padang Batung', image_url: '/assets/wisata-pariangan.jpg' },
  { id: 14, name: 'Bukit Batu Laki (Spot Panorama Karst)', type: 'wisata', latitude: -2.748912, longitude: 115.356211, rating: 4.5, address: 'Kawasan Karst, Desa Batu Laki, Kec. Padang Batung', image_url: '/assets/bukit-batu-laki.jpg' },
  { id: 15, name: 'Bukit Batu Baduduk (Spot Panorama Perbukitan)', type: 'wisata', latitude: -2.712311, longitude: 115.312411, rating: 4.4, address: 'Perbukitan Hamak Timur, Kec. Telaga Langsat', image_url: '/assets/bukit-batu-baduduk.jpg' },
];

export const FALLBACK_ARTICLES: ApiArticle[] = [
  {
    id: 1,
    title: 'Tata Krama & Etika Bertamu di Balai Adat Dayak Meratus',
    slug: 'tata-krama-balai-adat',
    category: 'Adat & Budaya',
    read_time: '4 mnt',
    snippet: 'Memahami makna ruang sakral Balai Adat, tata cara menyapa tetua adat dengan santun, serta etika memotret ritual upacara Aruh Bawanang.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Balai_Adat_Malaris.jpg/1280px-Balai_Adat_Malaris.jpg',
    author: 'Lembaga Adat HSS & Peneliti',
    content: [
      'Pegunungan Meratus di Hulu Sungai Selatan bukan sekadar bentang alam karst yang elok, melainkan ruang sakral bagi masyarakat adat Dayak Bukit (Dayak Meratus). Selama ratusan tahun, keseimbangan alam dan kehidupan sosial diatur oleh hukum adat serta kearifan leluhur yang diwariskan turun-temurun.',
      'Ketika memasuki kawasan Balai Adat seperti di Malaris atau Haratai, wisatawan wajib mengenakan pakaian yang sopan dan tidak menginjak bagian ritual tertentu tanpa izin Tetua Adat (Damang). Saat ritual seperti Aruh Bawanang berlangsung, keheningan dan penghormatan penuh sangat diharapkan.',
      'Suku Dayak Meratus memegang teguh filosofi bahwa sungai, hutan, dan bebatuan karst memiliki penunggu yang menjaga harmoni alam. Larangan merusak pohon, membuang sampah di aliran sungai Amandit, atau berbicara pongah di hutan adalah aturan adat tertinggi.',
    ],
  },
  {
    id: 2,
    title: 'Panduan Musim Terbaik Menjajal Bamboo Rafting Sungai Amandit',
    slug: 'panduan-bamboo-rafting',
    category: 'Tips Jalur',
    read_time: '3 mnt',
    snippet: 'Tips debit air ramah pemula dan persiapan pakaian ganti selama pengarungan riam sungai Loksado.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg/1280px-Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg',
    author: 'Komunitas Wisata Loksado',
    content: [
      'Waktu terbaik mengarungi Sungai Amandit menggunakan rakit bambu tradisional (Balanting Paring) adalah saat musim peralihan atau kemarau basah, di mana debit air stabil dan jeram riam tidak terlalu ganas bagi wisatawan pemula.',
      'Pastikan membawa kantong tahan air (dry bag) untuk ponsel dan dokumen berharga. Kenakan sandal gunung bertali atau sepatu air yang tidak licin di atas batang bambu basah.',
      'Selalu gunakan rompi pelampung berstandar dan percayakan kemudi sepenuhnya kepada joki lanting berlisensi lokal Dayak Meratus yang telah hafal setiap kelokan batu sungai.',
    ],
  },
  {
    id: 3,
    title: 'Mengapa Ketupat Kandangan Dimakan Menggunakan Tangan',
    slug: 'tradisi-ketupat-kandangan',
    category: 'Kuliner & Tradisi',
    read_time: '5 mnt',
    snippet: 'Tradisi kuliner otentik ikan haruan asap berkuah santan kental yang disantap tanpa sendok.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg',
    author: 'Sentra Kuliner Kandangan',
    content: [
      'Masyarakat Banjar Pahuluan di Hulu Sungai Selatan memiliki tradisi turun-temurun menyantap Ketupat Kandangan langsung menggunakan jemari tangan tanpa sendok garpu. Tekstur ketupat beras lokal yang mudah terurai berpadu sempurna dengan siraman kuah santan hangat berempah pala dan kayu manis.',
      'Ikan gabus (haruan) yang dibakar perlahan menggunakan arang sabut kelapa menghasilkan aroma asap (smoky) yang khas, daging kenyal, dan gurih alami yang sulit ditiru di daerah lain.',
      'Kini sentra kuliner Ketupat Kandangan dapat ditemui di sepanjang koridor Jalan Jenderal Sudirman dan kawasan Pasar Los Batu Kandangan.',
    ],
  },
  {
    id: 4,
    title: "Prinsip 'Bawa Pulang Sampah' di Hutan Lindung Haratai & Meratus",
    slug: 'etika-bawa-pulang-sampah',
    category: 'Tips Jalur',
    read_time: '6 mnt',
    snippet: 'Menjaga kebersihan hulu mata air dan kelestarian vegetasi rimba karst Meratus.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Air_Terjun_Haratai%2C_Loksado%2C_Hulu_Sungai_Selatan.jpg/1280px-Air_Terjun_Haratai%2C_Loksado%2C_Hulu_Sungai_Selatan.jpg',
    author: 'Pokdarwis Haratai',
    content: [
      'Kawasan hutan lindung Air Terjun Haratai dan Pegunungan Meratus merupakan hulu tangkapan air vital bagi Kalimantan Selatan. Tidak ada fasilitas pembuangan sampah modern di dalam jalur rimba.',
      'Setiap pengunjung wajib membawa kembali seluruh sampah kemasan plastik, botol air mineral, dan sisa perbekalan hingga ke tempat pembuangan akhir di kota Kandangan.',
      'Jaga kesegaran kolam alami dengan tidak menggunakan sabun kimia atau deterjen saat berenang di air terjun demi menjaga populasi ikan lokal sungai pedalaman.',
    ],
  },
  {
    id: 5,
    title: 'Mengenal Tanaman Obat Pasak Bumi & Madu Hutan Asli Meratus',
    slug: 'tanaman-obat-meratus',
    category: 'Adat & Budaya',
    read_time: '4 mnt',
    snippet: 'Hasil hutan bukan kayu yang dikelola secara arif dan lestari oleh masyarakat Dayak.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Kayu_manis_di_Balai_Adat_Haratai.jpg/1280px-Kayu_manis_di_Balai_Adat_Haratai.jpg',
    author: 'Kelompok Tani Hutan Loksado',
    content: [
      'Masyarakat pedalaman Loksado dan Haratai memiliki pengetahuan etnobotani warisan leluhur yang mengagumkan. Pasak bumi (Eurycoma longifolia) dan akar kuning dimanfaatkan sebagai jamu stamina alami keluarga.',
      'Selain rempah kayu manis, madu lebah hutan liar (Apis dorsata) dipanen dari dahan pohon sialang tinggi menggunakan teknik panen lestari (hanya mengambil sarang madu tanpa membunuh koloni lebah).',
      'Membeli madu hutan dan hasil hutan bukan kayu langsung dari warga lokal adalah bentuk dukungan nyata bagi ekonomi hijau berkelanjutan di Meratus.',
    ],
  },
];

/**
 * Fetch facilities near a coordinate (lodging, dining, mosque, fuel)
 */
export async function fetchNearbyFacilities(
  lat?: number,
  lng?: number,
  radiusKm = 60,
  type?: string
): Promise<ApiFacility[]> {
  try {
    const query = new URLSearchParams();
    if (lat !== undefined) query.append('lat', lat.toString());
    if (lng !== undefined) query.append('lng', lng.toString());
    query.append('radius_km', radiusKm.toString());
    if (type && type.toLowerCase() !== 'semua') query.append('type', type);

    const response = await fetch(`${API_BASE_URL}/facilities/nearby?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const res = await response.json();
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    }
  } catch (error) {
    console.warn('[Belalah API] Failed fetching nearby facilities, using fallback:', error);
  }

  let list = FALLBACK_FACILITIES;
  if (type && type.toLowerCase() !== 'semua') {
    list = list.filter((f) => f.type?.toLowerCase() === type.toLowerCase());
  }

  if (lat !== undefined && lng !== undefined) {
    return list.map((fac) => {
      const fLat = Number(fac.latitude);
      const fLng = Number(fac.longitude);
      const dist = calculateHaversineDistance(lat, lng, fLat, fLng);
      return {
        ...fac,
        distance_km: Number(dist.toFixed(1)),
        google_maps_url: `https://www.google.com/maps/dir/?api=1&destination=${fLat},${fLng}`,
      };
    })
      .filter((fac) => fac.distance_km !== undefined && fac.distance_km <= radiusKm)
      .sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0));
  }

  return list;
}

/**
 * Fetch articles/journal list from backend API with fallback
 */
export async function fetchArticles(category?: string): Promise<ApiArticle[]> {
  try {
    const query = new URLSearchParams();
    if (category && category.toLowerCase() !== 'semua') {
      query.append('category', category);
    }

    const response = await fetch(`${API_BASE_URL}/articles?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const res = await response.json();
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    }
  } catch (error) {
    console.warn('[Belalah API] Failed fetching articles, using fallback:', error);
  }

  if (category && category.toLowerCase() !== 'semua') {
    return FALLBACK_ARTICLES.filter((a) =>
      a.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  return FALLBACK_ARTICLES;
}

/**
 * Build dynamic Google Maps search link for a category centered around coordinates
 */
export function getGoogleMapsSearchUrl(categoryQuery: string, lat?: number, lng?: number): string {
  if (lat !== undefined && lng !== undefined) {
    return `https://www.google.com/maps/search/${encodeURIComponent(categoryQuery)}/@${lat},${lng},14z`;
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(categoryQuery + ' Hulu Sungai Selatan')}`;
}



