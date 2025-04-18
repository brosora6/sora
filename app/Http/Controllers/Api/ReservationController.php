<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $reservations = Reservation::where('pelanggan_id', Auth::guard('customer')->id())
            ->orderBy('tanggal', 'desc')
            ->get();
        
        return response()->json($reservations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => 'required',
            'jumlah_orang' => 'required|integer|min:1',
            'note' => 'nullable|string',
        ]);

        $reservation = Reservation::create([
            'pelanggan_id' => Auth::guard('customer')->id(),
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'jumlah_orang' => $request->jumlah_orang,
            'note' => $request->note,
        ]);

        return response()->json($reservation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation): JsonResponse
    {
        // Check if the reservation belongs to the authenticated user
        if ($reservation->pelanggan_id !== Auth::guard('customer')->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json($reservation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        // Check if the reservation belongs to the authenticated user
        if ($reservation->pelanggan_id !== Auth::guard('customer')->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => 'required',
            'jumlah_orang' => 'required|integer|min:1',
            'note' => 'nullable|string',
        ]);

        $reservation->update([
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'jumlah_orang' => $request->jumlah_orang,
            'note' => $request->note,
        ]);

        return response()->json($reservation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation): JsonResponse
    {
        // Check if the reservation belongs to the authenticated user
        if ($reservation->pelanggan_id !== Auth::guard('customer')->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if the reservation is in the future and more than 1 day away
        if (now()->diffInDays($reservation->tanggal) <= 1) {
            return response()->json([
                'message' => 'Reservations can only be cancelled more than 24 hours in advance'
            ], 422);
        }

        $reservation->delete();

        return response()->json(null, 204);
    }
} 