<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class GuardSpecificSession
{
    public function handle(Request $request, Closure $next, $guard = null)
    {
        if ($guard) {
            // Set guard-specific session name
            $sessionName = "{$guard}_session";
            
            // Ensure unique session ID for each guard
            if (!$request->hasSession() || $request->session()->getName() !== $sessionName) {
                $request->session()->setName($sessionName);
                $request->session()->regenerate();
            }
            
            // Set the auth guard for the request
            Config::set('auth.defaults.guard', $guard);
        }

        return $next($request);
    }
} 