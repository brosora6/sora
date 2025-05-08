<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_name',
        'account_number',
        'account_name',
        'description',
        'is_primary',
        'is_active',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
    ];

    public static function getActiveAccounts()
    {
        return self::where('is_active', true)
            ->orderBy('is_primary', 'desc')
            ->get()
            ->map(function ($account) {
                return [
                    'bank_name' => $account->bank_name,
                    'account_number' => $account->account_number,
                    'account_name' => $account->account_name,
                ];
            });
    }
} 