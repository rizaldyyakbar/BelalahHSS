<?php

namespace App\Filament\Resources\Categories\RelationManagers;

use App\Filament\Resources\Destinations\DestinationResource;
use Filament\Resources\RelationManagers\RelationManager;

class DestinationsRelationManager extends RelationManager
{
    protected static string $relationship = 'destinations';

    protected static ?string $relatedResource = DestinationResource::class;
}