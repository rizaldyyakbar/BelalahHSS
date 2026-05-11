<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Criteria;
use App\Models\Destination;
use App\Models\DestinationValue;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);

        $categories = [
            'wisata-alam' => 'Wisata Alam',
            'wisata-budaya' => 'Wisata Budaya',
        ];

        foreach ($categories as $slug => $name) {
            Category::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name],
            );
        }

        $categoryWisataAlam = Category::where('slug', 'wisata-alam')->first();
        $categoryWisataBudaya = Category::where('slug', 'wisata-budaya')->first();

        $destinations = [
            [
                'name' => 'Pantai Indah',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Pantai dengan pemandangan sunset.',
                'latitude' => -2.12345678,
                'longitude' => 102.12345678,
                'image_url' => null,
                'address' => 'Jl. Pantai Indah No. 1',
            ],
            [
                'name' => 'Museum Sejarah',
                'category_id' => $categoryWisataBudaya?->id,
                'description' => 'Museum lokal berisi koleksi sejarah daerah.',
                'latitude' => -2.22345678,
                'longitude' => 102.22345678,
                'image_url' => null,
                'address' => 'Jl. Museum No. 2',
            ],
        ];

        foreach ($destinations as $destinationData) {
            Destination::updateOrCreate(
                ['name' => $destinationData['name']],
                $destinationData,
            );
        }

        $criteria = [
            [
                'name' => 'Popularitas',
                'weight' => 0.15,
                'type' => 'benefit',
            ],
            [
                'name' => 'Price',
                'weight' => 0.20,
                'type' => 'cost',
            ],
            [
                'name' => 'Fasilitas',
                'weight' => 0.40,
                'type' => 'benefit',
            ],
            [
                'name' => 'Kebersihan dan Keamanan',
                'weight' => 0.25,
                'type' => 'benefit',
            ],
        ];

        foreach ($criteria as $criterionData) {
            Criteria::updateOrCreate(
                ['name' => $criterionData['name']],
                $criterionData,
            );
        }

        $destinationPantai = Destination::where('name', 'Pantai Indah')->first();
        $destinationMuseum = Destination::where('name', 'Museum Sejarah')->first();
        $criterionPopularitas    = Criteria::where('name', 'Popularitas')->first();
        $criterionPrice          = Criteria::where('name', 'Price')->first();
        $criterionFasilitas      = Criteria::where('name', 'Fasilitas')->first();
        $criterionKebersihan     = Criteria::where('name', 'Kebersihan dan Keamanan')->first();

        $destinationValues = [
            // Pantai Indah
            [$destinationPantai?->id, $criterionPopularitas?->id,  80.00],
            [$destinationPantai?->id, $criterionPrice?->id,         25.00],
            [$destinationPantai?->id, $criterionFasilitas?->id,     70.00],
            [$destinationPantai?->id, $criterionKebersihan?->id,    85.00],
            // Museum Sejarah
            [$destinationMuseum?->id, $criterionPopularitas?->id,   65.00],
            [$destinationMuseum?->id, $criterionPrice?->id,          10.00],
            [$destinationMuseum?->id, $criterionFasilitas?->id,     78.00],
            [$destinationMuseum?->id, $criterionKebersihan?->id,    90.00],
        ];

        foreach ($destinationValues as [$destinationId, $criteriaId, $score]) {
            if (! $destinationId || ! $criteriaId) {
                continue;
            }

            DestinationValue::updateOrCreate(
                [
                    'destination_id' => $destinationId,
                    'criteria_id' => $criteriaId,
                ],
                [
                    'value_score' => $score,
                ],
            );
        }

        $facilities = [
            [
                'name' => 'Hotel Nusantara',
                'type' => 'penginapan',
                'latitude' => -2.11345678,
                'longitude' => 102.11345678,
                'rating' => 4.5,
                'address' => 'Jl. Hotel No. 10',
                'image_url' => null,
            ],
            [
                'name' => 'Warung Rasa',
                'type' => 'kuliner',
                'latitude' => -2.13345678,
                'longitude' => 102.13345678,
                'rating' => 4.2,
                'address' => 'Jl. Kuliner No. 5',
                'image_url' => null,
            ],
        ];

        foreach ($facilities as $facilityData) {
            Facility::updateOrCreate(
                ['name' => $facilityData['name']],
                $facilityData,
            );
        }
    }
}
