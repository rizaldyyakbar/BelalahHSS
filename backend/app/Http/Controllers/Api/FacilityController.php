<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    /**
     * Get facilities sorted by distance to given coordinates
     */
    public function nearby(Request $request): JsonResponse
    {
        $lat = $request->query('lat');
        $lng = $request->query('lng');
        $type = $request->query('type');
        $radiusKm = (float) $request->query('radius_km', 50);

        $query = Facility::query();

        if ($type) {
            $query->where('type', $type);
        }

        $facilities = $query->get();

        if ($lat !== null && $lng !== null && is_numeric($lat) && is_numeric($lng)) {
            $originLat = (float) $lat;
            $originLng = (float) $lng;

            // Calculate Haversine distance in km
            $facilities = $facilities->map(function ($facility) use ($originLat, $originLng) {
                $fLat = (float) $facility->latitude;
                $fLng = (float) $facility->longitude;

                $earthRadius = 6371;
                $dLat = deg2rad($fLat - $originLat);
                $dLon = deg2rad($fLng - $originLng);

                $a = sin($dLat / 2) * sin($dLat / 2) +
                    cos(deg2rad($originLat)) * cos(deg2rad($fLat)) *
                    sin($dLon / 2) * sin($dLon / 2);

                $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
                $distanceKm = round($earthRadius * $c, 1);

                $facility->distance_km = $distanceKm;
                $facility->google_maps_url = "https://www.google.com/maps/dir/?api=1&destination={$fLat},{$fLng}";

                return $facility;
            })->filter(function ($facility) use ($radiusKm) {
                return $facility->distance_km <= $radiusKm;
            })->sortBy('distance_km')->values();
        } else {
            $facilities = $facilities->map(function ($facility) {
                $fLat = (float) $facility->latitude;
                $fLng = (float) $facility->longitude;
                $facility->distance_km = null;
                $facility->google_maps_url = "https://www.google.com/maps/dir/?api=1&destination={$fLat},{$fLng}";
                return $facility;
            });
        }

        return response()->json([
            'success' => true,
            'data' => $facilities,
        ]);
    }
}
