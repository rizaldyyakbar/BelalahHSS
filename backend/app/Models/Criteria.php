<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Criteria extends Model
{
    protected $table = 'criteria';

    protected $fillable = [
        'name',
        'weight',
        'type',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
    ];

    public function destinationValues(): HasMany
    {
        return $this->hasMany(DestinationValue::class);
    }

    public function destinationValueCount(): int
    {
        return $this->destinationValues()->count();
    }

    protected static function booted(): void
    {
        static::saved(fn (): bool => static::invalidateRecommendationCache());
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
