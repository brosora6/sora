<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;

class PaymentController extends Controller
{
    public function index()
    {
        $carts = Cart::with('menu')
            ->where('pelanggan_id', auth()->guard('customer')->id())
            ->whereNull('payment_id')
            ->get();

        return Inertia::render('payment', [
            'carts' => $carts,
            'auth' => [
                'user' => auth()->guard('customer')->user()
            ]
        ]);
    }

    public function success()
    {
        return Inertia::render('payment/success');
    }

    public function failure()
    {
        return Inertia::render('payment/failure');
    }
} 