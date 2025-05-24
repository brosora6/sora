<?php

use Laravel\Sanctum\Sanctum;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'sorasalwa.web.id,*.sorasalwa.web.id',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    'guard' => ['web', 'customer'],

    'expiration' => null,

    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],

    'prefix' => 'sanctum',
]; 