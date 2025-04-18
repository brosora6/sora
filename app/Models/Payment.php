<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pelanggan_id',
        'bank',
        'no_bank',
        'total_price',
        'status',
        'tanggal',
    ];

    /**
     * Get the pelanggan that owns the Payment
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class);
    }
}
