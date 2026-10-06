import { DESTINATIONS, Destination } from '../constants/destinations';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

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
        };
      });

      console.info(`[Belalah API] Successfully live-fetched ${formatted.length} destinations with PostGIS & SAW scores.`);
      return { destinations: formatted, isFromApi: true };
    }
  } catch (error) {
    console.warn('Backend API unavailable or error occurred, using fallback constants:', error);
  }

  return { destinations: DESTINATIONS, isFromApi: false };
}

export async function optimizeRoute(
  lat: number,
  lng: number,
  destinationIds: number[],
): Promise<{ route: OptimizedRouteItem[]; total_distance_km: number }> {
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

  if (!response.ok) {
    throw new Error(`Route optimization failed with status ${response.status}`);
  }

  return response.json();
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
  destinations_count?: number;
}

/**
 * Fetch list of tourism categories with destination count from backend
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
    { id: 1, name: 'Wisata Alam', slug: 'wisata-alam', destinations_count: 14 },
    { id: 2, name: 'Wisata Budaya', slug: 'wisata-budaya', destinations_count: 3 },
    { id: 3, name: 'Petualangan', slug: 'petualangan', destinations_count: 2 },
    { id: 4, name: 'Religi', slug: 'religi', destinations_count: 2 },
    { id: 5, name: 'Kuliner', slug: 'kuliner', destinations_count: 0 },
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
      if (Array.isArray(res.data)) {
        return res.data;
      }
    }
  } catch (error) {
    console.warn('[Belalah API] Failed fetching nearby facilities, using fallback:', error);
  }

  return [];
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



