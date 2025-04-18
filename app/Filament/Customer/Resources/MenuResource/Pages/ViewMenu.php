<?php

namespace App\Filament\Customer\Resources\MenuResource\Pages;

use App\Filament\Customer\Resources\MenuResource;
use App\Models\Cart;
use Filament\Actions;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Facades\Auth;

class ViewMenu extends ViewRecord
{
    protected static string $resource = MenuResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('add_to_cart')
                ->label('Add to Cart')
                ->form([
                    TextInput::make('quantity')
                        ->required()
                        ->numeric()
                        ->default(1)
                        ->minValue(1)
                        ->maxValue(fn () => $this->record->stok),
                ])
                ->action(function (array $data): void {
                    $menu = $this->record;
                    $quantity = $data['quantity'];
                    
                    if ($quantity > $menu->stok) {
                        Notification::make()
                            ->title('Not enough stock available')
                            ->danger()
                            ->send();
                        return;
                    }
                    
                    // Create cart item
                    Cart::create([
                        'pelanggan_id' => Auth::guard('customer')->id(),
                        'menus_id' => $menu->id,
                        'total_price' => $menu->price * $quantity,
                    ]);
                    
                    Notification::make()
                        ->title('Added to cart successfully')
                        ->success()
                        ->send();
                }),
        ];
    }
} 