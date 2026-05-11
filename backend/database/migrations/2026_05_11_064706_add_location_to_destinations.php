<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
           // Ensure PostGIS extension exists. This requires that the DB user has
           // permission to create extensions (usually a superuser). If not,
           // run the CREATE EXTENSION command manually as a DB admin.
           DB::statement("CREATE EXTENSION IF NOT EXISTS postgis");

           DB::statement("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS location geography(Point,4326)");
           DB::statement("UPDATE destinations SET location = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326) WHERE longitude IS NOT NULL AND latitude IS NOT NULL");
           DB::statement("CREATE INDEX IF NOT EXISTS destinations_location_gist ON destinations USING GIST (location)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP INDEX IF EXISTS destinations_location_gist");
        DB::statement("ALTER TABLE destinations DROP COLUMN IF EXISTS location");
    }
};
