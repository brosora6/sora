<?php

namespace App\Filament\Superadmin\Pages;

use Filament\Pages\Auth\Login as BasePage;

class Login extends BasePage
{
    public function getTitle(): string
    {
        return 'Login - Superadmin';
    }

    protected function getAuthGuard(): string
    {
        return 'superadmin';
    }
} 