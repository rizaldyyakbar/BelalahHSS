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
     * Order selected destinations by repeatedly finding the nearest unvisited
     * node from the current node using Dijkstra's shortest-path algorithm.
     *
     * @param  array<int, array{id: int, name: string, latitude: float|int, longitude: float|int}>  $destinations
     * @return array{route: array<int, array{id: int, name: string, latitude: float, longitude: float, distance_from_previous_km: float}>, total_distance_km: float}
     */
    public function optimizeRoute(float $userLatitude, float $userLongitude, array $destinations): array
    {
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

        $route = [];
        $totalDistance = 0.0;
        $currentNode = 'user';
        $unvisited = array_keys($destinationsByNode);

        while ($unvisited !== []) {
            $nearestNode = null;
            $nearestDistance = INF;

            foreach ($unvisited as $candidateNode) {
                $result = $this->dijkstraService->shortestPath($graph, $currentNode, $candidateNode);

                if ($result['distance'] < $nearestDistance) {
                    $nearestNode = $candidateNode;
                    $nearestDistance = (float) $result['distance'];
                }
            }

            if ($nearestNode === null || $nearestDistance === INF) {
                break;
            }

            $destination = $destinationsByNode[$nearestNode];
            $distance = round($nearestDistance, 2);
            $route[] = [
                'id' => (int) $destination['id'],
                'name' => $destination['name'],
                'latitude' => (float) $destination['latitude'],
                'longitude' => (float) $destination['longitude'],
                'distance_from_previous_km' => $distance,
            ];
            $totalDistance += $nearestDistance;
            $currentNode = $nearestNode;
            $unvisited = array_values(array_filter(
                $unvisited,
                static fn (string|int $node): bool => (string) $node !== (string) $nearestNode,
            ));
        }

        return [
            'route' => $route,
            'total_distance_km' => round($totalDistance, 2),
        ];
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