<?php

namespace App\Filament\Resources\Criterias\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CriteriaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('weight')
                    ->required()
                    ->numeric(),
                Select::make('type')
                    ->options([
                        'benefit' => 'Benefit',
                        'cost' => 'Cost',
                    ])
                    ->required(),
            ]);
    }
}
