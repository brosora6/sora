<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pelanggan_id',
        'menus_id',
        'total_price',
    ];

    /**
     * Get the pelanggan that owns the Cart
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class);
    }

    /**
     * Get the menu that owns the Cart
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menus_id');
    }
}
