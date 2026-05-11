<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class DestinationValue extends Model
{
    protected $fillable = [
        'destination_id',
        'criteria_id',
        'value_score',
    ];

    protected $casts = [
        'value_score' => 'decimal:2',
    ];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function criteria(): BelongsTo
    {
        return $this->belongsTo(Criteria::class);
    }

    public function getLabelAttribute(): string
    {
        return sprintf('%s - %s', $this->destination?->name ?? 'Destination', $this->criteria?->name ?? 'Criteria');
    }

    public function title(): string
    {
        return $this->label;
    }

    protected static function booted(): void
    {
        static::saved(fn (): bool => static::invalidateRecommendationCache());
        static::deleted(fn (): bool => static::invalidateRecommendationCache());
    }

    private static function invalidateRecommendationCache(): bool
    {
        if (! Cache::add('recommendation_cache_version', 1)) {
            Cache::increment('recommendation_cache_version');
        }

        return true;
    }
}
