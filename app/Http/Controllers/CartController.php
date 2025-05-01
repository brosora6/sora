<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index(): Response
    {
        if (!Auth::guard('customer')->check()) {
            return Inertia::render('auth/customer-login');
        }

        $customerId = Auth::guard('customer')->id();
        
        $carts = Cart::with('menu')
            ->where('pelanggan_id', $customerId)
            ->whereNull('payment_id')
            ->get();

        return Inertia::render('cart', [
            'carts' => $carts,
            'auth' => [
                'user' => Auth::guard('customer')->user()
            ]
        ]);
    }
} 