<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // No exceptions - we want CSRF protection on all routes
    ];

    /**
     * Determine if the request has a valid CSRF token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function tokensMatch($request)
    {
        // Get the token from the request
        $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');
        
        if (!$token) {
            $token = $request->header('X-XSRF-TOKEN');
            if ($token) {
                try {
                    $token = $this->encrypter->decrypt($token, static::serialized());
                } catch (\Exception $e) {
                    Log::error('CSRF Token Decryption Failed', [
                        'error' => $e->getMessage(),
                        'token' => $token
                    ]);
                    return false;
                }
            }
        }

        // For Inertia requests, also check the X-Inertia header
        if ($request->header('X-Inertia') && !$token) {
            $token = $request->session()->token();
        }

        $sessionToken = $request->session()->token();

        return is_string($sessionToken) && 
               is_string($token) && 
               hash_equals($sessionToken, $token);
    }
} 