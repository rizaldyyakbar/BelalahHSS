/**
 * Geo & Navigation Utilities for Belalah HSS
 * Provides real Haversine formula distance calculation and route metric estimation.
 */

export interface LatLng {
  lat: number | string;
  lng: number | string;
}

/**
 * Calculate Great-Circle distance between two points using the Haversine formula in Kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format kilometer distance to Indonesian locale string (e.g. "18.2 km")
 */
export function formatDistanceKm(km: number): string {
  if (isNaN(km) || km < 0) return '0 km';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Estimate road distance in Meratus terrain (applying 1.28x winding mountain road coefficient)
 */
export function estimateRoadDistanceKm(directKm: number): number {
  return directKm * 1.28;
}

/**
 * Parse numeric latitude & longitude safely
 */
export function parseCoords(item?: { latitude?: number | string; longitude?: number | string } | null): { lat: number; lng: number } | null {
  if (!item) return null;
  const lat = typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
  const lng = typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;

  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    return { lat, lng };
  }
  return null;
}

/**
 * Compute total route distance and estimated driving & touring durations from actual stop points
 */
export function calculateRouteMetrics(
  startPoint: { lat: number | string; lng: number | string },
  stops: Array<{ latitude?: number | string; longitude?: number | string }>
) {
  const sLat = typeof startPoint.lat === 'string' ? parseFloat(startPoint.lat) : startPoint.lat;
  const sLng = typeof startPoint.lng === 'string' ? parseFloat(startPoint.lng) : startPoint.lng;

  if (stops.length === 0) {
    return {
      totalDistanceKm: 0,
      totalDrivingHours: 0,
      totalDrivingMins: 0,
      totalTourHours: 0,
      totalTourMins: 0,
    };
  }

  let totalDistance = 0;
  let prevLat = sLat;
  let prevLng = sLng;

  for (const stop of stops) {
    const coords = parseCoords(stop);
    if (coords) {
      const dist = calculateHaversineDistance(prevLat, prevLng, coords.lat, coords.lng);
      totalDistance += estimateRoadDistanceKm(dist);
      prevLat = coords.lat;
      prevLng = coords.lng;
    } else {
      // Fallback rough distance per stop if coords missing
      totalDistance += 12;
    }
  }

  // Meratus average mountain driving speed ~35 km/h
  const drivingMinutesTotal = Math.round((totalDistance / 35) * 60);
  const drivingHours = Math.floor(drivingMinutesTotal / 60);
  const drivingMins = drivingMinutesTotal % 60;

  // Average 75 minutes exploration time per tourist attraction
  const tourMinutesTotal = drivingMinutesTotal + stops.length * 75;
  const tourHours = Math.floor(tourMinutesTotal / 60);
  const tourMins = tourMinutesTotal % 60;

  return {
    totalDistanceKm: Math.max(totalDistance, stops.length * 10),
    totalDrivingHours: drivingHours,
    totalDrivingMins: drivingMins,
    totalTourHours: tourHours,
    totalTourMins: tourMins,
  };
}
