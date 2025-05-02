<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if the user is logged in under the correct guard for the role
        $guards = [
            'superadmin' => 'superadmin',
            'admin' => 'admin',
            'customer' => 'customer',
        ];
        
        if (!isset($guards[$role]) || !Auth::guard($guards[$role])->check()) {
            abort(403, 'Unauthorized action.');
        }
        
        return $next($request);
    }
} 