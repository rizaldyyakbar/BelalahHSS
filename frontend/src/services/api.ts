import { DESTINATIONS, Destination } from '../constants/destinations';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface RecommendationParams {
  lat?: number;
  lng?: number;
  limit?: number;
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
  description: string;
  latitude: number | string;
  longitude: number | string;
  address?: string;
  image_url?: string;
  image_thumb_url?: string;
  distance_km?: number;
  saw_score?: number;
  rank?: number;
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
    if (params.lat !== undefined) query.append('lat', params.lat.toString());
    if (params.lng !== undefined) query.append('lng', params.lng.toString());
    if (params.limit !== undefined) query.append('limit', params.limit.toString());
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

    const resData: RecommendationApiResponse = await response.json();

    if (resData && Array.isArray(resData.data) && resData.data.length > 0) {
      const formatted: Destination[] = resData.data.map((item, index) => {
        const lat = typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
        const lng = typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;
        const distanceStr = item.distance_km !== undefined
          ? `${item.distance_km.toFixed(1)} km dari lokasi Anda`
          : 'Hulu Sungai Selatan';

        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || 'Wisata',
          location: item.address || 'Hulu Sungai Selatan',
          distance: distanceStr,
          img: item.image_url || item.image_thumb_url || 'langara.jpg',
          rating: 4.8,
          reviews: 120 + item.id * 15,
          description: item.description || 'Destinasi wisata unggulan di Kabupaten Hulu Sungai Selatan.',
          fullDescription: item.description,
          rank: item.rank || index + 1,
          latitude: lat,
          longitude: lng,
          entrance: 'Rp 10.000',
        };
      });

      return { destinations: formatted, isFromApi: true };
    }
  } catch (error) {
    console.warn('Backend API unavailable, using fallback constants:', error);
  }

  return { destinations: DESTINATIONS, isFromApi: false };
}
