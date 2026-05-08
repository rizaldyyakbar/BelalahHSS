<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->string('image_thumb_url', 255)->nullable()->after('image_url');
        });

        Schema::table('facilities', function (Blueprint $table) {
            $table->string('image_thumb_url', 255)->nullable()->after('image_url');
        });
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn('image_thumb_url');
        });

        Schema::table('facilities', function (Blueprint $table) {
            $table->dropColumn('image_thumb_url');
        });
    }
};