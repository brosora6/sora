<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                'name' => 'Nasi Goreng Special',
                'price' => 25000,
                'desc' => 'Nasi goreng dengan telur, ayam, dan sayuran segar',
                'stok' => 50,
                'status' => 'active',
            ],
            [
                'name' => 'Mie Goreng',
                'price' => 22000,
                'desc' => 'Mie goreng dengan telur dan sayuran',
                'stok' => 50,
                'status' => 'active',
            ],
            [
                'name' => 'Ayam Bakar',
                'price' => 30000,
                'desc' => 'Ayam bakar dengan sambal dan lalapan',
                'stok' => 30,
                'status' => 'active',
            ],
        ];

        foreach ($menus as $menu) {
            Menu::create($menu);
        }
    }
} 