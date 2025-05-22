<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Filament\Tables\Filters\SelectFilter;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationGroup = 'Restaurant Management';
    protected static ?int $navigationSort = 2;
    protected static ?string $pluralModelLabel = 'Categories';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Category Details')
                    ->description('Create or edit category information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->minLength(3)
                            ->regex('/^[a-zA-Z0-9\s\-]+$/')
                            ->validationMessages([
                                'required' => 'The category name is required.',
                                'min' => 'The category name must be at least 3 characters.',
                                'max' => 'The category name cannot exceed 255 characters.',
                                'regex' => 'The category name can only contain letters, numbers, spaces, and hyphens.',
                            ])
                            ->helperText('Enter a unique category name (3-255 characters)')
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                if ($operation !== 'create') {
                                    return;
                                }
                
                                $set('slug', Str::slug($state));
                            }),
                        Forms\Components\TextInput::make('slug')
                            ->disabled()
                            ->dehydrated()
                            ->required()
                            ->maxLength(255)
                            ->unique(Category::class, 'slug', ignoreRecord: true)
                            ->validationMessages([
                                'required' => 'The slug is required.',
                                'unique' => 'This slug is already in use.',
                                'max' => 'The slug cannot exceed 255 characters.',
                            ])
                            ->helperText('The slug will be automatically generated from the category name'),
                        Forms\Components\Textarea::make('description')
                            ->maxLength(500)
                            ->validationMessages([
                                'max' => 'The description cannot exceed 500 characters.',
                            ])
                            ->helperText('Optional: Add a description for this category (max 500 characters)')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\TextColumn::make('menus_count')
                    ->counts('menus')
                    ->label('Total Menu Items')
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
                SelectFilter::make('has_menus')
                    ->label('Menu Status')
                    ->options([
                        'with_menus' => 'With Menu Items',
                        'without_menus' => 'Without Menu Items',
                    ])
                    ->query(function ($query, $data) {
                        if ($data['value'] === 'with_menus') {
                            return $query->whereHas('menus');
                        }
                        if ($data['value'] === 'without_menus') {
                            return $query->whereDoesntHave('menus');
                        }
                        return $query;
                    })
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function (Category $record) {
                        // Prevent deletion if category has menus
                        if ($record->menus()->count() > 0) {
                            return false;
                        }
                    })
                    ->successNotification(
                        notification: function (Category $record): ?Notification {
                            return Notification::make()
                                ->success()
                                ->title('Category Deleted')
                                ->body('The category has been deleted successfully.');
                        }
                    ),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->before(function ($records) {
                            // Only allow deletion of categories without menus
                            foreach ($records as $record) {
                                if ($record->menus()->count() > 0) {
                                    return false;
                                }
                            }
                        }),
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
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
            'view' => Pages\ViewCategory::route('/{record}'),
        ];
    }
} 