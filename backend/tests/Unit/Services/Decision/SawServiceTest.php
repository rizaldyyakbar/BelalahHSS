<?php

namespace Tests\Unit\Services\Decision;

use App\Services\Decision\SawService;
use PHPUnit\Framework\TestCase;

class SawServiceTest extends TestCase
{
    public function test_rank_orders_alternatives_by_weighted_score(): void
    {
        $service = new SawService();

        $alternatives = [
            [
                'id' => 'A',
                'values' => ['c1' => 80, 'c2' => 20],
            ],
            [
                'id' => 'B',
                'values' => ['c1' => 70, 'c2' => 10],
            ],
        ];

        $criteria = [
            ['key' => 'c1', 'weight' => 0.6, 'type' => 'benefit'],
            ['key' => 'c2', 'weight' => 0.4, 'type' => 'cost'],
        ];

        $ranked = $service->rank($alternatives, $criteria);

        $this->assertCount(2, $ranked);
        $this->assertSame('B', $ranked[0]['id']);
        $this->assertEqualsWithDelta(0.925, $ranked[0]['score'], 0.0001);
        $this->assertSame('A', $ranked[1]['id']);
        $this->assertEqualsWithDelta(0.8, $ranked[1]['score'], 0.0001);
    }

    public function test_rank_returns_zero_for_cost_when_value_is_zero(): void
    {
        $service = new SawService();

        $alternatives = [
            [
                'id' => 1,
                'values' => ['c1' => 0],
            ],
        ];

        $criteria = [
            ['key' => 'c1', 'weight' => 1, 'type' => 'cost'],
        ];

        $ranked = $service->rank($alternatives, $criteria);

        $this->assertCount(1, $ranked);
        $this->assertEqualsWithDelta(0.0, $ranked[0]['normalized']['c1'], 0.0001);
        $this->assertEqualsWithDelta(0.0, $ranked[0]['score'], 0.0001);
    }
}
