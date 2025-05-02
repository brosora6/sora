<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'total_amount' => 'required|numeric|min:0',
        ]);

        try {
            // Store the payment proof image
            $path = $request->file('payment_proof')->store('payment-proofs', 'public');

            // Create payment record
            $payment = Payment::create([
                'pelanggan_id' => auth()->id(),
                'total_amount' => $request->total_amount,
                'payment_proof' => $path,
                'status' => 'pending'
            ]);

            // Associate cart items with the payment instead of deleting them
            Cart::where('pelanggan_id', auth()->id())
                ->whereNull('payment_id')
                ->update(['payment_id' => $payment->id]);

            return response()->json([
                'message' => 'Payment submitted successfully',
                'payment' => $payment
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process payment',
                'error' => $e->getMessage()
            ], 500);
        }
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