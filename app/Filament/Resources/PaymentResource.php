<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentResource\Pages;
use App\Filament\Resources\PaymentResource\RelationManagers;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Model;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationGroup = 'Transaction Management';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('pelanggan_id')
                    ->relationship('pelanggan', 'name')
                    ->required(),
                Forms\Components\TextInput::make('total_amount')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                Forms\Components\FileUpload::make('payment_proof')
                    ->image()
                    ->disk('public')
                    ->directory('payment-proofs')
                    ->visibility('public')
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                    ])
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with('carts.menu'))
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->label('Order Number'),
                Tables\Columns\TextColumn::make('pelanggan.name')
                    ->searchable()
                    ->sortable()
                    ->label('Customer'),
                Tables\Columns\TextColumn::make('carts')
                    ->label('Ordered Items')
                    ->listWithLineBreaks()
                    ->getStateUsing(function (Payment $record): array {
                        return $record->carts->map(function ($cart) {
                            return "{$cart->menu->name} (x{$cart->quantity}) - Rp " . 
                                number_format($cart->price * $cart->quantity, 0, ',', '.');
                        })->toArray();
                    })
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('carts.menu', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                    }),
                Tables\Columns\TextColumn::make('total_amount')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\ImageColumn::make('payment_proof')
                    ->disk('public')
                    ->square()
                    ->defaultImageUrl('/images/placeholder.png')
                    ->visibility('public'),
                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                    ])
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Payment Date'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make()
                    ->form([
                        Forms\Components\Section::make('Order Details')
                            ->schema([
                                Forms\Components\Repeater::make('carts')
                                    ->relationship('carts')
                                    ->schema([
                                        Forms\Components\Select::make('menu_id')
                                            ->relationship('menu', 'name')
                                            ->label('Menu')
                                            ->disabled(),
                                        Forms\Components\TextInput::make('quantity')
                                            ->disabled(),
                                        Forms\Components\TextInput::make('price')
                                            ->disabled()
                                            ->prefix('Rp')
                                            ->formatStateUsing(fn (string $state): string => number_format((int) $state, 0, ',', '.'))
                                            ->numeric(),
                                        Forms\Components\TextInput::make('subtotal')
                                            ->label('Subtotal')
                                            ->disabled()
                                            ->prefix('Rp')
                                            ->formatStateUsing(function ($state, $record): string {
                                                return number_format($record->price * $record->quantity, 0, ',', '.');
                                            })
                                            ->numeric(),
                                    ])
                                    ->disabled()
                                    ->columnSpanFull()
                                    ->columns(4),
                                Forms\Components\TextInput::make('total_amount')
                                    ->label('Total Amount')
                                    ->disabled()
                                    ->prefix('Rp')
                                    ->formatStateUsing(fn (string $state): string => number_format((int) $state, 0, ',', '.'))
                                    ->numeric(),
                                Forms\Components\FileUpload::make('payment_proof')
                                    ->label('Payment Proof')
                                    ->disabled()
                                    ->image()
                                    ->columnSpanFull(),
                            ])
                    ]),
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
            RelationManagers\CartsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPayments::route('/'),
            'create' => Pages\CreatePayment::route('/create'),
            'edit' => Pages\EditPayment::route('/{record}/edit'),
        ];
    }
}
