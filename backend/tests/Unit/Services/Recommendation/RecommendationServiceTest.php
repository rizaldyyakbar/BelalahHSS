<?php

namespace Tests\Unit\Services\Recommendation;

use App\Services\Decision\SawService;
use App\Services\Geo\HaversineService;
use App\Services\Graph\DijkstraService;
use App\Services\Recommendation\RecommendationService;
use PHPUnit\Framework\TestCase;

class RecommendationServiceTest extends TestCase
{
    protected RecommendationService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new RecommendationService(
            new HaversineService(),
            new DijkstraService(),
            new SawService(),
        );
    }

    public function test_calculate_haversine_distances_returns_distance_per_destination(): void
    {
        $destinations = [
            ['id' => 1, 'latitude' => -6.175392, 'longitude' => 106.827153],
            ['id' => 2, 'latitude' => -6.917464, 'longitude' => 107.619123],
        ];

        $results = $this->service->calculateHaversineDistances(-6.175392, 106.827153, $destinations);

        $this->assertCount(2, $results);
        $this->assertSame(1, $results[0]['id']);
        $this->assertEqualsWithDelta(0.0, $results[0]['distance_km'], 0.0001);
        $this->assertSame(2, $results[1]['id']);
        $this->assertGreaterThan(100.0, $results[1]['distance_km']);
    }

    public function test_calculate_shortest_route_returns_expected_path_and_distance(): void
    {
        $graph = [
            'A' => ['B' => 4, 'C' => 2],
            'B' => ['A' => 4, 'C' => 1, 'D' => 5],
            'C' => ['A' => 2, 'B' => 1, 'D' => 8],
            'D' => ['B' => 5, 'C' => 8],
        ];

        $route = $this->service->calculateShortestRoute($graph, 'A', 'D');

        $this->assertSame(['A', 'C', 'B', 'D'], $route['path']);
        $this->assertEqualsWithDelta(8.0, $route['distance'], 0.0001);
    }

    public function test_optimize_route_orders_destinations_from_user_location(): void
    {
        $result = $this->service->optimizeRoute(-6.2, 106.8, [
            ['id' => 1, 'name' => 'A', 'latitude' => -6.2, 'longitude' => 106.9],
            ['id' => 2, 'name' => 'B', 'latitude' => -6.2, 'longitude' => 107.1],
            ['id' => 3, 'name' => 'C', 'latitude' => -6.2, 'longitude' => 107.0],
        ]);

        $this->assertSame([1, 3, 2], array_column($result['route'], 'id'));
        $this->assertGreaterThan(0.0, $result['total_distance_km']);
        $this->assertSame(6, $result['permutations_checked']); // 3! = 6
        $this->assertSame('brute_force_dijkstra', $result['method']);
        $this->assertGreaterThanOrEqual(0.0, $result['distance_saved_km']);
    }

    public function test_rank_with_saw_returns_sorted_scores(): void
    {
        $alternatives = [
            ['id' => 'A', 'values' => ['c1' => 90, 'c2' => 8]],
            ['id' => 'B', 'values' => ['c1' => 80, 'c2' => 6]],
        ];

        $criteria = [
            ['key' => 'c1', 'weight' => 0.7, 'type' => 'benefit'],
            ['key' => 'c2', 'weight' => 0.3, 'type' => 'cost'],
        ];

        $ranked = $this->service->rankWithSaw($alternatives, $criteria);

        $this->assertCount(2, $ranked);
        $this->assertSame('A', $ranked[0]['id']);
        $this->assertGreaterThan($ranked[1]['score'], $ranked[0]['score']);
    }
}
