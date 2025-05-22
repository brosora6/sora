<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CartResource\Pages;
use App\Filament\Resources\CartResource\RelationManagers;
use App\Models\Cart;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CartResource extends Resource
{
    protected static ?string $model = Cart::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Transaction Management';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('pelanggan_id')
                    ->relationship('pelanggan', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->validationMessages([
                        'required' => 'Please select a customer.',
                    ])
                    ->helperText('Select the customer for this cart'),
                
                Forms\Components\Select::make('menu_id')
                    ->relationship('menu', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->live()
                    ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                        if ($state) {
                            $menu = \App\Models\Menu::find($state);
                            if ($menu) {
                                $quantity = $get('quantity') ?? 1;
                                $totalPrice = $menu->price * $quantity;
                                $set('price', $totalPrice);
                            }
                        }
                    }),
                
                Forms\Components\TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(99)
                    ->integer()
                    ->live()
                    ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                        $menuId = $get('menu_id');
                        if ($menuId && $state) {
                            $menu = \App\Models\Menu::find($menuId);
                            if ($menu) {
                                $totalPrice = $menu->price * $state;
                                $set('price', $totalPrice);
                            }
                        }
                    }),
                
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->disabled()
                    ->dehydrated()
                    ->helperText('Total price will be calculated automatically based on menu price and quantity'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('pelanggan.name')
                    ->searchable()
                    ->sortable()
                    ->label('Customer'),
                Tables\Columns\TextColumn::make('menu.name')
                    ->searchable()
                    ->sortable()
                    ->label('Menu Item'),
                Tables\Columns\TextColumn::make('quantity')
                    ->numeric()
                    ->sortable()
                    ->label('Quantity'),
                Tables\Columns\TextColumn::make('price')
                    ->money('IDR')
                    ->sortable()
                    ->label('Total Price'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y H:i:s')
                    ->timezone('Asia/Jakarta')
                    ->sortable()
                    ->label('Added Date'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('menu')
                    ->relationship('menu', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Filter by Menu'),
                Tables\Filters\SelectFilter::make('pelanggan')
                    ->relationship('pelanggan', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Filter by Customer'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->before(function (Cart $record) {
                        // Check if the menu is still available
                        if (!$record->menu || $record->menu->stok < $record->quantity) {
                            throw new \Exception('The selected menu item is no longer available in the requested quantity.');
                        }
                    }),
                Tables\Actions\DeleteAction::make()
                    ->before(function (Cart $record) {
                        // Check if the cart item is part of a completed payment
                        if ($record->payment && $record->payment->status === 'completed') {
                            throw new \Exception('Cannot delete cart items from completed payments.');
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->before(function ($records) {
                            foreach ($records as $record) {
                                if ($record->payment && $record->payment->status === 'completed') {
                                    throw new \Exception('Cannot delete cart items from completed payments.');
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
            'index' => Pages\ListCarts::route('/'),
            'create' => Pages\CreateCart::route('/create'),
            'edit' => Pages\EditCart::route('/{record}/edit'),
        ];
    }
}
