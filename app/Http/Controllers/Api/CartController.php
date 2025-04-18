<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $carts = Cart::with('menu')
            ->where('pelanggan_id', Auth::guard('customer')->id())
            ->get();
        
        return response()->json($carts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'menus_id' => 'required|exists:menus,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $menu = Menu::findOrFail($request->menus_id);
        
        if ($menu->stok < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 422);
        }

        $cart = Cart::create([
            'pelanggan_id' => Auth::guard('customer')->id(),
            'menus_id' => $request->menus_id,
            'total_price' => $menu->price * $request->quantity,
        ]);

        return response()->json($cart, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart): JsonResponse
    {
        // Check if the cart belongs to the authenticated user
        if ($cart->pelanggan_id !== Auth::guard('customer')->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $cart->delete();

        return response()->json(null, 204);
    }
} 