<?php

namespace Tests\Unit\Services\Geo;

use App\Services\Geo\HaversineService;
use PHPUnit\Framework\TestCase;

class HaversineServiceTest extends TestCase
{
    public function test_distance_is_zero_for_same_point(): void
    {
        $service = new HaversineService();

        $distance = $service->distanceKm(-6.175392, 106.827153, -6.175392, 106.827153);

        $this->assertEqualsWithDelta(0.0, $distance, 0.0001);
    }

    public function test_distance_is_symmetric_between_two_points(): void
    {
        $service = new HaversineService();

        $aToB = $service->distanceKm(-6.175392, 106.827153, -6.917464, 107.619123);
        $bToA = $service->distanceKm(-6.917464, 107.619123, -6.175392, 106.827153);

        $this->assertEqualsWithDelta($aToB, $bToA, 0.0001);
    }

    public function test_distance_for_jakarta_to_bandung_is_in_expected_range(): void
    {
        $service = new HaversineService();

        $distance = $service->distanceKm(-6.175392, 106.827153, -6.917464, 107.619123);

        $this->assertGreaterThan(100.0, $distance);
        $this->assertLessThan(160.0, $distance);
    }
}
