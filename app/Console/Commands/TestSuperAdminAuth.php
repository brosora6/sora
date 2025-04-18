<?php

namespace App\Console\Commands;

use App\Models\SuperAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class TestSuperAdminAuth extends Command
{
    protected $signature = 'superadmin:test-auth';
    protected $description = 'Test SuperAdmin authentication';

    public function handle()
    {
        // First, check if SuperAdmin model exists and can be instantiated
        try {
            $model = new SuperAdmin();
            $this->info('SuperAdmin model exists and can be instantiated.');
        } catch (\Exception $e) {
            $this->error('Error instantiating SuperAdmin model: ' . $e->getMessage());
            return Command::FAILURE;
        }
        
        // Check if SuperAdmin exists in database
        $email = 'superadmin@example.com';
        $password = 'admin123';
        
        $admin = SuperAdmin::where('email', $email)->first();
        
        if (!$admin) {
            $this->error("No SuperAdmin found with email: {$email}");
            return Command::FAILURE;
        }
        
        $this->info("Found SuperAdmin: {$admin->name} (ID: {$admin->id})");
        
        // Test password verification
        if (Hash::check($password, $admin->password)) {
            $this->info("Password verification successful for: {$email}");
        } else {
            $this->error("Password verification failed for: {$email}");
            
            // Reset password
            $admin->password = Hash::make($password);
            $admin->save();
            $this->info("Password has been reset to: {$password}");
        }
        
        // Test auth guard
        try {
            $guardExists = array_key_exists('superadmin', config('auth.guards'));
            $this->info("Guard 'superadmin' exists in config: " . ($guardExists ? 'Yes' : 'No'));
            
            if ($guardExists) {
                $this->info("Guard provider: " . config('auth.guards.superadmin.provider'));
                
                $providerExists = array_key_exists(config('auth.guards.superadmin.provider'), config('auth.providers'));
                $this->info("Provider exists: " . ($providerExists ? 'Yes' : 'No'));
                
                if ($providerExists) {
                    $providerModel = config('auth.providers.' . config('auth.guards.superadmin.provider') . '.model');
                    $this->info("Provider model: " . $providerModel);
                }
            }
        } catch (\Exception $e) {
            $this->error('Error checking auth configuration: ' . $e->getMessage());
        }
        
        return Command::SUCCESS;
    }
} 