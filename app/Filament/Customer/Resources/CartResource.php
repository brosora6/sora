<?php

namespace App\Filament\Customer\Resources;

use App\Filament\Customer\Resources\CartResource\Pages;
use App\Models\Cart;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class CartResource extends Resource
{
    protected static ?string $model = Cart::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $navigationLabel = 'My Cart';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('total_price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->disabled(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('menu.name')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('menu.gambar'),
                Tables\Columns\TextColumn::make('total_price')
                    ->money('IDR')
                    ->sortable(),
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
                    Tables\Actions\BulkAction::make('checkout')
                        ->label('Checkout')
                        ->icon('heroicon-o-credit-card')
                        ->form([
                            Forms\Components\TextInput::make('bank')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('no_bank')
                                ->required()
                                ->maxLength(255)
                                ->label('Account Number'),
                        ])
                        ->action(function (array $data): void {
                            $carts = Cart::query()
                                ->where('pelanggan_id', Auth::guard('customer')->id())
                                ->get();
                            
                            $total = $carts->sum('total_price');
                            
                            // Create payment record
                            Payment::create([
                                'pelanggan_id' => Auth::guard('customer')->id(),
                                'bank' => $data['bank'],
                                'no_bank' => $data['no_bank'],
                                'total_price' => $total,
                                'status' => 'pending',
                                'tanggal' => now(),
                            ]);
                            
                            // Clear cart
                            $carts->each->delete();
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
        ];
    }
    
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('pelanggan_id', Auth::guard('customer')->id());
    }
} 