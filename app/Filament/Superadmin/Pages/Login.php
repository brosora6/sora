<?php

namespace App\Filament\Superadmin\Pages;

use Filament\Pages\Auth\Login as BasePage;

class Login extends BasePage
{
    // Set the guard explicitly
    protected function getAuthGuard(): string|null
    {
        return 'superadmin';
    }
} 