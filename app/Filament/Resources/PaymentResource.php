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
use Illuminate\Support\Facades\Notification;

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
                Forms\Components\TextInput::make('order_number')
                    ->required()
                    ->default(fn () => 'ORD-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6)))
                    ->disabled()
                    ->dehydrated()
                    ->unique(ignoreRecord: true)
                    ->validationMessages([
                        'required' => 'Order number is required.',
                        'unique' => 'This order number already exists.',
                    ])
                    ->helperText('Order number will be generated automatically'),
                
                Forms\Components\Select::make('pelanggan_id')
                    ->relationship('pelanggan', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->exists('pelanggans', 'id')
                    ->validationMessages([
                        'required' => 'Please select a customer.',
                        'exists' => 'The selected customer does not exist.',
                    ])
                    ->helperText('Select the customer making the payment')
                    ->live(),
                
                Forms\Components\Select::make('bank_account_id')
                    ->relationship('bankAccount', 'bank_name')
                    ->required()
                    ->label('Bank Account')
                    ->searchable()
                    ->preload()
                    ->exists('bank_accounts', 'id')
                    ->validationMessages([
                        'required' => 'Please select a bank account.',
                        'exists' => 'The selected bank account does not exist.',
                    ])
                    ->helperText('Select the bank account for payment'),
                
                Forms\Components\Repeater::make('carts')
                    ->schema([
                        Forms\Components\Select::make('menu_id')
                            ->options(function () {
                                return \App\Models\Menu::where('status', 'active')
                                    ->pluck('name', 'id');
                            })
                            ->required()
                            ->searchable()
                            ->preload()
                            ->exists('menus', 'id')
                            ->validationMessages([
                                'required' => 'Please select a menu item.',
                                'exists' => 'The selected menu item does not exist.',
                            ])
                            ->live()
                            ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                                if ($state) {
                                    $menu = \App\Models\Menu::find($state);
                                    if ($menu) {
                                        $price = (int) $menu->price;
                                        $quantity = (int) ($get('quantity') ?? 1);
                                        $set('price', $price * $quantity);
                                        
                                        // Recalculate total amount
                                        static::recalculateTotalAmount($set, $get);
                                    }
                                }
                            }),
                        Forms\Components\TextInput::make('quantity')
                            ->required()
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(99)
                            ->integer()
                            ->validationMessages([
                                'required' => 'Quantity is required.',
                                'numeric' => 'Quantity must be a number.',
                                'min' => 'Quantity must be at least 1.',
                                'max' => 'Quantity cannot exceed 99.',
                                'integer' => 'Quantity must be a whole number.',
                            ])
                            ->live()
                            ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                                $menuId = $get('menu_id');
                                if ($menuId && $state) {
                                    $menu = \App\Models\Menu::find($menuId);
                                    if ($menu) {
                                        $price = (int) $menu->price;
                                        $quantity = (int) $state;
                                        $set('price', $price * $quantity);
                                        
                                        // Recalculate total amount
                                        static::recalculateTotalAmount($set, $get);
                                    }
                                }
                            }),
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->disabled()
                            ->dehydrated(),
                        Forms\Components\Hidden::make('pelanggan_id')
                            ->default(fn (Forms\Get $get) => $get('../../pelanggan_id')),
                    ])
                    ->columns(4)
                    ->defaultItems(1)
                    ->reorderable(false)
                    ->columnSpanFull()
                    ->live()
                    ->afterStateUpdated(function (Forms\Set $set, Forms\Get $get) {
                        static::recalculateTotalAmount($set, $get);
                    })
                    ->createItemButtonLabel('Add Menu Item')
                    ->itemLabel(fn (array $state): ?string => isset($state['menu_id']) ? \App\Models\Menu::find($state['menu_id'])?->name : null),
                
                Forms\Components\TextInput::make('total_amount')
                    ->required()
                    ->numeric()
                    ->minValue(1000)
                    ->prefix('Rp')
                    ->disabled()
                    ->dehydrated()
                    ->validationMessages([
                        'required' => 'Total amount is required.',
                        'numeric' => 'Total amount must be a number.',
                        'min' => 'Total amount must be at least Rp 1.000.',
                    ])
                    ->helperText('Total amount will be calculated automatically based on selected cart items'),
                
                Forms\Components\FileUpload::make('payment_proof')
                    ->image()
                    ->disk('public_store')
                    ->visibility('public')
                    ->required()
                    ->maxSize(5120) // 5MB
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                    ->validationMessages([
                        'required' => 'Please upload a payment proof image.',
                        'maxSize' => 'The image size should not exceed 5MB.',
                        'acceptedFileTypes' => 'Only JPG, JPEG, and PNG images are allowed.',
                    ])
                    ->helperText('Upload a clear image of your payment proof (max 5MB)'),
                
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                    ])
                    ->required()
                    ->default('pending')
                    ->validationMessages([
                        'required' => 'Please select a payment status.',
                    ])
                    ->helperText('Select the current status of the payment')
                    ->live()
                    ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                        if ($state === 'completed' && !$get('payment_proof')) {
                            $set('status', 'pending');
                            Notification::make()
                                ->title('Payment proof is required for completed payments')
                                ->warning()
                                ->send();
                        }
                    }),
            ])
            ->statePath('data')
            ->live();
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['carts.menu', 'pelanggan', 'bankAccount']))
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
                Tables\Columns\TextColumn::make('bankAccount.bank_name')
                    ->searchable()
                    ->sortable()
                    ->label('Bank'),
                Tables\Columns\TextColumn::make('bankAccount.account_number')
                    ->searchable()
                    ->label('Account Number'),
                Tables\Columns\TextColumn::make('carts')
                    ->label('Ordered Items')
                    ->listWithLineBreaks()
                    ->getStateUsing(function (Payment $record): array {
                        return $record->carts->map(function ($cart) {
                            return "{$cart->menu->name} (x{$cart->quantity}) - Rp " . 
                                number_format($cart->price, 0, ',', '.');
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
                    ->disk('public_store')
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
                    ->dateTime('d M Y H:i:s')
                    ->timezone('Asia/Jakarta')
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
                                            ->formatStateUsing(function ($state, $record): string {
                                                return number_format($record->price / $record->quantity, 0, ',', '.');
                                            })
                                            ->numeric(),
                                        Forms\Components\TextInput::make('subtotal')
                                            ->label('Subtotal')
                                            ->disabled()
                                            ->prefix('Rp')
                                            ->formatStateUsing(function ($state, $record): string {
                                                return number_format($record->price, 0, ',', '.');
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
                                Forms\Components\TextInput::make('bank_name')
                                    ->label('Bank Name')
                                    ->disabled()
                                    ->formatStateUsing(fn ($record) => $record->bankAccount?->bank_name),
                                Forms\Components\TextInput::make('account_number')
                                    ->label('Account Number')
                                    ->disabled()
                                    ->formatStateUsing(fn ($record) => $record->bankAccount?->account_number),
                                Forms\Components\FileUpload::make('payment_proof')
                                    ->label('Payment Proof')
                                    ->disabled()
                                    ->image()
                                    ->disk('public_store')
                                    ->visibility('public')
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

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['carts.menu', 'pelanggan', 'bankAccount']);
    }

    protected static function recalculateTotalAmount(Forms\Set $set, Forms\Get $get): void
    {
        $carts = $get('carts');
        if ($carts) {
            $total = collect($carts)
                ->sum(function ($cart) {
                    $menu = \App\Models\Menu::find($cart['menu_id']);
                    if ($menu) {
                        $price = (int) $menu->price;
                        $quantity = (int) $cart['quantity'];
                        return $price * $quantity;
                    }
                    return 0;
                });
            $set('total_amount', $total);
        } else {
            $set('total_amount', 0);
        }
    }
}
