<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'price',
        'gambar',
        'stok',
        'desc',
    ];

    /**
     * Get all of the carts for the Menu
     */
    public function carts()
    {
        return $this->hasMany(Cart::class, 'menus_id');
    }
}
