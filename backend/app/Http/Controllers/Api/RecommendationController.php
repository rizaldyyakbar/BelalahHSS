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
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    public function __construct(protected RecommendationService $recommendationService) {}

    public function index(RecommendationRequest $request)
    {
        $data = $request->validated();

        $mode = $data['mode'] ?? 'near_user';
        $limit = isset($data['limit']) ? (int) $data['limit'] : 10;
        $sort = $data['sort'] ?? 'score';
        $radiusMeters = isset($data['radius_meters']) ? (int) $data['radius_meters'] : 5000;
        $pretty = $request->boolean('pretty');
        $excludeDestinationId = null;

        if ($mode === 'around_destination') {
            $centerDestination = Destination::query()
                ->select(['id', 'latitude', 'longitude'])
                ->findOrFail((int) $data['destination_id']);

            $userLat = (float) $centerDestination->latitude;
            $userLng = (float) $centerDestination->longitude;
            $excludeDestinationId = (int) $centerDestination->id;
        } else {
            $userLat = (float) $data['lat'];
            $userLng = (float) $data['lng'];
        }

        $cacheKey = $this->generateCacheKey([
            'mode' => $mode,
            'lat' => round($userLat, 5),
            'lng' => round($userLng, 5),
            'destination_id' => $excludeDestinationId,
            'radius_meters' => $radiusMeters,
            'limit' => $limit,
            'sort' => $sort,
        ]);
        $cacheTtl = 60 * 60; // 1 hour cache

        // Try to return cached result
        if (Cache::has($cacheKey)) {
            $payload = Cache::get($cacheKey);
            if ($pretty) {
                return response()->json($payload, 200, [], JSON_PRETTY_PRINT);
            }
            return response()->json($payload);
        }

        $candidateLimit = max($limit * 5, 50);

                // Primary path: use PostGIS to fetch nearest candidates quickly.
                $postgisSql = <<<SQL
SELECT id,
             ROUND(
                 ST_Distance(location, ST_SetSRID(ST_MakePoint(:lng1, :lat1), 4326)::geography)::numeric / 1000,
                 2
             ) AS distance_km
FROM destinations
WHERE location IS NOT NULL
    AND ST_DWithin(location, ST_SetSRID(ST_MakePoint(:lng2, :lat2), 4326)::geography, :radius_meters)
SQL;

                $postgisBindings = [
                        'lng1' => $userLng,
                        'lat1' => $userLat,
                        'lng2' => $userLng,
                        'lat2' => $userLat,
                        'radius_meters' => $radiusMeters,
                ];

                if ($excludeDestinationId !== null) {
                        $postgisSql .= "\n  AND id <> :exclude_id";
                        $postgisBindings['exclude_id'] = $excludeDestinationId;
                }

                $postgisSql .= "\nORDER BY distance_km ASC\nLIMIT :candidate_limit";
                $postgisBindings['candidate_limit'] = $candidateLimit;

                $postgisRows = DB::select($postgisSql, $postgisBindings);

        $distanceById = [];
        $destinationIds = [];

        foreach ($postgisRows as $row) {
            $id = (int) $row->id;
            $destinationIds[] = $id;
            $distanceById[$id] = (float) $row->distance_km;
        }

        // Fallback path: if PostGIS returns no row, use Haversine for backward compatibility.
        if (empty($destinationIds)) {
            $allDestinationsQuery = Destination::whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->select(['id', 'name', 'latitude', 'longitude', 'image_thumb_url', 'image_url']);

            if ($excludeDestinationId !== null) {
                $allDestinationsQuery->where('id', '<>', $excludeDestinationId);
            }

            $allDestinations = $allDestinationsQuery->get();

            $destArray = $allDestinations->map(fn ($d) => [
                'id' => $d->id,
                'latitude' => (float) $d->latitude,
                'longitude' => (float) $d->longitude,
            ])->toArray();

            $distances = $this->recommendationService->calculateHaversineDistances($userLat, $userLng, $destArray);

            foreach ($distances as $row) {
                $id = (int) $row['id'];
                $destinationIds[] = $id;
                $distanceById[$id] = round((float) $row['distance_km'], 2);
            }

            usort($distances, fn ($a, $b) => $a['distance_km'] <=> $b['distance_km']);
            $destinationIds = array_slice(array_column($distances, 'id'), 0, $candidateLimit);
            $destinations = $allDestinations->whereIn('id', $destinationIds)->values();
        } else {
            $destinations = Destination::whereIn('id', $destinationIds)
                ->select(['id', 'name', 'latitude', 'longitude', 'image_thumb_url', 'image_url'])
                ->get();
        }

        // Cache plain arrays (not Eloquent objects) to avoid unserialize issues.
        $criteriaList = Cache::remember('criteria_list_v2', 60 * 24, function () {
            return Criteria::query()
                ->get(['id', 'weight', 'type'])
                ->map(fn ($c) => [
                    'id' => (string) $c->id,
                    'weight' => (float) $c->weight,
                    'type' => strtolower($c->type ?? 'benefit'),
                ])
                ->values()
                ->toArray();
        });

        $criteria = array_map(static fn (array $c) => [
            'key' => $c['id'],
            'weight' => $c['weight'],
            'type' => $c['type'],
        ], $criteriaList);

        // Load destination values with eager loading to prevent N+1
        // Only for destinations within search radius
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
            foreach ($criteriaList as $c) {
                $criteriaId = $c['id'];
                $vals[$criteriaId] = $valuesMap[$d->id][$criteriaId] ?? 0.0;
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
    private function generateCacheKey(array $parts): string
    {
        return 'recommendations:' . md5(json_encode($parts)) . ':' . Cache::get('recommendation_cache_version', 1);
    }
}

