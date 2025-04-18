<?php

namespace App\Console\Commands;

use App\Models\SuperAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetSuperAdminPassword extends Command
{
    protected $signature = 'superadmin:reset-password';
    protected $description = 'Reset the SuperAdmin password';

    public function handle()
    {
        $admin = SuperAdmin::where('email', 'superadmin@example.com')->first();
        
        if (!$admin) {
            $this->info('Creating new SuperAdmin user...');
            $admin = new SuperAdmin();
            $admin->name = 'Super Admin';
            $admin->email = 'superadmin@example.com';
        } else {
            $this->info('SuperAdmin user already exists. Updating password...');
        }
        
        $admin->password = Hash::make('admin123');
        $admin->save();
        
        $this->info('SuperAdmin password has been reset to: admin123');
        return Command::SUCCESS;
    }
} 