<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuperAdminAuthController extends Controller
{
    public function create()
    {
        return view('auth.superadmin.login');
    }

    public function store(LoginRequest $request)
    {
        $request->authenticate('superadmin');

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::SUPERADMIN_HOME);
    }

    public function destroy(Request $request)
    {
        Auth::guard('superadmin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
} 