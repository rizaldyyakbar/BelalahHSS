import { DESTINATIONS, Destination } from '../constants/destinations';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface RecommendationParams {
  lat?: number;
  lng?: number;
  limit?: number;
  radius_meters?: number;
  sort?: 'rank' | 'distance' | 'popularitas' | 'price' | 'fasilitasScore';
  category_id?: number;
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

        const ticketPrice = item.values && item.values['3']
          ? `Rp ${Number(item.values['3']).toLocaleString('id-ID')}`
          : localMatch?.entrance || 'Rp 10.000';

        return {
          id: localMatch?.id ?? item.id,
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
