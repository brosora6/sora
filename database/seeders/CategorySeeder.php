<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Paket Ayam',
                'description' => 'Paket menu ayam dengan nasi dan lalapan',
            ],
            [
                'name' => 'Paket Spesial Ayam Bakar',
                'description' => 'Paket spesial ayam bakar dengan berbagai pilihan',
            ],
            [
                'name' => 'Menu Ayam Goreng Kremes',
                'description' => 'Menu ayam goreng kremes dengan berbagai variasi',
            ],
            [
                'name' => 'Menu Ayam',
                'description' => 'Menu ayam satuan dengan berbagai olahan',
            ],
            [
                'name' => 'Menu Ikan',
                'description' => 'Berbagai olahan ikan segar',
            ],
            [
                'name' => 'Menu Soto',
                'description' => 'Menu soto dengan berbagai pilihan',
            ],
            [
                'name' => 'Varian Gami',
                'description' => 'Menu gami dengan berbagai varian',
            ],
            [
                'name' => 'Menu Bebek',
                'description' => 'Berbagai olahan bebek',
            ],
            [
                'name' => 'Aneka Sup',
                'description' => 'Berbagai pilihan sup',
            ],
            [
                'name' => 'Aneka Cah Salwa',
                'description' => 'Menu cah khas Salwa',
            ],
            [
                'name' => 'Menu Camilan',
                'description' => 'Aneka camilan dan gorengan',
            ],
            [
                'name' => 'Menu Tambahan',
                'description' => 'Menu pelengkap',
            ],
            [
                'name' => 'Basic Drinks',
                'description' => 'Minuman dasar',
            ],
            [
                'name' => 'Milk Shake',
                'description' => 'Aneka milk shake',
            ],
            [
                'name' => 'Juice',
                'description' => 'Aneka jus buah segar',
            ],
            [
                'name' => 'Mocktail Soda',
                'description' => 'Minuman soda non alkohol',
            ],
            [
                'name' => 'Coklat',
                'description' => 'Aneka minuman coklat',
            ],
            [
                'name' => 'Ice Coffee',
                'description' => 'Aneka kopi dingin',
            ],
            [
                'name' => 'Coffee Manual Brew',
                'description' => 'Kopi manual brew',
            ],
            [
                'name' => 'Fresh Drinks',
                'description' => 'Minuman segar',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
            ]);
        }
    }
}
