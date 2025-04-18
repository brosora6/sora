<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $payments = Payment::where('pelanggan_id', Auth::guard('customer')->id())
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($payments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'bank' => 'required|string|max:255',
            'no_bank' => 'required|string|max:255',
        ]);

        // Get cart items
        $carts = Cart::where('pelanggan_id', Auth::guard('customer')->id())->get();
        
        if ($carts->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 422);
        }

        $total = $carts->sum('total_price');

        // Create payment
        $payment = Payment::create([
            'pelanggan_id' => Auth::guard('customer')->id(),
            'bank' => $request->bank,
            'no_bank' => $request->no_bank,
            'total_price' => $total,
            'status' => 'pending',
            'tanggal' => now(),
        ]);

        // Clear cart
        $carts->each->delete();

        return response()->json($payment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment): JsonResponse
    {
        // Check if the payment belongs to the authenticated user
        if ($payment->pelanggan_id !== Auth::guard('customer')->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json($payment);
    }
} 