<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\BankAccount;

class PaymentController extends Controller
{
    public function index()
    {
        $carts = Cart::with('menu')
            ->where('pelanggan_id', auth()->guard('customer')->id())
            ->whereNull('payment_id')
            ->get();

        // Get bank accounts from the database
        $bankAccounts = BankAccount::all();

        return Inertia::render('payment', [
            'carts' => $carts,
            'auth' => [
                'user' => auth()->guard('customer')->user()
            ],
            'bankAccounts' => $bankAccounts
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

    public function create()
    {
        // Get bank accounts from the database
        $bankAccounts = BankAccount::all();

        return Inertia::render('payment', [
            'bankAccounts' => $bankAccounts,
            'auth' => [
                'user' => auth()->guard('customer')->user()
            ]
        ]);
    }
} 