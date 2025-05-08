<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Menu extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'desc',
        'gambar',
        'stok',
        'status',
        'total_purchased',
        'is_recommended',
        'category_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'integer',
        'stok' => 'integer',
        'total_purchased' => 'integer',
        'is_recommended' => 'boolean',
        'category_id' => 'integer',
    ];

    /**
     * Get the cart items for the menu.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Get the category that owns the menu.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope a query to only include recommended menus.
     */
    public function scopeRecommended($query)
    {
        return $query->where('is_recommended', true)
                    ->where('status', 'active')
                    ->orderBy('total_purchased', 'desc');
    }

    /**
     * Increment the total purchased count.
     */
    public function incrementTotalPurchased(int $quantity = 1): void
    {
        $this->increment('total_purchased', $quantity);
        
        // Automatically set as recommended if purchased more than 10 times
        if ($this->total_purchased >= 10 && !$this->is_recommended) {
            $this->update(['is_recommended' => true]);
        }
    }
}
