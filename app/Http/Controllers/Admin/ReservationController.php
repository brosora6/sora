<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Update the reservation status and staff WhatsApp number.
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,rejected',
            'staff_whatsapp' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reservation->update([
            'status' => $request->status,
            'staff_whatsapp' => $request->staff_whatsapp,
        ]);

        return response()->json($reservation);
    }
} 