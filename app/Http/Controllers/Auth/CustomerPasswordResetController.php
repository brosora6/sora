<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class CustomerPasswordResetController extends Controller
{
    /**
     * Get the broker to be used during password reset.
     */
    protected function broker()
    {
        return Password::broker('customers');
    }

    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/customer/forgot-password', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Log the attempt
        \Log::info('Password reset requested for email: ' . $request->email);

        // Check if the user exists in the database
        $user = \App\Models\Pelanggan::where('email', $request->email)->first();
        
        if (!$user) {
            \Log::info('User not found for email: ' . $request->email);
            return back()->withInput($request->only('email'))
                ->withErrors(['email' => __('We could not find a user with that email address.')]);
        }

        \Log::info('User found, attempting to send reset link to: ' . $request->email);

        try {
            // Send the reset link
            $status = $this->broker()->sendResetLink(
                $request->only('email')
            );

            \Log::info('Reset link attempt status: ' . $status);

            if ($status === Password::RESET_LINK_SENT) {
                \Log::info('Reset link sent successfully to: ' . $request->email);
                return back()->with('status', __('Password reset link has been sent to your email.'));
            }

            // For other errors
            \Log::error('Error sending reset link: ' . $status);
            return back()->withInput($request->only('email'))
                ->withErrors(['email' => __($status)]);
        } catch (\Exception $e) {
            \Log::error('Exception while sending reset link: ' . $e->getMessage());
            return back()->withInput($request->only('email'))
                ->withErrors(['email' => 'An error occurred while sending the reset link. Please try again.']);
        }
    }

    /**
     * Display the password reset view.
     */
    public function reset(Request $request): Response
    {
        return Inertia::render('auth/customer/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Handle an incoming new password request.
     */
    public function update(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = $this->broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => bcrypt($request->password),
                ])->save();
            }
        );

        return $status == Password::PASSWORD_RESET
            ? redirect()->route('customer.login')->with('status', __($status))
            : back()->withInput($request->only('email'))
                   ->withErrors(['email' => __($status)]);
    }
} 