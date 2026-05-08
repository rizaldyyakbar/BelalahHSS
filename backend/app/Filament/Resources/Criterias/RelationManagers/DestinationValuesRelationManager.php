<?php

namespace App\Filament\Resources\Criterias\RelationManagers;

use App\Filament\Resources\DestinationValues\DestinationValueResource;
use Filament\Resources\RelationManagers\RelationManager;

class DestinationValuesRelationManager extends RelationManager
{
    protected static string $relationship = 'destinationValues';

    protected static ?string $relatedResource = DestinationValueResource::class;
}