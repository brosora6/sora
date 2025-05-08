<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class VerifyLivewireCsrf
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->hasHeader('X-Livewire')) {
            // Ensure session is started
            if (!Session::isStarted()) {
                Session::start();
            }
            
            // Set CSRF token in session if not exists
            if (!Session::has('_token')) {
                Session::put('_token', csrf_token());
            }
            
            // Add CSRF token to response headers
            $response = $next($request);
            $response->headers->set('X-CSRF-TOKEN', Session::token());
            
            return $response;
        }

        return $next($request);
    }
} 