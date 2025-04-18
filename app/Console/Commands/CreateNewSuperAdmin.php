<?php

namespace App\Console\Commands;

use App\Models\SuperAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateNewSuperAdmin extends Command
{
    protected $signature = 'superadmin:create {name=NewAdmin} {email=admin@example.com} {password=password123}';
    protected $description = 'Create a new SuperAdmin user';

    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');

        $admin = new SuperAdmin();
        $admin->name = $name;
        $admin->email = $email;
        $admin->password = Hash::make($password);
        $admin->save();
        
        $this->info("SuperAdmin created successfully!");
        $this->table(
            ['Name', 'Email', 'Password'],
            [[$name, $email, $password]]
        );
        
        return Command::SUCCESS;
    }
} 