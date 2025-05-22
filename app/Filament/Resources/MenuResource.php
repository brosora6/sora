<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MenuResource\Pages;
use App\Filament\Resources\MenuResource\RelationManagers;
use App\Models\Menu;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Select;

class MenuResource extends Resource
{
    protected static ?string $model = Menu::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';
    protected static ?string $navigationGroup = 'Restaurant Management';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id'))
                    ->required()
                    ->searchable()
                    ->exists('categories', 'id')
                    ->validationMessages([
                        'exists' => 'The selected category does not exist.',
                    ]),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->minLength(3)
                    ->regex('/^[a-zA-Z0-9\s\-]+$/')
                    ->validationMessages([
                        'regex' => 'The name can only contain letters, numbers, spaces, and hyphens.',
                        'min' => 'The name must be at least 3 characters.',
                    ]),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->prefix('Rp')
                    ->step(100) // Minimum increment of 100
                    ->validationMessages([
                        'min' => 'The price cannot be negative.',
                        'numeric' => 'Please enter a valid number for the price.',
                        'required' => 'The price field is required.',
                    ])
                    ->helperText('Enter price in Rupiah (minimum increment: 100)'),
                Forms\Components\FileUpload::make('gambar')
                    ->image()
                    ->disk('public_store')
                    ->visibility('public')
                    ->imageEditor()
                    ->required()
                    ->maxSize(5120) // 5MB
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                    ->validationMessages([
                        'maxSize' => 'The image size should not exceed 5MB.',
                        'acceptedFileTypes' => 'Only JPG, JPEG, and PNG images are allowed.',
                    ]),
                Forms\Components\TextInput::make('stok')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->integer()
                    ->maxValue(99)
                    ->validationMessages([
                        'min' => 'The stock cannot be negative.',
                        'max' => 'The stock cannot exceed 99.',
                        'integer' => 'The stock must be a whole number.',
                        'numeric' => 'Please enter a valid number for the stock.',
                        'required' => 'The stock field is required.',
                    ])
                    ->helperText('Enter stock quantity (0-99)'),
                Forms\Components\Textarea::make('desc')
                    ->required()
                    ->minLength(10)
                    ->maxLength(1000)
                    ->columnSpanFull()
                    ->validationMessages([
                        'min' => 'The description must be at least 10 characters.',
                        'max' => 'The description cannot exceed 1000 characters.',
                    ]),
                Forms\Components\Toggle::make('is_recommended')
                    ->label('Show in Recommendations')
                    ->helperText('This menu will be shown in the recommended section on the home page')
                    ->default(false),
                Forms\Components\TextInput::make('total_purchased')
                    ->numeric()
                    ->default(0)
                    ->disabled()
                    ->dehydrated(false)
                    ->visible(fn (string $context): bool => $context === 'edit'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('gambar')
                    ->disk('public_store')
                    ->square()
                    ->defaultImageUrl('/images/placeholder.png')
                    ->visibility('public'),
                Tables\Columns\TextColumn::make('price')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stok')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_recommended')
                    ->sortable()
                    ->label('Recommended'),
                Tables\Columns\TextColumn::make('total_purchased')
                    ->numeric()
                    ->sortable()
                    ->label('Times Purchased'),
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
                Tables\Filters\TernaryFilter::make('is_recommended')
                    ->label('Recommended Status')
                    ->placeholder('All Menus')
                    ->trueLabel('Recommended Only')
                    ->falseLabel('Not Recommended'),
            ])
            ->defaultSort('total_purchased', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
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
            'index' => Pages\ListMenus::route('/'),
            'create' => Pages\CreateMenu::route('/create'),
            'edit' => Pages\EditMenu::route('/{record}/edit'),
        ];
    }
}
