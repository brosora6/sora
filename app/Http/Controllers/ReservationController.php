<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReservationController extends Controller
{
    private $openingHours = [
        'Monday' => ['08:00', '22:00'],
        'Tuesday' => ['08:00', '22:00'],
        'Wednesday' => ['08:00', '22:00'],
        'Thursday' => ['08:00', '22:00'],
        'Friday' => ['07:00', '22:00'],
        'Saturday' => ['08:00', '22:00'],
        'Sunday' => ['08:00', '22:00'],
    ];

    public function index()
    {
        $reservation = Reservation::where('pelanggan_id', Auth::id())
            ->latest()
            ->first();

        return Inertia::render('Reservation', [
            'auth' => ['user' => Auth::user()],
            'reservation' => $reservation,
            'openingHours' => $this->openingHours,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => ['required', 'date_format:H:i'],
            'jumlah_orang' => 'required|integer|min:1|max:20',
            'note' => 'nullable|string',
        ]);

        // Check if the selected time is within opening hours
        $date = Carbon::parse($validated['tanggal']);
        $time = Carbon::parse($validated['waktu']);
        $dayOfWeek = $date->format('l');
        
        $openTime = Carbon::parse($this->openingHours[$dayOfWeek][0]);
        $closeTime = Carbon::parse($this->openingHours[$dayOfWeek][1]);

        if ($time->format('H:i') < $openTime->format('H:i') || 
            $time->format('H:i') > $closeTime->format('H:i')) {
            return back()->withErrors([
                'waktu' => "We're closed at this time. Our opening hours on {$dayOfWeek} are {$this->openingHours[$dayOfWeek][0]} - {$this->openingHours[$dayOfWeek][1]}"
            ]);
        }

        // Don't allow reservations less than 1 hour before closing
        $closeTimeLimit = $closeTime->copy()->subHour();
        if ($time->format('H:i') > $closeTimeLimit->format('H:i')) {
            return back()->withErrors([
                'waktu' => "Reservations must be made at least 1 hour before closing time ({$this->openingHours[$dayOfWeek][1]})"
            ]);
        }

        $reservation = Reservation::create([
            'pelanggan_id' => Auth::id(),
            'tanggal' => $validated['tanggal'],
            'waktu' => $validated['waktu'],
            'jumlah_orang' => $validated['jumlah_orang'],
            'note' => $validated['note'],
            'status' => 'pending',
        ]);

        return redirect()->route('reservations.index');
    }
} 