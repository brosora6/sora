<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;

class FilamentMultiAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $path = $request->segment(1);
        
        if ($path === 'admin' || $path === 'superadmin') {
            // Generate unique session ID for this request
            $uniqueId = Str::random(40);
            
            // Set unique session configuration
            Config::set('session.cookie', "{$path}_session_{$uniqueId}");
            
            // Force new session for each login
            if ($request->is("*/{$path}/login") || $request->is("*/{$path}/auth/login")) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
            
            // Set guard-specific configs
            if ($path === 'admin') {
                Config::set('filament.auth.guard', 'admin');
                Config::set('auth.defaults.guard', 'admin');
            } else {
                Config::set('filament.auth.guard', 'superadmin');
                Config::set('auth.defaults.guard', 'superadmin');
            }
            
            // Ensure session is started
            if (!$request->session()->isStarted()) {
                $request->session()->start();
            }
            
            // Store the guard type in session
            $request->session()->put('current_guard', $path);
        }

        return $next($request);
    }
} 