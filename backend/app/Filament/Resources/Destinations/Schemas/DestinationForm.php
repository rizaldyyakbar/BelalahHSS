<?php

namespace App\Filament\Resources\Destinations\Schemas;

use Dotswan\MapPicker\Fields\Map;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;

class DestinationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name'),
                TextInput::make('name')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Map::make('location')
                    ->label('Pilih Lokasi di Peta (Map Picker)')
                    ->columnSpanFull()
                    ->defaultLocation(latitude: -2.7144, longitude: 115.2633)
                    ->zoom(13)
                    ->showMarker()
                    ->draggable()
                    ->clickable(true)
                    ->afterStateUpdated(function (Set $set, ?array $state): void {
                        if (is_array($state)) {
                            if (isset($state['lat'])) {
                                $set('latitude', $state['lat']);
                            }
                            if (isset($state['lng'])) {
                                $set('longitude', $state['lng']);
                            }
                        }
                    })
                    ->afterStateHydrated(function (Set $set, $record): void {
                        if ($record && $record->latitude && $record->longitude) {
                            $set('location', [
                                'lat' => (float) $record->latitude,
                                'lng' => (float) $record->longitude,
                            ]);
                        }
                    }),
                TextInput::make('latitude')
                    ->required()
                    ->numeric()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (Get $get, Set $set, ?string $state): void {
                        $lng = $get('longitude');
                        if ($state !== null && $lng !== null) {
                            $set('location', ['lat' => (float) $state, 'lng' => (float) $lng]);
                        }
                    }),
                TextInput::make('longitude')
                    ->required()
                    ->numeric()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (Get $get, Set $set, ?string $state): void {
                        $lat = $get('latitude');
                        if ($state !== null && $lat !== null) {
                            $set('location', ['lat' => (float) $lat, 'lng' => (float) $state]);
                        }
                    }),
                FileUpload::make('image_url')
                    ->acceptedFileTypes([
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                    ])
                    ->maxSize(2048)
                    ->previewable(false)
                    ->fetchFileInformation(false)
                    ->disk('public')
                    ->directory('destinations'),
                Textarea::make('address')
                    ->columnSpanFull(),
            ]);
    }
}
