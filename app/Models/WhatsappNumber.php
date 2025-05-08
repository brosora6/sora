<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsappNumber extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'name',
        'description',
        'is_primary',
        'is_active',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
    ];

    public static function getPrimaryNumber()
    {
        $whatsapp = self::where('is_primary', true)
            ->where('is_active', true)
            ->first();

        return $whatsapp ? $whatsapp->number : null;
    }
} 