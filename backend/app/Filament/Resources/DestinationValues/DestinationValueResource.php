<?php

namespace App\Filament\Resources\DestinationValues;

use App\Filament\Resources\DestinationValues\Pages\CreateDestinationValue;
use App\Filament\Resources\DestinationValues\Pages\EditDestinationValue;
use App\Filament\Resources\DestinationValues\Pages\ListDestinationValues;
use App\Filament\Resources\DestinationValues\Schemas\DestinationValueForm;
use App\Filament\Resources\DestinationValues\Tables\DestinationValuesTable;
use App\Models\DestinationValue;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DestinationValueResource extends Resource
{
    protected static ?string $model = DestinationValue::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return DestinationValueForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DestinationValuesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDestinationValues::route('/'),
            'create' => CreateDestinationValue::route('/create'),
            'edit' => EditDestinationValue::route('/{record}/edit'),
        ];
    }
}
