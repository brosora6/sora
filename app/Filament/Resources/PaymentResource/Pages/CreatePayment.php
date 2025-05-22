<?php

namespace App\Filament\Resources\PaymentResource\Pages;

use App\Filament\Resources\PaymentResource;
use App\Models\Cart;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CreatePayment extends CreateRecord
{
    protected static string $resource = PaymentResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            // Create the payment first
            $payment = static::getModel()::create([
                'pelanggan_id' => $data['pelanggan_id'],
                'order_number' => $data['order_number'],
                'total_amount' => $data['total_amount'],
                'payment_proof' => $data['payment_proof'],
                'status' => $data['status'],
                'bank_account_id' => $data['bank_account_id'],
            ]);

            // Create new cart items for the payment
            if (isset($data['carts']) && is_array($data['carts'])) {
                foreach ($data['carts'] as $cartData) {
                    Cart::create([
                        'pelanggan_id' => $data['pelanggan_id'],
                        'menu_id' => $cartData['menu_id'],
                        'quantity' => $cartData['quantity'],
                        'price' => $cartData['price'],
                        'payment_id' => $payment->id,
                    ]);
                }
            }

            return $payment;
        });
    }
}
