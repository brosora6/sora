<?php

namespace App\Filament\Admin\Pages;

use Filament\Pages\Auth\Login as BasePage;

class Login extends BasePage
{
    public function getTitle(): string
    {
        return 'Login - Admin';
    }

    protected function getAuthGuard(): string
    {
        return 'admin';
    }
} 