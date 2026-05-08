<?php

namespace App\Filament\Resources\DestinationValues\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DestinationValueForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('destination_id')
                    ->relationship('destination', 'name')
                    ->required(),
                Select::make('criteria_id')
                    ->relationship('criteria', 'name')
                    ->required(),
                TextInput::make('value_score')
                    ->required()
                    ->numeric(),
            ]);
    }
}
