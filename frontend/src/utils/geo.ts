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
    totalDistanceKm: Number(totalDistance.toFixed(1)),
    totalDrivingHours: drivingHours,
    totalDrivingMins: drivingMins,
    totalTourHours: tourHours,
    totalTourMins: tourMins,
  };
}

/**
 * Helper to generate permutations of array items
 */
function permute<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  const result: T[][] = [];
  for (let i = 0; i < items.length; i++) {
    const current = items[i];
    if (current === undefined) continue;
    const remaining = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const sub of permute(remaining)) {
      result.push([current, ...sub]);
    }
  }
  return result;
}

export interface ClientRouteOptimizationResult<T> {
  route: Array<T & { distance_from_previous_km: number }>;
  total_distance_km: number;
  initial_distance_km: number;
  distance_saved_km: number;
  percentage_saved: number;
  permutations_checked: number;
  method: 'brute_force_dijkstra' | 'greedy_dijkstra';
}

/**
 * Optimize multi-stop route using Brute Force permutation on Dijkstra/Haversine distance matrix.
 * Guarantees mathematical global minimum for N <= 7 stops, with Greedy fallback for N > 7.
 */
export function optimizeRouteClientSide<
  T extends { id: number; name: string; latitude?: number | string; longitude?: number | string }
>(
  startPoint: { lat: number; lng: number },
  destinations: T[]
): ClientRouteOptimizationResult<T> {
  if (destinations.length === 0) {
    return {
      route: [],
      total_distance_km: 0,
      initial_distance_km: 0,
      distance_saved_km: 0,
      percentage_saved: 0,
      permutations_checked: 0,
      method: 'brute_force_dijkstra',
    };
  }

  // Pre-parse coordinates
  const points = [
    { id: 0, lat: startPoint.lat, lng: startPoint.lng, isStart: true },
    ...destinations.map((d) => {
      const coords = parseCoords(d) || { lat: -2.77, lng: 115.31 };
      return { id: d.id, lat: coords.lat, lng: coords.lng, isStart: false, raw: d };
    }),
  ];

  // 1. Compute Distance matrix between all pairs
  const matrix = new Map<number, Map<number, number>>();
  for (const p1 of points) {
    if (!matrix.has(p1.id)) matrix.set(p1.id, new Map());
    for (const p2 of points) {
      if (p1.id === p2.id) {
        matrix.get(p1.id)!.set(p2.id, 0);
      } else {
        const direct = calculateHaversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
        const roadDist = estimateRoadDistanceKm(direct);
        matrix.get(p1.id)!.set(p2.id, roadDist);
      }
    }
  }

  // 2. Initial (unoptimized) distance in the exact order user selected
  let initialDistance = 0;
  let prevId = 0;
  for (const d of destinations) {
    initialDistance += matrix.get(prevId)?.get(d.id) || 0;
    prevId = d.id;
  }

  const destIds = destinations.map((d) => d.id);
  let bestOrder: number[] = [];
  let bestDist = Infinity;
  let permutationsChecked = 1;
  let method: 'brute_force_dijkstra' | 'greedy_dijkstra' = 'brute_force_dijkstra';

  if (destIds.length <= 7) {
    const allPerms = permute(destIds);
    permutationsChecked = allPerms.length;

    for (const perm of allPerms) {
      let curDist = 0;
      let curr = 0;
      for (const nextId of perm) {
        curDist += matrix.get(curr)?.get(nextId) || Infinity;
        curr = nextId;
      }
      if (curDist < bestDist) {
        bestDist = curDist;
        bestOrder = perm;
      }
    }
  } else {
    method = 'greedy_dijkstra';
    let unvisited = [...destIds];
    let curr = 0;
    bestDist = 0;

    while (unvisited.length > 0) {
      let nearest: number | null = null;
      let minD = Infinity;
      for (const cand of unvisited) {
        const d = matrix.get(curr)?.get(cand) || Infinity;
        if (d < minD) {
          minD = d;
          nearest = cand;
        }
      }
      if (nearest === null) break;
      bestOrder.push(nearest);
      bestDist += minD;
      curr = nearest;
      unvisited = unvisited.filter((id) => id !== nearest);
    }
  }

  const destMap = new Map(destinations.map((d) => [d.id, d]));
  let prevNode = 0;
  const route = bestOrder.map((id) => {
    const dest = destMap.get(id)!;
    const stepDist = matrix.get(prevNode)?.get(id) || 0;
    prevNode = id;
    return {
      ...dest,
      distance_from_previous_km: Number(stepDist.toFixed(2)),
    };
  });

  const distanceSaved = Math.max(0, initialDistance - bestDist);
  const percentSaved = initialDistance > 0 ? (distanceSaved / initialDistance) * 100 : 0;

  return {
    route,
    total_distance_km: Number(bestDist.toFixed(2)),
    initial_distance_km: Number(initialDistance.toFixed(2)),
    distance_saved_km: Number(distanceSaved.toFixed(2)),
    percentage_saved: Number(percentSaved.toFixed(1)),
    permutations_checked: permutationsChecked,
    method,
  };
}
