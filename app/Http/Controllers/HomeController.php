<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): Response
    {
        $recommendedMenus = Menu::recommended()
            ->where('status', 'active')
            ->limit(6)
            ->get();

        return Inertia::render('home', [
            'auth' => [
                'user' => Auth::guard('customer')->user()
            ],
            'recommendedMenus' => $recommendedMenus
        ]);
    }
} 