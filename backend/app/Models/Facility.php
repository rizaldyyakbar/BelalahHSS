<?php

namespace App\Models;

use App\Jobs\ProcessModelImageThumbnail;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'type',
        'latitude',
        'longitude',
        'rating',
        'address',
        'image_url',
        'image_thumb_url',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:1',
    ];

    protected static function booted(): void
    {
        static::saved(function (self $facility): void {
            if (! $facility->wasChanged('image_url')) {
                return;
            }

            if (! is_string($facility->image_url) || $facility->image_url === '') {
                $facility->forceFill(['image_thumb_url' => null])->saveQuietly();

                return;
            }

            ProcessModelImageThumbnail::dispatch(
                self::class,
                $facility->id,
                'image_url',
                'image_thumb_url',
                'public',
            );
        });
    }
}
