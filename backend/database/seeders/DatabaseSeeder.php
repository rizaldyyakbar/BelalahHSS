<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Criteria;
use App\Models\Destination;
use App\Models\DestinationValue;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Seed User
        User::updateOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);

        // 2. Seed Criteria (Wajib lebih dulu agar criteria_id tersedia)
        $criteriaData = [
            ['name' => 'Fasilitas', 'weight' => 0.30, 'type' => 'benefit'],
            ['name' => 'Kebersihan dan Keamanan', 'weight' => 0.40, 'type' => 'benefit'],
            ['name' => 'Harga Tiket', 'weight' => 0.10, 'type' => 'cost'],
            ['name' => 'Popularitas', 'weight' => 0.20, 'type' => 'benefit'],
        ];

        foreach ($criteriaData as $c) {
            Criteria::updateOrCreate(['name' => $c['name']], $c);
        }

        $critFasilitas = Criteria::where('name', 'Fasilitas')->first();
        $critKebersihan = Criteria::where('name', 'Kebersihan dan Keamanan')->first();
        $critHarga = Criteria::where('name', 'Harga Tiket')->first();
        $critPopularitas = Criteria::where('name', 'Popularitas')->first();

        // 3. Seed Categories
        $categories = [
            'wisata-alam' => 'Wisata Alam',
            'wisata-budaya' => 'Wisata Budaya',
            'petualangan' => 'Petualangan',
            'religi' => 'Religi',
            'kuliner' => 'Kuliner',
        ];

        foreach ($categories as $slug => $name) {
            Category::updateOrCreate(['slug' => $slug], ['name' => $name]);
        }

        // 4. Baca CSV dan Seed Destinations beserta DestinationValues
        $csvFile = database_path('data/destinasi/destinasi.csv');
        
        if (!file_exists($csvFile)) {
            $this->command->error("File CSV tidak ditemukan di: {$csvFile}");
            return;
        }

        $handle = fopen($csvFile, 'r');
        fgetcsv($handle); // Lewati header kolom baris pertama

        $categorySlugs = [
            'Alam' => 'wisata-alam',
            'Budaya' => 'wisata-budaya',
            'Petualangan' => 'petualangan',
            'Religi' => 'religi',
        ];

        while (($row = fgetcsv($handle, 1000, ',')) !== false) {
            $category = Category::where('slug', $categorySlugs[$row[2]] ?? $row[2])->first();

            $dest = Destination::updateOrCreate(
                ['name' => $row[1]],
                [
                    'category_id' => $category?->id,
                    'address'     => "Kecamatan {$row[3]}, Kabupaten Hulu Sungai Selatan",
                    'latitude'    => $row[4],
                    'longitude'   => $row[5],
                ]
            );

            // Simpan nilai kriteria ke tabel destination_values
            DestinationValue::updateOrCreate(
                ['destination_id' => $dest->id, 'criteria_id' => $critFasilitas->id],
                ['value_score' => $row[6]]
            );

            DestinationValue::updateOrCreate(
                ['destination_id' => $dest->id, 'criteria_id' => $critKebersihan->id],
                ['value_score' => $row[7]]
            );

            DestinationValue::updateOrCreate(
                ['destination_id' => $dest->id, 'criteria_id' => $critHarga->id],
                ['value_score' => $row[8]]
            );

            DestinationValue::updateOrCreate(
                ['destination_id' => $dest->id, 'criteria_id' => $critPopularitas->id],
                ['value_score' => $row[9]]
            );
        }

        fclose($handle);
    }
}