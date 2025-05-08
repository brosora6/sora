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
            // Paket Ayam
            [
                'name' => 'Paket 1 (Nasi + Ayam Goreng + Lalapan + Es Teh)',
                'price' => 15000,
                'stok' => 50,
                'desc' => 'Paket hemat dengan nasi, ayam goreng, lalapan segar, dan es teh',
                'category_id' => 1,
            ],
            [
                'name' => 'Paket 2 (Nasi + Ayam Penyet + Lalapan + Es Teh)',
                'price' => 15000,
                'stok' => 50,
                'desc' => 'Paket hemat dengan nasi, ayam penyet, lalapan segar, dan es teh',
                'category_id' => 1,
            ],
            [
                'name' => 'Paket 3 (Nasi + Ayam Penyet Sambal Ijo + Lalapan + Es Teh)',
                'price' => 20000,
                'stok' => 50,
                'desc' => 'Paket dengan nasi, ayam penyet sambal ijo, lalapan segar, dan es teh',
                'category_id' => 1,
            ],

            // Menu Ayam Goreng Kremes
            [
                'name' => 'Paket G (Ayam Goreng Utuh + Lalapan)',
                'price' => 70000,
                'stok' => 20,
                'desc' => 'Ayam goreng utuh dengan lalapan segar',
                'category_id' => 3,
            ],
            [
                'name' => 'Paket H (Ayam Kremes Utuh + Lalapan)',
                'price' => 70000,
                'stok' => 20,
                'desc' => 'Ayam kremes utuh dengan lalapan segar',
                'category_id' => 3,
            ],

            // Menu Ikan
            [
                'name' => 'Ikan Nila Goreng',
                'price' => 35000,
                'stok' => 30,
                'desc' => 'Ikan nila goreng segar',
                'category_id' => 5,
            ],
            [
                'name' => 'Ikan Nila Bakar',
                'price' => 40000,
                'stok' => 30,
                'desc' => 'Ikan nila bakar dengan bumbu special',
                'category_id' => 5,
            ],

            // Basic Drinks
            [
                'name' => 'Es Teh',
                'price' => 5000,
                'stok' => 100,
                'desc' => 'Es teh manis segar',
                'category_id' => 13,
            ],
            [
                'name' => 'Es Jeruk',
                'price' => 5000,
                'stok' => 100,
                'desc' => 'Es jeruk segar',
                'category_id' => 13,
            ],

            // Milk Shake
            [
                'name' => 'Milk Shake Coklat',
                'price' => 12000,
                'stok' => 50,
                'desc' => 'Milk shake dengan rasa coklat',
                'category_id' => 14,
            ],
            [
                'name' => 'Milk Shake Oreo',
                'price' => 12000,
                'stok' => 50,
                'desc' => 'Milk shake dengan campuran oreo',
                'category_id' => 14,
            ],

            // Mocktail Soda
            [
                'name' => 'Sunrise',
                'price' => 10000,
                'stok' => 50,
                'desc' => 'Mocktail soda dengan campuran rasa sunrise',
                'category_id' => 16,
            ],
            [
                'name' => 'Ocean Blue',
                'price' => 10000,
                'stok' => 50,
                'desc' => 'Mocktail soda dengan warna biru menyegarkan',
                'category_id' => 16,
            ],

            // Ice Coffee
            [
                'name' => 'Es Kopi Susu',
                'price' => 10000,
                'stok' => 50,
                'desc' => 'Es kopi dengan susu segar',
                'category_id' => 18,
            ],
            [
                'name' => 'Cappuccino Ice',
                'price' => 12000,
                'stok' => 50,
                'desc' => 'Cappuccino dingin',
                'category_id' => 18,
            ],
        ];

        foreach ($menus as $menu) {
            Menu::create($menu);
        }
    }
} 