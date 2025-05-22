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
    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'WhatsApp Number';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('number')
                    ->required()
                    ->tel()
                    ->regex('/^[0-9+\-\s()]{10,15}$/')
                    ->validationMessages([
                        'required' => 'The WhatsApp number is required.',
                        'regex' => 'Please enter a valid WhatsApp number (10-15 digits).',
                    ])
                    ->helperText('Enter a valid WhatsApp number (e.g., +6281234567890)'),
                
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->minLength(3)
                    ->validationMessages([
                        'required' => 'The name is required.',
                        'min' => 'The name must be at least 3 characters.',
                        'max' => 'The name cannot exceed 255 characters.',
                    ]),
                
                Forms\Components\Textarea::make('description')
                    ->maxLength(500)
                    ->validationMessages([
                        'max' => 'The description cannot exceed 500 characters.',
                    ]),
                
                Forms\Components\Toggle::make('is_active')
                    ->label('Active Status')
                    ->helperText('Only one number can be active at a time')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('number')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status')
                    ->placeholder('All Numbers')
                    ->trueLabel('Active Only')
                    ->falseLabel('Inactive Only'),
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