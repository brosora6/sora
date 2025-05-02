<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $reservations = Reservation::where('pelanggan_id', Auth::id())
            ->with('pelanggan')
            ->latest()
            ->get();

        return response()->json($reservations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => 'required',
            'jumlah_orang' => 'required|integer|min:1|max:20',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reservation = Reservation::create([
            'pelanggan_id' => Auth::id(),
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'jumlah_orang' => $request->jumlah_orang,
            'note' => $request->note,
            'status' => 'pending',
        ]);

        return response()->json($reservation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $reservation = Reservation::where('pelanggan_id', Auth::id())
            ->with('pelanggan')
            ->findOrFail($id);

        return response()->json($reservation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $reservation = Reservation::where('pelanggan_id', Auth::id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'tanggal' => 'sometimes|required|date|after_or_equal:today',
            'waktu' => 'sometimes|required',
            'jumlah_orang' => 'sometimes|required|integer|min:1|max:20',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reservation->update($request->only([
            'tanggal',
            'waktu',
            'jumlah_orang',
            'note',
        ]));

        return response()->json($reservation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $reservation = Reservation::where('pelanggan_id', Auth::id())->findOrFail($id);
        $reservation->delete();

        return response()->json([], 204);
    }
} 