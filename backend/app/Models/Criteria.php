<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
