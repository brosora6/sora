<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Setting;
use App\Models\WhatsappNumber;

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
            ->select('id', 'order_number', 'tanggal', 'waktu', 'jumlah_orang', 'note', 'status', 'staff_whatsapp')
            ->latest()
            ->first();

        // Get active WhatsApp number
        $whatsappNumber = WhatsappNumber::where('is_active', true)->first();
        $whatsappNumberValue = $whatsappNumber ? $whatsappNumber->number : null;

        return Inertia::render('Reservation', [
            'auth' => ['user' => Auth::user()],
            'reservation' => $reservation,
            'openingHours' => $this->openingHours,
            'whatsappNumber' => $whatsappNumberValue
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
            'order_number' => 'RES' . now()->format('ymd') . rand(1000, 9999),
        ]);

        // Get active WhatsApp number
        $whatsappNumber = WhatsappNumber::where('is_active', true)->first();
        $whatsappNumberValue = $whatsappNumber ? $whatsappNumber->number : null;

        return redirect()->route('reservation.success', [
            'order' => $reservation->order_number,
            'whatsappNumber' => $whatsappNumberValue
        ]);
    }

    public function success(Request $request)
    {
        $orderNumber = $request->query('order');
        
        if (!$orderNumber) {
            return redirect()->route('reservation.create');
        }

        $reservation = Reservation::where('order_number', $orderNumber)
            ->where('pelanggan_id', Auth::id())
            ->select('order_number', 'tanggal', 'waktu', 'jumlah_orang', 'status', 'note')
            ->firstOrFail();

        // Get active WhatsApp number
        $whatsappNumber = WhatsappNumber::where('is_active', true)->first();
        $whatsappNumberValue = $whatsappNumber ? $whatsappNumber->number : null;

        return Inertia::render('reservation/Success', [
            'auth' => ['user' => Auth::user()],
            'reservation' => $reservation,
            'whatsappNumber' => $whatsappNumberValue
        ]);
    }

    public function create()
    {
        // Get active WhatsApp number
        $whatsappNumber = WhatsappNumber::where('is_active', true)->first();
        $whatsappNumberValue = $whatsappNumber ? $whatsappNumber->number : null;

        return Inertia::render('Reservation', [
            'whatsappNumber' => $whatsappNumberValue,
            'auth' => [
                'user' => Auth::user()
            ],
            'openingHours' => $this->openingHours
        ]);
    }

    public function show(Reservation $reservation)
    {
        // Get active WhatsApp number
        $whatsappNumber = WhatsappNumber::where('is_active', true)->first();
        $whatsappNumberValue = $whatsappNumber ? $whatsappNumber->number : null;

        return Inertia::render('Reservation', [
            'reservation' => $reservation,
            'whatsappNumber' => $whatsappNumberValue,
            'openingHours' => $this->openingHours
        ]);
    }
} 