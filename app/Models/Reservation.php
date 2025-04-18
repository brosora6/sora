<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pelanggan_id',
        'tanggal',
        'waktu',
        'jumlah_orang',
        'note',
    ];

    /**
     * Get the pelanggan that owns the Reservation
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class);
    }
}
