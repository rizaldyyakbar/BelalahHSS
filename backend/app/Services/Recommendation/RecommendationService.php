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
     * @param  array<int, array{id: mixed, values: array<string, float|int>}>  $alternatives
     * @param  array<int, array{key: string, weight: float|int, type: string}>  $criteria
     * @return array<int, array{id: mixed, score: float, normalized: array<string, float>, values: array<string, float|int>}>
     */
    public function rankWithSaw(array $alternatives, array $criteria): array
    {
        return $this->sawService->rank($alternatives, $criteria);
    }
}