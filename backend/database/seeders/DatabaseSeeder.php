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

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Seed User (Bisa dikustomisasi via ADMIN_EMAIL, ADMIN_PASSWORD di .env)
        $adminEmail = env('ADMIN_EMAIL', 'admin@belalah-hss.id');
        $adminPassword = env('ADMIN_PASSWORD', 'password');
        $adminName = env('ADMIN_NAME', 'Administrator Belalah HSS');

        User::updateOrCreate([
            'email' => $adminEmail,
        ], [
            'name' => $adminName,
            'password' => bcrypt($adminPassword),
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

        $destDetails = [
            'Air Terjun Haratai' => [
                'description' => 'Objek wisata air terjun alami skala besar pada kawasan hutan lindung, dilengkapi perkebunan kayu manis dan peternakan madu kelulut.',
                'image_url' => '/assets/Air-Terjun-Haratai.jpg',
            ],
            'Bamboo Rafting Loksado' => [
                'description' => 'Atraksi wisata petualangan menyusuri riam Sungai Amandit menggunakan rakit bambu tradisional khas Dayak Meratus.',
                'image_url' => '/assets/bamboo-rafting.jpg',
            ],
            'Objek Wisata Air Panas Tanuhi' => [
                'description' => 'Pemandian air panas alami belerang dengan fasilitas kolam renang bertingkat dan penginapan di tengah lembah.',
                'image_url' => '/assets/air-panas-tanuhi.jpg',
            ],
            'Air Terjun Kilap Api' => [
                'description' => 'Air terjun alami dengan kolam penampungan jernih di bawah tebing karst rindang.',
                'image_url' => '/assets/air-terjun-kilap-api.jpg',
            ],
            'Riam Barajang dan Riam Hanai' => [
                'description' => 'Jeram sungai berbatu dan air terjun kembar di aliran hulu sungai Amandit yang asri.',
                'image_url' => '/assets/riam-barajang-hanai.jpg',
            ],
            'Balai Adat Malaris' => [
                'description' => 'Pusat kebudayaan dan ritual adat suku Dayak Meratus (Aruh Bahanan / Aruh Ganal), rumah panggung tradisional ulin.',
                'image_url' => '/assets/balai-adat-malaris.jpg',
            ],
            'Bukit Langara' => [
                'description' => 'Gugusan bukit karst batu kapur dengan panorama spektakuler bentang alam sungai Amandit dan belantara rimba Meratus.',
                'image_url' => '/assets/bukit-langara.jpg',
            ],
            'Wisata Sungai Pariangan' => [
                'description' => 'Kawasan pemandian dan arung sungai keluarga dengan bebatuan alami di Padang Batung.',
                'image_url' => '/assets/sungai-pariangan.jpg',
            ],
            'Bukit Batu Laki' => [
                'description' => 'Puncak perbukitan legendaris dengan lanskap batuan karst dan situs sejarah perjuangan rakyat Hulu Sungai.',
                'image_url' => '/assets/bukit-batu-laki.jpg',
            ],
            'Kalang Hadangan' => [
                'description' => 'Wisata fenomena kerbau rawa berenang khas lahan basah Daha Utara dan susur rawa Danau Bangkau.',
                'image_url' => '/assets/kalang-hadangan.jpg',
            ],
            'Bukit Batu Baduduk' => [
                'description' => 'Gugusan batu unik berundak di perbukitan Telaga Langsat dengan panorama perladangan hijau.',
                'image_url' => '/assets/bukit-batu-baduduk.jpg',
            ],
            'Situs Pemandangan' => [
                'description' => 'Gardu pandang panorama lembah Loksado dan bentang Pegunungan Meratus dari ketinggian.',
                'image_url' => '/assets/situs-pemandangan.jpg',
            ],
            'River Tubing Loksado' => [
                'description' => 'Sensasi arung jeram menggunakan ban dalam karet menyusuri arus riam sungai Amandit.',
                'image_url' => '/assets/river-tubing-loksado.jpg',
            ],
            'Air Terjun Mandin Mangapan' => [
                'description' => 'Air terjun bertingkat eksotis dengan aliran air deras di tengah hutan perawan Loksado.',
                'image_url' => '/assets/air-terjun-mandin-mangapan.jpg',
            ],
            'Air Terjun Rampah Menjangan' => [
                'description' => 'Air terjun tersembunyi dengan vegetasi hutan lumut dan udara sejuk pegunungan.',
                'image_url' => '/assets/air-terjun-rampah-menjangan.jpg',
            ],
            'Air Terjun Tinggiran Hayam' => [
                'description' => 'Air terjun bertingkat dengan kolam alami yang dikelilingi tebing bebatuan purba.',
                'image_url' => '/assets/air-terjun-tinggiran-hayam.jpg',
            ],
            'Puncak Bukit Batu Butahal' => [
                'description' => 'Spot pendakian ringan dengan panorama matahari terbit berkabut di atas lembah Meratus.',
                'image_url' => '/assets/bukit-batu-butahal.jpg',
            ],
            'Air Terjun Tinggiran Mawang' => [
                'description' => 'Air terjun alami dengan debit air deras di kawasan pedalaman Loksado.',
                'image_url' => '/assets/air-terjun-tinggiran-mawang.jpg',
            ],
            'Masjid As-Suada (Wassah Hilir)' => [
                'description' => 'Cagar budaya masjid bersejarah berarsitektur kayu ulin khas Banjar tertua di Kalimantan Selatan.',
                'image_url' => '/assets/masjid-baangkat.jpg',
            ],
            'Makam Datu Kandang Haji' => [
                'description' => 'Wisata ziarah dan cagar budaya makam ulama pejuang penyebar agama Islam di Bumi Antaludin.',
                'image_url' => '/assets/makam-datu-kandang-haji.jpg',
            ],
            'Pemandian Alami Tirta Alam (Batu Bini)' => [
                'description' => 'Pemandian mata air alami di kaki bukit batu kapur dengan aliran air pegunungan yang sangat jernih.',
                'image_url' => '/assets/tirta-alam-batu-bini.jpg',
            ],
        ];

        while (($row = fgetcsv($handle, 1000, ',')) !== false) {
            $category = Category::where('slug', $categorySlugs[$row[2]] ?? $row[2])->first();
            $destName = $row[1];
            $details = $destDetails[$destName] ?? [];

            $dest = Destination::updateOrCreate(
                ['name' => $destName],
                [
                    'category_id' => $category?->id,
                    'address'     => "Kecamatan {$row[3]}, Kabupaten Hulu Sungai Selatan",
                    'latitude'    => $row[4],
                    'longitude'   => $row[5],
                    'description' => $details['description'] ?? "Destinasi wisata unggulan di Kecamatan {$row[3]}, Kabupaten Hulu Sungai Selatan.",
                    'image_url'   => $details['image_url'] ?? '/assets/balanting-paring.jpg',
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

        // 5. Seed Facilities (Akomodasi, Kuliner, Masjid, SPBU di Hulu Sungai Selatan)
        $facilities = [
            [
                'name' => 'Wisma Pemandian Air Panas Tanuhi',
                'type' => 'penginapan',
                'latitude' => -2.8122,
                'longitude' => 115.3789,
                'rating' => 4.5,
                'address' => 'Desa Hulu Banyu, Kecamatan Loksado',
                'image_url' => '/assets/tanuhi.jpg',
            ],
            [
                'name' => 'Lodge Alam Meratus Loksado',
                'type' => 'penginapan',
                'latitude' => -2.7981,
                'longitude' => 115.3524,
                'rating' => 4.6,
                'address' => 'Desa Loksado, Kecamatan Loksado',
                'image_url' => '/assets/balanting-paring.jpg',
            ],
            [
                'name' => 'Warung Ketupat Kandangan Pak Haji',
                'type' => 'kuliner',
                'latitude' => -2.7750,
                'longitude' => 115.2642,
                'rating' => 4.8,
                'address' => 'Jl. Jenderal Sudirman, Kandangan Kota',
                'image_url' => '/assets/museum-rakyat.jpg',
            ],
            [
                'name' => 'Sentra Kuliner Dodol Asli Kandangan',
                'type' => 'kuliner',
                'latitude' => -2.7712,
                'longitude' => 115.2618,
                'rating' => 4.7,
                'address' => 'Kawasan Pasar Los Batu Kandangan',
                'image_url' => '/assets/museum-rakyat.jpg',
            ],
            [
                'name' => 'Masjid Besar Syuhada Kandangan',
                'type' => 'masjid',
                'latitude' => -2.7745,
                'longitude' => 115.2630,
                'rating' => 4.9,
                'address' => 'Pusat Kota Kandangan, HSS',
                'image_url' => '/assets/museum-rakyat.jpg',
            ],
            [
                'name' => 'SPBU Kandangan Kota',
                'type' => 'spbu',
                'latitude' => -2.7788,
                'longitude' => 115.2665,
                'rating' => 4.4,
                'address' => 'Jl. A. Yani, Kandangan',
                'image_url' => '/assets/museum-rakyat.jpg',
            ],
        ];

        foreach ($facilities as $fac) {
            Facility::updateOrCreate(['name' => $fac['name']], $fac);
        }
    }
}