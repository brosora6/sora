<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of active menus.
     */
    public function index(): JsonResponse
    {
        $menus = Menu::with('category')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return response()->json($menus);
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu): JsonResponse
    {
        return response()->json($menu->load('category'));
    }
} 