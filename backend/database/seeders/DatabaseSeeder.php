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

        // 2. Seed Criteria (Wajib lebih dulu agar criteria_id tersedia, disusun berdasarkan peringkat prioritas wawancara)
        $criteriaData = [
            ['name' => 'Kebersihan dan Keamanan', 'weight' => 0.40, 'type' => 'benefit'], // Peringkat 1 (Utama)
            ['name' => 'Fasilitas',               'weight' => 0.30, 'type' => 'benefit'], // Peringkat 2
            ['name' => 'Popularitas',             'weight' => 0.20, 'type' => 'benefit'], // Peringkat 3
            ['name' => 'Harga Tiket',             'weight' => 0.10, 'type' => 'cost'],    // Peringkat 4
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
            'wisata-alam' => [
                'name' => 'Wisata Alam',
                'icon' => '🌿',
                'description' => 'Pegunungan Meratus, rimba lindung, dan panorama hijau asri khas Hulu Sungai Selatan.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Panorama_Bukit_Batu_Lengara_Loksado_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg',
            ],
            'wisata-budaya' => [
                'name' => 'Wisata Budaya',
                'icon' => '🏛️',
                'description' => 'Balai Adat Malaris, Rumah Adat Dayak Bukit, museum, dan warisan kearifan lokal Meratus.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Balai_Adat_Malaris.jpg/1280px-Balai_Adat_Malaris.jpg',
            ],
            'petualangan' => [
                'name' => 'Petualangan',
                'icon' => '🚣',
                'description' => 'Bamboo rafting Sungai Amandit, river tubing alami, dan ekspedisi rimba Meratus.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg/1280px-Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg',
            ],
            'religi' => [
                'name' => 'Wisata Religi',
                'icon' => '🕌',
                'description' => 'Ziarah makam ulama kharismatik dan situs cagar budaya spiritual bersejarah di bumi Antaludin.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Masjid_Ba%27angkat_2.jpg/1280px-Masjid_Ba%27angkat_2.jpg',
            ],
            'kuliner' => [
                'name' => 'Kuliner',
                'icon' => '🍲',
                'description' => 'Ketupat Kandangan otentik, dodol HSS legit, dan ragam kuliner khas Banjar Pahuluan.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ketupat_Kandangan_Haruan.jpg/1280px-Ketupat_Kandangan_Haruan.jpg',
            ],
        ];

        foreach ($categories as $slug => $cData) {
            Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $cData['name'],
                    'icon' => $cData['icon'],
                    'description' => $cData['description'],
                    'image_url' => $cData['image_url'],
                ]
            );
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
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Air_Terjun_Haratai%2C_Loksado%2C_Hulu_Sungai_Selatan.jpg/1280px-Air_Terjun_Haratai%2C_Loksado%2C_Hulu_Sungai_Selatan.jpg',
            ],
            'Bamboo Rafting Loksado' => [
                'description' => 'Atraksi wisata petualangan menyusuri riam Sungai Amandit menggunakan rakit bambu tradisional khas Dayak Meratus.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg/1280px-Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg',
            ],
            'Objek Wisata Air Panas Tanuhi' => [
                'description' => 'Pemandian air panas alami belerang dengan fasilitas kolam renang bertingkat dan penginapan di tengah lembah.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kolam_Wisata_Air_Panas_Tanuhi.jpg/1280px-Kolam_Wisata_Air_Panas_Tanuhi.jpg',
            ],
            'Air Terjun Kilap Api' => [
                'description' => 'Situs Geopark Meratus (Geosite #51) di Desa Hulu Banyu dengan aliran air berundak menuruni formasi batuan granit hitam menyerupai kilatan api.',
                'image_url' => 'https://web.archive.org/web/20260716095648im_/https://meratusgeopark.org/wp-content/uploads/2023/10/IMG_20211123_145125-scaled.jpg',
            ],
            'Riam Barajang dan Riam Hanai' => [
                'description' => 'Jeram sungai berbatu dan air terjun kembar di aliran hulu sungai Amandit yang asri.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sungai_Amandit_di_Loksado.jpg/1280px-Sungai_Amandit_di_Loksado.jpg',
            ],
            'Balai Adat Malaris' => [
                'description' => 'Pusat kebudayaan dan ritual adat suku Dayak Meratus (Aruh Bahanan / Aruh Ganal), rumah panggung tradisional ulin.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Balai_adat_Urui_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg/1280px-Balai_adat_Urui_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg',
            ],
            'Bukit Langara' => [
                'description' => 'Gugusan bukit karst batu kapur dengan panorama spektakuler bentang alam sungai Amandit dan belantara rimba Meratus.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Panorama_Bukit_Batu_Lengara_Loksado_di_Kabupaten_Hulu_Sungai_Selatan%2C_Kalimantan_Selatan.jpg',
            ],
            'Wisata Sungai Pariangan' => [
                'description' => 'Kawasan pemandian dan arung sungai keluarga dengan bebatuan alami di Padang Batung.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Sungai_Amandit_Loksado_2.jpg/1280px-Sungai_Amandit_Loksado_2.jpg',
            ],
            'Bukit Batu Laki' => [
                'description' => 'Puncak perbukitan legendaris dengan lanskap batuan karst dan situs sejarah perjuangan rakyat Hulu Sungai.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Panorama_di_atas_Bukit_Langara.jpg/1280px-Panorama_di_atas_Bukit_Langara.jpg',
            ],
            'Kalang Hadangan' => [
                'description' => 'Wisata fenomena kerbau rawa berenang khas lahan basah Daha Utara dan susur rawa Danau Bangkau.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Water_buffalo_bathing_with_water_reflection_at_golden_hour_in_Don_Det_Laos.jpg/1280px-Water_buffalo_bathing_with_water_reflection_at_golden_hour_in_Don_Det_Laos.jpg',
            ],
            'Bukit Batu Baduduk' => [
                'description' => 'Gugusan batu unik berundak di perbukitan Telaga Langsat dengan panorama perladangan hijau.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Pegunungan_Meratus_001.jpg/1280px-Pegunungan_Meratus_001.jpg',
            ],
            'Situs Pemandangan' => [
                'description' => 'Gardu pandang panorama lembah Loksado dan bentang Pegunungan Meratus dari ketinggian.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/a/af/Pemandangan_Sungai_Loksado.jpg',
            ],
            'River Tubing Loksado' => [
                'description' => 'Sensasi arung jeram menggunakan ban dalam karet menyusuri arus riam sungai Amandit.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Balanting_di_tengah_Sungai_Amandit_Loksado.jpg/1280px-Balanting_di_tengah_Sungai_Amandit_Loksado.jpg',
            ],
            'Air Terjun Mandin Mangapan' => [
                'description' => 'Air terjun bertingkat eksotis dengan aliran air deras di tengah hutan perawan Loksado.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Mandin_Putri_Kembar_001.jpg/1280px-Mandin_Putri_Kembar_001.jpg',
            ],
            'Air Terjun Rampah Menjangan' => [
                'description' => 'Air terjun tersembunyi dengan vegetasi hutan lumut dan udara sejuk pegunungan.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Mandin_Putri_Kembar_002.jpg/1280px-Mandin_Putri_Kembar_002.jpg',
            ],
            'Air Terjun Tinggiran Hayam' => [
                'description' => 'Air terjun bertingkat dengan kolam alami yang dikelilingi tebing bebatuan purba.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Air_Terjun_Tumpang_Dua_001.jpg/1280px-Air_Terjun_Tumpang_Dua_001.jpg',
            ],
            'Puncak Bukit Batu Butahal' => [
                'description' => 'Spot pendakian ringan dengan panorama matahari terbit berkabut di atas lembah Meratus.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Tagur_Hantu_Area.jpg/1280px-Tagur_Hantu_Area.jpg',
            ],
            'Air Terjun Tinggiran Mawang' => [
                'description' => 'Air terjun alami dengan debit air deras di kawasan pedalaman Loksado.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Air_Terjun_Bajuin.jpg/1280px-Air_Terjun_Bajuin.jpg',
            ],
            'Masjid As-Suada (Wassah Hilir)' => [
                'description' => 'Cagar budaya masjid bersejarah berarsitektur kayu ulin khas Banjar tertua di Kalimantan Selatan.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Masjid_Ba%27angkat_2.jpg/1280px-Masjid_Ba%27angkat_2.jpg',
            ],
            'Makam Datu Kandang Haji' => [
                'description' => 'Wisata ziarah dan cagar budaya makam ulama pejuang penyebar agama Islam di Bumi Antaludin.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Datu_Kandang_Haji_-_Makam.jpg/1280px-Datu_Kandang_Haji_-_Makam.jpg',
            ],
            'Pemandian Alami Tirta Alam (Batu Bini)' => [
                'description' => 'Pemandian mata air alami di kaki bukit batu kapur dengan aliran air pegunungan yang sangat jernih.',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Sungai_Amandit_Loksado.jpg/1280px-Sungai_Amandit_Loksado.jpg',
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
                    'image_url'   => $details['image_url'] ?? null,
                    'image_thumb_url' => null,
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

        // 5. Seed Facilities (Akomodasi, Kuliner, Masjid, SPBU di seluruh koridor Hulu Sungai Selatan)
        $facilities = [
            // Koridor Loksado & Geopark Meratus
            [
                'name' => 'Wisma Pemandian Air Panas Tanuhi',
                'type' => 'penginapan',
                'latitude' => -2.7789,
                'longitude' => 115.4265,
                'rating' => 4.6,
                'address' => 'Kompleks Wisata Air Panas, Desa Hulu Banyu, Kec. Loksado',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kolam_Wisata_Air_Panas_Tanuhi.jpg/1280px-Kolam_Wisata_Air_Panas_Tanuhi.jpg',
            ],
            [
                'name' => 'Lodge Alam Meratus Loksado',
                'type' => 'penginapan',
                'latitude' => -2.7935,
                'longitude' => 115.4420,
                'rating' => 4.7,
                'address' => 'Tepi Sungai Amandit, Desa Loksado, Kec. Loksado',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg/1280px-Keindahan_Balanting_di_Sungai_Amandit_Loksado.jpg',
            ],
            [
                'name' => 'Meratus Resort & Mountain Homestay',
                'type' => 'penginapan',
                'latitude' => -2.7915,
                'longitude' => 115.4450,
                'rating' => 4.5,
                'address' => 'Jl. Poros Loksado - Loklahung, Kec. Loksado',
                'image_url' => null,
            ],
            [
                'name' => 'Haratai Eco Homestay',
                'type' => 'penginapan',
                'latitude' => -2.7910,
                'longitude' => 115.4845,
                'rating' => 4.8,
                'address' => 'Kawasan Hutan Lindung Desa Haratai, Kec. Loksado',
                'image_url' => null,
            ],
            [
                'name' => 'Warung Selera Meratus Loksado',
                'type' => 'kuliner',
                'latitude' => -2.7928,
                'longitude' => 115.4415,
                'rating' => 4.5,
                'address' => 'Dekat Jembatan Gantung Loksado, Kec. Loksado',
                'image_url' => null,
            ],
            [
                'name' => 'Kantin Rest Area Riam Barajang',
                'type' => 'kuliner',
                'latitude' => -2.7848,
                'longitude' => 115.4492,
                'rating' => 4.4,
                'address' => 'Bantaran Riam Barajang, Desa Loklahung, Kec. Loksado',
                'image_url' => null,
            ],
            [
                'name' => 'Musholla Al-Ikhlas Loksado',
                'type' => 'masjid',
                'latitude' => -2.7930,
                'longitude' => 115.4408,
                'rating' => 4.8,
                'address' => 'Pusat Desa Loksado, Kec. Loksado',
                'image_url' => null,
            ],
            [
                'name' => 'Pertashop & Mini Fuel Loksado',
                'type' => 'spbu',
                'latitude' => -2.7905,
                'longitude' => 115.4380,
                'rating' => 4.3,
                'address' => 'Jl. Laksamana Udara Suryadarma, Loksado',
                'image_url' => null,
            ],

            // Koridor Padang Batung & Batu Bini
            [
                'name' => 'Rest Area & Warung Sungai Pariangan',
                'type' => 'kuliner',
                'latitude' => -2.7410,
                'longitude' => 115.3692,
                'rating' => 4.6,
                'address' => 'Bantaran Sungai Amandit, Desa Batu Bini, Kec. Padang Batung',
                'image_url' => null,
            ],
            [
                'name' => 'Warung Ikan Bakar Tradisional Padang Batung',
                'type' => 'kuliner',
                'latitude' => -2.7460,
                'longitude' => 115.3610,
                'rating' => 4.5,
                'address' => 'Jl. Raya Padang Batung, HSS',
                'image_url' => null,
            ],
            [
                'name' => 'Homestay Alam Lembah Batu Laki',
                'type' => 'penginapan',
                'latitude' => -2.7485,
                'longitude' => 115.3560,
                'rating' => 4.4,
                'address' => 'Kaki Bukit Batu Laki, Kec. Padang Batung',
                'image_url' => null,
            ],
            [
                'name' => 'Masjid Jami Al-Hidayah Padang Batung',
                'type' => 'masjid',
                'latitude' => -2.7440,
                'longitude' => 115.3630,
                'rating' => 4.9,
                'address' => 'Pusat Kecamatan Padang Batung, HSS',
                'image_url' => null,
            ],
            [
                'name' => 'SPBU Padang Batung',
                'type' => 'spbu',
                'latitude' => -2.7520,
                'longitude' => 115.3510,
                'rating' => 4.5,
                'address' => 'Jl. Brigjen H. Hasan Basry, Padang Batung',
                'image_url' => null,
            ],

            // Koridor Pusat Kota Kandangan
            [
                'name' => 'Hotel Rakat Mupakat Kandangan',
                'type' => 'penginapan',
                'latitude' => -2.7760,
                'longitude' => 115.2645,
                'rating' => 4.5,
                'address' => 'Jl. Pangeran Antasari No. 12, Kandangan Kota',
                'image_url' => null,
            ],
            [
                'name' => 'Wisma Duta Syariah Kandangan',
                'type' => 'penginapan',
                'latitude' => -2.7725,
                'longitude' => 115.2610,
                'rating' => 4.4,
                'address' => 'Jl. Jenderal Sudirman, Kandangan Barat',
                'image_url' => null,
            ],
            [
                'name' => 'Warung Ketupat Kandangan Pak Haji',
                'type' => 'kuliner',
                'latitude' => -2.7750,
                'longitude' => 115.2642,
                'rating' => 4.9,
                'address' => 'Jl. Jenderal Sudirman, Kandangan Kota (Spesialis Iwak Haruan Asap)',
                'image_url' => null,
            ],
            [
                'name' => 'Warung Ketupat Kandangan Nanang',
                'type' => 'kuliner',
                'latitude' => -2.7738,
                'longitude' => 115.2635,
                'rating' => 4.8,
                'address' => 'Kawasan Pasar Los Batu Kandangan',
                'image_url' => null,
            ],
            [
                'name' => 'Sentra Kuliner Dodol Asli Kandangan',
                'type' => 'kuliner',
                'latitude' => -2.7712,
                'longitude' => 115.2618,
                'rating' => 4.7,
                'address' => 'Pusat Oleh-Oleh Khas Dodol Kandangan, Jl. A. Yani',
                'image_url' => null,
            ],
            [
                'name' => 'Masjid Agung As-Syuhada Kandangan',
                'type' => 'masjid',
                'latitude' => -2.7745,
                'longitude' => 115.2630,
                'rating' => 4.9,
                'address' => 'Alun-Alun Antaludin, Pusat Kota Kandangan',
                'image_url' => null,
            ],
            [
                'name' => 'SPBU Hamalau Kandangan',
                'type' => 'spbu',
                'latitude' => -2.7788,
                'longitude' => 115.2665,
                'rating' => 4.5,
                'address' => 'Jl. A. Yani KM 2.5 Hamalau, Kandangan',
                'image_url' => null,
            ],

            // Koridor Daha (Rawa Bangkau / Nagara) & Simpur
            [
                'name' => 'Dermaga & Sentra Iwak Baung Bangkau',
                'type' => 'kuliner',
                'latitude' => -2.6860,
                'longitude' => 115.1965,
                'rating' => 4.6,
                'address' => 'Tepi Danau Bangkau, Kec. Kandangan Barat / Pahaungan',
                'image_url' => null,
            ],
            [
                'name' => 'Masjid Kuno As-Suada (Masjid Baangkat)',
                'type' => 'masjid',
                'latitude' => -2.7151,
                'longitude' => 115.2289,
                'rating' => 4.9,
                'address' => 'Desa Wasah Hilir, Kec. Simpur (Cagar Budaya Ulin Tertua)',
                'image_url' => null,
            ],
            [
                'name' => 'Pertashop Nagara Daha',
                'type' => 'spbu',
                'latitude' => -2.6840,
                'longitude' => 115.1940,
                'rating' => 4.4,
                'address' => 'Jl. Poros Negara - Kandangan, Daha Selatan',
                'image_url' => null,
            ],
        ];

        foreach ($facilities as $fac) {
            Facility::updateOrCreate(['name' => $fac['name']], $fac);
        }

        \Illuminate\Support\Facades\Cache::flush();
    }
}