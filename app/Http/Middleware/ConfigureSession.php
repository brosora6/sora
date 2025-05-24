<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class ConfigureSession
{
    public function handle(Request $request, Closure $next)
    {
        // Configure session for the domain
        Config::set('session.domain', '.sorasalwa.web.id');
        Config::set('session.secure', true);
        Config::set('session.same_site', 'lax');
        Config::set('session.path', '/');

        // Configure sanctum
        Config::set('sanctum.stateful', [
            'sorasalwa.web.id',
            '*.sorasalwa.web.id',
        ]);

        // Ensure session is started
        if (!$request->session()->isStarted()) {
            $request->session()->start();
        }

        // Set SameSite attribute for all cookies
        $response = $next($request);
        
        if (method_exists($response, 'withCookie')) {
            $cookies = $response->headers->getCookies();
            foreach ($cookies as $cookie) {
                $response->withCookie(
                    $cookie->getName(),
                    $cookie->getValue(),
                    $cookie->getExpiresTime(),
                    '/',
                    '.sorasalwa.web.id',
                    true,
                    true,
                    false,
                    'lax'
                );
            }
        }

        return $response;
    }
} 