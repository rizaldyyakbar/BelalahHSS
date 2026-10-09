<?php

namespace App\Models;

use App\Jobs\ProcessModelImageThumbnail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class Destination extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'latitude',
        'longitude',
        'image_url',
        'image_thumb_url',
        'address',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function categoryName(): ?string
    {
        return $this->category?->name;
    }

    public function destinationValues(): HasMany
    {
        return $this->hasMany(DestinationValue::class);
    }

    protected static function booted(): void
    {
        static::saved(function (self $destination): void {
            if (DB::getDriverName() === 'pgsql' && $destination->latitude !== null && $destination->longitude !== null) {
                try {
                    DB::statement(
                        'UPDATE destinations SET location = ST_SetSRID(ST_MakePoint(?, ?), 4326) WHERE id = ?',
                        [(float) $destination->longitude, (float) $destination->latitude, $destination->id]
                    );
                } catch (\Throwable $e) {
                    // Safe fallback jika ekstensi PostGIS atau kolom location belum tersedia
                }

                static::invalidateRecommendationCache();
            }
        
            if (! $destination->wasChanged('image_url')) {
                return;
            }

            if (! is_string($destination->image_url) || $destination->image_url === '') {
                $destination->forceFill(['image_thumb_url' => null])->saveQuietly();

                return;
            }

            ProcessModelImageThumbnail::dispatch(
                self::class,
                $destination->id,
                'image_url',
                'image_thumb_url',
                'public',
            );
        });

        static::deleted(fn (): bool => static::invalidateRecommendationCache());
    }

    private static function invalidateRecommendationCache(): bool
    {
        Cache::forget('criteria_list_v2');

        if (! Cache::add('recommendation_cache_version', 1)) {
            Cache::increment('recommendation_cache_version');
        }

        return true;
    }
}
