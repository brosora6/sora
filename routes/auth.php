<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\CustomerAuthController;
use App\Http\Controllers\Auth\CustomerRegisterController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\CustomerPasswordResetController;
use Illuminate\Support\Facades\Route;

// Superadmin and Admin routes are now handled by Filament
// Remove the old routes as they're no longer needed

// Customer Routes
Route::middleware(['web', 'guest:customer'])->group(function () {
    Route::get('customer/register', [CustomerRegisterController::class, 'create'])
        ->name('customer.register');
    Route::post('customer/register', [CustomerRegisterController::class, 'store']);

    Route::get('customer/login', [CustomerAuthController::class, 'create'])
        ->name('customer.login');
    Route::post('customer/login', [CustomerAuthController::class, 'store']);

    // Add customer password reset routes
    Route::get('customer/forgot-password', [CustomerPasswordResetController::class, 'create'])
        ->name('customer.password.request');
    Route::post('customer/forgot-password', [CustomerPasswordResetController::class, 'store'])
        ->name('customer.password.email');
    Route::get('customer/reset-password/{token}', [CustomerPasswordResetController::class, 'reset'])
        ->name('customer.password.reset');
    Route::post('customer/reset-password', [CustomerPasswordResetController::class, 'update'])
        ->name('customer.password.store');
});

Route::middleware(['web', 'auth:customer'])->group(function () {
    Route::post('customer/logout', [CustomerAuthController::class, 'destroy'])
        ->name('customer.logout');
});

// Remove or comment out the regular user routes since we're using Filament for admin
// Regular user routes
// Route::middleware('guest')->group(function () {
//     Route::get('register', [RegisteredUserController::class, 'create'])
//         ->name('register');
//     Route::post('register', [RegisteredUserController::class, 'store']);
//
//     Route::get('login', [AuthenticatedSessionController::class, 'create'])
//         ->name('login');
//     Route::post('login', [AuthenticatedSessionController::class, 'store']);
//
//     Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
//         ->name('password.request');
//     Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
//         ->name('password.email');
//
//     Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
//         ->name('password.reset');
//     Route::post('reset-password', [NewPasswordController::class, 'store'])
//         ->name('password.store');
// });
//
// Route::middleware('auth')->group(function () {
//     Route::get('verify-email', EmailVerificationPromptController::class)
//         ->name('verification.notice');
//
//     Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
//         ->middleware(['signed', 'throttle:6,1'])
//         ->name('verification.verify');
//
//     Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
//         ->middleware('throttle:6,1')
//         ->name('verification.send');
//
//     Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
//         ->name('password.confirm');
//
//     Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
//
//     Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
//         ->name('logout');
// });
