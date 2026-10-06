<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DestinationController extends Controller
{
    /**
     * Get single destination detail with enriched values and nearby recommendations
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $destination = Destination::with(['category', 'destinationValues.criteria'])->find($id);

        if (! $destination) {
            return response()->json([
                'success' => false,
                'message' => 'Destinasi tidak ditemukan.',
            ], 404);
        }

        $userLat = $request->filled('lat') ? (float) $request->input('lat') : -2.7758;
        $userLng = $request->filled('lng') ? (float) $request->input('lng') : 115.2635;

        // Calculate distance from user or default basecamp
        $distanceKm = null;
        if ($destination->latitude !== null && $destination->longitude !== null) {
            $destLat = (float) $destination->latitude;
            $destLng = (float) $destination->longitude;

            // Haversine formula
            $earthRadius = 6371;
            $dLat = deg2rad($destLat - $userLat);
            $dLng = deg2rad($destLng - $userLng);
            $a = sin($dLat / 2) * sin($dLat / 2) +
                cos(deg2rad($userLat)) * cos(deg2rad($destLat)) *
                sin($dLng / 2) * sin($dLng / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $distanceKm = round($earthRadius * $c, 1);
        }

        $imagePath = $destination->image_thumb_url ?? $destination->image_url ?? null;
        $imageUrl = null;
        if (is_string($imagePath) && $imagePath !== '') {
            if (preg_match('~^https?://~i', $imagePath) || str_starts_with($imagePath, '/')) {
                $imageUrl = $imagePath;
            } else {
                $imageUrl = Storage::disk('public')->url($imagePath);
            }
        }

        // Format criteria values
        $criteriaValues = [];
        foreach ($destination->destinationValues as $dv) {
            $criteriaName = $dv->criteria?->name ?? (string) $dv->criteria_id;
            $criteriaValues[$criteriaName] = (float) $dv->value_score;
        }

        // Find up to 3 nearby destinations using coordinates
        $nearby = [];
        if ($destination->latitude !== null && $destination->longitude !== null) {
            $nearbyDests = Destination::where('id', '<>', $destination->id)
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->select(['id', 'name', 'category_id', 'latitude', 'longitude', 'image_url', 'image_thumb_url'])
                ->get();

            $nearbyCalculated = [];
            foreach ($nearbyDests as $nd) {
                $dLat = deg2rad((float) $nd->latitude - (float) $destination->latitude);
                $dLng = deg2rad((float) $nd->longitude - (float) $destination->longitude);
                $a = sin($dLat / 2) * sin($dLat / 2) +
                    cos(deg2rad((float) $destination->latitude)) * cos(deg2rad((float) $nd->latitude)) *
                    sin($dLng / 2) * sin($dLng / 2);
                $dist = round(6371 * 2 * atan2(sqrt($a), sqrt(1 - $a)), 1);

                $nImg = $nd->image_thumb_url ?? $nd->image_url;
                if (is_string($nImg) && ! preg_match('~^https?://~i', $nImg) && ! str_starts_with($nImg, '/')) {
                    $nImg = Storage::disk('public')->url($nImg);
                }

                $nearbyCalculated[] = [
                    'id' => $nd->id,
                    'name' => $nd->name,
                    'distance_km' => $dist,
                    'image' => $nImg,
                ];
            }

            usort($nearbyCalculated, fn ($a, $b) => $a['distance_km'] <=> $b['distance_km']);
            $nearby = array_slice($nearbyCalculated, 0, 3);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $destination->id,
                'name' => $destination->name,
                'category_id' => $destination->category_id,
                'category' => $destination->category ? [
                    'id' => $destination->category->id,
                    'name' => $destination->category->name,
                    'slug' => $destination->category->slug,
                ] : null,
                'description' => $destination->description,
                'address' => $destination->address,
                'latitude' => $destination->latitude ? (float) $destination->latitude : null,
                'longitude' => $destination->longitude ? (float) $destination->longitude : null,
                'image' => $imageUrl,
                'distance_km' => $distanceKm,
                'values' => $criteriaValues,
                'nearby' => $nearby,
            ],
        ]);
    }
}
