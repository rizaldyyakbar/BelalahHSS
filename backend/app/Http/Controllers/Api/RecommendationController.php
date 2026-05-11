<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecommendationRequest;
use App\Models\Criteria;
use App\Models\Destination;
use App\Models\DestinationValue;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use App\Services\Recommendation\RecommendationService;

class RecommendationController extends Controller
{
    public function __construct(protected RecommendationService $recommendationService) {}

    public function index(RecommendationRequest $request)
    {
        $data = $request->validated();

        $userLat = (float) $data['lat'];
        $userLng = (float) $data['lng'];
        $limit = isset($data['limit']) ? (int) $data['limit'] : 10;
        $sort = $data['sort'] ?? 'score';
        $pretty = $request->boolean('pretty');

        // Generate cache key based on all relevant request parameters
        $cacheKey = $this->generateCacheKey($userLat, $userLng, $limit, $sort);
        $cacheTtl = 60 * 60; // 1 hour cache

        // Try to return cached result
        if (Cache::has($cacheKey)) {
            $payload = Cache::get($cacheKey);
            if ($pretty) {
                return response()->json($payload, 200, [], JSON_PRETTY_PRINT);
            }
            return response()->json($payload);
        }

        // Load destinations with eager loading for performance
        $destinations = Destination::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select(['id', 'name', 'latitude', 'longitude', 'image_thumb_url', 'image_url'])
            ->get();

        // Prepare destination array for distance calculation
        $destArray = $destinations->map(fn ($d) => [
            'id' => $d->id,
            'latitude' => (float) $d->latitude,
            'longitude' => (float) $d->longitude,
        ])->toArray();

        // Calculate distances using Haversine formula
        $distances = $this->recommendationService->calculateHaversineDistances($userLat, $userLng, $destArray);
        $distanceById = [];
        foreach ($distances as $row) {
            $distanceById[$row['id']] = $row['distance_km'];
        }

        // Cache criteria (rarely changes, no need to query on every request)
        $criteriaModels = Cache::remember('criteria_models', 60 * 24, function () {
            return Criteria::all();
        });
        $criteria = $criteriaModels->map(fn ($c) => [
            'key' => (string) $c->id,
            'weight' => (float) $c->weight,
            'type' => strtolower($c->type ?? 'benefit'),
        ])->toArray();

        // Load destination values with eager loading to prevent N+1
        $destinationIds = $destinations->pluck('id')->toArray();
        $values = DestinationValue::whereIn('destination_id', $destinationIds)
            ->get(['destination_id', 'criteria_id', 'value_score']);
        
        // Build value map
        $valuesMap = [];
        foreach ($values as $v) {
            $valuesMap[$v->destination_id][(string) $v->criteria_id] = (float) $v->value_score;
        }

        // Build alternatives array for SAW algorithm
        $alternatives = [];
        foreach ($destinations as $d) {
            $vals = [];
            foreach ($criteriaModels as $c) {
                $vals[(string) $c->id] = $valuesMap[$d->id][$c->id] ?? 0.0;
            }

            $alternatives[] = [
                'id' => $d->id,
                'values' => $vals,
            ];
        }

        // Rank using SAW algorithm
        $ranked = $this->recommendationService->rankWithSaw($alternatives, $criteria);

        // Format results
        $results = [];
        foreach ($ranked as $row) {
            $dest = $destinations->firstWhere('id', $row['id']);
            if (! $dest) {
                continue;
            }

            $imagePath = $dest->image_thumb_url ?? $dest->image_url ?? null;
            $imageUrl = null;

            if (is_string($imagePath) && $imagePath !== '') {
                if (preg_match('~^https?://~i', $imagePath)) {
                    $imageUrl = $imagePath;
                } else {
                    $imageUrl = Storage::disk('public')->url($imagePath);
                }
            }

            $results[] = [
                'id' => $dest->id,
                'name' => $dest->name,
                'image' => $imageUrl,
                'distance_km' => $distanceById[$dest->id] ?? null,
                'score' => $row['score'],
            ];
        }

        // Apply sorting (optional override)
        if ($sort === 'distance') {
            usort($results, fn ($a, $b) =>
                (($a['distance_km'] ?? INF) <=> ($b['distance_km'] ?? INF))
            );
        } elseif ($sort === 'score') {
            usort($results, fn ($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));
        }

        // Slice to limit
        $payload = array_slice($results, 0, $limit);

        // Cache the result
        Cache::put($cacheKey, $payload, $cacheTtl);

        // Return response
        if ($pretty) {
            return response()->json($payload, 200, [], JSON_PRETTY_PRINT);
        }

        return response()->json($payload);
    }

    /**
     * Generate a cache key based on recommendation request parameters
     */
    private function generateCacheKey(float $lat, float $lng, int $limit, string $sort): string
    {
        // Round to 2 decimal places for lat/lng to group nearby requests
        $latRounded = round($lat, 2);
        $lngRounded = round($lng, 2);
        
        return "recommendations:{$latRounded}:{$lngRounded}:{$limit}:{$sort}";
    }
}

