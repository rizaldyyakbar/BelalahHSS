<?php

namespace Tests\Feature;

use App\Models\Facility;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FacilityApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_facilities_nearby_api_returns_success_and_facility_list(): void
    {
        Facility::create([
            'name' => 'Wisma Uji Coba Loksado',
            'type' => 'penginapan',
            'latitude' => -2.8122,
            'longitude' => 115.3789,
            'rating' => 4.5,
            'address' => 'Loksado, HSS',
        ]);

        $response = $this->getJson('/api/facilities/nearby?lat=-2.80&lng=115.37');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'type',
                        'latitude',
                        'longitude',
                        'rating',
                        'distance_km',
                        'google_maps_url',
                    ],
                ],
            ]);
    }
}
