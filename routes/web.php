<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\AboutController;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu');
Route::get('/about', [AboutController::class, 'index'])->name('about');

// Protected Routes
Route::middleware(['auth:customer'])->group(function () {
    // Reservation routes
    Route::prefix('reservation')->group(function () {
        Route::get('/', [ReservationController::class, 'index'])->name('reservation.index');
        Route::get('/create', [ReservationController::class, 'create'])->name('reservation.create');
        Route::post('/', [ReservationController::class, 'store'])->name('reservation.store');
        Route::get('/success', [ReservationController::class, 'success'])->name('reservation.success');
    });

    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    
    // Payment routes
    Route::get('/payment', [PaymentController::class, 'index'])->name('payment');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/failure', [PaymentController::class, 'failure'])->name('payment.failure');
});

// Fallback route for login
Route::get('/login', function () {
    if (auth()->guard('customer')->check()) {
        return redirect()->route('home');
    }
    return redirect()->route('customer.login');
})->name('login')->middleware('guest:customer');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/superadmin.php';
require __DIR__.'/pelanggan.php';

// Test email route
Route::get('/mail-test/{email}', function ($email) {
    try {
        \Log::info('Starting mail test to: ' . $email);
        
        $data = [
            'subject' => 'Test Email from Rumah Makan Salwa',
            'body' => 'This is a test email to verify the email configuration is working.'
        ];
        
        \Mail::send('emails.test', $data, function($message) use ($email) {
            $message->to($email)
                    ->subject('Test Email from Rumah Makan Salwa')
                    ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
        });
        
        \Log::info('Mail test completed successfully');
        return 'Test email sent successfully! Please check your inbox and spam folder.';
    } catch (\Exception $e) {
        \Log::error('Mail test failed: ' . $e->getMessage());
        \Log::error('Mail settings: ' . json_encode([
            'driver' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
        ]));
        return 'Error sending email: ' . $e->getMessage();
    }
});
