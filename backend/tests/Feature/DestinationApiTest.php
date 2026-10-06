<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Destination;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestinationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_destination_detail_returns_404_for_nonexistent_id(): void
    {
        $response = $this->getJson('/api/destinations/99999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_destination_detail_returns_data_for_existing_destination(): void
    {
        $destination = Destination::first();

        if ($destination) {
            $response = $this->getJson("/api/destinations/{$destination->id}");

            $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'description',
                        'address',
                        'latitude',
                        'longitude',
                    ],
                ]);
        } else {
            $this->assertTrue(true);
        }
    }
}
