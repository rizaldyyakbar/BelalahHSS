<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Criteria;
use App\Models\Destination;
use App\Models\DestinationValue;
use Illuminate\Support\Facades\Storage;
use App\Services\Recommendation\RecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(protected RecommendationService $recommendationService) {}

    public function index(Request $request)
    {
        $data = $request->validate([
            'lat' => ['required', 'numeric'],
            'lng' => ['required', 'numeric'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'pretty' => ['sometimes'],
            'sort' => ['sometimes', 'in:score,distance'],
        ]);

        $userLat = (float) $data['lat'];
        $userLng = (float) $data['lng'];
        $limit = isset($data['limit']) ? (int) $data['limit'] : 10;
        $pretty = isset($data['pretty']) && $request->query('pretty') ? true : false;

        $destinations = Destination::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'name', 'latitude', 'longitude', 'image_thumb_url', 'image_url']);

        $destArray = $destinations->map(fn ($d) => [
            'id' => $d->id,
            'latitude' => (float) $d->latitude,
            'longitude' => (float) $d->longitude,
        ])->toArray();

        $distances = $this->recommendationService->calculateHaversineDistances($userLat, $userLng, $destArray);
        $distanceById = [];
        foreach ($distances as $row) {
            $distanceById[$row['id']] = $row['distance_km'];
        }

        $criteriaModels = Criteria::all();
        $criteria = $criteriaModels->map(fn ($c) => [
            'key' => (string) $c->id,
            'weight' => (float) $c->weight,
            'type' => strtolower($c->type ?? 'benefit'),
        ])->toArray();

        $destinationIds = $destinations->pluck('id')->toArray();
        $values = DestinationValue::whereIn('destination_id', $destinationIds)->get();
        $valuesMap = [];
        foreach ($values as $v) {
            $valuesMap[$v->destination_id][(string) $v->criteria_id] = (float) $v->value_score;
        }

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

        $ranked = $this->recommendationService->rankWithSaw($alternatives, $criteria);

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

        // optional sorting override: keep SAW order by default
        if (isset($data['sort'])) {
            if ($data['sort'] === 'score') {
                usort($results, fn ($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));
            } elseif ($data['sort'] === 'distance') {
                usort($results, fn ($a, $b) =>
                    (($a['distance_km'] ?? INF) <=> ($b['distance_km'] ?? INF))
                );
            }
        }

        $payload = array_slice($results, 0, $limit);

        if ($pretty) {
            return response()->json($payload, 200, [], JSON_PRETTY_PRINT);
        }

        return response()->json($payload);
    }
}
