<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("CREATE EXTENSION IF NOT EXISTS postgis");
                DB::statement("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS location geography(Point,4326)");
                DB::statement("UPDATE destinations SET location = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326) WHERE longitude IS NOT NULL AND latitude IS NOT NULL");
                DB::statement("CREATE INDEX IF NOT EXISTS destinations_location_gist ON destinations USING GIST (location)");
            } catch (\Throwable $e) {
                // Jika server Postgres tidak memiliki binary PostGIS terpasang, jangan gagalkan migrasi.
                // Aplikasi Belalah HSS otomatis fallback menggunakan koordinat latitude/longitude dengan rumus Haversine.
                \Illuminate\Support\Facades\Log::warning("Ekstensi PostGIS belum tersedia di server PostgreSQL ini. Melewati kolom spasial: " . $e->getMessage());
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("DROP INDEX IF EXISTS destinations_location_gist");
                DB::statement("ALTER TABLE destinations DROP COLUMN IF EXISTS location");
            } catch (\Throwable $e) {
                // Ignore jika belum ada
            }
        }
    }
};
