<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Inertia\Inertia;

class AboutController extends Controller
{
    /**
     * Display the about page.
     */
    public function index()
    {
        $recommendedMenus = Menu::recommended()
            ->with('category')
            ->get();

        return Inertia::render('about', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'recommendedMenus' => $recommendedMenus,
        ]);
    }
} 