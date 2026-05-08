<?php

namespace App\Filament\Resources\DestinationValues\Pages;

use App\Filament\Resources\DestinationValues\DestinationValueResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDestinationValues extends ListRecords
{
    protected static string $resource = DestinationValueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
