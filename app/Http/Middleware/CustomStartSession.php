<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Illuminate\Session\Store;

class CustomStartSession extends StartSession
{
    public function handle($request, Closure $next, $guard = null)
    {
        // Configure session for the specific guard
        if ($guard) {
            config([
                'session.cookie' => "{$guard}_session",
                'session.path' => '/',
                'session.domain' => null,
                'session.secure' => false,
                'session.same_site' => 'lax',
            ]);
        }

        // Start the session
        $session = $this->getSession($request);
        
        // If no session exists, create one
        if (!$session->isStarted()) {
            $session->setId($session->getId() ?: Str::random(40));
            $session->start();
        }

        // Put the session on the request
        $request->setLaravelSession($session);

        // Generate CSRF token if not exists
        if (!$session->has('_token')) {
            $session->put('_token', Str::random(40));
        }

        // Get the response
        $response = $next($request);

        // Save the session
        $this->storeCurrentUrl($request, $session);
        $this->addCookieToResponse($response, $session);
        
        // Save and close the session
        $session->save();

        return $response;
    }

    protected function getSession(Request $request)
    {
        $session = $this->manager->driver();

        return $session;
    }
} 