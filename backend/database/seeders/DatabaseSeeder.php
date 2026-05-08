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
                'name' => 'Jarak',
                'weight' => 0.40,
                'type' => 'cost',
            ],
            [
                'name' => 'Keindahan',
                'weight' => 0.35,
                'type' => 'benefit',
            ],
            [
                'name' => 'Fasilitas',
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
        $criterionJarak = Criteria::where('name', 'Jarak')->first();
        $criterionKeindahan = Criteria::where('name', 'Keindahan')->first();
        $criterionFasilitas = Criteria::where('name', 'Fasilitas')->first();

        $destinationValues = [
            [$destinationPantai?->id, $criterionJarak?->id, 4.50],
            [$destinationPantai?->id, $criterionKeindahan?->id, 4.80],
            [$destinationPantai?->id, $criterionFasilitas?->id, 3.90],
            [$destinationMuseum?->id, $criterionJarak?->id, 3.70],
            [$destinationMuseum?->id, $criterionKeindahan?->id, 4.20],
            [$destinationMuseum?->id, $criterionFasilitas?->id, 4.60],
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
