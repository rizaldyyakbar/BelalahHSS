<?php

namespace App\Filament\Resources\DestinationValues\Pages;

use App\Filament\Resources\DestinationValues\DestinationValueResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDestinationValue extends EditRecord
{
    protected static string $resource = DestinationValueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
