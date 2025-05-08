<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (!$request->expectsJson()) {
            // Check the current guard
            $guard = current($this->guards);
            
            // Return appropriate login route based on guard
            return match($guard) {
                'admin' => '/admin/login',
                'superadmin' => '/superadmin/login',
                'customer' => '/customer/login',
                default => '/customer/login', // Default to customer login
            };
        }
        return null;
    }
} 