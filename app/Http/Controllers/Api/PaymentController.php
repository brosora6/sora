<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Generate a unique order number
     */
    private function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('Ymd');
        $random = strtoupper(Str::random(4));
        $orderNumber = "{$prefix}-{$timestamp}-{$random}";

        // Ensure uniqueness
        while (Payment::where('order_number', $orderNumber)->exists()) {
            $random = strtoupper(Str::random(4));
            $orderNumber = "{$prefix}-{$timestamp}-{$random}";
        }

        return $orderNumber;
    }

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
        try {
            // Add logging to debug
            Log::info('Payment request received', ['request' => $request->all()]);
            
            $request->validate([
                'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'total_amount' => 'required|numeric|min:0',
            ]);

            // Get the authenticated customer's ID
            $customerId = Auth::guard('customer')->id();
            
            if (!$customerId) {
                Log::error('No authenticated customer found');
                return response()->json([
                    'message' => 'Unauthorized',
                    'error' => 'No authenticated customer found'
                ], 401);
            }

            // Store the payment proof image
            $path = $request->file('payment_proof')->store('payment-proofs', 'public');

            // Generate unique order number
            $orderNumber = $this->generateOrderNumber();

            // Create payment record
            $payment = Payment::create([
                'pelanggan_id' => $customerId,
                'order_number' => $orderNumber,
                'total_amount' => $request->total_amount,
                'payment_proof' => $path,
                'status' => 'pending'
            ]);

            // Associate cart items with the payment
            Cart::where('pelanggan_id', $customerId)
                ->whereNull('payment_id')
                ->update(['payment_id' => $payment->id]);

            Log::info('Payment created successfully', ['payment' => $payment]);

            return response()->json([
                'message' => 'Payment submitted successfully',
                'payment' => $payment
            ], 201);

        } catch (\Exception $e) {
            Log::error('Payment processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

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