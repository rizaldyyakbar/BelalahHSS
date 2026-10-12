import { DESTINATIONS, Destination } from '../constants/destinations';
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

        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || localMatch?.category || 'Wisata Alam',
          region: regionStr,
          location: item.address || localMatch?.location || `Kecamatan ${regionStr}, Hulu Sungai Selatan`,
          distance: distanceStr,
          img: item.image || item.image_url || localMatch?.img || '/assets/balanting-paring.jpg',
          rating: localMatch?.rating || 4.8,
          reviews: localMatch?.reviews || (120 + item.id * 15),
          description: item.description || localMatch?.description || 'Destinasi wisata unggulan di Kabupaten Hulu Sungai Selatan.',
          fullDescription: localMatch?.fullDescription || item.description,
          photos: localMatch?.photos || ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
          facilities: localMatch?.facilities || [
            { icon: 'map-pin', name: 'Area Parkir' },
            { icon: 'camera', name: 'Spot Foto Alami' },
            { icon: 'shield', name: 'Pos Retribusi Resmi' },
          ],
          rank: item.rank || index + 1,
          latitude: itemLat,
          longitude: itemLng,
          entrance: ticketPrice,
          popularitas: sawScoreNumber,
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

        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || localMatch?.category || 'Wisata Alam',
          region: regionStr,
          location: item.address || localMatch?.location || `Kecamatan ${regionStr}, Hulu Sungai Selatan`,
          distance: distanceStr,
          img: item.image || localMatch?.img || '/assets/balanting-paring.jpg',
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
      destinations_count: 16,
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
      destinations_count: 2,
    },
    {
      id: 4,
      name: 'Wisata Religi',
      slug: 'religi',
      icon: '🕌',
      description: 'Ziarah makam ulama kharismatik dan situs cagar budaya spiritual bersejarah di bumi Antaludin.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Masjid_Ba%27angkat_2.jpg/1280px-Masjid_Ba%27angkat_2.jpg',
      destinations_count: 2,
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

export const FALLBACK_FACILITIES: ApiFacility[] = [
  { id: 1, name: 'Wisma Pemandian Air Panas Tanuhi', type: 'penginapan', latitude: -2.7789, longitude: 115.4265, rating: 4.6, address: 'Kompleks Wisata Air Panas, Desa Hulu Banyu, Kec. Loksado' },
  { id: 2, name: 'Lodge Alam Meratus Loksado', type: 'penginapan', latitude: -2.7935, longitude: 115.4420, rating: 4.7, address: 'Tepi Sungai Amandit, Desa Loksado, Kec. Loksado' },
  { id: 3, name: 'Meratus Resort & Mountain Homestay', type: 'penginapan', latitude: -2.7915, longitude: 115.4450, rating: 4.5, address: 'Jl. Poros Loksado - Loklahung, Kec. Loksado' },
  { id: 4, name: 'Haratai Eco Homestay', type: 'penginapan', latitude: -2.7910, longitude: 115.4845, rating: 4.8, address: 'Kawasan Hutan Lindung Desa Haratai, Kec. Loksado' },
  { id: 5, name: 'Warung Selera Meratus Loksado', type: 'kuliner', latitude: -2.7928, longitude: 115.4415, rating: 4.5, address: 'Dekat Jembatan Gantung Loksado, Kec. Loksado' },
  { id: 6, name: 'Kantin Rest Area Riam Barajang', type: 'kuliner', latitude: -2.7848, longitude: 115.4492, rating: 4.4, address: 'Bantaran Riam Barajang, Desa Loklahung, Kec. Loksado' },
  { id: 7, name: 'Musholla Al-Ikhlas Loksado', type: 'masjid', latitude: -2.7930, longitude: 115.4408, rating: 4.8, address: 'Pusat Desa Loksado, Kec. Loksado' },
  { id: 8, name: 'Pertashop & Mini Fuel Loksado', type: 'spbu', latitude: -2.7905, longitude: 115.4380, rating: 4.3, address: 'Jl. Laksamana Udara Suryadarma, Loksado' },
  { id: 9, name: 'Rest Area & Warung Sungai Pariangan', type: 'kuliner', latitude: -2.7410, longitude: 115.3692, rating: 4.6, address: 'Bantaran Sungai Amandit, Desa Batu Bini, Kec. Padang Batung' },
  { id: 10, name: 'Warung Ikan Bakar Tradisional Padang Batung', type: 'kuliner', latitude: -2.7460, longitude: 115.3610, rating: 4.5, address: 'Jl. Raya Padang Batung, HSS' },
  { id: 11, name: 'Homestay Alam Lembah Batu Laki', type: 'penginapan', latitude: -2.7485, longitude: 115.3560, rating: 4.4, address: 'Kaki Bukit Batu Laki, Kec. Padang Batung' },
  { id: 12, name: 'Masjid Jami Al-Hidayah Padang Batung', type: 'masjid', latitude: -2.7440, longitude: 115.3630, rating: 4.9, address: 'Pusat Kecamatan Padang Batung, HSS' },
  { id: 13, name: 'SPBU Padang Batung', type: 'spbu', latitude: -2.7520, longitude: 115.3510, rating: 4.5, address: 'Jl. Brigjen H. Hasan Basry, Padang Batung' },
  { id: 14, name: 'Hotel Rakat Mupakat Kandangan', type: 'penginapan', latitude: -2.7760, longitude: 115.2645, rating: 4.5, address: 'Jl. Pangeran Antasari No. 12, Kandangan Kota' },
  { id: 15, name: 'Wisma Duta Syariah Kandangan', type: 'penginapan', latitude: -2.7725, longitude: 115.2610, rating: 4.4, address: 'Jl. Jenderal Sudirman, Kandangan Barat' },
  { id: 16, name: 'Warung Ketupat Kandangan Pak Haji', type: 'kuliner', latitude: -2.7750, longitude: 115.2642, rating: 4.9, address: 'Jl. Jenderal Sudirman, Kandangan Kota (Spesialis Iwak Haruan Asap)' },
  { id: 17, name: 'Warung Ketupat Kandangan Nanang', type: 'kuliner', latitude: -2.7738, longitude: 115.2635, rating: 4.8, address: 'Kawasan Pasar Los Batu Kandangan' },
  { id: 18, name: 'Sentra Kuliner Dodol Asli Kandangan', type: 'kuliner', latitude: -2.7712, longitude: 115.2618, rating: 4.7, address: 'Pusat Oleh-Oleh Khas Dodol Kandangan, Jl. A. Yani' },
  { id: 19, name: 'Masjid Agung As-Syuhada Kandangan', type: 'masjid', latitude: -2.7745, longitude: 115.2630, rating: 4.9, address: 'Alun-Alun Antaludin, Pusat Kota Kandangan' },
  { id: 20, name: 'SPBU Hamalau Kandangan', type: 'spbu', latitude: -2.7788, longitude: 115.2665, rating: 4.5, address: 'Jl. A. Yani KM 2.5 Hamalau, Kandangan' },
  { id: 21, name: 'Dermaga & Sentra Iwak Baung Bangkau', type: 'kuliner', latitude: -2.6860, longitude: 115.1965, rating: 4.6, address: 'Tepi Danau Bangkau, Kec. Kandangan Barat / Pahaungan' },
  { id: 22, name: 'Masjid Kuno As-Suada (Masjid Baangkat)', type: 'masjid', latitude: -2.7151, longitude: 115.2289, rating: 4.9, address: 'Desa Wasah Hilir, Kec. Simpur (Cagar Budaya Ulin Tertua)' },
  { id: 23, name: 'Pertashop Nagara Daha', type: 'spbu', latitude: -2.6840, longitude: 115.1940, rating: 4.4, address: 'Jl. Poros Negara - Kandangan, Daha Selatan' },
];

/**
 * Fetch facilities near a coordinate (lodging, dining, mosque, fuel)
 */
export async function fetchNearbyFacilities(
  lat?: number,
  lng?: number,
  radiusKm = 30
): Promise<ApiFacility[]> {
  try {
    const query = new URLSearchParams();
    if (lat !== undefined) query.append('lat', lat.toString());
    if (lng !== undefined) query.append('lng', lng.toString());
    query.append('radius_km', radiusKm.toString());

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

  // Authentic local database fallback sorted by Haversine distance
  if (lat !== undefined && lng !== undefined) {
    return FALLBACK_FACILITIES.map((fac) => {
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

  return FALLBACK_FACILITIES;
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



