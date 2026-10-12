<?php

namespace App\Services\Recommendation;

use App\Services\Decision\SawService;
use App\Services\Geo\HaversineService;
use App\Services\Graph\DijkstraService;

class RecommendationService
{
    public function __construct(
        protected HaversineService $haversineService,
        protected DijkstraService $dijkstraService,
        protected SawService $sawService,
    ) {}

    /**
     * @param  array<int, array{id: mixed, latitude: float|int, longitude: float|int}>  $destinations
     * @return array<int, array{id: mixed, distance_km: float}>
     */
    public function calculateHaversineDistances(float $userLatitude, float $userLongitude, array $destinations): array
    {
        $results = [];

        foreach ($destinations as $destination) {
            $results[] = [
                'id' => $destination['id'],
                'distance_km' => $this->haversineService->distanceKm(
                    $userLatitude,
                    $userLongitude,
                    (float) $destination['latitude'],
                    (float) $destination['longitude'],
                ),
            ];
        }

        return $results;
    }

    /**
     * @param  array<string|int, array<string|int, float|int>>  $graph
     * @return array{distance: float, path: array<int, string|int>}
     */
    public function calculateShortestRoute(array $graph, string|int $sourceNode, string|int $targetNode): array
    {
        return $this->dijkstraService->shortestPath($graph, $sourceNode, $targetNode);
    }

    /**
     * Order selected destinations using Brute Force Permutation on a Dijkstra-computed
     * distance matrix (for N <= 7) to guarantee the global optimal shortest route,
     * or Greedy Nearest Neighbor via Dijkstra (for N > 7).
     *
     * @param  array<int, array{id: int, name: string, latitude: float|int, longitude: float|int}>  $destinations
     * @return array{
     *   route: array<int, array{id: int, name: string, latitude: float, longitude: float, distance_from_previous_km: float}>,
     *   total_distance_km: float,
     *   initial_distance_km: float,
     *   distance_saved_km: float,
     *   percentage_saved: float,
     *   permutations_checked: int,
     *   method: string
     * }
     */
    public function optimizeRoute(float $userLatitude, float $userLongitude, array $destinations): array
    {
        if (empty($destinations)) {
            return [
                'route' => [],
                'total_distance_km' => 0.0,
                'initial_distance_km' => 0.0,
                'distance_saved_km' => 0.0,
                'percentage_saved' => 0.0,
                'permutations_checked' => 0,
                'method' => 'none',
            ];
        }

        $nodes = [
            'user' => [
                'latitude' => $userLatitude,
                'longitude' => $userLongitude,
            ],
        ];
        $destinationsByNode = [];

        foreach ($destinations as $destination) {
            $node = (string) $destination['id'];
            $nodes[$node] = [
                'latitude' => (float) $destination['latitude'],
                'longitude' => (float) $destination['longitude'],
            ];
            $destinationsByNode[$node] = $destination;
        }

        // 1. Build coordinate graph with Haversine edge weights
        $graph = [];
        foreach ($nodes as $sourceNode => $source) {
            $graph[$sourceNode] = [];

            foreach ($nodes as $targetNode => $target) {
                if ($sourceNode === $targetNode) {
                    continue;
                }

                $graph[$sourceNode][$targetNode] = $this->haversineService->distanceKm(
                    $source['latitude'],
                    $source['longitude'],
                    $target['latitude'],
                    $target['longitude'],
                );
            }
        }

        // 2. Precompute Distance Matrix using Dijkstra shortest path between all pairs
        $distanceMatrix = [];
        foreach (array_keys($nodes) as $fromNode) {
            $distanceMatrix[$fromNode] = [];
            foreach (array_keys($nodes) as $toNode) {
                if ($fromNode === $toNode) {
                    $distanceMatrix[$fromNode][$toNode] = 0.0;
                    continue;
                }
                $dijkstraRes = $this->dijkstraService->shortestPath($graph, $fromNode, $toNode);
                $distanceMatrix[$fromNode][$toNode] = (float) ($dijkstraRes['distance'] ?? INF);
            }
        }

        // 3. Compute initial unoptimized distance (in the order user added them)
        $nodeKeys = array_map(fn ($d) => (string) $d['id'], $destinations);
        $initialDistance = 0.0;
        $prev = 'user';
        foreach ($nodeKeys as $k) {
            $initialDistance += $distanceMatrix[$prev][$k] ?? 0.0;
            $prev = $k;
        }

        $bestOrder = [];
        $bestDistance = INF;
        $permutationsChecked = 1;
        $method = 'brute_force_dijkstra';

        if (count($nodeKeys) <= 7) {
            $permutations = $this->generatePermutations($nodeKeys);
            $permutationsChecked = count($permutations);

            foreach ($permutations as $perm) {
                $currentDist = 0.0;
                $curr = 'user';
                foreach ($perm as $stepNode) {
                    $currentDist += $distanceMatrix[$curr][$stepNode] ?? INF;
                    $curr = $stepNode;
                }

                if ($currentDist < $bestDistance) {
                    $bestDistance = $currentDist;
                    $bestOrder = $perm;
                }
            }
        } else {
            // Greedy Nearest-Neighbor fallback for N > 7
            $method = 'greedy_dijkstra';
            $unvisited = $nodeKeys;
            $curr = 'user';
            $bestDistance = 0.0;

            while (! empty($unvisited)) {
                $nearest = null;
                $minD = INF;
                foreach ($unvisited as $cand) {
                    $d = $distanceMatrix[$curr][$cand] ?? INF;
                    if ($d < $minD) {
                        $minD = $d;
                        $nearest = $cand;
                    }
                }

                if ($nearest === null) {
                    break;
                }

                $bestOrder[] = $nearest;
                $bestDistance += $minD;
                $curr = $nearest;
                $unvisited = array_values(array_filter($unvisited, fn ($n) => (string) $n !== (string) $nearest));
            }
        }

        // 4. Format resulting ordered route
        $route = [];
        $prev = 'user';
        foreach ($bestOrder as $nodeId) {
            $destination = $destinationsByNode[$nodeId];
            $stepDist = $distanceMatrix[$prev][$nodeId] ?? 0.0;
            $route[] = [
                'id' => (int) $destination['id'],
                'name' => $destination['name'],
                'latitude' => (float) $destination['latitude'],
                'longitude' => (float) $destination['longitude'],
                'distance_from_previous_km' => round($stepDist, 2),
            ];
            $prev = $nodeId;
        }

        $distanceSaved = max(0.0, $initialDistance - $bestDistance);
        $percentSaved = $initialDistance > 0 ? ($distanceSaved / $initialDistance) * 100 : 0.0;

        return [
            'route' => $route,
            'total_distance_km' => round($bestDistance, 2),
            'initial_distance_km' => round($initialDistance, 2),
            'distance_saved_km' => round($distanceSaved, 2),
            'percentage_saved' => round($percentSaved, 1),
            'permutations_checked' => $permutationsChecked,
            'method' => $method,
        ];
    }

    /**
     * Generate all permutations of an array.
     *
     * @param  array<int, string>  $items
     * @return array<int, array<int, string>>
     */
    protected function generatePermutations(array $items): array
    {
        if (count($items) <= 1) {
            return [$items];
        }

        $permutations = [];
        foreach ($items as $key => $item) {
            $remaining = $items;
            unset($remaining[$key]);
            foreach ($this->generatePermutations(array_values($remaining)) as $subPerm) {
                $permutations[] = array_merge([$item], $subPerm);
            }
        }

        return $permutations;
    }

    /**
     * @param  array<int, array{id: mixed, values: array<string, float|int>}>  $alternatives
     * @param  array<int, array{key: string, weight: float|int, type: string}>  $criteria
     * @return array<int, array{id: mixed, score: float, normalized: array<string, float>, values: array<string, float|int>}>
     */
    public function rankWithSaw(array $alternatives, array $criteria): array
    {
        return $this->sawService->rank($alternatives, $criteria);
    }
}