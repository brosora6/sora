<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display the menu page.
     */
    public function index()
    {
        $menus = Menu::with('category')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        $categories = Category::orderBy('name')->get();

        return Inertia::render('menu', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'menus' => $menus,
            'categories' => $categories,
        ]);
    }
} 