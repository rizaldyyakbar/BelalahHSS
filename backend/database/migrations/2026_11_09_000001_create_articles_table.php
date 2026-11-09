<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('read_time')->default('4 mnt');
            $table->text('snippet');
            $table->json('content');
            $table->string('image_url')->nullable();
            $table->string('author')->default('Tim Peneliti Belalah HSS');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
