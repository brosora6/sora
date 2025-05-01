<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    /**
     * Display a listing of the customer's cart items.
     */
    public function index(): JsonResponse
    {
        $cart = Cart::with('menu')
            ->where('pelanggan_id', Auth::guard('customer')->id())
            ->whereNull('payment_id')  // Only show unpaid items
            ->get();

        return response()->json($cart);
    }

    /**
     * Store a newly created cart item.
     */
    public function store(Request $request): JsonResponse
    {
        // Debug authentication
        if (!Auth::guard('customer')->check()) {
            return response()->json(['message' => 'Unauthorized. Please login.'], 401);
        }

        $validated = $request->validate([
            'menu_id' => ['required', 'exists:menus,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            DB::beginTransaction();

            // Get the menu
            $menu = Menu::findOrFail($validated['menu_id']);

            // Check stock
            if ($menu->stok < $validated['quantity']) {
                return response()->json([
                    'message' => 'Not enough stock available.',
                ], 422);
            }

            // Check if the same menu item exists in unpaid cart
            $existingCart = Cart::where('pelanggan_id', Auth::guard('customer')->id())
                ->where('menu_id', $validated['menu_id'])
                ->whereNull('payment_id')
                ->first();

            if ($existingCart) {
                // Update quantity if same menu already in cart
                $newQuantity = $existingCart->quantity + $validated['quantity'];
                
                // Check if we have enough stock for the total quantity
                if ($menu->stok < $newQuantity) {
                    return response()->json([
                        'message' => 'Not enough stock available.',
                    ], 422);
                }

                $existingCart->update([
                    'quantity' => $newQuantity,
                    'price' => $menu->price * $newQuantity,
                ]);

                $cart = $existingCart;
            } else {
                // Create new cart item for different menu
                $cart = Cart::create([
                    'pelanggan_id' => Auth::guard('customer')->id(),
                    'menu_id' => $validated['menu_id'],
                    'quantity' => $validated['quantity'],
                    'price' => $menu->price * $validated['quantity'],
                ]);
            }

            // Decrease stock
            $menu->decrement('stok', $validated['quantity']);

            DB::commit();

            return response()->json([
                'message' => 'Item added to cart successfully.',
                'cart' => $cart->load('menu'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cart error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to add item to cart.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a cart item.
     */
    public function destroy(Cart $cart): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Check if cart belongs to user
            if ($cart->pelanggan_id !== Auth::guard('customer')->id()) {
                return response()->json([
                    'message' => 'Unauthorized.',
                ], 403);
            }

            // Restore stock
            $cart->menu->increment('stok', $cart->quantity);

            // Delete cart item
            $cart->delete();

            DB::commit();

            return response()->json([
                'message' => 'Item removed from cart successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to remove item from cart.',
            ], 500);
        }
    }

    /**
     * Update the cart item quantity.
     */
    public function update(Request $request, Cart $cart): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            DB::beginTransaction();

            // Check if cart belongs to user
            if ($cart->pelanggan_id !== Auth::guard('customer')->id()) {
                return response()->json([
                    'message' => 'Unauthorized.',
                ], 403);
            }

            // Get the menu
            $menu = $cart->menu;

            // Check if we have enough stock
            if ($menu->stok < $validated['quantity']) {
                return response()->json([
                    'message' => 'Not enough stock available.',
                ], 422);
            }

            // Calculate stock difference
            $stockDifference = $validated['quantity'] - $cart->quantity;

            // Update cart quantity and price
            $cart->update([
                'quantity' => $validated['quantity'],
                'price' => $menu->price * $validated['quantity'],
            ]);

            // Update menu stock
            $menu->decrement('stok', $stockDifference);

            DB::commit();

            return response()->json([
                'message' => 'Cart updated successfully.',
                'cart' => $cart->load('menu'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cart update error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update cart.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 