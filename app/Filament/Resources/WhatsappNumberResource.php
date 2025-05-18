<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WhatsappNumberResource\Pages;
use App\Models\WhatsappNumber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WhatsappNumberResource extends Resource
{
    protected static ?string $model = WhatsappNumber::class;

    protected static ?string $navigationIcon = 'heroicon-o-phone';

    protected static ?string $navigationGroup = 'Settings';

    protected static ?string $modelLabel = 'WhatsApp Number';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('number')
                    ->required()
                    ->maxLength(255)
                    ->label('WhatsApp Number')
                    ->placeholder('Example: +6281234567890')
                    ->helperText('Enter the WhatsApp number with country code (e.g., +62 for Indonesia)'),
                Forms\Components\TextInput::make('name')
                    ->maxLength(255)
                    ->label('Name'),
                Forms\Components\Textarea::make('description')
                    ->maxLength(65535)
                    ->label('Description'),
                Forms\Components\Toggle::make('is_active')
                    ->required()
                    ->label('Active'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('number')
                    ->searchable()
                    ->label('WhatsApp Number'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->label('Name'),
                Tables\Columns\TextColumn::make('description')
                    ->searchable()
                    ->label('Description'),
                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWhatsappNumbers::route('/'),
            'create' => Pages\CreateWhatsappNumber::route('/create'),
            'edit' => Pages\EditWhatsappNumber::route('/{record}/edit'),
        ];
    }
} 