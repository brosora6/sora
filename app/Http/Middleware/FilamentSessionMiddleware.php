<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class FilamentSessionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $path = $request->segment(1);
        
        if ($path === 'admin') {
            // Set admin-specific session and CSRF configuration
            Config::set('session.cookie', 'admin_session');
            Config::set('session.domain', null);
            Config::set('session.secure', true);
            Config::set('session.path', '/admin');
            Config::set('filament.auth.guard', 'admin');
            Config::set('session.token', 'admin_csrf_token');
            $request->session()->name('admin_session');
        } elseif ($path === 'superadmin') {
            // Set superadmin-specific session and CSRF configuration
            Config::set('session.cookie', 'superadmin_session');
            Config::set('session.domain', null);
            Config::set('session.secure', true);
            Config::set('session.path', '/superadmin');
            Config::set('filament.auth.guard', 'superadmin');
            Config::set('session.token', 'superadmin_csrf_token');
            $request->session()->name('superadmin_session');
        }

        // Ensure unique session for each guard
        if (!$request->session()->has('_token')) {
            $request->session()->regenerate();
            $request->session()->put('guard_type', $path);
        }

        return $next($request);
    }
} 