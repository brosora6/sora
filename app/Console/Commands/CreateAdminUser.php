<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create {name=Administrator} {email=admin@example.org} {password=admin123}';
    protected $description = 'Create a new Admin user';

    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');

        // Check if admin already exists
        $exists = Admin::where('email', $email)->exists();
        
        if ($exists) {
            $this->info("Admin with email {$email} already exists.");
            
            if ($this->confirm("Do you want to update the password?")) {
                Admin::where('email', $email)->update([
                    'password' => Hash::make($password)
                ]);
                $this->info("Password has been updated.");
            }
            
            return Command::SUCCESS;
        }

        $admin = new Admin();
        $admin->name = $name;
        $admin->email = $email;
        $admin->password = Hash::make($password);
        $admin->save();
        
        $this->info("Admin user created successfully!");
        $this->table(
            ['Name', 'Email', 'Password'],
            [[$name, $email, $password]]
        );
        
        return Command::SUCCESS;
    }
} 