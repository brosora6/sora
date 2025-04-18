<?php

namespace App\Providers;

use App\Models\Admin;
use App\Models\Pelanggan;
use App\Models\SuperAdmin;
use App\Policies\PelangganPolicy;
use App\Policies\SuperAdminPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        SuperAdmin::class => SuperAdminPolicy::class,
        Pelanggan::class => PelangganPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Register policies
        $this->registerPolicies();
        
        // Register custom auth providers for Filament
        Auth::provider('superadmin_provider', function ($app, array $config) {
            return new \Illuminate\Auth\EloquentUserProvider($app['hash'], SuperAdmin::class);
        });

        Auth::provider('admin_provider', function ($app, array $config) {
            return new \Illuminate\Auth\EloquentUserProvider($app['hash'], Admin::class);
        });

        Auth::provider('pelanggan_provider', function ($app, array $config) {
            return new \Illuminate\Auth\EloquentUserProvider($app['hash'], Pelanggan::class);
        });
    }
} 