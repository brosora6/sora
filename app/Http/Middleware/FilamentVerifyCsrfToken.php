<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class FilamentVerifyCsrfToken extends Middleware
{
    protected function getTokenFromRequest($request)
    {
        $token = parent::getTokenFromRequest($request);
        
        // If no token is found, try to get it from our custom header
        if (!$token) {
            $token = $request->header('X-CSRF-TOKEN');
        }
        
        return $token;
    }

    protected function tokensMatch($request)
    {
        $sessionToken = $request->session()->token();
        $token = $this->getTokenFromRequest($request);

        return is_string($sessionToken) && 
               is_string($token) && 
               hash_equals($sessionToken, $token);
    }
} 