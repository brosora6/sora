<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Settings\ProfileController;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/menu', function () {
    return Inertia::render('menu');
})->name('menu');

Route::middleware(['auth:customer', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    
    // Payment routes
    Route::get('/payment', [PaymentController::class, 'index'])->name('payment');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/failure', [PaymentController::class, 'failure'])->name('payment.failure');
    
    Route::get('/reservation', function () {
        return Inertia::render('Reservation');
    })->name('reservation');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations', [ReservationController::class, 'index'])->name('reservations.index');
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

    // Profile routes
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/superadmin.php';
require __DIR__.'/pelanggan.php';
