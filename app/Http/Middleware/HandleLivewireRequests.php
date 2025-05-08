<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class HandleLivewireRequests
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->hasHeader('X-Livewire')) {
            // For Livewire requests, ensure we have a valid session and CSRF token
            if (!Session::isStarted()) {
                Session::start();
            }

            // Set the CSRF token in the request if it's not present
            if (!$request->input('_token')) {
                $request->merge(['_token' => Session::token()]);
            }

            // Set the session ID in the request if it's not present
            if (!$request->hasSession()) {
                $request->setLaravelSession(Session::driver());
            }
        }

        return $next($request);
    }
} 