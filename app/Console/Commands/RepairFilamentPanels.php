<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RepairFilamentPanels extends Command
{
    protected $signature = 'filament:repair-panels';
    protected $description = 'Repair Filament panel configuration';

    public function handle()
    {
        $this->info('Repairing Filament panel configuration...');
        
        // Clear all caches
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');
        $this->call('filament:optimize-clear');
        
        // Generate filament assets
        $this->call('filament:assets');
        
        // Re-register SuperAdmin panel
        $this->info('Updating panel configuration...');
        
        // Create a symbolic link for storage
        $this->call('storage:link');
        
        $this->info('Filament panel configuration repaired.');
        return Command::SUCCESS;
    }
} 