<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Disable Vite in development when assets are not built
        if (!file_exists(public_path('build/manifest.json'))) {
            Vite::useCspNonce();
            Vite::macro('content', fn() => '');
        }
    }
}
