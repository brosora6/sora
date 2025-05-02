<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = Auth::guard('customer')->user();
        $user->load(['carts.menu', 'reservations', 'payments']);
        
        // Add full URL for profile photo
        if ($user->profile_photo) {
            $user->profile_photo_url = Storage::disk('public')->url($user->profile_photo);
        }
        
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            // Debug incoming request data
            \Log::info('Raw Request Data:', [
                'all' => $request->all(),
                'no_telepon' => $request->input('no_telepon'),
                'has_no_telepon' => $request->has('no_telepon'),
            ]);

            $validated = $request->validated();
            
            // Debug validated data
            \Log::info('Validated Data:', $validated);
            
            $user = Auth::guard('customer')->user();
            
            // Handle profile photo
            if ($request->hasFile('profile_photo')) {
                // Delete old photo if exists
                if ($user->profile_photo) {
                    Storage::disk('public')->delete($user->profile_photo);
                }
                
                // Store new photo in profile-photos directory
                $path = $request->file('profile_photo')->store('profile-photos', 'public');
                $user->profile_photo = $path;
            } elseif ($request->boolean('remove_photo')) {
                // Handle photo removal
                if ($user->profile_photo) {
                    Storage::disk('public')->delete($user->profile_photo);
                    $user->profile_photo = null;
                }
            }
            
            // Update other fields
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->no_telepon = $validated['no_telepon'];
            
            // Debug user data before save
            \Log::info('User Data Before Save:', $user->toArray());
            
            // Reset email verification if email changed
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
        }

            $user->save();

            // Debug final user data
            \Log::info('User Data After Save:', $user->fresh()->toArray());

            return Redirect::route('profile.edit')->with('status', 'Profile updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Profile Update Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Redirect::route('profile.edit')
                ->with('error', 'Failed to update profile: ' . $e->getMessage());
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = Auth::guard('customer')->user();

        // Delete profile photo if exists
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        Auth::guard('customer')->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('customer.login');
    }
}
