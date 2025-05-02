<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SuperAdmin;
use App\Models\Admin;

// FOR EMERGENCY LOGIN: This route will log you in directly and bypass Filament's login form
Route::get('/auto-login', function () {
    // Use the test user we created
    $admin = SuperAdmin::where('email', 'admin@example.com')->first();
    
    if (!$admin) {
        // Fallback to the original admin
        $admin = SuperAdmin::where('email', 'superadmin@example.com')->first();
    }
    
    if (!$admin) {
        return 'No SuperAdmin found in the database!';
    }
    
    // Log in manually by setting the user in the session
    Auth::guard('superadmin')->login($admin);
    
    // If successful, redirect to superadmin dashboard 
    if (Auth::guard('superadmin')->check()) {
        return redirect('/superadmin');
    }
    
    return 'Failed to log in.';
});

// Emergency login for the Admin panel
Route::get('/auto-admin-login', function () {
    // Find an admin user
    $admin = Admin::first();
    
    if (!$admin) {
        return 'No Admin found in the database!';
    }
    
    // Log in manually
    Auth::guard('admin')->login($admin);
    
    // If successful, redirect to admin dashboard
    if (Auth::guard('admin')->check()) {
        return redirect('/admin');
    }
    
    return 'Failed to log in as Admin.';
});

// Test routes from previous debug efforts
Route::get('/test-superadmin-login', function (Request $request) {
    // Test credentials directly
    $email = 'superadmin@example.com';
    $password = 'admin123';
    
    $admin = SuperAdmin::where('email', $email)->first();
    
    if (!$admin) {
        return 'SuperAdmin not found!';
    }
    
    if (Auth::guard('superadmin')->attempt(['email' => $email, 'password' => $password])) {
        return 'Login successful!';
    } else {
        return 'Login failed! Hash check: ' . (password_verify($password, $admin->password) ? 'Pass' : 'Fail');
    }
});

Route::get('/debug-superadmin', function () {
    $output = [];
    
    // 1. Check if model exists
    try {
        $class = SuperAdmin::class;
        $output[] = "SuperAdmin model class: {$class}";
        
        $admin = new SuperAdmin();
        $output[] = "SuperAdmin model can be instantiated";
    } catch (\Throwable $e) {
        $output[] = "Error with SuperAdmin model: " . $e->getMessage();
        return implode("<br>", $output);
    }
    
    // 2. Check table exists and has records
    try {
        $count = SuperAdmin::count();
        $output[] = "SuperAdmin count: {$count}";
        
        $firstAdmin = SuperAdmin::first();
        if ($firstAdmin) {
            $output[] = "First SuperAdmin: ID={$firstAdmin->id}, Name={$firstAdmin->name}, Email={$firstAdmin->email}";
        } else {
            $output[] = "No SuperAdmin records found";
        }
    } catch (\Throwable $e) {
        $output[] = "Error checking SuperAdmin table: " . $e->getMessage();
    }
    
    // 3. Check auth configuration
    $output[] = "Auth guards: " . implode(", ", array_keys(config('auth.guards')));
    $output[] = "Auth providers: " . implode(", ", array_keys(config('auth.providers')));
    
    if (isset(config('auth.guards')['superadmin'])) {
        $guard = config('auth.guards')['superadmin'];
        $output[] = "SuperAdmin guard: driver={$guard['driver']}, provider={$guard['provider']}";
    } else {
        $output[] = "SuperAdmin guard not found";
    }
    
    if (isset(config('auth.providers')['superadmins'])) {
        $provider = config('auth.providers')['superadmins'];
        $output[] = "SuperAdmin provider: driver={$provider['driver']}, model={$provider['model']}";
    } else {
        $output[] = "SuperAdmin provider not found";
    }
    
    // 4. Check Filament configuration
    if (function_exists('filament')) {
        $output[] = "Filament is available";
        
        try {
            $panels = array_keys(config('filament.auth.panels', []));
            $output[] = "Filament panels: " . implode(", ", $panels);
            
            if (isset(config('filament.auth.panels')['superadmin'])) {
                $panel = config('filament.auth.panels')['superadmin'];
                $output[] = "SuperAdmin panel: guard={$panel['guard']}, model={$panel['model']}";
            } else {
                $output[] = "SuperAdmin panel not found in Filament config";
            }
        } catch (\Throwable $e) {
            $output[] = "Error checking Filament config: " . $e->getMessage();
        }
    } else {
        $output[] = "Filament not available";
    }
    
    // 5. Test authentication
    $email = 'superadmin@example.com';
    $password = 'admin123';
    
    $admin = SuperAdmin::where('email', $email)->first();
    if ($admin) {
        $output[] = "Found SuperAdmin with email {$email}";
        $passVerifies = password_verify($password, $admin->password);
        $output[] = "Password verification: " . ($passVerifies ? "PASS" : "FAIL");
        
        // Try authenticating
        $credentials = ['email' => $email, 'password' => $password];
        if (Auth::guard('superadmin')->attempt($credentials)) {
            $output[] = "Authentication successful";
            $user = Auth::guard('superadmin')->user();
            $output[] = "Authenticated user: " . $user->name;
        } else {
            $output[] = "Authentication failed";
        }
    } else {
        $output[] = "No SuperAdmin found with email {$email}";
    }
    
    return implode("<br>", $output);
});

// Add a direct login route
Route::get('/direct-superadmin-login', function () {
    // Login as the superadmin directly
    $email = 'admin@example.com'; // Use the new admin we created
    $password = 'password123';
    
    if (Auth::guard('superadmin')->attempt(['email' => $email, 'password' => $password])) {
        // Redirect to superadmin dashboard
        return redirect('/superadmin');
    }
    
    return "Login failed! Please check credentials.";
});

// SIMPLE LOGIN FORM
Route::get('/simple-login', function () {
    return view('simple-login');
});

// Handle the simple login form submission
Route::post('/simple-login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);
    
    if (Auth::guard('superadmin')->attempt($credentials)) {
        return redirect('/superadmin');
    }
    
    return back()->withErrors([
        'email' => 'These credentials do not match our records.',
    ]);
}); 