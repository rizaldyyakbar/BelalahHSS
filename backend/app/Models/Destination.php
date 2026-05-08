<?php

namespace App\Models;

use App\Jobs\ProcessModelImageThumbnail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    }
}
