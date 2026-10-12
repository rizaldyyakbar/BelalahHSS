<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'image_url',
    ];

    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class);
    }

    public function destinationCount(): int
    {
        return $this->destinations()->count();
    }
}
