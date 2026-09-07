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

    /**
     * Seed the application's database with authentic HSS Tourism Data.
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
            'kuliner' => 'Kuliner',
        ];

        foreach ($categories as $slug => $name) {
            Category::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name],
            );
        }

        $categoryWisataAlam = Category::where('slug', 'wisata-alam')->first();
        $categoryWisataBudaya = Category::where('slug', 'wisata-budaya')->first();

        // 12 Authentic Tourism Destinations from Hulu Sungai Selatan Data
        $destinations = [
            [
                'name' => 'Air Terjun Haratai',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Objek wisata air terjun alami skala besar pada kawasan hutan lindung, dilengkapi perkebunan kayu manis dan peternakan madu kelulut.',
                'latitude' => -2.76670000,
                'longitude' => 115.35000000,
                'image_url' => 'Air-Terjun-Haratai.jpg',
                'address' => 'Desa Haratai, Kecamatan Loksado',
                'popularitas' => 88,
                'price' => 10,
                'fasilitas' => 80,
                'kebersihan' => 85,
            ],
            [
                'name' => 'Bamboo Rafting Loksado',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Festival Loksado (bamboo rafting), susur sungai Amandit mengarungi jeram dengan rakit bambu tradisional.',
                'latitude' => -2.78330000,
                'longitude' => 115.33330000,
                'image_url' => 'balanting-paring.jpg',
                'address' => 'Desa Loksado, Kecamatan Loksado',
                'popularitas' => 95,
                'price' => 300,
                'fasilitas' => 75,
                'kebersihan' => 85,
            ],
            [
                'name' => 'Objek Wisata Air Panas Tanuhi',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kolam air panas alami untuk dewasa dan anak-anak, kolam air dingin, cottage untuk menginap berkonsep nature park.',
                'latitude' => -2.78750000,
                'longitude' => 115.31670000,
                'image_url' => 'tanuhi.jpg',
                'address' => 'Desa Hulu Banyu, Kecamatan Loksado',
                'popularitas' => 82,
                'price' => 5,
                'fasilitas' => 88,
                'kebersihan' => 84,
            ],
            [
                'name' => 'Air Terjun Kilap Api',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kawasan air terjun alami bertingkat dengan pemandangan asri.',
                'latitude' => -2.77500000,
                'longitude' => 115.32000000,
                'image_url' => null,
                'address' => 'Desa Hulu Banyu, Kecamatan Loksado',
                'popularitas' => 75,
                'price' => 5,
                'fasilitas' => 70,
                'kebersihan' => 80,
            ],
            [
                'name' => 'Riam Barajang dan Riam Hanai',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kawasan Air Terjun Alami & jeram sungai di kawasan Loksado.',
                'latitude' => -2.78000000,
                'longitude' => 115.32500000,
                'image_url' => null,
                'address' => 'Desa Loklahung, Kecamatan Loksado',
                'popularitas' => 78,
                'price' => 5,
                'fasilitas' => 68,
                'kebersihan' => 78,
            ],
            [
                'name' => 'Balai Adat Malaris',
                'category_id' => $categoryWisataBudaya?->id,
                'description' => 'Balai Ritual Adat Dayak Meratus (Aruh Bahanan / Aruh Ganal), Gapura Identitas, dan area kebudayaan.',
                'latitude' => -2.78200000,
                'longitude' => 115.32800000,
                'image_url' => 'museum-rakyat.jpg',
                'address' => 'Desa Loklahung, Kecamatan Loksado',
                'popularitas' => 85,
                'price' => 0,
                'fasilitas' => 72,
                'kebersihan' => 88,
            ],
            [
                'name' => 'Bukit Langara',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kawasan Geopark bukit batuan geofolit alami, Fun Tracking Festival Loksado.',
                'latitude' => -2.79170000,
                'longitude' => 115.31250000,
                'image_url' => 'langara.jpg',
                'address' => 'Desa Lumpangi, Kecamatan Loksado',
                'popularitas' => 90,
                'price' => 5,
                'fasilitas' => 75,
                'kebersihan' => 85,
            ],
            [
                'name' => 'Wisata Sungai Pariangan',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kawasan Puncak Bukit Alami dan aliran sungai jernih Pariangan.',
                'latitude' => -2.74170000,
                'longitude' => 115.18330000,
                'image_url' => null,
                'address' => 'Desa Batu Bini, Kecamatan Padang Batung',
                'popularitas' => 72,
                'price' => 5,
                'fasilitas' => 65,
                'kebersihan' => 75,
            ],
            [
                'name' => 'Bukit Batu Laki',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kawasan Gunung Batu Alami dengan panorama hiking dan climbing track.',
                'latitude' => -2.73330000,
                'longitude' => 115.17500000,
                'image_url' => null,
                'address' => 'Desa Batu Laki, Kecamatan Padang Batung',
                'popularitas' => 76,
                'price' => 5,
                'fasilitas' => 64,
                'kebersihan' => 76,
            ],
            [
                'name' => 'Kalang Hadangan',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Wisata fenomena kerbau rawa berenang dan susur sungai Nagara.',
                'latitude' => -2.65000000,
                'longitude' => 115.08330000,
                'image_url' => null,
                'address' => 'Desa Pandak Daun, Kecamatan Daha Utara',
                'popularitas' => 86,
                'price' => 0,
                'fasilitas' => 70,
                'kebersihan' => 82,
            ],
            [
                'name' => 'Bukit Batu Baduduk',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Kawasan Puncak Bukit Alami dengan pemandangan sunrise dan perbukitan.',
                'latitude' => -2.72000000,
                'longitude' => 115.22000000,
                'image_url' => null,
                'address' => 'Desa Hamak, Kecamatan Telaga Langsat',
                'popularitas' => 74,
                'price' => 5,
                'fasilitas' => 60,
                'kebersihan' => 78,
            ],
            [
                'name' => 'Situs Pemandangan',
                'category_id' => $categoryWisataAlam?->id,
                'description' => 'Pemandangan lanskap Bukit Loksado dilengkapi spot foto, gazebo, dan tempat minum keping kopi.',
                'latitude' => -2.78500000,
                'longitude' => 115.31800000,
                'image_url' => null,
                'address' => 'Desa Hulu Banyu, Kecamatan Loksado',
                'popularitas' => 80,
                'price' => 2,
                'fasilitas' => 78,
                'kebersihan' => 82,
            ],
        ];

        foreach ($destinations as $data) {
            $pop = $data['popularitas'];
            $prc = $data['price'];
            $fas = $data['fasilitas'];
            $keb = $data['kebersihan'];
            unset($data['popularitas'], $data['price'], $data['fasilitas'], $data['kebersihan']);

            $dest = Destination::updateOrCreate(
                ['name' => $data['name']],
                $data
            );

            // Store values
            $this->seedValues($dest, $pop, $prc, $fas, $keb);
        }

        // Setup SAW Criteria
        $this->seedCriteria();
    }

    private function seedCriteria(): void
    {
        $criteria = [
            ['name' => 'Popularitas', 'weight' => 0.15, 'type' => 'benefit'],
            ['name' => 'Price', 'weight' => 0.20, 'type' => 'cost'],
            ['name' => 'Fasilitas', 'weight' => 0.40, 'type' => 'benefit'],
            ['name' => 'Kebersihan dan Keamanan', 'weight' => 0.25, 'type' => 'benefit'],
        ];

        foreach ($criteria as $c) {
            Criteria::updateOrCreate(['name' => $c['name']], $c);
        }
    }

    private function seedValues(Destination $dest, float $pop, float $prc, float $fas, float $keb): void
    {
        $cPop = Criteria::where('name', 'Popularitas')->first();
        $cPrc = Criteria::where('name', 'Price')->first();
        $cFas = Criteria::where('name', 'Fasilitas')->first();
        $cKeb = Criteria::where('name', 'Kebersihan dan Keamanan')->first();

        if ($cPop) DestinationValue::updateOrCreate(['destination_id' => $dest->id, 'criteria_id' => $cPop->id], ['value_score' => $pop]);
        if ($cPrc) DestinationValue::updateOrCreate(['destination_id' => $dest->id, 'criteria_id' => $cPrc->id], ['value_score' => $prc]);
        if ($cFas) DestinationValue::updateOrCreate(['destination_id' => $dest->id, 'criteria_id' => $cFas->id], ['value_score' => $fas]);
        if ($cKeb) DestinationValue::updateOrCreate(['destination_id' => $dest->id, 'criteria_id' => $cKeb->id], ['value_score' => $keb]);
    }
}
