<?php

use App\Models\Admin;
use App\Models\SuperAdmin;

return [
    'path' => 'admin',
    
    'auth' => [
        'guard' => 'admin',
        'pages' => [
            'login' => \Filament\Pages\Auth\Login::class,
        ],
    ],

    'pages' => [
        'namespace' => 'App\\Filament\\Pages',
    ],

    'resources' => [
        'namespace' => 'App\\Filament\\Resources',
    ],

    'widgets' => [
        'namespace' => 'App\\Filament\\Widgets',
    ],

    'livewire' => [
        'namespace' => 'App\\Filament',
    ],

    'dark_mode' => [
        'enabled' => true,
    ],

    'database_notifications' => [
        'enabled' => false,
    ],

    'broadcasting' => [
        'enabled' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Filament Panels
    |--------------------------------------------------------------------------
    */
    'panels' => [
        'admin' => [
            'path' => 'admin',
            'guard' => 'admin',
            'model' => Admin::class,
            'middleware' => [
                \App\Http\Middleware\FilamentMultiAuthMiddleware::class,
                'web',
            ],
            'auth' => [
                'pages' => [
                    'login' => \Filament\Pages\Auth\Login::class,
                ],
            ],
            'session' => [
                'name' => 'admin_session',
                'token' => 'admin_csrf_token',
                'path' => '/admin',
            ],
        ],
        'superadmin' => [
            'path' => 'superadmin',
            'guard' => 'superadmin',
            'model' => SuperAdmin::class,
            'middleware' => [
                \App\Http\Middleware\FilamentMultiAuthMiddleware::class,
                'web',
            ],
            'auth' => [
                'pages' => [
                    'login' => \Filament\Pages\Auth\Login::class,
                ],
            ],
            'session' => [
                'name' => 'superadmin_session',
                'token' => 'superadmin_csrf_token',
                'path' => '/superadmin',
            ],
        ],
    ],
]; 