<?php

use App\Http\Controllers\Pelanggan\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Pelanggan\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:customer')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('pelanggan.register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('pelanggan.login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth:customer')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('pelanggan.logout');
}); 